// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom';
// import { signup } from '../services/auth'; 
// import Swal from 'sweetalert2'
// import { CheckCircle2 } from 'lucide-react';

// const SignupPage = () => {
//     const navigate = useNavigate()
//     const [form, setForm] = useState({ name: "", email: "", password: "" })
//     const [loading, setLoading] = useState(false)

//     const handleChange = (e) => {
//         setForm({
//             ...form,
//             [e.target.name]: e.target.value
//         })
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         if (!form.name || !form.email || !form.password) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "Fields Required",
//                 text: "Please fill out all identity routes.",
//                 timer: 2000,
//                 showConfirmButton: false
//             })
//             return
//         }

//         setLoading(true)
//         try {
//             const response = await signup({ 
//                 name: form.name, 
//                 email: form.email, 
//                 password: form.password 
//             })
            
//             if (response && (response.success || response.status === 201 || response.token)) {
            
//                 setTimeout(() => {
//                     navigate('/home') 
//                 }, 2000)
//             } else {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Registration Failed",
//                     text: response?.message || "Something went wrong during account setup."
//                 })
//             }
//         } catch (err) {
//             console.log(err)
//             Swal.fire({
//                 icon: "error",
//                 title: "System Execution Error",
//                 text: err.response?.data?.message || "Backend registration pipeline failed."
//             })
//         } finally {
//             setLoading(false)
//         }
//     }

//  return (
//   <div className="h-screen w-full bg-slate-100 flex items-center justify-center p-4 lg:p-8 overflow-hidden select-none">

//     <div className="w-full max-w-5xl h-full max-h-[640px] bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

      

//       {/* ================= left SIDE ================= */}
//       <div className="flex items-center justify-center p-6 h-full overflow-hidden">

//         <div className="w-full max-w-[360px] my-auto">

//           {/* Mobile Logo */}
//            <div className="flex items-center gap-2.5 mb-10">
//               <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-teal-500 flex items-center justify-center">
//                 <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
//               </div>
//               <span className="text-lg font-bold text-[#171923] tracking-tight">
//                 Bitrixmini
//               </span>
//             </div>

//           {/* Heading */}
//           <div >

//             <h2 className="text-2xl font-bold text-slate-900">
//               Get Started!
//             </h2>

//             <p className="text-sm text-slate-500 mt-1">
//               Create your new TaskBoard account
//             </p>

//           </div>


//           {/* Connected onSubmit layout layer here */}
//           <form className="mt-6 space-y-3.5" onSubmit={handleSubmit}>

//             {/* Full Name Input */}
//             <div>

//               <label className="block text-xs font-semibold text-slate-800 mb-1">
//                 Full Name
//               </label>

//               <div className="relative">

//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                   👤
//                 </span>

//                 <input
//                   type="text"
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   placeholder="John Doe"
// className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400 text-sm"                />

//               </div>

//             </div>

//             {/* Email Input */}
//             <div>

//               <label className="block text-xs font-semibold text-slate-800 mb-1">
//                 Email Address
//               </label>

//               <div className="relative">

//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                   ✉
//                 </span>

//                 <input
//                   type="email"
//                   name="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   placeholder="you@example.com"
// className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400 text-sm"                />

//               </div>

//             </div>


//             {/* Password Input */}
//             <div>

//               <label className="block text-xs font-semibold text-slate-800 mb-1">
//                 Password
//               </label>

//               <div className="relative">

//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                   🔒
//                 </span>

//                 <input
//                   type="password"
//                   name="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="Create a strong password"
// className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400 text-sm"                />

//               </div>

//             </div>


//             {/* Signup Button with disabled engine toggle state */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:-translate-y-0.5 transition text-sm mt-3 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Creating Account...' : 'Sign Up'}
//               {!loading && <span className="text-lg">→</span >}
//             </button>

//           </form>

//           {/* Back to Login */}
//           <p className="text-center text-xs text-slate-500 mt-5">

//             Already have an account?{" "}

//             <Link to="/login" className="text-blue-600 font-bold hover:underline ml-1">
//                 Login
//             </Link>

//           </p>

//         </div>

//       </div>

//       <div className="hidden lg:block relative bg-[#1a2638] w-full h-full min-h-[600px]">
//           <img
//             src="/collabrative-logo.jpg"
//             alt="Visual Graphic"
//             className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
//           />
//         </div>


//     </div>

//   </div>
// );
// }

// export default SignupPage;
