import TeamCard from 'components/game/TeamCard'

import redPNG from 'images/red.png'

export default function RedTeam ({ room, playSound }) {
  const visitorID = window.localStorage.getItem('visitorID')

  const currentUser = room.users[visitorID]

  const remainingRedCount = room.words && Object.values(room.words).filter(({ agent, guessed }) => agent === 'red' && !guessed).length

  const redOperatives = Object.values(room.users).filter(user => user.team === 'red' && user.role === 'operative')
  const redSpymasters = Object.values(room.users).filter(user => user.team === 'red' && user.role === 'spymaster')

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
      playSound={playSound}
    />
  )
}
