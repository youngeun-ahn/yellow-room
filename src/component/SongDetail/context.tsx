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

const reducer: Reducer<Context, Action> = (state, action) => {
  switch (action.type) {
    case 'OPEN':
      return {
        open: true,
        song: action.song,
        mode: action.song ? 'READ' : 'NEW',
      }
    case 'CLOSE':
      return {
        open: false,
      }
    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode,
      }
    default:
  }
  return state
}

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
