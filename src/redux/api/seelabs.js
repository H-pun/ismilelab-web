// ** Axios Imports
import axios from 'axios'

// ** Redux Imports
import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit'

const endpoint = '/seelabs'

export const getGroupList = createAsyncThunk('seelabs/getGroupList', async (param) => {
  return await axios.post(`${endpoint}/group/list`, param).then(res => {
    return res.data.data
  })
})

export const getGroupDetail = createAsyncThunk('seelabs/getGroupDetail', async (group, { getState }) => {
  const data = {
    ...getState().seelabs.currentDSG,
    group
  }
  return await axios.post(`${endpoint}/group/detail`, data).then(res => {
    return res.data.data
  })
})

export const inputScore = createAsyncThunk('seelabs/inputScore', async (param, { getState }) => {
  console.log(getState().seelabs)
  const data = {
    ...getState().seelabs.currentDSG,
    ...param,
    module: param.module.value,
    scores: param.scores.map(item => ({
      ...item,
      status: item.d !== 0
    }))
  }
  return await axios.post(`${endpoint}/score`, data).then(res => {
    return res.data.data
  })
})

const initialGroups = () => {
  const item = window.localStorage.getItem('seelabsGroups')
  return item ? JSON.parse(item) : {}
}

const initialGroupDetail = () => {
  const item = window.localStorage.getItem('seelabsGroupDetail')
  return item ? JSON.parse(item) : {}
}

const initialCurrentDSG = () => {
  const item = window.localStorage.getItem('seelabsCurrentDSG')
  return item ? JSON.parse(item) : {}
}

export const moduleSlice = createSlice({
  name: 'seelabs',
  initialState: {
    groups: initialGroups(),
    groupDetail: initialGroupDetail(),
    currentDSG: initialCurrentDSG(),
    isLoading: false,
    dayOptions: [
      { value: 1, label: 'Senin' },
      { value: 2, label: 'Selasa' },
      { value: 3, label: 'Rabu' },
      { value: 4, label: 'Kamis' },
      { value: 5, label: 'Jumat' },
      { value: 6, label: 'Sabtu' }
    ],
    shiftOptions: [
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' }
    ],
    moduleOptions: [
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' }
    ]
  },
  extraReducers: builder => {
    builder
      .addCase(getGroupList.fulfilled, (state, action) => {
        state.groups = action.payload
        state.currentDSG = action.meta.arg
        localStorage.setItem('seelabsGroups', JSON.stringify(action.payload))
        localStorage.setItem('seelabsCurrentDSG', JSON.stringify(action.meta.arg))
      })
      .addCase(getGroupDetail.fulfilled, (state, action) => {
        const data = {
          ...state.currentDSG,
          group: action.meta.arg
        }
        state.groupDetail = action.payload
        state.groups = {}
        state.currentDSG = data
        console.log(action)
        localStorage.setItem('seelabsGroupDetail', JSON.stringify(action.payload))
        localStorage.setItem('seelabsCurrentDSG', JSON.stringify(data))
        localStorage.removeItem('seelabsGroups')
      })
      .addMatcher(isAnyOf(getGroupList.pending, getGroupDetail.pending), (state) => {
        state.isLoading = true
      })
      .addMatcher(isAnyOf(getGroupList.rejected, getGroupDetail.rejected, getGroupList.fulfilled, getGroupDetail.fulfilled), (state) => {
        state.isLoading = false
      })
  }
})

export const { } = moduleSlice.actions

export default moduleSlice.reducer
