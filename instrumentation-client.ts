// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: "https://e57948157cff4cc9a0dd76a2a338fb15@app.glitchtip.com/19431",

	// Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
	tracesSampleRate: 1,
	// Enable logs to be sent to Sentry
	enableLogs: true,

	// Define how likely Replay events are sampled.
	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: 0.1,

	// Define how likely Replay events are sampled when an error occurs.
	replaysOnErrorSampleRate: 1.0,

	// Enable sending user PII (Personally Identifiable Information)
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
	sendDefaultPii: true,

	// Automatically show crash report dialog when errors occur
	// This prompts users to provide feedback immediately after an error
	beforeSend(event) {
		// Check if it is an exception, and if so, show the report dialog
		if (event.exception && event.event_id) {
			Sentry.showReportDialog({
				eventId: event.event_id,
				// Customize the dialog
				title: "It looks like we're having issues.",
				subtitle: "Our team has been notified.",
				subtitle2: "If you'd like to help, tell us what happened below.",
				labelName: "Name",
				labelEmail: "Email",
				labelComments: "What happened?",
				labelClose: "Close",
				labelSubmit: "Submit",
				// Show the error name/message to give context
				errorGeneric: "An unknown error occurred while submitting your report. Please try again.",
				errorFormEntry: "Some fields were invalid. Please correct the errors and try again.",
				successMessage: "Your feedback has been sent. Thank you!",
			});
		}
		return event;
	},
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
