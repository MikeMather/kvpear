
export const modifyOneInArray = <T>(array: T[], index: number, changes: Partial<T>): T[] => {
  const item = array.find((_, i) => i === index);
  return [
    ...array.slice(0, index),
    { ...item, ...changes} as T,
    ...array.slice(index + 1)
  ];
}

export const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}