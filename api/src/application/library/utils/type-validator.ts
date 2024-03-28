export function isFilledArray<T>(
  possibleArr: unknown
): possibleArr is Array<T> {
  return Array.isArray(possibleArr) && possibleArr.length > 0;
}
export function isFilledArrayKey<T>(
  possibleArr: unknown,
  key: keyof T,
): possibleArr is Array<T> {
  if (!isFilledArray<T>(possibleArr)) return false;
  for (const item of possibleArr) {
    if (!item[key]) return false;
  }
  return true;
}
export function isOneOf<T>(
  possibleOneOf: unknown,
  arrOfPossibilities: T[],
): possibleOneOf is T {
  return arrOfPossibilities.includes(possibleOneOf as any);
}
export function isDefined<T>(
  possibleUndefined: unknown
): possibleUndefined is Exclude<T, undefined> {
  return possibleUndefined !== undefined;
} 
