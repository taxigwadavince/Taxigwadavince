export const driverCardStyles = [
  { id: "classique", number: "01", name: "Badge classique", description: "L’esprit de la carte d’origine, avec un portrait, son attache dorée et le damier taxi." },
  { id: "signature", number: "02", name: "Vert profond", description: "Un fond vert profond, un liseré jaune et un grand portrait à droite. La carte retenue pour présenter Vincent." },
  { id: "editorial", number: "03", name: "Éditorial", description: "Une grande photo, des lignes épurées et une typographie généreuse. Le contact humain au premier plan." },
  { id: "billet", number: "04", name: "Billet de voyage", description: "Un billet crème et jaune, des découpes et un itinéraire graphique. Une invitation à découvrir l’île." },
] as const;

export type DriverCardStyle = (typeof driverCardStyles)[number]["id"];

export const DEFAULT_DRIVER_CARD_STYLE: DriverCardStyle = "signature";

export function isDriverCardStyle(value: unknown): value is DriverCardStyle {
  return driverCardStyles.some((style) => style.id === value);
}
