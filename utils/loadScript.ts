function loadScript(url: string) {
  return new Promise<void>((res, rej) => {
    const el = document.createElement("script")
    el.addEventListener("load", () => {
      res()
    })
    el.addEventListener("error", () => {
      rej()
    })
    el.src = url
    document.body.appendChild(el)
  })
}

export default loadScript
