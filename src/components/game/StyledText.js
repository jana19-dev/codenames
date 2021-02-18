import {
  Flex,
  Text
} from '@chakra-ui/react'

export default function StyledText ({ value }) {
  return (
    <Flex
      borderRadius='xl'
      bgGradient='linear(to-r, red.600, orange.600)'
      width='fit-content'
      p={2}
      color='white'
      alignItems='center'
    >
      <Text
        fontWeight='bold'
        fontSize={['sm', 'lg', '2xl']}
        letterSpacing={['0.5px', '1px']}
      >
        {value}
      </Text>
    </Flex>
  )
}
