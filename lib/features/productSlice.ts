import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
// import type { RootState } from "@/lib/store"
import { PRODUCTS } from "../data.js"

export interface AppState {
  filterText: string;
  isSortByPrice: boolean;
  sortedOrder: "" | "asc" | "desc";
  valueRadio: number;
  valueCheckbox: array;
  dataProducts: array;
}

interface Item {
  id: string
  text: string
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
    changeProduct: (state, action: PayloadAction<number>) => {
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
    addProduct: (state, action: PayloadAction<object>) => {
      let maxExistsId = 0
      if (state.dataProducts[0]) {
        const arrId = []
        state.dataProducts.forEach((product) => {
          arrId.push(product.id)
        })
        maxExistsId = Math.max.apply(null, arrId)
      }
      action.payload.id = maxExistsId + 1
      state.dataProducts.push(action.payload)
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      const index = state.dataProducts.findIndex((p) => p.id === action.payload);
      state.dataProducts.splice(index, 1);
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  filterTextSearch,
  sortByName,
  sortByPrice,
  valueRadio,
  valueCheckbox,
  changeProduct,
  addProduct,
  deleteProduct
} = appSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const filterText = (state: RootState) => state.counter.filterText

export default appSlice.reducer

