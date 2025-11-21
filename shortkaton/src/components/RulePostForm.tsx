"use client";

import { useState } from "react";
import { postRuleApi } from "@/lib/ruleApi"; // 아까 만든 rule.ts API


export default function RulePostForm() {
  const [memo, setMemo] = useState("");

  const isFormValid = memo.trim() !== "";

  const handleSubmit = async () => {
    try {
      if (!isFormValid) return;

      const res = await postRuleApi(memo);
      console.log("규칙 등록 성공:", res);

      // 성공 후 입력창 초기화
      setMemo("");

    } catch (err) {
      console.error("규칙 등록 실패:", err);
    }
  };

  return (
    <div className="mt-6 p-4 border border-zinc-200 rounded-lg bg-white shadow-md">
      <h2 className="text-lg font-semibold mb-2">새 규칙 등록</h2>

      <div className="flex flex-row gap-2">

        {/* memo 입력 */}
        <input
          type="text"
          placeholder="규칙 내용을 입력하세요"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="border border-zinc-900 p-2 rounded w-[300px]"
        />

        {/* 등록 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`p-2 rounded text-white transition-colors ${
            isFormValid
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          등록하기
        </button>
      </div>
    </div>
  );
}
