import { useState } from "react";
import { supabase } from "./supabase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    async function signUp() {
        const { error } = await supabase.auth.signUp({ email, password });
        setMsg(error ? "가입 실패: " + error.message : "가입 완료! 로그인하세요.");
    }
    async function signIn() {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setMsg("로그인 실패: " + error.message);
    }

    return (
        <div style={{
            minHeight: "100vh", background: "#0B0E1A", color: "#EAECF5",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "-apple-system, sans-serif"
        }}>
            <div style={{
                width: 320, padding: 28, background: "#161B33",
                border: "1px solid #262C4A", borderRadius: 16
            }}>
                <div style={{
                    fontSize: 24, fontWeight: 900, marginBottom: 20,
                    background: "linear-gradient(90deg, #00E5C7, #8B6DFF)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>
                    JobTrack
                </div>
                <input value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일"
                    style={inp} />
                <input value={password} onChange={(e) => setPassword(e.target.value)}
                    type="password" placeholder="비밀번호 (6자 이상)"
                    style={inp} />

                <div style={{
                    fontSize: 11, color: "#7A82A8", lineHeight: 1.5,
                    marginBottom: 10
                }}>
                    처음이신가요? 이메일과 비밀번호를 입력하고 <b style={{ color: "#00E5C7" }}>가입</b>을 눌러주세요.
                    이미 계정이 있다면 <b style={{ color: "#00E5C7" }}>로그인</b>을 누르시면 됩니다.
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button onClick={signIn} style={{ ...btn, background: "#00E5C7", color: "#05070E" }}>로그인</button>
                    <button onClick={signUp} style={{ ...btn, background: "transparent", color: "#00E5C7", border: "1px solid #00E5C7" }}>가입</button>
                </div>
                {msg && <div style={{ fontSize: 12, color: "#7A82A8", marginTop: 12 }}>{msg}</div>}
            </div>
        </div>
    );
}

const inp = {
    width: "100%", padding: "10px 12px", marginBottom: 8, borderRadius: 8,
    background: "#0B0E1A", border: "1px solid #262C4A", color: "#EAECF5",
    outline: "none", boxSizing: "border-box", fontSize: 14
};
const btn = {
    flex: 1, padding: "10px", borderRadius: 8, border: "none",
    cursor: "pointer", fontWeight: 700, fontSize: 14
};