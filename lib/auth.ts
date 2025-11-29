export function saveToken(token: string) { 
  localStorage.setItem("token", token);
  
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}


export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}
