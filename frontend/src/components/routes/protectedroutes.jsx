import React from "react";
import {Outlet,Navigate} from 'react-router-dom'
import { useAuth } from "../../../Context/authcontext";

const ProtectedRoutes=()=>{
    const {user}=useAuth()

     return user ? <Outlet/> : <Navigate to="/login" replace/>
}

export default ProtectedRoutes;