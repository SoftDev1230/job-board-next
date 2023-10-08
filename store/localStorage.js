export function saveToLocalStorage(key, val) {
  try {
    localStorage.setItem(key, val);
    return true;
  } catch (err) {
    return undefined;
  }
}

export function getToken(requiredToken) {
  try {
    const token = localStorage.getItem(requiredToken);
    if (token === null) {
      return undefined;
    }
    return token;
  } catch (err) {
    return undefined;
  }
}

export function clearToken() {
  try {
    localStorage.clear();
    return true;
  } catch (err) {
    return undefined;
  }
}
