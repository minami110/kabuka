export const state = () => ({
  loginuser: {
    id: '',
    name: '',
    islandName: ''
  },
  // userid -> user
  users: {}
})

export const getters = {
  users: (state) => {
    return state.users
  },
  loginuser: (state) => {
    return state.loginuser
  }
}

export const mutations = {
  set_users(state, users) {
    for (const index in users) {
      const user = users[index]
      if (user.name) {
        switch (user.id) {
          case '1':
            user.color = '#B8860B'
            break
          case '2':
            user.color = '#CC6666'
            break
          case '3':
            user.color = '#5F9EA0'
            break
          case '5':
            user.color = '#336699'
            break
          case '6':
            user.color = '#CCCC66'
            break
          case '7':
            user.color = '#996699'
            break
          case '9':
            user.color = '#993300'
            break
          case '10':
            user.color = '#006633'
            break
          default:
            let rand = Math.floor(
              Math.abs(Math.sin(user.id) * 16777215) % 16777215
            )
            rand = (rand + 16777215) / 2
            user.color = '#' + rand.toString(16)
        }

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
        name: user.name,
        islandName: user['Island Name'].split('島')[0]
      }
    } catch (e) {
      state.loginuser = { id: '', name: '', islandName: '' }
    }
  }
}

export const actions = {
  async getUsers({ commit }) {
    // GAS API endpoint
    // let url = "/api-user/";
    const options = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    let users = []

    const url =
      'https://script.google.com/macros/s/AKfycbwy3lhLdxw519ix25ca8DBUJVTq_C3yi8II71bJrWGi215WuXRW/exec'
    await fetch(url, options)
      .catch((e) => {
        throw new Error(e)
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return response.json()
      })
      .then((responseAsJson) => {
        users = responseAsJson
      })
      .catch(function(error) {
        console.log('Looks like there was a problem: \n', error)
      })

    // update store
    if (users.length > 0) {
      commit('set_users', users)
    }
  },

  loginUseName({ state, commit }, { name }) {
    for (const user_id in state.users) {
      const user = state.users[user_id]
      // check username
      if (name == user.name) {
        commit('set_loginuser', user)
        return true
      }
    }
    return false
  },

  loginUseId({ state, commit }, { id }) {
    if (state.users[id]) {
      commit('set_loginuser', state.users[id])
    }
  },

  logout({ commit }) {
    commit('set_loginuser', null)
    return true
  }
}
