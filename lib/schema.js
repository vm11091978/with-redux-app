const bull = " " + "\u2022" + " " // HTML '&bull;'

export const schema = {
  type: "object",
  properties: {
   name: {type: "string", minLength: 1, maxLength: 15, errorMessage: {
        minLength: bull+'Required field',
        maxLength: bull+'Длина поля не может превышать 15 символов'
      }
    },
    email: {type: "string", format: "email", errorMessage: bull+'Incorrect email'},
    count: {type: "integer", errorMessage: bull+'Количество должно быть целым числом'},
    price: {type: "number", minimum: 0, errorMessage: {
        type: bull+'Некорректное число',
        // exclusiveMinimum:
        minimum: bull+'Цена не может быть меньше нуля'
      }
    },
    fieldCheck: {type: "boolean", errorMessage: bull+'Выберите город'},
  },
  required: ["name", "count", "price"],
  additionalProperties: false
}
