<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="项目名称" width="180">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.project_name }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="本地版本数" width="180">
        <template slot-scope="scope">
          <!-- <span style="margin-left: 10px"><a>{{ scope.row.n_versions }}</a></span> -->
          <!-- <button @click="goParam(scope.row.project_name)">{{ scope.row.n_versions }}</button> -->
          <el-popover trigger="hover" placement="top">
            <p>点击版本数查看版本详情</p>
            <div slot="reference" class="name-wrapper">
              <el-button type="text" style="width: 40%" @click="goParam(scope.row.project_name)">{{ scope.row.n_versions }}</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="本地最新版本" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.newest_version }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button :loading="scope.row.sc_loading" size="mini" type="success" @click="handleScanCalc(scope.$index, scope.row)">扫描计算</el-button>
          <el-button :loading="scope.row.up_loading" size="mini" type="primary" @click="handleUpdate(scope.$index, scope.row)">更新</el-button>
          <el-button :loading="scope.row.de_loading" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getPagedProjects" />
  </div>
</template>

<script>
import { get_paged_projects, delete_project, update_project } from '@/api/project'
import { sc_version } from '@/api/version'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination，不是前端分页，每次都要请求getPagedProjects(后端要实现分页才可以)

export default {
  components: { Pagination },
  data: function() {
    return {
      tableData: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },

  created() {
    this.getPagedProjects()
  },

  methods: {
    // buggy
    async handleDelete(index, row) {
      // TODO:
      // 后端执行删除
      try {
        await delete_project(row.project_name)
        this.tableData.splice(index, 1)
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      } catch (e) {
        console.log(e.response.data.message)
      }
      // 前端更新数据
      this.getPagedProjects()
    },

    async handleScanCalc(index, row) {
      var flag = false
      this.$set(row, 'sc_loading', true)
      for (var i = 0; i < row.n_versions; i++) {
        try {
          await sc_version(row.project_name, row.versions_list[i])
          this.$notify({
            title: 'Success',
            message: '第' + (i + 1) + '个版本: ' + row.versions_list[i] + '完成扫描计算',
            type: 'success',
            duration: 2000
          })
        } catch (e) {
          flag = true
          console.log('wrong, but do not worry:)')
          console.log(e.response.data.message)
        }
      }
      this.$set(row, 'sc_loading', false)
      if (!flag) {
        this.$message({
          showClose: true,
          title: 'Success',
          message: row.project_name + '完成扫描计算',
          type: 'success',
          duration: 0
        })
      }
    },

    async handleUpdate(index, row) {
      // TODO:
      // 后端执行更新
      try {
        await update_project(row.project_name)
        // 前端更新数据（必须在后端执行完操作之后）
        this.getPagedProjects()
      } catch (e) {
        // 也可能不需要更新，改成已成为最新版本
        this.$notify.info({
          message: '已为最新版本',
          duration: 2000
        })
        console.log('wrong, but do not worry:)')
        console.log(e.response.data.message)
      }
    },

    getPagedProjects() {
      get_paged_projects(this.listQuery).then(response => {
        var projects_list = response.data.projects_list
        // 拿到names
        // var projects = projects_list.map(function(d) { return { project_name: d['project_name'], newest_version: d['newest_version'], n_versions: d['versions_list'].length, versions_list: d['versions_list'] } })
        var data = projects_list.map(item => {
          this.$set(item, 'sc_loading', false)
          this.$set(item, 'up_loading', false)
          this.$set(item, 'de_loading', false)
          item['n_versions'] = item['versions_list'].length
          return item
        })
        this.tableData = data
        this.total = response.data.total
      })
    },

    goParam(project_name) {
      // 注意是大写的Version（子路由）
      this.$router.push({ name: 'Version', params: { project_name: project_name }})
    }
  }
}
</script>
