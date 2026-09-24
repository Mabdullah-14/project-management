import { useEffect, useState } from 'react'
import { BrowserRouter,Route,Routes,Navigate } from 'react-router-dom'
import PublicRoutes from './components/routes/publicroutes'
import ProtectedRoutes from './components/routes/protectedroutes'
import LoginPage from  './pages/login'
import Boardpage from './pages/boardpage'
import AddTaskModal from './components/card/Addtaskmodal'
import {registerRateLimitTrigger} from './services/api'
import Blockscreen from './pages/blockscreen'
import ForgetPassword from './pages/forgetPassword'
import ResetPassword from './pages/resetPassword'
import './App.css'
import { useAuth } from '../Context/authcontext'

function App() {
  const {setIsBlocked,setBlockMessage}=useAuth()

  useEffect(()=>{
    registerRateLimitTrigger((status,message)=>{
      setIsBlocked(status)
      setBlockMessage(message)
    })
  },[setIsBlocked,setBlockMessage])
 

  return (
    

    <BrowserRouter>
    <Blockscreen/>
    <Routes>
      <Route element={<PublicRoutes/>}>
        
        {/* <Route path='/signup' element={<Signup/>}/> */}
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/forget-password' element={<ForgetPassword/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
    
        
          
         
       
      </Route>

      <Route element={<ProtectedRoutes/>}>
      <Route path='/home'  element={<Boardpage/>}/>
      <Route path='/addtask' element={<AddTaskModal/>}/>
        


      </Route>

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
    </BrowserRouter>
    
 
  )
}

export default App
