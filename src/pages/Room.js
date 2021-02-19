import { useState, useEffect } from 'react'

import LoadingRoom from 'components/LoadingRoom'
import Error from 'components/Error'
import RoomNotFound from 'components/RoomNotFound'
import JoinRoom from 'components/JoinRoom'
import GameRoom from 'components/GameRoom'

import firebase from 'utils/firebase'

export default function Room ({ name }) {
  const visitorID = window.localStorage.getItem('visitorID')

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const [room, setRoom] = useState({})

  useEffect(() => {
    // find the room and check if the current user is joined
    firebase.ref('rooms').child(name).on('value', (snapshot) => {
      setRoom(snapshot.val())
      setIsLoading(false)
    }, setError)
  }, [])

  if (isLoading) return <LoadingRoom />

  if (error) return <Error error={error} />

  if (!room) return <RoomNotFound name={name} />

  const currentUser = room && room.users && room.users[visitorID]

  if (!currentUser) return <JoinRoom room={room} />

  return <GameRoom room={room} />
}
