<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-menu v-if="user">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" text>Hi, {{ user.name | firstName }}<v-icon right>mdi-account-circle</v-icon></v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title><v-icon left>mdi-logout</v-icon>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn v-else @click="login" text>Log In<v-icon right>mdi-account-circle</v-icon></v-btn>
    </v-app-bar>
    <v-main>
      <v-container class="justify-center" fluid style="height:100%">
        <Nuxt v-if="loadingUser || (user && user.isAuthorized)" />
        <v-row v-else class="justify-center align-center" style="height: 100%">
          <v-col cols="12" md="8">
            <v-card>
              <v-card-title>Welcome to KarlGPT</v-card-title>
              <v-card-text>
                <span v-if="user && !user.isAuthorized">You're signed up! Please wait for admin approval to use Karl.</span>
                <div v-else>
                  <p>KarlGPT is a chatbot that uses the GPT-3 API to respond to your messages. Please sign up to use this service.</p>
                  <v-btn @click="login" color="primary" block>Login with Google</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'DefaultLayout',
  data () {
    return {
      loadingUser: true,
      user: null,
      drawer: false,
      items: [
        {
          icon: 'mdi-chat',
          title: 'Chat',
          to: '/'
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'KarlGPT'
    }
  },
  methods: {
    login() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      signInWithPopup(auth, provider)
        .catch(error => {
          this.user = null;
          console.error(error);
        });
    },
    logout() {
      const auth = getAuth();
      auth.signOut()
        .catch((error) => {
          console.error("this is Will's erorr", error);
        });
    }
  },
  mounted() {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        const logIn = this.$getFirebaseFunction("login");
        logIn({ uid: user.uid, name: user.displayName })
          .then(({data}) => {
            console.log(data);
            this.user = data;
          })
          .catch(e => {
            this.user = { isAuthorized: false, name: user.displayName };
          })
          .finally(() => {
            this.loadingUser = false;
          });
      } else {
        this.user = null;
        this.loadingUser = false;
      }
    });
  },
  filters: {
    firstName(name) {
      return name.split(/\s/g)[0];
    }
  }
}
</script>
