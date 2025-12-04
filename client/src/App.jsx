import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './layouts/Layout'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import Board from './pages/Board/Board'
import Print from './layouts/print/Print'
import Order from './pages/Order/Order'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/board" element={<Board />}/>
          <Route path="/order" element={<Order />}/>
        </Route>
        <Route path='/print' element={<Print />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App