import format from 'date-fns/format'

export const state = () => ({
    // userid -> user
    kabuValues: {}
})

export const getters = {
    kabuValues: state => {
        return state.kabuValues
    }
}

export const mutations = {
    set_kabuValues(state, dates) {
        for (const index in dates) {
            const kabuValue = dates[index]
            if (kabuValue.id) {
                state.kabuValues = { ...state.kabuValues, [kabuValue.id]: kabuValue }
            }
        }
    }
}

export const actions = {
    async getKabuValues({ commit }) {
        // GAS API endpoint 
        // let url = "/api-user/";
        const options = {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        let kabuValues = []

        let url = "https://script.google.com/macros/s/AKfycbxmf6MCX6ClhQzd0ZgEr0UOBfRRR6U7aSf4QfLvcneMHIMXbXI/exec";
        await fetch(url, options)
            .catch((e) => {
                throw Error(e);
            }).then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            }).then(responseAsJson => {
                kabuValues = responseAsJson;
            }).catch(function (error) {
                console.log('Looks like there was a problem: \n', error);
            });

        // update store
        if (kabuValues.length > 0) {
            commit("set_kabuValues", kabuValues)
        }
    },

    async postKabuValue({ state, commit, dispatch }, { date, isPm, userId, value }) {

        // 投稿前に, カブ値のデータを最新の状態に更新する
        await dispatch('getKabuValues');

        // データの型変換を行う
        const isPmNum = isPm ? 1 : 0;
        const dateStrJa = format(date, "yyyy/MM/dd")

        // カブ値データのユニークIDを作成する
        // [user-id]-[date]-[isPm]
        const dateForId = format(date, "yyyyMMdd")
        const id = dateForId + "-" + String(isPmNum) + "-" + String(userId);

        // すでに存在している存在しているIDなら更新, なければ新規作成を行う
        let bUpdate = false;
        if (state.kabuValues[id]) {
            console.log("already existed kabuValue. update old value.")
            bUpdate = true;
        }

        // application/x-www-form-urlencoded 用のpayloadを作成
        const params = new URLSearchParams();
        params.append("id", id)
        params.append("date", dateStrJa)
        params.append("isPm", isPmNum) // bool -> int
        params.append("userId", userId)
        params.append("value", value)

        // fetch API のoptionsを作成
        const options = {
            method: "POST",
            body: params,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }

        // GAS API endpoint 
        // https://script.google.com/d/1ywc9_hTS32gLsKn8g579dh9l_EodEPxEAwxO20Z5e2TLW2DuhiEe6JHT/edit
        let url = "https://script.google.com/macros/s/AKfycbxtILUd-tZEVU_SnXwCUxVfOF-XhhGThRKBZ0bfMFR_6O-g3Gg/exec";

        // if update date, append action query
        if (bUpdate) {
            url += "?action=update"
        }

        await fetch(url, options)
            .catch((e) => {
                throw Error(e);
            }).then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            }).then(responseAsJson => {
                return true;
            }).catch(function (error) {
                console.log('Looks like there was a problem: \n', error);
                return false;
            });

    }
}