import React, {useState} from 'react';
import styled from 'styled-components';
import KeyIcon from '@mui/icons-material/Key';
import toast from 'react-hot-toast';
import EmailIcon from '@mui/icons-material/Email';
import { CircularProgress } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
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
    background-color: rgb(var(--darkBlue), 0.1);
    >div{
        padding: 0.6rem;
        border-radius: 50%;
        background-color: rgb(var(--darkBlue), 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        >svg{
            font-size: 2rem;
            fill: rgb(var(--darkBlue));
            transform: ${p => p.rotate && "rotate(-45deg)" };
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
  transition: all 0.2s ease;
    
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

const ForgotPasswordForm = () => {
    const { publicRequest } = useAxios()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [isEmilSend, setIsEmailSend] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const {data} = await publicRequest.post("/auth/forgot-password", { email, resetEndPoint: "/reset-password/" })
            toast.success(data.message)
            setIsEmailSend(true)
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message || "Failed to Send Email")
        }
        setIsLoading(false)
    }
  return (
    <FormContainer>
        {
            !isEmilSend ?
            <Wrapper>
                <IconContainer rotate={true} >
                    <div><KeyIcon/></div>
                </IconContainer>
                <Title>Forgot Password?</Title>
                <Desc>No worries, we'll send you reset instructions.</Desc>
                <FormWrapper onSubmit={handleSubmit}>
                    <Label htmlFor="email">Email:</Label>
                    <Input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} />
                    <Button type="submit" disabled={isLoading}>{ isLoading ? <CircularProgress size={25}/> :  'Reset Password'}</Button>
                </FormWrapper>

            </Wrapper>
            :
            <Wrapper>
                <IconContainer>
                    <div><EmailIcon/></div>
                </IconContainer>
                <Title>Check you email</Title>
                <Desc>We sent a password reset link to </Desc>
                <Desc>{email}</Desc>
                <FormWrapper onSubmit={handleSubmit}>
                    <Button type="submit" disabled={isLoading}>{ isLoading ? <CircularProgress size={25} /> :  'Resend Email?'}</Button>
                </FormWrapper>
                <GoBack onClick={() => navigate("/login")} ><KeyboardBackspaceIcon/> Back to login</GoBack>
            </Wrapper>
        }
    </FormContainer>
  );
};

export default ForgotPasswordForm;
