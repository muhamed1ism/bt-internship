export function getTotalPages(totalDataLenght: number, itemsPerPage: number) {
  return Math.ceil(totalDataLenght / itemsPerPage);
}
