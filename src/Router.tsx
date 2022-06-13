import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Login from '@page/Login'
import Room from '@page/Room'

function Router () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Login />} />
          <Route path="/list" element={<Room newRoom />} />
          <Route path="/list/:id" element={<Room />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
