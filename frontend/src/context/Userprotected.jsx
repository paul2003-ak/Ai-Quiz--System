import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './Authcontext';
import axios from 'axios'

export const userdatacontext=createContext()

const Userprotected = ({children}) => {
    const [userdata, setUserdata] = useState("")

    const {serverUrl}= useContext(authDataContext);

    const getcurruser=async ()=>{
        try{
            const result=await axios.get(serverUrl + "/api/auth/getcurruser",{withCredentials:true})
            setUserdata(result.data);
            console.log(result.data);

        }catch(error){
            setUserdata(null)
            console.log(error)
        }
    }

    useEffect(()=>{
        getcurruser()
    },[])

    const value={
        userdata, setUserdata,getcurruser
    }

  return (
   <div>
   <userdatacontext.Provider value={value}>
            {children} 
        </userdatacontext.Provider>
   </div>
  )
}

export default Userprotected