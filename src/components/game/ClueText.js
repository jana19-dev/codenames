import {
  Flex,
  Text
} from '@chakra-ui/react'

export default function ClueText ({ clue, count }) {
  return (
    <Flex
      justifyItems='center'
      borderRadius='xl'
      bgGradient='radial(white, transparent)'
      p={2}
      color='white'
      alignItems='center'
      maxW={['350px', '500px']}
      overflowX='auto'
    >
      <Text
        fontWeight='bold'
        fontSize='3xl'
        letterSpacing={['0.5px', '1px']}
        color='black'
      >
        {clue} 🤞 {count}
      </Text>
    </Flex>
  )
}
