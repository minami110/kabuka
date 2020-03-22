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

        // GAS API endpoint 
        let url = "https://script.google.com/macros/s/AKfycbwy3lhLdxw519ix25ca8DBUJVTq_C3yi8II71bJrWGi215WuXRW/exec";
        let users = []
        await this.$axios
            .get(url)
            .then(r => {
                users = r.data
            })

        // update store
        if (users.length > 0) {
            commit("set_users", users)
        }
    }
}