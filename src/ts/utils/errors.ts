import { getEn } from '@utils/get-en'

interface Errors {
  default: string
  tel: string
  email: string
  login: string
  password: string
  select: string
  text: string
  file: {
    default: string
    type: string
    size: string
  }
}

export const errors: Errors = {
  default: getEn() ? 'Fill in this field' : 'Заполните это поле',
  tel: getEn() ? 'Enter the correct number' : 'Введите корректный номер',
  email: getEn() ? 'Enter the correct address' : 'Введите корректный адрес',
  login: getEn() ? 'Invalid username' : 'Неверный логин',
  password: getEn() ? 'Invalid password' : 'Неверный пароль',
  select: getEn() ? 'Choose an option' : 'Выберите вариант',
  text: getEn() ? 'Enter at least 10 characters' : 'Введите не менее 10 символов',
  file: {
    default: getEn() ? 'Upload the file' : 'Загрузите файл',
    type: getEn() ? 'jpg or png only' : 'Только jpg или png',
    size: getEn() ? 'The size is not more than 2 MB' : 'Размер не более 2 мб',
  },
}
