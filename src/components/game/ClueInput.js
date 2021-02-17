import { useState } from 'react'

import {
  Input,
  Button,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react'

export default function ClueInput ({ room }) {
  const [clue, setClue] = useState('')

  const onSendClue = (e) => {
    e.preventDefault()
    console.log(clue)
  }

  return (
    <InputGroup
      size='lg'
      as='form'
      onSubmit={onSendClue}
      maxW='400px'
      bgGradient='radial(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.75))'
      borderRadius='xl'
    >
      <Input
        fontWeight='bold'
        color='white'
        border='none'
        justifySelf='flex-end'
        placeholder='Type your clue here'
        value={clue}
        onChange={e => setClue(e.target.value.trim().toUpperCase())}
      />
      <InputRightElement width='6rem' mr={1}>
        <Button
          size='md'
          colorScheme='yellow'
          type='submit'
          isDisabled={!clue}
        >
          Give Clue
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}
