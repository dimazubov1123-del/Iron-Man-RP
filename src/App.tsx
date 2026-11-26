import { useEffect, useRef, useState } from 'react'
import { Activity, AudioLines, Battery, Bot, ChevronRight, Cpu, Gauge, Mic, MicOff, Power, Radio, Shield, Volume2, Wrench, Zap } from 'lucide-react'

type Phase = 'lab' | 'suiting' | 'helmet'
const steps = ['Подготовка сервоприводов', 'Фиксация нижних сегментов', 'Установка нагрудной секции', 'Подключение энергосистемы', 'Закрытие шлема', 'Запуск JARVIS']

export default function App() {
  const [phase, setPhase] = useState<Phase>('lab')
  const [step, setStep] = useState(-1)
  const [busy, setBusy] = useState(false)
  const [energy, setEnergy] = useState(98)
  const [jarvisMessage, setJarvisMessage] = useState('Добро пожаловать домой, сэр. Лаборатория готова к работе.')
  const [listening, setListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const recognition = useRef<any>(null)

  const speak = (message: string) => {
    setJarvisMessage(message)
    if (voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.lang = 'ru-RU'; utterance.rate = 0.94; utterance.pitch = 0.82
      window.speechSynthesis.speak(utterance)
    }
  }

  const runSuitUp = () => {
    if (busy) return
    setBusy(true); setPhase('suiting'); setStep(0)
    speak('Запускаю процедуру надевания брони Марк три. Прошу сохранять неподвижность.')
    let current = 0
    const timer = window.setInterval(() => {
      current += 1
      if (current < steps.length) {
        setStep(current)
        if (current === 4) speak('Шлем закрывается. Активирую визуальный интерфейс.')
      } else {
        window.clearInterval(timer); setPhase('helmet'); setStep(-1); setBusy(false)
        speak('Броня Марк три активирована. Все основные системы доступны. Чем могу помочь, сэр?')
      }
    }, 1700)
  }

  const command = (raw: string) => {
    const text = raw.toLowerCase()
    if (text.includes('диагност')) { speak('Диагностика завершена. Реактор работает стабильно. Повреждений брони не обнаружено.'); return }
    if (text.includes('энерг') || text.includes('реактор')) { speak(`Уровень энергии ${energy} процентов. Реактор функционирует в штатном режиме.`); return }
    if (text.includes('лаборатор') || text.includes('снять')) { setPhase('lab'); speak('Возвращаю интерфейс лаборатории.'); return }
    if (text.includes('шлем') || text.includes('hud')) { setPhase('helmet'); speak('Интерфейс шлема активирован.'); return }
    if (text.includes('надеть') || text.includes('костюм')) { runSuitUp(); return }
    speak('Команда принята, сэр. В текущей версии я могу выполнить диагностику, проверить энергосистему, открыть интерфейс шлема или начать надевание брони.')
  }

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) { speak('Распознавание речи не поддерживается этим браузером. Попробуйте Chrome.'); return }
    const rec = new SpeechRecognition(); rec.lang = 'ru-RU'; rec.interimResults = false; rec.maxAlternatives = 1
    rec.onresult = (event: any) => command(event.results[0][0].transcript)
    rec.onerror = () => { setListening(false); speak('Не удалось распознать команду. Попробуйте ещё раз.') }
    rec.onend = () => setListening(false)
    recognition.current = rec; setListening(true); rec.start()
  }

  useEffect(() => () => { window.speechSynthesis?.cancel(); recognition.current?.stop?.() }, [])

  return <main className={phase === 'helmet' ? 'app helmet-mode' : 'app'}>
    <div className="scanlines" />
    <header className="topbar">
      <div className="brand"><div className="brand-mark"><Zap size={19}/></div><div><b>STARK INDUSTRIES</b><span>ADVANCED SYSTEMS DIVISION</span></div></div>
      <div className="top-center"><span className="live-dot"/> СИСТЕМА В СЕТИ <i/> MARK III // PROTOTYPE</div>
      <div className="top-right"><span>ПЯТНИЦА, 08:42</span><div className="avatar">TS</div></div>
    </header>

    <section className="workspace">
      <aside className="sidebar">
        <div className="side-label">НАВИГАЦИЯ</div>
        <button className={phase === 'lab' ? 'nav-item active' : 'nav-item'} onClick={() => {setPhase('lab'); speak('Лаборатория открыта.')}}><Cpu size={17}/> Лаборатория</button>
        <button className="nav-item" onClick={() => speak('В базе данных пока доступна только броня Марк три.')}><Shield size={17}/> База брони <span className="nav-count">01</span></button>
        <button className="nav-item" onClick={() => speak('Инструменты диагностики готовы.')}><Activity size={17}/> Диагностика</button>
        <button className={phase === 'helmet' ? 'nav-item active' : 'nav-item'} onClick={() => {setPhase('helmet'); speak('Интерфейс шлема активирован.')}}><Gauge size={17}/> Интерфейс шлема</button>
        <div className="side-divider"/>
        <div className="side-label">СИСТЕМЫ</div>
        <div className="system-line"><span className="system-dot"/> JARVIS <small>АКТИВЕН</small></div>
        <div className="system-line"><span className="system-dot"/> ARC REACTOR <small>СТАБИЛЕН</small></div>
        <div className="system-line"><span className="system-dot amber"/> FLIGHT CONTROL <small>ОЖИДАНИЕ</small></div>
        <div className="sidebar-bottom"><div className="profile"><div className="profile-icon">TS</div><div><b>TONY STARK</b><span>ADMINISTRATOR</span></div></div></div>
      </aside>

      <div className="main-content">
        <div className="page-heading"><div><div className="eyebrow">ПЕРСОНАЛЬНАЯ ЛАБОРАТОРИЯ // МАЛИБУ</div><h1>{phase === 'helmet' ? 'HELMET INTERFACE' : phase === 'suiting' ? 'SUIT SEQUENCE' : 'Добро пожаловать, Тони.'}</h1><p>{phase === 'helmet' ? 'Визуальная система брони Mark III' : 'Все системы Stark Industries функционируют в штатном режиме.'}</p></div><div className="date-chip"><span>ОБЪЕКТ</span><b>МАЛИБУ, КАЛИФОРНИЯ</b></div></div>

        {phase === 'lab' && <div className="hero-grid">
          <div className="armor-panel">
            <div className="panel-top"><span>АКТИВНЫЙ ЭКЗЕМПЛЯР</span><span className="status-pill"><i/> ГОТОВ</span></div>
            <div className="armor-stage"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="armor-glow"/><div className="armor-figure"><div className="armor-head"><div className="eye eye-left"/><div className="eye eye-right"/></div><div className="armor-neck"/><div className="armor-body"><div className="arc-core"/><div className="chest-line"/></div><div className="armor-arm left-arm"/><div className="armor-arm right-arm"/><div className="armor-leg left-leg"/><div className="armor-leg right-leg"/></div><div className="stage-caption">MARK III <span>•</span> ARMOR DISPLAY</div></div>
            <div className="armor-info"><div><span>МОДЕЛЬ</span><b>MARK III</b></div><div><span>КЛАСС</span><b>ОСНОВНАЯ БРОНЯ</b></div><div><span>СОСТОЯНИЕ</span><b className="green">100% · НОРМА</b></div></div>
            <button className="primary-btn" onClick={runSuitUp} disabled={busy}><Power size={17}/> НАЧАТЬ НАДЕВАНИЕ <ChevronRight size={17}/></button>
          </div>
          <div className="right-stack">
            <div className="jarvis-card"><div className="card-heading"><div className="jarvis-icon"><AudioLines size={19}/></div><div><b>J.A.R.V.I.S.</b><span>JUST A RATHER VERY INTELLIGENT SYSTEM</span></div><span className="online">ONLINE</span></div><div className="waveform">{Array.from({length:34},(_,i)=><i key={i} style={{height:(8+(i*17%25))+'px'}}/>)}</div><p className="jarvis-message">«{jarvisMessage}»</p><div className="jarvis-actions"><button onClick={startListening} className={listening?'listen-btn listening':'listen-btn'}><Mic size={16}/>{listening?'СЛУШАЮ...':'ГОВОРИТЬ С JARVIS'}</button><button className="icon-btn" onClick={()=>setVoiceEnabled(!voiceEnabled)} title="Голос JARVIS">{voiceEnabled?<Volume2 size={17}/>:<Volume2 size={17} opacity={0.4}/>}</button></div></div>
            <div className="telemetry-card"><div className="card-title"><span>ТЕЛЕМЕТРИЯ БРОНИ</span><Activity size={16}/></div><div className="metric"><div><span>ЭНЕРГИЯ РЕАКТОРА</span><b>{energy}%</b></div><div className="bar"><i style={{width:energy+'%'}}/></div></div><div className="metric"><div><span>ЦЕЛОСТНОСТЬ БРОНИ</span><b>100%</b></div><div className="bar"><i style={{width:'100%'}}/></div></div><div className="metric"><div><span>ТЕМПЕРАТУРА СИСТЕМ</span><b>32°C</b></div><div className="bar"><i style={{width:'32%'}}/></div></div><div className="telemetry-foot"><span><span className="system-dot"/> ВСЕ ПОКАЗАТЕЛИ В НОРМЕ</span><button onClick={()=>{setEnergy(Math.max(0,energy-1));speak('Проверка энергосистемы завершена.')}}><Wrench size={13}/> ПРОВЕРИТЬ</button></div></div>
          </div>
        </div>}

        {phase === 'suiting' && <div className="sequence-panel"><div className="sequence-visual"><div className="sequence-ring"/><div className="sequence-core"><Shield size={58}/></div></div><div className="eyebrow">MARK III // АВТОМАТИЧЕСКАЯ ПРОЦЕДУРА</div><h2>Надевание брони</h2><p>JARVIS контролирует последовательность сборки и фиксации элементов.</p><div className="sequence-list">{steps.map((s,i)=><div className={i<step?'done':i===step?'current':''} key={s}><span>{i<step?'✓':String(i+1).padStart(2,'0')}</span>{s}{i===step&&<i className="loader"/>}</div>)}</div></div>}

        {phase === 'helmet' && <div className="hud-screen"><div className="hud-top"><span>STARK HUD // MARK III</span><span>● СВЯЗЬ С JARVIS УСТАНОВЛЕНА</span></div><div className="hud-reticle"><div className="reticle-circle"/><div className="reticle-cross horizontal"/><div className="reticle-cross vertical"/><span className="reticle-label">СИСТЕМА СКАНИРОВАНИЯ ГОТОВА</span></div><div className="hud-left"><div className="hud-box"><span>РЕАКТОР</span><b>{energy}%</b><small>НОРМА</small></div><div className="hud-box"><span>БРОНЯ</span><b>100%</b><small>БЕЗ ПОВРЕЖДЕНИЙ</small></div></div><div className="hud-right"><div className="hud-box"><span>ВЫСОТА</span><b>000 м</b><small>НА ЗЕМЛЕ</small></div><div className="hud-box"><span>СКОРОСТЬ</span><b>0 км/ч</b><small>НЕПОДВИЖЕН</small></div></div><div className="hud-bottom"><span>ПИЛОТ: T. STARK</span><span>MARK III / СИСТЕМЫ АКТИВНЫ</span><button onClick={()=>{setPhase('lab');speak('Возвращаюсь в лабораторию, сэр.')}}>В ЛАБОРАТОРИЮ</button></div><div className="hud-jarvis">JARVIS: {jarvisMessage}</div></div>}
      </div>
    </section>
    <footer className="footer"><span>STARK INDUSTRIES © // INTERNAL USE ONLY</span><span>IRON MAN RP <b>0.1.0 PRE-ALPHA</b></span><span>СИСТЕМА ЗАЩИЩЕНА <i className="system-dot"/></span></footer>
  </main>
}