import { useEffect, useRef, useState } from 'react'
import { Activity, AudioLines, BatteryCharging, Bot, Check, ChevronRight, CircleHelp, Cpu, Gauge, Headphones, Layers3, Mic, MicOff, Pause, Play, Power, Radio, RotateCcw, Settings2, Shield, Volume2, Wrench, X, Zap } from 'lucide-react'

type Phase = 'lab' | 'suiting' | 'helmet'
const steps = [
  { title: 'Подготовка платформы', detail: 'Проверка фиксаторов, сервоприводов и положения пилота', part: 'СИСТЕМА ДОСТУПА', time: '00:03' },
  { title: 'Нижние сегменты брони', detail: 'Механические захваты устанавливают и фиксируют элементы ног', part: 'LEG ASSEMBLY', time: '00:06' },
  { title: 'Защита рук и перчатки', detail: 'Секции предплечий и ладоней синхронизируются с приводами', part: 'ARM ASSEMBLY', time: '00:09' },
  { title: 'Нагрудная секция', detail: 'Передняя и задняя панели соединяются вокруг каркаса', part: 'TORSO LOCK', time: '00:12' },
  { title: 'Подключение реактора', detail: 'Энергетическое ядро синхронизируется с системами брони', part: 'ARC REACTOR', time: '00:15' },
  { title: 'Плечевые и шейные узлы', detail: 'Замыкаются верхние крепления и контуры защиты', part: 'UPPER FRAME', time: '00:18' },
  { title: 'Закрытие шлема', detail: 'Шлем фиксируется. Поднимаются оптические и сенсорные системы', part: 'HELMET SEAL', time: '00:21' },
  { title: 'Инициализация JARVIS', detail: 'Проверка каналов связи, интерфейса и телеметрии', part: 'SYSTEM ONLINE', time: '00:24' },
]

export default function App() {
  const [phase, setPhase] = useState<Phase>('lab')
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const [paused, setPaused] = useState(false)
  const [energy, setEnergy] = useState(98)
  const [jarvisMessage, setJarvisMessage] = useState('Добро пожаловать домой, сэр. Все системы лаборатории готовы.')
  const [listening, setListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [diagnostic, setDiagnostic] = useState(false)
  const recognition = useRef<any>(null)
  const progress = busy ? Math.round(((step + 1) / steps.length) * 100) : phase === 'helmet' ? 100 : 0

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
    setStep(0); setPaused(false); setBusy(true); setPhase('suiting')
    speak('Запускаю последовательность надевания Mark Three. Платформа активирована. Прошу сохранять неподвижность.')
  }
  const stopSuitUp = () => {
    setBusy(false); setPaused(false); setStep(0); setPhase('lab')
    speak('Процедура надевания остановлена. Все механизмы возвращены в безопасное положение.')
  }

  useEffect(() => {
    if (!busy || paused) return
    const timer = window.setTimeout(() => {
      if (step >= steps.length - 1) {
        setBusy(false); setPhase('helmet')
        speak('Mark Three активирована. JARVIS в сети. Добро пожаловать в броню, сэр.')
      } else {
        const next = step + 1
        setStep(next)
        if (next === 4) speak('Реактор подключён. Энергетический контур стабилен.')
        if (next === 6) speak('Закрываю шлем. Активирую оптические системы.')
      }
    }, 2600)
    return () => window.clearTimeout(timer)
  }, [busy, paused, step])

  const command = (raw: string) => {
    const value = raw.toLowerCase()
    if (value.includes('диагност')) { setDiagnostic(true); speak('Диагностика завершена. Все системы работают в штатном режиме.'); return }
    if (value.includes('энерг') || value.includes('реактор')) { speak(`Уровень энергии ${energy} процентов. Реактор функционирует стабильно.`); return }
    if (value.includes('лаборатор') || value.includes('снять')) { setPhase('lab'); setBusy(false); speak('Возвращаю интерфейс лаборатории.'); return }
    if (value.includes('шлем') || value.includes('hud')) { setPhase('helmet'); speak('Интерфейс шлема активирован.'); return }
    if (value.includes('надеть') || value.includes('костюм')) { runSuitUp(); return }
    speak('Команда не распознана. Могу провести диагностику, проверить реактор, открыть HUD или начать надевание брони.')
  }
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) { speak('Распознавание речи не поддерживается этим браузером. Используйте Chrome.'); return }
    const rec = new SpeechRecognition()
    rec.lang = 'ru-RU'; rec.interimResults = false; rec.maxAlternatives = 1
    rec.onresult = (event: any) => command(event.results[0][0].transcript)
    rec.onerror = () => { setListening(false); speak('Не удалось распознать команду. Попробуйте ещё раз.') }
    rec.onend = () => setListening(false)
    recognition.current = rec; setListening(true); rec.start()
  }
  useEffect(() => () => { window.speechSynthesis?.cancel(); recognition.current?.stop?.() }, [])

  return <main className={phase === 'helmet' ? 'app helmet-mode' : 'app'}>
    <div className="ambient-grid"/><div className="scanlines"/>
    <header className="topbar">
      <div className="brand"><div className="brand-mark"><Zap size={19}/></div><div><b>STARK <em>INDUSTRIES</em></b><span>ADVANCED SYSTEMS DIVISION</span></div></div>
      <div className="top-center"><i className="live-dot"/> SECURE CONNECTION <span className="top-separator"/> MALIBU FACILITY <span className="build-tag">MK III / 0.2</span></div>
      <div className="top-right"><span>ПРОТОКОЛ: STARK-01</span><div className="avatar">TS</div></div>
    </header>

    <section className="workspace">
      <aside className="sidebar">
        <div className="side-label">РАБОЧАЯ СРЕДА</div>
        <button className={phase === 'lab' ? 'nav-item active' : 'nav-item'} onClick={() => {setPhase('lab');speak('Лаборатория открыта.')}}><Cpu size={17}/> Лаборатория</button>
        <button className="nav-item" onClick={() => speak('В базе данных доступен прототип Mark Three.')}><Shield size={17}/> База брони <span className="nav-count">01</span></button>
        <button className="nav-item" onClick={() => {setDiagnostic(true);speak('Диагностический модуль запущен. Все показатели в норме.')}}><Activity size={17}/> Диагностика</button>
        <button className={phase === 'helmet' ? 'nav-item active' : 'nav-item'} onClick={() => {setPhase('helmet');speak('Интерфейс шлема активирован.')}}><Gauge size={17}/> Интерфейс шлема</button>
        <div className="side-divider"/>
        <div className="side-label">СОСТОЯНИЕ СИСТЕМ</div>
        <div className="system-line"><span className="system-dot"/> JARVIS <small>АКТИВЕН</small></div>
        <div className="system-line"><span className="system-dot"/> ARC REACTOR <small>СТАБИЛЕН</small></div>
        <div className="system-line"><span className="system-dot amber"/> FLIGHT CONTROL <small>ОЖИДАНИЕ</small></div>
        <div className="system-line"><span className="system-dot"/> ARMOR LOCK <small>{phase === 'helmet' ? 'ЗАКРЫТ' : 'ОТКРЫТ'}</small></div>
        <div className="sidebar-bottom"><div className="profile"><div className="profile-icon">TS</div><div><b>TONY STARK</b><span>ВЛАДЕЛЕЦ СИСТЕМЫ</span></div><Settings2 size={15}/></div></div>
      </aside>

      <div className="main-content">
        <div className="page-heading"><div><div className="eyebrow">ПЕРСОНАЛЬНАЯ ЛАБОРАТОРИЯ <span>/</span> МАЛИБУ, КАЛИФОРНИЯ</div><h1>{phase === 'helmet' ? 'HELMET INTERFACE' : phase === 'suiting' ? 'ARMOR DEPLOYMENT' : 'Добро пожаловать, Тони.'}</h1><p>{phase === 'helmet' ? 'Тактическая система отображения Mark III' : phase === 'suiting' ? 'Автоматизированная процедура оснащения пилота' : 'Контроль брони, инженерных систем и персонального ассистента.'}</p></div><div className="facility-status"><span>ОБЪЕКТ</span><b><i className="live-dot"/> MALIBU / ONLINE</b></div></div>

        {phase === 'lab' && <div className="lab-layout">
          <section className="armor-panel">
            <div className="panel-top"><div><span className="panel-kicker">ARMOR BAY / 001</span><b>АКТИВНЫЙ ЭКЗЕМПЛЯР</b></div><span className="status-pill"><i/> ГОТОВ К ОСНАЩЕНИЮ</span></div>
            <div className="armor-stage">
              <div className="stage-coordinate">X 034.82 / Y 019.44<br/>BAY 01 // DISPLAY MODE</div>
              <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/>
              <div className="scan-beam"/>
              <div className="armor-glow"/>
              <div className="armor-figure">
                <div className="armor-head"><div className="helmet-brow"/><div className="eye eye-left"/><div className="eye eye-right"/><div className="helmet-mouth"/></div>
                <div className="armor-neck"/>
                <div className="armor-body"><div className="arc-core"><i/></div><div className="chest-line"/><div className="chest-plate"/></div>
                <div className="armor-arm left-arm"><i/><b/></div><div className="armor-arm right-arm"><i/><b/></div>
                <div className="armor-leg left-leg"><i/></div><div className="armor-leg right-leg"><i/></div>
                <div className="armor-foot left-foot"/><div className="armor-foot right-foot"/>
              </div>
              <div className="stage-callout callout-left"><i/> MARK III <span>PLATING</span></div><div className="stage-callout callout-right"><i/> ARC CORE <span>REACTOR</span></div>
              <div className="stage-caption">MARK III <span>—</span> GOLD / TITANIUM ALLOY</div>
            </div>
            <div className="armor-info"><div><span>МОДЕЛЬ</span><b>MARK III</b></div><div><span>КЛАСС</span><b>ПОЛЕВАЯ БРОНЯ</b></div><div><span>СОСТОЯНИЕ</span><b className="green">100% · НОРМА</b></div></div>
            <button className="primary-btn" onClick={runSuitUp} disabled={busy}><Power size={17}/> НАЧАТЬ ПРОЦЕДУРУ НАДЕВАНИЯ <ChevronRight size={17}/></button>
          </section>
          <div className="right-stack">
            <section className="jarvis-card">
              <div className="card-heading"><div className="jarvis-icon"><AudioLines size={20}/></div><div><b>J.A.R.V.I.S.</b><span>JUST A RATHER VERY INTELLIGENT SYSTEM</span></div><span className="online">● ONLINE</span></div>
              <div className="jarvis-visual"><div className="jarvis-orb"><AudioLines size={27}/></div><div className="waveform">{Array.from({length:38},(_,i)=><i key={i} style={{height:(7+(i*19%27))+'px'}}/>)}</div></div>
              <p className="jarvis-message">“{jarvisMessage}”</p>
              <div className="jarvis-actions"><button onClick={startListening} className={listening?'listen-btn listening':'listen-btn'}>{listening?<MicOff size={16}/>:<Mic size={16}/>} {listening?'СЛУШАЮ ВАС...':'ГОВОРИТЬ С JARVIS'}</button><button className="icon-btn" onClick={()=>setVoiceEnabled(!voiceEnabled)} title="Голос JARVIS"><Volume2 size={17} opacity={voiceEnabled?1:.4}/></button></div>
              <div className="voice-hint">ПОПРОБУЙТЕ: «ПРОВЕДИ ДИАГНОСТИКУ»</div>
            </section>
            <section className="telemetry-card">
              <div className="card-title"><span>ТЕЛЕМЕТРИЯ БРОНИ</span><Activity size={16}/></div>
              <div className="metric"><div><span>ЭНЕРГИЯ РЕАКТОРА</span><b>{energy}%</b></div><div className="bar"><i style={{width:energy+'%'}}/></div></div>
              <div className="metric"><div><span>ЦЕЛОСТНОСТЬ БРОНИ</span><b>100%</b></div><div className="bar"><i style={{width:'100%'}}/></div></div>
              <div className="metric"><div><span>ТЕМПЕРАТУРА СИСТЕМ</span><b>32°C</b></div><div className="bar"><i style={{width:'32%'}}/></div></div>
              <div className="telemetry-foot"><span><i className="system-dot"/> ВСЕ ПОКАЗАТЕЛИ В НОРМЕ</span><button onClick={()=>{setDiagnostic(true);speak('Проверка завершена. Отклонений не обнаружено.')}}><Wrench size={13}/> ДИАГНОСТИКА</button></div>
            </section>
            <section className="quick-panel"><div><Layers3 size={16}/><span>ПРОТОКОЛ ОСНАЩЕНИЯ</span></div><b>8 ЭТАПОВ <small> / ~21 СЕК.</small></b><button onClick={runSuitUp}>ОТКРЫТЬ <ChevronRight size={14}/></button></section>
          </div>
        </div>}

        {phase === 'suiting' && <div className="sequence-layout">
          <section className="sequence-main">
            <div className="sequence-head"><div><div className="eyebrow">STARK AUTOMATED ARMOR SYSTEM</div><h2>Процедура надевания</h2><p>Не покидайте платформу до завершения последовательности.</p></div><div className="sequence-state"><i className={paused?'amber-dot':'live-dot'}/>{paused?'ПАУЗА':'ВЫПОЛНЯЕТСЯ'}</div></div>
            <div className="suit-animation">
              <div className="suit-rings"><i/><i/><i/></div><div className="suit-silhouette"><div className="sil-head"/><div className="sil-body"/><div className="sil-arm a"/><div className="sil-arm b"/><div className="sil-leg a"/><div className="sil-leg b"/><div className="sil-core"/></div>
              <div className="assembly-beam"/><div className="assembly-label">{steps[step].part}<span> / ASSEMBLY IN PROGRESS</span></div>
              <div className="assembly-side side-a">MECHANICAL<br/>LOCK <b>ENGAGED</b></div><div className="assembly-side side-b">SERVO<br/>CONTROL <b>ACTIVE</b></div>
            </div>
            <div className="current-step"><div className="step-number">{String(step+1).padStart(2,'0')} <span>/ 08</span></div><div><h3>{steps[step].title}</h3><p>{steps[step].detail}</p></div><div className="step-time"><span>ЭТАП</span><b>{steps[step].time}</b></div></div>
            <div className="progress-meta"><span>ОБЩИЙ ПРОГРЕСС</span><b>{progress}%</b></div><div className="progress-track"><i style={{width:progress+'%'}}/></div>
            <div className="sequence-controls"><button className="abort-btn" onClick={stopSuitUp}><X size={15}/> ПРЕРВАТЬ</button><button className="pause-btn" onClick={()=>setPaused(!paused)}>{paused?<Play size={15}/>:<Pause size={15}/>} {paused?'ПРОДОЛЖИТЬ':'ПАУЗА'}</button><button className="skip-btn" onClick={()=>{if(step===steps.length-1){setBusy(false);setPhase('helmet');speak('Броня активирована.')}else setStep(step+1)}}>СЛЕДУЮЩИЙ ЭТАП <ChevronRight size={15}/></button></div>
          </section>
          <aside className="sequence-aside"><div className="aside-title"><span>ПОСЛЕДОВАТЕЛЬНОСТЬ</span><span>01—08</span></div><div className="sequence-list">{steps.map((s,i)=><div className={i<step?'done':i===step?'current':''} key={s.title}><span className="list-number">{i<step?<Check size={14}/>:String(i+1).padStart(2,'0')}</span><div><b>{s.title}</b><small>{s.part}</small></div>{i===step&&<i className="loader"/>}</div>)}</div><div className="safety-note"><Shield size={17}/><div><b>ЗАЩИТНЫЙ ПРОТОКОЛ</b><span>Контроль фиксаторов и синхронизация приводов выполняются автоматически.</span></div></div></aside>
        </div>}

        {phase === 'helmet' && <div className="hud-screen"><div className="hud-top"><span>STARK HUD // MARK III</span><span>● SECURE LINK ESTABLISHED</span></div><div className="hud-reticle"><div className="reticle-circle"/><div className="reticle-cross horizontal"/><div className="reticle-cross vertical"/><span className="reticle-label">СИСТЕМА СКАНИРОВАНИЯ ГОТОВА</span></div><div className="hud-left"><div className="hud-box"><span>РЕАКТОР</span><b>{energy}%</b><small>НОРМА</small></div><div className="hud-box"><span>БРОНЯ</span><b>100%</b><small>БЕЗ ПОВРЕЖДЕНИЙ</small></div></div><div className="hud-right"><div className="hud-box"><span>ВЫСОТА</span><b>000 м</b><small>НА ЗЕМЛЕ</small></div><div className="hud-box"><span>СКОРОСТЬ</span><b>0 км/ч</b><small>НЕПОДВИЖЕН</small></div></div><div className="hud-bottom"><span>ПИЛОТ: T. STARK</span><span>MARK III / СИСТЕМЫ АКТИВНЫ</span><button onClick={()=>{setPhase('lab');speak('Возвращаюсь в лабораторию, сэр.')}}>В ЛАБОРАТОРИЮ</button></div><div className="hud-jarvis">JARVIS: {jarvisMessage}</div></div>}
      </div>
    </section>
    <footer className="footer"><span>STARK INDUSTRIES © // INTERNAL SYSTEM</span><span>IRON MAN RP <b>0.2.0 PRE-ALPHA</b></span><span>ENCRYPTION ACTIVE <i className="system-dot"/></span></footer>
    {diagnostic && <div className="modal-backdrop" onClick={()=>setDiagnostic(false)}><section className="diagnostic-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setDiagnostic(false)}><X size={18}/></button><div className="jarvis-icon"><Activity size={20}/></div><div className="eyebrow">STARK SYSTEMS / REPORT 001</div><h2>Диагностика завершена</h2><p>Проверка основных подсистем Mark III выполнена. Критических отклонений не обнаружено.</p>{['ARC REACTOR','ARMOR INTEGRITY','SERVO MOTORS','JARVIS LINK'].map(x=><div className="diagnostic-row" key={x}><span>{x}</span><b><i className="system-dot"/> НОРМА</b></div>)}<button className="primary-btn" onClick={()=>setDiagnostic(false)}>ЗАКРЫТЬ ОТЧЁТ <Check size={16}/></button></section></div>}
  </main>
}
