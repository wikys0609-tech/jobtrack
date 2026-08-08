function App() {
     return (
       <div style={{
         minHeight: "100vh",
         background: "#0B0E1A",
         color: "#EAECF5",
         display: "flex",
         flexDirection: "column",
         alignItems: "center",
         justifyContent: "center",
         fontFamily: "-apple-system, sans-serif",
       }}>
         <h1 style={{
           fontSize: 48,
           fontWeight: 900,
           background: "linear-gradient(90deg, #00E5C7, #8B6DFF)",
           WebkitBackgroundClip: "text",
           WebkitTextFillColor: "transparent",
         }}>
           JobTrack
         </h1>
         <p style={{ color: "#7A82A8" }}>취업 준비 대시보드 · 개발 시작</p>
       </div>
     );
   }

   export default App;