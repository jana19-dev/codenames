import { useState, useEffect } from 'react'

import LoadingRoom from 'components/LoadingRoom'
import JoinRoom from 'components/JoinRoom'
import RoomNotFound from 'components/RoomNotFound'
import GameRoom from 'components/GameRoom'
import Error from 'components/Error'

import firebase from 'utils/firebase'

export default function Room ({ name }) {
  const room = firebase.ref('rooms').child(name)

  const visitorID = window.localStorage.getItem('visitorID')

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isCurrentUserJoined, setIsCurrentUserJoined] = useState(false)

  const [roomData, setRoomData] = useState({})

  useEffect(() => {
    // find the room and check if the current user is joined
    room.on('value', (snapshot) => {
      const roomData = snapshot.val()
      setRoomData(roomData)
      if (roomData) {
        const currentUser = roomData.users && roomData.users[visitorID]
        setIsCurrentUserJoined(currentUser)
      }
      setIsLoading(false)
    }, setError)
  }, [])

  if (isLoading) return <LoadingRoom />

  if (error) return <Error error={error} />

  if (!roomData) return <RoomNotFound name={name} />

  if (!isCurrentUserJoined) return <JoinRoom room={room} />

  return <GameRoom room={room} roomData={roomData} />
}
