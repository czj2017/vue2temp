import { axios } from '@/utils/request' //导入有拦截器的axios

//post
export function postAction(url, params) {
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

//post method= {post | put}
export function httpAction(url, params, method) {
  return axios({
    url: url,
    method: method,
    data: params
  })
}

//put
export function putAction(url, params) {
  return axios({
    url: url,
    method: 'put',
    data: params
  })
}

//get
export function getAction(url, params) {
  return axios({
    url: url,
    method: 'get',
    params: params
  })
}

//deleteAction
export function deleteAction(url, params) {
  return axios({
    url: url,
    method: 'delete',
    params: params
  })
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param params
 * @return {*}
 */
export function downFile(url, params) {
  return axios({
    url: url,
    params: params,
    method: 'get',
    responseType: 'blob'
  })
}

