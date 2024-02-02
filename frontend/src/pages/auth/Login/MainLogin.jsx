import React, { useState } from "react";
import { InputAdornment, IconButton , Checkbox, Button, FormControlLabel } from "@mui/material";
import styled from "styled-components";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {OutlinedInput} from "@mui/material";
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { getLocalStorage } from "../../../utils/general";
import { useDispatch } from "react-redux";
import { LoginUser } from "../../../redux/slice/userSlice";
import useAxios from "../../../hooks/useAxios";


const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Wrapper = styled.div`
  width: min(410px, 90%);
  >h1{
    margin: 2rem 0;
    width: 100%;
    font-size: 2.5rem;
    font-weight: 500;
  }
  h2{
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  >.MuiOutlinedInput-root {
    margin: 0.5rem 0;
  }
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  align-items: center;
`;

function MainLogin() {
  const { publicRequest } = useAxios()
  const [formData, setFormData] = useState(getLocalStorage("loginInfo", {email: "", password: ""}))
  const [formDataValidation, setFormDataValidation] = useState({email: false, password: false})
  const [rememberMe, setRememberMe] = useState(getLocalStorage("rememberMe", false));
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => setFormData(p => ({...p, [e.target.name] : e.target.value})) 
  const handleValidate = (e) => {
    const name = e.target.name;
    const res = formData[name] ? false : true
    setFormDataValidation(p => ({...p, [name]: res}))
  }
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleLogin = async (e) => {
    e.preventDefault();
    rememberMe ? localStorage.setItem("loginInfo", JSON.stringify(formData)) : localStorage.clear("loginInfo")
    setIsLoading(true)
    try {
      const {data} = await publicRequest.post("/auth/login", formData)
      dispatch(LoginUser(data))
      navigate("/")
    } catch (error) {
      toast.error(error.response.data.message)
    }
    setIsLoading(false)
  };

  return (
      <StyledContainer>
        <Wrapper>
          <h1>Welcome</h1>
          <Form onSubmit={handleLogin}>
            <h2>Sign in</h2>
            <OutlinedInput variant="outlined" name="email" placeholder="email" value={formData.email} onBlur={handleValidate} onChange={handleChange} error={formDataValidation.email} />
            <OutlinedInput 
              name="password"
              variant="outlined" 
              type={showPassword ? "text" : "password"}
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              required={true}
              error={formDataValidation.password}
              onBlur={handleValidate}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(p => !p)}>
                    {!showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <BottomSection>
              <FormControlLabel control={<Checkbox checked={rememberMe} onChange={e => {setRememberMe(e.target.checked); localStorage.setItem("rememberMe", e.target.checked)}} />} label="Remember me" />
              <Link to="/forgot-password">Forgot Password?</Link>
            </BottomSection>

            <Button disabled={isLoading} type="submit" variant="contained" >Login</Button>
          </Form>
        </Wrapper>
      </StyledContainer>
  );
}

export default MainLogin;
