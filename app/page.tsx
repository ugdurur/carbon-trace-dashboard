"use client"

import React, { useState, useEffect } from 'react'

export default function CarbonDashboard() {
  const [totalCo2, setTotalCo2] = useState(0)
  const [greenRate, setGreenRate] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const API_URL = "https://localhost:7270/api" // Kendi API portunu kontrol et (Örn: 7270 veya 5001)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // MAUI'de giriş yaptığın token'ı tarayıcıda LocalStorage'a manuel attığını varsayıyoruz
        const token = localStorage.getItem('auth_token')
        
        if (!token) {
          setError("Lütfen giriş yapın (Token bulunamadı).")
          setLoading(false)
          return
        }

        const response = await fetch(`${API_URL}/Calculations`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) throw new Error("Veri çekilemedi. CORS veya Token hatası.")

        const data = await response.json()
        const total = data.reduce((acc: number, item: any) => acc + item.totalCo2, 0)
        setTotalCo2(total)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const currentTax = (totalCo2 / 1000) * 85
  const savings = currentTax * (greenRate / 100)

  if (loading) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-[#38BDF8] text-xl font-bold italic tracking-tighter">FRANKFURT VERI HATTI BAĞLANIYOR...</div>
  
  if (error) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-red-500 p-10 text-center">Hata: {error} <br/> API'nin çalıştığından ve CORS izinlerinin Program.cs'de olduğundan emin olun.</div>

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-200 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1E293B] border-r border-slate-700 p-6 flex flex-col gap-8">
        <div className="text-2xl font-bold text-[#38BDF8] tracking-widest">CARBON TRACE</div>
        <nav className="flex flex-col gap-4">
          <div className="p-3 bg-[#334155] rounded-lg text-white font-semibold">📊 Dashboard</div>
          <div className="p-3 hover:bg-[#334155] rounded-lg cursor-pointer transition">📄 Raporlar</div>
          <div className="p-3 hover:bg-[#334155] rounded-lg cursor-pointer transition">⚙️ Ayarlar</div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        <header className="mb-10 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">Kurumsal Analitik Paneli</h1>
          <div className="text-sm text-slate-400">Durum: <span className="text-[#22C55E] font-bold">● CANLI VERİ</span></div>
        </header>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700 shadow-xl">
            <p className="text-slate-400 text-sm mb-2 uppercase tracking-tighter font-bold">Toplam Emisyon</p>
            <h2 className="text-3xl font-bold text-white">{totalCo2.toLocaleString()} <span className="text-sm font-normal text-slate-500">kg CO2</span></h2>
          </div>
          <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700 shadow-xl">
            <p className="text-slate-400 text-sm mb-2 uppercase tracking-tighter font-bold">Tahmini Vergi Yükü</p>
            <h2 className="text-3xl font-bold text-amber-500">€ {currentTax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
          </div>
          <div className="bg-[#1E293B] p-6 rounded-2xl border border-green-900/30 shadow-xl">
            <p className="text-slate-400 text-sm mb-2 uppercase tracking-tighter font-bold">Potansiyel Tasarruf</p>
            <h2 className="text-3xl font-bold text-[#22C55E]">€ {savings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
          </div>
        </div>

        {/* SIMULATOR */}
        <div className="bg-[#1E293B] p-8 rounded-2xl border border-[#38BDF8]/20 shadow-2xl mb-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-[#38BDF8]">What-If: Yeşil Enerji Simülasyonu</h3>
            <span className="bg-[#38BDF8]/10 text-[#38BDF8] px-4 py-1 rounded-full text-sm font-bold">%{greenRate} Geçiş</span>
          </div>
          <input 
            type="range" min="0" max="100" value={greenRate} 
            onChange={(e) => setGreenRate(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#38BDF8] mb-6"
          />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-[#0F172A] rounded-xl border border-slate-800 text-slate-400">
              Mevcut Yük: <span className="text-white font-bold ml-2">€ {currentTax.toLocaleString()}</span>
            </div>
            <div className="p-4 bg-[#0F172A] rounded-xl border border-slate-800 text-slate-400">
              Yeni Durum: <span className="text-white font-bold ml-2">€ {(currentTax - savings).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button className="w-full py-4 bg-transparent border-2 border-[#38BDF8] text-[#38BDF8] font-bold rounded-xl hover:bg-[#38BDF8] hover:text-[#0F172A] transition-all duration-300">
            RESMİ ANALİZ RAPORUNU İNDİR (PDF)
        </button>
      </main>
    </div>
  )
}"use client"

import React, { useState, useEffect } from 'react'

export default function CarbonDashboard() {
  const [totalCo2, setTotalCo2] = useState(0)
  const [greenRate, setGreenRate] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const API_URL = "https://localhost:7270/api" // Kendi API portunu kontrol et (Örn: 7270 veya 5001)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // MAUI'de giriş yaptığın token'ı tarayıcıda LocalStorage'a manuel attığını varsayıyoruz
        const token = localStorage.getItem('auth_token')
        
        if (!token) {
          setError("Lütfen giriş yapın (Token bulunamadı).")
          setLoading(false)
          return
        }

        const response = await fetch(`${API_URL}/Calculations`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) throw new Error("Veri çekilemedi. CORS veya Token hatası.")

        const data = await response.json()
        const total = data.reduce((acc: number, item: any) => acc + item.totalCo2, 0)
        setTotalCo2(total)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const currentTax = (totalCo2 / 1000) * 85
  const savings = currentTax * (greenRate / 100)

  if (loading) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-[#38BDF8] text-xl font-bold italic tracking-tighter">FRANKFURT VERI HATTI BAĞLANIYOR...</div>
  
  if (error) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-red-500 p-10 text-center">Hata: {error} <br/> API'nin çalıştığından ve CORS izinlerinin Program.cs'de olduğundan emin olun.</div>

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-200 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1E293B] border-r border-slate-700 p-6 flex flex-col gap-8">
        <div className="text-2xl font-bold text-[#38BDF8] tracking-widest">CARBON TRACE</div>
        <nav className="flex flex-col gap-4">
          <div className="p-3 bg-[#334155] rounded-lg text-white font-semibold">📊 Dashboard</div>
          <div className="p-3 hover:bg-[#334155] rounded-lg cursor-pointer transition">📄 Raporlar</div>
          <div className="p-3 hover:bg-[#334155] rounded-lg cursor-pointer transition">⚙️ Ayarlar</div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        <header className="mb-10 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">Kurumsal Analitik Paneli</h1>
          <div className="text-sm text-slate-400">Durum: <span className="text-[#22C55E] font-bold">● CANLI VERİ</span></div>
        </header>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700 shadow-xl">
            <p className="text-slate-400 text-sm mb-2 uppercase tracking-tighter font-bold">Toplam Emisyon</p>
            <h2 className="text-3xl font-bold text-white">{totalCo2.toLocaleString()} <span className="text-sm font-normal text-slate-500">kg CO2</span></h2>
          </div>
          <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700 shadow-xl">
            <p className="text-slate-400 text-sm mb-2 uppercase tracking-tighter font-bold">Tahmini Vergi Yükü</p>
            <h2 className="text-3xl font-bold text-amber-500">€ {currentTax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
          </div>
          <div className="bg-[#1E293B] p-6 rounded-2xl border border-green-900/30 shadow-xl">
            <p className="text-slate-400 text-sm mb-2 uppercase tracking-tighter font-bold">Potansiyel Tasarruf</p>
            <h2 className="text-3xl font-bold text-[#22C55E]">€ {savings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
          </div>
        </div>

        {/* SIMULATOR */}
        <div className="bg-[#1E293B] p-8 rounded-2xl border border-[#38BDF8]/20 shadow-2xl mb-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-[#38BDF8]">What-If: Yeşil Enerji Simülasyonu</h3>
            <span className="bg-[#38BDF8]/10 text-[#38BDF8] px-4 py-1 rounded-full text-sm font-bold">%{greenRate} Geçiş</span>
          </div>
          <input 
            type="range" min="0" max="100" value={greenRate} 
            onChange={(e) => setGreenRate(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#38BDF8] mb-6"
          />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-[#0F172A] rounded-xl border border-slate-800 text-slate-400">
              Mevcut Yük: <span className="text-white font-bold ml-2">€ {currentTax.toLocaleString()}</span>
            </div>
            <div className="p-4 bg-[#0F172A] rounded-xl border border-slate-800 text-slate-400">
              Yeni Durum: <span className="text-white font-bold ml-2">€ {(currentTax - savings).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button className="w-full py-4 bg-transparent border-2 border-[#38BDF8] text-[#38BDF8] font-bold rounded-xl hover:bg-[#38BDF8] hover:text-[#0F172A] transition-all duration-300">
            RESMİ ANALİZ RAPORUNU İNDİR (PDF)
        </button>
      </main>
    </div>
  )
}