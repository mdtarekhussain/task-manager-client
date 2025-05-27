import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAxios from "../../Hook/useAxios";
import useAuth from "../../Hook/useAuth";
import { FaEdit } from "react-icons/fa"; // Edit icon
import { MdDelete } from "react-icons/md"; // Delete icon

const Home = () => {
  const [taskText, setTaskText] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState("");
  const axiosLocal = useAxios();
  const { user, signOutUser } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks", user?.email],
    queryFn: async () => {
      const res = await axiosLocal.get(`/task`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleAdd = async () => {
    if (!taskText.trim()) return;

    const newTask = {
      text: taskText,
      email: user?.email,
      name: user?.displayName,
      photo: user?.photoURL,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axiosLocal.post("/task", newTask);
      if (res.data.insertedId) {
        setTaskText("");
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      }
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const handleUpdate = async (taskId) => {
    if (!editText.trim()) return;

    try {
      await axiosLocal.put(`/task/${taskId}`, { text: editText });
      setEditTaskId(null);
      setEditText("");
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.email] });
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axiosLocal.delete(`/task/${taskId}`);
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.email] });
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  if (isLoading) return <p>Loading..</p>;
  if (error) return <p>Loading error</p>;

  const sortedTasks = [...tasks].reverse();

  return (
    <div
      className="min-h-screen max-w-xl mx-auto lg:mt-10 p-6 px-10"
      style={{
        backgroundImage: "url('https://i.ibb.co.com/b5m3D6Mz/kaka.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">
          Messenger Style Tasks
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Write a message..."
          className="border px-2 py-1 w-full mr-2 text-white"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Send
        </button>
      </div>

      <ul className="flex flex-col gap-2">
        {sortedTasks.map((task) => (
          <li
            key={task._id}
            className="bg-gray-100 p-3 rounded shadow text-sm flex items-start gap-3"
          >
            {/* If no photo, display the first letter of the user's name */}
            <div className=" bg-blue-500 text-white rounded-full flex justify-center items-center mt-2">
              {task.photo ? (
                <img
                  src={task.photo}
                  alt="profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <span className="text-xl">
                  {task.name ? task.name.charAt(0) : "?"}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <strong>{task.name}</strong>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditTaskId(task._id);
                      setEditText(task.text);
                    }}
                  >
                    <FaEdit className="text-[18px]" />
                  </button>
                  <button onClick={() => handleDelete(task._id)}>
                    <MdDelete className="text-[18px]" />
                  </button>
                </div>
              </div>

              {editTaskId === task._id ? (
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border px-2 py-1 w-full"
                  />
                  <button
                    onClick={() => handleUpdate(task._id)}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditTaskId(null)}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-[18px] mt-1">: {task.text}</p>
                  <small className="text-gray-400 block text-right mt-1">
                    {new Date(task.createdAt).toLocaleTimeString()}
                  </small>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
