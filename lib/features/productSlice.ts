import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
// import type { RootState } from "@/lib/store"

export interface AppState {
  filterText: string;
  isSortByPrice: boolean;
  sortedOrder: "" | "asc" | "desc";
}

const initialState: AppState = {
  filterText: "",
  sortedOrder: "",
  isSortByPrice: false,
}

export const appSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    filterTextSearch: (state, action: PayloadAction<string>) => {
      state.filterText = action.payload
    },
    sortByName: (state) => {
      if (state.sortedOrder === "asc" && !state.isSortByPrice) {
        state.sortedOrder = "desc"
      } else if (state.sortedOrder === "desc" && !state.isSortByPrice) {
        state.sortedOrder = ""
      } else {
        state.sortedOrder = "asc"
      }
      state.isSortByPrice = false
    },
    sortByPrice: (state) => {
      if (state.sortedOrder === "asc" && state.isSortByPrice) {
        state.sortedOrder = "desc"
      } else if (state.sortedOrder === "desc" && state.isSortByPrice) {
        state.sortedOrder = ""
      } else {
        state.sortedOrder = "asc"
      }
      state.isSortByPrice = true
    },
  },
})

// Action creators are generated for each case reducer function
export const { filterTextSearch, sortByName, sortByPrice } = appSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const filterText = (state: RootState) => state.counter.filterText

export default appSlice.reducer
