"use strict";
import Vue from 'vue';
import store from '../store'
import axios from "axios";
// import { Modal, notification } from 'ant-design-vue'

let config = {
  baseURL: process.env.VUE_APP_URL,//接口基础路径
  timeout: 20000
};

const service = axios.create(config)

const err = (error) => {
  if (error.response) {
    let data = error.response.data
    const token = localStorage.getItem('token')
    switch (error.response.status) {
      case 403:
        notification.error({ message: '系统提示', description: '拒绝访问', duration: 4 })
        break
      case 500:
        console.log(data.message, token)
        if (token && data.message == "Token失效，请重新登录") {
          console.log(store.getters.isNeedPromptLogin)
          var isNeedPromptLogin = store.getters.isNeedPromptLogin;//token失效 是否需要提示并引导登陆，避免同页面多接口失效重复提醒；
          console.log('isNeedPromptLogin', isNeedPromptLogin);
          if (!isNeedPromptLogin) return;
          notification.error({ message: '系统提示', description: 'Token失效，请重新登录!', duration: 4 })
          store.dispatch('SetisNeedPromptLogin', false);
          store.dispatch('Logout').then(() => {
            localStorage.removeItem('Token')
            var sevice = process.env.VUE_APP_SERVICE_MODE + window.location.host + "/" + process.env.VUE_APP_BASE_PATH + "/";
            var serviceUrl = encodeURIComponent(sevice);
            window.location.href = process.env.VUE_APP_CASE_URL + "/logout?service=" + serviceUrl;
          })
        }
        break
      case 404:
        notification.error({ message: '系统提示', description: '很抱歉，资源未找到!', duration: 4 })
        break
      case 504:
        notification.error({ message: '系统提示', description: '网络超时' })
        break
      case 401:
        notification.error({ message: '系统提示', description: '未授权，请重新登录', duration: 4 })
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
        break
      default:
        notification.error({
          message: '系统提示',
          description: data.message,
          duration: 4
        })
        break
    }
  }
  return Promise.reject(error)
};

// request interceptor
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['X-Access-Token'] = token
  }
  if (config.method == 'get') {
    config.params = {
      _t: Date.parse(new Date()) / 1000,
      ...config.params
    }
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// response interceptor
service.interceptors.response.use((response) => {
  return response.data
}, err)

const installer = {
  vm: {},
  install(Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}

export {
  service as axios
}
