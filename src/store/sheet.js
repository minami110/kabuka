// googleapisはサーバーサイドでのみ動作する
if (process.server) {
    const { google } = require('googleapis')
}
const privatekey = require('../credentials.json') // サービスアカウントのキーファイル（JSON形式）。Nuxt.jsアプリのルートディレクトリに置いている想定

export const state = () => ({
    // (.. .省略...)
})

export const mutations = {
    // (.. .省略...)
}

export const actions = {
    // スプレッドシートの値を読み込む
    getSheetsData({ state, commit, dispatch }) {
        // authorizeで認証した上でreadDataFromSheetを実行する
        dispatch('authorize')
            .then((token) => {
                dispatch('readDataFromSheet', token)
            }).catch((error) => {
                console.log(error)
            })
    },
    // スプレッドシートにデータを新しい行として追加する
    addData({ state, commit, dispatch }) {
        // authorizeで認証した上でaddDataToSheetを実行する
        dispatch('authorize')
            .then((token) => {
                dispatch('addDataToSheet', token)
            }).catch((error) => {
                console.log(error)
            })
    },
    // スプレッドシートのデータを更新する
    updateData({ state, commit, dispatch }) {
        // authorizeで認証した上でupdateDataToSheetを実行する
        dispatch('authorize')
            .then((token) => {
                dispatch('updateDataToSheet', token)
            }).catch((error) => {
                console.log(error)
            })
    },
    // スプレッドシートのデータを削除する
    deleteData({ state, commit, dispatch }) {
        // authorizeで認証した上でdeleteDataToSheetを実行する
        dispatch('authorize')
            .then((token) => {
                dispatch('deleteDataToSheet', token)
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
    readDataFromSheet({ state }, jwtClient) {
        const spreadsheetId = '1MA-ufB6FPBc9kdq4H6ZoM0TX0mTeRFwlWNWuBxrYERk'
        const sheetName = 'apitest!A:B' // シート名と読み込み範囲
        const sheets = google.sheets('v4')

        // データの取得にgetを使用する
        sheets.spreadsheets.values.get({
            auth: jwtClient,
            spreadsheetId,
            range: sheetName
        }, (err, response) => {
            if (err) {
                console.log('API error: ' + err)
            } else {
                console.log('Name and Company list from Google Sheets:')
                for (const row of response.data.values) {
                    console.log('Name [%s]\t\tCompany [%s]', row[0], row[1])
                }
            }
        })
    },
    // データ追加用
    addDataToSheet({ state }, jwtClient) {
        const spreadsheetId = '1MA-ufB6FPBc9kdq4H6ZoM0TX0mTeRFwlWNWuBxrYERk' // 各自のスプレッドシートID
        const sheetName = 'apitest!A:B' // シート名と読み込み範囲
        const sheets = google.sheets('v4')

        // 新しく追加するデータ
        const values = [
            [
                'Your Name', 'Your Company'
            ],
            [
                'D Name', 'D Company'
            ]
        ]
        const resource = {
            values
        }
        // データの追加にappendを使用する
        // 以下では「apisheet」というシートの「A1」からデータが無い部分に新しく行が追加されて上記のvalueが書き込まれる
        sheets.spreadsheets.values.append({
            auth: jwtClient,
            spreadsheetId,
            range: 'apitest!A1',
            resource,
            valueInputOption: 'USER_ENTERED', // データをパースして数値、日付などに変換するためのオプション
            insertDataOption: 'INSERT_ROWS' // データを上書きせずに新しく行を挿入するためのオプション
        }, function (err, response) {
            if (err) {
                console.log('API error: ' + err)
            } else {
                console.log('Sheets updated:')
            }
        })
    },
    // データ更新用
    updateDataToSheet({ state }, jwtClient) {
        const spreadsheetId = 'sljltweitoSteulSLUtekwuAkuheeShuek' // 各自のスプレッドシートID
        const sheets = google.sheets('v4')

        // 更新用データ
        const values = [
            [
                'Test Name', 'Test Company'
            ],
            [
                'A Name', 'A Company'
            ]
        ]
        const resource = {
            values
        }

        // データの更新にupdateを使用する
        // 以下では「apisheet」というシートの「A20」に上記のvaluesが上書きされる
        sheets.spreadsheets.values.update({
            auth: jwtClient,
            spreadsheetId,
            range: 'apitest!A20',
            resource,
            valueInputOption: 'USER_ENTERED'
        }, (err, response) => {
            if (err) {
                console.log('API error: ' + err)
            } else {
                console.log('Sheets updated:')
            }
        })
    },
    // データ削除用
    deleteDataToSheet({ state }, jwtClient) {
        const spreadsheetId = 'sljltweitoSteulSLUtekwuAkuheeShuek' // 各自のスプレッドシートID
        const sheets = google.sheets('v4')

        // データの削除にclearを使用する
        sheets.spreadsheets.values.clear({
            auth: jwtClient,
            spreadsheetId,
            range: 'apisheet!A1' // 削除したいセル
        }, function (err, response) {
            if (err) {
                console.log('API error: ' + err)
            } else {
                console.log('Data deleted:')
            }
        })
    }

}

export const getters = {
    // (.. .省略...)
}