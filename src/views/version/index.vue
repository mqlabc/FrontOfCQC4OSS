<template>
  <div>
    <div style="float: right">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
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
    <el-table :data="tableData" :default-sort = "{prop: 'time', order: 'descending'}" style="width: 100%">
      <!-- <el-table :data="tableData" style="width: 100%"> -->
      <el-table-column :sort-method="sortByTime" prop="time" label="版本日期" sortable width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.version_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="项目名称" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.project_name }}</span>
        </template>
      </el-table-column>

      <el-table-column :sort-method="sortByVerionName" label="版本名称" sortable width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.version_name }}</span>
        </template>
      </el-table-column>

      <el-table-column :sort-method="sortByCommitter" label="Committer名称" sortable min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.version_committer }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否已扫描计算" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.scanned && scope.row.calculated }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button :loading="scope.row.loading" :disabled="scope.row.scanned && scope.row.calculated" size="mini" type="success" @click="handleScanCalc(scope.$index, scope.row)">扫描计算</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getProjects" /> -->
  </div>
</template>

<script>
import { get_projects } from '@/api/project'
import { get_versions, sc_version } from '@/api/version'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination，不是前端分页，每次都要请求getProjects(后端要实现分页才可以)

export default {
  components: { Pagination },
  data: function() {
    return {
      project_name: '',
      projects: [],
      tableData: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },

  watch: {
    project_name: function(new_selected, old_selected) {
      this.project_name = new_selected
      this.tableData = this.getVersions()
    }
  },

  created() {
    // 刷新之后params就没有了，取值为undefined
    this.project_name = this.$route.params.project_name
    this.getVersions()
    this.getProjects()
  },

  methods: {
    handleCommand(command) {
      this.project_name = command
    },

    getProjects() {
      get_projects().then(response => {
        var projects_list = response.data.projects_list
        // 拿到names
        var projects = projects_list.map(function(d) { return { name: d['project_name'], id: projects_list.indexOf(d) } })
        this.projects = projects
      })
    },

    getVersions() {
      get_versions(this.project_name).then(response => {
        // var projects_list = response.data.projects_list
        // // 拿到names
        // var projects = projects_list.map(function(d) { return { project_name: d['project_name'], newest_version: d['newest_version'], n_versions: d['versions_list'].length } })
        // this.tableData = projects
        // this.total = response.data.total
        var versions_list = response.data.versions_list
        this.tableData = versions_list.map(item => {
          // 添加按钮loading
          this.$set(item, 'loading', false)
          return item
        })
      })
    },

    sortByTime(version1, version2) {
      const t1 = new Date(version1.version_time.replace('-', '/'))
      const t2 = new Date(version2.version_time.replace('-', '/'))
      return t1 - t2
    },

    sortByVerionName(version1, version2) {
      return version1.version_time - version2.version_time
    },

    sortByCommitter(version1, version2) {
      return version1.version_committer - version2.version_committer
    },

    async handleScanCalc(index, row) {
      this.$set(row, 'loading', true)
      try {
        await sc_version(row.project_name, row.version_name)
        this.$notify({
          title: 'Success',
          message: row.version_name + '完成扫描计算',
          type: 'success',
          duration: 2000
        })
      } catch (e) {
        console.log('wrong, but do not worry:)')
        console.log(e.response.data.message)
      }
      this.$set(row, 'loading', false)
      this.getVersions()
    }
  }
}
</script>
