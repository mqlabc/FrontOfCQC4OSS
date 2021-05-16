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
    <div>
      <el-dropdown @command="handleCommand1">
        <span :style="{color:(this.$route.path === '/demo' ? 'whitesmoke' : 'black')}" class="el-dropdown-link">
          选择版本<i class="el-icon-arrow-down el-icon--right"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="version in versions"
            :key="version.id"
            :title="version.name"
            :command="version.name">{{ version.name }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div id="treemap" class="echarts" style="height:530%;margin: auto;"/>
  </div>
</template>

<script>
import { get_projects, get_demo_projects } from '@/api/project'
import { get_versions, get_demo_versions } from '@/api/version'
import { get_treemap } from '@/api/treemap'
import theme from '@/assets/my_dark'

export default {
  name: 'TreeMap',
  data: function() {
    return {
      projects: [],
      project_name: '',
      versions: [],
      verison_name: '',
      myChart: null
    }
  },

  watch: {
    project_name: function(new_selected, old_selected) {
      // console.log(old_selected)
      // console.log(new_selected)
      this.project_name = new_selected
      if (this.$route.path === '/demo') {
        this.getDemoVersions()
      } else {
        this.getDemoVersions()
      }
    },
    verison_name: function(new_selected, old_selected) {
      this.verison_name = new_selected
      // 必须要后选择version，否则出错
      this.getTreemap(this.project_name, this.verison_name)
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

    handleCommand1(command) {
      this.verison_name = command
      console.log('2: click on item ' + command)
    },

    getTreemap(project_name, verison_name) {
      get_treemap(project_name, verison_name).then(response => {
        // var treemap_option = JSON.parse(response.data.treemap_html)
        var treemap_option = response.data.treemap_opts
        // console.log(treemap_option)
        const echarts = require('echarts')
        echarts.registerTheme('theme', theme)
        if (this.myChart != null && this.myChart !== '' && this.myChart !== undefined) {
          this.myChart.dispose()
        }
        if (this.$route.path === '/demo') {
          this.myChart = echarts.init(document.getElementById('treemap'), 'theme', { renderer: 'canvas' })
        } else {
          this.myChart = echarts.init(document.getElementById('treemap'), 'white', { renderer: 'canvas' })
        }
        this.myChart.setOption(treemap_option)
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

    getVersions() {
      get_versions(this.project_name).then(response => {
        var versions_list = response.data.versions_list
        // 拿到names
        var versions = versions_list.map(function(d) { return { name: d['version_name'], id: versions_list.indexOf(d) } })
        this.versions = versions
      })
    },

    getDemoVersions() {
      get_demo_versions(this.project_name).then(response => {
        var versions_list = response.data.versions_list
        // 拿到names
        var versions = versions_list.map(function(d) { return { name: d['version_name'], id: versions_list.indexOf(d) } })
        this.versions = versions
      })
    },

    resizeChart() {
      if (this.myChart) {
        this.myChart.resize()
      }
    }
  }
}
</script>

