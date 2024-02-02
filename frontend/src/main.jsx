import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './reset.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "react-hot-toast"
import { Provider } from 'react-redux'
import { store } from "./redux/store.js"

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  // </React.StrictMode>
  , 
)
