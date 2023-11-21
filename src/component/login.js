import { useFormik } from "formik";
import React, { useEffect } from "react";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const userSchemaValidation = yup.object({
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Password is Required")
    .min(7, "Minimum 7 charactor is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    localStorage.removeItem("id_");
    localStorage.removeItem("token_");
  }, []);

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: userSchemaValidation,
      onSubmit: async (data) => {
        try {
          handleOpen();
          const response = await fetch("https://notes-appback.onrender.com/user/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const result = await response.json();
          if (result.success == true) {
            localStorage.setItem("token_", result.token);
            localStorage.setItem("id_", result.id);
            navigate("/home");
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          console.log(error);
        } finally {
          handleClose();
        }
      },
    });
  return (
    <div>
      <div className="login-header">
        <i className="bx bxs-book-open bx-lg" style={{ color: "green" }}></i>
        <span>
          <span className="logoFirstLetter">N</span>
        otes
        </span>
      </div>

      <div className="container ">
        <div className="row login-input align-items-center">
          <div className="col-md-6 ">
            <div className="text-center bold-1">
              <h1>Login</h1>
            </div>
            <form onSubmit={handleSubmit}>
              <label for="exampleFormControlInput1" className="form-label bold">
                Email address
              </label>
              <input
                name="email"
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="Email"
              ></input>
              {touched.email && errors.email ? (
                <p style={{ color: "crimson",margin:"0px" }}>{errors.email}</p>
              ) : (
                ""
              )}
              <label for="inputPassword5" className="form-label bold pt-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
                id="inputPassword5"
                className="form-control"
                placeholder="Password"
                aria-labelledby="passwordHelpBlock"
              ></input>
              {touched.password && errors.password ? (
                <p style={{ color: "crimson", margin:"0px" }}>{errors.password}</p>
              ) : (
                ""
              )}
              <button className="btn btn-primary login-btn" type="submit">
                Login
              </button>
            </form>

          
            <div className="d-flex justify-content-center align-items-end mb-0 pb-0">
              <p className="pe-2 mb-0">Don't have an account?</p>
              <a
                onClick={() => navigate("/register")}
                className="text-primary text-decoration-none"
              >
                Create one
              </a>
            </div>
            <div className="d-flex justify-content-center ">
              <div
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  padding: "10px",
                
                  borderRadius: "10px",
                  margin:"20px",
                 
                 
                }}
              >
                {/* <p className="m-0 mt-4">For Demo:</p>
                <p className="m-0">Email: users@gmail.com</p>
                <p className="m-0">Password: 12345678</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}