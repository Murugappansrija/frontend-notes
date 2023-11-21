import React, { useEffect, useState } from "react";
import BaseApp from "../baseApp";
import { AppState } from "../Context/AppProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const colors = [
  {
    value: "#fff",
    label: "Default",
  },
  {
    value: "#faafa8",
    label: "Coral",
  },
  {
    value: "#fff8b8",
    label: "Sand",
  },
  {
    value: "#d4e4ed",
    label: "Fog",
  },
  {
    value: "#efeff1",
    label: "Chalk",
  },
  {
    value: "#C0C0C0",
    label: "silver",
  },
  {
    value: "#FF00FF",
    label: "pink",
  },
  {
    value: "	#ffe4c4",
    label: "bisque",
  },
  {
    value: "	#8fbc8f",
    label: "darkseagreen",
  },
];

export default function Home() {
  const { user, setUser, note, setNote } = AppState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [addNoteError, setAddNoteError] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#fff");
  const [viewNote, setViewNote] = useState(null);
  const [openLoad, setOpenLoad] = React.useState(false);
  const handleCloseLoad = () => {
    setOpenLoad(false);
  };
  const handleOpenLoad = () => {
    setOpenLoad(true);
  };

  const handleClickOpen = () => {
    setOpen(true);
    setTitle("");
    setDescription("");
    setBackgroundColor("#fff");
    setAddNoteError(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openNote, setOpenNote] = useState(false);

  const handleClickOpenNote = () => {
    setOpenNote(true);
  };

  const handleCloseNote = () => {
    setOpenNote(false);
    setViewNote(null);
  };

  const getUserData = async () => {
    try {
      handleOpenLoad()
      const id = localStorage.getItem("id_");
      const token = localStorage.getItem("token_");
      const userResponse = await fetch(
        `https://notes-appback.onrender.com/user/data/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = await userResponse.json();
      setUser(userData.data);
      if (userData.success == false) {
        if (userData.message == ("Token Experied" || "Token Not Found")) {
          localStorage.removeItem("id_");
          localStorage.removeItem("token_");
          toast.error(userData.message);
          navigate("/login");
        }
      }
    } catch (error) {
      console.log(error);
    }finally{
      handleCloseLoad()
    }
  };

  const getNoteData = async () => {
    try {
      const id = localStorage.getItem("id_");
      const token = localStorage.getItem("token_");
      const noteResponse = await fetch(
        `https://notes-appback.onrender.com/note/data/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const noteData = await noteResponse.json();
      const reverseData = noteData.data.reverse();
      setNote(noteData.data);
      if (noteData.success == false) {
        if (noteData.message == ("Token Experied" || "Token Not Found")) {
          localStorage.removeItem("id_");
          localStorage.removeItem("token_");
          toast.error(noteData.message);
          navigate("/login");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNoteData();
    getUserData();
  }, []);

  async function AddNote() {
    if (title == "" || description == "") {
      setAddNoteError(true);
    } else {
      handleClose();
    handleOpenLoad()
      const data = {
        title,
        description,
        backgroundColor,
      };
      const id = await localStorage.getItem("id_");
      const response = await fetch(`https://notes-appback.onrender.com/note/add/${id}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const noteResponseResult = await response.json();
      if (noteResponseResult.success) {
        handleCloseLoad()
        getNoteData();
      } else {
        handleCloseLoad()
        toast.error(noteResponseResult.message);
      }
    }
  }

  async function deleteNote(note_id) {
    handleCloseNote();
    handleOpenLoad()
    const response = await fetch(
      `https://notes-appback.onrender.com/note/delete/${note_id}`,
      {
        method: "DELETE",
      }
    );
    const deleteResponseResult = await response.json();
    
    if (deleteResponseResult.success) {
      getNoteData();
      handleCloseLoad()
    } else {
      handleCloseLoad()
      toast.error(deleteResponseResult.message);
    }

  }

  useEffect(() => {
    handleClickOpenNote();
  }, [viewNote]);

  return (
    <BaseApp>
      <div className="note-container">
       
        <div className="container ">
          {/* <div className="row justify-content-center ">
          <input placeholder="search here" className="col-3 text-field-container justify-content-center"/>
          </div>
      */}
          <div className="row justify-content-center ">
       
            <div className="col-6 text-field-container justify-content-center">
              <div onClick={handleClickOpen} className="text-click">
                <span>Take a note...</span>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row justify-content-center">
            {note && note.length == 0 ? (
              <h5 className="text-center">No Note Added</h5>
            ) : (
              ""
            )}

            {note &&
              note.map((data, index) => (
                <div
                  key={data.id}
                  style={{ backgroundColor: `${data.backgroundColor}` }}
                  onClick={() => setViewNote(data)}
                  className="col-10 col-sm-5 col-lg-2 noteee"
                >
                  <b>{data.title}</b>
                  <p>{data.description}</p>
                </div>
              ))}
          </div>
        </div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Take a note...</DialogTitle>
          <DialogContent>
            {addNoteError ? (
              <p style={{ color: "crimson" }}>Please fill all field*</p>
            ) : (
              " "
            )}
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              id="outlined-multiline-static"
              label="Take a note..."
              margin="dense"
              multiline
              rows={4}
              fullWidth
              defaultValue={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <TextField
              id="outlined-select-currency"
              select
              label="Select"
              defaultValue="#fff"
              helperText="Please select color"
              onChange={(e) => setBackgroundColor(e.target.value)}
            >
              {colors.map((option) => (
                <MenuItem
                  className="color-select"
                  key={option.value}
                  value={option.value}
                >
                  <span
                    style={{
                      backgroundColor: `${option.value}`,
                      color: `${option.value}`,
                      border: "1px solid #000000",
                    }}
                    className="color-select"
                  >
                    0000{" "}
                  </span>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={() => AddNote()}>Add Note</Button>
          </DialogActions>
        </Dialog>

        {viewNote && (
          <Dialog
            open={openNote}
            onClose={handleCloseNote}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{viewNote.title}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {viewNote.description}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <IconButton
                color="error"
                onClick={() => deleteNote(viewNote._id)}
                aria-label="add an alarm"
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                color="success"
                onClick={() => navigate(`/edit/${viewNote._id}`)}
                aria-label="add an alarm"
              >
                <EditIcon />
              </IconButton>
            </DialogActions>
          </Dialog>
        )}
         <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openLoad}
        onClick={handleCloseLoad}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      </div>
    </BaseApp>
  );
}