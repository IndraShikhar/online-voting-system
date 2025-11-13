export const isCorrectPassword = async (candidatePassword, userPassword) => {
  // Here you can implement your password comparison logic
  // For simplicity, we are doing a plain text comparison (not recommended for production)
  return candidatePassword === userPassword;
};

export const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
