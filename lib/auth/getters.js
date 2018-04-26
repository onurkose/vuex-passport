export const checkIsLogged = ( state, getters ) => {
    if (!state.isLogged) {
        return false
    }

    let auth = getters.authObject;

    if (!auth) {
        return false;
    }

    return auth.expires_in_date > Date.now();
};

export const authObject = (state) => {
    let tokens = state.tokens;

    if (!tokens) {
        tokens = '{}';
    }

    return JSON.parse(tokens);
};

export const accessToken = (state, getters) => {
    return getters.authObject.access_token;
};

export const tokenType = (state, getters) => {
    return getters.authObject.token_type;
};

export const expiresIn = (state, getters) => {
    return getters.authObject.expires_in;
};

export const expiresInDate = (state, getters) => {
    return getters.authObject.expires_in_date;
};

export const refreshToken = (state, getters) => {
    return getters.authObject.refresh_token;
};