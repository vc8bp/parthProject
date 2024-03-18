import React, { useEffect, useReducer, useState } from 'react';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import styled, { css } from 'styled-components';
import useAxios from "../../../hooks/useAxios"
import toast from "react-hot-toast"
import { useDispatch } from 'react-redux';
import { updateUser } from "../../../redux/slice/userSlice"

const Container = styled.div`
    padding: 1rem;
`;

const Section = styled.div`
  margin-bottom: 20px;
  .row{
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 20px;
    >*{
        width: calc(50% - 1rem);
    }
  }
`;

const Heading = styled.h2`
  color: #333;
  margin-bottom: 10px;
`;

const InputWrapper = styled.div`
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  && {
    background-color: #2196f3;
    color: #fff;
    &:hover {
      background-color: #1565c0;
    }
  }
`;
const defaultAddValue = {street: "", city: "", state: "", zip: "", country: ""}
const EditProifle = ({user, IsOther, setUser}) => {
  const { userRequest } = useAxios()
  const [addressData, setAddressdata] = useState(user?.address ? user.address : defaultAddValue)
  const [profileData, setProfileData] = useState({password: "", cPassword: "", currentPass: ""})

  useEffect(() => {
    setAddressdata(user?.address || defaultAddValue)
    setProfileData(p => ({...p, firstName: user.firstName, lastName: user.lastName, email: user.email, number: user.number}))
  } ,[user])

  const handleProfileForm = e => setProfileData(p => ({...p, [e.target.name]: e.target.value}))
  const handleAddress = e => setAddressdata(p => ({...p, [e.target.name]: e.target.value}))

  const dispatch = useDispatch()
  const handleAddressSave = async (e) => {
    e.preventDefault()
    try {
      const { data } = await userRequest.post("/user/address", IsOther ? {...addressData, _id: IsOther} : addressData)
      if(!IsOther) dispatch(updateUser({address: data.res}))
      setUser(p => ({...p, address: data.res}))
      toast.success(data.message || "Address Updated successfully!!")
    } catch (error) {
      toast.error(error.response.data.message || "Failed to Updated address!!!")
    }
  }

  const handleProfilechange = async (forPass) => {
    console.log("Hemloo")
    let body;
    const { cPassword , password, currentPass, ...other } = profileData

    if(forPass){
      if(cPassword !== password) {
        setProfileData(p => ({...p, cPassword: "", password: ""}))
        return toast.error("Passwords do not match. Please make sure your confirmation password matches the new password.", {duration: 5000})
      }
      body = {password, currentPass}
    } else {
      body = other
    }

    if(IsOther) body._id = IsOther
  
    try {
      const { data } = await userRequest.put("/user", body)
      toast.success(data.message || "Address Updated successfully!!")

      if(!forPass) {
        if(!IsOther)  dispatch(updateUser(data.res))
        setUser(p => ({...p, ...data.res}))
      }
    } catch (error) {
      toast.error(error.response.data.message || "Failed to Updated address!!!")
    }
  }

  return (
    <Container>
      <Section className={!user.isAdmin && "disabled"} >
        <Heading>Security Settings</Heading>
          <InputWrapper>
            <TextField name="currentPass" value={profileData.currentPass} onChange={handleProfileForm} fullWidth type="password" label="Current Password" />
          </InputWrapper>
          <InputWrapper>
            <TextField name="password" value={profileData.password} onChange={handleProfileForm} fullWidth type="password" label="New Password" /> 
          </InputWrapper>
          <InputWrapper>
            <TextField name="cPassword" value={profileData.cPassword} onChange={handleProfileForm} fullWidth type="password" label="Confirm Password" /> 
          </InputWrapper>
          <StyledButton onClick={handleProfilechange} variant="contained">Change Password</StyledButton>
      </Section>

      <Section className={!user.isAdmin && "disabled"}>
        <Heading>Account Settings</Heading>
        <div className='row'>
            <TextField name="firstName" onChange={handleProfileForm} value={profileData?.firstName} fullWidth label="First Name" />
            <TextField name="lastName" onChange={handleProfileForm} value={profileData?.lastName} fullWidth label="Last Name" />
            <TextField name="email" onChange={handleProfileForm} value={profileData?.email} fullWidth type="email" label="Email" />
            <TextField name="number" onChange={handleProfileForm} value={profileData?.number} fullWidth label="Number" />
        </div>
        <StyledButton onClick={() => handleProfilechange()} variant="contained">Update Profile</StyledButton>
      </Section>

      <Section className={!user.isAdmin && "disabled"}>
        <Heading>Address</Heading>
          <div  className='row'> 
            <TextField required fullWidth name='street' value={addressData.street} onChange={handleAddress} label="Street" />
            <TextField required fullWidth name='city' value={addressData.city} onChange={handleAddress} label="City" />
            <TextField required fullWidth name='state' value={addressData.state} onChange={handleAddress} label="State" />
            <TextField required type='number' fullWidth name='zip' value={addressData.zip} onChange={handleAddress} label="Zip" />
            <TextField required fullWidth name='country' value={addressData.country} onChange={handleAddress} label="Country" />
          </div>
          <StyledButton onClick={handleAddressSave} type='submit' variant="contained">Save Address</StyledButton>
      </Section>

    </Container>
  );
};

export default EditProifle;
