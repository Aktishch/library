import { getData, source } from '@utils'

const DATA_SHOP = getData('shop')
const DATA_PRODUCT = getData('product')
const SHOW_VALUE = 'show'
const SHOP_CLASSNAMES = [
  'in-shop',
  'flex',
  'items-center',
  'justify-center',
  'fixed',
  'z-30',
  'bg-primary',
  'rounded-lg',
  'pointer-events-none',
  '-translate-y-1/2',
  '-translate-x-1/2',
  'size-10'
]

export default (container: Document | HTMLElement = document) => {
  const shop: HTMLDivElement | null = container.querySelector(`*[${DATA_SHOP}]`)

  if (!shop) return

  const body = document.body
  const close: HTMLButtonElement | null = shop.querySelector(`*[${DATA_SHOP}-close]`)
  const image: HTMLImageElement | null = shop.querySelector(`*[${DATA_SHOP}-image]`)
  const name: HTMLElement | null = shop.querySelector(`*[${DATA_SHOP}-name]`)
  const quantity: HTMLElement | null = shop.querySelector(`*[${DATA_SHOP}-quantity]`)
  const oldPrice: HTMLElement | null = shop.querySelector(`*[${DATA_SHOP}-oldprice]`)
  const price: HTMLElement | null = shop.querySelector(`*[${DATA_SHOP}-price]`)
  const products = container.querySelectorAll<HTMLDivElement>(`*[${DATA_PRODUCT}]`)
  let closeTimeOut: NodeJS.Timeout | undefined
  let openTimeOut: NodeJS.Timeout | undefined

  const showShop = () => {
    shop.dataset.shop = SHOW_VALUE
  }

  const hideShop = () => {
    shop.dataset.shop = ''
  }

  const createShopItem = (event: MouseEvent) => {
    const div = document.createElement('div')
    const { clientY, clientX } = event

    const removeItem = () => {
      div.remove()
    }

    div.classList.add(...SHOP_CLASSNAMES)
    div.style.top = `${clientY}px`
    div.style.left = `${clientX}px`
    div.innerHTML = `
      <svg class="icon text-second">
        <use href="${source}/img/icons.svg#basket"></use>
      </svg>
    `
    body.appendChild(div)
    div.addEventListener('animationend', removeItem, { once: true })
  }

  close?.addEventListener('click', hideShop)

  if (products.length) {
    products.forEach((product) => {
      const productImage: HTMLImageElement | null = product.querySelector(`*[${DATA_PRODUCT}-image]`)
      const productName: HTMLElement | null = product.querySelector(`*[${DATA_PRODUCT}-name]`)
      const productOldPrice: HTMLElement | null = product.querySelector(`*[${DATA_PRODUCT}-oldprice]`)
      const productPrice: HTMLElement | null = product.querySelector(`*[${DATA_PRODUCT}-price]`)
      const productQuantity: HTMLInputElement | null = product.querySelector(`*[${DATA_PRODUCT}-quantity]`)
      const productBtn: HTMLButtonElement | null = product.querySelector(`*[${DATA_PRODUCT}-button]`)

      const addInShop = (event: MouseEvent) => {
        createShopItem(event)

        if (closeTimeOut) {
          clearTimeout(closeTimeOut)
        }

        if (openTimeOut) {
          clearTimeout(openTimeOut)
        }

        if (shop.dataset.shop === SHOW_VALUE) {
          hideShop()
        }

        openTimeOut = setTimeout(() => {
          showShop()

          if (image && productImage?.dataset.productImage) {
            image.src = productImage.dataset.productImage
          }

          if (name) {
            name.innerText = productName?.textContent || ''
          }

          if (price) {
            price.innerText = productPrice?.textContent || ''
          }

          if (oldPrice) {
            oldPrice.innerText = productOldPrice?.textContent || ''
          }

          if (quantity) {
            quantity.innerText = productQuantity ? productQuantity.value : '1'
          }

          closeTimeOut = setTimeout(() => {
            hideShop()
          }, 5000)
        }, 300)
      }

      productBtn?.addEventListener('click', addInShop)
    })
  }
}
