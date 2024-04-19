"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { COUNTRIES } from "@/lib/data.js"
import { schema } from "@/lib/schema.js"
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

  const [errors, setErrors] = useState({})
  const [isFocus, setIsFocus] = useState("")
  const [isErrorMessageSelectCity, setIsErrorMessageSelectCity] = useState(false)
  const [isErrorMessageAlert, setIsErrorMessageAlert] = useState(false)

  let numProduct
  // Если modalNumOpen = 0, значит нужно показать форму добавления нового товара
  if (modalNumOpen !== 0) {
    if (isNaN(modalNumOpen) || modalNumOpen < 0) {
      return <span>ID товара должно быть целым положительным числом!</span>
    }

    // Переберём все товары: если найдём товар с нужным id, запишем его порядковый номер в переменную numProduct
    for (let i = 0; i < DATAPRODUCTS.length; i++) {
      if (DATAPRODUCTS[i].id == modalNumOpen) {
        numProduct = i
        break
      }
    }
    if (typeof numProduct === "undefined") {
      return <span>Ошибка! Товара с таким id не существует!</span>
    }
    
    // Если выполнение кода дошло до этого места, значит при текущем рендеринге будет показана форма редактирования товара
    // чтобы увидеть работу кода, сделаем небольшую задержку между открытием формы и заполнением её полей тестовыми данными
    useEffect(() => {
      const timer = setTimeout(() => {
        const product = DATAPRODUCTS[numProduct]
        setNameText(product.name)
        setEmailText(product.email)
        setCountText(product.count)
        setPriceText(product.price)
        setPriceTextFocus('$' + product.price.toLocaleString())
        setRadioValue(product.delivery)
        setCheckboxValues(product.deliveryCity)
      }, 1000);
    }, [modalNumOpen])
  }
  
  /*
  https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md
  https://github.com/ajv-validator/ajv-formats
  Type can be: number, integer, string, boolean, array, object or null
  */
  const Ajv = require("ajv")
  const ajv = new Ajv({v5: true, allErrors: true})
  // const addFormats = require("ajv-formats")
  // addFormats(ajv)
  require('ajv-formats')(ajv);
  require('ajv-errors')(ajv);

  // Чтобы сначала появилась красная рамка и текст, поясняющий причину ошибки,
  // а потом всплывающее окно, необходима задержка по времени
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isErrorMessageAlert) {
        alert("Невозможно добавить / обновить товар!\nКорректно укажите все данные!")
        setIsErrorMessageAlert(false)
      }
    }, 1);
  }, [isErrorMessageAlert])

  let emailTextTrim = emailText.trim()
  if (!emailTextTrim) {
    emailTextTrim = "ya@ya.ru"
  }

  let fieldCheck = Boolean(true)
  // Если пользователь в комбобоксе выбрал страну, но при этом не выбрал город,
  // обнулим значение "fieldCheck" - тогда это поле с типом "null" не пройдёт валидацию
  if (radioValue !== 0 && (checkboxValues === undefined || !checkboxValues.includes(true))) {
    fieldCheck = null
  }

  const data = {
    name: nameText.trim(),
    email: emailTextTrim,
    count: Number(countText), // count: countText2,
    price: Number(priceText),
    fieldCheck: fieldCheck
  }

  const validate = ajv.compile(schema)
  const valid = ajv.validate(schema, data)

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
      onBlur={onBlur}
    />
  }

  let checkbox = ""
  if (radioValue && location === "Город") {
    checkbox = <Checkbox
      radioValue={radioValue}
      checkboxValues={checkboxValues}
      setCheckboxValues={setCheckboxValues}
      setIsErrorMessageSelectCity={setIsErrorMessageSelectCity}
      onBlur={onBlur}
    />
  }

  const button = <button
    type="submit"
    onClick={() => {
      if (valid) {
        if (modalNumOpen === 0) clickAddProduct()
        if (modalNumOpen !== 0) clickChangeProduct()
      } else {
        if (!fieldCheck) {
          setIsErrorMessageSelectCity(true)
        }
        setIsErrorMessageAlert(true)
      }
    }}
  >
    Add / Update
  </button>
  
  function clickAddProduct() {
    dispatch(addProduct({
      'name': String(nameText),
      'email': String(emailText),
      'price': Number(priceText),
      'count': Number(countText),
      'delivery': Number(radioValue),
      'deliveryCity': checkboxValues,
    }))
  }

  function clickChangeProduct() {
    dispatch(changeProduct({
      'id': Number(modalNumOpen),
      'name': String(nameText),
      'email': String(emailText),
      'price': Number(priceText),
      'count': Number(countText),
      'delivery': Number(radioValue),
      'deliveryCity': checkboxValues,
    }))
  }

  function onBlur() {
    const errorsNew = {}
    if (valid) {
      console.log("valid")
    } else {
      console.log("invalid")
      validate.errors.map((error) => {
        const fieldName = error.instancePath.substring(1);
        errorsNew[fieldName] = error.message
      })
    }
    setErrors(errorsNew)
    setIsFocus("")
  }

  return (
    <form className={styles.form} onSubmit={(e) => {e.preventDefault()}}>
      <label htmlFor="name">
        Name:
      </label>
      <div>
        <input
          id="name"
          className={errors.name ? styles.inputError : styles.input}
          type="text"
          value={nameText}
          placeholder="имя"
          onChange={(e) => setNameText(e.target.value)}
          onFocus={(e) => setIsFocus(e.target.id)}
          onBlur={() => onBlur()}
        />{isFocus === "name" ? "" : errors.name}
      </div>

      <label htmlFor="email">
        Supplier email:
      </label>
      <div>
        <input
          id="email"
          className={errors.email ? styles.inputError : styles.input}
          // type="email"
          type="text"
          value={emailText}
          placeholder="email"
          onChange={(e) => setEmailText(e.target.value)}
          onFocus={(e) => setIsFocus(e.target.id)}
          onBlur={() => onBlur()}
        />{isFocus === "email" ? "" : errors.email}
      </div>

      <label htmlFor="count">
        Count:
      </label>
      <div>
        <input
          id="count"
          className={errors.count ? styles.inputCountError : styles.inputCount}
          type="number"
          value={countText}
          placeholder="count"
          onChange={(e) => {
          // Если в инпуте с типом "number" окажется нечисловое значение, он преобразует его в пустую строку
              if (e.target.value !== '' && e.target.value >= 0 ) {
                setCountText(e.target.value)
              }
            }}
          onFocus={(e) => setIsFocus(e.target.id)}
          onBlur={() => onBlur()}
        />{isFocus === "count" ? "" : errors.count}
      </div>

      <label htmlFor="price">
        Price:
      </label>
      <div>
        <input
          id="price"
          className={errors.price ? styles.inputError : styles.input}
          type="text"
          value={priceTextFocus}
          placeholder="price"
          onChange={(e) => {
              setPriceText(e.target.value);
              setPriceTextFocus(e.target.value);
            }}
          // onFocus={_ => setPriceTextFocus(priceText)}
          onFocus={(e) => {
              setPriceTextFocus(priceText)
              setIsFocus(e.target.id)
            }}
          onBlur={() => {
              setPriceTextFocus('$' + Number(priceText).toLocaleString());
              onBlur();
            }}
        />{isFocus === "price" ? "" : errors.price}
      </div>

      <label htmlFor="delivery">
        Delivery:
      </label>
      <div className={styles.delivery}>
        <select
          id="delivery"
          className={isErrorMessageSelectCity ? styles.selectError : styles.select}
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            if (!e.target.value) {
              setRadioValue(0)
              setCheckboxValues(undefined)
              setIsErrorMessageSelectCity(false)
            }
          }}
          onBlur={() => onBlur()}
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
        {isErrorMessageSelectCity ? errors.fieldCheck : "" }
      </div>

      { button }
    </form>
  )
} 
