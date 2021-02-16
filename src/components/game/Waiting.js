import {
  Modal,
  VStack,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  CircularProgress
} from '@chakra-ui/react'

export default function Waiting () {
  return (
    <Modal isOpen isCentered size='xs'>
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalHeader fontSize='2xl' textAlign='center'>
          Waiting for the room owner to start the game
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
