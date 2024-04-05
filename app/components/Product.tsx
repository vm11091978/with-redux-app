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
  valueRadio,
  valueCheckbox,
  dataProducts,
} from "@/lib/features/productSlice"
import { COUNTRIES } from "./data.js"
import styles from "./Product.module.css"

export default function App() {
  const getParams = useSearchParams()
  const [modalNumOpen, setModalNumOpen] = useState(0)

  const modalContent = (
    <div className={styles.modalDialog} onClick={e => e.stopPropagation()}>
      <div className={styles.modalHeader} >
        <h2>Модальное окна товара с id={modalNumOpen}</h2>
        <Link href={'/'} ><span className={styles.modalClose} >&times;</span></Link>
      </div>
      <ModalForm modalNumOpen={modalNumOpen} />
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
          break
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

function useSortableData() {
  const DATAPRODUCTS = useAppSelector((state) => state.product.dataProducts)
  const isSortByPrice = useAppSelector((state) => state.product.isSortByPrice)
  const sortedOrder = useAppSelector((state) => state.product.sortedOrder)
  
  let sortedProducts = DATAPRODUCTS.slice()
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

function ModalForm({ modalNumOpen }) {
  if (modalNumOpen === 0) {
    console.log("modalNumOpen = 0")
    return
  }
  console.log("modalNumOpen " + modalNumOpen)

  const DATAPRODUCTS = useAppSelector((state) => state.product.dataProducts)
  const dispatch = useAppDispatch()
  console.log(DATAPRODUCTS)

  const [nameText, setNameText] = useState("")
  const [emailText, setEmailText] = useState("")
  const [countText, setCountText] = useState(0)
  const [priceText, setPriceText] = useState(0)
  const [priceTextFocus, setPriceTextFocus] = useState(0)
  const [location, setLocation] = useState("")
  const [radioValue, setRadioValue] = useState(0)
  const [checkboxValues, setCheckboxValues] = useState()

  let radio = ""
  if (!radioValue) {
    radio = <span>&nbsp;&bull; Нет доставки для данного товара</span>
  }
  if (!radioValue && location === "Город") {
    radio = <span>&nbsp;&bull; Выберите сначала страну</span>
  }
  if (location === "Страна") {
    radio = <Radio
      radioValue={radioValue}
      setRadioValue={setRadioValue}
      setCheckboxValues={setCheckboxValues}
    />
  }

  let checkbox = ""
  if (radioValue && location === "Город") {
    checkbox = <Checkbox
      radioValue={radioValue}
      checkboxValues={checkboxValues}
      setCheckboxValues={setCheckboxValues}
    />
  }

  // чтобы увидеть работу кода, сделаем небольшую задержку между открытием формы и заполнением её полей тестовыми данными
  useEffect(() => {
    const timer = setTimeout(() => {
      // переберём все товары: когда найдём товар с нужным id, запишем аттрибуты этого товара в локальное состояние компонента
      for (const product of DATAPRODUCTS) {
        if (product.id == modalNumOpen) {
          setNameText(product.name)
          setEmailText(product.email)
          setCountText(product.count)
          setPriceText(product.price)
          setPriceTextFocus('$' + product.price.toLocaleString())
          setRadioValue(product.delivery)
          setCheckboxValues(product.deliveryCity)
          break
        }
      }
    }, 1000);
  }, [modalNumOpen])

  return (
    <form className={styles.form} onSubmit={(e) => {e.preventDefault()}}>
      <label htmlFor="name">
        Name:
      </label>
      <div>
        <input
          id="name"
          className={styles.input}
          type="text"
          value={nameText} placeholder="имя"
          onChange={(e) => setNameText(e.target.value)}
        /> &bull; Required field
      </div>

      <label htmlFor="email">
        Supplier email:
      </label>
      <div>
        <input
          id="email"
          className={styles.input}
          type="email"
          value={emailText} placeholder="email"
          onChange={(e) => setEmailText(e.target.value)}
        /> &bull; Incorrect email
      </div>

      <label htmlFor="count">
        Count:
      </label>
      <div>
        <input
          id="count"
          className={styles.inputCount}
          type="number"
          value={countText} placeholder="count"
          onChange={(e) => setCountText(e.target.value)}
        />
      </div>

      <label htmlFor="price">
        Price:
      </label>
      <div>
        <input
          id="price"
          className={styles.input}
          type="text"
          value={priceTextFocus}
          onFocus={_ => setPriceTextFocus(priceText)}
          onBlur={_ => setPriceTextFocus('$' + Number(priceText).toLocaleString())}
          placeholder="price"
          onChange={(e) => {setPriceText(e.target.value); setPriceTextFocus(e.target.value);}}
        />
      </div>

      <label htmlFor="delivery">
        Delivery:
      </label>
      <div className={styles.delivery}>
        <select
          id="delivery"
          className={styles.select}
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            if (!e.target.value) {
              setRadioValue(0)
              setCheckboxValues(undefined)
            }
          }}
        >
          <option key={"нет"} value={""}>
          </option>
          <option key={"Страна"} value={"Страна"}>
            Страна
          </option>
          <option key={"Город"} value={"Город"}>
            Город
          </option>
        </select>

        { radio }
        { checkbox }
      </div>

      <button
        className={styles.button}
        type="submit"
        onClick={() => dispatch(dataProducts({
          'id': Number(modalNumOpen),
          'name': String(nameText),
          'email': String(emailText),
          'price': Number(priceText),
          'count': Number(countText),
          'delivery': Number(radioValue),
          'deliveryCity': checkboxValues,
        }))}
      >
        Add / Update
      </button>
    </form>
  )
}

function Radio({ radioValue, setRadioValue, setCheckboxValues }) {
  const rows = []
  let i = 1
  COUNTRIES.forEach((country) => {
    rows.push(
      <div key={i}>
        <input
          type="radio"
          name="radio"
          value={i}
          checked={radioValue == `${i}` ? true : false}
          onChange={(e) => {setRadioValue(e.target.value); setCheckboxValues(undefined);}}
        />
        {Object.keys(country)}
      </div>
    )
    i++
  })

  return <div>{rows}</div>
}

function Checkbox({ radioValue, checkboxValues, setCheckboxValues }) {
  if (radioValue) {
    let checkboxValues2 = checkboxValues
    let checkAll = true
    // получим список городов для выбранной страны (её порядковый номер передаётся в radioValue)
    const cities = Object.values(COUNTRIES[radioValue-1])[0]
    console.log("cities: " + cities)

    // если в состоянии компонента не хранятся никакие данные о выбранных городах
    if (checkboxValues === undefined) {
      checkboxValues2 = new Array(cities.length).fill(false)
      checkAll = false
    } else {
    // иначе узнаем, есть ли в массиве хотя бы один false - если да, то чекбокс "Select All" должен быть без галочки
      for (const check of checkboxValues2) {
        if (check === false) {
          checkAll = false
          break
        }
      }
    }

    const rows = [
      <div key="all">
        <input
          type="checkbox"
          value="all"
          checked={checkAll}
          onChange={(e) => setCheckboxValues(chengeCheckbox(e.target.value, checkboxValues2))}
        />
        Select All
      </div>
    ]

    let i = 0
    cities.forEach((city) => {
      rows.push(
        <div key={i+1}>
        <input
          type="checkbox"
          value={i+1}
          checked={checkboxValues2[`${i}`]}
          onChange={(e) => setCheckboxValues(chengeCheckbox(e.target.value, checkboxValues2))}
        />
        {city}
        </div>
      )
      i++
    })

    return <div>{rows}</div>
  }
}

function chengeCheckbox(inputNumber, values) {
  if (inputNumber == "all") {
    // если есть в массиве хотя бы один false - всем чекбоксам и чекбоксу "Select All" поставим галочки
    for (const check of values) {
      if (check === false) {
        return new Array(values.length).fill(true)
      }
    }
    // иначе (если массив состоит только из true) - инвертируем выбор: снимем галочки со всех чекбоксов
    return new Array(values.length).fill(false)
  }

  let arr = []
  for (let i = 0; i < values.length; i++) {
    if (i == inputNumber-1) {
      arr.push(!values[i]);
    } else {
      arr.push(values[i]);
    }
  }

  return arr
}

/*
export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
*/
