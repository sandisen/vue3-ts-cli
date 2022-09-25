<template>
  <div>
    <h1>这是vue3项目通用的模板</h1>
    <h3>技术栈：vue3+vuex+ts+scss+webpack+element-plus</h3>
    <br>
    <br>

    <el-row class="mb-4">
      <el-button>Default</el-button>
      <el-button type="primary">Primary</el-button>
      <el-button type="success">Success</el-button>
      <el-button type="info">Info</el-button>
      <el-button type="warning">Warning</el-button>
      <el-button type="danger">Danger</el-button>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'

onMounted(() => {
  console.log('组件挂载完成')
})
</script>
<style scoped lang="scss">
</style>