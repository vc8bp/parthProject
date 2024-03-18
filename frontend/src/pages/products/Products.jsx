import React, { useEffect, useState } from 'react'
import ReactTable from 'components/ReactTable'
import styled from "styled-components"
import { Avatar, IconButton } from "@mui/material"
import AddEmploye from './components/addProducts';
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
import EditProducts from './components/EditProduct';
  
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

const ColorTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  >div{
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
`



function Products() {
    const navigate = useNavigate()
    const { userRequest } = useAxios()
    const [data, setData] = useState([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isEditProductOpen, setEditProductOpen] = useState(false)

    function handleDelete() {
      console.log("hello wrold")
    }

    const colDefs = [
      { title: "no", dataIndex: "productno", },
      { title: "Product", dataIndexr: "Image", align: "center",
          render: (text, record) => <Avatar src={record.img} ></Avatar>
      },
      { title: "Name", dataIndex: "Name", 
          render:(text, record) => <ColorTag>
            <p>{`${record.title}`}</p>
            <div style={{backgroundColor: record.color}} ></div>
          </ColorTag>
      },
      { title: "Size", dataIndex: "size", },
      { title: "Quantity", dataIndex: "quantity", },
      { title: "Purchased Count", dataIndex: "purchasedCount"},
      { title: "Category", dataIndex: "categories",  render: (text) => text.map(e => <Tag color='blue' >{e}</Tag>)},
      { title: "Created at", dataIndex: "createdAt", render: (text) => new Date(text).toDateString() },
      { title: "Actions", render: (_, data) => {
        return <ActionsContainer >
          <IconButton><EditNoteIcon className='edit' onClick={() => setEditProductOpen(data)} /></IconButton>
          {/* <DeleteOutlineOutlinedIcon className='delete' /> */}
        </ActionsContainer>
      }}
    ]
    

    const fetchEmployees = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({s: search})
        const {data} = await userRequest.get(`/product?${params}`)
        setData(data)
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message || "Failed to fetch Products!!")
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
            <h1>Manage Products</h1>
            <TableContainer>
              <TableFilterSection name="Employee" search={search} setSearch={setSearch} data={data} onAdd={() => setEditProductOpen(true)} onRefresh={fetchEmployees} isLoading={false} />
              <ReactTable loading={isLoading} size="middle" colDefs={colDefs} data={data} tableName="Hello wrold" />
            </TableContainer>
        </Container>
        <EditProducts isOpen={isEditProductOpen} setIsOpen={setEditProductOpen} title="Add Product" desc="Add your product's information from here" />
      </>
    )
}

export default Products