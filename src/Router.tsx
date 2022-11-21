import {
  Routes, Route, Navigate, Outlet, BrowserRouter,
} from 'react-router-dom'
import { Box } from '@mui/material'

import Lobby from '@page/Lobby'
import Room from '@page/Room'
import { PropsWithChildren, Suspense } from 'react'

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
      <Suspense fallback={<Container>LOADING</Container>}>
        <Routes>
          <Route path="/" element={<Page />}>
            <Route index element={<Lobby />} />
            <Route path="room/:id" element={<Room />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default Router
