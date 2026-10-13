import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, Layers3, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react'
import './assets/login.css'

type LoginPageProps = {
  onLogin: (account: string, password: string) => boolean
}

export default function LoginPage({ onLogin }: LoginPageProps): React.JSX.Element {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function submit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    setError('')
    if (!account.trim() || !password) {
      setError('请输入账号和密码')
      return
    }
    if (!onLogin(account, password)) {
      setError('账号或密码错误')
      setPassword('')
    }
  }

  return (
    <main className="login-page">
      <section className="login-visual" aria-label="系统介绍">
        <div className="login-brand">
          <span className="login-brand-icon">
            <Layers3 size={24} strokeWidth={2.2} />
          </span>
          <span>创业项目市场调查数据终端</span>
        </div>
        <div className="login-visual-content">
          <div className="login-eyebrow">VENTURE INTELLIGENCE</div>
          <h1>
            连接数据与洞察
            <br />
            让研究更进一步
          </h1>
          <p>汇聚创业项目、企业主体、投资机构与行业赛道信息，建立清晰的市场调查工作视图。</p>
          <div className="login-data-preview" aria-hidden="true">
            <div className="login-preview-head">
              <span />
              <span />
              <span />
            </div>
            <div className="login-preview-bars">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="login-preview-footer">
              <span>项目趋势</span>
              <strong>+18.6%</strong>
            </div>
          </div>
        </div>
        <div className="login-visual-footer">
          <ShieldCheck size={16} /> 数据研究工作空间
        </div>
      </section>

      <section className="login-form-area">
        <div className="login-card">
          <div className="login-form-icon">
            <LockKeyhole size={22} />
          </div>
          <h2>欢迎登录</h2>
          <p className="login-subtitle">请输入账号信息以访问数据终端</p>
          <form onSubmit={submit}>
            <label htmlFor="login-account">账号</label>
            <div className="login-input-wrap">
              <UserRound size={18} />
              <input
                id="login-account"
                name="account"
                type="text"
                autoComplete="username"
                placeholder="请输入账号"
                value={account}
                onChange={(event) => {
                  setAccount(event.target.value)
                  setError('')
                }}
              />
            </div>
            <label htmlFor="login-password">密码</label>
            <div className="login-input-wrap">
              <LockKeyhole size={18} />
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="请输入密码"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError('')
                }}
              />
              <button
                className="password-toggle"
                type="button"
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="login-error" role="alert" aria-live="polite">
              {error}
            </div>
            <button className="login-submit" type="submit">
              登录系统 <ArrowRight size={18} />
            </button>
          </form>
          <div className="login-form-footer">创业项目市场调查数据终端</div>
        </div>
      </section>
    </main>
  )
}
