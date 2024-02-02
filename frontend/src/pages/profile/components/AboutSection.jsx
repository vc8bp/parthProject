import { Skeleton } from 'antd'
import React from 'react'
import { useSelector } from "react-redux"
import styled  from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  >div{
        display: flex;
        flex-direction: column;
        padding: 1rem 1rem;

  }
  label{
    color: #9b9b9b;
    font-size: 0.8rem;
  }
`

function AboutSection({user}) {

  return (
    <Container className='floatBox'>
      <div>
        <label>About :</label>
        {!user ? <Skeleton paragraph={4}/> : <p>N/A</p>}
      </div>
      <div>
        <label>Email Adrdess :</label>
        {!user ? <Skeleton.Input block={true} /> : <p>{user.email}</p>}
      </div>
      <div>
        <label>phone :</label>
        {!user ? <Skeleton.Input block={true} /> : <p>{user.number}</p>}
      </div>

    </Container>
  )
}

export default AboutSection