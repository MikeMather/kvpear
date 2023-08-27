
export const isUrlSafe = (str: string): boolean => {
  return /^[a-zA-Z0-9-_]+$/.test(str);
}