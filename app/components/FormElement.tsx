import FormLabel from "./FormLabel"
import InputElement from "./InputElement/InputElement"
  
export default function FormElement(props) {
  return (
    <>
      <FormLabel name={ props.name } id={ props.id } />
      <InputElement children={ props } />
    </>
  )
}
