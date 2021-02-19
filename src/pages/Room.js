import { useState, useEffect } from 'react'

import LoadingRoom from 'components/LoadingRoom'
import Error from 'components/Error'
import RoomNotFound from 'components/RoomNotFound'
import JoinRoom from 'components/JoinRoom'
import GameRoom from 'components/GameRoom'

import firebase from 'utils/firebase'

import useSound from 'use-sound'
import soundEffect from 'sounds/soundEffect.mp3'

export default function Room ({ name }) {
  const [playSound] = useSound(soundEffect, { interrupt: true, volume: 0.4 })

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

  if (!currentUser) return <JoinRoom room={room} playSound={playSound} />

  return <GameRoom room={room} playSound={playSound} />
}
