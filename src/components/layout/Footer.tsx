import SentinelBadge from "@/components/sech/SentinelBadge";
export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-[#000000]">
      <SentinelBadge />
      <div className="bg-[#000000] text-white py-4 px-6 text-center text-xs">
        <p>
          ONX Civilization Platform &copy; 2026 | All rights reserved by
          Mohammed Shaheen
        </p>
      </div>
    </footer>
  );
}
