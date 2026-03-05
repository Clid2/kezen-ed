"use client";

import { Inter } from "next/font/google";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

/* ─── Hooks ──────────────────────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCountUp(end: number, active: boolean, duration = 2000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.floor(ease * end));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(end);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, end, duration]);
  return val;
}

function useMouse() {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  useEffect(() => {
    const fn = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return pos;
}

/* ─── Reveal ─────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity:    visible ? 1 : 0,
      transform:  visible ? "translateY(0px)" : "translateY(30px)",
      transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M3 7.5h9M8.5 4l3.5 3.5L8.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const WaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.657 1.438 5.168L2 22l4.979-1.404A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
  </svg>
);

const FeatureIcons = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 4-8"/></svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4a2 2 0 01-2-2V5h4m14 4h2a2 2 0 002-2V5h-4M12 17v4M8 21h8M6 4h12v8a6 6 0 01-12 0V4z"/></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
];

/* ─── Data ───────────────────────────────────────────────────────────────── */
const NAV = [
  { href: "#platforms", label: "Платформы"   },
  { href: "#features",  label: "Возможности" },
  { href: "#stats",     label: "Статистика"  },
  { href: "#apply",     label: "Заявка"      },
];

const PLATFORMS = [
  { tag: "LMS",   title: "Управление обучением", desc: "Учебные материалы, задания, журнал оценок и общение с преподавателем в реальном времени.", href: "https://lms.kezened.kz",   popular: true  },
  { tag: "SAT",   title: "SAT Тестирование",     desc: "Практические тесты с мгновенной обратной связью и персональными ИИ-рекомендациями.",      href: "https://sat.kezened.kz",   popular: false },
  { tag: "IELTS", title: "IELTS Подготовка",     desc: "Listening, Reading, Writing, Speaking с детальной оценкой по критериям экзаменатора.",     href: "https://ielts.kezened.kz", popular: false },
];

const FEATURES = [
  { title: "Аналитика в реальном времени",  desc: "Детальная карта прогресса, статистика ошибок и еженедельный отчёт по каждому навыку."       },
  { title: "ИИ-обратная связь",              desc: "Персонализированные рекомендации после каждого теста — конкретные шаги, не общие советы."   },
  { title: "Таблицы лидеров",               desc: "Соревнуйтесь с другими студентами и отслеживайте своё место в рейтинге группы."              },
  { title: "Любое устройство",              desc: "Полноценная работа на компьютере, планшете и телефоне — без потери функциональности."        },
  { title: "Опытные преподаватели",         desc: "Специалисты по SAT и IELTS с опытом подготовки студентов к топовым университетам."           },
  { title: "Проверенные результаты",        desc: "1 500+ студентов достигли целевого балла. Гарантия повторного курса если цель не достигнута." },
];

const STATS_DATA = [
  { end: 1500,  suffix: "+", label: "Активных студентов" },
  { end: 150,   suffix: "+", label: "Учебных групп"      },
  { end: 10000, suffix: "+", label: "Пройденных тестов"  },
  { end: 95,    suffix: "%", label: "Успеха"             },
];

const MARQUEE_ITEMS = [
  "SAT 1550", "IELTS 8.5", "NYU", "University of Edinburgh",
  "Болашак", "SAT 1490", "IELTS 8.0", "Imperial College",
  "1500+ студентов", "SAT 1520", "IELTS 7.5", "KazNU",
];

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
function StatCard({ end, suffix, label, active, delay }: {
  end: number; suffix: string; label: string; active: boolean; delay: number;
}) {
  const v = useCountUp(end, active);
  const display = end >= 10000
    ? (v >= 10000 ? "10K" : Math.floor(v / 1000) + "K")
    : v;
  return (
    <Reveal delay={delay} className="py-14 px-8 text-center">
      <div className="text-[52px] md:text-[68px] font-extrabold leading-none tracking-tight tabular-nums"
        >
        <span className="text-white">{display}</span>
        <span className="text-blue-500">{suffix}</span>
      </div>
      <div className="mt-3 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.18em]">{label}</div>
    </Reveal>
  );
}

/* ─── Lead Form Section ──────────────────────────────────────────────────── */
function LeadSection() {
  const [form, setForm]     = useState({ name: "", contact: "", goal: "IELTS" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [focused, setFocused] = useState<string | null>(null);
  const { ref, visible } = useInView(0.1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const fields = [
    { key: "name",    label: "Имя",               placeholder: "Ваше имя",             type: "text" },
    { key: "contact", label: "Телефон / e-mail",   placeholder: "+7 (___) ___-__-__",  type: "text" },
  ] as const;

  return (
    <section id="apply" className="relative py-28 sm:py-36 border-t border-white/[0.05] overflow-hidden scroll-mt-16">
      {/* Animated background rings */}
      <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[0,1,2].map((i) => (
          <div key={i} className="absolute rounded-full border border-blue-500/[0.08]"
            style={{
              width:  `${420 + i * 200}px`,
              height: `${420 + i * 200}px`,
              animation: `ringPulse ${3 + i * 0.8}s ease-in-out ${i * 0.4}s infinite`,
            }} />
        ))}
        <div className="w-[600px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(29,78,216,0.16) 0%, transparent 68%)", filter: "blur(80px)" }} />
      </div>

      <style>{`
        @keyframes ringPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.04); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes successPop {
          0%   { opacity: 0; transform: scale(0.8); }
          60%  { transform: scale(1.06); }
          100% { opacity: 1; transform: scale(1); }
        }
        .form-visible { animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .success-pop  { animation: successPop 0.6s cubic-bezier(0.16,1,0.3,1) both; }

        .lead-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.12);
          color: white;
          width: 100%;
          padding: 10px 0;
          font-size: 15px;
          outline: none;
          transition: border-color 0.25s;
        }
        .lead-input::placeholder { color: rgba(255,255,255,0.2); }
        .lead-input:focus { border-bottom-color: #3b82f6; }
        .lead-input option { background: #0f1117; }

        .input-bar {
          position: absolute; bottom: 0; left: 0;
          height: 1px; width: 0; background: #3b82f6;
          transition: width 0.35s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 0 8px rgba(59,130,246,0.7);
        }
        .input-focused .input-bar { width: 100%; }
      `}</style>

      <div ref={ref} className="relative max-w-7xl mx-auto px-5 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div className={visible ? "form-visible" : "opacity-0"} style={{ animationDelay: "0ms" }}>
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500
              border border-blue-500/25 bg-blue-500/[0.08] px-3.5 py-1.5 rounded-full mb-7">
              Оставить заявку
            </span>
            <h2 className="text-[36px] sm:text-[52px] font-black tracking-tight leading-[1.04] text-white mb-5">
              Начни готовиться<br />
              <span className="text-blue-500">уже сейчас.</span>
            </h2>
            <p className="text-[16px] text-gray-400 leading-relaxed mb-8 max-w-sm">
              Бесплатная диагностика уровня, персональный план и первое занятие — без оплаты.
            </p>
            <ul className="space-y-3">
              {[
                "Диагностика за 24 часа",
                "Личный куратор с первого дня",
                "Гарантия результата или возврат",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[14px] text-gray-400">
                  <span className="shrink-0 h-5 w-5 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5l2 2L8 1" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form card */}
          <div className={visible ? "form-visible" : "opacity-0"} style={{ animationDelay: "150ms" }}>
            <div className="relative rounded-2xl p-8 sm:p-10"
              style={{
                background: "rgba(255,255,255,0.028)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}>

              {status === "success" ? (
                <div className="success-pop text-center py-10">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full mb-5"
                    style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M4 12l5 5L20 7" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-[20px] font-black text-white mb-2">Заявка отправлена!</p>
                  <p className="text-[14px] text-gray-400">Мы свяжемся с вами в течение одного рабочего дня.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.18em] mb-8">Заявка на обучение</p>

                  <div className="space-y-7 mb-8">
                    {fields.map((f) => (
                      <div key={f.key}>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
                          style={{ color: focused === f.key ? "#3b82f6" : "rgba(255,255,255,0.3)" }}>
                          {f.label}
                        </label>
                        <div className={`relative ${focused === f.key ? "input-focused" : ""}`}>
                          <input
                            type={f.type}
                            required
                            placeholder={f.placeholder}
                            value={form[f.key]}
                            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                            onFocus={() => setFocused(f.key)}
                            onBlur={() => setFocused(null)}
                            className="lead-input"
                          />
                          <div className="input-bar" />
                        </div>
                      </div>
                    ))}

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
                        style={{ color: focused === "goal" ? "#3b82f6" : "rgba(255,255,255,0.3)" }}>
                        Цель
                      </label>
                      <div className={`relative ${focused === "goal" ? "input-focused" : ""}`}>
                        <select
                          value={form.goal}
                          onChange={(e) => setForm({ ...form, goal: e.target.value })}
                          onFocus={() => setFocused("goal")}
                          onBlur={() => setFocused(null)}
                          className="lead-input appearance-none cursor-pointer"
                        >
                          <option value="IELTS">Подготовка к IELTS</option>
                          <option value="SAT">Подготовка к SAT</option>
                          <option value="IELTS+SAT">IELTS + SAT</option>
                          <option value="consult">Бесплатная консультация</option>
                        </select>
                        <svg className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"
                          width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="input-bar" />
                      </div>
                    </div>
                  </div>

                  {status === "error" && (
                    <p className="text-[12px] text-red-400 mb-4">Что-то пошло не так — попробуйте ещё раз или напишите в WhatsApp.</p>
                  )}

                  <div className="flex flex-col gap-3">
                    <button type="submit" disabled={status === "loading"}
                      className="btn-blue w-full flex items-center justify-center gap-2 py-4 rounded-xl text-[14px] font-bold text-white disabled:opacity-50">
                      {status === "loading" ? (
                        <>
                          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="32" strokeDashoffset="12"/>
                          </svg>
                          Отправляем…
                        </>
                      ) : (
                        <>Отправить заявку <ArrowRight /></>
                      )}
                    </button>

                    <a href="https://wa.me/+77007380691" target="_blank" rel="noopener noreferrer"
                      className="btn-outline w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-[14px] font-semibold text-gray-300">
                      <WaIcon /> WhatsApp
                    </a>
                  </div>

                  <p className="text-[11px] text-gray-600 text-center mt-5">
                    Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function Page() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [statsOn,  setStatsOn]  = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const mouse = useMouse();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const el = statsRef.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsOn(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Prevent browser/Next.js from auto-scrolling on HMR / route restore
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  const fontVars = `${inter.variable}`;

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; scroll-padding-top: 64px; }

        /* Noise */
        body::after {
          content: '';
          position: fixed; inset: 0;
          z-index: 9999; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px; opacity: 0.025;
        }

        /* Grid */
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        /* Keyframes */
        @keyframes heroSlide {
          from { opacity: 0; transform: translateY(64px) skewY(2deg); clip-path: inset(100% 0 0 0); }
          to   { opacity: 1; transform: translateY(0)    skewY(0);     clip-path: inset(0% 0 0 0);  }
        }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes blink   { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        @keyframes float   { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-12px);} }
        @keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes spin360 { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }

        .h-line1 { animation: heroSlide 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .h-line2 { animation: heroSlide 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
        .h-sub   { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
        .h-btns  { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
        .h-badge { animation: fadeIn 0.6s ease 0.05s both; }
        .h-stats { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.65s both; }
        .blink   { animation: blink 2.4s ease-in-out infinite; }
        .floater { animation: float 7s ease-in-out infinite; }

        .marquee-wrap { overflow: hidden; }
        .marquee-track {
          display: flex; width: max-content;
          animation: marquee 25s linear infinite;
        }
        .marquee-track:hover { animation-play-state: paused; }

        /* Buttons */
        .btn-blue {
          background: #2563eb;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .btn-blue:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 10px 36px rgba(37,99,235,0.5);
        }
        .btn-blue:active { transform: none; box-shadow: none; }

        .btn-outline {
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .btn-outline:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.22);
          transform: translateY(-2px);
        }

        .btn-green {
          background: #16a34a;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .btn-green:hover {
          background: #15803d;
          transform: translateY(-2px);
          box-shadow: 0 10px 36px rgba(22,163,74,0.45);
        }

        /* Nav underline */
        .nav-a { position: relative; transition: color 0.2s; }
        .nav-a::after {
          content: ''; position: absolute; left:0; bottom:-3px;
          width:0; height:1px; background:#3b82f6;
          transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-a:hover::after { width: 100%; }

        /* Platform cards */
        .p-card {
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.025);
          transition: border-color 0.3s, background 0.3s, transform 0.3s, box-shadow 0.3s;
        }
        .p-card:hover {
          border-color: rgba(59,130,246,0.35);
          background: rgba(59,130,246,0.055);
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
        }

        /* Popular card glow border via box-shadow */
        .p-card-popular {
          border: 1px solid rgba(59,130,246,0.5);
          background: rgba(37,99,235,0.07);
          transition: transform 0.3s, box-shadow 0.3s;
          box-shadow: 0 0 0 1px rgba(59,130,246,0.15), 0 0 40px rgba(37,99,235,0.12);
        }
        .p-card-popular:hover {
          transform: translateY(-5px);
          box-shadow: 0 0 0 1px rgba(59,130,246,0.4), 0 0 60px rgba(37,99,235,0.25), 0 20px 50px rgba(0,0,0,0.4);
        }

        /* Feature cards */
        .f-card {
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          transition: border-color 0.3s, background 0.3s, transform 0.3s;
        }
        .f-card:hover {
          border-color: rgba(59,130,246,0.25);
          background: rgba(59,130,246,0.045);
          transform: translateY(-3px);
        }
        .f-icon { transition: color 0.3s, transform 0.3s; }
        .f-card:hover .f-icon { color: #60a5fa; transform: scale(1.15); }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 3px; }
      `}</style>

      {/* Mouse glow */}
      <div aria-hidden style={{
        position: "fixed",
        left: mouse.x - 280, top: mouse.y - 280,
        width: 560, height: 560, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(37,99,235,0.09) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 9998,
        transition: "left 0.06s linear, top 0.06s linear",
      }} />

      <div className={`${fontVars} font-[family-name:var(--font-inter)] bg-[#060608] text-white antialiased overflow-x-hidden`}>

        {/* ── HEADER ──────────────────────────────────────────────────── */}
        <header className="fixed inset-x-0 top-0 z-50 transition-all duration-500" style={{
          background: scrolled ? "rgba(6,6,8,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(18px) saturate(160%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.055)" : "1px solid transparent",
        }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-10 h-16 flex items-center justify-between gap-6">
            <a href="#" className="shrink-0 select-none">
              <Image src="/logo.png" alt="KEZEN ED" width={136} height={40}
                className="h-8 w-auto object-contain brightness-0 invert" priority />
            </a>

            <nav className="hidden md:flex items-center gap-7">
              {NAV.map((l) => (
                <a key={l.href} href={l.href}
                  className="nav-a text-[13px] font-medium text-gray-400 hover:text-white">
                  {l.label}
                </a>
              ))}
            </nav>

            <a href="https://lms.kezened.kz" target="_blank" rel="noopener noreferrer"
              className="hidden md:inline-flex btn-blue items-center gap-2 text-[13px] font-semibold text-white px-5 py-2.5 rounded-lg shrink-0">
              Войти в LMS <ArrowRight />
            </a>

            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 -mr-1 text-gray-400 shrink-0" aria-label="Меню">
              <div className="w-5 space-y-[5px]">
                <span className="block h-px bg-current transition-all duration-300"
                  style={{ transform: menuOpen ? "translateY(6px) rotate(45deg)" : "" }} />
                <span className="block h-px bg-current transition-all duration-300"
                  style={{ opacity: menuOpen ? 0 : 1 }} />
                <span className="block h-px bg-current transition-all duration-300"
                  style={{ transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "" }} />
              </div>
            </button>
          </div>

          <div className="md:hidden overflow-hidden transition-all duration-300"
            style={{ maxHeight: menuOpen ? "300px" : "0", background: "rgba(6,6,8,0.97)", borderBottom: menuOpen ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <div className="px-5 py-5 flex flex-col gap-4">
              {NAV.map((l) => (
                <a key={l.href} href={l.href} onClick={closeMenu}
                  className="text-[15px] font-medium text-gray-300 hover:text-white transition-colors">{l.label}</a>
              ))}
              <a href="https://lms.kezened.kz" target="_blank" rel="noopener noreferrer" onClick={closeMenu}
                className="btn-blue text-center text-[14px] font-semibold text-white px-5 py-3.5 rounded-lg mt-1">
                Войти в LMS
              </a>
            </div>
          </div>
        </header>

        <main>
          {/* ── HERO ──────────────────────────────────────────────────── */}
          <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
            <div className="grid-bg absolute inset-0" />

            {/* Glows */}
            <div aria-hidden className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[480px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(30,58,138,0.22) 0%, transparent 68%)", filter: "blur(48px)" }} />
            <div aria-hidden className="absolute bottom-0 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.1) 0%, transparent 70%)", filter: "blur(64px)" }} />

            {/* Floating card */}
            <div className="floater hidden xl:block absolute right-20 top-1/2 -translate-y-1/3 pointer-events-none select-none" aria-hidden>
              <div className="w-56 rounded-2xl p-5"
                style={{ background: "rgba(12,12,18,0.85)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(20px)", boxShadow: "0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 blink" />
                  <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Прогресс</span>
                </div>
                <div className="text-[36px] font-extrabold text-white leading-none mb-1"
                  >+340</div>
                <div className="text-[12px] text-blue-400 mb-4">баллов SAT за 3 мес.</div>
                <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <div className="h-full w-[78%] rounded-full bg-blue-500"
                    style={{ boxShadow: "0 0 10px rgba(59,130,246,0.7)" }} />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-gray-600">1180</span>
                  <span className="text-[10px] text-gray-600">1520</span>
                </div>
              </div>
            </div>

            <div className="relative max-w-7xl mx-auto px-5 sm:px-10 py-24 md:py-28">
              {/* Badge */}
              <div className="h-badge inline-flex items-center gap-2.5 mb-9 px-4 py-2 rounded-full
                border border-white/10 bg-white/[0.04] backdrop-blur-sm">
                <span className="blink h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.14em]">
                  Ведущая образовательная платформа в Казахстане
                </span>
              </div>

              {/* Heading */}
              <div className="overflow-hidden">
                <div className="h-line1 text-[60px] sm:text-[90px] lg:text-[116px] font-black leading-[0.9] tracking-tighter text-white">
                  KEZEN
                </div>
              </div>
              <div className="overflow-hidden mb-9">
                <div className="h-line2 text-[60px] sm:text-[90px] lg:text-[116px] font-black leading-[0.9] tracking-tighter text-blue-500">
                  EDUCATION
                </div>
              </div>

              <p className="h-sub max-w-[500px] text-[16px] sm:text-[18px] text-gray-400 leading-relaxed mb-9">
                Комплексная платформа подготовки к SAT и IELTS с персонализированным обучением,
                еженедельными тестами и обратной связью на основе ИИ.
              </p>

              <div className="h-btns flex flex-col sm:flex-row gap-3 mb-20">
                <a href="https://lms.kezened.kz" target="_blank" rel="noopener noreferrer"
                  className="btn-blue inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-[15px] font-bold text-white">
                  Войти в LMS <ArrowRight />
                </a>
                <a href="#platforms"
                  className="btn-outline inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-[15px] font-semibold text-gray-300">
                  Наши платформы
                </a>
              </div>

              {/* Quick stats */}
              <div className="h-stats inline-grid grid-cols-3 rounded-2xl overflow-hidden
                border border-white/[0.07]"
                style={{ background: "rgba(255,255,255,0.025)", backdropFilter: "blur(12px)" }}>
                {[
                  { val: "1 500+", label: "Студентов" },
                  { val: "150+",   label: "Групп"     },
                  { val: "10K+",   label: "Тестов"    },
                ].map((s, i) => (
                  <div key={s.label}
                    className={`py-5 px-7 text-center ${i > 0 ? "border-l border-white/[0.07]" : ""}`}>
                    <div className="text-[22px] font-extrabold text-white leading-none"
                      >{s.val}</div>
                    <div className="text-[11px] text-gray-500 mt-1 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── MARQUEE ───────────────────────────────────────────────── */}
          <div className="border-y border-white/[0.05] py-4 marquee-wrap"
            style={{ background: "rgba(255,255,255,0.012)" }}>
            <div className="marquee-track select-none">
              {[0, 1].map((k) => (
                <div key={k} className="flex items-center gap-9 pr-9">
                  {MARQUEE_ITEMS.map((t) => (
                    <span key={t} className="flex items-center gap-3 whitespace-nowrap text-[12px] font-semibold text-gray-600 uppercase tracking-wider">
                      <span className="h-1 w-1 rounded-full bg-blue-500/50 shrink-0" />
                      {t}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── PROBLEM ───────────────────────────────────────────────── */}
          <section className="py-28 sm:py-36">
            <div className="max-w-7xl mx-auto px-5 sm:px-10">
              <Reveal>
                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500
                  border border-blue-500/25 bg-blue-500/[0.08] px-3.5 py-1.5 rounded-full mb-7">
                  Проблема
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="text-[36px] sm:text-[52px] lg:text-[64px] font-extrabold tracking-tight leading-[1.04] text-white mb-6 max-w-3xl"
                  >
                  Подготовка к экзаменам<br />не должна быть хаосом
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="text-[16px] sm:text-[17px] text-gray-400 leading-relaxed max-w-lg mb-10">
                  Разрозненные материалы. Отсутствие аналитики. Нет обратной связи.
                  Студенты тратят время впустую вместо того, чтобы достигать результатов.
                </p>
              </Reveal>
              <Reveal delay={220}>
                <a href="#platforms"
                  className="inline-flex items-center gap-2 text-[14px] font-bold text-blue-400 hover:text-blue-300 transition-colors group">
                  Решение
                  <span className="transition-transform duration-300 group-hover:translate-x-1"><ArrowRight /></span>
                </a>
              </Reveal>
            </div>
          </section>

          {/* ── PLATFORMS ─────────────────────────────────────────────── */}
          <section id="platforms" className="py-28 sm:py-36 border-t border-white/[0.05] scroll-mt-16">
            <div className="max-w-7xl mx-auto px-5 sm:px-10">
              <Reveal>
                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500
                  border border-blue-500/25 bg-blue-500/[0.08] px-3.5 py-1.5 rounded-full mb-7">
                  Платформы
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="text-[36px] sm:text-[52px] lg:text-[64px] font-extrabold tracking-tight leading-[1.04] text-white mb-14"
                  >
                  Три платформы.<br />Одна экосистема.
                </h2>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLATFORMS.map((p, i) => (
                  <Reveal key={p.tag} delay={i * 90} className="h-full">
                    <div className={`flex flex-col h-full rounded-2xl p-7 ${p.popular ? "p-card-popular" : "p-card"}`}>
                      {/* Tags */}
                      <div className="flex items-center gap-2 mb-6">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md
                          ${p.popular
                            ? "text-blue-300 border border-blue-400/35 bg-blue-400/[0.12]"
                            : "text-gray-500 border border-white/10 bg-white/[0.04]"}`}>
                          {p.tag}
                        </span>
                        {p.popular && (
                          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md
                            text-blue-300 border border-blue-400/35 bg-blue-400/[0.12]">
                            Popular
                          </span>
                        )}
                      </div>

                      <h3 className="text-[20px] font-extrabold text-white mb-3 leading-snug"
                        >{p.title}</h3>
                      <p className="text-[14px] text-gray-400 leading-relaxed flex-1 mb-7">{p.desc}</p>

                      <a href={p.href} target="_blank" rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[13px] font-bold
                          ${p.popular ? "btn-blue text-white" : "btn-outline text-gray-300"}`}>
                        Открыть <ArrowRight />
                      </a>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── FEATURES ──────────────────────────────────────────────── */}
          <section id="features" className="py-28 sm:py-36 border-t border-white/[0.05] scroll-mt-16">
            <div className="max-w-7xl mx-auto px-5 sm:px-10">
              <Reveal>
                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500
                  border border-blue-500/25 bg-blue-500/[0.08] px-3.5 py-1.5 rounded-full mb-7">
                  Возможности
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="text-[36px] sm:text-[52px] lg:text-[64px] font-extrabold tracking-tight leading-[1.04] text-white mb-14"
                  >
                  Создано для результатов
                </h2>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {FEATURES.map((f, i) => (
                  <Reveal key={f.title} delay={i * 60} className="h-full">
                    <div className="f-card rounded-2xl p-7 h-full group">
                      <div className="f-icon w-9 h-9 text-blue-500/60 mb-5">{FeatureIcons[i]}</div>
                      <h3 className="text-[15px] font-bold text-white mb-2.5">{f.title}</h3>
                      <p className="text-[13px] text-gray-500 leading-relaxed">{f.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── STATS ─────────────────────────────────────────────────── */}
          <section id="stats" className="py-28 sm:py-36 border-t border-white/[0.05] scroll-mt-16 relative overflow-hidden">
            <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[700px] h-[360px] rounded-full"
                style={{ background: "radial-gradient(ellipse, rgba(29,78,216,0.18) 0%, transparent 68%)", filter: "blur(80px)" }} />
            </div>
            <div className="relative max-w-7xl mx-auto px-5 sm:px-10">
              <Reveal>
                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500
                  border border-blue-500/25 bg-blue-500/[0.08] px-3.5 py-1.5 rounded-full mb-7">
                  Достижения
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="text-[36px] sm:text-[52px] lg:text-[64px] font-extrabold tracking-tight leading-[1.04] text-white mb-16"
                  >
                  Цифры говорят<br />сами за себя
                </h2>
              </Reveal>

              <div ref={statsRef}
                className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]"
                style={{ background: "rgba(255,255,255,0.018)" }}>
                {STATS_DATA.map((s, i) => (
                  <StatCard key={s.label} {...s} active={statsOn} delay={i * 80} />
                ))}
              </div>
            </div>
          </section>

          {/* ── LEAD FORM ─────────────────────────────────────────────── */}
          <LeadSection />
        </main>

        {/* ── FOOTER ────────────────────────────────────────────────── */}
        <footer className="border-t border-white/[0.05]">
          <div className="border-b border-white/[0.05]">
            <div className="max-w-7xl mx-auto px-5 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[13px] text-gray-500">Есть вопросы? Свяжитесь с нами напрямую.</p>
              <a href="https://wa.me/77076957688" target="_blank" rel="noopener noreferrer" className="text-[14px] font-bold text-white hover:text-blue-400 transition-colors">
                +7 (700) 738-06-91
              </a>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-5 sm:px-10 py-14">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
              <div>
                <a href="#" className="inline-flex mb-5">
                  <Image src="/logo.png" alt="KEZEN ED" width={118} height={36}
                    className="h-7 w-auto object-contain brightness-0 invert" />
                </a>
                <p className="text-[13px] text-gray-600 leading-relaxed max-w-xs">
                  Ваш надёжный партнёр в подготовке к SAT и IELTS. Комплексные платформы с ИИ.
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.18em] mb-5">Платформы</p>
                <div className="flex flex-col gap-3">
                  {[{ l: "Система LMS", h: "https://lms.kezened.kz" }, { l: "SAT Платформа", h: "https://sat.kezened.kz" }, { l: "IELTS Платформа", h: "https://ielts.kezened.kz" }]
                    .map((x) => <a key={x.l} href={x.h} target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-white transition-colors">{x.l}</a>)}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.18em] mb-5">Ресурсы</p>
                <div className="flex flex-col gap-3">
                  {NAV.map((l) => <a key={l.href} href={l.href} className="text-[13px] text-gray-500 hover:text-white transition-colors">{l.label}</a>)}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.18em] mb-5">Контакты</p>
                <div className="flex flex-col gap-3">
                  <a href="https://wa.me/+77076957688" target="_blank" rel="noopener noreferrer"
                    className="text-[13px] text-gray-500 hover:text-white transition-colors">WhatsApp</a>
                  <a href="https://wa.me/77076957688" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-white transition-colors">
                    +7 (700) 738-06-91
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-white/[0.05] pt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-[12px] text-gray-700">© {new Date().getFullYear()} KEZEN ED. Все права защищены.</p>
              <div className="flex gap-6">
                <a href="/privacy" className="text-[12px] text-gray-700 hover:text-gray-500 transition-colors">Политика конфиденциальности</a>
                <a href="/terms"   className="text-[12px] text-gray-700 hover:text-gray-500 transition-colors">Условия использования</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}