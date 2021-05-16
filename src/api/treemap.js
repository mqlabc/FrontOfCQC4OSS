import request from '@/utils/request'

export function get_treemap(project_name, version_name) {
  return request({
    url: '/api/treemap',
    method: 'post',
    data: {
      project_name,
      version_name
    }
  })
}
