export const login = ({ commit }, data) => {
    data.expires_in_date = data.expires_in + Date.now();

    commit('LOGIN', JSON.stringify(data));
};

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