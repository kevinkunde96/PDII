import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../axios";
import "./User.css";
import Table from './Table'
import Modal from './Modal'
import { Dialog } from '@headlessui/react'


export default function User() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(1);
  const [managerId, setManagerId] = useState(1);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [refetch, setRefetch] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isOpenModal, setIsopenModal] = useState(false);
  const [userToDelete,setUserToDelete] = useState('');
  const navigate = useNavigate();

  const resetData = () => {
    setId('')
    setName('')
    setEmail('')
    setPassword(null)
    setRoleId('')
    setManagerId('')
  }

  const updateData = () => {
    setRefetch(!refetch)
  }
  useEffect(() => {
    api.get("/roles").then((response) => {
      const data = response.data;

      setRoles(data);
    });
  }, []);

  useEffect(() => {
    api.get("/users").then((response) => {
      const data = response.data;

      setUsers(data);
    });
  }, [refetch]);


  async function makeUser(e) {
    e.preventDefault();

    if (isEdit) {
      // apipost edit
      await api.post("/users/edit", { id, name, email, password, roleId, managerId });
      resetData()
      setIsEdit(false)

    } else {
      await api.post("/users", { name, email, password, roleId, managerId });
      resetData()
    }
    await api.get("/users").then((response) => {
      const data = response.data;

      setUsers(data);
    });
  }

  async function deleteUser(id) {
      try {
        await api.delete("/users/" + id);
        updateData()
      } catch (error) {
        console.log(error)
      }
  }

  return (
    <>
      <form onSubmit={makeUser} autoComplete="off">
        {" "}
        <div className="user">
          <h1>Usuário</h1>
          <p>{isEdit ? `Edição de ${name}` : "Novo usuário sendo cadastrado"}</p>

          <input
            value={name}
            type="text"
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Nome"
          />

          <input
            value={email}
            type="email"
            autoComplete="false"
            required

            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
          />

          {!isEdit && <input
            value={password}
            required
            autoComplete="false"

            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Senha"
          />}

          <select required value={roleId} onChange={(e) => setRoleId(e.target.value)}>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.description}
              </option>
            ))}
          </select>

          <select required value={managerId} onChange={(e) => setManagerId(e.target.value)}>
            <option value={``}>
              Selecione um responsável
            </option>
            {users.map((user) => {
              if (user.roleId == 1) {
                return (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                );
              }
            })}
          </select>
          <div className="flex gap-3 justify-center">
            {isEdit && <button type="submit" className="!bg-slate-400" onClick={() => {
              resetData()
              setIsEdit(false)
            }}>Cancelar</button>}

            <button type="submit">{isEdit ? 'Salvar' : 'Criar Usuário'}</button>
          </div>
        </div>
        <div className="max-w-3xl mx-auto mt-6 mb-6">
          <Table
            columns={[
              { key: 'id', title: "ID" },
              { key: 'name', title: "Nome" },
              { key: 'email', title: 'E-mail' },
              { key: 'role.description', title: 'Cargo' },
              { key: 'manager.name', title: 'Gerente' },
              {
                key: '', title: "Ações", renderValue(value) {
                  return <div className="flex gap-2">
                    <button type="button" onClick={() => {
                      setIsEdit(true)
                      setId(value.id)
                      setName(value.name)
                      setEmail(value.email)
                      setRoleId(value.roleId)
                      setManagerId(value.managerId)
                      setPassword(null)

                    }} className=" my-2 px-1 py-2 text-sm text-white bg-yellow-400 rounded-md hover:bg-yellow-500 transition-all">Editar</button>
                    <button type="button" onClick={() => {setUserToDelete(value?.id)
                       setIsopenModal(true)}} className=" my-2 px-1 py-2 text-sm text-white bg-red-400 rounded-md hover:bg-red-500 transition-all">Apagar</button>
                    {/* <button type="button" onClick={() => setIsopenModal(true)} className=" my-2 px-1 py-2 text-sm text-white bg-red-400 rounded-md hover:bg-red-500 transition-all">Apagar</button> */}
                  </div>
                }
              }
            ]}
            data={users}
            onRowClick={() => { }}
          />
        </div>
      </form>
      <Modal isOpenModal={isOpenModal}
        onCancel={()=>setIsopenModal(false)}
        onSubmit={()=>{deleteUser(userToDelete) 
        setIsopenModal(false)
        }} ></Modal>
    </>
  );
}
