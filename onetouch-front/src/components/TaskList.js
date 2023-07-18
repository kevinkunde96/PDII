import React, { useEffect, useState } from "react";
import { api } from "../axios";
import TaskCard from "./TaskCard";
import "./TaskList.css";
export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [refetch, setRefetch]= useState(false);
  const updateData = ()=>{
    setRefetch(!refetch)
  }

  useEffect(() => {
    handleGet()
  }, []);

  const handleGet = async() =>{
   await api.get("/tasks").then((response) => {
      const data = response.data;
      setTasks(data);
    });
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard updateData={updateData} key={task.id} title={task.title} description={task.description} expected_date={task.expected_date} userId = {task.userId} />
      ))}
    </div>
  );
}
