import React from 'react'
import styled from "styled-components"
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import {  InputAdornment} from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import ReplayIcon from '@mui/icons-material/Replay';
import DescriptionIcon from '@mui/icons-material/Description';
import IconBtn from 'components/IconBtn';
import { exportDataToCSV } from '../utils/general';

const TableOptions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(var(--lightBlue));
  padding: 1rem 0.5rem;
  margin-top: 1rem;
  >p{
    text-transform: capitalize;
  }
  >div{
    gap: 1rem;
    display: flex;
    align-items: center
  }
`

function TableFilterSection({onAdd,onRefresh, search, setSearch, data , isLoading, name}) {
  return (
    <TableOptions>
        <div>
            <TextField size='small' variant="outlined" label="Search"  value={search} onChange={e => setSearch(e.target.value)}
                startAdornment={
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                }
            />
        </div>
        <div  className='noprint' >
            <IconBtn tooltip="ADD" onClick={onAdd} ><AddIcon/></IconBtn>
            <IconBtn disabled={isLoading} tooltip="REFRESH" onClick={onRefresh}><ReplayIcon/></IconBtn>
            <IconBtn tooltip="EXPORT" disabled={!data?.length} onClick={() => exportDataToCSV(data, name)}><DescriptionIcon/></IconBtn>
        </div>
    </TableOptions>
  )
}

export default TableFilterSection