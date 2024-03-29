import React, { useEffect, useState } from 'react'
import ReactTable from 'components/ReactTable'
import styled from "styled-components"
import { Avatar, IconButton } from "@mui/material"
import AddEmploye from './components/addClient';
// import { userRequest } from '../../axiosInstance';
import { toast } from 'react-hot-toast';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TableFilterSection from '../../components/TableFilterSection';
import useAxios from '../../hooks/useAxios';
import { debounce } from 'lodash';
import { Tag } from "antd"
import { useNavigate } from 'react-router-dom';
import { roleMap } from '../../assets/json/general';
  
const Container = styled.div`
    
`

const TableContainer = styled.div`
    width: 100%;
    box-shadow: 0 0 10px 0 rgba(183,192,206,.2);
    -webkit-box-shadow: 0 0 10px 0 rgba(183,192,206,.2);
`
const ActionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  .delete{
    color: red;
  }
  .edit{
    color: blue
  }
`




function Employes() {
    const navigate = useNavigate()
    const { userRequest } = useAxios()
    const [data, setData] = useState([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)

    function handleDelete() {
      console.log("hello wrold")
    }

    const colDefs = [
      { title: "avatar", dataIndexr: "Image", align: "center",
          render: (text, record) => <Avatar src={record.avatar && `${import.meta.env.VITE_BACKEND_AVATAR}/${record.avatar}`}>{`${record.firstName[0]}${record.lastName[0]}`}</Avatar>
      },
      { title: "Name", dataIndex: "Name", 
          render:(text, record) => <div style={{display: "flex", gap: "0.5rem"}}>
            <p>{`${record.firstName} ${record.lastName}`}</p>
            <Tag color={record.isAdmin ? "cyan" :  "blue"} >{record.isAdmin ? "Admin" : "Client"}</Tag>
          </div>
      },
      { title: "Mobile", dataIndex: "number", },
      { title: "Email", dataIndex: "email", },
      { title: "JoiningDate", dataIndex: "createdAt", render: (text) => new Date(text).toDateString() },
      { title: "Actions", render: (_, data) => {
        return <ActionsContainer >
          <IconButton><EditNoteIcon className='edit' onClick={() => navigate(`/profile?user=${data._id}`)} /></IconButton>
          {/* <DeleteOutlineOutlinedIcon className='delete' /> */}
        </ActionsContainer>
      }}
    ]
    

    const fetchEmployees = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({s: search})
        const {data} = await userRequest.get(`/user?${params}`)
        setData(data)
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message || "Failed to fetch Users!!")
      }
      setIsLoading(false)
    }


    const debouncedFetchEmployes = debounce(fetchEmployees, 500);

    useEffect(() => {
        debouncedFetchEmployes(search);
        return () => debouncedFetchEmployes.cancel();
    },[search])

    return (
      <>
        <Container>
            <h1>All Users</h1>
            <TableContainer>
              <TableFilterSection name="Employee" search={search} setSearch={setSearch} data={data} onAdd={() => setIsAddEmployeeOpen(true)} onRefresh={fetchEmployees} isLoading={false} />
              <ReactTable loading={isLoading} size="middle" colDefs={colDefs} data={data} tableName="Hello wrold" />
            </TableContainer>
        </Container>
        <AddEmploye setData={setData} setIsOpen={setIsAddEmployeeOpen} isOpen={isAddEmployeeOpen} />
      </>
    )
}

export default Employes