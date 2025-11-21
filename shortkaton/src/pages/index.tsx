import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-zinc-100 flex flex-col items-center">
      {/* 상단 공통 Header */}
      <Header />

      {/* 메인 컨테이너 */}
      <img 
        src={"/Main.png"} className="w-280 h-140 cursor-pointer"
      />
    </div>
  );
}
