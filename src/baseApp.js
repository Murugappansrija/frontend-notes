import React, { useContext, useState } from "react";
import "boxicons";
import { Avatar } from "@mui/material";
import { AppContext } from "./Context/AppProvider";
import LogoutIcon from "@mui/icons-material/Logout";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { useNavigate } from "react-router-dom";

export default function BaseApp({ children }) {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="baseContainer">
      <div className="topBar">
        <div className="topBar-baseStyle menu" onClick={toggle}>
          <div className="menu-hover">
            <i className="bx bx-menu bx-sm" style={{ color: "black" }}></i>
          </div>
        </div>
        <div className="topBar-baseStyle logo">
          <i
            className="bx bxs-book-open bx-lg"
            style={{ color: "green" }}
          ></i>
          <span className="logo-name">
            <span className="logoFirstLetter">N</span>
            otes
          </span>
        </div>

        <div className="topBar-baseStyle profile">
          <Avatar sx={{ bgcolor: "#b26500" }}>
            {user && user.name?.charAt(0)}
          </Avatar>
        </div>
      </div>
      <div className="sideBarContainer">
        <div
          className="sideBar"
          id="top-bar"
          style={{ width: isOpen ? "300px" : "80px" }}
        >
          <div
            tabIndex="1"
            onClick={() => navigate("/home")}
            className="sideBarLink"
          >
            <NoteAltIcon color="#5f6368" />
            <span style={{ display: isOpen ? "inline" : "none" }}>Notes</span>
          </div>
          <div
            tabIndex="1"
            className="sideBarLink"
            onClick={() => navigate("/login")}
          >
            <LogoutIcon color="#5f6368" />
            <span style={{ display: isOpen ? "inline" : "none" }}>
              Logout
            </span>
          </div>
        </div>
        <div className="mainContainer">{children}</div>
      </div>
    </div>
  );
}