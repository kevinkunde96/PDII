import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../UserContext";

import "./Header.css";

export default function Header() {
  const navigate = useNavigate();

  const { data, setData } = useUserContext();

  return (
    <div className="header">
      <div className="header-title">
        <p>OneTouch - Metas</p>
      </div>
      <div className="header-links">
        {data.user_id && <Link to="/home">Home</Link>}

        {!data.user_id && <Link to="/">Login</Link>}

        {data.user_id && data.roleId === 1 && <Link to="/tasks">Metas</Link>}

        {data.user_id && data.roleId === 1 && <Link to="/users">Usuários</Link>}

        {data.user_id && (
          <a
            href="/"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("auth");
              setData({});
            }}
          >
            Sair
          </a>
        )}
      </div>
    </div>
  );
}
