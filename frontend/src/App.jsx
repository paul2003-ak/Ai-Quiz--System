import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import  Home  from './pages/Home'
import Login from './pages/Login'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import { userdatacontext } from './context/Userprotected'

const App = () => {
  const {userdata}=useContext(userdatacontext)
  return (
    <Routes>
      <Route path="/signup" element={!userdata ? <Register/>:<Navigate to={"/"}/> }/>
      <Route path="/" element={userdata ? <Home/> : <Navigate to={"/signup"}/>}/>
      <Route path="/login" element={!userdata ? <Login/> : <Navigate to={"/"}/>}/>
      <Route path="/quiz" element={userdata ? <Quiz/> : <Navigate to={"/signup"}/>}/>
      <Route path="/result" element={ userdata ? <Result/> : <Navigate to={"/signup"}/>}/>

    </Routes>
  )
}

export default App