import CardPacket from "./CardPacket";
import MotionReveal from "./MotionReveal";
import { prisma } from "@/lib/db";
import { PACKAGE_CATEGORIES } from "@/lib/package-categories";

function parseFeatures(features: string) {
  const trimmed = features.trim();

  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
  } catch {
    return trimmed
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

export default async function PacketSection() {
  const packages = await prisma.package.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <section id="paket" className="bg-[#E9E9E9] px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">
        {packages.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-700">
            <p className="text-xl font-semibold">Belum ada paket tersedia.</p>
            <p className="mt-2 text-sm text-slate-500">
              Tambahkan paket di admin panel terlebih dahulu sebelum melakukan
              checkout.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {PACKAGE_CATEGORIES.map((category) => {
              const categoryPackages = packages.filter(
                (item) => item.category === category.id,
              );

              if (categoryPackages.length === 0) {
                return null;
              }

              return (
                <div key={category.id}>
                  <MotionReveal className="mb-8 text-center">
                    <h2 className="text-2xl font-extrabold leading-tight text-[#0072A8] sm:text-3xl md:text-4xl">
                      Paket {category.title}
                    </h2>
                    <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[#0072A8] sm:text-base">
                      {category.subtitle}
                    </p>
                  </MotionReveal>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                    {categoryPackages.map((item, index) => {
                      const hasSalePrice =
                        item.salePrice !== null &&
                        item.salePrice !== undefined &&
                        item.salePrice < item.price;

                      return (
                        <MotionReveal
                          key={item.id}
                          className="min-w-0"
                          delay={index * 0.06}
                          y={16}
                          once
                        >
                          <CardPacket
                            id={item.id}
                            badgeType={item.badgeType}
                            badgeText={item.badgeText ?? undefined}
                            title={item.name}
                            price={hasSalePrice ? item.salePrice! : item.price}
                            oldPrice={hasSalePrice ? item.price : undefined}
                            duration={item.duration ?? undefined}
                            description={item.description}
                            features={parseFeatures(item.features)}
                          />
                        </MotionReveal>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
