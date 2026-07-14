import { buildStickerId, parseStickerId } from "../sticker-id";
import type {
	StickerBrowseResult,
	StickerItem,
	StickerProvider,
	StickerSearchResult,
} from "../types";

const ICONS_PROVIDER_ID = "icons";
const DEFAULT_SEARCH_LIMIT = 50;

// Some popular collections for the browse view
const POPULAR_ICONS = [
	"lucide:home",
	"lucide:settings",
	"lucide:user",
	"lucide:camera",
	"lucide:heart",
	"lucide:star",
	"lucide:zap",
	"lucide:bell",
	"logos:youtube-icon",
	"logos:tiktok-icon",
	"logos:twitch",
	"logos:twitter",
	"logos:discord-icon",
	"logos:github-icon",
	"logos:google-icon",
	"logos:apple",
	"logos:react",
	"logos:vue",
	"logos:figma",
	"skill-icons:instagram",
	"skill-icons:linkedin",
	"skill-icons:css",
	"skill-icons:html",
];

function buildIconUrl(iconName: string): string {
	const [prefix, name] = iconName.split(":");
	return `https://api.iconify.design/${prefix}/${name}.svg`;
}

function toStickerItem(iconName: string): StickerItem {
	const [prefix, name] = iconName.split(":");
	const displayName = name.replace(/-/g, " ");
	return {
		id: buildStickerId({
			providerId: ICONS_PROVIDER_ID,
			providerValue: iconName,
		}),
		provider: ICONS_PROVIDER_ID,
		name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
		previewUrl: buildIconUrl(iconName),
		metadata: { prefix, name },
	};
}

export const iconsProvider: StickerProvider = {
	id: ICONS_PROVIDER_ID,
	async search({
		query,
		options,
	}: {
		query: string;
		options?: { limit?: number };
	}): Promise<StickerSearchResult> {
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) {
			return { items: [], total: 0, hasMore: false };
		}

		try {
			const limit = options?.limit ?? DEFAULT_SEARCH_LIMIT;
			const res = await fetch(
				`https://api.iconify.design/search?query=${encodeURIComponent(normalizedQuery)}&limit=${limit}`
			);
			if (!res.ok) throw new Error("Iconify search failed");
			const data = await res.json();
			const icons: string[] = data.icons || [];

			return {
				items: icons.map((icon) => toStickerItem(icon)),
				total: data.total || icons.length,
				hasMore: icons.length < (data.total || 0),
			};
		} catch (error) {
			console.error("Failed to search icons:", error);
			return { items: [], total: 0, hasMore: false };
		}
	},
	async browse({
		options,
	}: {
		options?: { page?: number; limit?: number };
	}): Promise<StickerBrowseResult> {
		const limit = options?.limit ?? 24;
		const page = options?.page ?? 1;
		const startIndex = (page - 1) * limit;
		const items = POPULAR_ICONS.slice(startIndex, startIndex + limit);

		return {
			sections: [
				{
					id: "all",
					title: "Popular Icons",
					items: items.map((icon) => toStickerItem(icon)),
					hasMore: startIndex + limit < POPULAR_ICONS.length,
					layout: "grid",
				},
			],
		};
	},
	resolveUrl({
		stickerId,
	}: {
		stickerId: string;
		options?: { width?: number; height?: number };
	}): string {
		const { providerValue } = parseStickerId({ stickerId });
		return buildIconUrl(providerValue);
	},
};
