import React, { useState } from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from "../../components/Modal"
import useAxios from '../../hooks/useAxios';
import toast from 'react-hot-toast';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  gap: 1rem;
`;

const FormField = styled(TextField)`
  margin-bottom: 20px;
`;

const SubmitButton = styled(Button)`
  && {
    margin-top: 20px;
  }
`;

const initialState = {
  name: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  mobile: '',
};

const AddAgent = ({isOpen, setIsOpen}) => {
  const [formData, setFormData] = useState(initialState);
  const { userRequest } = useAxios();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
        const { data } = await userRequest.post("/agent", formData)
        toast.success("Agent added successfully!!")
        setIsOpen(false)
    } catch (error) {
        console.log(error)
        toast.error("Failed to Add agent")
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Add Agent" >
        <form onSubmit={handleSubmit}>
            <FormContainer>

                <FormField name="name" label="Name" variant="outlined" value={formData.name} onChange={handleChange} required />
                <FormField name="street" label="Street" variant="outlined" value={formData.street} onChange={handleChange} required />
                <FormField name="city" label="City" variant="outlined" value={formData.city} onChange={handleChange} required />
                <FormField name="state" label="State" variant="outlined" value={formData.state} onChange={handleChange} required />
                <FormField name="zip" label="Zip" variant="outlined" value={formData.zip} onChange={handleChange} required />
                <FormField name="mobile" label="Mobile" variant="outlined" value={formData.mobile} onChange={handleChange} required />

                <SubmitButton type="submit" variant="contained" color="primary">
                Submit
                </SubmitButton>
            </FormContainer>
        </form>
    </Modal>

  );
};

export default AddAgent;
