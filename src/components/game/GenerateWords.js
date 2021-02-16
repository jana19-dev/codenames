import { useEffect } from 'react'

import {
  Modal,
  VStack,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  CircularProgress
} from '@chakra-ui/react'

import { shuffle } from 'lodash'

import randomPictionaryWords from 'word-pictionary-list'

export default function GenerateWords ({ room }) {
  const generateWords = () => {
    const randomWords = randomPictionaryWords({ exactly: 25, formatter: (word) => word.toUpperCase() })
    const doubleAgent = {
      label: randomWords[0],
      agent: 'double',
      guessed: false,
      guessedBy: ''
    }
    const blueAgents = randomWords.slice(1, 9).map(label => ({
      label,
      agent: 'blue',
      guessed: false,
      guessedBy: ''
    }))
    const redAgents = randomWords.slice(9, 18).map(label => ({
      label,
      agent: 'red',
      guessed: false,
      guessedBy: ''
    }))
    const bystanders = randomWords.slice(18, 25).map(label => ({
      label,
      agent: 'bystander',
      guessed: false,
      guessedBy: ''
    }))
    const words = room.child('words')
    words.set(shuffle([doubleAgent, ...blueAgents, ...redAgents, ...bystanders]))
  }

  useEffect(() => {
    generateWords()
  }, [])

  return (
    <Modal isOpen isCentered size='xs'>
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalHeader fontSize='2xl' textAlign='center'>
          Generating Words
        </ModalHeader>
        <ModalBody>
          <VStack>
            <CircularProgress isIndeterminate color='teal.300' thickness='16px' />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
