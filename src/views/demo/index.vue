<template>
  <div class="components-container">
    <!-- 不是<treemap> -->
    <!--demo页面无token，后端根据这一点来判断、取数据 -->
    <div style="color: white; text-align:right; height:15%; background: url(https://ftp.bmp.ovh/imgs/2021/05/67acec3a114e3da2.png)no-repeat;background-size: contain;">
      <a href="/login">Login</a>
      &nbsp;|&nbsp;
      <a href="mailto:15854859214@163.com">Contact Me</a>
    </div>
    <split-pane :min-percent="30" :default-percent="45" split="vertical" @resize="resize">
      <template slot="paneL">
        <div class="left-container">
          <line-chart ref="linechart"/>
        </div>
      </template>
      <template slot="paneR">
        <div class="right-container">
          <tree-map ref="treemap"/>
        </div>
      </template>
    </split-pane>
  </div>
</template>

<script>
// 组件引用不需要打上花括号，js中的方法引用才需要
import TreeMap from '@/components/TreeMap'
import LineChart from '@/components/LineChart'
import splitPane from 'vue-splitpane'

export default {
  components: {
    TreeMap,
    LineChart,
    splitPane
  },

  mounted() {
    this.$refs.linechart.project_name = 'alibaba/cooma'
    this.$refs.treemap.project_name = 'alibaba/cooma'
    this.$refs.treemap.version_name = '0.1.0'
    this.$refs.treemap.getTreemap('alibaba/cooma', '0.1.0')
  },

  methods: {
    resize() {
      this.$refs.linechart.resizeChart()
      this.$refs.treemap.resizeChart()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

.components-container {
  // position: relative;
  // height: 100vh;
  position: fixed;
  // height: 90vh;
  height: 100vh;
  width: 100%;
  background-color: $bg;
}

</style>
