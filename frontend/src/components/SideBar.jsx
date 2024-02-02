import React, { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import BadgeIcon from '@mui/icons-material/Badge';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import avatar from "assets/images/avatar4.jpg"
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { LogoutUser } from '../redux/slice/userSlice';
import toast from "react-hot-toast"
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import { Link, useLocation } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { userNameToNumberMap, userNumberToName } from '../assets/json/general';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const Container = styled.div`
    position: sticky;
    right: 0;
    top: 0;
    background-color: rgb(var(--primary));
    height: calc(100vh - 60px);
    height: calc(100dvh - 60px);
    width: ${p => p.isOpen ? "250px" : "60px"};
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.3s ease-in-out;
    will-change: width;

    span{
        ${p => !p.isOpen ? "opacity: 0" : "opacity: 1"};
    }

    .isHidden{
        transition: all 0.3s ease-in-out;
        ${p => !p.isOpen ? "opacity: 0" : "opacity: 1"};
        will-change: opacity;
    }
`
const ProfileContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 0;
    height: ${p => p.isOpen ? "200px" : "100px"};  
    transition: all 0.3s ease-in-out;
    will-change: height;
    text-align: center;
    img{
        border-radius: 1rem;
        box-shadow: 10px 10px 13px #4e4e4e26;   
        width: 100px;
        height: 100px;
        ${p => !p.isOpen && css`
            width: 50px;
            height: 50px;
        `}
        will-change: width, height;
        transition: all 0.3s ease-in-out;
    }
`
const activeStyle = css`
    background-color: white;
    box-shadow: 0 0 10px 0 rgba(183, 192, 206, 0.2);
    p {
        color: rgb(var(--highlight));
    }
`;

const Item = styled(Link)`
    margin: 0.5rem;
    padding: 0.5rem 0.5rem;
    border-radius: 0.3rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;


    >svg{
        font-size: 2rem;
    }
    >span{
        width:  180px;
        display: flex;
        justify-content: space-between;
        transition: all 0.3s ease-in-out;
    }
    &:hover{
        ${activeStyle}
    }
    transition: all 0.3s ease-in;
    cursor: pointer;

    ${p => p.to === p.current && css`
        ${activeStyle}
    `}
`

const NavItems = [
    {onlyAdmin: true ,title: "Dashboard", url: "/", icon: <GridViewOutlinedIcon/>},
    {onlyAdmin: true ,title: "Users", url: "/users", icon: <BadgeIcon/>},
    {onlyAdmin: true ,title: "products", url: "/products", icon: <AccountTreeIcon/>},
]

function SideBar({isOpen}) {
    const user = useSelector(e => e.user.info)
    console.log(user)
    const { userRequest } = useAxios()
    const [tempIsOpen, setTempIsOpen] = useState(false)
    const dispatch = useDispatch()


    const handleTempChange = (newState) => {
        if(isOpen) return
        setTempIsOpen(newState)
    }

    const handleLogout = async () => {
        try {
            const {data} = await userRequest.get("/auth/logout");
            dispatch(LogoutUser())
            toast.success("Logout Successfull!!")
        } catch (error) {
            toast.error("Logout Failed!!, Please try again after some time")
        }
    }

    const currentPath = useLocation().pathname;
    const fullname = useMemo(() => `${user.firstName} ${user.lastName}`)
  return (
    <Container isOpen={tempIsOpen || isOpen} onMouseEnter={() => handleTempChange(true)} onMouseLeave={() => handleTempChange(false)}>
        <div >
            <ProfileContainer isOpen={tempIsOpen || isOpen}>
                <img src={user?.avatar ? user.avatar : avatar} loading="lazy" alt="Profile" width="100" height="100" />
                <p className='isHidden'>{fullname}</p>
                <small className='isHidden'>{user.type}</small>
            </ProfileContainer>

            {NavItems.map(e => {
                if(e.onlyAdmin){
                    
                    if(!user.isAdmin) return null
                }
                return <Item current={currentPath} to={e.url} >{e.icon}<span><p>{e.title}</p> <ArrowForwardIosIcon/></span></Item>
            })}

        </div>
        <div >
            <Item current={currentPath} to="/profile"><AccountCircleIcon/><span><p>Profile</p> <ArrowForwardIosIcon/></span></Item>
            <Item onClick={handleLogout} ><LogoutIcon/><span><p>Logout</p></span></Item>
        </div>


    </Container>
  )
}

export default SideBar