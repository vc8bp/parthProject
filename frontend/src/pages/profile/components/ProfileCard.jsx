import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'
import avater from "assets/images/avatar4.jpg"
import { Skeleton } from 'antd';
import useAxios from '../../../hooks/useAxios';
import { convertImageToBase64 } from '../../../utils/general';
import { toast } from 'react-hot-toast';
import { updateUser } from '../../../redux/slice/userSlice';
import ButtonBase from '@mui/material/ButtonBase';
import EditIcon from '@mui/icons-material/Edit';
import { Tooltip } from '@mui/material';

const Container = styled.div`
    >div{
        padding: 1rem 1rem;
    }
    >input{
        display: none;
    }
`

const Top = styled.div`
    position: relative;
    background-color: #646464;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 130px;
    margin-bottom: 3.5rem;
    >p{
        font-size: 1.5rem;
        font-weight: 500;;
        text-align: center;
    }
    >.avatar{
        z-index: 10;
        position: absolute;
        bottom: 0;
        transform: translateY(50%);
        width: 100px;
        height: 100px;
        border-radius: 50%;
        box-shadow: 0 10px 25px #0000004d;
    }
`
const Mid = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    >address{
        font-size: 1.3rem;
        margin: 0.5rem;
        width: (90%, 100px);
        text-align: center;
    }
`
const Bottom = styled.div`
    display: flex;
    justify-content: space-between;
    justify-content: center;

    >div{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
`

function ProfileCard({user, setUser, IsOther}) {
    const { userRequest } = useAxios();
    const dispatch = useDispatch()
    const imgRef = useRef();
  
    const upload = async (file) => {
      try {  
        const { data } = await userRequest.post("/user/profile", {avatar: file});
        dispatch(updateUser({avatar: data.res}))
        setUser(p => ({...p, avatar: data.res}))
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "faield to upload image.")
      }
    };

    const handleFileChange = async () => {
      const file = imgRef.current.files[0];
        if (file) {
            try {
                const data = await convertImageToBase64(file)   
                upload(data);
            } catch (error) {
                toast.error("Faield to process the image.")
            }
        }
    };
  
    const inputClick = () => {
        if(IsOther) return toast.error("You don't have permission to change other's profile picture")
        imgRef.current.click();
    };
  
    return (    
        <Container className='floatBox'>
            <input ref={imgRef} type='file' onChange={handleFileChange}/>
            <Top>
                {!user ? <>
                    <Skeleton.Avatar className='avatar' active size={100} shape="circle"  />
                </>:
                <>
                    <p>{`${user.firstName} ${user.lastName}`}</p>
                    <span>{`${user.type}`}</span>
                    <Tooltip title="Edit Profile" >
                        <ButtonBase className='avatar' onClick={inputClick} style={{ borderRadius: '50%', overflow: 'hidden' }}>  
                            <img src={user.avatar ? user.avatar : avater} />
                        </ButtonBase>
                    </Tooltip>
                </>
                }

            </Top>
            <Mid>
                {!user ? <Skeleton paragraph={2} active  />
                : <>
                    <address>{user.address ? Object.values(user.address).map(e => `${e}, `) : "N/A"}</address>
                    <p>{user.number}</p>
                </>
                }
            </Mid>
            <Bottom>
                {!user ? <>
                    <Skeleton.Input active/><Skeleton.Input active/><Skeleton.Input active/>
                </>
                : <>
                    <div><p>564</p><span>Product Solde</span></div>
                </>
                }

            </Bottom>
        </Container>
    )
}

export default ProfileCard