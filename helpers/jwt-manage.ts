export const jwtManage = {
    setToken: (token: string) => {
        localStorage.setItem('access_token', token);
    },

    getToken: () => {
        return localStorage.getItem('access_token');
    },

    remoteToken: () => {
        localStorage.removeItem('access_token');
    }
}