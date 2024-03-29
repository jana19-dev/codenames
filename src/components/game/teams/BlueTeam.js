import TeamCard from 'components/game/TeamCard'

import bluePNG from 'images/blue.png'

export default function BlueTeam ({ room, playSound }) {
  const visitorID = window.localStorage.getItem('visitorID')

  const currentUser = room.users[visitorID]

  const remainingBlueCount = room.words && Object.values(room.words).filter(({ agent, guessed }) => agent === 'blue' && !guessed).length

  const blueOperatives = Object.values(room.users).filter(user => user.team === 'blue' && user.role === 'operative')

  const blueSpymasters = Object.values(room.users).filter(user => user.team === 'blue' && user.role === 'spymaster')

  const isCurrentUserJoined = currentUser.team && currentUser.role

  return (
    <TeamCard
      room={room}
      team='blue'
      count={remainingBlueCount}
      image={bluePNG}
      operatives={blueOperatives}
      spymasters={blueSpymasters}
      isCurrentUserJoined={isCurrentUserJoined}
      playSound={playSound}
    />
  )
}
