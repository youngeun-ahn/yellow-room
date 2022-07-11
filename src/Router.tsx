import {
  Routes, Route, Navigate, Outlet, BrowserRouter,
} from 'react-router-dom'
import { Box } from '@mui/material'

import Lobby from '@page/Lobby'
import Room from '@page/Room'

function Page () {
  return (
    <Box className="f-center h-full px-12 sm:px-24 bg-yellow-300">
      <Outlet />
    </Box>
  )
}

function Router () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />}>
          <Route index element={<Lobby />} />
          <Route path="room/:id" element={<Room />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
