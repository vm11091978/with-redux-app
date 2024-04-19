"use client"

import { useState, useEffect } from "react"
import Modal from "react-modal"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAppDispatch } from "@/lib/hooks"
import { deleteProduct } from "@/lib/features/productSlice"
import ModalForm from "./ModalForm"
import styles from "./ModalWindows.module.css"

export default function ModalWindows() {
  const getParams = useSearchParams()
  const dispatch = useAppDispatch()
  const [modalNumOpen, setModalNumOpen] = useState(null)
  const [dialogNumOpen, setDialogNumOpen] = useState(null)

  let title = "Форма добавления нового товара"
  if (modalNumOpen) {
    title = "Модальное окна товара с id=" + modalNumOpen
  }

  const modalContent = (
    <div className={styles.modalForm} onClick={e => e.stopPropagation()} >
      <div className={styles.modalHeader} >
        <h2>{ title }</h2>
        <Link href={'/'} >
          <span className={styles.modalClose} >&times;</span>
        </Link>
      </div>
      <ModalForm modalNumOpen={modalNumOpen} />
    </div>
  )

  const dialogContent = (
    <div className={styles.modalDialogDelete} >
      <div>
        <p>Are you Sure?</p>
      </div>
      <div onClick={e => e.stopPropagation()}>
        <p>Are you Sure you want to perform action?</p>
        <Link className={styles.linkLeft} href={'/'} >
          <button onClick={() => dispatch(deleteProduct(dialogNumOpen))} >
            Yes
          </button>
        </Link>
        <Link href={'/'} >
          <button>No</button>
        </Link>
      </div>
    </div>
  )

  // Чтобы увидеть работу кода, сделаем небольшую задержку между переходом
  // на страницу с get-параметрами и всплытием модального окна на этой странице
  useEffect(() => {
    const timer = setTimeout(() => {
      // Здесь сравнение обязательно должно быть нестрогим
      if (getParams == "") {
        setModalNumOpen(null)
        setDialogNumOpen(null)
      } else {
        // Переберём все get-параметры: если найдётся параметр,
        // хранящий id товара, запишем этот id в состояние компонента
        for (const param of getParams) {
          if (param[0] === "productid" && param[1] !== "" && param[1] != 0) {
            setModalNumOpen(Number(param[1]))
            break
          }
          // Если найдётся параметр "newproduct",
          // значит нужно показать модальное окно для добавления нового товара
          else if (param[0] === "newproduct") {
            setModalNumOpen(Number(0))
            break
          }
          // Если найдётся параметр "deleteid",
          // значит нужно показать модальное окно для подтверждения удаления товара
          else if (param[0] === "deleteid") {
            setDialogNumOpen(Number(param[1]))
            break
          }
          // Если нет ни одного get-параметра с id товара (т.е. не нужно показывать модальное окно),
          // обнулим соответствующие состояния компонента
          setModalNumOpen(null)
          setDialogNumOpen(null)
        }
      }
    }, 1000);
  }, [getParams])

  return (
    <>
      <Modal className={styles.modal} isOpen={modalNumOpen === null ? false : true} ariaHideApp={false} >
        { modalContent }
      </Modal>
      <Modal className={styles.modal} isOpen={dialogNumOpen === null ? false : true} ariaHideApp={false} >
        { dialogContent }
      </Modal>
    </>
  )
}
