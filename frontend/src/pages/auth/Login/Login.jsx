import React from 'react'
import styled from "styled-components"
import image from 'assets/images/loginBanner.png'
import MainLogin from './MainLogin'

const Container = styled.div`
    display: flex;
    height: 100vh;
    height: 100dvh;
    >* {
      flex: 1;
    }
`
const Left = styled.div`
  background-color: #F8FCFF;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 700px) {
    display: none;
  }
`
const Main = styled.div`
    
`

function Login() {
  return (
    <Container>
        <Left>
            <img src={image}/>
        </Left>
        <Main>
            <MainLogin/>
        </Main>
    </Container>
  )
}

export default Login