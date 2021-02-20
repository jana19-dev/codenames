import { useState, useEffect } from 'react'

import * as serviceWorker from './serviceWorkerRegistration'

import { useRoutes } from 'hookrouter'

import FingerprintJS from '@fingerprintjs/fingerprintjs'

import Home from 'pages/Home'
import Room from 'pages/Room'

import {
  Box,
  Text,
  Button,
  useToast
} from '@chakra-ui/react'

import './App.css'

const routes = {
  '/rooms/:name': ({ name }) => <Room name={name} />
}

function App () {
  const toast = useToast()

  const routeResult = useRoutes(routes)

  const [waitingWorker, setWaitingWorker] = useState()
  const [newVersionAvailable, setNewVersionAvailable] = useState()

  const onServiceWorkerUpdate = registration => {
    setWaitingWorker(registration && registration.waiting)
    setNewVersionAvailable(true)
  }

  const updateServiceWorker = () => {
    waitingWorker && waitingWorker.postMessage({ type: 'SKIP_WAITING' })
    setNewVersionAvailable(false)
    window.location.reload()
  }

  useEffect(() => {
    // service worker
    if (process.env.NODE_ENV === 'production') {
      serviceWorker.register({ onUpdate: onServiceWorkerUpdate })
    }
    if (newVersionAvailable) {
      toast({
        render: () => (
          <Box p={3} textAlign='center' borderRadius='xl' bg='white'>
            <Text fontWeight='bold' mb={2}>A new version has been released</Text>
            <Button colorScheme='yellow' size='lg' onClick={updateServiceWorker}>Update</Button>
          </Box>
        ),
        position: 'top',
        duration: null,
        isClosable: false
      })
    }
  }, [newVersionAvailable])

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
    <Box minHeight='100vh' bgGradient='radial(orange.400, red.600)'>
      {routeResult || <Home />}
    </Box>
  )
}

export default App
