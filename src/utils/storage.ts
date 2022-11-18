export function getItem(key: string) {
  let result = localStorage.getItem(key)
  if (result) result = JSON.parse(result)
  return result
}

export function setItem(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeItem(key: string) {
  localStorage.removeItem(key)
}