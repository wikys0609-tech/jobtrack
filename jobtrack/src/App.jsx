import { useState, useEffect } from "react";
import { supabase } from "./supabase";

// ── 색상 팔레트 ──
const BG = "#0B0E1A";
const CARD = "#161B33";
const LINE = "#262C4A";
const TXT = "#EAECF5";
const MUTE = "#7A82A8";
const NEON = "#00E5C7";
const VIOLET = "#8B6DFF";

// ── 데이터 (나중에 Supabase로 교체할 자리) ──


// 잔디 목업 데이터 생성
function makeGrass() {
  const weeks = 26, g = [];
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let w = 0; w < weeks; w++) {
    const col = [];
    for (let d = 0; d < 7; d++) {
      const r = rnd();
      col.push(r < 0.4 ? 0 : r < 0.62 ? 1 : r < 0.8 ? 2 : r < 0.93 ? 3 : 4);
    }
    g.push(col);
  }
  return g;
}
const GRASS = makeGrass();
const GRASS_COLORS = ["#1A2036", "#8DFF5C44", "#8DFF5C77", "#8DFF5CBB", "#8DFF5C"];

// 다음 할 일 (주기 포함)

const CYCLE_COLOR = { "매일": "#00E5C7", "매주": "#8B6DFF" };

const pct = (c, t) => Math.min(100, Math.round((c / t) * 100));

function App() {
  const [SPECS, setSPECS] = useState([]);  // 스펙을 담을 상자 (처음엔 비어있음)
  const [newTodo, setNewTodo] = useState("");      // 입력창 글자
  const [newCycle, setNewCycle] = useState("매일");  // 선택한 주기

  // 앱이 켜질 때 한 번 DB에서 스펙을 불러온다
  useEffect(() => {
    async function loadSpecs() {
      const { data, error } = await supabase
        .from("specs")
        .select("*")
        .order("id");
      if (error) {
        console.error("스펙 불러오기 실패:", error);
      } else {
        setSPECS(data);
      }
    }
    loadSpecs();
  }, []);

  // 투두 완료 토글 → 화면 즉시 갱신 + DB 저장
  async function toggleTodo(todo) {
    const newDone = !todo.done;

    // 1) 화면 먼저
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, done: newDone } : t))
    );

    // 2) DB 저장
    const { error } = await supabase
      .from("todos")
      .update({ done: newDone })
      .eq("id", todo.id);
    if (error) console.error("투두 저장 실패:", error);
  }

  // 새 투두 추가 → DB 저장 후 목록에 반영
  async function addTodo() {
    if (!newTodo.trim()) return;  // 빈 입력 방지

    const { data, error } = await supabase
      .from("todos")
      .insert({ text: newTodo.trim(), cycle: newCycle, done: false })
      .select()   // 방금 추가한 행(자동 생성된 id 포함)을 돌려받기
      .single();

    if (error) { console.error("추가 실패:", error); return; }

    setTodos((prev) => [...prev, data]);  // 화면 목록에 추가
    setNewTodo("");                        // 입력창 비우기
  }

  const [todos, setTodos] = useState([]);  // 투두를 담을 상자

  useEffect(() => {
    async function loadTodos() {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("id");
      if (error) console.error("투두 불러오기 실패:", error);
      else setTodos(data);
    }
    loadTodos();
  }, []);

  // 달성도 변경 → 화면 즉시 갱신 + DB 저장
  async function updateCur(spec, delta) {
    const newCur = Math.max(0, Math.min(spec.target, spec.cur + delta));

    // 1) 화면 먼저 갱신 (빠른 반응)
    setSPECS((prev) =>
      prev.map((s) => (s.id === spec.id ? { ...s, cur: newCur } : s))
    );

    // 2) DB에 저장
    const { error } = await supabase
      .from("specs")
      .update({ cur: newCur })
      .eq("id", spec.id);
    if (error) console.error("저장 실패:", error);
  }

  if (SPECS.length === 0) {
    return <div style={{
      background: "#0B0E1A", color: "#7A82A8",
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: "sans-serif"
    }}>
      불러오는 중…
    </div>;
  }
  const overall = Math.round(
    SPECS.reduce((a, s) => a + pct(s.cur, s.target), 0) / SPECS.length
  );
  const done = SPECS.filter((s) => pct(s.cur, s.target) >= 100).length;
  const weakest = [...SPECS].sort((a, b) => pct(a.cur, a.target) - pct(b.cur, b.target))[0];

  return (
    <div style={{
      minHeight: "100vh", background: BG, color: TXT,
      fontFamily: "-apple-system, sans-serif"
    }}>

      {/* 헤더 */}
      <header style={{
        borderBottom: `1px solid ${LINE}`, padding: "16px 26px",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{
            fontWeight: 900, fontSize: 20,
            background: `linear-gradient(90deg, ${NEON}, ${VIOLET})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            JobTrack
          </span>
          <span style={{ color: MUTE, fontSize: 12 }}>백엔드 개발자 · 통합 대시보드</span>
        </div>
        <span style={{ color: MUTE, fontSize: 12 }}>
          <b style={{ color: NEON }}>{done}</b>/{SPECS.length} 완료
        </span>
      </header>

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 26px 60px" }}>

        {/* 전체 달성도 히어로 */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12, color: MUTE, marginBottom: 2 }}>
            전체 취업 준비 달성도
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span style={{
              fontSize: 58, fontWeight: 900, lineHeight: 1,
              background: `linear-gradient(90deg, ${NEON}, ${VIOLET})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              {overall}%
            </span>
            <span style={{ fontSize: 13, color: MUTE }}>
              목표까지 <b style={{ color: TXT }}>{100 - overall}%p</b> 남음
            </span>
          </div>
          <div style={{
            height: 10, background: "#1A2036", borderRadius: 20,
            overflow: "hidden", marginTop: 14, maxWidth: 420
          }}>
            <div style={{
              height: "100%", width: `${overall}%`,
              background: `linear-gradient(90deg, ${NEON}, ${VIOLET})`,
              borderRadius: 20
            }} />
          </div>
        </div>

        {/* ── 통합 그리드: 계기판(좌) + 현황판(우) + 잔디(아래 전체) ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "1.15fr 0.85fr",
          gap: 16, alignItems: "start"
        }}>

          {/* 계기판 — 스펙별 달성률 */}
          <section style={{
            background: CARD, border: `1px solid ${LINE}`,
            borderRadius: 16, padding: 18
          }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>
              스펙별 달성률
            </div>
            <div style={{
              fontSize: 11, color: MUTE, fontFamily: "monospace",
              marginBottom: 14
            }}>지금 어디까지 왔나 · 계기판</div>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12
            }}>
              {SPECS.map((s) => <GaugeCard key={s.id} s={s} onUpdate={updateCur} />)}
            </div>
          </section>

          {/* 현황판 — 브리핑 + 다음 할 일 */}
          <section style={{
            background: "#05070E", border: `1px solid ${NEON}33`,
            borderRadius: 16, padding: 18, fontFamily: "monospace"
          }}>
            <div style={{
              color: NEON, fontSize: 11, letterSpacing: "0.14em",
              marginBottom: 12, borderBottom: `1px solid ${NEON}22`, paddingBottom: 10
            }}>
              ▐ STATUS BRIEFING
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
              <BriefRow k="OVERALL" v={`${overall}%`} c={NEON} />
              <BriefRow k="완료 스펙" v={`${done} / ${SPECS.length}`} c="#8DFF5C" />
              <BriefRow k="집중 필요" v={weakest.name} c="#FF5CAA" />
            </div>
            <div style={{
              color: MUTE, fontSize: 10, letterSpacing: "0.1em",
              margin: "16px 0 8px", borderTop: `1px solid ${NEON}18`, paddingTop: 12
            }}>
              &gt; NEXT ACTIONS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {todos.map((t) => (
                <div key={t.id} onClick={() => toggleTodo(t)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    fontSize: 12, cursor: "pointer"
                  }}>
                  <span style={{
                    width: 14, height: 14, borderRadius: 4, flexShrink: 0,
                    border: `1.5px solid ${t.done ? "#8DFF5C" : "#6E76A0"}`,
                    background: t.done ? "#8DFF5C" : "transparent",
                    color: "#05070E", fontSize: 10, textAlign: "center", lineHeight: "12px"
                  }}>
                    {t.done ? "✓" : ""}
                  </span>
                  <span style={{
                    color: CYCLE_COLOR[t.cycle] || "#7A82A8", fontSize: 9,
                    border: `1px solid ${(CYCLE_COLOR[t.cycle] || "#7A82A8")}55`,
                    borderRadius: 3, padding: "1px 5px"
                  }}>{t.cycle}</span>
                  <span style={{
                    color: t.done ? "#6E76A0" : "#B9C2E8",
                    textDecoration: t.done ? "line-through" : "none"
                  }}>{t.text}</span>

                </div>
              ))}
            </div>
            {/* 새 투두 추가 */}
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addTodo(); }}
                placeholder="할 일 입력…"
                style={{
                  padding: "8px 10px", borderRadius: 8, fontSize: 12,
                  background: "#0B0E1A", border: `1px solid ${LINE}`, color: TXT,
                  outline: "none", fontFamily: "monospace"
                }}
              />
              <div style={{ display: "flex", gap: 6 }}>
                {["매일", "매주"].map((cy) => (
                  <button key={cy} onClick={() => setNewCycle(cy)}
                    style={{
                      fontSize: 10, padding: "4px 8px", borderRadius: 6,
                      cursor: "pointer", fontFamily: "monospace",
                      border: `1px solid ${CYCLE_COLOR[cy]}`,
                      background: newCycle === cy ? CYCLE_COLOR[cy] : "transparent",
                      color: newCycle === cy ? "#05070E" : CYCLE_COLOR[cy]
                    }}>
                    {cy}
                  </button>
                ))}
                <button onClick={addTodo}
                  style={{
                    marginLeft: "auto", fontSize: 11, padding: "4px 14px",
                    borderRadius: 6, cursor: "pointer", border: "none",
                    background: NEON, color: "#05070E", fontWeight: 700
                  }}>
                  추가
                </button>
              </div>
            </div>
          </section>

          {/* 잔디형 — 활동 히스토리 (아래 전체 폭) */}
          <section style={{
            gridColumn: "1 / -1", background: CARD,
            border: `1px solid ${LINE}`, borderRadius: 16, padding: 18
          }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>
              활동 히스토리
            </div>
            <div style={{
              fontSize: 11, color: MUTE, fontFamily: "monospace",
              marginBottom: 14
            }}>얼마나 꾸준했나 · 최근 26주</div>
            <div style={{ display: "flex", gap: 3, overflowX: "auto", paddingBottom: 4 }}>
              {GRASS.map((col, wi) => (
                <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {col.map((v, di) => (
                    <div key={di} style={{
                      width: 14, height: 14, borderRadius: 3,
                      background: GRASS_COLORS[v]
                    }} />
                  ))}
                </div>
              ))}
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 6, fontSize: 11,
              color: MUTE, marginTop: 12, justifyContent: "flex-end"
            }}>
              적음
              {GRASS_COLORS.map((c) => (
                <span key={c} style={{
                  width: 11, height: 11, borderRadius: 3,
                  background: c, display: "inline-block"
                }} />
              ))}
              많음
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

// ── 계기판 카드 ──
function GaugeCard({ s, onUpdate }) {
  const p = pct(s.cur, s.target);
  const col = p >= 100 ? "#8DFF5C" : p >= 50 ? "#00E5C7" : "#FFC24B";
  const cx = 60, cy = 60, R = 46, start = 135, sweep = 270, ticks = 28;
  const active = Math.round((p / 100) * ticks);
  const seg = [];
  for (let i = 0; i < ticks; i++) {
    const a = ((start + (sweep / (ticks - 1)) * i) * Math.PI) / 180;
    const x1 = cx + Math.cos(a) * (R - 7), y1 = cy + Math.sin(a) * (R - 7);
    const x2 = cx + Math.cos(a) * R, y2 = cy + Math.sin(a) * R;
    seg.push(
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={i < active ? col : "#232A47"} strokeWidth="3" strokeLinecap="round" />
    );
  }
  return (
    <div style={{
      background: "#121629", border: "1px solid #262C4A",
      borderRadius: 12, padding: "12px 6px 10px", textAlign: "center"
    }}>
      <svg width="120" height="92" viewBox="0 0 120 92">
        {seg}
        <text x="60" y="58" textAnchor="middle" fontSize="24" fontWeight="900"
          fill={col} fontFamily="monospace">{p}</text>
        <text x="60" y="72" textAnchor="middle" fontSize="8" fill="#7A82A8"
          fontFamily="monospace">%</text>
      </svg>
      <div style={{ fontWeight: 700, fontSize: 12.5, marginTop: -4 }}>{s.name}</div>
      <div style={{
        fontSize: 10.5, color: "#7A82A8", fontFamily: "monospace",
        marginTop: 2
      }}>{s.cur}/{s.target}{s.unit}</div>
      <div style={{
        display: "flex", justifyContent: "center", gap: 8,
        marginTop: 8
      }}>
        <button onClick={() => onUpdate(s, -Math.max(1, Math.round(s.target * 0.1)))}
          style={btnStyle}>−</button>
        <button onClick={() => onUpdate(s, Math.max(1, Math.round(s.target * 0.1)))}
          style={btnStyle}>+</button>
      </div>
    </div>

  );
}

// ── 현황판 요약 한 줄 ──
function BriefRow({ k, v, c }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "#6E76A0" }}>{k}</span>
      <span style={{ color: c, fontWeight: 700 }}>{v}</span>
    </div>
  );
}

const btnStyle = {
  width: 30, height: 30, borderRadius: 8,
  border: "1px solid #262C4A", background: "#0B0E1A",
  color: "#EAECF5", fontSize: 16, cursor: "pointer", lineHeight: 1,
};

export default App;