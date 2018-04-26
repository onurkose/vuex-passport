export const isLogged = (state) => {
    if (!state.isLogged) {
        return false
    }

    let auth = authObject();

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

export const accessToken = () => {
    return authObject().access_token
};

export const tokenType = () => {
    return authObject().token_type;
};

export const expiresIn = () => {
    return authObject().expires_in;
};

export const expiresInDate = () => {
    return authObject().expires_in_date;
};

export const refreshToken = () => {
    return authObject().refresh_token;
};