"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState(null);

  async function fetchBriefing() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/report");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBriefing(data);
    } catch (e) {
      setBriefing(null);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAnalysis(stock) {
    setSelected(stock);
    setAnalyzing(true);
    setAnalysis(null);
    setError(null);

    try {
      const res = await fetch(`/api/report?stock=${stock}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data);
    } catch (e) {
      setAnalysis(null);
      setError(e.message);
    } finally {
      setAnalyzing(false);
    }
  }

  useEffect(() => {
    fetchBriefing();
  }, []);

  const d = new Date();
  const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;

  return (
    <div className="flex min-h-screen flex-col max-w-lg mx-auto">
      {/* ✅ header 수정 */}
      <header className="flex items-center p-4 border-b border-slate-800 justify-between sticky top-0 z-50 bg-background-dark">
        <h1 className="text-slate-100 text-lg font-bold">
          오늘의 주식 브리핑
        </h1>
        <span className="text-slate-400 text-xs">{dateStr}</span>
      </header>

      <main className="flex-1 p-4 space-y-5">
        {/* 에러 */}
        {error && (
          <div className="bg-card-bg rounded-xl border border-red-500/20 p-6 text-center">
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button
              onClick={fetchBriefing}
              className="text-primary text-sm font-medium hover:underline"
            >
              다시시도
            </button>
          </div>
        )}

        {/* 로딩 */}
        {loading ? (
          <p className="text-slate-400 text-sm text-center py-8">
            시장 정보 불러오는 중 ...
          </p>
        ) : (
          briefing && (
            <>
              {/* ✅ map return 수정 */}
              <div className="grid grid-cols-2 gap-3">
                {briefing.markets.map((m) => (
                  <div
                    key={m.name}
                    className="bg-card-bg rounded-xl p-4 border border-slate-800"
                  >
                    <span className="text-slate-400 text-xs font-semibold">
                      {m.name}
                    </span>
                    <div
                      className={`text-2xl font-bold mt-1 ${m.up ? "text-market-up" : "text-market-down"
                        }`}
                    >
                      {m.value}
                    </div>
                    <span
                      className={`text-xs ${m.up ? "text-market-up/70" : "text-market-down/70"
                        }`}
                    >
                      {m.up ? "🚀" : "💦"} {m.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* ✅ 오타 수정 */}
              <div className="bg-card-bg rounded-xl px-4 py-3 border border-slate-800">
                <p className="text-slate-200 text-sm leading-relaxed">
                  {briefing.headline}
                </p>
              </div>
            </>
          )
        )}

        {/* 종목 */}
        <section>
          <h2 className="text-slate-100 text-sm font-bold mb-3">
            종목 분석
          </h2>

          <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
            {loading ? (
              <p className="text-slate-500 text-xs">
                종목 불러오는 중...
              </p>
            ) : (
              (briefing?.hotStocks || []).map((stock) => (
                <button
                  key={stock}
                  onClick={() => fetchAnalysis(stock)}
                  className={`flex-none px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all ${selected === stock
                      ? "border-2 border-primary bg-primary/10 text-primary font-bold"
                      : "border border-slate-800 bg-card-bg text-slate-400 font-medium hover:border-slate-600"
                    }`}
                >
                  {stock}
                </button>
              ))
            )}
          </div>
        </section>

        {/* 선택 전 */}
        {!selected && (
          <div className="bg-card-bg rounded-xl border border-slate-800 p-12 text-center">
            <p className="text-4xl mb-4">👆</p>
            <p className="text-slate-500 text-sm">
              궁금한 종목을 눌러보세요!
            </p>
          </div>
        )}

        {/* 분석 */}
        {selected && (analyzing || analysis) && (
          <div className="bg-card-bg rounded-xl border border-slate-800 overflow-hidden">
            {/* ✅ border 오타 수정 */}
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-white text-lg font-bold">
                  {selected}
                </h3>
                <p className="text-slate-400 text-xs">
                  AI 분석 결과
                </p>
              </div>
              <span className="text-2xl">
                {analyzing ? "⌛" : "✅"}
              </span>
            </div>

            {analyzing ? (
              <p className="text-slate-400 text-sm p-4">
                분석 중 ...
              </p>
            ) : (
              analysis && (
                <div className="p-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-slate-300 text-xs">
                      시장 분위기
                    </span>
                    <span className="text-primary text-sm font-bold">
                      {analysis.sentiment}%
                    </span>
                  </div>

                  {/* ✅ 게이지 구조 수정 */}
                  <div className="h-2 w-full bg-slate-800 rounded-full flex overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${analysis.sentiment}%` }}
                    />
                    <div
                      className="h-full bg-red-500/40"
                      style={{
                        width: `${100 - analysis.sentiment}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-slate-500">
                      긍정
                    </span>
                    <span className="text-[10px] text-slate-500">
                      부정
                    </span>
                  </div>
                </div>
              )
            )}
            <div className="p-5">
              <h4 className="text-slate-100 text-sm font-bold mb-4">
                핵심요약
              </h4>
              {analyzing ? (
                <p className="text-slate-400 text-sm">AI가 분석하는 중...</p>
              ) : (
                analysis && (
                  <>
                    <ul className="space-y-3">
                      {analysis.insights.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="flex-shrink-0">
                            {item.type === "warning" ? "⚠️" :
                              item.type === "positive" ? "👍" :
                                item.type === "trend" ? "📈" : "📰"}
                          </span>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {item.txt}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 pt-4 border-t border-slate-800 text-slate-400 text-xs leading-relaxed">
                      {analysis.summary}
                    </p>
                  </>
                )
              )}
            </div>
          </div>

        )}
        <Link href="/about"
        className="block bg-primary/10 rounded-xl border border-primary/30 p-4 text-center hover:bg-primary/20 transition-all">
          <p className="text-primary text-sm font-medium">
            이 앱은 어떻게 만들어졌을까? →
          </p>
        </Link>
      </main>
    </div>
  );
}