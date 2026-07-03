import Link from "next/link";

type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps): React.ReactElement {
  return (
    <Link className="flex items-center gap-3" href="/" aria-label="Mystery Scoop home">
      <span className="grid h-12 w-12 place-items-center rounded-[7px] border border-pink-100 bg-white shadow-sm">
        <span className="relative block h-8 w-8 rounded-b-[14px] rounded-t-[5px] border-2 border-slate-800 bg-[#8fe4cd]">
          <span className="absolute -top-3 left-1/2 h-5 w-6 -translate-x-1/2 rounded-full border-2 border-slate-800 bg-[#ff4f8f]" />
          <span className="absolute -right-1 top-2 text-[10px] text-[#f72c7b]">✦</span>
        </span>
      </span>
      {!compact ? (
        <span className="leading-none">
          <span className="block text-2xl font-black tracking-normal">Mystery</span>
          <span className="-mt-1 block text-2xl font-black tracking-normal text-[#f72c7b]">Scoop</span>
        </span>
      ) : null}
    </Link>
  );
}
