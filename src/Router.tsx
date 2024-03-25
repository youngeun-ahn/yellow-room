import {
  Routes, Route, Navigate, Outlet, BrowserRouter,
} from 'react-router-dom'
import { Box } from '@mui/material'

import Lobby from '@page/lobby/Lobby'
import Room from '@page/room/Room'
import { PropsWithChildren, Suspense } from 'react'
import HelpPage from '@page/help/HelpPage'

function Container ({ children }: PropsWithChildren) {
  return (
    <Box className="f-center h-full px-12 sm:px-24 bg-yellow-300">
      {children}
    </Box>
  )
}

function Page () {
  return (
    <Container>
      <Outlet />
    </Container>
  )
}

function Router () {
  return (
    <BrowserRouter>
      <Suspense fallback={<Container />}>
        <Routes>
          <Route path="/" element={<Page />}>
            <Route index element={<Lobby />} />
            <Route path="room/:id" element={<Room />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default Router
