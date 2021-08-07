import router from '../router'
import store from '@/store'
/**
 * 单点登录
 */
const init = (url, callback) => {
  let token = localStorage.getItem('token')
  let st = getUrlParam("ticket")
  // store.dispatch('Getticket',st)
  if (url) {
    var sevice = url
  }
  else {
    var sevice = window.location.protocol + "//" + window.location.host + "/" + process.env.VUE_APP_BASE_PATH + "/";
    // var sevice = window.location.href
  }
  if (token) {
    loginSuccess(callback);
  } else {
    if (st) {
      validateSt(st, sevice, callback);
    } else {
      var serviceUrl = encodeURIComponent(sevice);
      window.location.href = process.env.VUE_APP_CASE_URL + "/login?service=" + serviceUrl;
    }
  }
};
const SSO = {
  init: init

};

function getUrlParam(paraName) {
  var url = document.location.toString();
  var arrObj = url.split("?");
  if (arrObj.length > 1) {
    var arrPara = arrObj[1].split("&");
    var arr;
    for (var i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split("=");
      if (arr != null && arr[0] == paraName) {
        return arr[1];
      }
    }
    return "";
  } else {
    return "";
  }
}

function validateSt(ticket, service, callback) {
  let params = {
    ticket: ticket,
    service: service
  };
  store.dispatch('ValidateLogin', params).then(res => {
    if (res.success) {
      router.push({
        path: "/"
      });
      // window.location.href = service
      // store.dispatch("Getcount")
    } else {
      // alert(res.message)
      var sevice = process.env.VUE_APP_SERVICE_MODE + window.location.host + "/" + process.env.VUE_APP_BASE_PATH + "/";
      var serviceUrl = encodeURIComponent(sevice);
      window.location.href = process.env.VUE_APP_CASE_URL + "/logout?service=" + serviceUrl;
    }
  }).catch((err) => {
    console.log(err);
  });
}

function loginSuccess(callback) {
  callback();
}
export default SSO;