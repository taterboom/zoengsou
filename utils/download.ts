export const download = (filename: string, url: string) => {
  const anchorEl = document.createElement("a")
  anchorEl.download = filename
  anchorEl.href = url
  anchorEl.style.display = "none"
  anchorEl.click()
}
