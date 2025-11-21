// src/apis/scheduleApi.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL 이 설정되어 있지 않습니다.");
}

export type ScheduleItem = {
  userName: string;
  time: string;
};

export async function postSchedule(items: ScheduleItem[]) {
  await axios.post(`${API_URL}/schedule`, items, {
    headers: { "Content-Type": "application/json" },
  });
}

export async function patchSchedule(items: ScheduleItem[]) {
  await axios.patch(`${API_URL}/schedule`, items, {
    headers: { "Content-Type": "application/json" },
  });
}
