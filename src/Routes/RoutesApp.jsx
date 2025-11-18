import { BrowserRouter, Route, Routes } from "react-router-dom"


import Login from '../pages/Login/Login'
import Home from '../pages/Home/Home'
import User from '../pages/User/User'
import RegisterStep1 from '../pages/Register/RegisterStep1'
import RegisterStep2 from '../pages/Register/RegisterStep2'

import Product from '../pages/Product/Product'

const RoutesApp = () => {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/user' element={<User/>}/>
      <Route path='/register' element={<RegisterStep1/>} />
      <Route path='/register/address' element={<RegisterStep2/>} />
      <Route path='*' element= {<h1>Not found</h1>}/>
      <Route path='/product-details' element={<Product/>}/>
    </Routes>
    
    </BrowserRouter>
)
}

export default RoutesApp