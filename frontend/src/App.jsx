import Login from 'pages/auth/Login/Login.jsx'
import Dashboard from './pages/dashboard/Dashboard'
import NavBar from './components/NavBar'
import SideBar from './components/SideBar'

import { Routes, Route, Outlet, Navigate} from 'react-router-dom'
import './App.css'
import styled from "styled-components"
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ErrorBoundary from './components/ErrorBoundry'
import Employes from './pages/employes/Clients'
import ForgotPasswordForm from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Profile from "./pages/profile/Profile"
import Products from './pages/products/Products'
import ProductPage from './pages/SingleProduct/SingleProduct'
import CartPage from './pages/cart/Cart'

function PublicRoute() {
  const user = useSelector(d => d.user.info)
  return !user ? <ErrorBoundary><Outlet/></ErrorBoundary> : <Navigate to="/"/>
}
function AdminRoutes() {
  const user = useSelector(d => d.user.info)
  if(!user) return <Navigate to="/login"/>
  return user.isAdmin ? <ErrorBoundary><Outlet/></ErrorBoundary> : <Navigate to="/profile"/>
}
function PrivateRoute() {
  const user = useSelector(d => d.user.info)
  return user ? <ErrorBoundary><Outlet/></ErrorBoundary> : <Navigate to="/login"/>
}

function App() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  const user = useSelector(d => d.user.info)  

  return (
    <>
      { user && <NavBar setSideBar={setIsSideBarOpen} />}
      <Main>
        { user && <SideBar isOpen={isSideBarOpen} setOpen={setIsSideBarOpen} />}
        <Content isUser={user ? true : false}>
          <Routes>
            <Route element={<PrivateRoute/>} >
              <Route path='/' element={<Dashboard/>} />
              <Route path='/profile' element={<Profile/>} />
              <Route path='/product/:id' element={<ProductPage/>} />
              <Route path='/cart' element={<CartPage/>} />

            </Route>

            <Route element={<AdminRoutes/>}>
              <Route path='/users' element={<Employes/>} />
              <Route path='/products' element={<Products/>} />
            </Route>

            <Route element={<PublicRoute/>}>
              <Route path='/login' element={<Login/>} />
              <Route path='/forgot-password' element={<ForgotPasswordForm/>} />
              <Route path='/reset-password/:id' element={<ResetPassword/>} />
            </Route>
          </Routes>
        </Content>
      </Main>
    </>
  )
}

export default App 

const Main = styled.div`
  display: flex;
  align-items: stretch;
  
`
const Content = styled.div`
  width: 100%;
  isolation: isolate;
  overflow: auto;
  padding: ${p => p.isUser ? "1rem" : 0};
  height: ${p => p.isUser ? "calc(100dvh - 60px)" : "100dvh"};
`
