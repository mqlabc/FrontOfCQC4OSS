<template>
  <div class="app-container">
    <!-- TODO:
    表单字段检查：必填项；字符串格式 -->

    <el-form ref="form" :model="form" label-width="120px" >
      <el-form-item label="项目平台">
        <el-select v-model="form.platform" placeholder="目前仅支持GitHub">
          <el-option label="GitHub" value="GitHub"/>
        </el-select>
      </el-form-item>
      <el-form-item label="项目名称">
        <el-input v-model="form.project_name" placeholder="如：mqlabc/learngit"/>
      </el-form-item>
      <!-- <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker v-model="form.date1" type="date" placeholder="Pick a date" style="width: 100%;"/>
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="Pick a time" style="width: 100%;"/>
        </el-col>
      </el-form-item> -->
      <!-- <el-form-item label="Instant delivery">
        <el-switch v-model="form.delivery"/>
      </el-form-item>
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type"/>
          <el-checkbox label="Promotion activities" name="type"/>
          <el-checkbox label="Offline activities" name="type"/>
          <el-checkbox label="Simple brand exposure" name="type"/>
        </el-checkbox-group>
      </el-form-item> -->
      <!-- <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor"/>
          <el-radio label="Venue"/>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="项目描述">
        <el-input v-model="form.desc" type="textarea"/>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="onCancel">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { new_project } from '@/api/project'

export default {
  data() {
    return {
      form: {
        platform: '',
        project_name: '',
        desc: ''
      },
      loading: false
    }
  },
  methods: {
    // async onSubmit() {
    //   // TODO:
    //   // 解决返回问题
    //   this.loading = true
    //   var platform_url = 'https://github.com/'
    //   if (this.form.platform === 'GitHub') {
    //     platform_url = 'https://github.com/'
    //   }
    //   var project_url = platform_url + this.form.project_name

    //   await new_project(this.form.project_name, project_url)
    //   this.$message('done')
    //   this.loading = false
    // },

    async onSubmit() {
      this.loading = true
      var platform_url = 'https://github.com/'
      if (this.form.platform === 'GitHub') {
        platform_url = 'https://github.com/'
      }
      var project_url = platform_url + this.form.project_name

      // new_project(this.form.project_name, project_url).then(response => {
      //   this.$message('done')
      //   this.loading = false
      // })
      // new_project(this.form.project_name, project_url)
      try {
        await new_project(this.form.project_name, project_url)
        this.$message({ showClose: true, message: this.form.project_name + '添加成功', type: 'success', duration: 0 })
        this.clear()
      } catch (e) {
        console.log('wrong, but do not worry:)')
        console.log(e.response.data.message)
      }
      this.loading = false
    },

    clear() {
      this.form.platform = ''
      this.form.project_name = ''
      this.form.desc = ''
    },

    onCancel() {
      this.$message({
        message: '已清空已填项',
        type: 'warning'
      })
      this.clear()
    },

    async newProject() {
      var platform_url = 'https://github.com/'
      if (this.form.platform === 'GitHub') {
        platform_url = 'https://github.com/'
      }
      var project_url = platform_url + this.form.project_name

      await new_project(this.form.project_name, project_url)
      this.$message('done')
      this.loading = false
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

