import { isEn } from '@utils/is-en'

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
  default: isEn ? 'Fill in this field' : 'Заполните это поле',
  tel: isEn ? 'Enter the correct number' : 'Введите корректный номер',
  email: isEn ? 'Enter the correct address' : 'Введите корректный адрес',
  login: isEn ? 'Invalid username' : 'Неверный логин',
  password: isEn ? 'Invalid password' : 'Неверный пароль',
  select: isEn ? 'Choose an option' : 'Выберите вариант',
  text: isEn ? 'Enter at least 10 characters' : 'Введите не менее 10 символов',
  file: {
    default: isEn ? 'Upload the file' : 'Загрузите файл',
    type: isEn ? 'jpg or png only' : 'Только jpg или png',
    size: isEn ? 'The size is not more than 2 MB' : 'Размер не более 2 мб',
  },
}
