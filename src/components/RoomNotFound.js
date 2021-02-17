import {
  Text,
  Modal,
  Image,
  Button,
  VStack,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalOverlay
} from '@chakra-ui/react'

import roomNotFoundSVG from 'images/roomNotFound.svg'

export default function RoomNotFound ({ name }) {
  return (
    <Modal isOpen isCentered size='xs'>
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalHeader fontSize='2xl' textAlign='center'>Room Not Found</ModalHeader>
        <ModalBody>
          <VStack spacing={8}>
            <Image maxW='200px' height='150px' ignoreFallback src={roomNotFoundSVG} alt='Room Not Found' />
            <Text fontWeight='bold'>{name}</Text>
            <Button colorScheme='yellow' onClick={() => {window.location.href = '/' }}>
              Go Home
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
