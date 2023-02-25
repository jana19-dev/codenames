import { useEffect } from 'react'

import database from 'utils/firebase'

export default function useUserDisconnect (room) {
  const visitorID = window.localStorage.getItem('visitorID')

  const roomOwner = room.owner

  useEffect(() => {
    // offline presence check

    // stores the timestamp of my last disconnect (the last time I was seen online)
    const userLastOnlineRef = database().ref(`rooms/${room.name}/users/${visitorID}/lastOnline`)

    // stores the timestamp of owner's last disconnect (the last time owner was seen online)
    const ownerLastOnlineRef = database().ref(`rooms/${room.name}/lastOnline`)

    // listen for connected event
    database().ref('.info/connected').on('value', (snap) => {
      if (snap.val() === true) {
        // we're connected (or reconnected)! remove my lastOnline
        userLastOnlineRef.remove()

        // when I disconnect, update the last time I was seen online
        userLastOnlineRef.onDisconnect().set(database.ServerValue.TIMESTAMP)

        // if I am the room owner
        if (visitorID === roomOwner) {
          // on connect (or reconnect), remove owner lastOnline
          ownerLastOnlineRef.remove()
          // on disconnect, update the last time owner was online
          ownerLastOnlineRef.onDisconnect().set(database.ServerValue.TIMESTAMP)
        }
      }
    })
  }, [])
}
