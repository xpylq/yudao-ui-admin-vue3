<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="关联id" prop="refId">
        <el-input v-model="formData.refId" placeholder="请输入关联id" />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.MD_MOVIE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="地区" prop="area">
        <el-select v-model="formData.area" placeholder="请选择地区">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.MD_MOVIE_AREA)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="formData.author" placeholder="请输入作者" />
      </el-form-item>
      <el-form-item label="时长" prop="duration">
        <el-input v-model="formData.duration" placeholder="请输入时长" />
      </el-form-item>
      <el-form-item label="观看次数" prop="viewTimes">
        <el-input v-model="formData.viewTimes" placeholder="请输入观看次数" />
      </el-form-item>
      <el-form-item label="图片url" prop="imageUrl">
        <UploadImg v-model="formData.imageUrl" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { MovieApi, MovieVO } from '@/api/md/movie'

/** 影片 表单 */
defineOptions({ name: 'MovieForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  refId: undefined,
  title: undefined,
  type: undefined,
  area: undefined,
  author: undefined,
  duration: undefined,
  viewTimes: undefined,
  imageUrl: undefined
})
const formRules = reactive({
  refId: [{ required: true, message: '关联id不能为空', trigger: 'blur' }],
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
  area: [{ required: true, message: '地区不能为空', trigger: 'change' }],
  author: [{ required: true, message: '作者不能为空', trigger: 'blur' }],
  duration: [{ required: true, message: '时长不能为空', trigger: 'blur' }],
  viewTimes: [{ required: true, message: '观看次数不能为空', trigger: 'blur' }],
  imageUrl: [{ required: true, message: '图片url不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await MovieApi.getMovie(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as MovieVO
    if (formType.value === 'create') {
      await MovieApi.createMovie(data)
      message.success(t('common.createSuccess'))
    } else {
      await MovieApi.updateMovie(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    refId: undefined,
    title: undefined,
    type: undefined,
    area: undefined,
    author: undefined,
    duration: undefined,
    viewTimes: undefined,
    imageUrl: undefined
  }
  formRef.value?.resetFields()
}
</script>