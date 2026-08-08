// 색상 팔레트 — 앞으로 계속 씁니다
const BG = "#0B0E1A";
const CARD = "#161B33";
const LINE = "#262C4A";
const TXT = "#EAECF5";
const MUTE = "#7A82A8";
const NEON = "#00E5C7";
const VIOLET = "#8B6DFF";

// 임시 데이터 (나중에 Supabase로 교체할 자리)
const SPECS = [
  { name: "알고리즘", target: 100, unit: "문제", cur: 62 },
  { name: "CS 지식", target: 100, unit: "%", cur: 45 },
  { name: "프로젝트", target: 3, unit: "개", cur: 1 },
  { name: "GitHub 커밋", target: 300, unit: "회", cur: 184 },
  { name: "정보처리기사", target: 1, unit: "취득", cur: 0 },
  { name: "블로그 글", target: 20, unit: "편", cur: 7 },
];

const pct = (c, t) => Math.min(100, Math.round((c / t) * 100));

function App() {
  const overall = Math.round(
    SPECS.reduce((a, s) => a + pct(s.cur, s.target), 0) / SPECS.length
  );
  const done = SPECS.filter((s) => pct(s.cur, s.target) >= 100).length;

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TXT,
      fontFamily: "-apple-system, sans-serif" }}>

      {/* 헤더 */}
      <header style={{ borderBottom: `1px solid ${LINE}`, padding: "16px 26px",
        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontWeight: 900, fontSize: 20,
            background: `linear-gradient(90deg, ${NEON}, ${VIOLET})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            JobTrack
          </span>
          <span style={{ color: MUTE, fontSize: 12 }}>백엔드 개발자 · 통합 대시보드</span>
        </div>
        <span style={{ color: MUTE, fontSize: 12 }}>
          <b style={{ color: NEON }}>{done}</b>/{SPECS.length} 완료
        </span>
      </header>

      {/* 전체 달성도 히어로 */}
      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 26px" }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12, color: MUTE, marginBottom: 2 }}>
            전체 취업 준비 달성도
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span style={{ fontSize: 58, fontWeight: 900, lineHeight: 1,
              background: `linear-gradient(90deg, ${NEON}, ${VIOLET})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {overall}%
            </span>
            <span style={{ fontSize: 13, color: MUTE }}>
              목표까지 <b style={{ color: TXT }}>{100 - overall}%p</b> 남음
            </span>
          </div>
          {/* 진행 바 */}
          <div style={{ height: 10, background: "#1A2036", borderRadius: 20,
            overflow: "hidden", marginTop: 14, maxWidth: 420 }}>
            <div style={{ height: "100%", width: `${overall}%`,
              background: `linear-gradient(90deg, ${NEON}, ${VIOLET})`,
              borderRadius: 20 }} />
          </div>
        </div>

        {/* 계기판 — 스펙별 달성률 */}
   <section style={{ background: CARD, border: `1px solid ${LINE}`,
     borderRadius: 16, padding: 18 }}>
     <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>
       스펙별 달성률
     </div>
     <div style={{ fontSize: 11, color: MUTE, fontFamily: "monospace",
       marginBottom: 14 }}>지금 어디까지 왔나 · 계기판</div>
     <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
       gap: 12 }}>
       {SPECS.map((s) => <GaugeCard key={s.name} s={s} />)}
     </div>
   </section>
      </main>
    </div>
  );
}

// ── 계기판 카드 (스펙 하나를 반원 게이지로) ──
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
    <div style={{ background: "#121629", border: "1px solid #262C4A",
      borderRadius: 12, padding: "12px 6px 10px", textAlign: "center" }}>
      <svg width="120" height="92" viewBox="0 0 120 92">
        {seg}
        <text x="60" y="58" textAnchor="middle" fontSize="24" fontWeight="900"
          fill={col} fontFamily="monospace">{p}</text>
        <text x="60" y="72" textAnchor="middle" fontSize="8" fill="#7A82A8"
          fontFamily="monospace">%</text>
      </svg>
      <div style={{ fontWeight: 700, fontSize: 12.5, marginTop: -4 }}>{s.name}</div>
      <div style={{ fontSize: 10.5, color: "#7A82A8", fontFamily: "monospace",
        marginTop: 2 }}>{s.cur}/{s.target}{s.unit}</div>
    </div>
  );
}

export default App;