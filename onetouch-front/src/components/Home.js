import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../axios";
import { Grid, Stack } from '@mui/material';
import Table from "./Table";
import Modal from './Modal'
import handleNames from "../utils/utils";
import { useUserContext } from "../UserContext";
import Dashboard from "./Dashboard";


const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [id, setId] = useState("");
  const [expected_date, setExpectedDate] = useState("");
  const [userId, setUserId] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [isEdit, setIsEdit] = useState(false)
  const [isOpenModal, setIsopenModal] = useState(false);
  const [TaskToComplete,setTaskToComplete] = useState('');
  const updateData = () => {
    setRefetch(!refetch)
  }

  const { data, setData } = useUserContext();

  const navigate = useNavigate();

  const resetData = () => {
    setExpectedDate('')
    setUserId('')
    setTitle('')
    setDescription(null)
    setTasks('')
  }


  useEffect(() => {
    api.get("/mytasks").then((response) => {
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

  async function completeTask(id) {
      try {
        await api.put("/tasks/" + id);
        updateData()
      } catch (error) {
        console.log(error)
      }
  }

  return (
    <>
      {data.user_id && data.roleId === 2 ? (
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
                    <button type="button" onClick={() => {setTaskToComplete(value?.id)
                       setIsopenModal(true)}} className=" my-2 px-1 py-2 text-sm text-white bg-green-400 rounded-md hover:bg-red-500 transition-all">Concluir</button>
                  </div>
                }
              }
            ]}
            data={handleNames(users, tasks)}
            onRowClick={() => { }}
          />
          <Modal isOpenModal={isOpenModal}
            onCancel={() => setIsopenModal(false)}
            onSubmit={() => {
              completeTask(TaskToComplete)
              setIsopenModal(false)
            }} ></Modal>

        </div>

      ) : (
        <Dashboard></Dashboard>
      )}



    </>
  );
};

export default Home;
