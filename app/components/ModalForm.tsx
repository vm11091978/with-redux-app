"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { COUNTRIES } from "@/lib/data.js"
import {
  valueRadio,
  valueCheckbox,
  changeProduct,
  addProduct
} from "@/lib/features/productSlice"
import Radio from "./Radio"
import Checkbox from "./Checkbox"
import styles from "./ModalForm.module.css"

export default function ModalForm({ modalNumOpen }) {
  if (modalNumOpen === null) {
    return
  }

  const DATAPRODUCTS = useAppSelector((state) => state.product.dataProducts)
  const dispatch = useAppDispatch()

  const [nameText, setNameText] = useState("")
  const [emailText, setEmailText] = useState("")
  const [countText, setCountText] = useState(0)
  const [priceText, setPriceText] = useState(0)
  const [priceTextFocus, setPriceTextFocus] = useState(0)
  const [location, setLocation] = useState("")
  const [radioValue, setRadioValue] = useState(0)
  const [checkboxValues, setCheckboxValues] = useState()
  const [isExistsProduct, setIsExistsProduct] = useState(true)

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

  let button = ""

  if (typeof modalNumOpen === "number" && modalNumOpen > 0) {
    button = <button
      type="submit"
      onClick={() => dispatch(changeProduct({
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
            setIsExistsProduct(true)
            break
          } else {
            setIsExistsProduct(false)
          }
        }
      }, 1000);
    }, [modalNumOpen])
  } else if (modalNumOpen === 0) {
    button = <button
      type="submit"
      onClick={() => dispatch(addProduct({
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
  } else {
    return <span>ID товара должно быть целым положительным числом!</span>
  }

  if (!isExistsProduct) {
    return <span>Ошибка! Товара с таким id не существует!</span>
  }

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
          <option key={"no"} value={""}>
          </option>
          <option key={"country"} value={"Страна"}>
            Страна
          </option>
          <option key={"city"} value={"Город"}>
            Город
          </option>
        </select>

        { radio }
        { checkbox }
      </div>

      { button }
    </form>
  )
}
