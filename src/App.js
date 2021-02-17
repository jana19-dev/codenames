import { useEffect } from 'react'

import { useRoutes } from 'hookrouter'

import FingerprintJS from '@fingerprintjs/fingerprintjs'

import Home from 'pages/Home'
import Room from 'pages/Room'

import {
  Box
} from '@chakra-ui/react'

import './App.css'

const routes = {
  '/room/:slug': ({ slug }) => <Room slug={slug} />
}

function App () {
  const routeResult = useRoutes(routes)

  useEffect(() => {
    // get the unique visitor identifier
    const loadVisitorID = async () => {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      window.localStorage.setItem('visitorID', result.visitorId)
    }
    if (!window.localStorage.getItem('visitorID')) {
      loadVisitorID()
    }
  }, [])

  return (
    <Box height='100vh' bgGradient='radial(orange.400, red.600)'>
      {routeResult || <Home />}
    </Box>
  )
}

export default App
