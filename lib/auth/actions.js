export async function login ({ commit }, options) {
    try {
        const response = await window.app.axios.post('/oauth/token', options.data);

        response.data.expires_in_date = response.data.expires_in + Date.now();

        commit('LOGIN', JSON.stringify(response.data));

    } catch (error) {
        console.log(error);

        return (null);
    }
}

export const jwtLogin = ({ commit }, data) => {
    let token = data.token;

    let tokenInfo = token.split('.');

    let timestamp = JSON.parse(atob(tokenInfo[1]));

    data.expires_in_date = timestamp.exp * 1000;

    commit('LOGIN', JSON.stringify(data));
};

export const logout = ({ commit }) => {
    commit('LOGOUT')
};