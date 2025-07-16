import {
  Box,
  Button,
  InputLabel,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { authStyles } from "../../styles/auth-styles";
import { FaBloggerB } from "react-icons/fa";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { USER_LOGIN, USER_SIGNUP } from "../graphql/mutations";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth-slice";
import { useNavigate } from "react-router-dom";

type Inputs = {
  name: string
  email: string
  password: string
}

function Auth() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>();
  const [isSignup, setIsSignup] = useState(false);
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));
  const [login] = useMutation(USER_LOGIN);
  const [signup] = useMutation(USER_SIGNUP);
  const isLoggedIn = useSelector((state: any) => state.isLoggedIn);
  console.log(isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onResReceived = (data: any) => {
    if(data.signup) {
      const { id, email, name } = data.signup;
      localStorage.setItem("userData", JSON.stringify({ id, email, name }))
    } else {
      const { id, email, name } = data.login;
      localStorage.setItem("userData", JSON.stringify({ id, email, name }))
    }
    dispatch(authActions.login());
    return navigate("/blogs");
  }

  const onSubmit = async ({name, email, password} : Inputs) => {
    if(isSignup) {
      //signup
      try {
       const res = await signup({
        variables: {
          name,
          email,
          password
        }
      })
      if(res.data) {
        onResReceived(res.data);
      }
      } catch (error: any) {
        console.log("signup error", error.message)
      }
    } else {
      try {
        const res = await login({
          variables: {
            email,
            password
          }
        })
      if(res.data) {
        onResReceived(res.data);
      }
      } catch (error: any) {
        console.log("login error", error.message)
      }
    }
  }
  return (
    <Box sx={authStyles.container}>
      <Box sx={authStyles.logoTitle}>
        {/* @ts-ignore */}
        <FaBloggerB
          size={"30px"}
          style={{
            borderRadius: "50%",
            padding: "10px",
            background: "#6C5252",
          }}
        />
        <Typography sx={authStyles.logoText}>BlogsApp</Typography>
      </Box>
      <Box
        sx={{ ...authStyles.formContainer, width: isBelowMd ? "50%" : "200px" }}
      >
        <Typography sx={authStyles.logoText}>
          {isSignup ? "SignUp" : "Login"}
        </Typography>
        {/* @ts-ignore */}
        <form onSubmit={handleSubmit(onSubmit)} style={authStyles.form}>
          {isSignup && (
            <>
              <InputLabel aria-label="name"></InputLabel>
              <TextField
                margin="normal"
                InputProps={{ style: { borderRadius: 20 } }}
                aria-label="name"
                label="Name"
                {...register("name", { required: true })}
              />{" "}
            </>
          )}
          <InputLabel aria-label="email"></InputLabel>
          <TextField
            margin="normal"
            InputProps={{ style: { borderRadius: 20 } }}
            aria-label="email"
            label="Email"
            type="email"
            {...register("email", {
              required: true,
              validate: (val: string) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            })}
            error={Boolean(errors.email)}
            helperText={Boolean(errors.email)?"Invalid Email": ""}
          />
          <InputLabel aria-label="password"></InputLabel>
          <TextField
            margin="normal"
            InputProps={{ style: { borderRadius: 20 } }}
            aria-label="password"
            label="Password"
            type="password"
            {...register("password", {
              required: true,
              minLength: 6
            })}
            error={Boolean(errors.password)}
            helperText={Boolean(errors.password)?"Length Should be greater than 5": ""}
          />
          <Button type="submit" variant="contained" sx={authStyles.submitBtn}>
            Submit
          </Button>
          <Button
            onClick={() => setIsSignup((prev) => !prev)}
            //@ts-ignore
            sx={{ ...authStyles.submitBtn, ...authStyles.switchBtn }}
          >
            Switch to {isSignup ? "Login" : "SignUp"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default Auth;
