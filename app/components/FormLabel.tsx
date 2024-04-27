export default function FormLabel(propsParent) {
  const props = propsParent.props
  return (
    <label htmlFor={ props.id }>
      { props.name }:
    </label>
  )
}
