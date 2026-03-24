export default (): void => {
  const loaders = document.querySelectorAll('*[data-loader]') as NodeListOf<HTMLDivElement>

  loaders.forEach((loader: HTMLDivElement) => {
    if (loader) loader.remove()
  })
}
