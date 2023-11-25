export const formatDate = (
  date,
  locale,
  options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
) => {
  return new Intl.DateTimeFormat(locale, options).format(date);
};

// Example usage:
// const today = new Date();
// const formattedDate = formatDate(today, "en-US", {
//   weekday: "long",
//   year: "numeric",
//   month: "long",
//   day: "numeric",
// });
// console.log(formattedDate); // Outputs something like "Tuesday, October 18, 2023"
