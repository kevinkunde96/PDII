import React from "react";
import { api } from "../axios";
import "./UserCard.css";
export default function UserCard(props) {

  async function deleteUser() {
    console.log(props);
  try {
    await api.delete("/users/" + props.id);
    props.updateData()
  } catch (error) {
    console.log(error)
  }
 
    }
  return (
    <div className="user-card">
      <p className="user-card-role">
        <b>Código:</b> {props.id}
      </p>
      <p className="user-card-role">
        <b>Usuário:</b> {props.name}
      </p>
      <p className="user-card-role">
        <b>Email:</b> {props.email}
      </p>
      <p className="user-card-role">
        <b>Cargo:</b>
        {props.roles?.filter?.((e) => {
          return e.id === props.roleId;
        })?.[0]?.description}
      </p>
      {/* <p className="user-card-role">
        <b>Supervisor:</b>
        {props.users.filter((e) => {
          return e.managerId === props.id;
        })[0].name}
      </p> */}
      <button className="user-card-button-delete" onClick={deleteUser} >Apagar</button>
    </div>
  );
}
