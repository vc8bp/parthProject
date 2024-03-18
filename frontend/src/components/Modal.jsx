import React from 'react'
import styled from 'styled-components'
import CloseIcon from '@mui/icons-material/Close';

const Container = styled.div`
    max-height: 90vh;
    max-height: 90dvh;
    overflow-y: auto;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    max-width: 90%;
    height: max-content;
    background-color: white;
    box-shadow: 0 0px 0px 1000px rgba(0,0,0,.3);
    padding: 20px;
    z-index: 102;
    border-radius: 1vmax;
    display: ${p => p.isOpen ? "block": "none"};
`

const TopSection = styled.div`
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
`

function ModalComp({ children, isOpen, setIsOpen, title }) { 
  return (
    <Container isOpen={isOpen}>
        <TopSection>
            <h2>{title}</h2>
            <CloseIcon  onClick={() => setIsOpen(false)} />
        </TopSection>
        {children} 
    </Container>
  )
}

export default ModalComp