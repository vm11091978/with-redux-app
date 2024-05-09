import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  setIsFocus,
  setPriceTextFocus
} from "@/lib/features/productSlice"
import styles from "./InputElement.module.css"

export default function InputElement(propsParent) {
  const props = propsParent.children

  const isFocus = useAppSelector((state) => state.product.isFocus)
  const priceText = useAppSelector((state) => state.product.priceText)
  const priceTextFocus = useAppSelector((state) => state.product.priceTextFocus)
  const dispatch = useAppDispatch()
  
  let typeInput = "text"
  if (props.type) {
    typeInput = props.type
  }

  const onFocus = (e) => {
    dispatch(setIsFocus(e.target.id))
    if (props.id === "price") {
      dispatch(setPriceTextFocus(priceText))
    }
  }
    
  return (
    <div>
      <input
        id={ props.id }
        className={props.error ? styles.inputError : styles.input}
        type={ typeInput }
        value={ props.value }
        placeholder={ props.id }
        onChange={ props.onchange }
        onFocus={ onFocus }
        onBlur={ props.onblur }
      />
      {isFocus === props.id ? "" : props.error}
    </div>
  )
}
