import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Store, {persistor} from "./store/Store.js"
import {Provider} from "react-redux"
import { PersistGate } from 'redux-persist/integration/react';
import {createBrowserRouter,
  RouterProvider,} from "react-router-dom"
import Signup from './component/Signup.jsx'
 import Login from './component/Login.jsx'
import Home from './component/Home.jsx'
import AuthLayout from "./component/AuthLayout.jsx"


  const router = createBrowserRouter([
    {
      path: '/',
      element:
        <App />,
      children: [
        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/signin',
          element: <Signup />,
        },

        {
          path: '/',
          element:
          <AuthLayout>
            <Home />
          </AuthLayout>
        
          ,
        },
      
      ],
    }
  ])

createRoot(document.getElementById('root')).render(
 
    <Provider store={Store}> 
    <StrictMode>
     <PersistGate loading={false} persistor={persistor}>
       <RouterProvider router={router}/>
      </PersistGate>
      </StrictMode>
    </Provider>
  ,
)
