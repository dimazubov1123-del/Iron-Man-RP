import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Activity, AudioLines, ChevronRight, Mic, Pause, Play, Power, RotateCcw, Shield, Volume2, X, Zap } from 'lucide-react'

type SceneProps={stage:number}
function ArmorScene({stage}:SceneProps){
 const host=useRef<HTMLDivElement>(null), stageRef=useRef(stage)
 useEffect(()=>{stageRef.current=stage},[stage])
 useEffect(()=>{
  const el=host.current;if(!el)return
  const scene=new THREE.Scene();scene.background=new THREE.Color('#080d13');scene.fog=new THREE.FogExp2('#080d13',.027)
  const camera=new THREE.PerspectiveCamera(36,el.clientWidth/el.clientHeight,.1,100);camera.position.set(5.7,3.6,9.4)
  const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(el.clientWidth,el.clientHeight);renderer.shadowMap.enabled=true;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;el.appendChild(renderer.domElement)
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(0,2.25,0);controls.minDistance=5;controls.maxDistance=14;controls.maxPolarAngle=1.48;controls.enablePan=false
  scene.add(new THREE.HemisphereLight(0xaac7dd,0x21130d,1.5))
  const spot=new THREE.SpotLight(0xffd6a0,190,24,.55,.55);spot.position.set(4,9,5);spot.castShadow=true;scene.add(spot)
  const blue=new THREE.PointLight(0x3dc5e9,80,13);blue.position.set(-4,3,3);scene.add(blue)
  const redLight=new THREE.PointLight(0xff5835,65,12);redLight.position.set(1,4,-4);scene.add(redLight)
  const mat=(color:number,metalness=.8,roughness=.24,emissive=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness,emissive,emissiveIntensity:emissive?2.5:0})
  const red=mat(0x8e241d),red2=mat(0xb93a2b),gold=mat(0xc58b3c,.88,.2),dark=mat(0x1a2026,.7,.32),cyan=mat(0x8af7ff,.25,.13,0x19c9ed)
  const floorMat=mat(0x111a22,.55,.5)
  const armor=new THREE.Group();scene.add(armor)
  const mesh=(g:THREE.BufferGeometry,m:THREE.Material,p:THREE.Object3D,x:number,y:number,z:number,sx=1,sy=1,sz=1)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;p.add(o);return o}
  const ball=(p:THREE.Group,m:THREE.Material,x:number,y:number,z:number,sx:number,sy:number,sz:number)=>mesh(new THREE.SphereGeometry(1,32,24),m,p,x,y,z,sx,sy,sz)
  const box=(p:THREE.Group,m:THREE.Material,x:number,y:number,z:number,sx:number,sy:number,sz:number)=>mesh(new THREE.BoxGeometry(sx,sy,sz),m,p,x,y,z)
  const cyl=(p:THREE.Group,m:THREE.Material,x:number,y:number,z:number,r1:number,r2:number,h:number)=>mesh(new THREE.CylinderGeometry(r1,r2,h,32),m,p,x,y,z)
  const part=(home:[number,number,number],away:[number,number,number],threshold:number)=>{const g=new THREE.Group();g.position.set(...away);g.userData={home:new THREE.Vector3(...home),away:new THREE.Vector3(...away),threshold};armor.add(g);return g}
  const legs=part([0,1,0],[0,1,-2.5],1)
  for(const side of [-1,1]){const x=side*.42;ball(legs,red,x,1.43,0,.3,.39,.31);cyl(legs,red2,x,.94,0,.25,.3,.82);ball(legs,gold,x,.48,.03,.25,.22,.29);box(legs,red,x,.19,.12,.43,.22,.63);box(legs,gold,x,.075,.2,.37,.07,.4);box(legs,dark,x,1.28,.2,.33,.12,.15)}
  const torso=part([0,2.55,0],[0,2.55,-2.5],3)
  ball(torso,red,0,2.68,0,.77,.86,.42);ball(torso,gold,0,3.18,0,.64,.2,.36);box(torso,red2,0,2.25,.18,1.12,.42,.5);box(torso,gold,0,2.34,.43,1.12,.1,.08);ball(torso,dark,0,3.42,0,.36,.16,.3);ball(torso,cyan,0,2.72,.405,.19,.19,.075)
  for(let i=0;i<3;i++)box(torso,gold,-.38,2.42+i*.13,.36,.13,.035,.04)
  const arms=part([0,2.55,0],[0,2.55,-2.7],2)
  for(const side of [-1,1]){const x=side*.96;ball(arms,gold,x,3.1,0,.35,.35,.35);cyl(arms,red,x*1.07,2.65,0,.23,.31,.72);ball(arms,gold,x*1.07,2.25,.02,.24,.2,.25);cyl(arms,red2,x*1.12,1.83,.04,.2,.25,.65);ball(arms,dark,x*1.12,1.48,.08,.23,.2,.25);ball(arms,cyan,x*1.12,1.49,.29,.08,.08,.04);box(arms,gold,x,2.75,.23,.22,.2,.1)}
  const shoulders=part([0,3.12,0],[0,3.12,-2.2],4)
  for(const side of [-1,1]){ball(shoulders,red2,side*.96,3.12,0,.38,.3,.36);ball(shoulders,gold,side*.99,3.12,.17,.27,.19,.24)}
  const helmet=part([0,3.94,0],[0,5.55,0],6)
  ball(helmet,gold,0,3.97,0,.39,.48,.35);ball(helmet,red2,0,4.02,.12,.34,.39,.31);ball(helmet,gold,0,3.86,.32,.28,.22,.12)
  box(helmet,dark,0,3.99,.427,.28,.07,.035)
  for(const side of [-1,1]){const eye=box(helmet,cyan,side*.13,3.99,.43,.16,.035,.025);eye.rotation.z=side*.13;ball(helmet,red,side*.34,4.01,0,.08,.16,.13)}
  box(helmet,red,0,3.75,.34,.16,.07,.06)

  const platform=new THREE.Group();scene.add(platform);cyl(platform,dark,0,-.1,0,2.25,2.35,.2);const ring=new THREE.Mesh(new THREE.TorusGeometry(2.12,.035,12,100),gold);ring.rotation.x=Math.PI/2;ring.position.y=.02;platform.add(ring);const ring2=new THREE.Mesh(new THREE.TorusGeometry(1.7,.014,8,100),cyan);ring2.rotation.x=Math.PI/2;ring2.position.y=.03;platform.add(ring2)
  mesh(new THREE.PlaneGeometry(100,100),floorMat,scene,0,-.22,0,1,1,1).rotation.x=-Math.PI/2
  const grid=new THREE.GridHelper(80,80,0x315267,0x1b2e3b);grid.position.y=-.215;scene.add(grid)
  for(let i=0;i<12;i++){const a=i*Math.PI/6,x=Math.cos(a)*4.5,z=Math.sin(a)*4.5;cyl(scene,dark,x,2.5,z,.045,.055,5);box(scene,cyan,x,2.6,z,.07,3.7,.07)}
  const dust=new THREE.BufferGeometry(),positions=new Float32Array(240*3);for(let i=0;i<240;i++){positions[i*3]=(Math.random()-.5)*12;positions[i*3+1]=Math.random()*7;positions[i*3+2]=(Math.random()-.5)*9}dust.setAttribute('position',new THREE.BufferAttribute(positions,3));const points=new THREE.Points(dust,new THREE.PointsMaterial({color:0x7acde0,size:.018,transparent:true,opacity:.6}));scene.add(points)
  let raf=0
  const animate=()=>{raf=requestAnimationFrame(animate);const s=stageRef.current;armor.children.forEach(g=>{const d=g.userData;const target=s===0||s>=d.threshold?d.home:d.away;g.position.lerp(target,.055)});const core=torso.children.find(o=>o instanceof THREE.Mesh && o.material===cyan) as THREE.Mesh|undefined;if(core){const pulse=1+Math.sin(performance.now()*.003)*.08;core.scale.set(.19*pulse,.19*pulse,.075)};points.rotation.y+=.00015;controls.update();renderer.render(scene,camera)}
  animate()
  const resize=()=>{if(!el)return;camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight)};const observer=new ResizeObserver(resize);observer.observe(el)
  return()=>{cancelAnimationFrame(raf);observer.disconnect();controls.dispose();renderer.dispose();el.removeChild(renderer.domElement);scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Points){o.geometry.dispose();const m=o.material;if(Array.isArray(m))m.forEach(x=>x.dispose());else m.dispose()}})}
 },[])
 return <div className="three-host" ref={host}><div className="scene-tip">ПЕРЕТАСКИВАЙТЕ ДЛЯ ОБЗОРА <span>•</span> КОЛЁСИКО — ПРИБЛИЖЕНИЕ</div></div>
}

const stages=[['Подготовка платформы','Проверка фиксаторов и подготовка сервоприводов','BAY INITIALIZATION'],['Броня ног','Нижние сегменты устанавливаются и фиксируются','LEG ASSEMBLY'],['Перчатки и предплечья','Манипуляторы устанавливают защиту рук','ARM ASSEMBLY'],['Нагрудная секция','Замыкание корпуса и установка энергетического ядра','TORSO LOCK'],['Плечевые модули','Фиксация верхних сегментов брони','SHOULDER LOCK'],['Калибровка приводов','Синхронизация сервоприводов и систем управления','SERVO CALIBRATION'],['Закрытие шлема','Шлем устанавливается. Оптика выходит в рабочий режим','HELMET SEAL'],['Запуск JARVIS','Проверка интерфейса и телеметрии','SYSTEM ONLINE']]
export default function App(){
 const [mode,setMode]=useState<'lab'|'suit'|'hud'>('lab'),[step,setStep]=useState(0),[paused,setPaused]=useState(false),[message,setMessage]=useState('Добро пожаловать домой, сэр. Mark III ожидает вашего распоряжения.'),[voice,setVoice]=useState(true),[listening,setListening]=useState(false),[energy]=useState(98)
 const rec=useRef<any>(null)
 const say=(s:string)=>{setMessage(s);if(voice&&'speechSynthesis'in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.lang='ru-RU';u.rate=.94;u.pitch=.82;speechSynthesis.speak(u)}}
 const start=()=>{setMode('suit');setStep(0);setPaused(false);say('Запускаю протокол надевания Mark Three. Платформа активирована.')}
 const stop=()=>{setMode('lab');setStep(0);setPaused(false);say('Процедура прервана. Броня возвращена в исходное положение.')}
 useEffect(()=>{if(mode!=='suit'||paused)return;const t=window.setTimeout(()=>{if(step===stages.length-1){setMode('hud');say('Броня Mark Three активирована. JARVIS в сети. Добро пожаловать, сэр.')}else{setStep(v=>v+1);if(step===3)say('Реактор подключён. Энергетический контур стабилен.');else say(stages[step+1][0]+'. '+stages[step+1][1])}},2800);return()=>clearTimeout(t)},[mode,paused,step])
 const listen=()=>{const SR=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition;if(!SR){say('Распознавание речи недоступно в этом браузере.');return}const r=new SR();r.lang='ru-RU';r.onresult=(e:any)=>{const q=e.results[0][0].transcript.toLowerCase();if(q.includes('надеть'))start();else if(q.includes('диагност'))say('Диагностика завершена. Все системы в норме.');else if(q.includes('шлем'))setMode('hud');else if(q.includes('лаборатор'))setMode('lab');else say('Команда не распознана, сэр.')} ;r.onend=()=>setListening(false);setListening(true);rec.current=r;r.start()}
 useEffect(()=>()=>{speechSynthesis?.cancel();rec.current?.stop?.()},[])
 return <main className="cinema-app">
  <ArmorScene stage={mode==='lab'?99:mode==='hud'?99:step+1}/>
  <div className="vignette"/>
  <header className="cinema-top"><div className="stark-brand"><span className="brand-reactor"><Zap size={18}/></span><div><b>STARK <i>INDUSTRIES</i></b><small>ADVANCED SYSTEMS DIVISION</small></div></div><div className="facility"><span className="online-dot"/> MALIBU FACILITY <span className="facility-divider"/> ARMOR BAY 01</div><div className="top-actions"><span>MARK III</span><span className="secure">SECURE LINK</span></div></header>
  <div className="scene-heading"><div className="eyebrow">PERSONAL ARMOR SYSTEM / CALIFORNIA</div><h1>{mode==='lab'?'MARK III':mode==='suit'?'ARMOR DEPLOYMENT':'HELMET INTERFACE'}</h1><p>{mode==='lab'?'Экспериментальная броня. Система готова к запуску.':mode==='suit'?'Автоматическая последовательность оснащения пилота':'Тактическая система отображения активна'}</p></div>
  {mode==='lab'&&<><div className="left-readout"><div className="readout-label">ARMOR STATUS</div><b>STANDBY</b><span>Модель <strong>MARK III</strong></span><span>Сплав <strong>Au / Ti</strong></span><span>Состояние <strong className="good">100%</strong></span><div className="readout-line"/></div><div className="right-readout"><div className="readout-label">REACTOR OUTPUT</div><b>{energy}<small>%</small></b><div className="energy-bar"><i/></div><span>ARC REACTOR <strong>STABLE</strong></span><span>CORE TEMP <strong>32°C</strong></span><span>JARVIS LINK <strong className="good">ONLINE</strong></span></div><div className="bottom-center"><div className="jarvis-strip"><div className="jarvis-orb"><AudioLines size={20}/></div><div className="jarvis-copy"><b>J.A.R.V.I.S.</b><span>{message}</span></div><button className="voice-button" onClick={listen}><Mic size={16}/>{listening?'СЛУШАЮ':'ГОВОРИТЬ'}</button><button className="sound-button" onClick={()=>setVoice(!voice)}><Volume2 size={16}/></button></div><button className="deploy-button" onClick={start}><Power size={18}/> НАЧАТЬ НАДЕВАНИЕ <ChevronRight size={18}/></button></div></>}
  {mode==='suit'&&<><div className="assembly-panel"><div className="assembly-overline">AUTOMATED SUIT-UP SEQUENCE <span>{String(step+1).padStart(2,'0')} / 08</span></div><h2>{stages[step][0]}</h2><p>{stages[step][1]}</p><div className="assembly-track"><i style={{width:((step+1)/8*100)+'%'}}/></div><div className="assembly-meta"><span>{stages[step][2]}</span><b>{Math.round((step+1)/8*100)}%</b></div><div className="assembly-buttons"><button onClick={stop}><X size={15}/> ПРЕРВАТЬ</button><button onClick={()=>setPaused(!paused)}>{paused?<Play size={15}/>:<Pause size={15}/>} {paused?'ПРОДОЛЖИТЬ':'ПАУЗА'}</button><button onClick={()=>{if(step===7){setMode('hud');say('Броня активирована.')}else setStep(s=>s+1)}}>ДАЛЕЕ <ChevronRight size={15}/></button></div></div><div className="sequence-status"><Shield size={16}/> {paused?'ПРОЦЕДУРА ПРИОСТАНОВЛЕНА':'СИСТЕМЫ СБОРКИ АКТИВНЫ'}<span>{paused?'PAUSED':'IN PROGRESS'}</span></div></>}
  {mode==='hud'&&<div className="hud-overlay"><div className="hud-left"><b>РЕАКТОР <strong>{energy}%</strong></b><b>ЦЕЛОСТНОСТЬ <strong>100%</strong></b><b>ТЕМПЕРАТУРА <strong>32°C</strong></b></div><div className="hud-reticle"><i/><span>SCANNING SYSTEM ONLINE</span></div><div className="hud-right"><b>ВЫСОТА <strong>000 м</strong></b><b>СКОРОСТЬ <strong>0 км/ч</strong></b><b>ПОЛЁТ <strong>STANDBY</strong></b></div><div className="hud-bottom"><span>JARVIS: {message}</span><button onClick={()=>setMode('lab')}>ВЕРНУТЬСЯ В ЛАБОРАТОРИЮ</button></div></div>}
  <footer className="cinema-footer"><span>STARK INDUSTRIES <i>©</i> INTERNAL SYSTEM</span><span>IRON MAN RP / PRE-ALPHA 0.3</span><span><i className="online-dot"/> ALL SYSTEMS NOMINAL</span></footer>
 </main>
}
