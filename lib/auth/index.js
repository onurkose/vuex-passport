import { setJSON, getJSON, removeJSON } from '../util/cookies';

const actions = {


    login ({commit, dispatch}, form) {
        commit('LOGIN')

        return new Promise((resolve, reject) => {
            axios.post('/oauth/token', form)
                .then(
                    response => {
                        commit('UPDATE_STORAGE', {response, form})

                        commit('LOGIN_OK')
                        resolve()
                    })
                .catch(error => {
                    commit('LOGIN_FAIL')

                    reject(error)
                })
        })
    },


    checkStatus ({commit, dispatch, getters}) {
        commit('CHECK_LOGIN');

        const authObject = getters.checkIsLogged();

        return new Promise((resolve, reject) => {
            if (! authObject.access_token) {
                commit('CHECK_LOGIN_FAIL')

                return reject(new Error('No access token stored'))
            }

            const AuthStr = 'Bearer '.concat(authObject.access_token);

            const form = {
                client_id: 7,
                client_secret: 'qCkOv63le9qFsft1btP31F4LN2EnYX1SaPVgnJEx',
                grant_type: 'refresh_token',
                refresh_token: authObject.refresh_token
            };

            axios.post('/oauth/token', form)
                .then(
                    response => {
                        commit('UPDATE_STORAGE', {response, form})

                        commit('CHECK_LOGIN_OK')
                        resolve()
                    })
                .catch(error => {
                    //dispatch('logout')

                    commit('CHECK_LOGIN_FAIL')

                    reject(error.response.data)
                })
        })
    },



    logout ({commit, dispatch}) {
        commit('LOGOUT_OK')

        if (typeof(Storage) !== "undefined") {
            localStorage.removeItem('auth')
            sessionStorage.removeItem('auth')
        }

        removeJSON('auth')
    },


    register ({commit, dispatch}, form) {
        commit('REGISTER')

        return new Promise((resolve, reject) => {
            axios.post('/auth/register', form)
                .then(
                    response => {
                        const accessToken = response.data.access_token

                        localStorage.setItem('access_token', accessToken)

                        commit('REGISTER_OK', response.data.user)

                        resolve()
                    })
                .catch(error => {
                    commit('REGISTER_FAIL')

                    reject(error.response.data)
                })
        })
    },


    updateProfile ({commit, dispatch}, {id, form}) {
        commit('UPDATE_PROFILE')

        return new Promise((resolve, reject) => {
            axios.put(('/user/' + id), ...form)
                .then(
                    response => {
                        commit('UPDATE_PROFILE_OK', response.data.user)
                        resolve()
                    })
                .catch(error => {
                    commit('UPDATE_PROFILE_FAIL')
                    reject(error.response.data)
                })
        })
    }
};


export default {
    namespaced: true,

    state: {
        isLogged: false,

        me: null,
    },

    getters: {
        checkIsLogged: (state, getters) => {
            if (typeof(Storage) !== "undefined") {
                let testStorage = localStorage.getItem('auth')

                if (testStorage === null) {
                    testStorage = sessionStorage.getItem('auth')
                }

                if (testStorage === null) {
                    testStorage = '{}';
                }

                var authObj = JSON.parse(testStorage);
            } else {
                let testCookie = getJSON('auth')

                var authObj = testCookie === null ? {} : testCookie;
            }

            if (authObj === undefined) {
                return false;
            }

            if (!authObj || authObj === null) {
                return false;
            }

            return authObj.expire_date > Date.now();
        },
    },

    actions,

    mutations: {
        CHECK_LOGIN (state) {},

        CHECK_LOGIN_OK: state => state.isLogged = true,

        CHECK_LOGIN_FAIL: state => state.isLogged = false,

        LOGIN (state) {},

        LOGIN_OK: state => state.isLogged = true,

        LOGIN_FAIL (state) {},

        LOGOUT_OK: state => state.isLogged = false,

        REGISTER (state) {},

        REGISTER_OK (state, user) {
            state.me = user
        },

        UPDATE_PROFILE (state) {},

        UPDATE_PROFILE_OK (state, user) {},

        UPDATE_STORAGE (state, data) {
            /**
             * Laravel Passport gives expires_in in seconds and Date.now() is miliseconds
             *  so it's better to multiply by 1000 to achieve an accurate timing of tokens
             */

            data.response.data.expire_date = ( data.response.data.expires_in * 1000 ) + Date.now()


            /**
             * Test if Web Storage API is available and useCookie variable is set to use
             *  Cookie for auth data storage against Web Storage
             */

            if (typeof(Storage) !== "undefined" && !data.form.useCookie) {

                /**
                 * If user wants to be remembered or not, then select appropriate storage
                 *  for short or long term memory to store auth data received from Passport
                 */

                let selectedStorage = data.form.rememberMe ? localStorage : sessionStorage

                selectedStorage.setItem('auth', JSON.stringify(data.response.data))


                /**
                 * Check and set on localStorage if user wants to his/her email is remembered
                 * forever or not, if it's not, remove the localStorage item
                 */

                data.form.rememberEmail ? localStorage.setItem('email', data.form.username) : localStorage.removeItem('email');


                /**
                 * Remove the long or short term auth data so it'll not confuse us when
                 *  looking into Storage tab in our browser during development/testing
                 */

                data.form.rememberMe ? sessionStorage.removeItem('auth') : localStorage.removeItem('auth')

                /**
                 * Also remove the Cookie Json data if any
                 */

                removeJSON('auth')
            } else {
                /**
                 * Short and long term Web Storage trick is implemented to Cookie usage down here
                 * Since our auth data has it's own expire date property, long term cookie is set to
                 * a year long expiration and short term is to end of the session only
                 */

                setJSON('auth', data.response.data, data.form.rememberMe ? { expires: '1Y' } : {})

                /**
                 * Cookie version of the remember my email option
                 */

                data.form.rememberEmail ? setJSON('email', data.form.username) : removeJSON('email');
            }
        }
    }
}