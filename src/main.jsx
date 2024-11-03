import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css'
import Chat from './components/Chat.jsx'
import Login from './components/Login.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Chat />
  },
  // {
  //   path: '/chat',
  //   element: <Chat />
  // },
  // {
  //   path: '/login',
  //   element: <Login />
  // }
]
  
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Chat />
  </StrictMode>,
)
