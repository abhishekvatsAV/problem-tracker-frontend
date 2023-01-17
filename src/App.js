import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  let user = localStorage.getItem("user");
  user = JSON.parse(user);
  console.log("user : ", user);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/signup"
            element={
              !user ? (
                <>
                  <Navbar />
                  <Signup />
                </>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/login"
            element={
              !user ? (
                <>
                  <Navbar />
                  <Login />
                </>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/home"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                <>
                  <Navbar />
                  <Dashboard />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/problems"
            element={
              user ? (
                <>
                  <Navbar />
                  <Problems />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
