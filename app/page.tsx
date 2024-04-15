"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import SearchBar from "./components/SearchBar"
import ProductTable from "./components/ProductTable"
import ModalWindows from "./components/ModalWindows"
import "./styles/globals.css"

export default function IndexPage() {
  return (
    <Provider store={store}>
      <h1>Таблица с перечнем товаров</h1>
      <div>
        <SearchBar />
        <ProductTable />
      </div>
      <ModalWindows />
    </Provider>
  )
}
