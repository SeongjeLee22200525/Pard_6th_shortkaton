"use client";

import { useEffect, useState } from "react";
import {
  getAllRulesApi,
  postRuleApi,
  voteRuleApi,
} from "@/lib/ruleApi";
import { Rules } from "@/types/rule";
import Header from "@/components/Header";

export default function Rule() {
  const [rules, setRules] = useState<Rules[]>([]);
  const [memo, setMemo] = useState("");
  const [userName, setUserName] = useState("");

  const fetchRules = async () => {
    const data = await getAllRulesApi();
    setRules(data);
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const confirmedRules = rules.filter((r) => r.available === true);
  const pendingRules = rules.filter((r) => r.available === false);

  // 제안 → 확정 (투표)
  const handlePlus = async (ruleId: number) => {
    if (!userName.trim()) {
      alert("이름을 먼저 입력하세요!");
      return;
    }
    await voteRuleApi({ ruleId, userName, isCheck: true });
    fetchRules();
  };

  // 확정 → 제안 (투표)
  const handleMinus = async (ruleId: number) => {
    if (!userName.trim()) {
      alert("이름을 먼저 입력하세요!");
      return;
    }
    await voteRuleApi({ ruleId, userName, isCheck: false });
    fetchRules();
  };

  // 새로운 규칙 추가
  const handleAddRule = async () => {
    if (!memo.trim()) return;
    await postRuleApi(memo);
    setMemo("");
    fetchRules();
  };

  return (
    <div className="w-full min-h-screen bg-[#EBEBEB] pb-40 flex flex-col items-center">
      <Header />

      <div className="w-[90%] max-w-[1280px] bg-white rounded-[40px] mt-10 p-16 shadow">
        {/* Rule 제목 */}
        <h1 className="text-3xl font-bold mb-12">Rule</h1>

        <div className="flex w-full gap-10">
          {/* ---------------- 확정 박스 ---------------- */}
          <div className="w-1/2 bg-white rounded-3xl border border-black p-10 shadow-sm">
            <h2 className="text-xl font-bold mb-6">확정</h2>

            {/* 리스트 */}
            <div className="flex flex-col gap-3">
              {confirmedRules.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  확정된 규칙이 없습니다
                </div>
              ) : (
                confirmedRules.map((r) => (
                  <div
                    key={r.ruleId}
                    className="flex items-center justify-between p-3 border rounded-lg bg-white"
                  >
                    <span>{r.memo}</span>
                    <button
                      className="text-lg font-bold text-black"
                      onClick={() => handleMinus(r.ruleId)}
                    >
                      -
                    </button>
                  </div>
                ))
              )}
            </div>

            <button className="w-28 h-10 bg-black text-white rounded-lg mt-10">
              수정
            </button>
          </div>

          {/* ---------------- 제안 박스 ---------------- */}
          <div className="w-1/2 bg-white rounded-3xl border border-black p-10 shadow-sm">
            <h2 className="text-xl font-bold mb-6">제안</h2>

            {/* 리스트 */}
            <div className="flex flex-col gap-3">
              {pendingRules.map((r) => (
                <div
                  key={r.ruleId}
                  className="flex items-center justify-between p-3 border rounded-lg bg-white"
                >
                  <span>{r.memo}</span>
                  <button
                    className="text-lg font-bold text-black"
                    onClick={() => handlePlus(r.ruleId)}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>

            {/* 입력창 + 추가 버튼 */}
            <div className="flex items-center gap-2 mt-6">
              <input
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
                placeholder="규칙을 입력하세요"
              />
              <button
                onClick={handleAddRule}
                className="w-28 h-10 bg-black text-white rounded-lg"
              >
                추가
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- 이름 입력 박스 ---------------- */}
        <div className="flex flex-col mt-12 w-[180px] ml-auto">
          <label className="text-sm mb-1 text-black">Name</label>
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-3 bg-[#F3F3F3] rounded-xl border border-gray-300"
            placeholder="이름"
          />
        </div>
      </div>
    </div>
  );
}
