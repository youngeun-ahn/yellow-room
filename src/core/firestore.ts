import { initializeApp } from 'firebase/app'
import { getFirestore, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'

/**
 * NOTE: 일반적으로 API Key 같은건 저장소나 환경 변수 같은걸로 숨겨두지만
 * firebase의 API Key는 공개되어도 괜찮다고 합니다.
 * @see https://haranglog.tistory.com/25
 */
const firebaseConfig = {
  apiKey: 'AIzaSyCYKd6Cd_MW1kfKzXt1xVzqq1vxglGbZAY',
  authDomain: 'frebern-yellow-room.firebaseapp.com',
  projectId: 'frebern-yellow-room',
  storageBucket: 'frebern-yellow-room.appspot.com',
  messagingSenderId: '947497776223',
  appId: '1:947497776223:web:f3502f6ef4a8bcb1b057ea',
}

const app = initializeApp(firebaseConfig)
export default getFirestore(app)

export function getDefaultConverter<T> () {
  return {
    toFirestore (_: T) {
      return _
    },
    fromFirestore (
      snapshot: QueryDocumentSnapshot<T>,
      options: SnapshotOptions,
    ): T {
      return snapshot.data(options)!
    },
  }
}
