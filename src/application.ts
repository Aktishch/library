import application, { Scripts } from '@scripts'
import './tailwind/style.css'

const initApplication = () => {
  application().finally(() => {
    Scripts()
  })
}

window.addEventListener('DOMContentLoaded', initApplication)
