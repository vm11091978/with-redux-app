"use client"

import { useState, useEffect } from "react"
import Modal from "react-modal"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  filterTextSearch,
  sortByName,
  sortByPrice,
} from "@/lib/features/productSlice"
import { PRODUCTS } from "./data.js"
import styles from "./Product.module.css"

export default function App() {
  const getParams = useSearchParams()
  const [modalNumOpen, setModalNumOpen] = useState(0)

  const modalContent = (
    <div className={styles.modalDialog} onClick={e => e.stopPropagation()}>
      <div className={styles.modalHeader} >
        <h2>Заголовок модального окна с id={modalNumOpen}</h2>
        <Link href={'/'} ><span className={styles.modalClose} >&times;</span></Link>
      </div>
    </div>
  )

  // чтобы увидеть работу кода, сделаем небольшую задержку между переходом на страницу с get-параметрами и всплытием модального окна на этой странице
  useEffect(() => {
    const timer = setTimeout(() => {
      // здесь сравнение обязательно должно быть нестрогим
      if (getParams == "") {
        setModalNumOpen(0)
      } else {
        // переберём все get-параметры: если найдётся параметр, хранящий id товара, запишем этот id в состояние компонента
        for (const param of getParams) {
          if (param[0] === "productid" && param[1] !== "") {
            setModalNumOpen(param[1])
            break;
          }
          // если get-параметр с id товара отсутствует (т.е. не нужно показывать модальное окно), присвоим 0 соответствующему состоянию компонента
          else {
            setModalNumOpen(0)
          }
        }
      }
    }, 1000);
  }, [getParams])

  return (
    <div>
      <SearchBar />
      <ProductTable />
      <Modal className={styles.modal} isOpen={modalNumOpen === 0 ? false : true} ariaHideApp={false} >
        {modalContent}
      </Modal>
    </div>
  )
}

function SearchBar() {
  const getParams = useSearchParams()
  const dispatch = useAppDispatch()
  // const filterText = useAppSelector((state) => state.product.filterText)
  const [filterText, setFilterText] = useState("")
  
  useEffect(() => {
    // здесь сравнение обязательно должно быть нестрогим
    if (getParams == "") {
      setFilterText("")
      dispatch(filterTextSearch(""))
    } else {
      // переберём все get-параметры: если найдётся параметр, хранящий текст поиска, запишем этот текст и в состояние компонента и в глобальное состояние
      for (const param of getParams) {
        if (param[0] === "filter" && param[1] !== "") {
          setFilterText(param[1])
          dispatch(filterTextSearch(param[1]))
          break;
        }
        // если get-параметр с текстом поиска отсутствует (т.е. не нужно фильтровать товары), запишем пустую строку и в состояние компонента и в глобальное состояние
        else {
          setFilterText("")
          dispatch(filterTextSearch(""))
        }
      }
    }
  }, [getParams])
  
  return (
    <>
      {/* <form onSubmit={(e) => {e.preventDefault()}}> */}
        <input
          className={styles.search}
          type="text"
          value={filterText} placeholder="Фильтр по подстроке в имени товара"
          /* onChange={(e) => dispatch(setFilterText2(e.target.value))} */
          onChange={(e) => setFilterText(e.target.value)}
        />
        {/* <button type="submit">Send</button> */}
      {/* </form> */}

      <Link href={filterText === '' ? '/' : `/?filter=${filterText}`} >
        <button className={styles.buttonRight} >Искать</button>
      </Link>
    </>
  )
}

function ProductRow({ product }) {
  const getparam = "/?productid=" + product.id
  const price = product.price.toLocaleString()

  return (
    <tr>
      <td className={styles.td} >
        <Link className={styles.link} href={getparam} >{product.name}</Link>
      </td>
      <td className={styles.td} >
        <span>{product.count}</span>
      </td>
      <td className={styles.td} >
        ${price}
      </td>
      <td className={styles.td} >
        <Link href={getparam} >
          <button className={styles.button} >Edit</button>
        </Link>
        <button className={styles.buttonRight} >Delete</button>
      </td>
    </tr>
  )
}

function TableBody({ sortedProducts }) {
  const filterText = useAppSelector((state) => state.product.filterText)
  const rows = []

  sortedProducts.forEach((product) => {
    if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return
    }

    rows.push(
      <ProductRow
        product={product}
        key={product.id}
      />
    )
  })

  return <tbody>{rows}</tbody>
}

function useSortableData() {
  const isSortByPrice = useAppSelector((state) => state.product.isSortByPrice)
  const sortedOrder = useAppSelector((state) => state.product.sortedOrder)
  
  let sortedProducts = PRODUCTS.slice()
  let signName = ""
  let signPrice = ""

  if (sortedOrder === "asc") {
    if (isSortByPrice) {
      sortedProducts = sortedProducts.sort((x, y) => x.price - y.price)
      signPrice = " 🔼" 
    } else {
      sortedProducts = sortedProducts.sort((x, y) => x.name.localeCompare(y.name))
      signName = " 🔼" 
    }
  }
  if (sortedOrder === "desc") {
    if (isSortByPrice) {
      sortedProducts = sortedProducts.sort((x, y) => y.price - x.price)
      signPrice = " 🔽"
    } else {
      sortedProducts = sortedProducts.sort((x, y) => y.name.localeCompare(x.name))
      signName = " 🔽"
    }
  }

  return { items: sortedProducts, signName, signPrice }
}

function ProductTable() {
  const dispatch = useAppDispatch()
  const { items, signName, signPrice } = useSortableData()

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th} colSpan="2" onClick={() => dispatch(sortByName())} >
            Name <div className={styles.sort}>{signName}</div>
          </th>
          <th className={styles.th} onClick={() => dispatch(sortByPrice())} >
            Price <div className={styles.sort}>{signPrice}</div>
          </th>
          <th className={styles.th} >
            Actions
          </th>
        </tr>
      </thead>
      <TableBody sortedProducts={items} />
    </table>
  )
}

/*
export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
*/
