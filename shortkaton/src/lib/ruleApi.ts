import axios from "axios";
import { Rules, RuleByID } from "@/types/rule"; // 네가 만든 타입 사용

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

if (!API_BASE_URL) {
  throw new Error("🚨 API_URL이 정의되지 않았습니다! .env.local을 확인하세요.");
}

//1) 규칙 전체 조회 GET /rule

export const getAllRulesApi = async (): Promise<Rules[]> => {
  const url = `${API_BASE_URL}/rule`;

  console.log(`📡 [GET] 규칙 요청 URL → ${url}`);

  try {
    const res = await axios.get(url, { timeout: 5000 });
    return res.data;
  } catch (err) {
    console.error("🔥 [규칙 GET 실패]");

    if (axios.isAxiosError(err)) {
      console.error("📛 AxiosError 메시지:", err.message);
      console.error("📛 응답 상태:", err.response?.status);
      console.error("📛 응답 데이터:", err.response?.data);
      console.error("📛 요청 정보:", err.request);
    } else {
      console.error("❗ 알 수 없는 오류:", err);
    }
    return [];
  }
};

// 2) 규칙 등록 POST /rule
export const postRuleApi = async (memo: string): Promise<RuleByID | null> => {
  const url = `${API_BASE_URL}/rule`;

  console.log(`📡 [POST] 규칙 등록 요청 URL → ${url}`);
  console.log(`📨 보낸 데이터:`, { memo });

  try {
    const res = await axios.post(url, { memo }, { timeout: 5000 });

    console.log("✅ [규칙 등록 성공]", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ [규칙 POST 실패]");

    if (axios.isAxiosError(err)) {
      console.error("📛 Axios 메시지:", err.message);
      console.error("📛 상태 코드:", err.response?.status);
      console.error("📛 서버 응답:", err.response?.data);
      console.error("📛 요청 정보(XHR):", err.request);
      console.error("📛 요청 Config:", err.config);
    } else {
      console.error("❗ 알 수 없는 오류:", err);
    }

    return null;
  }
};

//3) 규칙 삭제 DELETE /rule/{ruleId}

export const deleteRuleApi = async (
  ruleId: number
): Promise<RuleByID | null> => {
  const url = `${API_BASE_URL}/rule/${ruleId}`;

  try {
    const res = await axios.delete(url);
    console.log("[규칙 삭제 성공]", res.data);
    return res.data;
  } catch (err) {
    console.error("[DELETE 실패]", err);
    return null;
  }
};

//4) 규칙 투표 POST /vote/check

interface VoteRequest {
  ruleId: number;
  isCheck: boolean;
}

export const voteRuleApi = async (
  data: VoteRequest
): Promise<RuleByID | null> => {
  const url = `${API_BASE_URL}/vote/check`;

  try {
    const res = await axios.post(url, data);
    console.log("[투표 성공]", res.data);
    return res.data;
  } catch (err) {
    console.error("[POST vote 실패]", err);
    return null;
  }
};
