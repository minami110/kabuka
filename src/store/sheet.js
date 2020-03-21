// googleapisはサーバーサイドでのみ動作する

if (process.server) {
    var { google } = require('googleapis')
    var privatekey = require('../credentials.json')
}

export const state = () => ({
    users: {},
})

export const getters = {
    users: state => {
        return state.users
    }
}

export const mutations = {
    set_user(state, user) {
        state.users = { ...state.users, [user.id]: user }
    }
}

export const actions = {
    // スプレッドシートの値を読み込む
    async getSheetsData({ dispatch }) {
        // authorizeで認証した上でreadDataFromSheetを実行する
        await dispatch('authorize')
            .then(async token => {
                await dispatch('readDataFromSheet', token)
            }).catch((error) => {
                console.log(error)
            })
    },

    // サービスアカウントのキーファイルを使って認証する
    authorize({ state, commit }) {
        return new Promise((resolve, reject) => {
            const jwtClient = new google.auth.JWT(
                privatekey.client_email,
                null,
                privatekey.private_key,
                [
                    'https://www.googleapis.com/auth/spreadsheets',
                    'https://www.googleapis.com/auth/drive'
                ]
            )

            jwtClient.authorize(
                (response) => {
                    console.log('Successfully connected!')
                    resolve(jwtClient)
                },
                (error) => {
                    reject(error)
                })
        })
    },
    // データ読み込み用
    async readDataFromSheet({ commit }, jwtClient) {
        // データの取得にgetを使用する
        const parms = {
            auth: jwtClient,
            spreadsheetId: "1kbpmZ2AJJNxfDqhoY6dIipY9OCe_CFYVu3zJv3oXu5A",
            range: "member!A:B"
        };

        const sheets = google.sheets("v4");

        try {
            const response = (await sheets.spreadsheets.values.get(parms)).data;
            // TODO: Change code below to process the `response` object:
            console.log(JSON.stringify(response, null, 2));
            for (const row of response.values) {
                commit("set_user", {
                    id: row[0],
                    name: row[1]
                });
            }
        } catch (err) {
            console.error(err);
        }
    }
}