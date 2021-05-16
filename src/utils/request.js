import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 250000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.code !== 1000) {
      // 登录失效时出现此对话框
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      // 1001:非法的token; 1002:其他客户端登录了;  1003:Token 过期了;
      if (res.code === 1001 || res.code === 1002 || res.code === 1003) {
        MessageBox.confirm(
          '你已被登出，已重定向至demo页面，或重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '留在demo页面',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            // location.reload() // 为了重新实例化vue-router对象 避免bug
            location.replace('/login')
          })
        })
      }
      // 前端捕捉这个错误可以在出错时给出提示，不至于出现promise错误
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    // 返回了401等错误状态码时发出message（如登录出错时）
    Message({
      // error信息在error.response中
      message: error.response.data.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 其他地方导入时使用的是import request from '@/utils/request'
export default service
