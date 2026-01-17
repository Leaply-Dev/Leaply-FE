/**
 * Custom FormData function for Orval v8
 * This ensures proper FormData handling for file uploads
 */

export const customFormDataFn = <Body>(body: Body): FormData => {
	const formData = new FormData();

	if (body && typeof body === "object") {
		for (const [key, value] of Object.entries(body)) {
			if (value instanceof File || value instanceof Blob) {
				formData.append(key, value);
			} else if (value !== undefined && value !== null) {
				formData.append(key, String(value));
			}
		}
	}

	return formData;
};
