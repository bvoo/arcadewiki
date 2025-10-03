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
	dimensionsMm?: { width: number; depth: number; height: number };
};
