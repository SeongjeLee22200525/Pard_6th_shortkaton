"use client";

import { useState } from "react";
import Header from "@/components/Header";

// 멤버 초기 데이터
const initialMembers = [
  { id: 1, name: "노현경", score: 5.0 },
  
  { id: 2, name: "정은숙", score: 5.0 },
  { id: 3, name: "이성순", score: 5.0 },
];

export default function MyPage() {
  const [members, setMembers] = useState(initialMembers);

  // 어떤 멤버가 점수 입력 중인지 저장
  const [editingId, setEditingId] = useState<number | null>(null);

  // 임시 점수 상태
  const [tempScore, setTempScore] = useState<number>(5);

  const handleStartRate = (id: number, currentScore: number) => {
    setEditingId(id);
    setTempScore(currentScore);
  };

  const handleSelectScore = (value: number) => {
    setTempScore(value);
  };

  const handleFinish = () => {
    if (editingId === null) return;

    // 점수 업데이트
    setMembers(prev =>
      prev.map(m =>
        m.id === editingId ? { ...m, score: tempScore } : m
      )
    );

    setEditingId(null); 
  };

  return (
    <main className="min-h-screen bg-gray-200">
      <Header />

      <div className="flex justify-center mt-10">
        <div className="w-[1100px] flex justify-center">
          <div className="bg-white rounded-[20px] w-full min-h-[650px] px-[80px] pt-[80px] pb-[80px]">

            <h1 className="text-2xl font-bold mb-[60px]">My board</h1>

            <div className="flex flex-col gap-6 w-[520px]">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="bg-[#181818] rounded-[24px] px-8 py-6 flex items-center justify-between"
                >
                  {/* 이름 + 점수 */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-white text-lg">{m.name}</span>
                    <span className="text-white text-lg">{m.score.toFixed(1)}</span>
                  </div>

                  {editingId === m.id ? (
                    <div className="flex items-center gap-3">
                      {/* 동그라미 5개 */}
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            onClick={() => handleSelectScore(n)}
                            className={`w-6 h-6 rounded-full border 
                              ${tempScore >= n ? "bg-blue-500 border-blue-500" : "bg-[#303030] border-white"}`}
                          />
                        ))}
                      </div>

                      {/* 완료 버튼 */}
                      <button
                        onClick={handleFinish}
                        className="bg-white rounded-full px-5 py-1 text-sm"
                      >
                        완료
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartRate(m.id, m.score)}
                      className="bg-[#0062FF] text-white rounded-full px-5 py-2 text-sm font-medium"
                    >
                      매너점수 주기
                    </button>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
