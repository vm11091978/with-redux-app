"use client"

import { useState } from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import useSortableData from "@/lib/features/productSortable"
import { sortByName, sortByPrice } from "@/lib/features/productSlice"
import styles from "./ProductTable.module.css"

export default function ProductTable() {
  const dispatch = useAppDispatch()
  const { items, signName, signPrice } = useSortableData()

  return (
    <table>
      <thead>
        <tr>
          <th colSpan="2" onClick={() => dispatch(sortByName())} >
            Name <div className={styles.sort}>{signName}</div>
          </th>
          <th onClick={() => dispatch(sortByPrice())} >
            Price <div className={styles.sort}>{signPrice}</div>
          </th>
          <th>
            Actions
          </th>
        </tr>
      </thead>
      <TableBody sortedProducts={items} />
    </table>
  )
}

function TableBody({ sortedProducts }) {
  const filterText = useAppSelector((state) => state.product.filterText)
  const rows = []

  sortedProducts.forEach((product) => {
    if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return
    }

    rows.push(
      <ProductRow
        key={product.id}
        product={product}
      />
    )
  })

  return <tbody>{rows}</tbody>
}

function ProductRow({ product }) {
  const getparam = "/?productid=" + product.id
  const price = product.price.toLocaleString()

  return (
    <tr>
      <td>
        <Link className={styles.link} href={getparam} >{product.name}</Link>
      </td>
      <td>
        <span className={styles.count} >{product.count}</span>
      </td>
      <td>
        ${price}
      </td>
      <td>
        <Link className={styles.linkLeft} href={getparam} >
          <button>Edit</button>
        </Link>
        <Link href={"/?deleteid=" + product.id} >
          <button>Delete</button>
        </Link>
      </td>
    </tr>
  )
}
