const express = require("express");
const UserController = require("./controllers/UserController");
const TaskController = require("./controllers/TaskController");
const login = require("./middlewares/login");

const router = express.Router();

router
  .get("/tasks", login, TaskController.index)
  .get("/mytasks", login, TaskController.getTaskByUser)
  .get("/alltasks", login, TaskController.getDashboardAllTasks)
  .get("/taskscount", login, TaskController.getDashboardCountTasks)
  .get("/taskscountglobal", login, TaskController.getDashboardCountGlobalByMonth)
  .get("/mytasksMonth", login, TaskController.getTaskByMonth)
  .get("/mytasksWeek", login, TaskController.getTaskByWeek)
  .delete("/tasks/:id", TaskController.deleteTask)
  .put("/tasks/:id", TaskController.completeTask)
  .post("/tasks", TaskController.add)



router
  .get("/users", UserController.index)
  .get("/roles", UserController.roles)
  .delete("/users/:id", UserController.deleteUser)
  .post("/users", UserController.add)
  .post("/users/edit", UserController.update)
  .post("/tasks/edit", TaskController.update)
  .post("/login", UserController.login);



module.exports = router;