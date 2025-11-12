export const validateLogin = (login) => {
  const regex = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;
  if (!regex.test(login)) {
    return 'Логин должен содержать только латинские буквы и цифры, начинаться с буквы и быть от 4 до 20 символов';
  }
  return '';
};

export const validatePassword = (password) => {
  if (password.length < 6) {
    return 'Пароль должен содержать минимум 6 символов';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Пароль должен содержать хотя бы одну заглавную букву';
  }
  if (!/\d/.test(password)) {
    return 'Пароль должен содержать хотя бы одну цифру';
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Пароль должен содержать хотя бы один специальный символ';
  }
  return '';
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return 'Введите корректный email адрес';
  }
  return '';
};

export const validateFullName = (name) => {
  if (name.trim().length < 2) {
    return 'Полное имя должно содержать минимум 2 символа';
  }
  return '';
};

export const validateFile = (file) => {
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return 'Размер файла не должен превышать 100MB';
  }
  return '';
};