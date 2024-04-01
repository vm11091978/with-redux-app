"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import App from "./components/Product"

export default function IndexPage() {
  return (
    <Provider store={store}>
      <h1>Таблица с перечнем товаров</h1>
      <App />
    </Provider>
  )
}
