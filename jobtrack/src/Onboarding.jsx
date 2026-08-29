import { useState } from "react";
import { supabase } from "./supabase";

export default function Onboarding({ session, onDone }) {
  const [job, setJob] = useState("");

  async function saveJob() {
    if (!job.trim()) return;
    await supabase.from("profiles").insert({ user_id: session.user.id, job: job.trim() });
    onDone(job.trim());  // 대시보드로 (스펙은 대시보드에서 추가)
  }

  return (
    <div style={wrap}>
      <div style={card}>
        <div style={eyebrow}>시작하기</div>
        <div style={title}>어떤 직무를 준비하세요?</div>
        <div style={hint}>예: 백엔드 개발자, 데이터 분석가, UX 디자이너</div>
        <input value={job} onChange={(e) => setJob(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") saveJob(); }}
          placeholder="목표 직무 입력…" style={inp} />
        <button onClick={saveJob} style={btnMain}>대시보드 시작 →</button>
      </div>
    </div>
  );
}

const wrap = { minHeight: "100vh", background: "#0B0E1A", color: "#EAECF5",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontFamily: "-apple-system, sans-serif" };
const card = { width: 380, padding: 28, background: "#161B33",
  border: "1px solid #262C4A", borderRadius: 16 };
const eyebrow = { fontSize: 13, color: "#7A82A8", marginBottom: 6 };
const title = { fontSize: 22, fontWeight: 800, marginBottom: 8 };
const hint = { fontSize: 12, color: "#7A82A8", marginBottom: 16 };
const inp = { width: "100%", padding: "10px 12px", borderRadius: 8,
  background: "#0B0E1A", border: "1px solid #262C4A", color: "#EAECF5",
  outline: "none", boxSizing: "border-box", fontSize: 14, marginBottom: 14 };
const btnMain = { width: "100%", padding: "11px", borderRadius: 8, border: "none",
  background: "#00E5C7", color: "#05070E", fontWeight: 700, fontSize: 14, cursor: "pointer" };