import { BrowserRouter, Route, Routes } from "react-router-dom"


import Login from '../pages/Login/Login'
import Home from '../pages/Home/Home'
import User from '../pages/User/User'
import RegisterStep1 from '../pages/Register/RegisterStep1'
import RegisterStep2 from '../pages/Register/RegisterStep2'
import Cart from '../pages/Cart/Cart'
import Product from '../pages/Product/Product'
import Layout from '../components/Layout/Layout'

const RoutesApp = () => {
  return (
  <BrowserRouter>
    <Routes>
      {/* Routes without header */}
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<RegisterStep1/>} />
      <Route path='/register/address' element={<RegisterStep2/>} />

      {/* Routes with header/layout */}
      <Route element={<Layout/>}>
        <Route path='/' element={<Home/>} />
        <Route path='/user' element={<User/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/product-details' element={<Product/>} />
        <Route path='/product-details/:id' element={<Product/>} />
      </Route>

      <Route path='*' element= {<h1>Not found</h1>}/>
    </Routes>
    
    </BrowserRouter>
)
}

export default RoutesApp