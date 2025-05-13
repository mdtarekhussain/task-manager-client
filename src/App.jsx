import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import useAuth from "./Hook/useAuth";
import Home from "./Page/Home/Home";
import Login from "./Page/Logen/Login";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
