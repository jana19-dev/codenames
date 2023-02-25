import database from 'utils/firebase'

export default function useRoomLogs (room) {
  const visitorID = window.localStorage.getItem('visitorID')
  const roomOwner = room.owner

  const roomLogsRef = database().ref(`rooms/${room.name}/logs`)

  if (visitorID === roomOwner) {
    return roomLogsRef
  }

  // return a dummy logsRef if current user is not roomOwner
  return { push: () => { } }
}
