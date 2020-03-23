// googleapisはサーバーサイドでのみ動作する

export const state = () => ({
    users: {},
})

export const getters = {
    users: state => {
        return state.users
    }
}

export const mutations = {
    set_users(state, users) {
        for (const index in users) {
            const user = users[index]
            if (user.name) {
                state.users = { ...state.users, [user.id]: user }
            }
        }
    },
    set_user(state, user) {
        state.users = { ...state.users, [user.id]: user }
    }
}

export const actions = {
    async getUsers({ commit }) {

        const handleErrors = (res) => {
            if (res.ok) {
                return res;
            }

            switch (res.status) {
                case 400: throw Error('INVALID_TOKEN');
                case 401: throw Error('UNAUTHORIZED');
                case 500: throw Error('INTERNAL_SERVER_ERROR');
                case 502: throw Error('BAD_GATEWAY');
                case 404: throw Error('NOT_FOUND');
                default: throw Error('UNHANDLED_ERROR');
            }
        };

        // GAS API endpoint 
        // let url = "/api-user/";
        const options = {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        let users = []

        let url = "https://script.google.com/macros/s/AKfycbwy3lhLdxw519ix25ca8DBUJVTq_C3yi8II71bJrWGi215WuXRW/exec";
        await fetch(url, options)
            .catch((e) => {
                throw Error(e);
            })
            .then(handleErrors)
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            }).then(responseAsJson => {
                users = responseAsJson;
            }).catch(function (error) {
                console.log('Looks like there was a problem: \n', error);
            });

        // update store
        if (users.length > 0) {
            commit("set_users", users)
        }
    }
}