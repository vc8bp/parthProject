import React, { useEffect, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import AboutSection from './components/AboutSection'
import ProfileCard from './components/ProfileCard'
import { Tab, Tabs } from "@mui/material"
import EditProfile from './components/EditProfile'
import ProfileInfo from './components/ProfileInfo'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import useAxios from '../../hooks/useAxios'
import { toast } from 'react-hot-toast'

const Container = styled.div`
    display: flex;
    gap: 1rem;
`
const Left = styled.div`
    width: 30%;
`

const Right = styled.div`
    
    padding: 0 !important;
    width: 70%;
`

function Profile() {
  const { userRequest } = useAxios()
  const [searchQ, setQ] = useSearchParams()
  const [activeTab, setActiveTab] = useState(0)
  const currUser = useSelector(p => p.user.info);
  const [user, setUser] = useState(null)


  
  const userId = useMemo(() => searchQ.get("user"), [searchQ])
  useEffect(() => {
    
    if(!userId) {
        setUser(currUser)
        return 
    }

    (async() => {  
        setUser(null)
        try {
            const { data } = await userRequest.get(`/user?id=${userId}`)
            setUser(data)
            
        } catch (error) {
            setQ({})
            toast.error(error.response.data.message || "Failed to fetch user Info!!")
        }
    })()
  },[searchQ.get("user")])
  
  const tabsContent = [
    {title: "About Me", component: ProfileInfo},
    {title: "Settings", component: EditProfile}
  ]


  const handleTabChange = (_, newTabIndex) => setActiveTab(newTabIndex)

  const ActiveComp = useMemo(() => tabsContent[activeTab].component, [activeTab])
  return (
    <Container>
        <Left>
            <ProfileCard user={user} IsOther={userId} setUser={setUser} />
            <AboutSection user={user} IsOther={userId} />
        </Left>
        <Right className='floatBox' >
            <Tabs variant="fullWidth" value={activeTab} onChange={handleTabChange} aria-label="nav tabs example">
                <Tab label="About Me" />
                <Tab disabled={!user} label="Settings"  />
            </Tabs>
            <ActiveComp setUser={setUser} user={user} IsOther={userId} />
        </Right>
    </Container>
  )
}

export default Profile