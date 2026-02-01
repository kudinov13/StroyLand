import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Customers from './pages/Customers'
import Manufacturers from './pages/Manufacturers'
import Suppliers from './pages/Suppliers'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/partners/customers" element={<Customers />} />
        <Route path="/partners/manufacturers" element={<Manufacturers />} />
        <Route path="/partners/suppliers" element={<Suppliers />} />
      </Route>
    </Routes>
  )
}

export default App
