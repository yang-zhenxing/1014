export type Project = {
  id: string
  name: string
  industry: string
  stage: string
  city: string
  founded: string
  funding: string
  description: string
  tags: string[]
}

export const projects: Project[] = [
  {
    id: 'P-001',
    name: '星河智造',
    industry: '先进制造',
    stage: 'B轮',
    city: '深圳',
    founded: '2021',
    funding: '2.4亿元',
    description: '为中小型工厂提供柔性生产线与设备协同方案。',
    tags: ['工业软件', '智能装备', '华南']
  },
  {
    id: 'P-002',
    name: '澄海能源',
    industry: '新能源',
    stage: 'A轮',
    city: '苏州',
    founded: '2022',
    funding: '8,000万元',
    description: '聚焦工商业储能管理与电池寿命预测。',
    tags: ['储能', '能源管理', '长三角']
  },
  {
    id: 'P-003',
    name: '微序科技',
    industry: '医疗健康',
    stage: '天使轮',
    city: '上海',
    founded: '2023',
    funding: '3,500万元',
    description: '开发面向临床研究的数据整理与辅助分析工具。',
    tags: ['医疗数据', '软件服务', '长三角']
  },
  {
    id: 'P-004',
    name: '云川机器人',
    industry: '人工智能',
    stage: 'Pre-A轮',
    city: '北京',
    founded: '2022',
    funding: '5,000万元',
    description: '面向仓储场景的移动机器人与任务调度系统。',
    tags: ['机器人', '物流科技', '京津冀']
  },
  {
    id: 'P-005',
    name: '青禾材料',
    industry: '新材料',
    stage: 'A轮',
    city: '杭州',
    founded: '2020',
    funding: '1.2亿元',
    description: '研发低碳包装材料及规模化生产工艺。',
    tags: ['低碳', '先进材料', '长三角']
  }
]

export const dataCollections = [
  { name: '创业项目库', count: '1,286', caption: '项目档案、融资历程、核心团队', tone: 'blue' },
  { name: '企业信息库', count: '2,438', caption: '企业主体、股权结构、经营标签', tone: 'green' },
  { name: '投资机构库', count: '362', caption: '机构画像、基金档案、投资偏好', tone: 'purple' },
  { name: '投融资事件库', count: '4,091', caption: '轮次、金额、参与方与事件时间', tone: 'orange' },
  { name: '行业赛道库', count: '58', caption: '赛道分类、行业指标、区域分布', tone: 'cyan' }
]

export const news = [
  {
    category: '融资动态',
    title: '先进制造赛道一季度融资活跃度持续提升',
    time: '今天 09:32',
    level: '中性'
  },
  {
    category: '行业观察',
    title: '工商业储能应用场景向精细化运营延伸',
    time: '昨天 16:40',
    level: '关注'
  },
  {
    category: '项目动态',
    title: '星河智造发布新一代柔性产线协同方案',
    time: '昨天 11:18',
    level: '正面'
  },
  { category: '政策资讯', title: '多地发布科技型企业创新支持举措', time: '10月10日', level: '中性' }
]
