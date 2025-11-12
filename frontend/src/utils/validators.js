export const validateLogin = (login) => {
  const regex = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;
  return regex.test(login);
};

export const validatePassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return password.length >= 6 && hasUpperCase && hasNumber && hasSpecialChar;
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateFullName = (name) => {
  return name.trim().length >= 2;
};