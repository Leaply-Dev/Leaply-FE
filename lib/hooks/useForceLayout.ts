"use client";

export type LayerNumber = 0 | 1 | 2 | 3;

// Graph list view consumes this shared sizing/color config.
export const LAYOUT_CONFIG = {
	nodeSize: {
		0: 90,
		1: 55,
		2: 40,
		3: 24,
	} as Record<LayerNumber, number>,
	colors: {
		0: "#6366F1",
		1: "#8B5CF6",
		2: "#10B981",
		3: "#94A3B8",
	} as Record<LayerNumber, string>,
	labelOffset: {
		0: 60,
		1: 42,
		2: 32,
		3: 22,
	} as Record<LayerNumber, number>,
	labelFontSize: {
		0: 12,
		1: 10,
		2: 9,
		3: 8,
	} as Record<LayerNumber, number>,
	labelMaxChars: {
		0: 20,
		1: 15,
		2: 12,
		3: 10,
	} as Record<LayerNumber, number>,
	forces: {
		centerStrength: 0.03,
		chargeStrength: -150,
		linkDistance: 100,
		linkStrength: 0.7,
		collideRadius: 30,
		alphaDecay: 0.015,
		velocityDecay: 0.3,
	},
};
