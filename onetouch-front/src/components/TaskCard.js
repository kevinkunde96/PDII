import Moment from "moment";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../axios";
import { useUserContext } from "../UserContext";
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';

import "./TaskCard.css";


export default function TaskCard(props) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  const { data } = useUserContext();

  async function completeTask() {
    console.log(props);
    try {
      await api.put("/tasks/" + props.id);
      props.updateData();
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteTask() {
    try {
      await api.delete("/tasks/" + props.id);
      props.updateData();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
    <div className="task-card gradientlight">
      <p className="task-card-text">
        <b>Título:</b> {props?.title}
      </p>
      <p className="task-card-text">
        <b>Descrição:</b> {props?.description}
      </p>
      <p className="task-card-text">
        <b>Data para conclusão:</b>{" "}
        {Moment(props?.expected_date).format("DD/MM/YYYY")}
      </p>
      <p className="task-card-text">
        <b>Usuário responsável:</b> {props?.userId}
      </p>
      <p className="task-card-text">
        <b>Concluída:</b> {props.solved ?'SIM' : 'NÃO'}
      </p>
      <p>
        {!props.solved && 
        <button
          className="task-card-button-complete"
          onClick={() => completeTask()}
        >
          Concluir{" "}
        </button>
        }
        {data.roleId === 1 && (
          <button
            className="task-card-button-delete"
            onClick={() => deleteTask()}
          >
            Apagar
          </button>
        )}
      </p>
      {!props.solved && <AssignmentLateIcon/>}
    </div>
    </>
  );
}
