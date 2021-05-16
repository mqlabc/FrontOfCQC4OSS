import request from '@/utils/request'

// post的参数请求用data；get带参数的请求用params（使用$()自动拼成?age=18的形式）
export function get_versions(project_name) {
  return request({
    url: '/api/versions/' + project_name,
    method: 'get'
  })
}

export function get_demo_versions(project_name) {
  return request({
    url: '/api/demo_versions/' + project_name,
    method: 'get'
  })
}

export function sc_version(project_name, version_name) {
  return request({
    url: '/api/version',
    method: 'put',
    data: {
      project_name: project_name,
      version_name: version_name
    }
  })
}
