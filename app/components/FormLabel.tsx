export default function FormLabel(props) {
  return (
    <label htmlFor={ props.id }>
      { props.name }:
    </label>
  )
}
