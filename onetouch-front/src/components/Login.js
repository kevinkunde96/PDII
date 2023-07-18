import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../axios";
import { useUserContext } from "../UserContext";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data, setData } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (data.token) {
      navigate("/home");
    }
  }, [data]);

  function makeLogin() {
    api.post("/login", { email, password }).then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("auth", JSON.stringify(response.data));
      setData(response.data);

      navigate(response.data.roleId === 2 ? "/home" : "/dashboard");
    });
  }
  return (
    <div className="login">
      <h1>Login do Usuário</h1>
      <p>Faça login para organizar as metas!</p>

      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="E-mail do Usuário"
      />
      <input
        value={password}
        type="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder="Senha de acesso"
      />
      <button onClick={makeLogin}>Entrar</button>
    </div>
  );
}
