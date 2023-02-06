const dateTodayDdMmYyyy = () => {
  const date = new Date(); // today's date
  const format = 'dd/mm/yyyy';
  const map = {
    mm: date.getMonth() + 1,
    dd: date.getDate(),
    yy: date.getFullYear().toString().slice(-2),
    yyyy: date.getFullYear()
  }
  return format.replace(/dd|mm|yyyy/gi, matched => map[matched])
};