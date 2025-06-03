import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAxios from "../../Hook/useAxios";
import useAuth from "../../Hook/useAuth";
import { FaEdit } from "react-icons/fa"; // Edit icon
import { MdDelete } from "react-icons/md"; // Delete icon
import { LogOut, MessageCircle, Send, User } from "lucide-react";

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
  const Avatar = ({ photo, name }) => {
    return photo ? (
      <img
        src={photo}
        referrerPolicy="no-referrer"
        alt={name ? name.charAt(0) : "?"}
        className="lg:w-12 lg:h-12 w-8 h-8 rounded-full  mt-4 lg:lg:ml-3 "
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-purple-600 mt-3 lg:ml-3 text-white flex items-center justify-center font-bold text-lg ">
        {name ? name.charAt(0) : "?"}
      </div>
    );
  };

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tasks", user?.email],
    queryFn: async () => {
      const res = await axiosLocal.get("/task");
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
      refetch();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  if (isLoading) return <p>Loading..</p>;
  if (error) return <p>Loading error</p>;

  const sortedTasks = [...tasks].reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 sm:p-[10px]">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-xl border-b mb-5 rounded-[5px] ">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-white" />
            <h1 className=" lg:text-2xl text-[20px] font-bold text-white">
              Task Manger
            </h1>
          </div>
          <button
            onClick={handleLogout}
            variant="destructive"
            className="bg-white/80 rounded-[15px] px-4 lg:py-3 py-1 text-[20px] items-center flex hover:bg-purple-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            <LogOut className="w-4 h-4 mr-2" />
            LogOut
          </button>
        </div>
      </div>

      {/* Sticky Task Input Box */}

      <div className="sticky top-[10px]  bg-white/30 backdrop-blur-sm shadow-xl border-0 rounded-3xl lg:max-w-4xl mx-2 lg:mx-auto lg:p-6 p-3  z-40">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Write a message..."
            className="flex-1 lg:text-lg px-4 border-2 border-purple-200 focus:border-purple-400 rounded-2xl transition-all duration-300 bg-white/30 backdrop-blur-sm shadow-inner"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="bg-gradient-to-r flex items-center from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 
            lg:px-4 px-3 py-1 lg:py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Send className="w-5 h-4 mr-2" />
            Send
          </button>
        </div>
      </div>

      <ul className="space-y-6 px-4 mt-8">
        {sortedTasks.map(
          (task, index) => (
            console.log("task.photo:", task.photo),
            console.log("task.name:", task.name),
            (
              <li
                key={task._id}
                className={`p-3 shadow-lg rounded-3xl   ${
                  index % 2 === 0
                    ? "bg-gradient-to-r from-white to-blue-50 ml-0 mr-8"
                    : "bg-gradient-to-l from-white to-green-50 ml-8 mr-0"
                }`}
              >
                <div className="flex items-start lg:gap-5  gap-2">
                  <Avatar photo={task.photo} name={task.name} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-800 lg:text-xl text-[14px]">
                        {task.name || ""}
                      </h3>
                      <div className="flex items-center lg:gap-3 gap-1">
                        <span className="text-sm text-gray-500 lg:bg-gray-100 lg:px-3 py-1 rounded-full">
                          {new Date(task.createdAt).toLocaleTimeString()}
                        </span>
                        <div className="flex lg:gap-2">
                          <button
                            onClick={() => {
                              setEditTaskId(task._id);
                              setEditText(task.text);
                            }}
                            className="lg:h-9 lg:w-9 p-0 hover:bg-blue-100 rounded-full transition-all duration-200"
                          >
                            <FaEdit className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="lg:h-9 lg:w-9 p-0 hover:bg-red-100 rounded-full transition-all duration-200"
                          >
                            <MdDelete className="w-5 h-5 text-gray-400 hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {editTaskId === task._id ? (
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="border border-blue-300 px-3  rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <button
                          onClick={() => handleUpdate(task._id)}
                          className="bg-green-600 text-white lg:px-4 px-2 lg:py-2 py-1 rounded-md hover:bg-green-700 transition"
                        >
                          Upd
                        </button>
                        <button
                          onClick={() => setEditTaskId(null)}
                          className="bg-gray-500 text-white lg:px-4 px-2 lg:py-2 py-1 rounded-md hover:bg-gray-600 transition"
                        >
                          Bake
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`lg:p-4 p-2 rounded-2xl mt-1 text-gray-800 lg:text-lg leading-relaxed font-medium ${
                          index % 2 === 0
                            ? "bg-gradient-to-r from-blue-100 to-blue-50"
                            : "bg-gradient-to-r from-green-100 to-green-50"
                        }`}
                      >
                        <p>📝{task.text}</p>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            )
          )
        )}

        {/* Empty State */}
        {sortedTasks.length === 0 && (
          <div className="text-center py-16">
            <div className="text-blue-300 mb-6">
              <MessageCircle className="w-20 h-20 mx-auto mb-6 opacity-60" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">
              কোন টাস্ক নেই
            </h3>
            <p className="text-gray-500 text-lg">
              আপনার প্রথম টাস্ক যোগ করুন এবং শুরু করুন!
            </p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default Home;
