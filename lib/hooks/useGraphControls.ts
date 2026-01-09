import { useCallback, useState } from "react";
import type { ForceGraphMethods } from "react-force-graph-2d";

export function useGraphControls(
	fgRef: React.RefObject<ForceGraphMethods | undefined>,
) {
	const [showLabels, setShowLabels] = useState(true);

	const handleZoomIn = useCallback(() => {
		if (fgRef.current) {
			fgRef.current.zoom(1.5, 500);
		}
	}, [fgRef]);

	const handleZoomOut = useCallback(() => {
		if (fgRef.current) {
			fgRef.current.zoom(0.5, 500);
		}
	}, [fgRef]);

	const handleFitView = useCallback(() => {
		if (fgRef.current) {
			fgRef.current.zoomToFit(400, 50);
		}
	}, [fgRef]);

	const toggleLabels = useCallback(() => {
		setShowLabels((prev) => !prev);
	}, []);

	return {
		showLabels,
		handleZoomIn,
		handleZoomOut,
		handleFitView,
		toggleLabels,
	};
}
