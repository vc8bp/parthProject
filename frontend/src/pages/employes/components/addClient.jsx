import React, { useState } from 'react'
import { Modal } from "antd"
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import styled from "styled-components"
import toast from "react-hot-toast"
import useAxios from '../../../hooks/useAxios'
import { roleMap, userPermissionMap } from '../../../assets/json/general'
import { useSelector } from 'react-redux'

const Form = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 1rem 0;
    >*{
        width: calc(50% - 0.5rem);
    }
    @media (max-width: 500px) {
        flex-direction: column;
        >*{
            width: 100%;
        }
    }
`

function AddEmploye({isOpen, setIsOpen, setData}) {
    const user = useSelector(p => p.user.info)
    const { userRequest } = useAxios()
    const [formData, setFormData] = useState({isAdmin: false, firstName: "", lastName: "", email: "", number: "", password: ""})
    const handleChange = (e) => setFormData(p => ({...p, [e.target.name] : e.target.value})) 

    const handleSubmit = async () => {
        try {
            const { data } = await userRequest.post("/user/create", formData)
            setData(p => [...p, data.res])
            toast.success(data.message)
        } catch (error) {
            toast.error(error.response.data.message || "Failed to create Employee")
        }
        setIsOpen(false)
    }
    console.log(user.type)
    return (
        <Modal width={600} title="Add Employee" centered open={isOpen} onOk={handleSubmit} onCancel={() => setIsOpen(false)} >
            <Form>
                <TextField name='firstName' label="First Name" variant="outlined" value={formData.firstName}  onChange={handleChange}/>
                <TextField name='lastName' label="Last Name" variant="outlined" value={formData.lastName}  onChange={handleChange}/>
                <TextField name='email' label="Email" variant="outlined" value={formData.email}  onChange={handleChange}/>
                <TextField name='number' label="Number" variant="outlined" value={formData.number}  onChange={handleChange}/>
                <TextField name='role' label="Role" variant="outlined" value={formData.role}  onChange={handleChange}/>  
                <TextField type="password" name='password' label="Password" variant="outlined" value={formData.password}  onChange={handleChange}/>    
                <FormControl fullWidth >
                    <InputLabel id="type">Access Level</InputLabel>
                    <Select labelId='type' name='type' label="Access Level" variant="outlined" value={formData.isAdmin}  onChange={handleChange}>
                        <MenuItem style={{textTransform: "capitalize"}} value={true} >Admin</MenuItem>
                        <MenuItem style={{textTransform: "capitalize"}} value={false} >User</MenuItem>
                    </Select>  
                </FormControl>
 
            </Form>
        </Modal>
  )
}

export default AddEmploye