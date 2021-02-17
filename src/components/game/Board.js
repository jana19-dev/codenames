import {
  Grid
} from '@chakra-ui/react'

import Card from 'components/game/Card'

export default function Board ({ room, roomData }) {
  return (
    <Grid
      templateColumns='1fr 1fr 1fr 1fr 1fr'
      gap={[1, 2]}
      height='fit-content'
    >
      {roomData.words.map((word, idx) => (
        <Card
          key={idx}
          word={word}
          room={room}
          roomData={roomData}
        />
      ))}
    </Grid>
  )
}
