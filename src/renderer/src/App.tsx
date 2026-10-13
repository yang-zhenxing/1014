import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronRight,
  Database,
  FileText,
  Filter,
  GitBranch,
  LayoutDashboard,
  Layers3,
  LogOut,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import LoginPage from './LoginPage'
import { AUTH_SESSION_KEY, verifyCredentials } from './auth'
import { dataCollections, news, projects, type Project } from './data/demo'

type PageId =
  | 'dashboard'
  | 'resources'
  | 'entities'
  | 'search'
  | 'analysis'
  | 'relations'
  | 'profile'
  | 'recommend'
  | 'news'
  | 'settings'

const sections: { label: string; pages: { id: PageId; name: string; icon: LucideIcon }[] }[] = [
  { label: '总览', pages: [{ id: 'dashboard', name: '工作台', icon: LayoutDashboard }] },
  {
    label: '数据探索',
    pages: [
      { id: 'resources', name: '数据资源', icon: Database },
      { id: 'entities', name: '主体档案', icon: Building2 },
      { id: 'search', name: '综合检索', icon: Search }
    ]
  },
  {
    label: '研究分析',
    pages: [
      { id: 'analysis', name: '调查分析', icon: BarChart3 },
      { id: 'relations', name: '投资关系', icon: GitBranch },
      { id: 'profile', name: '企业画像', icon: FileText },
      { id: 'recommend', name: '项目推荐', icon: Sparkles }
    ]
  },
  {
    label: '系统',
    pages: [
      { id: 'news', name: '资讯舆情', icon: Activity },
      { id: 'settings', name: '数据与设置', icon: Settings2 }
    ]
  }
]
const titleById = Object.fromEntries(
  sections.flatMap((group) => group.pages.map((item) => [item.id, item.name]))
) as Record<PageId, string>

function routeFromHash(): PageId {
  const id = window.location.hash.slice(1) as PageId
  return id in titleById ? id : 'dashboard'
}

function App(): React.JSX.Element {
  const [signedIn, setSignedIn] = useState(
    () => window.sessionStorage.getItem(AUTH_SESSION_KEY) === 'admin'
  )
  const [page, setPage] = useState<PageId>(routeFromHash)
  const [query, setQuery] = useState('')
  const [globalQuery, setGlobalQuery] = useState('')
  const [industry, setIndustry] = useState('全部赛道')
  const [selected, setSelected] = useState<Project | null>(null)
  const [notice, setNotice] = useState('')
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onHash = (): void => setPage(routeFromHash())
    window.addEventListener('hashchange', onHash)
    window.addEventListener('popstate', onHash)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('popstate', onHash)
    }
  }, [])

  useEffect(() => {
    if (!accountMenuOpen) return
    const closeOnOutsideClick = (event: PointerEvent): void => {
      if (!accountMenuRef.current?.contains(event.target as Node)) setAccountMenuOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setAccountMenuOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [accountMenuOpen])

  const filtered = useMemo(
    () =>
      projects.filter((item) => {
        const matchesQuery = `${item.name} ${item.industry} ${item.city} ${item.tags.join(' ')}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
        return matchesQuery && (industry === '全部赛道' || item.industry === industry)
      }),
    [query, industry]
  )

  function navigate(id: PageId): void {
    window.history.pushState(null, '', `#${id}`)
    setPage(id)
    setSelected(null)
  }

  function showNotice(message: string): void {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3000)
  }

  function signIn(account: string, password: string): boolean {
    if (!verifyCredentials(account, password)) return false
    window.sessionStorage.setItem(AUTH_SESSION_KEY, 'admin')
    setSignedIn(true)
    return true
  }

  function signOut(): void {
    window.sessionStorage.removeItem(AUTH_SESSION_KEY)
    setAccountMenuOpen(false)
    setSignedIn(false)
    setSelected(null)
    navigate('dashboard')
  }

  if (!signedIn) return <LoginPage onLogin={signIn} />

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <Layers3 size={21} />
          </span>
          <div>
            <strong>创投数据终端</strong>
            <small>市场调查数据平台</small>
          </div>
        </div>
        <div className="workspace">
          <span>研</span>
          <div>
            <strong>研究工作空间</strong>
            <small>数据研究中心</small>
          </div>
        </div>
        <nav aria-label="主导航">
          {sections.map((group) => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.pages.map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  className={page === id ? 'active' : ''}
                  onClick={() => navigate(id)}
                >
                  <Icon size={18} />
                  <span>{name}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <div className="breadcrumb">
            创投数据终端 <ChevronRight size={14} /> <strong>{titleById[page]}</strong>
          </div>
          <form
            className="global-search"
            onSubmit={(event) => {
              event.preventDefault()
              setQuery(globalQuery)
              setIndustry('全部赛道')
              navigate('search')
            }}
          >
            <Search size={16} />
            <input
              aria-label="全局搜索"
              placeholder="搜索项目、企业、机构..."
              value={globalQuery}
              onChange={(event) => setGlobalQuery(event.target.value)}
            />
            <kbd>Enter</kbd>
          </form>
          <button className="top-icon" aria-label="消息" onClick={() => showNotice('暂无新消息')}>
            <Bell size={19} />
          </button>
          <div className="account-menu" ref={accountMenuRef}>
            <button
              className="account-trigger"
              aria-label="账号菜单"
              aria-haspopup="menu"
              aria-expanded={accountMenuOpen}
              onClick={() => setAccountMenuOpen((open) => !open)}
            >
              <span className="top-avatar">A</span>
              <ChevronDown size={14} />
            </button>
            {accountMenuOpen && (
              <div className="account-dropdown" role="menu">
                <div className="account-dropdown-profile">
                  <span className="top-avatar">A</span>
                  <div>
                    <strong>管理员</strong>
                    <small>admin</small>
                  </div>
                </div>
                <button role="menuitem" onClick={signOut}>
                  <LogOut size={16} />
                  退出登录
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="content">
          {page === 'dashboard' && (
            <>
              <PageHead
                eyebrow="OVERVIEW / 研究工作台"
                title="早上好，管理员"
                description="聚合项目、机构与赛道信息，快速进入市场调查工作。"
              />
              <div className="metrics">
                <Metric
                  label="收录创业项目"
                  value="1,286"
                  detail="较上期 +8.2%"
                  icon={Layers3}
                  tone="blue"
                />
                <Metric
                  label="企业主体"
                  value="2,438"
                  detail="覆盖 32 个城市"
                  icon={Building2}
                  tone="green"
                />
                <Metric
                  label="投融资事件"
                  value="4,091"
                  detail="本月新增 126 条"
                  icon={TrendingUp}
                  tone="orange"
                />
                <Metric
                  label="关注赛道"
                  value="58"
                  detail="重点跟踪 12 个"
                  icon={Activity}
                  tone="purple"
                />
              </div>
              <div className="two-column">
                <Panel
                  title="重点项目"
                  subtitle="最近查看与持续关注的创业项目"
                  action={
                    <button className="link-button" onClick={() => navigate('entities')}>
                      查看全部 <ArrowRight size={15} />
                    </button>
                  }
                >
                  <ProjectTable items={projects.slice(0, 4)} open={setSelected} />
                </Panel>
                <Panel title="快捷入口" subtitle="从常用任务开始">
                  <div className="quick-links">
                    {[
                      {
                        id: 'search' as PageId,
                        title: '综合检索',
                        detail: '多维查找项目与企业',
                        icon: Search
                      },
                      {
                        id: 'analysis' as PageId,
                        title: '调查分析',
                        detail: '查看赛道与区域趋势',
                        icon: BarChart3
                      },
                      {
                        id: 'profile' as PageId,
                        title: '企业画像',
                        detail: '浏览三维画像预览',
                        icon: FileText
                      }
                    ].map(({ id, title, detail, icon: Icon }) => (
                      <button key={id} onClick={() => navigate(id)}>
                        <span className="quick-icon">
                          <Icon size={18} />
                        </span>
                        <span>
                          <strong>{title}</strong>
                          <small>{detail}</small>
                        </span>
                        <ChevronRight size={16} />
                      </button>
                    ))}
                  </div>
                </Panel>
              </div>
              <div className="two-column lower">
                <Panel title="赛道热度概览" subtitle="重点赛道关注情况">
                  <div className="bars">
                    {[
                      ['先进制造', 82],
                      ['新能源', 72],
                      ['人工智能', 66],
                      ['医疗健康', 52]
                    ].map(([label, value]) => (
                      <div className="bar-row" key={label}>
                        <span>{label}</span>
                        <div>
                          <i style={{ width: `${value}%` }} />
                        </div>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel title="最新资讯" subtitle="与你关注的领域相关">
                  <div className="small-news">
                    {news.slice(0, 3).map((item) => (
                      <div key={item.title}>
                        <span className="dot" />
                        <div>
                          <strong>{item.title}</strong>
                          <small>
                            {item.category} · {item.time}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            </>
          )}

          {page === 'resources' && (
            <>
              <PageHead
                eyebrow="DATA CENTER / 数据中心"
                title="数据资源"
                description="浏览系统收录的五类核心资源与字段结构。"
              />
              <div className="resource-grid">
                {dataCollections.map((item) => (
                  <button
                    className="resource-card"
                    key={item.name}
                    onClick={() => navigate('entities')}
                  >
                    <span className={`resource-icon ${item.tone}`}>
                      <Database size={21} />
                    </span>
                    <strong>{item.name}</strong>
                    <p>{item.caption}</p>
                    <div>
                      <b>{item.count}</b>
                      <small> 条记录</small>
                      <ArrowRight size={17} />
                    </div>
                  </button>
                ))}
              </div>
              <Panel title="数据资源目录" subtitle="各类数据资源与更新状态">
                <div className="simple-list">
                  {dataCollections.map((item) => (
                    <div key={item.name}>
                      <strong>{item.name}</strong>
                      <span>结构化主体数据</span>
                      <em>已收录</em>
                    </div>
                  ))}
                </div>
              </Panel>
            </>
          )}

          {page === 'entities' && (
            <>
              <PageHead
                eyebrow="ENTITY LIBRARY / 主体档案"
                title="主体档案"
                description="查看项目、企业与投资机构的基础信息和关联线索。"
              />
              <Panel title="创业项目" subtitle="点击项目查看详细信息">
                <div className="table-toolbar">
                  <SearchBox
                    value={query}
                    change={setQuery}
                    placeholder="搜索项目名称、赛道或城市"
                  />
                  <span>{filtered.length} 条结果</span>
                </div>
                <ProjectTable items={filtered} open={setSelected} />
              </Panel>
            </>
          )}

          {page === 'search' && (
            <>
              <PageHead
                eyebrow="DISCOVERY / 综合检索"
                title="综合检索"
                description="通过关键词与赛道条件，快速定位目标项目。"
              />
              <Panel title="筛选条件" subtitle="按项目名称、赛道和城市查找">
                <div className="filter-form">
                  <SearchBox
                    value={query}
                    change={setQuery}
                    placeholder="输入项目、企业、赛道或城市关键词"
                  />
                  <Filter size={17} />
                  <select
                    aria-label="赛道筛选"
                    value={industry}
                    onChange={(event) => setIndustry(event.target.value)}
                  >
                    <option>全部赛道</option>
                    {[...new Set(projects.map((item) => item.industry))].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </Panel>
              <Panel title="检索结果" subtitle={`找到 ${filtered.length} 条项目`}>
                <ProjectTable items={filtered} open={setSelected} />
              </Panel>
            </>
          )}

          {page === 'analysis' && (
            <>
              <PageHead
                eyebrow="RESEARCH / 调查分析"
                title="调查分析"
                description="用样例图表浏览赛道、区域和融资阶段的分布。"
                action={
                  <button
                    className="outline-button"
                    onClick={() => showNotice('当前没有可导出的报表')}
                  >
                    <FileText size={16} />
                    导出报表
                  </button>
                }
              />
              <div className="metrics three">
                <Metric
                  label="样本项目"
                  value="1,286"
                  detail="五大核心赛道"
                  icon={Layers3}
                  tone="blue"
                />
                <Metric
                  label="近一年融资事件"
                  value="426"
                  detail="近一年"
                  icon={TrendingUp}
                  tone="green"
                />
                <Metric
                  label="覆盖地区"
                  value="32"
                  detail="省市及地区"
                  icon={Activity}
                  tone="purple"
                />
              </div>
              <div className="two-column">
                <Panel title="赛道项目分布" subtitle="按项目数量统计">
                  <div className="vertical-chart">
                    {[
                      ['先进制造', 83],
                      ['新能源', 70],
                      ['人工智能', 63],
                      ['医疗健康', 51],
                      ['新材料', 42]
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="chart-track">
                          <i style={{ height: `${value}%` }}>
                            <b>{value}</b>
                          </i>
                        </div>
                        <small>{label}</small>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel title="融资阶段分布" subtitle="样本项目融资状态">
                  <div className="stage-list">
                    {[
                      ['天使轮', 32],
                      ['Pre-A轮', 24],
                      ['A轮', 21],
                      ['B轮及以后', 15],
                      ['其他', 8]
                    ].map(([label, value]) => (
                      <div key={label}>
                        <span>
                          {label}
                          <b>{value}%</b>
                        </span>
                        <div>
                          <i style={{ width: `${value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            </>
          )}

          {page === 'relations' && (
            <>
              <PageHead
                eyebrow="NETWORK / 投资关系"
                title="投资关系"
                description="查看项目、机构与企业之间的关联关系。"
              />
              <Panel title="星河智造投资关系" subtitle="项目关联主体">
                <div className="relation-canvas">
                  <div className="edge e1" />
                  <div className="edge e2" />
                  <div className="edge e3" />
                  <div className="edge e4" />
                  <div className="node n1">
                    <small>机构</small>
                    <strong>远景资本</strong>
                  </div>
                  <div className="node n2">
                    <small>机构</small>
                    <strong>启航创投</strong>
                  </div>
                  <div className="node center">
                    <small>创业项目</small>
                    <strong>星河智造</strong>
                  </div>
                  <div className="node n3">
                    <small>企业</small>
                    <strong>星河装备</strong>
                  </div>
                  <div className="node n4">
                    <small>赛道</small>
                    <strong>先进制造</strong>
                  </div>
                </div>
              </Panel>
            </>
          )}

          {page === 'profile' && (
            <>
              <PageHead
                eyebrow="PROFILE / 企业画像"
                title="企业画像"
                description="从业务、资本与风险三个维度查看主体信息。"
                action={
                  <button className="outline-button" onClick={() => showNotice('暂无可预览的报告')}>
                    <FileText size={16} />
                    报告预览
                  </button>
                }
              />
              <div className="profile-hero">
                <span className="project-avatar large">星</span>
                <div>
                  <small>项目画像</small>
                  <h2>星河智造</h2>
                  <p>{projects[0].description}</p>
                  <div className="tags">
                    {projects[0].tags.map((tag) => (
                      <em key={tag}>{tag}</em>
                    ))}
                  </div>
                </div>
                <button className="link-button" onClick={() => setSelected(projects[0])}>
                  查看档案 <ArrowRight size={15} />
                </button>
              </div>
              <div className="profile-grid">
                {[
                  {
                    icon: BookOpen,
                    title: '业务画像',
                    lines: [
                      '核心业务：柔性生产线协同',
                      '目标客户：中小型制造企业',
                      '赛道标签：工业软件 / 智能装备'
                    ]
                  },
                  {
                    icon: TrendingUp,
                    title: '资本画像',
                    lines: ['当前阶段：B轮', '最近融资：2.4亿元', '关联机构：远景资本、启航创投']
                  },
                  {
                    icon: ShieldCheck,
                    title: '风险画像',
                    lines: ['公开风险：暂无记录', '信息完整度：中', '建议核验：业务与财务资料']
                  }
                ].map(({ icon: Icon, title, lines }) => (
                  <div className="profile-card" key={title}>
                    <span className="quick-icon">
                      <Icon size={20} />
                    </span>
                    <h2>{title}</h2>
                    {lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}

          {page === 'recommend' && (
            <>
              <PageHead
                eyebrow="MATCHING / 项目推荐"
                title="项目推荐"
                description="根据赛道、阶段和地区发现相似项目。"
              />
              <Info>项目匹配结果仅供研究参考，不构成投资建议。</Info>
              <div className="recommend-grid">
                {projects.slice(1).map((item, index) => (
                  <button
                    className="recommend-card"
                    key={item.id}
                    onClick={() => setSelected(item)}
                  >
                    <div>
                      <span className="project-avatar">{item.name.slice(0, 1)}</span>
                      <span className="score">{[92, 87, 84, 79][index]}% 匹配</span>
                    </div>
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                    <div className="tags">
                      {item.tags.slice(0, 2).map((tag) => (
                        <em key={tag}>{tag}</em>
                      ))}
                    </div>
                    <footer>
                      {item.industry} · {item.stage}
                      <ArrowRight size={17} />
                    </footer>
                  </button>
                ))}
              </div>
            </>
          )}

          {page === 'news' && (
            <>
              <PageHead
                eyebrow="INTELLIGENCE / 资讯舆情"
                title="资讯舆情"
                description="集中查看行业动态、项目新闻和舆情提示。"
                action={
                  <button
                    className="outline-button"
                    onClick={() => showNotice('暂无可用的订阅规则')}
                  >
                    <Bell size={16} />
                    订阅设置
                  </button>
                }
              />
              <div className="two-column">
                <Panel title="最新资讯" subtitle="按发布时间排序">
                  <div className="news-list">
                    {news.map((item) => (
                      <button key={item.title} onClick={() => showNotice('暂无更多资讯内容')}>
                        <em>{item.category}</em>
                        <span>
                          <strong>{item.title}</strong>
                          <small>
                            {item.time} · 舆情倾向：{item.level}
                          </small>
                        </span>
                        <ChevronRight size={17} />
                      </button>
                    ))}
                  </div>
                </Panel>
                <Panel title="舆情观察" subtitle="重点关注主体">
                  <div className="watch-summary">
                    <Activity size={29} />
                    <h2>整体态势平稳</h2>
                    <p>近 7 天暂无高等级预警</p>
                  </div>
                  <div className="watch-row">
                    星河智造 <span>正常</span>
                  </div>
                  <div className="watch-row">
                    澄海能源 <span>正常</span>
                  </div>
                </Panel>
              </div>
            </>
          )}

          {page === 'settings' && (
            <>
              <PageHead
                eyebrow="SYSTEM / 数据与设置"
                title="数据与设置"
                description="查看数据状态和系统配置入口。"
              />
              <div className="settings-grid">
                {[
                  {
                    icon: Database,
                    title: '数据源管理',
                    desc: '查看数据资源与更新时间',
                    status: '5 类数据资源 · 已就绪'
                  },
                  {
                    icon: Building2,
                    title: '账号与角色',
                    desc: '查看角色与访问范围',
                    status: '当前身份：管理员'
                  },
                  {
                    icon: ShieldCheck,
                    title: '操作审计',
                    desc: '展示操作记录结构与审计入口',
                    status: '操作记录'
                  },
                  {
                    icon: Settings2,
                    title: '应用设置',
                    desc: '界面偏好、备份与版本信息',
                    status: '版本 0.1.0 · 开发版'
                  }
                ].map(({ icon: Icon, title, desc, status }) => (
                  <button key={title} onClick={() => showNotice(`${title}当前不可修改`)}>
                    <span className="quick-icon">
                      <Icon size={20} />
                    </span>
                    <span>
                      <strong>{title}</strong>
                      <p>{desc}</p>
                      <small>{status}</small>
                    </span>
                    <ChevronRight size={18} />
                  </button>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
      {selected && (
        <div className="drawer-shade" onClick={() => setSelected(null)}>
          <aside className="drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head">
              项目档案 · {selected.id}
              <button aria-label="关闭详情" onClick={() => setSelected(null)}>
                <X size={19} />
              </button>
            </div>
            <div className="drawer-intro">
              <span className="project-avatar large">{selected.name.slice(0, 1)}</span>
              <h2>{selected.name}</h2>
              <p>{selected.description}</p>
              <div className="tags">
                {selected.tags.map((tag) => (
                  <em key={tag}>{tag}</em>
                ))}
              </div>
            </div>
            <div className="drawer-section">
              <h3>基本信息</h3>
              <dl>
                <dt>所属赛道</dt>
                <dd>{selected.industry}</dd>
                <dt>融资阶段</dt>
                <dd>{selected.stage}</dd>
                <dt>所在城市</dt>
                <dd>{selected.city}</dd>
                <dt>成立年份</dt>
                <dd>{selected.founded}</dd>
                <dt>最近融资</dt>
                <dd>{selected.funding}</dd>
              </dl>
            </div>
            <div className="drawer-section">
              <h3>融资历程</h3>
              <p>
                {selected.stage}融资 · {selected.funding}
              </p>
              <p>{selected.founded}年 · 项目成立</p>
            </div>
          </aside>
        </div>
      )}
      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
    </div>
  )
}

function PageHead({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string
  title: string
  description: string
  action?: React.ReactNode
}): React.JSX.Element {
  return (
    <div className="page-head">
      <div>
        <small>{eyebrow}</small>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}
function Panel({
  title,
  subtitle,
  action,
  children
}: {
  title: string
  subtitle: string
  action?: React.ReactNode
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
function Metric({
  label,
  value,
  detail,
  icon: Icon,
  tone
}: {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  tone: string
}): React.JSX.Element {
  return (
    <div className="metric">
      <div>
        <span>{label}</span>
        <i className={tone}>
          <Icon size={20} />
        </i>
      </div>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  )
}
function ProjectTable({
  items,
  open
}: {
  items: Project[]
  open: (item: Project) => void
}): React.JSX.Element {
  return (
    <div className="project-table">
      <div className="table-head">
        <span>项目名称</span>
        <span>所属赛道</span>
        <span>融资阶段</span>
        <span>所在地</span>
        <span />
      </div>
      {items.length ? (
        items.map((item) => (
          <button className="table-row" key={item.id} onClick={() => open(item)}>
            <span>
              <i>{item.name.slice(0, 1)}</i>
              <strong>{item.name}</strong>
            </span>
            <span>{item.industry}</span>
            <span>
              <em>{item.stage}</em>
            </span>
            <span>{item.city}</span>
            <ChevronRight size={16} />
          </button>
        ))
      ) : (
        <div className="empty">没有找到匹配的项目，请尝试其他关键词。</div>
      )}
    </div>
  )
}
function SearchBox({
  value,
  change,
  placeholder
}: {
  value: string
  change: (value: string) => void
  placeholder: string
}): React.JSX.Element {
  return (
    <label className="search-box">
      <Search size={17} />
      <input
        value={value}
        onChange={(event) => change(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  )
}
function Info({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="info">
      <ShieldCheck size={16} />
      {children}
    </div>
  )
}
export default App
