import { useState } from "react";
import { supabase } from "./supabase";

export default function Onboarding({ session, onDone }) {
  const [step, setStep] = useState(1);       // 1: 직무, 2: 스펙
  const [job, setJob] = useState("");
  const [specs, setSpecs] = useState([]);    // 추가한 스펙들
  const [name, setName] = useState("");      // 스펙 이름 입력
  const [target, setTarget] = useState("");  // 목표치 입력

  // 1단계: 직무 저장 후 2단계로
  async function saveJob() {
    if (!job.trim()) return;
    await supabase.from("profiles").insert({ user_id: session.user.id, job: job.trim() });
    setStep(2);
  }

  // 스펙 하나 목록에 추가 (아직 DB 저장 전, 화면에만)
  function addSpec() {
    if (!name.trim() || !target) return;
    setSpecs((prev) => [...prev, { name: name.trim(), target: Number(target), unit: "%", cur: 0 }]);
    setName(""); setTarget("");
  }

  // 완료: 스펙들을 DB에 저장하고 대시보드로
  async function finish() {
    if (specs.length === 0) return;
    const rows = specs.map((s) => ({ ...s, user_id: session.user.id }));
    const { error } = await supabase.from("specs").insert(rows);
    if (error) { console.error("스펙 저장 실패:", error); return; }
    onDone();  // App이 loadSpecs 다시 실행 → 대시보드 진입
  }

  return (
    <div style={wrap}>
      <div style={card}>
        {step === 1 ? (
          <>
            <div style={eyebrow}>온보딩 · 1/2</div>
            <div style={title}>어떤 직무를 준비하세요?</div>
            <div style={hint}>예: 백엔드 개발자, 데이터 분석가, UX 디자이너</div>
            <input value={job} onChange={(e) => setJob(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") saveJob(); }}
              placeholder="목표 직무 입력…" style={inp} />
            <button onClick={saveJob} style={btnMain}>다음 →</button>
          </>
        ) : (
          <>
            <div style={eyebrow}>온보딩 · 2/2 · {job}</div>
            <div style={title}>준비할 스펙을 추가하세요</div>
            <div style={hint}>예: 알고리즘 / 100, 포트폴리오 / 3</div>

            {/* 추가된 스펙 목록 */}
            {specs.map((s, i) => (
              <div key={i} style={{
                fontSize: 13, padding: "6px 0",
                borderBottom: "1px solid #262C4A", display: "flex", justifyContent: "space-between"
              }}>
                <span>{s.name}</span>
                <span style={{ color: "#7A82A8" }}>목표 {s.target}</span>
              </div>
            ))}

            {/* 스펙 입력 */}
            <div style={{ display: "flex", gap: 6, margin: "12px 0" }}>
              <input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="스펙 이름" style={{ ...inp, marginBottom: 0, flex: 2 }} />
              <input value={target} onChange={(e) => setTarget(e.target.value)}
                type="number" placeholder="목표" style={{ ...inp, marginBottom: 0, flex: 1 }} />
              <button onClick={addSpec} style={{ ...btnMain, width: "auto", padding: "0 16px" }}>+</button>
            </div>

            <button onClick={finish} disabled={specs.length === 0}
              style={{ ...btnMain, opacity: specs.length === 0 ? 0.4 : 1 }}>
              시작하기 ({specs.length}개) →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const wrap = {
  minHeight: "100vh", background: "#0B0E1A", color: "#EAECF5",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontFamily: "-apple-system, sans-serif"
};
const card = {
  width: 380, padding: 28, background: "#161B33",
  border: "1px solid #262C4A", borderRadius: 16
};
const eyebrow = { fontSize: 13, color: "#7A82A8", marginBottom: 6 };
const title = { fontSize: 22, fontWeight: 800, marginBottom: 8 };
const hint = { fontSize: 12, color: "#7A82A8", marginBottom: 16 };
const inp = {
  width: "100%", padding: "10px 12px", borderRadius: 8,
  background: "#0B0E1A", border: "1px solid #262C4A", color: "#EAECF5",
  outline: "none", boxSizing: "border-box", fontSize: 14, marginBottom: 14
};
const btnMain = {
  width: "100%", padding: "11px", borderRadius: 8, border: "none",
  background: "#00E5C7", color: "#05070E", fontWeight: 700, fontSize: 14, cursor: "pointer"
};