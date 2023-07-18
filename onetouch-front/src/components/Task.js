import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../axios";
import Table from './Table'
import Modal from './Modal'
import "./Task.css";
import handleNames from "../utils/utils";

export default function Task() {
  const [id, setId] = useState("");
  const [expected_date, setExpectedDate] = useState("");
  const [userId, setUserId] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [refetch, setRefetch] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isOpenModal, setIsopenModal] = useState(false);
  const [TaskToDelete,setTaskToDelete] = useState('');

  const navigate = useNavigate();

  const resetData = () => {
    setExpectedDate('')
    setUserId('')
    setTitle('')
    setDescription(null)
    setTasks('')
  }

  const updateData = () => {
    setRefetch(!refetch)
  }
  

  useEffect(() => {
    api.get("/tasks").then((response) => {
      const data = response.data;

      setTasks(data);
    });
  }, [refetch]);

  useEffect(() => {
    api.get("/users").then((response) => {
      const data = response.data;

      setUsers(data);
    });
  }, [refetch]);


  async function makeTask(e) {
    e.preventDefault();
    if (isEdit) {
      // apipost edit
      await api.post("/tasks/edit", {id, title, description, expected_date, userId });
      resetData()
      setIsEdit(false)
    } else {
      await api.post("/tasks", { title, description, expected_date, userId });
      resetData()
    }
    await api.get("/tasks").then((response) => {
      const data = response.data;

      setUsers(data);
    });

    updateData()

  }

    async function deleteTask(id) {
        try {
          await api.delete("/tasks/" + id);
          updateData()
        } catch (error) {
          console.log(error)
        }
    }

    return (
      <>
        <form onSubmit={makeTask} autoComplete="off">
          {" "}
          <div className="task">
            <h1>Tarefa</h1>
            <p>Tarefas desejadas para a equipe!</p>
            <p>{isEdit ? `Edição da tarefa` : "Nova tarefa sendo cadastrada"}</p>
            <input
              value={title}
              type="text"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="Título da tarefa"
            />

            <input
              value={description}
              type="text"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              placeholder="Descrição da tarefa"
            />

            <input
              value={expected_date}
              type="date"
              onChange={(e) => {
                setExpectedDate(e.target.value);
              }}
              placeholder="Data para concluir a tarefa"
            />

            <select onChange={(e) => setUserId(e.target.value)}>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>

              ))}
            </select>

            {/* <button onClick={makeTask}>Criar a Tarefa</button> */}

            <div className="flex gap-3 justify-center">
              {isEdit && <button type="submit" className="!bg-slate-400" onClick={() => {
                resetData()
                setIsEdit(false)
              }}>Cancelar</button>}

              <button type="submit" onClick={() => {
              }}>{isEdit ? 'Salvar' : 'Cadastrar Tarefa'}</button>
            </div>
          </div>
          <div className="mx-auto mt-6 mb-6">
            <Table
              columns={[
                { key: 'id', title: "ID" },
                { key: 'title', title: "Título" },
                { key: 'description', title: 'Descrição' },
                { key: 'userName', title: 'Responsável' },
                { key: 'expected_date_format', title: 'Data final' },
                { key: 'name', title: 'Gerente' },
                {
                  key: '', title: "Ações", renderValue(value) {
                    return <div className="flex gap-2">
                      <button type="button" onClick={() => {
                        setIsEdit(true)
                        setId(value.id)
                        setExpectedDate(value.expected_date)
                        setTitle(value.title)
                        setDescription(value.description)
                        setUserId(value.userId)

                      }} className=" my-2 px-1 py-2 text-sm text-white bg-yellow-400 rounded-md hover:bg-yellow-500 transition-all">Editar</button>
                      <button type="button" onClick={() => {setTaskToDelete(value?.id)
                       setIsopenModal(true)}} className=" my-2 px-1 py-2 text-sm text-white bg-red-400 rounded-md hover:bg-red-500 transition-all">Apagar</button>
                    </div>
                  }
                }
              ]}
              // userData={users}
              data={handleNames(users, tasks)}
              onRowClick={() => { }}
            />
              <Modal isOpenModal={isOpenModal}
        onCancel={()=>setIsopenModal(false)}
        onSubmit={()=>{deleteTask(TaskToDelete) 
        setIsopenModal(false)
        }} ></Modal>
          </div>
        </form>
      </>
    );
  }