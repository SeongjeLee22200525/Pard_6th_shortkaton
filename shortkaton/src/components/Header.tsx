"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname().toLowerCase(); 

  const isSchedule = pathname.includes("schedule");
  const isRule = pathname.includes("rules");
  const isMypage = pathname.includes("mypage");

  // 공통 스타일
  const baseStyle = "text-2xl px-4 py-1 rounded-[15px] transition-colors";

  return (
    <header className="w-full bg-gray-100 flex items-center justify-between px-20 pt-8 pb-6">
      <div>
        <Image
          src="/logo.svg"
          alt="BBD Logo"
          width={100}
          height={60}
        />
      </div>

      {/* 네비게이션 */}
      <nav className="flex items-center gap-10 text-sm font-medium">

        {/* Schedule */}
        <Link
          href="/Schedule"
          className={
            baseStyle +
            (isSchedule
              ? " bg-black text-white"
              : " text-black hover:bg-black/10")
          }
        >
          Schedule
        </Link>

        {/* Rule */}
        <Link
          href="/makeRule"
          className={
            baseStyle +
            (isRule
              ? " bg-black text-white"
              : " text-black hover:bg-black/10")
          }
        >
          Rule
        </Link>

        {/* My Page */}
        <Link
          href="/Mypage"
          className={
            baseStyle +
            (isMypage
              ? " bg-black text-white"
              : " text-black hover:bg-black/10")
          }
        >
          My page
        </Link>

      </nav>
    </header>
  );
}
