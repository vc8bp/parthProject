import React, { Component } from 'react';
import styled from 'styled-components';
import ErrorImg from "assets/images/wentWrong.png"
import AddIcon from '@mui/icons-material/Add';

const ErrorBoundaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 70px);
  >* {
    text-align: center;
    text-wrap: balance;
  }
  >pre {
    position: relative;
    background-color: #FFF2F0;
    border: 1px solid #FFCCC7;
    width: 90%;
    padding: 1rem;
    text-align: start;
    font-size: 14px;
    margin: 1rem 0;
    >svg{
        transition: all 0.3s ease-in-out;
        position: absolute;
        right: 10px;
        top : 15px;
        transform: ${p => p.isOpen ? "rotate(45deg)" : "rotate(0deg)"};
    }
  }
`;

const ErrorMessage = styled.h1`
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 16px;
`;

const ErrorDesc = styled.p`
    font-weight: 400;
`

const ImgContainer = styled.div`
    width: min(600px, 90%);
    >img{
        width: 100%;
        mix-blend-mode: multiply;
    }
`

const ButtonWrapper = styled.div`
    display : flex;
    gap: 1rem;
    margin: 1rem 0;
`
const Button = styled.button`
    background-color: ${p => p.filled ? "white" : "#C9A366"};
    color: ${p => p.filled ? "#C9A366" : "white"};
    border: 1px solid #C9A366;
    padding: 0.6rem 2rem;
    border-radius: 5px;
    cursor: pointer;
`

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false, error: {error: null, info: null}, isOpen: false};
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({error: {error, errorInfo: errorInfo.componentStack}})
  }

 

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryContainer  isOpen={this.state.isOpen} >
            <ImgContainer><img src={ErrorImg}/></ImgContainer>
            <ErrorMessage>Aaaah! Something went wrong</ErrorMessage>
            <ErrorDesc>Please bear with us as we rectify the problem. Your understanding is greatly appreciated.</ErrorDesc>
            <ErrorDesc>You may also refresh the page or try again later.</ErrorDesc>
            <ButtonWrapper>
                <Button filled={true} onClick={() =>  window.location.reload()}>Try Again</Button>
                <Button onClick={() => window.history.back()} >Go Back</Button>
            </ButtonWrapper>
            {
                this.state.error.error &&
                <pre onClick={() => this.setState({isOpen: !this.state.isOpen})}>
                    <AddIcon/>
                    {this.state.error.error.toString()}<br/>
                    {this.state.isOpen  && this.state.error.errorInfo}
                </pre>
            }
        </ErrorBoundaryContainer>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
