import {
  Text,
  Modal,
  Image,
  VStack,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalOverlay
} from '@chakra-ui/react'

import roomNotFoundSVG from 'images/roomNotFound.svg'

export default function RoomNotFound ({ slug }) {
  return (
    <Modal isOpen isCentered size='xs'>
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalHeader fontSize='2xl' textAlign='center'>Room Not Found</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <Image maxW='200px' ignoreFallback src={roomNotFoundSVG} alt='Room Not Found' />
            <Text fontWeight='bold'>{slug}</Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
