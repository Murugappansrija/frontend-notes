import React from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

const userSchemaValidation = yup.object({
  name: yup.string().required("Name is Required"),
  email: yup.string().email().required("Email is Required"),
  password: yup
    .string()
    .required("Password is Required")
    .min(7, "Minimum 7 charactor is required"),
});

export default function SignUp() {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        password: "",
      },
      validationSchema: userSchemaValidation,
      onSubmit: async (data) => {
        try {
          handleOpen();
          const response = await fetch("https://notes-appback.onrender.com/user/signup", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const result = await response.json();
          if (result.success == true) {
            toast.success(result.message);
            navigate("/login");
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
          <div class="col-md-6 ">
            <div className="text-center bold-1">
              <h1>Create Account</h1>
            </div>
            <form onSubmit={handleSubmit}>
              <label for="exampleFormControlInput1" class="form-label bold">
                Name
              </label>
              <input
                type="text"
                class="form-control"
                name="name"
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
                id="exampleFormControlInput1"
                placeholder="Name"
              ></input>
              {touched.name && errors.name ? (
                <p style={{ color: "crimson", margin: "0px" }}>{errors.name}</p>
              ) : (
                ""
              )}
              <label
                for="exampleFormControlInput1"
                class="form-label bold pt-2"
              >
                Email address
              </label>
              <input
                type="email"
                class="form-control"
                name="email"
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
                id="exampleFormControlInput1"
                placeholder="Email"
              ></input>
              {touched.email && errors.email ? (
                <p style={{ color: "crimson", margin: "0px" }}>
                  {errors.email}
                </p>
              ) : (
                ""
              )}
              <label for="inputPassword5" class="form-label bold pt-2">
                Password
              </label>
              <input
                type="password"
                id="inputPassword5"
                name="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
                class="form-control"
                placeholder="Password"
                aria-labelledby="passwordHelpBlock"
              ></input>
              {touched.password && errors.password ? (
                <p style={{ color: "crimson", margin: "0px" }}>
                  {errors.password}
                </p>
              ) : (
                ""
              )}
              <button class="btn btn-primary login-btn" type="submit">
                Create Account
              </button>
             
              <div className="d-flex justify-content-center align-items-end mb-0 pb-0">
                <p className="pe-2 mb-0">Already have an account</p>
                <a
                  onClick={() => navigate("/login")}
                  className="text-primary text-decoration-none"
                >
                  Login
                </a>
              </div>
            </form>
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