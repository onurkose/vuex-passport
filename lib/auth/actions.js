export const login = ({ commit }, options) => {
    Vue.axios.post('/oauth/token', options.data).then(function (r) {
        r.data.expires_in_date = r.data.expires_in + Date.now();

        commit('LOGIN', JSON.stringify(r.data));
    }, function (r) {
        console.log(r.data)
    });
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