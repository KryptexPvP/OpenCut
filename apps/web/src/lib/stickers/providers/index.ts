import { stickersRegistry } from "../registry";
import type { StickerProvider } from "@/lib/stickers/types";
import { flagsProvider } from "./flags";
import { logosProvider } from "./logos";
import { shapesProvider } from "./shapes";
import { emojisProvider } from "./emojis";
import { iconsProvider } from "./icons";

const defaultProviders: StickerProvider[] = [
	logosProvider,
	flagsProvider,
	shapesProvider,
	emojisProvider,
	iconsProvider,
];

export function registerDefaultStickerProviders({
	providersToRegister = defaultProviders,
}: {
	providersToRegister?: StickerProvider[];
} = {}): void {
	for (const provider of providersToRegister) {
		if (stickersRegistry.has(provider.id)) {
			continue;
		}
		stickersRegistry.register(provider.id, provider);
	}
}
