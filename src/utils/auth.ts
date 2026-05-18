const TOKEN_KEY = "cms_token";
const NICKNAME_KEY = "cms_nickname";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string): void =>
  localStorage.setItem(TOKEN_KEY, token);

export const removeToken = (): void => localStorage.removeItem(TOKEN_KEY);

export const setNickname = (nickname: string): void =>
  localStorage.setItem(NICKNAME_KEY, nickname);
export const getNickname = (): string | null =>
  localStorage.getItem(NICKNAME_KEY);
export const removeNickname = (): void =>
  localStorage.removeItem(NICKNAME_KEY);

const parseJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const payload = parseJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;
  return payload.exp * 1000 < Date.now();
};

export const getCurrentUserId = (): number | null => {
  const token = getToken();
  if (!token) return null;
  const payload = parseJwtPayload(token);
  if (!payload || typeof payload.sub !== "number") return null;
  return payload.sub;
};

export const getRole = (): string | null => {
  const token = getToken();
  if (!token) return null;
  const payload = parseJwtPayload(token);
  if (!payload || typeof payload.role !== "string") return null;
  return payload.role;
};

export const isAdmin = (): boolean => getRole() === "admin";

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  if (isTokenExpired(token)) {
    removeToken();
    return false;
  }
  return true;
};
