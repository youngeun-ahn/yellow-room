import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useAppDispatch, useAppSelector } from '.'

const initialState: Setting = {
  hideBlacklist: false,
  groupBy: 'ORIGIN',
  orderBy: 'TITLE',
}

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    initSetting (_, action: PayloadAction<Setting>) {
      return action.payload
    },
    toggleHideBlacklist (state, action: PayloadAction<boolean>) {
      state.hideBlacklist = action.payload
    },
    setGroupBy (state, action: PayloadAction<GroupBy>) {
      state.groupBy = action.payload
    },
    setOrderBy (state, action: PayloadAction<OrderBy>) {
      state.orderBy = action.payload
    },
  },
})

const {
  initSetting, toggleHideBlacklist, setGroupBy, setOrderBy,
} = settingSlice.actions

export const useSettingSlice = () => {
  const setting = useAppSelector(_ => _.setting)
  const dispatch = useAppDispatch()
  return {
    setting,
    initSetting (initialSetting?: Setting) {
      dispatch(initSetting(initialSetting ?? initialState))
    },
    toggleHideBlacklist (hideBlacklist?: boolean) {
      if (hideBlacklist === undefined) {
        dispatch(toggleHideBlacklist(!setting.hideBlacklist))
        return
      }
      dispatch(toggleHideBlacklist(hideBlacklist))
    },
    setGroupBy (groupBy: GroupBy) {
      dispatch(setGroupBy(groupBy))
    },
    setOrderBy (orderBy: OrderBy) {
      dispatch(setOrderBy(orderBy))
    },
  }
}

export default settingSlice.reducer
