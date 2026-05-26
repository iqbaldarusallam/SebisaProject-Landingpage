export const PACKAGE_CATEGORIES = [
  {
    id: "social-media-management",
    title: "Social Media Management",
    subtitle: "Pilih paket sesuai dengan kebutuhan kamu!",
  },
  {
    id: "graphic-design",
    title: "Design Graphic",
    subtitle: "Kebutuhan Desain kamu ada disini!",
  },
] as const;

export type PackageCategoryId = (typeof PACKAGE_CATEGORIES)[number]["id"];

export function getPackageCategoryTitle(categoryId: string) {
  return (
    PACKAGE_CATEGORIES.find((category) => category.id === categoryId)?.title ??
    "Lainnya"
  );
}
