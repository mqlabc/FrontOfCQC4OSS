<template>
  <div>
    <div>
      <el-dropdown @command="handleCommand">
        <span :style="{color:(this.$route.path === '/demo' ? 'whitesmoke' : 'black')}" class="el-dropdown-link">
          选择项目<i class="el-icon-arrow-down el-icon--right"/>
        </span>
        <!-- 将选定的栏目绑定到另一个组件，是不是要@click？或者用指令事件？ -->
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="project in projects"
            :key="project.id"
            :title="project.name"
            :command="project.name">{{ project.name }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div id="linechart" class="echarts" style="height:560%;width:100%;margin: auto;"/>
  </div>
</template>

<script>
import { get_projects, get_demo_projects } from '@/api/project'
import { get_linechart } from '@/api/linechart'
import theme from '@/assets/my_dark'

export default {
  name: 'LineChart',
  data: function() {
    return {
      projects: [],
      project_name: '',
      myChart: null
    }
  },

  watch: {
    project_name: function(new_selected, old_selected) {
      // console.log(old_selected)
      // console.log(new_selected)
      this.project_name = new_selected
      this.getLinechart()
    }
  },

  mounted() {
    if (this.$route.path === '/demo') {
      this.getDemoProjects()
    } else {
      this.getProjects()
    }
  },

  methods: {
    handleCommand(command) {
      this.project_name = command
      console.log('1: click on item ' + command)
    },

    getLinechart() {
      get_linechart(this.project_name).then(response => {
        // var linechart_option = JSON.parse(response.data.linechart_html)
        var linechart_option = response.data.linechart_opts
        const echarts = require('echarts')
        echarts.registerTheme('theme', theme)
        if (this.myChart != null && this.myChart !== '' && this.myChart !== undefined) {
          this.myChart.dispose()
        }
        if (this.$route.path === '/demo') {
          this.myChart = echarts.init(document.getElementById('linechart'), 'theme', { renderer: 'canvas' })
        } else {
          this.myChart = echarts.init(document.getElementById('linechart'), 'white', { renderer: 'canvas' })
        }

        this.myChart.setOption(linechart_option)
        window.addEventListener('resize', () => {
          this.myChart.resize()
        })
      })
    },

    getProjects() {
      get_projects().then(response => {
        var projects_list = response.data.projects_list
        // 拿到names
        var projects = projects_list.map(function(d) { return { name: d['project_name'], id: projects_list.indexOf(d) } })
        this.projects = projects
      })
    },

    getDemoProjects() {
      get_demo_projects().then(response => {
        var projects_list = response.data.projects_list
        // 拿到names
        var projects = projects_list.map(function(d) { return { name: d['project_name'], id: projects_list.indexOf(d) } })
        this.projects = projects
      })
    },

    // 适应splitpane带来的大小改变
    resizeChart() {
      if (this.myChart) {
        this.myChart.resize()
      }
    }
  }
}
</script>

