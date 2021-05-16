import get_treemap from '@/api/treemap'

const treemap = {
  state: {
    html: ''
  },
  mutations: {
    SET_HTML: (state, html) => {
      state.html = html
    }
  },
  actions: {
    GetTreemap({ commit }, projectInfo) {
			const project_name = projectInfo.project_name.trim()
			return new Promise((resolve, reject) => {
				get_treemap(project_name).then(response => {
					const data = response
					commit('SET_HTML', data.html)
					return data.html
				}).catch(error => {
					reject(error)
				})
			})
    }
  }
}

export default treemap
