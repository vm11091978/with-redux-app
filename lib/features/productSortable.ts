import { useAppSelector } from "@/lib/hooks"

export default function useSortableData() {
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
