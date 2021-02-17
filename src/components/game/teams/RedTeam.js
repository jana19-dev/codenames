import TeamCard from 'components/game/TeamCard'

import redPNG from 'images/red.png'

export default function RedTeam ({ room, roomData }) {
  const visitorID = window.localStorage.getItem('visitorID')

  const currentUser = roomData.users[visitorID]

  const remainingRedCount = roomData.words && Object.values(roomData.words).filter(({ agent, guessed }) => agent === 'red' && !guessed).length

  const redOperatives = Object.values(roomData.users).filter(user => user.team === 'red' && user.role === 'operative')
  const redSpymasters = Object.values(roomData.users).filter(user => user.team === 'red' && user.role === 'spymaster')

  const isCurrentUserJoined = currentUser.team && currentUser.role

  return (
    <TeamCard
      room={room}
      team='red'
      count={remainingRedCount}
      image={redPNG}
      operatives={redOperatives}
      spymasters={redSpymasters}
      isCurrentUserJoined={isCurrentUserJoined}
    />
  )
}
