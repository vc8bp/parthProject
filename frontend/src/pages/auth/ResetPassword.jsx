import React, {useState} from 'react';
import styled from 'styled-components';
import KeyIcon from '@mui/icons-material/Key';
import toast from 'react-hot-toast';
import EmailIcon from '@mui/icons-material/Email';
import { CircularProgress } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import useAxios from '../../hooks/useAxios';

const FormContainer = styled.div`
  height: 100vh;
  height: 100dvh;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
    margin-top: 10%;
    width: min(370px, 90%); 
    display: flex;
    flex-direction: column;
    align-items: center;
`
const IconContainer = styled.div`
    padding: 0.6rem;
    border-radius: 50%;
    background-color: ${p => p.isSuccess ? "#ECFCF2" : "rgb(var(--darkBlue), 0.1);" };
    >div{
        padding: 0.6rem;
        border-radius: 50%;
        background-color: ${p => p.isSuccess ? "#D2FBDF" : "rgb(var(--darkBlue), 0.3)" };
        display: flex;
        justify-content: center;
        align-items: center;
        >svg{
            font-size: 2rem;
            fill: ${p => p.isSuccess ? "#2DAB72" : "rgb(var(--darkBlue));" };
            transform: ${p => !p.isSuccess && "rotate(-45deg)" };
        }
    }
`



const Desc = styled.p`
    font-weight: 500;
    color: #5f5f5f;
    letter-spacing: 0.5px;
`

const Title = styled.h2`
  font-size: 24px;
  margin: 10px 0;
  font-weight: 600;
`;

const Label = styled.label`
    font-weight: 500;
    color: #5f5f5f;
    letter-spacing: 0.5px;
    font-size: 16px;
    margin-bottom: 8px;
`;

const FormWrapper = styled.form`
    margin-top: 2rem;
    width: 100%;
`

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  height: 45px;
  border-radius: 0.5rem;
  width: 100%;
  padding: 10px;
  background-color: rgb(var(--darkBlue));
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
    
  &:hover {
    background-color: rgb(var(--darkBlue), 0.8)
  }
  :disabled{
    background-color: rgb(var(--disabled));
  }
`;

const GoBack = styled.p`
    display: flex ;
    align-items : center;
    margin: 1rem 0;
    gap: 0.5rem;
    cursor: pointer;
`

const ResetPassword = () => {
    const { publicRequest } = useAxios()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({password: "", cpass: ""})
    const [isSuccess, setIsSucess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const location = useLocation();
    const token = location.pathname.split("/")[2]

    const handleChange = (e) => setFormData(p => ({...p, [e.target.name]: e.target.value}))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const {data} = await publicRequest.post(`/auth/reset-password/${token}`,{password: formData.password})
            toast.success(data.message)
            setIsSucess(true)
        } catch (error) {

            toast.error(error.response.data.message || "Failed to Change Password")
        }
        setIsLoading(false)
    }
  return (
    <FormContainer>
        {
            !isSuccess ?
            <Wrapper>
                <IconContainer>
                    <div><KeyIcon/></div>
                </IconContainer>
                <Title>Set new password</Title>
                <Desc>Your passwrod must be different then previously used password.</Desc>
                <FormWrapper onSubmit={handleSubmit}>
                    <Label htmlFor="email">Password:</Label>
                    <Input type="password" name='password' value={formData.password} onChange={handleChange} />

                    <Label htmlFor="email">Confirm Password:</Label>
                    <Input type="password" name='cpass' value={formData.cpass} onChange={handleChange} />

                    <Button type="submit" disabled={isLoading}>{ isLoading ? <CircularProgress size={25}/> :  'Reset Password'}</Button>
                </FormWrapper>
                <GoBack onClick={() => navigate("/login")} ><KeyboardBackspaceIcon/> Back to login</GoBack>

            </Wrapper>
            :
            <Wrapper>
                <IconContainer isSuccess={true} >
                    <div><CheckCircleOutlineIcon/></div>
                </IconContainer>
                <Title>Password reset</Title>
                <Desc>Your password has been successfully reset </Desc>
                <Desc>Click below to login magically </Desc>
                <FormWrapper>
                    <Button onClick={() => navigate("/login")} >Continue</Button>
                </FormWrapper>
            </Wrapper>
        }
    </FormContainer>
  );
};

export default ResetPassword;
