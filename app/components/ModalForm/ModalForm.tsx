"use client"

import { useState, useEffect, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { COUNTRIES } from "@/lib/data.js"
import { schema } from "@/lib/schema.js"
import {
  valueRadio,
  valueCheckbox,
  changeProduct,
  addProduct
} from "@/lib/features/productSlice"
import Radio from "../Radio"
import Checkbox from "../Checkbox/Checkbox"
import InputElement from "../InputElement/InputElement"
import FormLabel from "../FormLabel"
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

  const onBlur = useCallback(() => {
    const errorsNew = {}
    if (valid) {
      console.log("valid")
    } else {
      console.log("invalid")
      validate.errors.map((error) => {
        const fieldName = error.instancePath.substring(1)
        errorsNew[fieldName] = error.message
      })
    }
    setErrors(errorsNew)
    setIsFocus("")
  }, [validate.errors])

  const onBlurPrice = () => {
    setPriceTextFocus('$' + Number(priceText).toLocaleString())
    onBlur
  }

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
  
  const onChangeName = (e) => {setNameText(e.target.value)}
  const onChangeEmail = (e) => {setEmailText(e.target.value)}
  const onChangeCount = (e) => {
  // Если в инпуте с типом "number" окажется нечисловое значение, он преобразует его в пустую строку
    if (e.target.value !== '' && e.target.value >= 0 ) {
      setCountText(e.target.value)
    }
  }
  const onChangePrice = (e) => {
    setPriceText(e.target.value)
    setPriceTextFocus(e.target.value)
  }
  const onChangeDelivery = (e) => {
            setLocation(e.target.value)
            if (!e.target.value) {
              setRadioValue(0)
              setCheckboxValues(undefined)
              setIsErrorMessageSelectCity(false)
            }
  }

  const onFocus = useCallback((e) => {
    setIsFocus(e.target.id)
  }, [])

  const onFocusPrice = (e) => {
    setPriceTextFocus(priceText)
    setIsFocus(e.target.id)
  }

  function FormElement(props) {
    return (
      <>
        <FormLabel props={ props } />
        <InputElement props={ props }
          onfocus={ onFocus }
          onblur={ onBlur }
          isfocus={ isFocus }
        />
      </>
    )
  }

  return (
    <form className={styles.form} onSubmit={(e) => {e.preventDefault()}}>
      <FormElement 
        name="Name"
        id="name"
        value={ nameText}
        onchange={ onChangeName }
        error={ errors.name }
      />

      <FormElement 
        name="Supplier email"
        id="email"
        value={ emailText }
        onchange={ onChangeEmail }
        error={ errors.email }
      />

      <FormElement 
        name="Count"
        id="count"
        type="number"
        value={ countText }
        onchange={ onChangeCount }
        error={ errors.count }
      />

      <FormElement 
        name="Price"
        id="price"
        value={ priceTextFocus }
        onchange={ onChangePrice }
        error={ errors.price }
        onfocus={ onFocusPrice }
        onblur={ onBlurPrice }
      />

      <FormLabel props={ {id: "delivery", name: "Delivery"} } />
      <div className={styles.delivery}>
        <select
          id="delivery"
          className={isErrorMessageSelectCity ? styles.selectError : styles.select}
          value={ location }
          onChange={ onChangeDelivery }
          onBlur={ onBlur }
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
