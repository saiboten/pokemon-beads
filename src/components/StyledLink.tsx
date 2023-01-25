import Link from "next/link";

export const StyledLink = ({ text, link }: { text: string; link: string }) => {
  return (
    <Link
      className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
      href={link}
    >
      {text}
    </Link>
  );
};
