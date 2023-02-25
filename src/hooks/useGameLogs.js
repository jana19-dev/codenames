import database from 'utils/firebase'

export default function useGameLogs (room) {
  return database().ref(`rooms/${room.name}/logs`)
}
