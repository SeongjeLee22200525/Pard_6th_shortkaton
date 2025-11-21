import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-zinc-100 flex flex-col items-center">
      {/* 상단 공통 Header */}
      <Header />

      {/* 메인 컨테이너 */}
      <div className="w-[1180px] h-[584px] bg-zinc-900 rounded-[50px]">
        <div className="text-white px-12 py-14">
          
          {/* 제목 */}
          <h1 className="text-5xl font-bold mb-8">
            Bang:Board
          </h1>

          {/* 설명 텍스트 */}
          <div className="text-4xl leading-[3.2rem] font-medium">
            Be nice <br />
            Be considerate <br />
            Dorm life gets better
          </div>

        </div>
      </div>
    </div>
  );
}
