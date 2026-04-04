const TOKEN_KEY = "token";

//save token to localStorage
export const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
};

//get token from localStorage
export const getToken =() : string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

//remove token from localStorage
export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

//check if user is logged in  
export const isLoggedIn = (): boolean => {
    return !!getToken();
};