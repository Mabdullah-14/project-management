import React,{useState} from 'react'
import { Link,useParams,useNavigate } from 'react-router-dom'
import {resetPassword}  from  '../services/auth'
import Swal from 'sweetalert2'

const ResetPassword = () => {
    const {token}=useParams()
    const navigate=useNavigate()
    const [loading,setLoading]=useState(false)
    const [password,setPassword]=useState("")

    const handleSubmit=async(e)=>{
        e.preventDefault()
        if(!password){
            Swal.fire({
                icon:'warning',
                title:"Password required",
                text:"Please enter valid Password"
            })
           
        }
        try{
            setLoading(true)
            const res=await resetPassword(token,{password})
            Swal.fire({
                icon:'success',
                title:"success",
                text:"Password updated successffuly"
            })
            setPassword('')
            navigate('/login')

        }catch(error){
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Something went wrong.",
            })
        } finally{
            setLoading(false)
        }
    }
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
        <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8'>
            <div className='text-center mb-5'>
                <h2 className="text-3xl font-bold text-gray-800">
            Reset Password
          </h2>
          <p className="text-gray-500 mt-2">
            Enter your new password below.
          </p>
            </div>
            <form onSubmit={handleSubmit}>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input type="password"
            required
            placeholder='Enter new Password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className=" mb-5 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <button
            type='submit'
            disabled={loading}
            className="mb-3 w-full bg-slate-800 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-60"
            >
               {loading ? "Resetting..." : "Reset Password"}
                </button>
                <div className="text-center">
            <Link
              to="/login"
              className="text-slate-600 hover:text-blue-700 font-medium"
            >
              ← Back to Login
            </Link>
          </div>
            </form>
            
        </div>
      
    </div>
  )
}

export default ResetPassword
