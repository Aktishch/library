import { Container, Coordinates, getData, source, TimeOut } from '@utils'

type Shop = HTMLDivElement | null
type Button = HTMLButtonElement | null
type Image = HTMLImageElement | null
type Quantity = HTMLInputElement | null
type ShopItem = HTMLElement | null

const DATA_SHOP: string = getData('shop')
const DATA_PRODUCT: string = getData('product')
const SHOW_VALUE: string = 'show'
const SHOP_CLASSNAMES: string[] = [
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

export default (container: Container = document): void => {
  const shop: Shop = container.querySelector(`*[${DATA_SHOP}]`)

  if (!shop) return

  const body: HTMLElement = document.body
  const close: Button = shop.querySelector(`*[${DATA_SHOP}-close]`)
  const image: Image = shop.querySelector(`*[${DATA_SHOP}-image]`)
  const name: ShopItem = shop.querySelector(`*[${DATA_SHOP}-name]`)
  const quantity: ShopItem = shop.querySelector(`*[${DATA_SHOP}-quantity]`)
  const oldPrice: ShopItem = shop.querySelector(`*[${DATA_SHOP}-oldprice]`)
  const price: ShopItem = shop.querySelector(`*[${DATA_SHOP}-price]`)
  const products: NodeListOf<HTMLDivElement> = container.querySelectorAll(`*[${DATA_PRODUCT}]`)
  let closeTimeOut: TimeOut
  let openTimeOut: TimeOut

  const showShop = (): void => {
    shop.dataset.shop = SHOW_VALUE
  }

  const hideShop = (): void => {
    shop.dataset.shop = ''
  }

  const createShopItem = (event: MouseEvent): void => {
    const div: HTMLDivElement = document.createElement('div')
    const coordinates: Coordinates = {
      top: event.clientY,
      left: event.clientX
    }

    const removeItem = (): void => {
      div.remove()
    }

    div.classList.add(...SHOP_CLASSNAMES)
    div.style.top = `${coordinates.top}px`
    div.style.left = `${coordinates.left}px`
    div.innerHTML = `
      <svg class="icon text-second">
        <use href="${source}/img/icons.svg#basket"></use>
      </svg>
    `
    body.appendChild(div)
    div.addEventListener('animationend', removeItem as EventListener, { once: true })
  }

  close?.addEventListener('click', hideShop as EventListener)

  if (products.length) {
    products.forEach((product: HTMLDivElement): void => {
      const productImage: Image = product.querySelector(`*[${DATA_PRODUCT}-image]`)
      const productName: ShopItem = product.querySelector(`*[${DATA_PRODUCT}-name]`)
      const productOldPrice: ShopItem = product.querySelector(`*[${DATA_PRODUCT}-oldprice]`)
      const productPrice: ShopItem = product.querySelector(`*[${DATA_PRODUCT}-price]`)
      const productQuantity: Quantity = product.querySelector(`*[${DATA_PRODUCT}-quantity]`)
      const productBtn: Button = product.querySelector(`*[${DATA_PRODUCT}-button]`)

      const addInShop = (event: MouseEvent): void => {
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

        openTimeOut = setTimeout((): void => {
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

          closeTimeOut = setTimeout((): void => {
            hideShop()
          }, 5000)
        }, 300)
      }

      productBtn?.addEventListener('click', addInShop as EventListener)
    })
  }
}
