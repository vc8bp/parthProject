import { Select, MenuItem, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import Modal from "../../components/Modal" 
import AddAgent from './AddAgent'
import useAxios from '../../hooks/useAxios'
import toast from 'react-hot-toast'

const AgentDiv = styled.div`

    >div{
        margin: 1rem 0;
        display: flex;
        gap: 1rem;

        >button{
            border: none;
        }
    }
`


function Checkout({isOpen, setIsOpen, submit}) {
    const [agents, setAgents] = useState([])
    const [selectedAgnet, setSelectedAgent] = useState("")
    const [isAddAgentOpen, setIsAddAgentOpen] = useState(false)
    const { userRequest } = useAxios()

    useEffect(() => {
        if(isAddAgentOpen) return
        (async () => {
            try {
                const { data } = await userRequest("/agent")
                setAgents(data)
            } catch (error) {
                console.log(error)
                toast.error("Failed to fetch Agents!!!")
            }
        })()
    },[isAddAgentOpen])



    return (
        <>
            <Modal isOpen={isOpen} setIsOpen={setIsOpen} onClose={() => setIsOpen(false)} title="Checkout" >
                <AgentDiv>
                    <div>
                        <Select fullWidth={true} placeholder='Hello world' value={selectedAgnet} onChange={(e) => setSelectedAgent(e.target.value)} >
                            {agents.map(e => <MenuItem value={e._id}>{e.address.name}</MenuItem>)}
                        </Select>
                        <button onClick={() => setIsAddAgentOpen(true)} >Create</button>
                    </div>
                    <Button variant="contained" fullWidth onClick={() => submit(selectedAgnet)} >Submit</Button>
                </AgentDiv>
            </Modal>
            <AddAgent isOpen={isAddAgentOpen} setIsOpen={setIsAddAgentOpen}  />
        </>
    )
}

export default Checkout