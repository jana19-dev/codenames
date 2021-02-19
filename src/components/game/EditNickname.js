import { useState, useEffect, useRef } from 'react'

import {
  Input,
  HStack,
  Textarea,
  FormLabel,
  IconButton,
  FormControl,
  FormErrorMessage
} from '@chakra-ui/react'

import {
  BiX,
  BiEdit,
  BiCheck
} from 'react-icons/bi'

import useSound from 'use-sound'
import soundEffect from 'sounds/soundEffect.mp3'

const EditableControls = (props) => {
  const [play] = useSound(soundEffect)

  const inputRef = useRef()
  const editButtonRef = useRef()

  const [isEditing, setIsEditing] = useState(false)

  const {
    type = 'text',
    name = 'inputFieldName',
    defaultValue = '',
    label = '',
    placeholder = 'Type here ...',
    onSubmit = console.log,
    isLoading = false
  } = props

  const InputElement = type === 'textarea' ? Textarea : Input

  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    if (defaultValue) setValue(defaultValue)
  }, [defaultValue])

  const handleOnSubmit = (e) => {
    play()
    e.preventDefault()
    setIsEditing(false)
    editButtonRef.current.focus()
    if (value !== defaultValue) {
      onSubmit(value)
    }
  }

  const onEdit = () => {
    play()
    setIsEditing(true)
    inputRef.current.focus()
    inputRef.current.setSelectionRange(0, value.length)
  }

  const onCancel = () => {
    play()
    setValue(defaultValue)
    setIsEditing(false)
    setTimeout(() => editButtonRef.current.focus(), 1)
  }

  return (
    <HStack as='form' onSubmit={handleOnSubmit} width='100%'>
      <FormControl isInvalid={!value}>
        <FormLabel htmlFor={name} mb={0}>{label}</FormLabel>
        <HStack spacing={4}>
          <InputElement
            ref={inputRef}
            type={type}
            name={name}
            isReadOnly={!isEditing}
            placeholder={placeholder}
            variant={isEditing ? 'outline' : 'unstyled'}
            value={value}
            onChange={e => setValue(e.target.value.trim())}
          />
          <IconButton
            size='sm'
            icon={<BiCheck fontSize='18px' />}
            isDisabled={!value}
            type='submit'
            display={!isEditing ? 'none' : 'inline-flex'}
            isLoading={isLoading}
          />
          <IconButton
            size='sm'
            icon={<BiX fontSize='18px' />}
            onClick={onCancel}
            display={!isEditing ? 'none' : 'inline-flex'}
            isLoading={isLoading}
          />
          <IconButton
            size='sm'
            icon={<BiEdit fontSize='18px' />}
            onClick={onEdit}
            display={isEditing ? 'none' : 'inline-flex'}
            ref={editButtonRef}
            isLoading={isLoading}
          />
        </HStack>
        <FormErrorMessage>
          {!value && 'Nickname cannot be left blank'}
        </FormErrorMessage>
      </FormControl>
    </HStack>
  )
}

export default EditableControls
