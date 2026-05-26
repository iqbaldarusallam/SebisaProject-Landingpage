import Logo from "./Logo";
import PromoCountdown from "./PromoCountdown";

type Promo = {
  name: string;
  code: string;
  description: string;
  startDate: string | Date | null;
  endDate: string | Date | null;
};

interface NavbarProps {
  promo?: Promo;
  promoText: string;
}

const Navbar = ({ promo, promoText }: NavbarProps) => {
  const hasCountdown = Boolean(promo?.endDate);
  const trimmedPromoText = promoText.trim();
  const claimHref = promo?.code
    ? `/?promo=${encodeURIComponent(promo.code)}#paket`
    : "#paket";

  return (
    <div className="fixed top-0 z-50 w-full bg-[#131C36] shadow-sm">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-8 lg:px-14">
        <Logo className="w-20 shrink-0 sm:w-28 lg:w-32" />

        {trimmedPromoText && (
          <h1 className="min-w-0 flex-1 truncate text-center text-[8px] font-semibold uppercase leading-none text-white sm:text-xs md:text-sm lg:text-lg">
            {trimmedPromoText}
          </h1>
        )}

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {hasCountdown ? (
            <PromoCountdown endDate={new Date(promo!.endDate!)} />
          ) : (
            <div className="rounded-full bg-red-600 px-2.5 py-1.5 text-[9px] font-semibold text-white shadow-lg shadow-red-950/20 sm:px-4 sm:py-2 sm:text-xs">
              Promo belum aktif
            </div>
          )}

          <a
            href={claimHref}
            className="inline-flex min-h-7 items-center justify-center rounded-md border border-white/70 px-2 py-1 text-[8px] font-extrabold uppercase leading-tight text-white transition hover:bg-white hover:text-[#131C36] sm:min-h-8 sm:px-5 sm:text-[10px]"
          >
            CLAIM SEKARANG
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
