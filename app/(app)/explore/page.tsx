import { ExploreClient } from "@/components/explore/ExploreClient";

export default async function ExplorePage() {
	// Client-side data fetching via TanStack Query hooks in ExploreClient
	// No initial data from server - hooks will fetch data on mount
	return <ExploreClient />;
}
