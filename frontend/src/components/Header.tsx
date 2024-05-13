import Link from "next/link";

export default function Header() {
  return (
    <nav className="bg-[#F10058] text-white p-4 flex flex-col items-center">
      <Link href="/">
        <h1 className="text-lg font-bold">Checkpoint Frontend</h1>
      </Link>
      <p className="text-lg">Countries</p>
    </nav>
  );
}
