import { resolveStickerId } from "@/lib/stickers";
import {
	VisualNode,
	type ResolvedVisualSourceNodeState,
	type VisualNodeParams,
} from "./visual-node";

export interface StickerNodeParams extends VisualNodeParams {
	stickerId: string;
	intrinsicWidth?: number;
	intrinsicHeight?: number;
}

interface CachedStickerSource {
	source: HTMLImageElement;
	width: number;
	height: number;
}

const stickerSourceCache = new Map<string, Promise<CachedStickerSource>>();

export function loadStickerSource({
	stickerId,
}: {
	stickerId: string;
}): Promise<CachedStickerSource> {
	const cached = stickerSourceCache.get(stickerId);
	if (cached) return cached;

	const promise = (async (): Promise<CachedStickerSource> => {
		const url = resolveStickerId({
			stickerId,
			options: { width: 200, height: 200 },
		});

		const image = new Image();
		image.crossOrigin = "anonymous";

		await new Promise<void>((resolve, reject) => {
			image.onload = () => resolve();
			image.onerror = () =>
				reject(new Error(`Failed to load sticker: ${stickerId}`));
			image.src = url;
		});

		let naturalWidth = image.naturalWidth;
		let naturalHeight = image.naturalHeight;

		const MIN_RESOLUTION = 512;
		if (naturalWidth > 0 && naturalHeight > 0 && (naturalWidth < MIN_RESOLUTION || naturalHeight < MIN_RESOLUTION)) {
			const scale = MIN_RESOLUTION / Math.max(naturalWidth, naturalHeight);
			const scaledWidth = Math.round(naturalWidth * scale);
			const scaledHeight = Math.round(naturalHeight * scale);

			try {
				const canvas = new OffscreenCanvas(scaledWidth, scaledHeight);
				const ctx = canvas.getContext("2d");
				if (ctx) {
					ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);
					return { source: canvas, width: scaledWidth, height: scaledHeight };
				}
			} catch {
				const canvas = document.createElement("canvas");
				canvas.width = scaledWidth;
				canvas.height = scaledHeight;
				const ctx = canvas.getContext("2d");
				if (ctx) {
					ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);
					return { source: canvas, width: scaledWidth, height: scaledHeight };
				}
			}
		}

		return { source: image, width: naturalWidth, height: naturalHeight };
	})();

	stickerSourceCache.set(stickerId, promise);
	return promise;
}

export class StickerNode extends VisualNode<
	StickerNodeParams,
	ResolvedVisualSourceNodeState
> {}
