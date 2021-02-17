import TeamCard from 'components/game/TeamCard'

import bluePNG from 'images/blue.png'

export default function BlueTeam ({ room, roomData }) {
  const visitorID = window.localStorage.getItem('visitorID')

  const currentUser = roomData.users[visitorID]

  const remainingBlueCount = roomData.words && Object.values(roomData.words).filter(({ agent, guessed }) => agent === 'blue' && !guessed).length

  const blueOperatives = Object.values(roomData.users).filter(user => user.team === 'blue' && user.role === 'operative')

  const blueSpymasters = Object.values(roomData.users).filter(user => user.team === 'blue' && user.role === 'spymaster')

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
    />
  )
}
