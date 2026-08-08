// ── 색상 팔레트 ──
const BG = "#0B0E1A";
const CARD = "#161B33";
const LINE = "#262C4A";
const TXT = "#EAECF5";
const MUTE = "#7A82A8";
const NEON = "#00E5C7";
const VIOLET = "#8B6DFF";

// ── 데이터 (나중에 Supabase로 교체할 자리) ──
const SPECS = [
  { name: "알고리즘", target: 100, unit: "문제", cur: 62 },
  { name: "CS 지식", target: 100, unit: "%", cur: 45 },
  { name: "프로젝트", target: 3, unit: "개", cur: 1 },
  { name: "GitHub 커밋", target: 300, unit: "회", cur: 184 },
  { name: "정보처리기사", target: 1, unit: "취득", cur: 0 },
  { name: "블로그 글", target: 20, unit: "편", cur: 7 },
];

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
const NEXT_TODOS = [
  { text: "알고리즘 2문제 풀기", cycle: "매일" },
  { text: "CS 네트워크 1강 수강", cycle: "매일" },
  { text: "사이드 프로젝트 배포", cycle: "매주" },
  { text: "기술 블로그 1편 작성", cycle: "매주" },
];
const CYCLE_COLOR = { "매일": "#00E5C7", "매주": "#8B6DFF" };

const pct = (c, t) => Math.min(100, Math.round((c / t) * 100));

function App() {
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
              {SPECS.map((s) => <GaugeCard key={s.name} s={s} />)}
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
              {NEXT_TODOS.map((t, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 12
                }}>
                  <span style={{
                    color: CYCLE_COLOR[t.cycle], fontSize: 9,
                    border: `1px solid ${CYCLE_COLOR[t.cycle]}55`, borderRadius: 3,
                    padding: "1px 5px"
                  }}>{t.cycle}</span>
                  <span style={{ color: "#B9C2E8" }}>{t.text}</span>
                </div>
              ))}
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
function GaugeCard({ s }) {
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

export default App;