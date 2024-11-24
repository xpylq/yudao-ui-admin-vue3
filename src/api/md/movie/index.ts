import request from '@/config/axios'

// 影片 VO
export interface MovieVO {
  id: number // 影片主键
  refId: number // 关联id
  title: string // 标题
  type: string // 类型
  area: string // 地区
  author: string // 作者
  duration: number // 时长
  viewTimes: number // 观看次数
  imageUrl: string // 图片url
}

// 影片 API
export const MovieApi = {
  // 查询影片分页
  getMoviePage: async (params: any) => {
    return await request.get({ url: `/md/movie/page`, params })
  },

  // 查询影片详情
  getMovie: async (id: number) => {
    return await request.get({ url: `/md/movie/get?id=` + id })
  },

  // 新增影片
  createMovie: async (data: MovieVO) => {
    return await request.post({ url: `/md/movie/create`, data })
  },

  // 修改影片
  updateMovie: async (data: MovieVO) => {
    return await request.put({ url: `/md/movie/update`, data })
  },

  // 删除影片
  deleteMovie: async (id: number) => {
    return await request.delete({ url: `/md/movie/delete?id=` + id })
  },

  // 导出影片 Excel
  exportMovie: async (params) => {
    return await request.download({ url: `/md/movie/export-excel`, params })
  }
}