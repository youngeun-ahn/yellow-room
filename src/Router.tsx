import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import Login from '@page/Login'
import Room from '@page/Room'

function Router () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/room/:id" element={<Room />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
