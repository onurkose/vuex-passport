import auth from '../auth'

const checkOnFamily = (family) => {
    for (let i = 0; i < family.length - 1; i++) {
        if (typeof family[i].meta.guarded !== 'undefined') {
            return family[i].meta.guarded;
        }
    }

    return false
};

const authRoutes = [
    'AuthLogin',
    'AuthRegister',
    'AuthReset'
];

export default (login, index) => {
    if (typeof login === 'undefined') {
        login = 'login';
    }

    if (typeof index === 'undefined') {
        index = 'index';
    }

    return (to, from, next) => {
        let isLogged = auth.getters.checkIsLogged();

        console.log('isLogged: ' + isLogged)

        if (isLogged && authRoutes.indexOf(to.name) !== -1) {
            if (authRoutes.indexOf(from.name) === -1) {
                return next( { path: from.path } );
            }

            return next( { name: index } );
        }

        let guarded = to.meta.guarded;

        if (typeof guarded === 'undefined') {
            guarded = checkOnFamily(to.matched);
        }

        if (!guarded || isLogged) {
            return next();
        } else {
            // Should notedown the referrer
            // So we can redirect the user
            // where the client belongs after login
            return next({ path: login });
        }
    }
}
