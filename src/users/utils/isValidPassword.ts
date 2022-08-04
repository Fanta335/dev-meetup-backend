export const isValidPassword = (pass: string): boolean => {
  const passPattern = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,128}$/;
  const result = pass.match(passPattern);
  if (result) {
    return true;
  }
  return false;
};
