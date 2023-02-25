import useServiceWorker from 'hooks/useServiceWorker'
import useFingerprint from 'hooks/useFingerprint'

import { useRoutes } from 'hookrouter'

import Home from 'pages/Home'
import Room from 'pages/Room'

import { Box } from '@chakra-ui/react'

import './App.css'

const routes = {
  '/rooms/:name': ({ name }) => <Room name={name} />
}

function App () {
  const routeResult = useRoutes(routes)

  useServiceWorker()
  useFingerprint()

  return (
    <Box minHeight='100vh' bgGradient='radial(orange.400, red.600)'>
      {routeResult || <Home />}
    </Box>
  )
}

export default App
