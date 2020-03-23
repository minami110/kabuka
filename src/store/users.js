export const state = () => ({
    loginuser: {
        id: "",
        name: ""
    },
    // userid -> user
    users: {}
})

export const getters = {
    users: state => {
        return state.users
    },
    loginuser: state => {
        return state.loginuser
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
    },
    set_loginuser(state, user) {
        try {
            state.loginuser = {
                id: user.id,
                name: user.name
            }
        }
        catch (e) {
            state.loginuser = { id: "", name: "" }
        }
    }
}

export const actions = {
    async getUsers({ commit }) {

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
            }).then(response => {
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
    },

    loginUseName({ state, commit }, { name }) {
        for (const user_id in state.users) {
            const user = state.users[user_id];
            if (name == user.name) {
                commit("set_loginuser", user)
                return true;
            }
        }
        return false;
    },

    loginUseId({ state, commit }, { id }) {
        if (state.users[id]) {
            commit("set_loginuser", state.users[id])
        }
    },

    logout({ commit }) {
        commit("set_loginuser", null)
        return true;
    }
}