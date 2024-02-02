import React, { useMemo, useState } from 'react'
import Logo from "../assets/images/logo.png"
import styled from "styled-components"
import { Avatar, IconButton } from '@mui/material';

//icons
import MenuIcon from '@mui/icons-material/Menu';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from 'react-redux';

const Container = styled.div`
    position: sticky;
    top: 0;
    z-index: 1000;
    height: 60px;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(var(--primary));
    >div{
        display: flex;
        align-items: center;

    }
`
const Left = styled.div`
    gap: 1rem;
    height: 100%;
    >div{
        height: 100%;
        display: flex;
        align-items: center;
        gap: 0.2rem;
        >img{
        /* width: 100px; */
        height: 100%;
        }
        >p{
            font-size: 1.5rem;
            font-weight: 400;
        }
    }
`
const Right = styled.div`
    gap: 1rem;
`
const ProfileWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`

function NavBar({setSideBar}) {
    const [isFullScreen, setIsFullScreen] = useState(false)
    const user = useSelector(data => data.user.info)


    const ToggleScreen = () => {
        setIsFullScreen(p => !p)
        if (!document.fullscreenElement &&    // alternative standard method
            !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
            if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }
    const fullname = useMemo(() => `${user.firstName} ${user.lastName}`, [user]);
    return (
        <Container>
            <Left>
                <div><img src={Logo}/> <p>Name</p></div>
                <IconButton onClick={() => setSideBar(p => !p)}><MenuIcon/></IconButton>
            </Left>
            <Right>
                <IconButton onClick={ToggleScreen} >
                    {isFullScreen ? <FullscreenExitIcon/> : <FullscreenIcon/>}
                </IconButton>
                <IconButton><NotificationsIcon/></IconButton>
                <ProfileWrapper>
                    <o>{fullname}</o>
                    <Avatar src={user.avatar && user.avatar} >{`${user.firstName[0]}${user.lastName[0]}`}</Avatar>
                </ProfileWrapper>
            </Right>
        </Container>
    )
}

export default NavBar