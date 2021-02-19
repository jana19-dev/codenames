import { useState, useEffect } from 'react'

import firebase from 'utils/firebase'

import {
  Text,
  VStack,
  CircularProgress
} from '@chakra-ui/react'

import { shuffle } from 'lodash'

import Error from 'components/Error'

export default function GenerateWords ({ room }) {
  const [error, setError] = useState(false)

  const generateWords = () => {
    firebase.ref('words').on('value', async (snapshot) => {
      const allWords = snapshot.val()
      const randomWords = shuffle(allWords).slice(0, 25)
      const doubleAgent = {
        label: randomWords[0].toUpperCase(),
        agent: 'double',
        guessed: false,
        hintedBy: []
      }
      const blueAgents = randomWords.slice(1, 9).map(label => ({
        label: label.toUpperCase(),
        agent: 'blue',
        guessed: false,
        hintedBy: []
      }))
      const redAgents = randomWords.slice(9, 18).map(label => ({
        label: label.toUpperCase(),
        agent: 'red',
        guessed: false,
        hintedBy: []
      }))
      const bystanders = randomWords.slice(18, 25).map(label => ({
        label: label.toUpperCase(),
        agent: 'bystander',
        guessed: false,
        hintedBy: []
      }))
      const words = {}
      for (const word of shuffle([doubleAgent, ...blueAgents, ...redAgents, ...bystanders])) {
        words[word.label] = word
      }
      await firebase.ref('rooms').child(room.name).child('words').set(words)
      await firebase.ref('rooms').child(room.name).child('state').set({
        turn: 'red_spymaster'
      })
    }, setError)
  }

  useEffect(() => {
    generateWords()
  }, [])

  if (error) return <Error error={error} />

  return (
    <VStack justifyContent='center'>
      <Text fontWeight='bold' fontSize='xl'>Generating Words</Text>
      <CircularProgress isIndeterminate color='yellow.300' thickness='16px' />
    </VStack>
  )
}
