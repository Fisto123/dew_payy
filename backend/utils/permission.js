const valuesToCheck = ["corporate_owner", "product_owner"];

export const hasPermission = (arr) => {
  const exists = valuesToCheck.some((value) => arr.includes(value));
  return exists;
};
