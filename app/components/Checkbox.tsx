"use client"

import chengeCheckbox from "@/lib/features/chengeCheckbox"
import { COUNTRIES } from "@/lib/data.js"
import styles from "./Checkbox.module.css"

export default function Checkbox({ radioValue, checkboxValues, setCheckboxValues }) {
  if (radioValue) {
    let checkboxValuesCopy = checkboxValues
    let checkAll = true

    // получим список городов для выбранной страны (её порядковый номер передаётся в radioValue)
    const cities = Object.values(COUNTRIES[radioValue-1])[0]

    // если в состоянии компонента не хранятся никакие данные о выбранных городах
    if (checkboxValues === undefined) {
      checkboxValuesCopy = new Array(cities.length).fill(false)
      checkAll = false
    } else {
    // иначе узнаем, есть ли в массиве хотя бы один false - если да, то чекбокс "Select All" должен быть без галочки
      for (const check of checkboxValuesCopy) {
        if (check === false) {
          checkAll = false
          break
        }
      }
    }

    const rows = [
      <div key="all" className={styles.checkboxAll}>
        <input
          className={styles.checkbox}
          type="checkbox"
          value="all"
          checked={checkAll}
          onChange={(e) => setCheckboxValues(chengeCheckbox(e.target.value, checkboxValuesCopy))}
        />
        Select All
      </div>
    ]

    let i = 0
    cities.forEach((city) => {
      rows.push(
        <div key={i+1}>
          <input
            className={styles.checkbox}
            type="checkbox"
            value={i+1}
            checked={checkboxValuesCopy[`${i}`]}
            onChange={(e) => setCheckboxValues(chengeCheckbox(e.target.value, checkboxValuesCopy))}
          />
          {city}
        </div>
      )
      i++
    })

    return <div>{rows}</div>
  }
}
