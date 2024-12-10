<script setup lang="ts">
import axios from 'axios'
import { NButton, NDataTable, useMessage } from 'naive-ui'
import { h, onMounted, onUnmounted, ref, watch } from 'vue'

interface Dependency {
  id: string
  related: boolean
}

interface Requirement {
  id: string
  dependencies: Dependency[]
}

const message = useMessage()

// const requirementsA = ref([])
// const requirementsB = ref([])
// const matrixData = ref([])
const matrixData = ref<boolean[][]>([])
const requirementsA = ref<Requirement[]>([])
const requirementsB = ref<Requirement[]>([])
const tableHeight = ref(500)

async function fetchRequirementsData() {
  const res = await axios.post('/api/requirements')

  requirementsA.value = res.data.data.requirementsA
  requirementsB.value = res.data.data.requirementsB
}

function generateMatrixData() {
  matrixData.value = requirementsA.value.map(row =>
    requirementsB.value.map(col =>
      row.dependencies.some((dep: Dependency) => dep.id === col.id && dep.related),
    ),
  )
}

function toggleDependency(rowIndex: number, colIndex: number) {
  const row = requirementsA.value[rowIndex]
  const colId = requirementsB.value[colIndex].id
  const dependency = row.dependencies.find((dep: Dependency) => dep.id === colId)
  if (dependency)
    dependency.related = !dependency.related
  else
    row.dependencies.push({ id: colId, related: true })

  matrixData.value[rowIndex][colIndex] = !matrixData.value[rowIndex][colIndex]
}

async function saveDependencies() {
  // 保存 dependencies
  try {
    // TODO: 这里添加实际的保存逻辑
    await axios.post('/api/save-dependencies', {
      requirements: requirementsA.value,
    })
    message.success('保存成功')
  }
  catch (error: any) {
    message.error(`保存失败：${error.message}`)
  }
}

function updateTableHeight() {
  tableHeight.value = window.innerHeight - 200
}

onMounted(() => {
  fetchRequirementsData()
  updateTableHeight()
  window.addEventListener('resize', updateTableHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateTableHeight)
})

watch([requirementsA, requirementsB], generateMatrixData)

// 定义表格列
const columns = computed(() => {
  const baseColumns = [
    {
      title: 'ID / 名称',
      key: 'name',
      fixed: 'left',
      width: 20,
      render(row: any) {
        return h('div', [
          h('div', row.displayId),
          h('div', row.name),
        ])
      },
    },
  ]

  const dynamicColumns = requirementsB.value.map((col: any, colIndex) => ({
    title: `${col.displayId} / ${col.name}`,
    key: col.id,
    width: 25,
    render(row: any, rowIndex: any) {
      return h('div', {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        },
      }, [
        h(NButton, {
          type: matrixData.value[rowIndex][colIndex] ? 'primary' : 'default',
          size: 'medium',
          style: 'width: 90px',
          onClick: () => toggleDependency(rowIndex, colIndex),
        }, {
          default: () => matrixData.value[rowIndex][colIndex] ? '✔️' : '❌',
        }),
      ])
    },
  }))

  return [...baseColumns, ...dynamicColumns]
})
</script>

<template>
  <div class="table-container">
    <div class="button-container">
      <NButton
        type="primary"
        style="width: 150px; margin-top: 10px"
        @click="saveDependencies"
      >
        保存
      </NButton>
    </div>
    <NDataTable
      :columns="columns"
      :data="requirementsA"
      :scroll-x="1000"
      :max-height="tableHeight"
      bordered
      :single-line="false"
    />
  </div>
</template>

<style scoped>
.table-container {
  overflow: auto;
  max-width: 100%;
}

.n-data-table {
  min-width: 800px;
  justify-content: center;  /* 修改为 center 使按钮居中 */
}

.button-container {
  display: flex;
  justify-content: flex-front;
}
</style>
