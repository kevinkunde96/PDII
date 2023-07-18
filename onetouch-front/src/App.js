import "./App.css";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";
import Login from "./components/Login";
import Home from "./components/Home";
import User from "./components/User";
import Task from "./components/Task";
import Sidenav from "./components/Sidenav";
import Dashboard from "./components/Dashboard";
import { Container, Box } from "@mui/material";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        {/* <Header /> */}
          <Sidenav>
            <Box>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="home" element={<Home />} />
                <Route path="users" element={<User />} />
                <Route path="tasks" element={<Task />} />
                <Route path="dashboard" element={<Dashboard />} />
              </Routes>
            </Box>
          </Sidenav>
      </BrowserRouter>
    </UserProvider>

  );
}

export default App;
