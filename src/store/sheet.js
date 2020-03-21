// googleapisはサーバーサイドでのみ動作する
const { google } = require("googleapis");
const privatekey = require("../credentials.json");

export const state = () => ({
  users: {}
});

export const getters = {
  users: state => {
    return state.users;
  }
};

export const mutations = {
  set_users(state, users) {
    for (const index in users) {
      const user = users[index];
      const userId = user.id;
      state.users = { ...state.users, [userId]: user };
    }
  },
  set_user(state, user) {
    const userId = user.id;
    state.users = { ...state.users, [userId]: user };
  }
};

export const actions = {
  // スプレッドシートの値を読み込む
  async getSheetsData({ state, commit, dispatch }) {
    // authorizeで認証した上でreadDataFromSheetを実行する
    const promise = dispatch("authorize");
    await promise
      .then(async token => {
        await dispatch("readDataFromSheet", token);
      })
      .catch(error => {
        console.log(error);
      });
  },

  // サービスアカウントのキーファイルを使って認証する
  authorize({ state, commit }) {
    return new Promise((resolve, reject) => {
      const jwtClient = new google.auth.JWT(
        privatekey.client_email,
        null,
        privatekey.private_key,
        [
          "https://www.googleapis.com/auth/spreadsheets",
          "https://www.googleapis.com/auth/drive"
        ]
      );

      jwtClient.authorize(
        response => {
          console.log("Successfully connected!");
          resolve(jwtClient);
        },
        error => {
          reject(error);
        }
      );
    });
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
};
