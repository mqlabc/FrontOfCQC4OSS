import request from '@/utils/request'

export function get_linechart(project_name) {
  return request({
    url: '/api/linechart',
    method: 'post',
    data: {
      project_name
    }
  })
}
