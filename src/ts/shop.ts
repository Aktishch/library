import { Coordinates } from './utils'

export default (): void => {
  const shop = document.querySelector('*[data-shop]') as HTMLDivElement

  if (!shop) return

  const body = document.body as HTMLBodyElement
  const close = shop.querySelector('*[data-shop-close]') as HTMLButtonElement
  const image = shop.querySelector('*[data-shop-image]') as HTMLImageElement
  const name = shop.querySelector('*[data-shop-name]') as HTMLSpanElement
  const quantity = shop.querySelector('*[data-shop-quantity]') as HTMLSpanElement
  const oldPrice = shop.querySelector('*[data-shop-oldprice]') as HTMLSpanElement
  const price = shop.querySelector('*[data-shop-price]') as HTMLSpanElement
  const products = document.querySelectorAll('*[data-product]') as NodeListOf<HTMLDivElement>
  const classes: string[] = [
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
    'size-10',
  ]

  let timeOut: NodeJS.Timeout

  const shopShow = (): void => {
    shop.dataset.shop = 'show'
  }

  const shopHidden = (): void => {
    shop.dataset.shop = ''
  }

  const createAnimInShop = (event: MouseEvent): void => {
    const inShop = document.createElement('div') as HTMLDivElement
    const coordinates: Coordinates = {
      top: event.clientY,
      left: event.clientX,
    }

    inShop.classList.add(...classes)
    inShop.style.top = `${coordinates.top}px`
    inShop.style.left = `${coordinates.left}px`
    inShop.innerHTML = `
      <svg class="icon text-second">
        <use xlink:href="/img/icons.svg#basket"></use>
      </svg>`
    body.appendChild(inShop)
    setTimeout((): void => inShop.remove(), 2000)
  }

  close.addEventListener('click', shopHidden as EventListener)

  products.forEach((product: HTMLDivElement): void => {
    if (!product) return

    const productImage = product.querySelector('*[data-product-image]') as HTMLImageElement
    const productName = product.querySelector('*[data-product-name]') as HTMLElement
    const productOldPrice = product.querySelector('*[data-product-oldprice]') as HTMLSpanElement
    const productPrice = product.querySelector('*[data-product-price]') as HTMLSpanElement
    const productQuantity = product.querySelector('*[data-product-quantity]') as HTMLInputElement
    const productBtn = product.querySelector('*[data-product-button]') as HTMLButtonElement

    const fillingShop = (): void => {
      if (shop.dataset.shop === 'show') shopHidden()

      setTimeout((): void => {
        shopShow()

        if (image && productImage) image.src = String(productImage.dataset.productImage)
        if (name && productName) name.innerText = String(productName.textContent)

        quantity && productQuantity ? (quantity.innerText = String(productQuantity.value)) : (quantity.innerText = '1')

        oldPrice && productOldPrice
          ? (oldPrice.innerText = String(productOldPrice.textContent))
          : (oldPrice.innerText = '')

        if (price && productPrice) price.innerText = String(productPrice.textContent)
        if (timeOut) clearTimeout(timeOut)

        timeOut = setTimeout((): void => shopHidden(), 5000)
      }, 300)
    }

    productBtn.addEventListener('click', ((event: MouseEvent): void => {
      createAnimInShop(event)
      fillingShop()
    }) as EventListener)
  })
}
