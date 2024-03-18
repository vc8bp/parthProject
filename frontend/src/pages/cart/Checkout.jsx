import { Select, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import Modal from "../../components/Modal"

const AgentDiv = styled.div`
    display: flex;
    gap: 1rem;
    >button{
        border: none;
    }
`


function Checkout({isOpen, setIsOpen}) {
    const [agents, setAgents] = useState(["hello"])


    useEffect(() => {

    },[])


  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} onClose={() => setIsOpen(false)} title="Checkout" >
        <AgentDiv>
            <Select fullWidth={true} placeholder='Hello world' >
                {agents.map(e => <MenuItem value={e}>e</MenuItem>)}
            </Select>
            <button>Create</button>
        </AgentDiv>
    </Modal>
  )
}

export default Checkout