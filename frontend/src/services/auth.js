import { API } from "./api";

export const createUser=(data)=>{
  return API.post('/auth/create-user',data).then(res=>res.data)
}

export const login=(data)=>{
    return API.post('/auth/login',data).then(res=>res.data)
}

export const verifyUser=()=>{
  return API.get('/auth/verify-user').then(res=>res.data)
}

export const logout=()=>{
  return API.post('/auth/logout').then(res=>res.data)
}

export const getUserListManagment=()=>{
  return API.get('/auth/managment-list').then(res=>res.data)
}

export const forgetPassword=(data)=>{
  return API.post('/auth/forget-password',data).then(res=>res.data)
}

export const resetPassword=(token,data)=>{
  return API.post(`/auth/reset-password/${token}`,data).then(res=>res.data)
}

export const updateImage=(data)=>{
  return API.post('profile-img',data).then(res=>res.data)
}