import request from '@/utils/request'

export function get_projects() {
  return request({
    url: '/api/projects',
    method: 'get'
  })
}

export function get_paged_projects(query) {
  return request({
    url: '/api/paged_projects',
    method: 'get',
    params: query
  })
}

export function get_demo_projects() {
  return request({
    url: '/api/demo_projects',
    method: 'get'
  })
}

export function new_project(project_name, project_url) {
  return request({
    url: '/api/projects',
    method: 'post',
    data: {
      project_name: project_name,
      project_url: project_url
    }
  })
}

export function update_project(project_name) {
  return request({
    url: '/api/projects' + '/' + project_name,
    method: 'put'
  })
}

export function delete_project(project_name) {
  return request({
    url: '/api/projects' + '/' + project_name,
    method: 'delete'
  })
}
