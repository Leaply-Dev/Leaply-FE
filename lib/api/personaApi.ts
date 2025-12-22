import type { TrackId, DiscoveryTrack, KeyStory, PersonalityTag, EssayAngle } from "@/lib/store/personaStore";

export interface PersonaData {
    tracks: DiscoveryTrack[];
    keyStories: KeyStory[];
    personalityTags: PersonalityTag[];
    essayAngles: EssayAngle[];
}

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const personaApi = {
    async getPersonaData(): Promise<PersonaData> {
        await delay(800);
        // In a real app, this would fetch from /api/persona
        return {
            tracks: [], // Initially empty or demo data
            keyStories: [],
            personalityTags: [],
            essayAngles: [],
        };
    },

    async updateTrackStatus(trackId: TrackId, status: "locked" | "available" | "completed"): Promise<void> {
        await delay(500);
        console.log(`API: Updated track ${trackId} status to ${status}`);
    },

    async generateInsight(trackId: TrackId): Promise<{ insight: string; angles: string[] }> {
        await delay(1500);
        // Mock AI generation
        return {
            insight: "Leaply AI has identified a pattern of cross-disciplinary innovation in your stories.",
            angles: [
                "Bridging the gap between theory and social impact",
                "How community-led research shaped your academic goals"
            ]
        };
    }
};
