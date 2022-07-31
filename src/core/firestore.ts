import { initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics'
import { getFirestore, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'

/**
 * NOTE:
 * firebase의 API Key는 적절한 조치를 취해두면 공개되어도 괜찮습니다.
 * 이 프로젝트에서는 HTTP 레퍼러 제한을 걸어둡니다.
 * @see https://firebase.google.com/docs/projects/api-keys#apply-restrictions
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: 'frebern-yellow-room.firebaseapp.com',
  projectId: 'frebern-yellow-room',
  storageBucket: 'frebern-yellow-room.appspot.com',
  messagingSenderId: '947497776223',
  appId: '1:947497776223:web:f3502f6ef4a8bcb1b057ea',
  measurementId: 'G-64F0VN3JFC',
}

const app = initializeApp(firebaseConfig)
// export const analytics = getAnalytics(app)
export default getFirestore(app)

/** Firestore 문서와 코드쪽 도메인 모델을 변환 */
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
