import { buildStickerId, parseStickerId } from "../sticker-id";
import type {
	StickerBrowseResult,
	StickerItem,
	StickerProvider,
	StickerSearchResult,
} from "../types";

const EMOJIS_PROVIDER_ID = "emojis";
const DEFAULT_SEARCH_LIMIT = 100;

export interface EmojiRecord {
	emoji: string;
	id: string;
	url: string;
}

// A much larger hardcoded list of common emojis
const MORE_EMOJIS: string[] = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
  "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
  "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗",
  "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐",
  "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾",
  "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎",
  "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "✌️", "🤟", "🤘", "👌",
  "🤌", "🤏", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐️", "🖖", "👋", "🤙", "💪", "🦾", "🖕", "✍️", "🙏", "🔥", "✨",
  "🌟", "💫", "💥", "💢", "💦", "💧", "💤", "💨", "👂", "🦻", "👃", "🧠", "🦷", "🦴", "👀", "👁️", "👅", "👄", "💋", "🩸",
  "🐵", "🐒", "🦍", "🦧", "🐶", "🐕", "🦮", "🐩", "🐺", "🦊", "🦝", "🐱", "🐈", "🦁", "🐯", "🐅", "🐆", "🐴", "🐎", "🦄",
  "🦓", "🦌", "🦬", "🐮", "🐂", "🐃", "🐄", "🐷", "🐖", "🐗", "🐽", "🐏", "🐑", "🐐", "🐪", "🐫", "🦙", "🦒", "🐘", "🦣",
  "🦏", "🦛", "🐭", "🐁", "🐀", "🐹", "🐰", "🐇", "🐿️", "🦫", "🦔", "🦇", "🐻", "🐨", "🐼", "🦥", "🦦", "🦨", "🦘",
  "🦡", "🐾", "🦃", "🐔", "🐓", "🐣", "🐤", "🐥", "🐦", "🐧", "🕊️", "🦅", "🦆", "🦢", "🦉", "🦤", "🪶", "🦩", "🦚", "🦜",
  "🐸", "🐊", "🐢", "🦎", "🐍", "🐲", "🐉", "🦕", "🦖", "🐳", "🐋", "🐬", "🦭", "🐟", "🐠", "🐡", "🦈", "🐙", "🐚", "🐌",
  "🦋", "🐛", "🐜", "🐝", "🪲", "🐞", "🦗", "🪳", "🕷️", "🕸️", "🦂", "🦟", "🪰", "🪱", "🦠", "💐", "🌸", "💮", "🏵️", "🌹",
  "🥀", "🌺", "🌻", "🌼", "🌷", "🌱", "🪴", "🌲", "🌳", "🌴", "🌵", "🌾", "🌿", "☘️", "🍀", "🍁", "🍂", "🍃", "🍇", "🍈",
  "🍉", "🍊", "🍋", "🍌", "🍍", "🥭", "🍎", "🍏", "🍐", "🍑", "🍒", "🍓", "🫐", "🥝", "🍅", "🫒", "🥥", "🥑", "🍆", "🥔",
  "🥕", "🌽", "🌶️", "🫑", "🥒", "🥬", "🥦", "🧄", "🧅", "🍄", "🥜", "🌰", "🍞", "🥐", "🥖", "🫓", "🥨", "🥯", "🥞", "🧇",
  "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯", "🫔", "🥙", "🧆", "🥚", "🍳", "🥘", "🍲", "🫕",
  "🥣", "🥗", "🍿", "🧈", "🧂", "🥫", "🍱", "🍘", "🍙", "🍚", "🍛", "🍜", "🍝", "🍠", "🍢", "🍣", "🍤", "🍥", "🥮", "🍡"
];

function toCodePoint(unicodeSurrogates: string): string {
  const r = [];
  let c = 0, p = 0, i = 0;
  while (i < unicodeSurrogates.length) {
    c = unicodeSurrogates.charCodeAt(i++);
    if (p) {
      r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16));
      p = 0;
    } else if (0xD800 <= c && c <= 0xDBFF) {
      p = c;
    } else {
      if (c !== 0xFE0F) {
         r.push(c.toString(16));
      }
    }
  }
  return r.join('-');
}

function getEmojiUrl(cp: string): string {
	return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${cp}.svg`;
}

let cachedEmojis: EmojiRecord[] | null = null;

async function loadEmojis(): Promise<EmojiRecord[]> {
	if (cachedEmojis) {
		return cachedEmojis;
	}

	cachedEmojis = MORE_EMOJIS.map(emoji => {
		const cp = toCodePoint(emoji);
		return {
			emoji,
			id: cp,
			url: getEmojiUrl(cp),
		};
	});

	return cachedEmojis;
}

function toStickerItem({ emoji }: { emoji: EmojiRecord }): StickerItem {
	return {
		id: buildStickerId({
			providerId: EMOJIS_PROVIDER_ID,
			providerValue: emoji.id,
		}),
		provider: EMOJIS_PROVIDER_ID,
		name: emoji.emoji,
		previewUrl: emoji.url,
		metadata: {
			emoji: emoji.emoji,
			code: emoji.id,
		},
	};
}

function paginateEmojis({
	emojis,
	options,
}: {
	emojis: EmojiRecord[];
	options?: { page?: number; limit?: number };
}): { items: EmojiRecord[]; hasMore: boolean; total: number } {
	if (!options || options.limit === undefined) {
		return { items: emojis, hasMore: false, total: emojis.length };
	}
	const page = Math.max(1, options.page ?? 1);
	const limit = Math.max(1, options.limit);
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	return {
		items: emojis.slice(startIndex, endIndex),
		hasMore: endIndex < emojis.length,
		total: emojis.length,
	};
}

export const emojisProvider: StickerProvider = {
	id: EMOJIS_PROVIDER_ID,
	async search({
		query,
		options,
	}: {
		query: string;
		options?: { limit?: number };
	}): Promise<StickerSearchResult> {
		const emojis = await loadEmojis();
		const normalizedQuery = query.trim().toLowerCase();
		
		const filteredEmojis = normalizedQuery 
		    ? emojis.filter(e => e.emoji === normalizedQuery || e.id.includes(normalizedQuery))
		    : emojis;

		const paged = paginateEmojis({
			emojis: filteredEmojis,
			options: {
				page: 1,
				limit: options?.limit ?? DEFAULT_SEARCH_LIMIT,
			},
		});
		return {
			items: paged.items.map((emoji) => toStickerItem({ emoji })),
			total: paged.total,
			hasMore: paged.hasMore,
		};
	},
	async browse({
		options,
	}: {
		options?: { page?: number; limit?: number };
	}): Promise<StickerBrowseResult> {
		const emojis = await loadEmojis();
		const paged = paginateEmojis({ emojis, options });
		return {
			sections: [
				{
					id: "all",
					title: "Emojis",
					items: paged.items.map((emoji) => toStickerItem({ emoji })),
					hasMore: paged.hasMore,
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
		return getEmojiUrl(providerValue);
	},
};
