import styles from "./ModalForm.module.css"

export default function FormElement(props) {
  return (
    <>
      <label htmlFor={ props.id }>
        { props.name }:
      </label>
      <div>
        <input
          id={ props.id }
          className={props.error ? styles.inputError : styles.input}
          type={ props.type }
          value={ props.value }
          placeholder="имя"
          onChange={ props.onChange }
          onFocus={ props.onFocus }
          onBlur={ props.onBlur }
        />{props.isFocus === props.id ? "" : props.error}
      </div>
    </>
  )
}
