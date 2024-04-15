"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAppDispatch } from "@/lib/hooks"
import { filterTextSearch } from "@/lib/features/productSlice"
import styles from "./SearchBar.module.css"

export default function SearchBar() {
  const getParams = useSearchParams()
  const dispatch = useAppDispatch()
  const [filterText, setFilterText] = useState("")
  
  useEffect(() => {
    // здесь сравнение обязательно должно быть нестрогим
    if (getParams == "") {
      setFilterText("")
      dispatch(filterTextSearch(""))
    } else {
      // переберём все get-параметры: если найдётся параметр, хранящий текст поиска,
      // запишем этот текст и в состояние компонента и в глобальное состояние
      for (const param of getParams) {
        if (param[0] === "filter" && param[1] !== "") {
          setFilterText(param[1])
          dispatch(filterTextSearch(param[1]))
          break
        }
        // если get-параметр с текстом поиска отсутствует (т.е. не нужно фильтровать товары),
        // запишем пустую строку и в состояние компонента и в глобальное состояние
        else {
          setFilterText("")
          dispatch(filterTextSearch(""))
        }
      }
    }
  }, [getParams])
  
  return (
    <div className={styles.search} >
      <div>
        <input
          id="inputSearch"
          className={styles.inputSearch}
          type="text"
          value={filterText} placeholder="Фильтр по подстроке в имени товара"
          onChange={(e) => setFilterText(e.target.value)}
        />

        <Link href={filterText === '' ? '/' : `/?filter=${filterText}`} >
          <button>Искать</button>
        </Link>
      </div>

      <Link href={"/?newproduct"} >
        <button>Add New</button>
      </Link>
    </div>
  )
}
