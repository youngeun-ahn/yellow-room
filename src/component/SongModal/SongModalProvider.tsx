import { Song } from '@core/query'
import {
  createContext, useContext, useReducer,
  Dispatch, Reducer, PropsWithChildren,
} from 'react'

interface Context {
  song?: Song
  open: boolean
  mode?: Mode
}
const defaultContext: Context = { open: false }

type Action =
  | { type: 'OPEN', song?: Song }
  | { type: 'CLOSE' }

const reducer: Reducer<Context, Action> = (state, action) => {
  switch (action.type) {
    case 'OPEN':
      return {
        open: true,
        song: action.song,
        mode: action.song ? 'EDIT' : 'NEW',
      }
    case 'CLOSE':
      return {
        open: false,
      }
    default:
  }
  return state
}

const StateContext = createContext(defaultContext)
const DispatchContext = createContext<Dispatch<Action>>(() => {})

type Props = PropsWithChildren<unknown>
function SongModalProvider ({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, defaultContext)
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export const useSongModalContext = () => {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  return {
    /* States */
    ...state,
    /* Dispatches */
    openModal (song?: Song) {
      dispatch({ type: 'OPEN', song })
    },
    closeModal () {
      dispatch({ type: 'CLOSE' })
    },
  }
}

export default SongModalProvider
