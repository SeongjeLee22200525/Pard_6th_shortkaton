"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { getAllRulesApi, postRuleApi, voteRuleApi, deleteRuleApi } from "@/lib/ruleApi";
import { Rules } from "@/types/rule";

export default function RulePage() {
  const [rules, setRules] = useState<Rules[]>([]);
  const [memo, setMemo] = useState("");
  const [userName, setUserName] = useState("");

  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [trashState, setTrashState] = useState<{
    [key: number]: { clicked: boolean; count: number };
  }>({});

  // ============ 규칙 조회 ============
  const fetchRules = async () => {
    console.log("⭐ fetchRules() 호출됨");
    try {
      const data = await getAllRulesApi();
      console.log("⭐ fetchRules() API 응답:", data);
      setRules(data);
    } catch (e) {
      console.log("❌ fetchRules() 오류:", e);
    }
  };

  useEffect(() => {
    console.log("⭐ useEffect 첫 실행 → 규칙 불러오기");
    fetchRules();
  }, []);

  const confirmed = rules.filter((r) => r.available === true);
  const suggestion = rules.filter((r) => r.available === false);

  // ============ 이름 체크 ============
  const requireName = () => {
    console.log("⭐ requireName() 호출됨 → userName:", userName);
    if (!userName.trim()) {
      alert("이름을 입력해주세요!");
      return false;
    }
    return true;
  };

  // ============ 제안 추가 ============
  const handleAdd = async () => {
    console.log("⭐ handleAdd() 호출됨 → memo:", memo);

    if (!memo.trim()) {
      console.log("❌ memo 비어 있어서 중단");
      return;
    }

    try {
      await postRuleApi(memo);
      console.log("⭐ postRuleApi 성공");
    } catch (e) {
      console.log("❌ postRuleApi 실패:", e);
    }

    setMemo("");
    setAddMode(false);
    fetchRules();
  };

  // ============ 제안 → 확정 ============
  const handleVoteTrue = async (ruleId: number) => {
    console.log("⭐ handleVoteTrue() ruleId:", ruleId);

    if (!requireName()) return;

    try {
      await voteRuleApi({
        ruleId,
        isCheck: true,
        userName,
      });
      console.log("⭐ voteRuleApi 성공");
    } catch (e) {
      console.log("❌ voteRuleApi 실패:", e);
    }

    fetchRules();
  };

  // ============ 실제 삭제 API ============
  const handleDeleteReal = async (ruleId: number) => {
    console.log("⭐ handleDeleteReal() ruleId:", ruleId);

    try {
      await deleteRuleApi(ruleId);
      console.log("⭐ deleteRuleApi 성공");
    } catch (e) {
      console.log("❌ deleteRuleApi 실패:", e);
    }

    fetchRules();
  };

  // ============ 쓰레기통 클릭 ============
  const handleTrashClick = (ruleId: number) => {
    console.log("⭐ handleTrashClick() 호출됨 → ruleId:", ruleId);

    if (!editMode) {
      console.log("❌ editMode = false → 중단");
      return;
    }
    if (!requireName()) return;

    const currentState = trashState[ruleId];
    console.log("⭐ 현재 trashState[ruleId]:", currentState);

    // 첫 클릭
    if (!currentState) {
      console.log("⭐ 첫 클릭 - 빨간색 + count 증가");

      setTrashState((prev) => {
        const updated = {
          ...prev,
          [ruleId]: { clicked: true, count: 1 },
        };
        console.log("⭐ 업데이트된 trashState:", updated);
        return updated;
      });

      return;
    }

    // 두 번째 클릭 → 삭제 confirm
    console.log("⭐ 두 번째 클릭 - 삭제 Confirm");

    const ok = confirm(
      `정말 이 규칙을 삭제하시겠습니까?\n(삭제 투표 수: ${currentState.count})`
    );
    if (!ok) {
      console.log("❌ 삭제 취소됨");
      return;
    }

    handleDeleteReal(ruleId);

    setTrashState((prev) => {
      const copy = { ...prev };
      delete copy[ruleId];
      console.log("⭐ 삭제 후 trashState:", copy);
      return copy;
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#F3F3F3]">
      <Header />

      <div className="w-full flex justify-center mt-10">
        <div className="w-[1280px] bg-white rounded-[40px] p-12 shadow-sm">
          <h2 className="text-center text-2xl font-extrabold mb-12">Rule</h2>

          <div className="flex gap-12 w-full justify-center">
            {/* ================= 확정 박스 ================= */}
            <div className="w-[430px] h-[300px] border-2 border-black bg-black rounded-xl p-6 flex flex-col justify-between">
              <h3 className="font-bold mb-4 text-white">확정</h3>

              {/* 내용 영역 */}
              <div className="flex-1 flex items-center justify-center text-sm w-full">
                {confirmed.length === 0 ? (
                  <div className="text-gray-400">확정된 규칙이 없습니다.</div>
                ) : (
                  <ul className="w-full space-y-2">
                    {confirmed.map((r) => (
                      <li
                        key={r.ruleId}
                        className="flex justify-between items-center text-white"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={editMode ? "/bluepin.svg" : "/Vector.svg"}
                            className="w-4 h-4"
                          />
                          {r.memo}
                        </div>

                        {editMode && (
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                trashState[r.ruleId]?.clicked
                                  ? "/after.svg"
                                  : "/before.svg"
                              }
                              onClick={() => handleTrashClick(r.ruleId)}
                              className="w-4 h-4 cursor-pointer"
                            />
                            {trashState[r.ruleId] && (
                              <span className="text-red-400 text-xs">
                                {trashState[r.ruleId].count}
                              </span>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 수정 버튼 */}
              <div className="flex justify-end">
                {confirmed.length > 0 && (
                  <button
                    className="w-24 py-2 bg-blue-600 text-white rounded-md"
                    onClick={() => {
                      console.log("⭐ 수정 버튼 클릭됨");
                      console.log("⭐ 현재 editMode:", editMode);

                      setEditMode((prev) => {
                        console.log("⭐ setEditMode prev:", prev);
                        return !prev;
                      });

                      if (editMode) {
                        console.log("⭐ editMode 종료 → trashState 초기화");
                        setTrashState({});
                      }

                      console.log("⭐ 현재 trashState:", trashState);
                    }}
                  >
                    {editMode ? "완료" : "수정"}
                  </button>
                )}
              </div>
            </div>

            {/* ================= 제안 박스 ================= */}
            <div className="w-[430px] h-[300px] border-2 bg-black border-black rounded-xl p-6 flex flex-col justify-between">
              <h3 className="font-bold mb-4 text-white">제안</h3>

              <div className="flex-1 flex items-center justify-center text-sm">
                {suggestion.length === 0 ? (
                  <div className="text-gray-400">제안된 규칙이 없습니다.</div>
                ) : (
                  <ul className="w-full space-y-2">
                    {suggestion.map((r) => (
                      <li
                        key={r.ruleId}
                        className="flex justify-between items-center text-white"
                      >
                        {r.memo}
                        <button
                          className="text-green-600 font-bold text-lg"
                          onClick={() => handleVoteTrue(r.ruleId)}
                        >
                          +
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 추가 버튼 / 입력 */}
              <div className="flex justify-end w-full">
                {!addMode ? (
                  <button
                    className="w-24 py-2 bg-[#3A66FF] text-white rounded-md"
                    onClick={() => {
                      console.log("⭐ 추가 버튼 클릭됨");
                      setAddMode(true);
                    }}
                  >
                    추가
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      className="border px-3 py-1 bg-blue-600 text-white rounded-md text-sm w-[200px]"
                      placeholder="새 규칙 추가"
                      value={memo}
                      onChange={(e) => {
                        console.log("⭐ memo 입력 변경:", e.target.value);
                        setMemo(e.target.value);
                      }}
                    />
                    <button
                      className="w-24 py-2 bg-blue-600 text-white rounded-md"
                      onClick={handleAdd}
                    >
                      완료
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Name 입력 */}
          <div className="flex justify-end mt-10">
            <div className="bg-[#E8E8E8] rounded-xl px-6 py-4 text-sm">
              <p className="font-semibold">Name</p>
              <input
                type="text"
                value={userName}
                onChange={(e) => {
                  console.log("⭐ userName 변경:", e.target.value);
                  setUserName(e.target.value);
                }}
                className="mt-1 px-2 py-1 w-[120px] rounded-md border"
                placeholder="이름 입력"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
