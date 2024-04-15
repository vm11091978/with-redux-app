"use client"

import { COUNTRIES } from "@/lib/data.js"

export default function Radio({ radioValue, setRadioValue, setCheckboxValues }) {
  const rows = []
  let i = 1
  COUNTRIES.forEach((country) => {
    rows.push(
      <div key={i}>
        <input
          type="radio"
          name="radio"
          value={i}
          checked={radioValue == `${i}` ? true : false}
          onChange={(e) => {setRadioValue(e.target.value); setCheckboxValues(undefined);}}
        />
        {Object.keys(country)}
      </div>
    )
    i++
  })

  return <div>{rows}</div>
}
