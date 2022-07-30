import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '.'

const initialState: Setting = {
  hideBlacklist: false,
  groupBy: 'ORIGIN',
  orderBy: 'TITLE',
  cardViewOptionList: ['KEY', 'ORIGIN', 'SINGER', 'TAG'],
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
    setCardViewOptionList (state, action: PayloadAction<CardViewOption[]>) {
      state.cardViewOptionList = action.payload
    },
  },
})

const {
  initSetting,
  toggleHideBlacklist,
  setGroupBy,
  setOrderBy,
  setCardViewOptionList,
} = settingSlice.actions

export const useSettingSlice = () => {
  const setting = useAppSelector(_ => _.setting)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!setting) {
      // NOTE: 모종의 이유로 스토어가 없는 경우 초기화
      dispatch(initSetting(initialState))
    } else if (!setting.cardViewOptionList) {
      // NOTE: 추가된 필드라 없을 수 있음.
      dispatch(setCardViewOptionList(initialState.cardViewOptionList))
    }
  }, [])

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
    toggleCardViewOption (cardViewOption: CardViewOption, checked: boolean) {
      const poppedList = setting.cardViewOptionList.filter(_ => _ !== cardViewOption)
      const nextOptionList = checked
        ? poppedList.concat(cardViewOption)
        : poppedList
      dispatch(setCardViewOptionList(nextOptionList))
    },
  }
}

export default settingSlice.reducer
