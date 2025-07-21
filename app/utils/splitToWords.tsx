export const splitToWords = (str: string): string => {
  let result = str.replace(/[_-]/g, ' ');

  result = result.replace(/([a-z])([A-Z])/g, '$1 $2');

  return result
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
