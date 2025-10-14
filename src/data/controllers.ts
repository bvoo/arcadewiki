export type DimensionsMm = {
  width: number;
  depth: number;
  height: number;
};

export type Controller = {
  id: string;
  name: string;
  maker: string;
  buttonType: "digital" | "analog";
  priceUSD?: number;
  link?: string;
  currentlySold: boolean;
  releaseYear: number;
  switchType?: string[];
  weightGrams?: number;
  dimensionsMm?: DimensionsMm;
};

export type ControllerIdentity = {
  company: string;
  controller: string;
};

export type ControllerMeta = Controller & ControllerIdentity;

export type ControllerWithSlug = ControllerMeta & {
  slug: string;
};

export function getButtonTypeBadge(
  buttonType?: Controller["buttonType"] | null,
) {
  const normalized = (buttonType ?? "").toString().toLowerCase();
  const label = normalized
    ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
    : "";
  const variant: "default" | "secondary" =
    normalized === "analog" ? "default" : "secondary";
  return { label, variant };
}
