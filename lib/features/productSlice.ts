import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
// import type { RootState } from "@/lib/store"
import { PRODUCTS } from "../../app/components/data.js"

export interface AppState {
  filterText: string;
  isSortByPrice: boolean;
  sortedOrder: "" | "asc" | "desc";
  valueRadio: number;
  valueCheckbox: array;
  dataProducts: array;
}

const initialState: AppState = {
  filterText: "",
  sortedOrder: "",
  isSortByPrice: false,
  valueRadio: 0,
  valueCheckbox: [],
  dataProducts: PRODUCTS,
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
    valueRadio: (state, action: PayloadAction<number>) => {
      state.valueRadio = action.payload
    },
    valueCheckbox: (state, action: PayloadAction<array>) => {
      state.valueCheckbox = action.payload
    },
    dataProducts: (state, action: PayloadAction) => {
      const rows = []
      state.dataProducts.forEach((product) => {
        if (product.id !== action.payload.id) {
          rows.push(product)
        } else {
          rows.push(action.payload)
        }
      })
      state.dataProducts = rows
    },
  },
})

// Action creators are generated for each case reducer function
export const { filterTextSearch, sortByName, sortByPrice, valueRadio, valueCheckbox, dataProducts } = appSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const filterText = (state: RootState) => state.counter.filterText

export default appSlice.reducer
