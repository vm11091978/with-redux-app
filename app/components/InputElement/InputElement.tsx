import styles from "./InputElement.module.css"

export default function InputElement(propsParent) {
  const props = propsParent.props

  let typeInput = "text"
  if (props.type) {
    typeInput = props.type
  }

  let onFocus = propsParent.onfocus
  if (props.onfocus) {
    onFocus = props.onfocus
  }

  let onBlur = propsParent.onblur
  if (props.onblur) {
    onBlur = props.onblur
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
        onBlur={ onBlur }
      />
      {propsParent.isfocus === props.id ? "" : props.error}
    </div>
  )
}
