export default function chengeCheckbox(inputNumber, values) {
  // Если пользователь кликнул по чекбоксу "Select All"
  if (inputNumber == "all") {
    // если есть в массиве хотя бы один false - всем чекбоксам и чекбоксу "Select All" поставим галочки
    if (values.includes(false)) {
      return new Array(values.length).fill(true)
    }
    // иначе (если массив состоит только из true) - инвертируем выбор: снимем галочки со всех чекбоксов
    return new Array(values.length).fill(false)
  }

  let arr = []
  for (let i = 0; i < values.length; i++) {
    if (i == inputNumber-1) {
      arr.push(!values[i]);
    } else {
      arr.push(values[i]);
    }
  }

  return arr
}
