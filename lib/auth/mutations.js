export const LOGIN = (state, data) => {
    state.isLogged = false;
    state.tokens = data;
};

export const LOGOUT = state => {
    state.isLogged = false;
    state.tokens = null;
};

export const REDIRECT = ( state, data ) => {
    state.referrer = false;
};