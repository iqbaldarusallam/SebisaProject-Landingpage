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
  const showPromoActions = Boolean(promo?.code && promo?.endDate);
  const trimmedPromoText = promoText.trim();
  const claimHref = showPromoActions
    ? `/?promo=${encodeURIComponent(promo!.code)}#paket`
    : "";

  return (
    <div className="fixed top-0 z-50 w-full bg-[#131C36] shadow-sm">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-8 lg:px-14">
        <Logo className="w-20 shrink-0 sm:w-28 lg:w-32" />

        {trimmedPromoText && (
          <h1 className="min-w-0 flex-1 truncate text-center text-[8px] font-semibold uppercase leading-none text-white sm:text-xs md:text-sm lg:text-lg">
            {trimmedPromoText}
          </h1>
        )}

        {showPromoActions && (
          <PromoCountdown
            claimHref={claimHref}
            endDate={new Date(promo!.endDate!)}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
