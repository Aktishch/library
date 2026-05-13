import { Coordinates, getSource } from '@utils'

const className: string[] = [
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
  let timeOut: NodeJS.Timeout

  const showShop = (): void => {
    shop.dataset.shop = 'show'
  }

  const hideShop = (): void => {
    shop.dataset.shop = ''
  }

  const createShopItem = (event: MouseEvent): void => {
    const div = document.createElement('div') as HTMLDivElement
    const coordinates: Coordinates = {
      top: event.clientY,
      left: event.clientX,
    }

    div.classList.add(...className)
    div.style.top = `${coordinates.top}px`
    div.style.left = `${coordinates.left}px`
    div.innerHTML = `
      <svg class="icon text-second">
        <use href="${getSource()}/img/icons.svg#basket"></use>
      </svg>`
    body.appendChild(div)
    setTimeout((): void => div.remove(), 2000)
  }

  close.addEventListener('click', hideShop as EventListener)

  products.forEach((product: HTMLDivElement): void => {
    if (!product) return

    const productImage = product.querySelector('*[data-product-image]') as HTMLImageElement
    const productName = product.querySelector('*[data-product-name]') as HTMLElement
    const productOldPrice = product.querySelector('*[data-product-oldprice]') as HTMLSpanElement
    const productPrice = product.querySelector('*[data-product-price]') as HTMLSpanElement
    const productQuantity = product.querySelector('*[data-product-quantity]') as HTMLInputElement
    const productBtn = product.querySelector('*[data-product-button]') as HTMLButtonElement

    const addInShop = (): void => {
      if (shop.dataset.shop === 'show') hideShop()

      setTimeout((): void => {
        showShop()

        if (image && productImage && productImage.dataset.productImage) image.src = productImage.dataset.productImage
        if (name && productName) name.innerText = productName.textContent
        if (price && productPrice) price.innerText = productPrice.textContent

        quantity.innerText = quantity && productQuantity ? productQuantity.value : '1'
        oldPrice.innerText = oldPrice && productOldPrice ? productOldPrice.textContent : ''

        if (timeOut) clearTimeout(timeOut)

        timeOut = setTimeout((): void => hideShop(), 5000)
      }, 300)
    }

    productBtn.addEventListener('click', ((event: MouseEvent): void => {
      createShopItem(event)
      addInShop()
    }) as EventListener)
  })
}
