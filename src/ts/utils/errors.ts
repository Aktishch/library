import { en } from '@utils/en'

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
  default: en ? 'Fill in this field' : 'Заполните это поле',
  tel: en ? 'Enter the correct number' : 'Введите корректный номер',
  email: en ? 'Enter the correct address' : 'Введите корректный адрес',
  login: en ? 'Invalid username' : 'Неверный логин',
  password: en ? 'Invalid password' : 'Неверный пароль',
  select: en ? 'Choose an option' : 'Выберите вариант',
  text: en ? 'Enter at least 10 characters' : 'Введите не менее 10 символов',
  file: {
    default: en ? 'Upload the file' : 'Загрузите файл',
    type: en ? 'jpg or png only' : 'Только jpg или png',
    size: en ? 'The size is not more than 2 MB' : 'Размер не более 2 мб',
  },
}
