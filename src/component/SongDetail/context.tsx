import produce from 'immer'
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
  | { type: 'SET_MODE', mode: Mode }

const reducer: Reducer<Context, Action> = (state, action) => produce(state, baseState => {
  switch (action.type) {
    case 'OPEN':
      baseState.open = true
      baseState.song = action.song
      baseState.mode = action.song ? 'READ' : 'NEW'
      break
    case 'CLOSE':
      baseState.open = false
      break
    case 'SET_MODE':
      baseState.mode = action.mode
      break
    default:
  }
  return baseState
})

const StateContext = createContext(defaultContext)
const DispatchContext = createContext<Dispatch<Action>>(() => {})

type Props = PropsWithChildren<unknown>
function SongDetailProvider ({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, defaultContext)
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export const useSongDetailContext = () => {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  return {
    /* States */
    ...state,
    isNew: state.mode === 'NEW',
    isEditable: state.mode === 'EDIT',
    isReadonly: state.mode === 'READ',
    /* Dispatches */
    openSongDetail (song?: Song) {
      dispatch({ type: 'OPEN', song })
    },
    closeSongDetail () {
      dispatch({ type: 'CLOSE' })
    },
    setMode (mode: Mode) {
      dispatch({ type: 'SET_MODE', mode })
    },
  }
}

export default SongDetailProvider
