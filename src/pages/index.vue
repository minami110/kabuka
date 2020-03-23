<template>
  <b-container class="mt-3">
    <h1>kabuka</h1>
    <b-row>
      <b-col cols="12" v-if="bFetchingData" class="text-center mb-3">
        <b-spinner label="Spinning"></b-spinner>
      </b-col>

      <b-col v-else>
        <div v-if="loginuser.id">
          <b-card>
            <b-card-title>こんにちは {{ loginuser.name }}さん</b-card-title>

            <h4>
              カブ価の投稿
              <b-badge variant="danger">工事中</b-badge>
            </h4>
            <div>
              <b-form inline>
                <b-input type="date" />
                <b-form-select
                  value="AM"
                  :options="[{ value: AM, text: 'AM' },{ value: PM, text: 'PM' }]"
                />
                <b-input type="number" value="100" />
              </b-form>
            </div>

            <template v-slot:footer>
              <b-form @submit="logout">
                <b-button type="submit" size="sm" variant="danger">ログアウト</b-button>
              </b-form>
            </template>
          </b-card>
        </div>

        <div v-else>
          <b-card title="ログイン">
            <b-form @submit="onSubmit">
              <b-form-group>
                <b-form-input
                  v-model="loginuser.name"
                  size="sm"
                  required
                  placeholder="キャラクターの名前を入力"
                />
              </b-form-group>
              <b-button size="sm" type="submit" variant="primary">ログイン</b-button>
            </b-form>
          </b-card>
        </div>
      </b-col>

      <b-col cols="12" class="mt-3">
        <b-card title="Kabu Chart: 1999/01/01~">
          <div>
            <b-badge variant="danger">工事中</b-badge>
          </div>
          <div class="mt-2">
            <b-img-lazy src="https://blog-imgs-45.fc2.com/n/i/g/nigoyama/HNI_0017_JPG.jpg" />
          </div>
        </b-card>
      </b-col>
      <b-col cols="12" class="mt-3">
        <b-card title="links">
          <ul>
            <li>
              <b-link
                href="https://docs.google.com/spreadsheets/d/1kbpmZ2AJJNxfDqhoY6dIipY9OCe_CFYVu3zJv3oXu5A/edit#gid=1674275917"
              >spleadsheet</b-link>
            </li>
            <li>
              <b-link href="https://github.com/minami110/kabuka">github</b-link>
            </li>
          </ul>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  components: {},
  data() {
    return {
      bFetchingData: true,
      loginuser: {
        id: "",
        name: ""
      }
    };
  },
  computed: {
    ...mapGetters({
      users: "sheet/users"
    })
  },
  async mounted() {
    // get user query
    this.loginuser.id = this.$route.query.user;

    // fetch users data from spleadsheet
    try {
      await this.$store.dispatch("sheet/getUsers");
    } catch (e) {
      console.log(e); // Error: UNAUTHORIZED
      this.bFetchingData = false;
    }
    this.bFetchingData = false;

    // update loginuser infomation
    if (this.loginuser.id) {
      this.loginuser.name = this.users[this.loginuser.id].name;
    }
  },
  methods: {
    async onSubmit(evt) {
      evt.preventDefault();

      // get user-id
      for (const user_id in this.users) {
        const user = this.users[user_id];
        if (this.loginuser.name == user.name) {
          this.loginuser.id = user_id;

          // userクエリを追加
          let query = { ...this.$route.query };
          query["user"] = user_id;
          // URL移動
          // pushではなくreplaceを使用して, ヒストリを残さない
          this.$router.replace(
            { query: query },
            () => {},
            () => {}
          );

          break;
        }

        if (this.loginuser.id) {
          // ログインに成功
        } else {
          // ログインに失敗
        }
      }
    }
  },
  logout(e) {
    e.preventDefault();

    // loginuserをクリアする
    this.loginuser.id = "";
    this.loginuser.name = "";

    // remove user query
    let query = { ...this.$route.query };
    delete query["user"];
    // pushではなくreplaceを使用して, historyを残さない
    this.$router.replace({ query: query });
  }
};
</script>

