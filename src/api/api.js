import { getAction, deleteAction, putAction, postAction } from '@/api/http'

//接口模块
getTestList = (params) => getAction('/sysdepart/sysDepart/queryTreeList', params)

export {
    getTestList
}