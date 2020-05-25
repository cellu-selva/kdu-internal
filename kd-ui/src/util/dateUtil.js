export const formatDate = (dateStr, defaultVal) => {
  if (dateStr) {
    const date = new Date(dateStr);
    var mnthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var day = date.getDate();
    var month = mnthArray[date.getMonth()];
    var year = date.getFullYear();
    // return "" + (day <= 9 ? "0" + day : day) + " " + month + ", " + year;
    return month + " " + (day <= 9 ? "0" + day : day) + ", " + year;
  } else {
    return defaultVal;
  }
};

export const formatDateMMDDYYYY = (date) => {
  return (
    date.getFullYear().toString() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, 0) +
    "-" +
    date.getDate().toString().padStart(2, 0)
  );
};
