const user_key = "user";
// const localStorage = window.localStorage;

export const setUser = (user) => {
  // Replace or create token in localStorage
  localStorage.setItem(user_key, JSON.stringify(user));
};

export const getUser = () => {
  // Get the token from localStorage
  const token = localStorage.getItem(user_key) || "";
  if (token === "") return null;
  return JSON.parse(token);
};

export const removeUser = () => {
  // Remove the token from localStorage
  localStorage.removeItem(user_key);
};
