"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	type ArchetypeConfig,
	getArchetypeConfig,
} from "@/lib/config/archetypeConfig";
import { usePersonaStore } from "@/lib/store/personaStore";

// Confetti effect component
function Confetti() {
	const colors = [
		"#10B981",
		"#3B82F6",
		"#8B5CF6",
		"#EC4899",
		"#F59E0B",
		"#6366F1",
	];
	const pieces = Array.from({ length: 50 }, (_, i) => ({
		id: i,
		x: Math.random() * 100,
		delay: Math.random() * 0.5,
		duration: 2 + Math.random() * 2,
		color: colors[Math.floor(Math.random() * colors.length)],
		size: 4 + Math.random() * 6,
		rotation: Math.random() * 360,
	}));

	return (
		<div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
			{pieces.map((piece) => (
				<m.div
					key={piece.id}
					className="absolute rounded-sm"
					style={{
						left: `${piece.x}%`,
						top: -20,
						width: piece.size,
						height: piece.size,
						backgroundColor: piece.color,
						rotate: piece.rotation,
					}}
					initial={{ y: -20, opacity: 1 }}
					animate={{
						y: "100vh",
						opacity: 0,
						rotate: piece.rotation + 720,
					}}
					transition={{
						duration: piece.duration,
						delay: piece.delay,
						ease: "linear",
					}}
				/>
			))}
		</div>
	);
}

export function ArchetypeCelebrationModal() {
	const t = useTranslations("personaLab");
	const router = useRouter();
	const [showConfetti, setShowConfetti] = useState(false);

	// Store state
	const showModal = usePersonaStore((state) => state.showArchetypeModal);
	const archetypeType = usePersonaStore((state) => state.archetypeType);
	const setShowArchetypeModal = usePersonaStore(
		(state) => state.setShowArchetypeModal,
	);

	// Get archetype config
	const config = archetypeType ? getArchetypeConfig(archetypeType) : null;

	// Trigger confetti when modal opens
	useEffect(() => {
		if (showModal && config) {
			setShowConfetti(true);
			const timer = setTimeout(() => setShowConfetti(false), 4000);
			return () => clearTimeout(timer);
		}
	}, [showModal, config]);

	const handleClose = useCallback(() => {
		setShowArchetypeModal(false);
	}, [setShowArchetypeModal]);

	const handleContinue = useCallback(() => {
		setShowArchetypeModal(false);
		router.push("/applications");
	}, [setShowArchetypeModal, router]);

	// Get localized content based on locale
	const getLocalizedContent = (config: ArchetypeConfig) => {
		// For now, use English. In production, detect locale and use Vi if needed.
		return {
			title: config.title,
			tagline: config.tagline,
			description: config.description,
			strengths: config.essayStrengths,
		};
	};

	if (!config) return null;

	const content = getLocalizedContent(config);

	return (
		<AnimatePresence>
			{showModal && (
				<>
					{/* Confetti effect */}
					{showConfetti && <Confetti />}

					{/* Backdrop */}
					<m.div
						className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={handleClose}
					/>

					{/* Modal */}
					<m.div
						className="fixed inset-0 flex items-center justify-center z-50 p-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<m.div
							className="bg-background rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
							initial={{ scale: 0.8, y: 50 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.8, y: 50 }}
							transition={{ type: "spring", damping: 25, stiffness: 300 }}
							onClick={(e) => e.stopPropagation()}
						>
							{/* Close button */}
							<button
								onClick={handleClose}
								className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
								type="button"
							>
								<X className="w-5 h-5 text-muted-foreground" />
							</button>

							{/* Header with gradient */}
							<div
								className="relative pt-8 pb-6 px-6 text-center"
								style={{
									background: `linear-gradient(135deg, ${config.color}15, ${config.color}05)`,
								}}
							>
								{/* Sparkles icon */}
								<m.div
									className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
									style={{ backgroundColor: `${config.color}20` }}
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.2, type: "spring" }}
								>
									<Sparkles
										className="w-4 h-4"
										style={{ color: config.color }}
									/>
									<span
										className="text-xs font-medium"
										style={{ color: config.color }}
									>
										{t("archetypeUnlocked")}
									</span>
								</m.div>

								{/* Archetype image */}
								<m.div
									className="relative w-28 h-28 mx-auto mb-4"
									initial={{ scale: 0, rotate: -180 }}
									animate={{ scale: 1, rotate: 0 }}
									transition={{ delay: 0.3, type: "spring", damping: 15 }}
								>
									<div
										className="absolute inset-0 rounded-full animate-pulse"
										style={{ backgroundColor: `${config.color}20` }}
									/>
									<Image
										src={config.image}
										alt={content.title}
										fill
										className="object-contain p-4"
									/>
								</m.div>

								{/* Title */}
								<m.h2
									className="text-2xl font-bold mb-2"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 }}
								>
									{content.title}
								</m.h2>

								{/* Tagline */}
								<m.p
									className="text-muted-foreground"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 }}
								>
									{content.tagline}
								</m.p>
							</div>

							{/* Content */}
							<div className="px-6 py-4">
								{/* Description */}
								<m.p
									className="text-sm text-muted-foreground mb-4 leading-relaxed"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.6 }}
								>
									{content.description}
								</m.p>

								{/* Essay strengths */}
								<m.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.7 }}
								>
									<h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
										{t("essayStrengths")}
									</h3>
									<div className="flex flex-wrap gap-2">
										{content.strengths.map((strength, index) => (
											<m.div
												key={strength}
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ delay: 0.8 + index * 0.1 }}
											>
												<Badge
													variant="secondary"
													className="text-xs"
													style={{
														backgroundColor: `${config.color}15`,
														color: config.color,
														borderColor: `${config.color}30`,
													}}
												>
													{strength}
												</Badge>
											</m.div>
										))}
									</div>
								</m.div>
							</div>

							{/* Footer */}
							<div className="px-6 pb-6">
								<m.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 1 }}
								>
									<Button
										className="w-full"
										size="lg"
										onClick={handleContinue}
										style={{ backgroundColor: config.color }}
									>
										{t("goToApplications")}
										<ArrowRight className="w-4 h-4 ml-2" />
									</Button>
								</m.div>
							</div>
						</m.div>
					</m.div>
				</>
			)}
		</AnimatePresence>
	);
}
