import { useState } from 'react'
import {
  ArrowLeft, ArrowRight, CalendarDays, MapPin, Plus, Search,
  Plane, Wallet, Clock3, MoreHorizontal, Pencil, Trash2,
  X, Check, Compass, Luggage, Sparkles, Map, ChevronDown
} from 'lucide-react'
import './App.css'

const starterTrips = [
  {
    id: 'sample-1', title: '北海道冬日小旅行', destination: '日本・北海道',
    start: '2027-01-02', end: '2027-01-08', budget: 40000, cover: 'hokkaido',
    note: '滑雪、逛街與冬日美食，留一點時間給沿途風景。',
    days: [
      { id: 'd1', date: '2027-01-02', items: [{ id: 'a1', time: '10:00', title: '抵達新千歲機場', place: '北海道', note: '領取交通票券、前往市區' }] },
      { id: 'd2', date: '2027-01-03', items: [{ id: 'a2', time: '09:30', title: '札幌市區散步', place: '札幌', note: '大通公園、時計台' }] }
    ]
  },
  {
    id: 'sample-2', title: '台南慢活週末', destination: '台灣・台南',
    start: '2026-12-12', end: '2026-12-13', budget: 6000, cover: 'tainan',
    note: '巷弄美食、老屋咖啡與沒有行程壓力的週末。', days: []
  }
]

const dateText = (start, end) => {
  if (!start || !end) return '尚未設定日期'
  const fmt = (s) => new Date(s + 'T00:00:00').toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })
  return start === end ? fmt(start) : fmt(start) + ' — ' + fmt(end)
}
const dayCount = (start, end) => {
  if (!start || !end) return 0
  return Math.max(1, Math.round((new Date(end + 'T00:00:00') - new Date(start + 'T00:00:00')) / 86400000) + 1)
}
const money = (n) => new Intl.NumberFormat('zh-TW').format(Number(n) || 0)

function TripModal({ trip, onClose, onSave }) {
  const [form, setForm] = useState(trip || { title: '', destination: '', start: '', end: '', budget: '', note: '', days: [] })
  const update = (key, value) => setForm((old) => ({ ...old, [key]: value }))
  const submit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.destination.trim()) return
    onSave({ ...form, id: form.id || crypto.randomUUID(), budget: Number(form.budget) || 0 })
  }
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <form className="modal" onSubmit={submit}>
      <div className="modal-head"><div><span className="eyebrow">YOUR NEXT ADVENTURE</span><h2>{trip ? '編輯旅程' : '建立新旅程'}</h2></div><button type="button" className="icon-btn" onClick={onClose}><X size={20}/></button></div>
      <label>旅程名稱<input autoFocus required value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="例如：東京慢慢玩"/></label>
      <label>目的地<input required value={form.destination} onChange={(e) => update('destination', e.target.value)} placeholder="例如：日本・東京"/></label>
      <div className="form-grid">
        <label>出發日期<input type="date" value={form.start} onChange={(e) => update('start', e.target.value)}/></label>
        <label>回程日期<input type="date" min={form.start || undefined} value={form.end} onChange={(e) => update('end', e.target.value)}/></label>
      </div>
      <label>預算（NT$）<input type="number" min="0" value={form.budget} onChange={(e) => update('budget', e.target.value)} placeholder="例如：30000"/></label>
      <label>旅程備註<textarea rows="3" value={form.note || ''} onChange={(e) => update('note', e.target.value)} placeholder="想去的地方、旅行主題或備忘事項…"/></label>
      <div className="modal-actions"><button type="button" className="btn btn-quiet" onClick={onClose}>取消</button><button className="btn btn-primary" type="submit"><Check size={17}/>儲存旅程</button></div>
    </form>
  </div>
}

function TripDetail({ trip, onBack, onEdit, onUpdate }) {
  const [dayIndex, setDayIndex] = useState(0)
  const [adding, setAdding] = useState(false)
  const [item, setItem] = useState({ time: '09:00', title: '', place: '', note: '' })
  const totalDays = dayCount(trip.start, trip.end) || 1
  const days = Array.from({ length: totalDays }, (_, i) => {
    const date = trip.start ? new Date(new Date(trip.start + 'T00:00:00').getTime() + i * 86400000).toISOString().slice(0, 10) : ''
    return trip.days?.find((d) => d.date === date) || { id: 'day-' + i, date, items: [] }
  })
  const current = days[dayIndex] || days[0]
  const changeDay = (nextDays) => onUpdate({ ...trip, days: nextDays })
  const addItem = (e) => {
    e.preventDefault()
    if (!item.title.trim()) return
    const next = days.map((d, i) => i === dayIndex ? { ...d, items: [...d.items, { ...item, id: crypto.randomUUID() }].sort((a,b) => a.time.localeCompare(b.time)) } : d)
    changeDay(next)
    setItem({ time: '09:00', title: '', place: '', note: '' }); setAdding(false)
  }
  const removeItem = (itemId) => changeDay(days.map((d, i) => i === dayIndex ? { ...d, items: d.items.filter((x) => x.id !== itemId) } : d))
  return <main className="detail-page">
    <button className="back-link" onClick={onBack}><ArrowLeft size={17}/>返回所有旅程</button>
    <div className={'detail-hero ' + (trip.cover || 'custom')}>
      <span className="eyebrow">TRIP JOURNAL</span><h1>{trip.title}</h1>
      <p><MapPin size={16}/>{trip.destination}<span>·</span><CalendarDays size={16}/>{dateText(trip.start, trip.end)}</p>
      <button className="btn btn-light" onClick={onEdit}><Pencil size={16}/>編輯旅程</button>
    </div>
    <div className="detail-summary">
      <div><span>旅程天數</span><strong>{totalDays} <small>天</small></strong></div>
      <div><span>預計預算</span><strong>NT$ {money(trip.budget)}</strong></div>
      <div><span>已安排活動</span><strong>{days.reduce((n,d) => n + d.items.length, 0)} <small>項</small></strong></div>
    </div>
    <section className="itinerary-section">
      <div className="section-heading"><div><span className="eyebrow">MAKE EVERY DAY COUNT</span><h2>每日行程</h2></div><button className="btn btn-primary" onClick={() => setAdding(true)}><Plus size={17}/>新增活動</button></div>
      <div className="day-tabs">{days.map((d,i) => <button className={i === dayIndex ? 'active' : ''} key={d.id} onClick={() => setDayIndex(i)}><small>DAY {String(i+1).padStart(2,'0')}</small><strong>{d.date ? new Date(d.date + 'T00:00:00').toLocaleDateString('zh-TW',{month:'numeric',day:'numeric'}) : '未定'}</strong></button>)}</div>
      {adding && <form className="activity-form" onSubmit={addItem}><div className="activity-form-title"><strong>新增行程活動</strong><button type="button" className="icon-btn" onClick={() => setAdding(false)}><X size={18}/></button></div><div className="form-grid"><label>時間<input type="time" value={item.time} onChange={(e)=>setItem({...item,time:e.target.value})}/></label><label>活動名稱<input required value={item.title} onChange={(e)=>setItem({...item,title:e.target.value})} placeholder="例如：逛美術館"/></label></div><label>地點<input value={item.place} onChange={(e)=>setItem({...item,place:e.target.value})} placeholder="地點或地址"/></label><label>備註<input value={item.note} onChange={(e)=>setItem({...item,note:e.target.value})} placeholder="交通、門票或提醒"/></label><button className="btn btn-primary" type="submit"><Check size={16}/>加入行程</button></form>}
      <div className="timeline">{current?.items?.length ? current.items.map((x) => <article className="timeline-item" key={x.id}><div className="timeline-time">{x.time}</div><div className="timeline-dot"/><div className="timeline-card"><div><h3>{x.title}</h3>{x.place && <p><MapPin size={14}/>{x.place}</p>}{x.note && <span>{x.note}</span>}</div><button className="icon-btn delete-btn" onClick={()=>removeItem(x.id)} title="刪除活動"><Trash2 size={16}/></button></div></article>) : <div className="empty-day"><CalendarDays size={25}/><strong>這一天還沒有安排</strong><span>留一點空白也很好，或新增第一個活動。</span><button className="text-btn" onClick={()=>setAdding(true)}>＋ 安排今天的行程</button></div>}</div>
    </section>
    {trip.note && <section className="note-panel"><Sparkles size={18}/><div><strong>旅程備忘</strong><p>{trip.note}</p></div></section>}
  </main>
}

export default function App() {
  const [trips, setTrips] = useState(() => {
    try { const saved = localStorage.getItem('slow-travel-trips'); return saved ? JSON.parse(saved) : starterTrips }
    catch { return starterTrips }
  })
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(null)
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('all')
  const [menu, setMenu] = useState(null)
  const persist = (next) => { setTrips(next); localStorage.setItem('slow-travel-trips', JSON.stringify(next)) }
  const saveTrip = (trip) => { persist(trips.some((t)=>t.id===trip.id) ? trips.map((t)=>t.id===trip.id?trip:t) : [trip,...trips]); setModal(null); setSelected(trip.id) }
  const updateTrip = (trip) => { persist(trips.map((t)=>t.id===trip.id?trip:t)); setSelected(trip.id) }
  const deleteTrip = (id) => { if (window.confirm('確定要刪除這趟旅程嗎？')) { persist(trips.filter((t)=>t.id!==id)); setMenu(null) } }
  const filtered = trips.filter((t) => (tab==='all' || (tab==='planned' && t.start && new Date(t.start+'T23:59:59') >= new Date())) && (t.title+t.destination).toLowerCase().includes(query.toLowerCase()))
  const activeTrip = trips.find((t)=>t.id===selected)

  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#" onClick={(e)=>{e.preventDefault();setSelected(null)}}><span className="brand-mark"><Compass size={20}/></span><span>慢慢去旅行<small>TRAVEL, AT YOUR OWN PACE</small></span></a><div className="topbar-right"><span className="save-status"><span/>資料儲存於此裝置</span><button className="avatar">T</button></div></header>
    {activeTrip ? <TripDetail trip={activeTrip} onBack={()=>setSelected(null)} onEdit={()=>setModal(activeTrip)} onUpdate={updateTrip}/> :
      <main className="home">
        <section className="welcome"><div className="welcome-copy"><span className="eyebrow">A LITTLE ESCAPE, A LOT OF MEMORIES</span><h1>下一站，<em>去旅行。</em></h1><p>把想去的地方、想看的風景，慢慢整理成一趟專屬於你的旅程。</p><button className="btn btn-primary welcome-btn" onClick={()=>setModal({})}><Plus size={18}/>規劃一趟新旅行</button></div><div className="welcome-art"><div className="sun"/><div className="hill hill-back"/><div className="hill hill-front"/><div className="art-label"><Plane size={17}/> THE WORLD IS WAITING</div></div></section>
        <section className="stats"><div className="stat"><span className="stat-icon"><Luggage size={19}/></span><div><small>我的旅程</small><strong>{trips.length} <i>趟</i></strong></div></div><div className="stat"><span className="stat-icon"><Map size={19}/></span><div><small>探索目的地</small><strong>{new Set(trips.map(t=>t.destination)).size} <i>個</i></strong></div></div><div className="stat"><span className="stat-icon"><Wallet size={19}/></span><div><small>旅程總預算</small><strong>NT$ {money(trips.reduce((s,t)=>s+(Number(t.budget)||0),0))}</strong></div></div></section>
        <section className="trips-section"><div className="section-heading"><div><span className="eyebrow">YOUR COLLECTION</span><h2>我的旅行清單 <span>{trips.length}</span></h2></div><button className="btn btn-outline" onClick={()=>setModal({})}><Plus size={17}/>新增旅程</button></div>
          <div className="list-tools"><div className="tabs"><button className={tab==='all'?'active':''} onClick={()=>setTab('all')}>全部旅程</button><button className={tab==='planned'?'active':''} onClick={()=>setTab('planned')}>即將出發</button></div><label className="search"><Search size={17}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="搜尋旅程或目的地"/></label></div>
          {filtered.length ? <div className="trip-grid">{filtered.map((t) => <article className="trip-card" key={t.id}><button className={'trip-cover '+(t.cover||'custom')} onClick={()=>setSelected(t.id)} aria-label={'開啟'+t.title}><span className="cover-kicker">A JOURNEY TO</span><span className="cover-destination">{t.destination}</span><span className="cover-symbol">{t.cover==='tainan'?'☀':'✳'}</span></button><div className="trip-card-body"><div className="card-title-row"><button className="card-title" onClick={()=>setSelected(t.id)}>{t.title}</button><div className="menu-wrap"><button className="icon-btn" onClick={()=>setMenu(menu===t.id?null:t.id)}><MoreHorizontal size={20}/></button>{menu===t.id && <div className="dropdown"><button onClick={()=>{setModal(t);setMenu(null)}}><Pencil size={15}/>編輯</button><button className="danger" onClick={()=>deleteTrip(t.id)}><Trash2 size={15}/>刪除</button></div>}</div></div><p className="trip-date"><CalendarDays size={15}/>{dateText(t.start,t.end)}</p><div className="card-footer"><span><Clock3 size={14}/>{dayCount(t.start,t.end)||'—'} 天</span><span><Wallet size={14}/>NT$ {money(t.budget)}</span><button onClick={()=>setSelected(t.id)}>查看行程 <ArrowRight size={15}/></button></div></div></article>)}</div> : <div className="empty-list"><Compass size={30}/><strong>還沒有符合的旅程</strong><span>換個關鍵字，或建立一趟新旅行。</span></div>}
        </section>
        <footer>MADE FOR THE JOY OF GOING <span>✳</span> 慢慢規劃，慢慢出發。</footer>
      </main>}
    {modal && <TripModal trip={modal.id?modal:null} onClose={()=>setModal(null)} onSave={saveTrip}/>}
  </div>
}