import {
  Text,
  Image,
  Modal,
  Button,
  ModalFooter,
  ModalBody,
  ModalContent,
  ModalOverlay
} from '@chakra-ui/react'

import ErrorSVG from 'images/error.svg'

export default function Error ({ error }) {
  return (
    <Modal isOpen closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody d='flex' flexDir='column' py={4} textAlign='center' alignItems='center'>
          <Image ignoreFallback width='200px' src={ErrorSVG} alt='Error' py={4} />
          <Text color='red.600'>
            {error.message}
          </Text>
        </ModalBody>
        <ModalFooter d='flex' flexDir='column' alignItems='center'>
          <Button colorScheme='teal' onClick={() => { window.location.href = '/' }}>
            Refresh
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
