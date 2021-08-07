import Vue from 'vue'
import Vuex from 'vuex'
import { axios } from '@/utils/request' //导入有拦截器的axios
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'), //token令牌
    isNeedPromptLogin: true, //token失效，是否需要提示登录 true需要提示
    //refresh: '', //主题设置界面(setting.vue)点击保存，用于触发home.vue页面刷新
  },
  getters: {
    getToken: (state) => {
      return state.token
    },
   
    isNeedPromptLogin: (state) => {
      return state.isNeedPromptLogin
    },
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_PROMPTLOGIN(state, isNeedPromptLogin) {
      state.isNeedPromptLogin = isNeedPromptLogin
    },
    /* SET_REFRESH(state, flag) {
      state.refresh = flag
    }, */
  },
  actions: {
    SET_TOKEN({ commit, state }, query) {
      commit('SET_TOKEN', query)
    },

    SetisNeedPromptLogin({ commit }, param) {
      return new Promise((resolve) => {
        commit('SET_PROMPTLOGIN', param)
        // axios.get('/sys/updateLogOut').then(res => { })
      })
    },

    //登陆
    ValidateLogin({ commit }, params) {
      return new Promise((resolve, reject) => {
        axios
          .get('/cas/client/validateLogin', { params: params })
          .then((response) => {
            if (response.success) {
              const result = response.result
              const userInfo = result.userInfo //设置个人信息
              commit('SET_TOKEN', result.token) //设置token
              commit('SET_PROMPTLOGIN', true) //登录成功，设置需要在token失效时候提示登录
              if (!window.localStorage) {
                // alert("浏览器不支持localstorage");
              } else {
                //主逻辑业务
                localStorage.setItem(
                  'userInfo',
                  JSON.stringify(result.userInfo),
                  7 * 24 * 60 * 60 * 1000
                )
                localStorage.setItem(
                  'token',
                  result.token,
                  7 * 24 * 60 * 60 * 1000
                )
              }
              resolve(response)
            } else {
              function reload() {
                var sevice =
                  process.env.VUE_APP_SERVICE_MODE +
                  window.location.host +
                  '/' +
                  process.env.VUE_APP_BASE_PATH +
                  '/'
                var serviceUrl = encodeURIComponent(sevice)
                window.location.href =
                  process.env.VUE_APP_CASE_URL + '/logout?service=' + serviceUrl
              }
              Modal.confirm({
                title: '提示',
                content: response.message,
                okText: '确认',
                cancelText: '取消',
                onOk() {
                  reload()
                },
                onCancel() {
                  reload()
                },
                zIndex: 10000000000,
              })
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    //退出登陆
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        let logoutToken = state.token

        commit('SET_TOKEN', '') //vuex token置空
        localStorage.removeItem('token') //本地token置空

        axios({
          url: '/sys/logout',
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': logoutToken,
          },
        })
          .then((res) => {
            resolve(res)
          })
          .catch(() => {
            resolve()
          })
      })
    },
  },
  modules: {},
})
