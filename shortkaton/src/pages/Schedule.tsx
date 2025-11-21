"use client";

import { useState } from "react";
import Header from "@/components/Header";
import axios from "axios";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIMES = [
  "12:00", "01:00", "02:00",
  "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
];

export default function SchedulePage() {
  const [selected, setSelected] = useState<boolean[][]>(
    () => TIMES.map(() => Array(DAYS.length).fill(false))
  );
  const [isLocked, setIsLocked] = useState(false);

  const [isHovering, setIsHovering] = useState(false);
  const [userName, setUserName] = useState("");

  // 실제로 POST된거
  const [submittedNames, setSubmittedNames] = useState<string[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const hasSelected = selected.some(row => row.some(Boolean));

  const handleToggle = (timeIdx: number, dayIdx: number) => {
    setSelected(prev => {
      const copy = prev.map(row => [...row]);
      copy[timeIdx][dayIdx] = !copy[timeIdx][dayIdx];
      return copy;
    });
  };

  const extractSelectedTimeList = () => {
    const result: string[] = [];

    selected.forEach((row, tIdx) => {
      row.forEach((isOn, dIdx) => {
        if (isOn) {
          const time = TIMES[tIdx];
          const [hour, minute] = time.split(":");
          const date = new Date();
          date.setHours(Number(hour), Number(minute), 0, 0);
          result.push(date.toISOString());
        }
      });
    });

    return result;
  };

  const handleSubmit = async () => {
    if (isLocked) {
      setIsLocked(false);
      return;
    }

    if (!userName.trim()) {
      alert("이름을 입력하세요!");
      return;
    }

    const timeList = extractSelectedTimeList();
    if (timeList.length === 0) {
      alert("체크된 시간이 없습니다.");
      return;
    }

    const payload = timeList.map(time => ({
      userName,
      time,
    }));

    try {
      await axios.post(`${API_URL}/schedule`, payload);
      alert("스케줄 저장 완료!");

      setIsLocked(true);

      // POST 성공한 이름을 리스트에 추가 
      setSubmittedNames(prev => {
        if (prev.includes(userName)) return prev;
        return [...prev, userName];
      });
    } catch (error) {
      console.error("POST /schedule 실패:", error);
      alert("스케줄 저장 실패… 콘솔을 확인해봐.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-200">
      <Header />
      <div className="flex justify-center mt-10">
        <div className="w-[1100px] flex justify-center">
          <div className="bg-white rounded-[30px] w-[1000px] min-h-[950px] pt-[100px] pb-[80px] px-[80px] relative">

            {/* 전체 박스 센터 */}
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-semibold mb-6">Schedule</h2>

              {/* 요일 */}
              <div className="flex items-center gap-[35px] mb-[20px] text-xl font-semibold">
                <span className="w-[60px]" />
                <div className="flex gap-[23px]">
                  {DAYS.map(day => (
                    <span key={day} className="text-black">
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              {/* 시간표 */}
              <div className="flex flex-col gap-[18px] text-lg">
                {TIMES.map((time, timeIdx) => (
                  <div key={time} className="flex flex-col items-center">
                    <div
                      className={`flex items-center gap-[35px] ${
                        time === "07:00" ? "mt-[35px]" : ""
                      }`}
                    >
                      <span className="w-[60px] font-semibold text-black text-left">
                        {time}
                      </span>

                      <div className="flex gap-[30px]">
                        {DAYS.map((_, dayIdx) => {
                          const isOn = selected[timeIdx][dayIdx];
                          return (
                            <button
                              key={dayIdx}
                              type="button"
                              onClick={() => handleToggle(timeIdx, dayIdx)}
                              onMouseEnter={() => {
                                if (isOn) setIsHovering(true);
                              }}
                              onMouseLeave={() => setIsHovering(false)}
                              className={`w-[30px] h-[30px] rounded-full border border-black ${
                                isOn ? "bg-[#0062FF]" : "bg-white"
                              } cursor-pointer`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {time === "02:00" && (
                      <div className="mt-[50px] mb-[10px] w-full flex justify-center">
                        <div className="border-t border-dashed border-gray-400 w-[530px]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 안내문 + 완료/수정 버튼 */}
              <div className="mt-10 flex flex-col items-center">
                {!hasSelected && (
                  <span className="text-2xl text-gray-600 mb-4">
                    *방에 있는 시간을 체크해주세요
                  </span>
                )}

                {hasSelected && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className={`w-[500px] py-3 text-white rounded-[5px] mt-4
                      ${isLocked ? "bg-[#0062FF]" : "bg-black"}`}
                  >
                    {isLocked ? "수정" : "완료"}
                  </button>
                )}
              </div>
            </div>

            {/* Name 입력 박스 (오른쪽 아래) */}
            <div className="absolute right-[40px] bottom-[40px] bg-gray-200 rounded-xl p-4 w-[120px] h-[90px]">
              <div className="text-sm mb-1 font-semibold">Name</div>
              <input
                type="text"
                placeholder="이름"
                className="w-full bg-transparent outline-none"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            {/* 파란 원 hover 시 → 지금까지 POST된 이름들 표시 */}
            {isHovering && submittedNames.length > 0 && (
              <div className="absolute right-[150px] top-[440px] text-base leading-7 text-black">
                {submittedNames.map(name => (
                  <div key={name}>{name}</div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
