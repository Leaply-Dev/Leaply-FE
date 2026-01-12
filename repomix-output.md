This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where comments have been removed.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
app/
  (app)/
    dashboard/
      applications/
        [id]/
          tasks/
            page.tsx
          page.tsx
        layout.tsx
        page.tsx
      profile/
        layout.tsx
        page.tsx
      page.tsx
    explore/
      [id]/
        page.tsx
      page.tsx
    persona-lab/
      page.tsx
    layout.tsx
  (auth)/
    forgot-password/
      page.tsx
    login/
      page.tsx
    register/
      page.tsx
    reset-password/
      page.tsx
    verify-email/
      page.tsx
    layout.tsx
  (marketing)/
    about/
      page.tsx
    features/
      page.tsx
    privacy/
      page.tsx
    resources/
      page.tsx
    tos/
      page.tsx
    layout.tsx
    page.tsx
  oauth/
    success/
      page.tsx
  onboarding/
    page.tsx
  providers/
    query-provider.tsx
  favicon.ico
  global-error.tsx
  globals.css
  layout.tsx
components/
  app/
    LanguageSwitcher.tsx
  dashboard/
    DashboardClient.tsx
  explore/
    program-detail/
      ApplicationSidebar.tsx
      FitScoreExpanded.tsx
      index.ts
      ProgramTabs.tsx
      QuickFactsBar.tsx
    AIMatchMode.tsx
    CompareDialog.tsx
    CompareTray.tsx
    ExploreClient.tsx
    FilterBar.tsx
    ManualMode.tsx
    mockDetailData.ts
    ProgramCard.tsx
    ProgramDetailDrawer.tsx
    programMockData.json
  marketing/
    Footer.tsx
    Navbar.tsx
  onboarding/
    components/
      StepContainer.tsx
      StepNavigation.tsx
    steps/
      index.ts
      Step1BasicInfo.tsx
      Step2Preferences.tsx
      Step3Plan.tsx
      Step4JourneySelection.tsx
      Step5Completion.tsx
    OnboardingClient.tsx
    OnboardingHeader.tsx
    types.ts
  persona-lab/
    canvas/
      ConcentricGraphCanvas.tsx
      GraphListView.tsx
    ChatSidebar/
      BackToTracksButton.tsx
      ChatHeader.tsx
      ChatMessage.tsx
      index.tsx
      MessageInput.tsx
      TrackActionCards.tsx
  providers/
    AuthProvider.tsx
    Providers.tsx
  ui/
    alert.tsx
    avatar.tsx
    badge.tsx
    button.tsx
    card.tsx
    dialog.tsx
    dropdown-menu.tsx
    field.tsx
    input.tsx
    label.tsx
    progress.tsx
    scroll-area.tsx
    select.tsx
    separator.tsx
    sheet.tsx
    skeleton.tsx
    tabs.tsx
    textarea.tsx
    toggle-group.tsx
    toggle.tsx
  ApplicationDashboard.tsx
  ApplicationSidebar.tsx
  DataInitializer.tsx
  GoogleLoginButton.tsx
  Layout.tsx
  login-form.tsx
  Navbar.tsx
  OnboardingProgress.tsx
  PageTransition.tsx
  ResourceCard.tsx
  signup-form.tsx
i18n/
  request.ts
lib/
  api/
    applicationsApi.ts
    client.ts
    exploreApi.ts
    homeApi.ts
    personaApi.ts
    types.ts
  auth/
    logout.ts
  config/
    graphConfig.ts
  constants/
    archetypes.ts
    tracks.ts
  data/
    resources.ts
  hooks/
    useAiMatch.ts
    useContainerDimensions.ts
    useForceLayout.ts
    useGraphControls.ts
    useGraphForces.ts
    useGraphInteraction.ts
    useGraphRenderers.ts
    useHomeData.ts
    useLogin.ts
    usePersonaConversation.ts
    usePrograms.ts
    useRegister.ts
    useResendVerification.ts
    useVerifyEmail.ts
  mock/
    fakerGenerators.ts
    index.ts
    manualModeData.ts
    personaGraphData.ts
    README.md
  services/
    auth.ts
    onboarding.ts
    user.ts
  store/
    applicationsStore.ts
    personaStore.ts
    userStore.ts
  types/
    persona-canvas.ts
    persona-graph.ts
    persona.ts
  utils/
    graphTransform.ts
  validations/
    auth.ts
  initializeData.ts
  utils.ts
messages/
  en.json
  vi.json
public/
  how-it-works/
    README.md
    step-1.png
    step-2.png
    step-3.png
    step-4.png
  icons/
    uni-001.jpg
    uni-002.jpg
    uni-003.jpg
    uni-004.jpg
    uni-005.jpg
    uni-006.jpg
    uni-007.jpg
    uni-008.jpg
    uni-009.jpg
    uni-010.jpg
    uni-011.jpg
    uni-012.jpg
    uni-013.jpg
    uni-014.jpg
    uni-015.jpg
    uni-016.jpg
    uni-017.jpg
    uni-018.jpg
    uni-019.jpg
    uni-020.jpg
  universities/
    cambridge.png
    eth_zurich.png
    havard.png
    imperial_college_london.png
    london.png
    mcgill.png
    melbourne.png
    mit.png
    nus.png
    oxford.png
    peking.png
    princeton.png
    snu.png
    stanford.png
    tokyo.png
    toronto.png
    tshinghua.png
    tu_muenchen.png
    ubc.png
    ucl.png
    usyd.png
    yale.png
  favicon.ico
  hero.png
  icon.ico
  Logo.png
.env.example
.gitignore
.mcp.json
biome.json
CLAUDE.md
components.json
instrumentation-client.ts
instrumentation.ts
knip.json
LICENSE
next.config.ts
package.json
postcss.config.js
proxy.ts
README.md
sentry.edge.config.ts
sentry.server.config.ts
tsconfig.json
vercel.json
```

# Files

## File: components/onboarding/components/StepNavigation.tsx
````typescript
"use client";

import { Button } from "@/components/ui/button";

interface StepNavigationProps {
	backLabel: string;
	continueLabel: string;
	onBack: () => void;
	onNext: () => void;
	isBackDisabled?: boolean;
	isNextDisabled?: boolean;
	showContinue?: boolean;
}

export function StepNavigation({
	backLabel,
	continueLabel,
	onBack,
	onNext,
	isBackDisabled = false,
	isNextDisabled = false,
	showContinue = true,
}: StepNavigationProps) {
	return (
		<div className="pt-6 flex justify-between border-t border-border mt-6">
			<Button
				variant="outline"
				size="lg"
				disabled={isBackDisabled}
				onClick={onBack}
				className="px-8"
			>
				{backLabel}
			</Button>
			{showContinue && (
				<Button
					size="lg"
					disabled={isNextDisabled}
					onClick={onNext}
					className="px-8"
				>
					{continueLabel}
				</Button>
			)}
		</div>
	);
}
````

## File: components/onboarding/steps/index.ts
````typescript
export { Step1BasicInfo } from "./Step1BasicInfo";
export { Step2Preferences } from "./Step2Preferences";
export { Step3Plan } from "./Step3Plan";
export { Step4JourneySelection } from "./Step4JourneySelection";
export { Step5Completion } from "./Step5Completion";
````

## File: components/onboarding/steps/Step5Completion.tsx
````typescript
"use client";

import { motion } from "framer-motion";
import { ArrowRight, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { JourneyType } from "@/lib/store/userStore";
import type { OnboardingTranslations } from "../types";

interface Step5CompletionProps {
	translations: OnboardingTranslations;
	selectedJourney: JourneyType | null;
	onComplete: () => void;
}

export function Step5Completion({
	translations,
	selectedJourney,
	onComplete,
}: Step5CompletionProps) {
	return (
		<motion.div
			key="step4"
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="w-full space-y-8 flex flex-col items-center text-center max-w-lg mx-auto py-12"
		>
			<div className="w-24 h-24 bg-primary dark:bg-primary/30 rounded-full flex items-center justify-center mb-4 text-primary-foreground dark:text-primary-foreground">
				<PartyPopper className="w-12 h-12" />
			</div>

			<div className="space-y-4">
				<h1 className="text-4xl font-bold tracking-tight">
					{translations.step4.title}
				</h1>
				<p className="text-xl text-muted-foreground">
					{translations.step4.subtitle}
				</p>
			</div>

			<div className="pt-8 w-full">
				<Button
					size="lg"
					onClick={onComplete}
					className="w-full h-14 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
				>
					{selectedJourney === "targeted"
						? translations.step4.ctaTargeted
						: translations.step4.ctaExploring}
					<ArrowRight className="ml-2 w-5 h-5" />
				</Button>
			</div>
		</motion.div>
	);
}
````

## File: components/ui/avatar.tsx
````typescript
import Image from "next/image";
import * as React from "react";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
			className,
		)}
		{...props}
	/>
));
Avatar.displayName = "Avatar";

interface AvatarImageProps
	extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "width" | "height"> {
	src?: string;
	alt?: string;
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
	({ className, src, alt = "", ...props }, ref) => {
		const [error, setError] = React.useState(false);

		if (!src || error) {
			return null;
		}

		// Check if it's an external URL
		const isExternal = src.startsWith("http:

		if (isExternal) {
			return (
				<Image
					src={src}
					alt={alt}
					fill
					className={cn("object-cover", className)}
					onError={() => setError(true)}
					{...props}
				/>
			);
		}


		return (
			<Image
				ref={ref}
				src={src}
				alt={alt}
				fill
				className={cn("object-cover", className)}
				onError={() => setError(true)}
				{...props}
			/>
		);
	},
);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"flex h-full w-full items-center justify-center rounded-full bg-muted text-foreground font-semibold",
			className,
		)}
		{...props}
	/>
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
````

## File: components/ui/badge.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2",
	{
		variants: {
			variant: {
				default: "border-transparent bg-primary text-primary-foreground",
				secondary: "border-transparent bg-muted text-foreground",
				destructive: "border-transparent bg-red-600 text-white",
				outline: "text-foreground border-border",
				success: "border-transparent bg-green-600 text-white",
				warning: "border-transparent bg-chart-4 text-white",
				info: "border-transparent bg-chart-2 text-white",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };
````

## File: components/ui/button.tsx
````typescript
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive:
					"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline:
					"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost:
					"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
				"icon-sm": "size-8",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
````

## File: components/ui/card.tsx
````typescript
import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"rounded-lg border border-border bg-card text-foreground shadow-xs",
			className,
		)}
		{...props}
	/>
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex flex-col space-y-1.5 p-6", className)}
		{...props}
	/>
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn(
			"text-2xl font-semibold leading-none tracking-tight",
			className,
		)}
		{...props}
	/>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn("text-sm text-muted-foreground", className)}
		{...props}
	/>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex items-center p-6 pt-0", className)}
		{...props}
	/>
));
CardFooter.displayName = "CardFooter";

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
	CardContent,
};
````

## File: components/ui/input.tsx
````typescript
import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
				"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
````

## File: components/ui/label.tsx
````typescript
"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Label({
	className,
	...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
	return (
		<LabelPrimitive.Root
			data-slot="label"
			className={cn(
				"flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

export { Label };
````

## File: components/ui/progress.tsx
````typescript
import * as React from "react";

import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
	value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
	({ className, value = 0, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"relative h-4 w-full overflow-hidden rounded-full bg-muted",
				className,
			)}
			{...props}
		>
			<div
				className="h-full w-full flex-1 bg-primary transition-all"
				style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
			/>
		</div>
	),
);
Progress.displayName = "Progress";

export { Progress };
````

## File: components/ui/scroll-area.tsx
````typescript
"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as React from "react";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
	<ScrollAreaPrimitive.Root
		ref={ref}
		className={cn("relative overflow-hidden", className)}
		{...props}
	>
		<ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
			{children}
		</ScrollAreaPrimitive.Viewport>
		<ScrollBar />
		<ScrollAreaPrimitive.Corner />
	</ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
	<ScrollAreaPrimitive.ScrollAreaScrollbar
		ref={ref}
		orientation={orientation}
		className={cn(
			"flex touch-none select-none transition-colors",
			orientation === "vertical" &&
				"h-full w-2.5 border-l border-l-transparent p-[1px]",
			orientation === "horizontal" &&
				"h-2.5 flex-col border-t border-t-transparent p-[1px]",
			className,
		)}
		{...props}
	>
		<ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
	</ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
````

## File: components/ui/separator.tsx
````typescript
"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Separator({
	className,
	orientation = "horizontal",
	decorative = true,
	...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
	return (
		<SeparatorPrimitive.Root
			data-slot="separator"
			decorative={decorative}
			orientation={orientation}
			className={cn(
				"bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
				className,
			)}
			{...props}
		/>
	);
}

export { Separator };
````

## File: components/ui/skeleton.tsx
````typescript
import { cn } from "@/lib/utils";

function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn("animate-pulse rounded-md bg-muted", className)}
			{...props}
		/>
	);
}

export { Skeleton };
````

## File: components/ui/tabs.tsx
````typescript
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.List
		ref={ref}
		className={cn(
			"inline-flex h-12 items-center justify-center rounded-xl bg-muted p-1.5 text-muted-foreground",
			className,
		)}
		{...props}
	/>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Trigger
		ref={ref}
		className={cn(
			"inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-green focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground hover:text-foreground",
			className,
		)}
		{...props}
	/>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn(
			"mt-6 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-green focus-visible:ring-offset-2",
			className,
		)}
		{...props}
	/>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
````

## File: components/ui/textarea.tsx
````typescript
import type * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
````

## File: components/ui/toggle-group.tsx
````typescript
"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

const ToggleGroupContext = React.createContext<
	VariantProps<typeof toggleVariants> & {
		spacing?: number;
	}
>({
	size: "default",
	variant: "default",
	spacing: 0,
});

function ToggleGroup({
	className,
	variant,
	size,
	spacing = 0,
	children,
	...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
	VariantProps<typeof toggleVariants> & {
		spacing?: number;
	}) {
	return (
		<ToggleGroupPrimitive.Root
			data-slot="toggle-group"
			data-variant={variant}
			data-size={size}
			data-spacing={spacing}
			style={{ "--gap": spacing } as React.CSSProperties}
			className={cn(
				"group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs",
				className,
			)}
			{...props}
		>
			<ToggleGroupContext.Provider value={{ variant, size, spacing }}>
				{children}
			</ToggleGroupContext.Provider>
		</ToggleGroupPrimitive.Root>
	);
}

function ToggleGroupItem({
	className,
	children,
	variant,
	size,
	...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
	VariantProps<typeof toggleVariants>) {
	const context = React.useContext(ToggleGroupContext);

	return (
		<ToggleGroupPrimitive.Item
			data-slot="toggle-group-item"
			data-variant={context.variant || variant}
			data-size={context.size || size}
			data-spacing={context.spacing}
			className={cn(
				toggleVariants({
					variant: context.variant || variant,
					size: context.size || size,
				}),
				"w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10",
				"data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first:border-l",
				className,
			)}
			{...props}
		>
			{children}
		</ToggleGroupPrimitive.Item>
	);
}

export { ToggleGroup, ToggleGroupItem };
````

## File: components/ui/toggle.tsx
````typescript
"use client";

import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
	"inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
	{
		variants: {
			variant: {
				default: "bg-transparent",
				outline:
					"border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
			},
			size: {
				default: "h-9 px-2 min-w-9",
				sm: "h-8 px-1.5 min-w-8",
				lg: "h-10 px-2.5 min-w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Toggle({
	className,
	variant,
	size,
	...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
	VariantProps<typeof toggleVariants>) {
	return (
		<TogglePrimitive.Root
			data-slot="toggle"
			className={cn(toggleVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Toggle, toggleVariants };
````

## File: components/DataInitializer.tsx
````typescript
"use client";

import { useEffect } from "react";
import { initializeAppData } from "@/lib/initializeData";





export function DataInitializer() {
	useEffect(() => {
		initializeAppData();
	}, []);

	return null;
}
````

## File: components/Layout.tsx
````typescript
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
	children: ReactNode;
	className?: string;
}

export function Layout({ children, className }: LayoutProps) {
	return (
		<div className={cn("min-h-screen flex flex-col", className)}>
			{children}
		</div>
	);
}

export function PageContainer({ children, className }: LayoutProps) {
	return <div className={cn("page-container", className)}>{children}</div>;
}

export function Section({ children, className }: LayoutProps) {
	return (
		<section className={cn("py-12 md:py-16", className)}>{children}</section>
	);
}
````

## File: components/OnboardingProgress.tsx
````typescript
import { Check, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
	steps: string[];
	currentStep: number;
	className?: string;
}

export function OnboardingProgress({
	steps,
	currentStep,
	className,
}: OnboardingProgressProps) {
	return (
		<div className={cn("w-full", className)}>
			<div className="relative flex items-start justify-between">
				{steps.map((step, index) => {
					const isCompleted = index < currentStep;
					const isCurrent = index === currentStep;
					const isLast = index === steps.length - 1;

					return (
						<div
							key={step}
							className="flex flex-col items-center relative flex-1"
						>
							{}
							<div
								className={cn(
									"w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 relative z-10",
									isCompleted && "bg-primary text-primary-foreground",
									isCurrent &&
										"bg-primary text-primary-foreground ring-4 ring-primary/20",
									!isCompleted &&
										!isCurrent &&
										"bg-muted text-muted-foreground",
								)}
							>
								{isCompleted ? (
									<Check className="w-5 h-5" />
								) : isLast ? (
									<Flag className="w-5 h-5" />
								) : (
									<span>{index + 1}</span>
								)}
							</div>

							{}
							<span
								className={cn(
									"text-xs sm:text-sm mt-2 text-center max-w-[120px] transition-colors duration-300",
									(isCompleted || isCurrent) && "text-foreground font-medium",
									!isCompleted && !isCurrent && "text-muted-foreground",
								)}
							>
								{step}
							</span>

							{}
							{!isLast && (
								<div
									className={cn(
										"absolute top-5 left-[50%] h-0.5 transition-all duration-300",
										"w-full",
										isCompleted ? "bg-primary" : "bg-muted",
									)}
									style={{
										transform: "translateY(-50%)",
									}}
								/>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
````

## File: components/PageTransition.tsx
````typescript
"use client";

import { type HTMLMotionProps, motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageTransitionProps extends Omit<HTMLMotionProps<"div">, "children"> {
	children: ReactNode;
}

export function PageTransition({ children, ...props }: PageTransitionProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			{...props}
		>
			{children}
		</motion.div>
	);
}

export function FadeIn({ children, ...props }: PageTransitionProps) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			{...props}
		>
			{children}
		</motion.div>
	);
}

export function SlideUp({
	children,
	delay = 0,
	...props
}: PageTransitionProps & { delay?: number }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut", delay }}
			{...props}
		>
			{children}
		</motion.div>
	);
}

export function StaggerContainer({ children, ...props }: PageTransitionProps) {
	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={{
				hidden: { opacity: 0 },
				visible: {
					opacity: 1,
					transition: {
						staggerChildren: 0.1,
					},
				},
			}}
			{...props}
		>
			{children}
		</motion.div>
	);
}

export function StaggerItem({ children, ...props }: PageTransitionProps) {
	return (
		<motion.div
			variants={{
				hidden: { opacity: 0, y: 20 },
				visible: { opacity: 1, y: 0 },
			}}
			{...props}
		>
			{children}
		</motion.div>
	);
}
````

## File: lib/utils.ts
````typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
````

## File: public/how-it-works/README.md
````markdown
# How It Works - Step Images

This folder contains the visual images for each step in the "How It Works" section on the landing page.

## Required Images

Please add the following image files to this directory:

1. **step-1.png** - Profile Setup
   - Shows the user profile creation process
   - Recommended dimensions: 600x450px or similar aspect ratio
   - Color theme: Green (#95CA55)

2. **step-2.png** - AI Matching
   - Shows the AI matching universities to user preferences
   - Recommended dimensions: 600x450px or similar aspect ratio
   - Color theme: Sky Blue (#4CA8D3)

3. **step-3.png** - Application Tracking
   - Shows the application dashboard with tasks and deadlines
   - Recommended dimensions: 600x450px or similar aspect ratio
   - Color theme: Orange (#E8A634)

4. **step-4.png** - AI Enhancement
   - Shows the AI assistant helping with essays and profile
   - Recommended dimensions: 600x450px or similar aspect ratio
   - Color theme: Green (#95CA55)

## Image Guidelines

- **Format**: PNG or JPG (PNG preferred for transparency)
- **Dimensions**: 600x450px recommended (4:3 aspect ratio)
- **File size**: Keep under 500KB for optimal loading
- **Style**: Clean, modern, matches Leaply's design language
- **Content**: Can include UI mockups, illustrations, or screenshots

## How the Images are Used

These images appear in the sticky parallax section on the right side of the "How It Works" section. As users scroll through the step descriptions on the left, the image on the right transitions smoothly to show the corresponding step visual.

The component automatically handles:
- Smooth transitions between steps
- Responsive sizing
- Lazy loading optimization
- Animation effects
````

## File: components.json
````json
{
	"$schema": "https://ui.shadcn.com/schema.json",
	"style": "new-york",
	"rsc": true,
	"tsx": true,
	"tailwind": {
		"config": "",
		"css": "app/globals.css",
		"baseColor": "slate",
		"cssVariables": true,
		"prefix": ""
	},
	"iconLibrary": "lucide",
	"aliases": {
		"components": "@/components",
		"utils": "@/lib/utils",
		"ui": "@/components/ui",
		"lib": "@/lib",
		"hooks": "@/hooks"
	},
	"registries": {}
}
````

## File: LICENSE
````
MIT License

Copyright (c) 2025 Leaply-Dev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## File: postcss.config.js
````javascript
module.exports = {
	plugins: {
		"@tailwindcss/postcss": {},
	},
};
````

## File: README.md
````markdown
# Leaply - AI-Powered Study Abroad Platform

A modern, full-featured web application designed to help students discover universities, manage applications, and receive AI-powered guidance for studying abroad.

## 🎯 Features

### Core Features
- **Landing Page**: Beautiful hero section with features, testimonials, and call-to-action
- **User Authentication**: Login and signup pages with OAuth placeholder integration
- **Onboarding Flow**: Multi-step profile creation and preference collection
- **University Discovery**: Browse, search, and filter 20+ universities worldwide with **AI-powered fit scores**
- **Application Management**: Track applications, tasks, and deadlines
- **Persona Lab**: AI-powered essay coach for self-discovery and essay ideation (unique feature!)
- **AI Chatbot**: Interactive assistant for application guidance and Q&A
- **Resource Library**: Curated guides and articles for applicants
- **User Profile**: Manage personal information and test scores

### Unique Features Inspired by Original Prototype
- **Fit Score Matching**: Each university shows a personalized match percentage (0-100%) based on your profile
- **Persona Lab / MyLeap**: AI essay coach with proven blueprints and self-discovery questions
- **Enhanced University Cards**: Beautiful cards with hover effects, bookmark stars, and gradient backgrounds
- **Smart Recommendations**: Universities ranked by how well they match your preferences and profile

### Technical Highlights
- **Next.js 14** with App Router and React Server Components
- **TypeScript** for type safety
- **Tailwind CSS** with custom Leaply color palette
- **Framer Motion** for smooth animations and transitions
- **Zustand** for lightweight state management
- **shadcn/ui** components for consistent UI
- Fully responsive design (mobile, tablet, desktop)
- Accessibility-focused (WCAG 2.1 AA compliant)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
leaply-app/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout with Navbar/Footer
│   ├── login/                    # Login page
│   ├── signup/                   # Signup page
│   ├── onboarding/              # Onboarding flow
│   │   ├── page.tsx             # Profile information
│   │   ├── quiz/                # Preference quiz
│   │   └── summary/             # Recommendations summary
│   ├── universities/            # University discovery
│   │   ├── page.tsx             # List/search page
│   │   └── [id]/                # University detail page
│   ├── dashboard/               # Dashboard pages
│   │   ├── page.tsx             # Overview
│   │   ├── applications/        # Applications management
│   │   ├── tasks/               # Task list
│   │   ├── resources/           # Resource library
│   │   └── profile/             # User profile
│   └── chatbot/                 # AI chatbot
│       ├── page.tsx             # Chat interface
│       └── history/             # Conversation history
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui base components
│   ├── UniversityCard.tsx       # University display card
│   ├── ApplicationCard.tsx      # Application status card
│   ├── TaskItem.tsx             # Task item with checkbox
│   ├── ChatMessage.tsx          # Chat bubble component
│   ├── PageTransition.tsx       # Animation wrappers
│   ├── Navbar.tsx               # Navigation bar
│   └── Footer.tsx               # Footer
├── lib/                         # Utilities and state
│   ├── utils.ts                 # Utility functions
│   ├── store/                   # Zustand stores
│   │   ├── userStore.ts         # User state
│   │   ├── universitiesStore.ts # Universities & filters
│   │   ├── applicationsStore.ts # Applications & tasks
│   │   └── chatStore.ts         # Chat conversations
│   └── data/                    # Mock data
│       ├── universities.ts      # 20 university profiles
│       ├── applications.ts      # Sample applications
│       ├── resources.ts         # Guide articles
│       └── chat.ts              # Conversation examples
├── public/                      # Static assets
│   ├── Logo.png                 # Leaply logo
│   └── icons/                   # University icons
└── docs/                        # Documentation
    ├── technical-guidelines.md  # Coding standards
    ├── feature-spec.md          # Feature specifications
    ├── data-requirements.md     # Data structure docs
    └── colors.md                # Color palette guide
```

## 🎨 Design System

### Color Palette
- **Primary Green**: `#95CA55` - Primary buttons, active states
- **Dark Grey**: `#3F3C3B` - Headings, primary text
- **Light Grey**: `#F5F5F5` - Backgrounds
- **Mid Grey**: `#6D6866` - Secondary text, borders
- **Light Green**: `#B9DA7A` - Hover states
- **Sky Blue**: `#4CA8D3` - Informational badges
- **Warning Orange**: `#E8A634` - Alerts, warnings

### Typography
- **Font**: Inter (system fallback: system-ui, sans-serif)
- **Headings**: Bold, dark-grey
- **Body**: Regular, dark-grey
- **Captions**: Regular, mid-grey

### Animations
- **Page Transitions**: 300-400ms with easeOut
- **Hover Effects**: 200ms
- **Stagger Animations**: 100ms delay between items

## 🗂️ State Management

The app uses Zustand for global state management with four main stores:

1. **User Store** (`userStore.ts`)
   - User profile and authentication
   - Preferences and onboarding status

2. **Universities Store** (`universitiesStore.ts`)
   - University data and search filters
   - Saved universities list

3. **Applications Store** (`applicationsStore.ts`)
   - Applications and their statuses
   - Tasks and deadlines
   - Resource articles

4. **Chat Store** (`chatStore.ts`)
   - Conversation history
   - Messages and typing state

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

All components adapt to screen sizes using Tailwind's responsive utilities.

## 🎭 Demo Mode

This is a demo application with the following characteristics:
- **No real API calls**: All data is mocked and pre-populated
- **No form validation**: Forms accept any input for smooth demo flow
- **Simulated AI responses**: Chatbot uses keyword matching, not real AI
- **Local state only**: No data persistence (refreshing resets state)

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all files
- Prefer functional components and hooks
- Use Server Components by default, add `'use client'` only when needed
- Follow naming conventions: PascalCase for components, camelCase for functions

### Component Patterns
- Extract reusable UI into `components/`
- Keep business logic in `lib/`
- Use absolute imports (`@/components/*`)
- Compose with Tailwind utilities, avoid custom CSS

### Performance
- Use Next.js `Image` component for all images
- Lazy load below-the-fold content
- Animate only `transform` and `opacity` for GPU acceleration

## 📄 License

This is a demo project created for educational purposes.

## 🙏 Acknowledgments

- Next.js for the amazing framework
- shadcn/ui for the beautiful component library
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- Zustand for lightweight state management
````

## File: app/(app)/dashboard/applications/layout.tsx
````typescript
export const dynamic = "force-dynamic";

export default function ApplicationsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
````

## File: app/(app)/dashboard/profile/layout.tsx
````typescript
export const dynamic = "force-dynamic";

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
````

## File: app/(auth)/login/page.tsx
````typescript
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link
					href="/"
					className="flex items-center gap-2 self-center font-medium"
				>
					<Image
						src="/Logo.png"
						alt="Leaply"
						width={120}
						height={40}
						className="h-10 w-auto"
					/>
				</Link>
				<LoginForm />
			</div>
		</div>
	);
}
````

## File: app/(auth)/register/page.tsx
````typescript
import Image from "next/image";
import Link from "next/link";
import { SignupForm } from "@/components/signup-form";
export default function SignupPage() {
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link
					href="/"
					className="flex items-center gap-2 self-center font-medium"
				>
					<Image
						src="/Logo.png"
						alt="Logo"
						width={120}
						height={40}
						className="h-10 w-auto"
					/>
				</Link>
				<SignupForm />
			</div>
		</div>
	);
}
````

## File: app/(marketing)/about/page.tsx
````typescript
"use client";

import {
	ArrowRight,
	GraduationCap,
	Heart,
	Linkedin,
	Mail,
	MapPin,
	Rocket,
	Send,
	Sparkles,
	Twitter,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type React from "react";
import { useState } from "react";
import {
	PageTransition,
	SlideUp,
	StaggerContainer,
	StaggerItem,
} from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TeamMember {
	name: string;
	role: string;
	department: string;
	school: string;
}

const teamMembers: TeamMember[] = [
	{
		name: "Phạm Phan Anh",
		role: "Team Leader",
		department: "R&D",
		school: "HUST",
	},
	{
		name: "Nguyễn Trường Sơn",
		role: "Developer",
		department: "R&D",
		school: "HUST",
	},
	{
		name: "Nguyễn Đăng Khánh",
		role: "Developer",
		department: "R&D",
		school: "HUST",
	},
	{
		name: "Hoàng Hà Hải Anh",
		role: "Sales Lead",
		department: "Sales & Marketing",
		school: "FTU",
	},
	{
		name: "Chu Nguyễn Xuân Mai",
		role: "Finance Lead",
		department: "Finance",
		school: "AOF",
	},
];

const valueConfigs = [
	{ icon: Heart, titleKey: "value1Title", descKey: "value1Desc" },
	{ icon: Rocket, titleKey: "value2Title", descKey: "value2Desc" },
	{ icon: Users, titleKey: "value3Title", descKey: "value3Desc" },
];

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function getDepartmentColor(department: string): string {
	switch (department) {
		case "R&D":
			return "bg-blue-500";
		case "Sales & Marketing":
			return "bg-amber-500";
		case "Finance":
			return "bg-emerald-500";
		default:
			return "bg-primary";
	}
}

export default function AboutPage() {
	const t = useTranslations("about");
	const tCommon = useTranslations("common");
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsSubmitting(false);
		setSubmitted(true);
		setFormData({ name: "", email: "", message: "" });
	};

	return (
		<PageTransition>
			<div className="min-h-screen">
				{}
				<section className="relative bg-background py-20 md:py-28 overflow-hidden">
					<div className="absolute inset-0 pointer-events-none">
						<div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
						<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl" />
					</div>

					<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<SlideUp>
							<div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
								<Sparkles className="w-4 h-4" />
								{t("badge")}
							</div>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
								{t("heroTitle")}
								<br />
								<span className="text-primary">{t("heroTitleHighlight")}</span>
							</h1>
							<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
								{t("heroSubtitle")}
							</p>
						</SlideUp>
					</div>
				</section>

				{}
				<section className="py-20 bg-muted/50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<SlideUp>
							<div className="max-w-3xl mx-auto text-center mb-16">
								<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
									{t("missionTitle")}
								</h2>
								<p className="text-lg text-muted-foreground leading-relaxed">
									{t("missionText")}
								</p>
							</div>
						</SlideUp>

						<StaggerContainer>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{valueConfigs.map((value) => {
									const Icon = value.icon;
									return (
										<StaggerItem key={value.titleKey}>
											<Card className="h-full hover:shadow-lg transition-shadow border-none bg-background">
												<CardContent className="p-8 text-center">
													<div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
														<Icon className="w-8 h-8 text-primary" />
													</div>
													<h3 className="text-xl font-semibold text-foreground mb-3">
														{t(value.titleKey)}
													</h3>
													<p className="text-muted-foreground">
														{t(value.descKey)}
													</p>
												</CardContent>
											</Card>
										</StaggerItem>
									);
								})}
							</div>
						</StaggerContainer>
					</div>
				</section>

				{}
				<section className="py-20 bg-background">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<SlideUp>
							<div className="text-center mb-16">
								<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
									{t("teamTitle")}
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
									{t("teamSubtitle")}
								</p>
							</div>
						</SlideUp>

						<StaggerContainer>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
								{teamMembers.map((member) => (
									<StaggerItem key={member.name}>
										<Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 group">
											<CardContent className="p-6 text-center">
												<div className="relative mb-4">
													<div className="w-20 h-20 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
														<span className="text-xl font-bold text-primary">
															{getInitials(member.name)}
														</span>
													</div>
													<div
														className={cn(
															"absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-medium text-white",
															getDepartmentColor(member.department),
														)}
													>
														{member.department}
													</div>
												</div>
												<h3 className="font-semibold text-foreground mb-1">
													{member.name}
												</h3>
												<p className="text-sm text-primary font-medium mb-2">
													{member.role}
												</p>
												<div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
													<GraduationCap className="w-3 h-3" />
													{member.school}
												</div>
											</CardContent>
										</Card>
									</StaggerItem>
								))}
							</div>
						</StaggerContainer>
					</div>
				</section>

				{}
				<section className="py-20 bg-muted/50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
							{}
							<SlideUp>
								<div>
									<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
										{t("contactTitle")}
									</h2>
									<p className="text-lg text-muted-foreground mb-8">
										{t("contactSubtitle")}
									</p>

									<div className="space-y-6">
										<div className="flex items-start gap-4">
											<div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
												<Mail className="w-6 h-6 text-primary" />
											</div>
											<div>
												<h3 className="font-semibold text-foreground mb-1">
													{t("email")}
												</h3>
												<a
													href="mailto:hello@leaply.ai.vn"
													className="text-muted-foreground hover:text-primary transition-colors"
												>
													hello@leaply.ai.vn
												</a>
											</div>
										</div>

										<div className="flex items-start gap-4">
											<div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
												<MapPin className="w-6 h-6 text-primary" />
											</div>
											<div>
												<h3 className="font-semibold text-foreground mb-1">
													{t("address")}
												</h3>
												<p className="text-muted-foreground">
													{tCommon("hanoi")}
												</p>
											</div>
										</div>
									</div>

									<div className="mt-10">
										<p className="text-sm font-medium text-foreground mb-4">
											{t("followUs")}
										</p>
										<div className="flex gap-3">
											<a
												href="https://linkedin.com"
												target="_blank"
												rel="noopener noreferrer"
												className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
											>
												<Linkedin className="w-5 h-5" />
											</a>
											<a
												href="https://twitter.com"
												target="_blank"
												rel="noopener noreferrer"
												className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
											>
												<Twitter className="w-5 h-5" />
											</a>
										</div>
									</div>
								</div>
							</SlideUp>

							{}
							<SlideUp delay={0.1}>
								<Card className="border-none shadow-lg">
									<CardContent className="p-8">
										{submitted ? (
											<div className="text-center py-12">
												<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
													<Send className="w-8 h-8 text-primary" />
												</div>
												<h3 className="text-xl font-semibold text-foreground mb-2">
													{t("formThankYou")}
												</h3>
												<p className="text-muted-foreground mb-6">
													{t("formSuccess")}
												</p>
												<Button
													variant="outline"
													onClick={() => setSubmitted(false)}
												>
													{t("formSendAnother")}
												</Button>
											</div>
										) : (
											<form onSubmit={handleSubmit} className="space-y-6">
												<div className="space-y-2">
													<Label htmlFor="name">{t("formName")}</Label>
													<Input
														id="name"
														placeholder={t("formNamePlaceholder")}
														value={formData.name}
														onChange={(e) =>
															setFormData((prev) => ({
																...prev,
																name: e.target.value,
															}))
														}
														required
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="email">{t("formEmail")}</Label>
													<Input
														id="email"
														type="email"
														placeholder={t("formEmailPlaceholder")}
														value={formData.email}
														onChange={(e) =>
															setFormData((prev) => ({
																...prev,
																email: e.target.value,
															}))
														}
														required
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="message">{t("formMessage")}</Label>
													<Textarea
														id="message"
														placeholder={t("formMessagePlaceholder")}
														rows={5}
														value={formData.message}
														onChange={(e) =>
															setFormData((prev) => ({
																...prev,
																message: e.target.value,
															}))
														}
														required
													/>
												</div>
												<Button
													type="submit"
													className="w-full"
													disabled={isSubmitting}
												>
													{isSubmitting ? (
														t("formSubmitting")
													) : (
														<>
															{t("formSubmit")}
															<Send className="ml-2 w-4 h-4" />
														</>
													)}
												</Button>
											</form>
										)}
									</CardContent>
								</Card>
							</SlideUp>
						</div>
					</div>
				</section>

				{}
				<section className="py-20 bg-primary">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<SlideUp>
							<h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
								{t("ctaTitle")}
							</h2>
							<p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
								{t("ctaSubtitle")}
							</p>
							<Button
								size="lg"
								variant="secondary"
								className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold"
								asChild
							>
								<Link href="/register">
									{t("ctaButton")}
									<ArrowRight className="ml-2 w-5 h-5" />
								</Link>
							</Button>
						</SlideUp>
					</div>
				</section>
			</div>
		</PageTransition>
	);
}
````

## File: app/(marketing)/features/page.tsx
````typescript
"use client";

import {
	ArrowRight,
	Bell,
	Calendar,
	CheckSquare,
	FileText,
	Globe,
	Lightbulb,
	MessageSquare,
	PenTool,
	Search,
	Shield,
	Sparkles,
	Star,
	Target,
	TrendingUp,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type React from "react";
import {
	PageTransition,
	SlideUp,
	StaggerContainer,
	StaggerItem,
} from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureConfig {
	id: string;
	titleKey: string;
	taglineKey: string;
	descKey: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
	benefits: {
		icon: React.ComponentType<{ className?: string }>;
		titleKey: string;
		descKey: string;
	}[];
}

const featureConfigs: FeatureConfig[] = [
	{
		id: "explore",
		titleKey: "exploreTitle",
		taglineKey: "exploreTagline",
		descKey: "exploreDesc",
		icon: Globe,
		color: "bg-blue-500",
		benefits: [
			{
				icon: Search,
				titleKey: "exploreBenefit1Title",
				descKey: "exploreBenefit1Desc",
			},
			{
				icon: Target,
				titleKey: "exploreBenefit2Title",
				descKey: "exploreBenefit2Desc",
			},
			{
				icon: Star,
				titleKey: "exploreBenefit3Title",
				descKey: "exploreBenefit3Desc",
			},
		],
	},
	{
		id: "applications",
		titleKey: "applicationsTitle",
		taglineKey: "applicationsTagline",
		descKey: "applicationsDesc",
		icon: FileText,
		color: "bg-amber-500",
		benefits: [
			{
				icon: Calendar,
				titleKey: "applicationsBenefit1Title",
				descKey: "applicationsBenefit1Desc",
			},
			{
				icon: Bell,
				titleKey: "applicationsBenefit2Title",
				descKey: "applicationsBenefit2Desc",
			},
			{
				icon: CheckSquare,
				titleKey: "applicationsBenefit3Title",
				descKey: "applicationsBenefit3Desc",
			},
		],
	},
	{
		id: "persona-lab",
		titleKey: "personaLabTitle",
		taglineKey: "personaLabTagline",
		descKey: "personaLabDesc",
		icon: Sparkles,
		color: "bg-primary",
		benefits: [
			{
				icon: Lightbulb,
				titleKey: "personaLabBenefit1Title",
				descKey: "personaLabBenefit1Desc",
			},
			{
				icon: PenTool,
				titleKey: "personaLabBenefit2Title",
				descKey: "personaLabBenefit2Desc",
			},
			{
				icon: MessageSquare,
				titleKey: "personaLabBenefit3Title",
				descKey: "personaLabBenefit3Desc",
			},
		],
	},
];

const additionalBenefitConfigs = [
	{ icon: Shield, titleKey: "benefit1Title", descKey: "benefit1Desc" },
	{ icon: Users, titleKey: "benefit2Title", descKey: "benefit2Desc" },
	{ icon: TrendingUp, titleKey: "benefit3Title", descKey: "benefit3Desc" },
];

function FeatureSection({
	feature,
	index,
}: {
	feature: FeatureConfig;
	index: number;
}) {
	const t = useTranslations("features");
	const isEven = index % 2 === 0;
	const Icon = feature.icon;

	return (
		<section
			id={feature.id}
			className={cn(
				"py-20 scroll-mt-20",
				isEven ? "bg-background" : "bg-muted/50",
			)}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div
					className={cn(
						"grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center",
						!isEven && "lg:grid-flow-dense",
					)}
				>
					{}
					<div className={cn(!isEven && "lg:col-start-2")}>
						<SlideUp>
							<div
								className={cn(
									"inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-6",
									feature.color,
									"text-white",
								)}
							>
								<Icon className="w-4 h-4" />
								{t(feature.titleKey)}
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
								{t(feature.taglineKey)}
							</h2>
							<p className="text-lg text-muted-foreground mb-8">
								{t(feature.descKey)}
							</p>

							<div className="space-y-6">
								{feature.benefits.map((benefit) => {
									const BenefitIcon = benefit.icon;
									return (
										<div key={benefit.titleKey} className="flex gap-4">
											<div
												className={cn(
													`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${feature.color}/10`,
												)}
											>
												<BenefitIcon
													className={cn(
														"w-6 h-6",
														feature.id === "explore" && "text-blue-500",
														feature.id === "applications" && "text-amber-500",
														feature.id === "persona-lab" && "text-primary",
													)}
												/>
											</div>
											<div>
												<h3 className="font-semibold text-foreground mb-1">
													{t(benefit.titleKey)}
												</h3>
												<p className="text-muted-foreground text-sm">
													{t(benefit.descKey)}
												</p>
											</div>
										</div>
									);
								})}
							</div>

							<div className="mt-10">
								<Button size="lg" asChild>
									<Link href="/register">
										{t("startUsing")}
										<ArrowRight className="ml-2 w-5 h-5" />
									</Link>
								</Button>
							</div>
						</SlideUp>
					</div>

					{}
					<div className={cn(!isEven && "lg:col-start-1")}>
						<SlideUp delay={0.1}>
							<div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-linear-to-br from-muted to-muted/50 border border-border shadow-xl">
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="text-center p-8">
										<div
											className={cn(
												`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 ${feature.color}/20`,
											)}
										>
											<Icon
												className={cn(
													"w-10 h-10",
													feature.id === "explore" && "text-blue-500",
													feature.id === "applications" && "text-amber-500",
													feature.id === "persona-lab" && "text-primary",
												)}
											/>
										</div>
										<p className="text-muted-foreground text-sm">
											{t(feature.titleKey)} Preview
										</p>
									</div>
								</div>
							</div>
						</SlideUp>
					</div>
				</div>
			</div>
		</section>
	);
}

export default function FeaturesPage() {
	const t = useTranslations("features");

	return (
		<PageTransition>
			<div className="min-h-screen">
				{}
				<section className="relative bg-background py-20 md:py-28 overflow-hidden">
					<div className="absolute inset-0 pointer-events-none">
						<div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
						<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
					</div>

					<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<SlideUp>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
								{t("heroTitle")}
								<br />
								<span className="text-primary">{t("heroTitleHighlight")}</span>
							</h1>
							<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
								{t("heroSubtitle")}
							</p>
							<div className="flex flex-wrap justify-center gap-4">
								{featureConfigs.map((feature) => {
									const Icon = feature.icon;
									return (
										<Link
											key={feature.id}
											href={`#${feature.id}`}
											className={cn(
												"inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border",
												"hover:border-primary hover:bg-primary/5 transition-colors",
											)}
										>
											<Icon className="w-4 h-4 text-primary" />
											<span className="text-sm font-medium">
												{t(feature.titleKey)}
											</span>
										</Link>
									);
								})}
							</div>
						</SlideUp>
					</div>
				</section>

				{}
				{featureConfigs.map((feature, index) => (
					<FeatureSection key={feature.id} feature={feature} index={index} />
				))}

				{}
				<section className="py-20 bg-background">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<SlideUp>
							<div className="text-center mb-12">
								<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
									{t("additionalTitle")}
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
									{t("additionalSubtitle")}
								</p>
							</div>
						</SlideUp>

						<StaggerContainer>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{additionalBenefitConfigs.map((benefit) => {
									const Icon = benefit.icon;
									return (
										<StaggerItem key={benefit.titleKey}>
											<Card className="h-full text-center hover:shadow-lg transition-shadow">
												<CardContent className="p-8">
													<div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
														<Icon className="w-7 h-7 text-primary" />
													</div>
													<h3 className="text-lg font-semibold text-foreground mb-2">
														{t(benefit.titleKey)}
													</h3>
													<p className="text-muted-foreground text-sm">
														{t(benefit.descKey)}
													</p>
												</CardContent>
											</Card>
										</StaggerItem>
									);
								})}
							</div>
						</StaggerContainer>
					</div>
				</section>

				{}
				<section className="py-20 bg-primary">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<SlideUp>
							<h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
								{t("ctaTitle")}
							</h2>
							<p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
								{t("ctaSubtitle")}
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button
									size="lg"
									variant="secondary"
									className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold"
									asChild
								>
									<Link href="/register">
										{t("startFree")}
										<ArrowRight className="ml-2 w-5 h-5" />
									</Link>
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
									asChild
								>
									<Link href="/about">{t("aboutUs")}</Link>
								</Button>
							</div>
						</SlideUp>
					</div>
				</section>
			</div>
		</PageTransition>
	);
}
````

## File: app/(marketing)/privacy/page.tsx
````typescript
export default function Page() {
	return (
		<div className="page-container">
			<article className="prose prose-lg dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 max-w-none">
				<h1 id="ch-nh-s-ch-b-o-m-t-leaply">Chính sách bảo mật</h1>
				<p>
					<strong>Cập nhật lần cuối:</strong> 27/12/2025
				</p>
				<hr />
				<h2 id="1-gi-i-thi-u">1. Giới thiệu</h2>
				<p>
					Leaply (&quot;chúng tôi&quot;, &quot;của chúng tôi&quot;) cam kết bảo
					vệ quyền riêng tư của bạn. Chính sách này giải thích cách chúng tôi
					thu thập, sử dụng và bảo vệ thông tin cá nhân khi bạn sử dụng nền tảng
					Leaply.
				</p>
				<p>
					Bằng việc sử dụng Leaply, bạn đồng ý với các điều khoản trong Chính
					sách Bảo mật này.
				</p>
				<hr />
				<h2 id="2-th-ng-tin-ch-ng-t-i-thu-th-p">
					2. Thông tin chúng tôi thu thập
				</h2>
				<h3 id="2-1-th-ng-tin-b-n-cung-c-p-tr-c-ti-p">
					2.1 Thông tin bạn cung cấp trực tiếp
				</h3>
				<table>
					<thead>
						<tr>
							<th>Loại dữ liệu</th>
							<th>Ví dụ</th>
							<th>Mục đích</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Thông tin tài khoản</td>
							<td>Email, họ tên</td>
							<td>Tạo và quản lý tài khoản</td>
						</tr>
						<tr>
							<td>Thông tin học vấn</td>
							<td>GPA, điểm IELTS/TOEFL/GRE, trường đang học</td>
							<td>Đánh giá hồ sơ, gợi ý chương trình</td>
						</tr>
						<tr>
							<td>Mục tiêu du học</td>
							<td>Ngành học, quốc gia, ngân sách, timeline</td>
							<td>Cá nhân hóa gợi ý</td>
						</tr>
						<tr>
							<td>Nội dung tải lên</td>
							<td>CV, essay, tài liệu hồ sơ</td>
							<td>Hỗ trợ viết và feedback</td>
						</tr>
						<tr>
							<td>Nội dung trò chuyện</td>
							<td>Câu trả lời trong Persona Lab</td>
							<td>Phân tích tính cách, tạo profile</td>
						</tr>
					</tbody>
				</table>
				<h3 id="2-2-th-ng-tin-thu-th-p-t-ng">2.2 Thông tin thu thập tự động</h3>
				<ul>
					<li>Địa chỉ IP và thông tin thiết bị</li>
					<li>Trang đã truy cập và tính năng đã sử dụng</li>
					<li>Thời gian truy cập và thời lượng sử dụng</li>
					<li>Cookies và công nghệ theo dõi tương tự</li>
				</ul>
				<h3 id="2-3-th-ng-tin-t-b-n-th-ba">2.3 Thông tin từ bên thứ ba</h3>
				<p>Khi bạn đăng nhập bằng Google, chúng tôi nhận:</p>
				<ul>
					<li>Địa chỉ email</li>
					<li>Tên hiển thị</li>
					<li>Ảnh đại diện (nếu có)</li>
				</ul>
				<hr />
				<h2 id="3-c-ch-ch-ng-t-i-s-d-ng-th-ng-tin">
					3. Cách chúng tôi sử dụng thông tin
				</h2>
				<h3 id="3-1-cung-c-p-d-ch-v-">3.1 Cung cấp dịch vụ</h3>
				<ul>
					<li>Tạo và duy trì tài khoản của bạn</li>
					<li>Tính toán Fit Score và gợi ý chương trình phù hợp</li>
					<li>Cung cấp feedback cho essay và CV</li>
					<li>Hỗ trợ khám phá bản thân qua Persona Lab</li>
				</ul>
				<h3 id="3-2-c-i-thi-n-d-ch-v-">3.2 Cải thiện dịch vụ</h3>
				<ul>
					<li>Phân tích cách người dùng tương tác với platform</li>
					<li>Cải thiện độ chính xác của thuật toán gợi ý</li>
					<li>Phát triển tính năng mới</li>
				</ul>
				<h3 id="3-3-x-l-b-ng-ai">3.3 Xử lý bằng AI</h3>
				<p>
					<strong>Quan trọng:</strong> Leaply sử dụng công nghệ AI (Anthropic
					Claude) để:
				</p>
				<ul>
					<li>Phân tích hồ sơ và đề xuất chương trình</li>
					<li>Tạo câu hỏi khám phá trong Persona Lab</li>
					<li>Cung cấp feedback cho essay</li>
				</ul>
				<p>Khi sử dụng các tính năng AI:</p>
				<ul>
					<li>Nội dung bạn nhập được gửi đến hệ thống AI để xử lý</li>
					<li>
						Dữ liệu được ẩn danh hóa có thể được sử dụng để cải thiện chất lượng
						AI
					</li>
					<li>
						Bạn có quyền từ chối việc dữ liệu được dùng để cải thiện AI (xem Mục
						7)
					</li>
				</ul>
				<hr />
				<h2 id="4-chia-s-th-ng-tin">4. Chia sẻ thông tin</h2>
				<p>
					Chúng tôi <strong>KHÔNG</strong> bán thông tin cá nhân của bạn.
				</p>
				<p>Chúng tôi có thể chia sẻ thông tin với:</p>
				<table>
					<thead>
						<tr>
							<th>Đối tượng</th>
							<th>Mục đích</th>
							<th>Dữ liệu chia sẻ</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Anthropic (Claude API)</td>
							<td>Xử lý AI</td>
							<td>Nội dung conversation, essay</td>
						</tr>
						<tr>
							<td>Google</td>
							<td>Xác thực đăng nhập</td>
							<td>Token xác thực</td>
						</tr>
						<tr>
							<td>Viettel IDC</td>
							<td>Lưu trữ dữ liệu</td>
							<td>Toàn bộ (mã hóa)</td>
						</tr>
						<tr>
							<td>Cơ quan có thẩm quyền</td>
							<td>Tuân thủ pháp luật</td>
							<td>Theo yêu cầu pháp lý</td>
						</tr>
					</tbody>
				</table>
				<hr />
				<h2 id="5-l-u-tr-v-b-o-m-t">5. Lưu trữ và bảo mật</h2>
				<h3 id="5-1-v-tr-l-u-tr-">5.1 Vị trí lưu trữ</h3>
				<p>
					Dữ liệu của bạn được lưu trữ tại máy chủ ở Việt Nam (Viettel IDC).
				</p>
				<h3 id="5-2-th-i-gian-l-u-tr-">5.2 Thời gian lưu trữ</h3>
				<table>
					<thead>
						<tr>
							<th>Loại dữ liệu</th>
							<th>Thời gian lưu trữ</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Tài khoản đang hoạt động</td>
							<td>Cho đến khi bạn xóa tài khoản</td>
						</tr>
						<tr>
							<td>Sau khi xóa tài khoản</td>
							<td>1 năm (để hỗ trợ khôi phục nếu cần)</td>
						</tr>
						<tr>
							<td>Logs hệ thống</td>
							<td>90 ngày</td>
						</tr>
					</tbody>
				</table>
				<h3 id="5-3-bi-n-ph-p-b-o-m-t">5.3 Biện pháp bảo mật</h3>
				<ul>
					<li>Mã hóa dữ liệu khi truyền tải (HTTPS/TLS)</li>
					<li>Mã hóa dữ liệu khi lưu trữ</li>
					<li>Kiểm soát truy cập theo role</li>
					<li>Backup định kỳ</li>
				</ul>
				<hr />
				<h2 id="6-quy-n-c-a-b-n">6. Quyền của bạn</h2>
				<p>
					Theo quy định pháp luật Việt Nam và cam kết của Leaply, bạn có quyền:
				</p>
				<table>
					<thead>
						<tr>
							<th>Quyền</th>
							<th>Mô tả</th>
							<th>Cách thực hiện</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Truy cập</td>
							<td>Xem thông tin chúng tôi lưu về bạn</td>
							<td>Trang Cài đặt &gt; Dữ liệu của tôi</td>
						</tr>
						<tr>
							<td>Chỉnh sửa</td>
							<td>Cập nhật thông tin không chính xác</td>
							<td>Trang Profile</td>
						</tr>
						<tr>
							<td>Xóa</td>
							<td>Yêu cầu xóa tài khoản và dữ liệu</td>
							<td>Cài đặt &gt; Xóa tài khoản hoặc email</td>
						</tr>
						<tr>
							<td>Xuất dữ liệu</td>
							<td>Tải về bản sao dữ liệu của bạn</td>
							<td>Cài đặt &gt; Xuất dữ liệu</td>
						</tr>
						<tr>
							<td>Từ chối AI training</td>
							<td>Không cho phép dữ liệu dùng để cải thiện AI</td>
							<td>Cài đặt &gt; Quyền riêng tư</td>
						</tr>
						<tr>
							<td>Rút đồng ý</td>
							<td>Rút lại sự đồng ý đã cho</td>
							<td>Email hoặc Cài đặt</td>
						</tr>
					</tbody>
				</table>
				<p>
					Để thực hiện các quyền trên, liên hệ:{" "}
					<a href="mailto:contact@leaply.ai.vn">contact@leaply.ai.vn</a>
				</p>
				<hr />
				<h2 id="7-t-ch-i-s-d-ng-d-li-u-cho-ai-training">
					7. Từ chối sử dụng dữ liệu cho AI Training
				</h2>
				<p>
					Bạn có quyền từ chối việc dữ liệu của bạn được sử dụng để cải thiện
					thuật toán AI.
				</p>
				<p>
					<strong>Cách thực hiện:</strong>
				</p>
				<ol>
					<li>Vào Cài đặt &gt; Quyền riêng tư</li>
					<li>
						Tắt tùy chọn &quot;Cho phép sử dụng dữ liệu để cải thiện AI&quot;
					</li>
				</ol>
				<p>
					<strong>Lưu ý:</strong> Việc từ chối không ảnh hưởng đến chất lượng
					dịch vụ bạn nhận được.
				</p>
				<hr />
				<h2 id="8-i-u-ki-n-tu-i">8. Điều kiện Độ tuổi</h2>
				<p>
					Leaply dành cho người từ 18 tuổi trở lên. Dịch vụ được thiết kế để hỗ
					trợ sinh viên và người đi làm chuẩn bị hồ sơ cao học (Master&#39;s,
					MBA, PhD).
				</p>
				<p>
					Bằng việc đăng ký tài khoản, bạn xác nhận rằng bạn từ 18 tuổi trở lên.
				</p>
				<p>
					Chúng tôi không cố ý thu thập thông tin từ người dưới 18 tuổi. Nếu
					phát hiện tài khoản thuộc về người dưới 18 tuổi, chúng tôi sẽ xóa tài
					khoản và dữ liệu liên quan.
				</p>
				<hr />
				<h2 id="9-cookies">9. Cookies</h2>
				<p>Leaply sử dụng cookies để:</p>
				<ul>
					<li>Duy trì đăng nhập</li>
					<li>Ghi nhớ preferences</li>
					<li>Phân tích cách sử dụng platform</li>
				</ul>
				<p>
					Bạn có thể tắt cookies trong trình duyệt, tuy nhiên một số tính năng
					có thể không hoạt động.
				</p>
				<hr />
				<h2 id="10-thay-i-ch-nh-s-ch">10. Thay đổi Chính sách</h2>
				<p>
					Chúng tôi có thể cập nhật Chính sách này. Khi có thay đổi quan trọng:
				</p>
				<ul>
					<li>Thông báo qua email</li>
					<li>Hiển thị banner trên website</li>
					<li>Yêu cầu đồng ý lại nếu cần</li>
				</ul>
				<hr />
				<h2 id="11-li-n-h-">11. Liên hệ</h2>
				<p>Nếu có câu hỏi về Chính sách Bảo mật:</p>
				<ul>
					<li>
						<strong>Email:</strong>{" "}
						<a href="mailto:contact@leaply.ai.vn">contact@leaply.ai.vn</a>
					</li>
					<li>
						<strong>Địa chỉ:</strong> Hà Nội, Việt Nam
					</li>
				</ul>
				<hr />
				<p>
					<em>
						Chính sách này được soạn thảo phù hợp với Nghị định 13/2023/NĐ-CP về
						bảo vệ dữ liệu cá nhân.
					</em>
				</p>
			</article>
		</div>
	);
}
````

## File: app/(marketing)/tos/page.tsx
````typescript
import Link from "next/link";

export default function Page() {
	return (
		<div className="page-container">
			<article className="prose prose-lg dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 max-w-none">
				<h1>Điều khoản sử dụng</h1>
				<p>
					<strong>Cập nhật lần cuối:</strong> 27/12/2025
				</p>
				<hr />
				<h2>1. Giới thiệu và Chấp nhận Điều khoản</h2>
				<p>
					Chào mừng bạn đến với Leaply. Bằng việc truy cập hoặc sử dụng nền tảng
					Leaply (website, ứng dụng và các dịch vụ liên quan), bạn đồng ý tuân
					thủ và bị ràng buộc bởi các Điều khoản Sử dụng này.
				</p>
				<p>
					Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng
					dịch vụ của chúng tôi.
				</p>
				<hr />
				<h2>2. Mô tả Dịch vụ</h2>
				<p>
					Leaply là nền tảng hỗ trợ học sinh, sinh viên Việt Nam trong hành
					trình chuẩn bị du học, bao gồm:
				</p>
				<ul>
					<li>
						<strong>Explore:</strong> Tìm kiếm và so sánh chương trình học phù
						hợp
					</li>
					<li>
						<strong>Persona Lab:</strong> Khám phá bản thân và xây dựng câu
						chuyện cá nhân
					</li>
					<li>
						<strong>Application Dashboard:</strong> Quản lý hồ sơ ứng tuyển và
						viết essay
					</li>
				</ul>
				<hr />
				<h2>3. Điều kiện Sử dụng</h2>
				<h3>3.1 Độ tuổi</h3>
				<p>
					Leaply dành cho người từ <strong>18 tuổi trở lên</strong>.
				</p>
				<p>
					Dịch vụ được thiết kế để hỗ trợ sinh viên đại học và người đi làm
					chuẩn bị hồ sơ cao học (Master&#39;s, MBA, PhD).
				</p>
				<p>Bằng việc đăng ký, bạn xác nhận bạn từ 18 tuổi trở lên.</p>
				<h3>3.2 Tài khoản</h3>
				<ul>
					<li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập</li>
					<li>Mỗi người chỉ được sở hữu một tài khoản</li>
					<li>Bạn phải cung cấp thông tin chính xác và cập nhật</li>
				</ul>
				<h3>3.3 Hành vi được phép</h3>
				<p>Bạn đồng ý:</p>
				<ul>
					<li>Sử dụng dịch vụ cho mục đích cá nhân, hợp pháp</li>
					<li>Cung cấp thông tin trung thực trong hồ sơ</li>
					<li>Tôn trọng quyền sở hữu trí tuệ</li>
				</ul>
				<h3>3.4 Hành vi bị cấm</h3>
				<p>Bạn KHÔNG được:</p>
				<ul>
					<li>Sử dụng Leaply để tạo nội dung gian lận hoặc đạo văn</li>
					<li>Mạo danh người khác</li>
					<li>Cố gắng truy cập trái phép hệ thống</li>
					<li>Sử dụng bot hoặc công cụ tự động để khai thác dữ liệu</li>
					<li>Chia sẻ tài khoản với người khác</li>
					<li>Sử dụng dịch vụ cho mục đích thương mại mà không được phép</li>
				</ul>
				<hr />
				<h2>4. Công nghệ AI và Giới hạn</h2>
				<h3>4.1 Về việc sử dụng AI</h3>
				<p>Leaply sử dụng trí tuệ nhân tạo (AI) để:</p>
				<ul>
					<li>Tính toán Fit Score và gợi ý chương trình</li>
					<li>Hỗ trợ khám phá bản thân qua câu hỏi có định hướng</li>
					<li>Cung cấp feedback cho essay và CV</li>
				</ul>
				<h3>4.2 Giới hạn của AI</h3>
				<p>
					<strong>Quan trọng - Vui lòng đọc kỹ:</strong>
				</p>
				<p>
					Leaply là <strong>công cụ hỗ trợ</strong>, KHÔNG thay thế:
				</p>
				<ul>
					<li>Tư vấn viên du học chuyên nghiệp</li>
					<li>Quyết định tuyển sinh chính thức của các trường</li>
					<li>Đánh giá chính thức về khả năng trúng tuyển</li>
				</ul>
				<p>Fit Score và các gợi ý:</p>
				<ul>
					<li>Được tính toán dựa trên dữ liệu có sẵn</li>
					<li>Có thể không phản ánh đầy đủ tiêu chí tuyển sinh thực tế</li>
					<li>Chỉ mang tính tham khảo, không đảm bảo kết quả</li>
				</ul>
				<p>
					<strong>Chúng tôi không chịu trách nhiệm</strong> cho:
				</p>
				<ul>
					<li>Quyết định tuyển sinh của bất kỳ trường nào</li>
					<li>Kết quả ứng tuyển của bạn</li>
					<li>Thiệt hại phát sinh từ việc dựa hoàn toàn vào gợi ý của AI</li>
				</ul>
				<h3>4.3 Nguyên tắc hỗ trợ viết</h3>
				<p>Leaply hỗ trợ viết essay theo nguyên tắc:</p>
				<ul>
					<li>Cung cấp feedback, gợi ý cải thiện</li>
					<li>KHÔNG viết hộ hoặc tạo nội dung thay bạn</li>
					<li>Giúp bạn giữ giọng văn và câu chuyện riêng</li>
					<li>Bạn hoàn toàn chịu trách nhiệm về nội dung cuối cùng</li>
				</ul>
				<hr />
				<h2>5. Quyền Sở hữu Trí tuệ</h2>
				<h3>5.1 Nội dung của bạn</h3>
				<p>
					Bạn <strong>giữ toàn quyền sở hữu</strong> với:
				</p>
				<ul>
					<li>Essay, SOP và các bài viết bạn tạo</li>
					<li>CV và tài liệu bạn upload</li>
					<li>Thông tin và câu trả lời trong Persona Lab</li>
				</ul>
				<p>Bằng việc sử dụng dịch vụ, bạn cấp cho Leaply quyền:</p>
				<ul>
					<li>Lưu trữ và xử lý nội dung để cung cấp dịch vụ</li>
					<li>Hiển thị nội dung cho bạn trong platform</li>
					<li>Sử dụng dữ liệu ẩn danh để cải thiện AI (có thể từ chối)</li>
				</ul>
				<h3>5.2 Nội dung của Leaply</h3>
				<p>Leaply sở hữu:</p>
				<ul>
					<li>Giao diện, thiết kế, logo</li>
					<li>Thuật toán và mã nguồn</li>
					<li>Nội dung hướng dẫn và tài liệu</li>
					<li>Cơ sở dữ liệu chương trình học</li>
				</ul>
				<p>
					Bạn KHÔNG được sao chép, phân phối hoặc tạo sản phẩm phái sinh từ nội
					dung của Leaply mà không có sự cho phép bằng văn bản.
				</p>
				<hr />
				<h2>6. Thanh toán và Hoàn tiền</h2>
				<h3>6.1 Gói dịch vụ</h3>
				<p>Leaply cung cấp các gói:</p>
				<ul>
					<li>
						<strong>Free:</strong> Tính năng cơ bản, giới hạn sử dụng
					</li>
					<li>
						<strong>Pro:</strong> [Giá]/tháng - Tính năng nâng cao
					</li>
					<li>
						<strong>Premium:</strong> [Giá]/tháng - Đầy đủ tính năng
					</li>
				</ul>
				<h3>6.2 Chính sách thanh toán</h3>
				<ul>
					<li>Thanh toán theo chu kỳ tháng hoặc năm</li>
					<li>Tự động gia hạn trừ khi bạn hủy</li>
					<li>Giá có thể thay đổi với thông báo trước 30 ngày</li>
				</ul>
				<h3>6.3 Chính sách hoàn tiền</h3>
				<p>
					<strong>Leaply KHÔNG hoàn tiền</strong> cho:
				</p>
				<ul>
					<li>Gói đã thanh toán và bắt đầu sử dụng</li>
					<li>Chu kỳ thanh toán đang diễn ra</li>
					<li>Tài khoản bị khóa do vi phạm điều khoản</li>
				</ul>
				<p>
					<strong>Ngoại lệ:</strong>
				</p>
				<ul>
					<li>Lỗi kỹ thuật nghiêm trọng khiến dịch vụ không sử dụng được</li>
					<li>Trường hợp đặc biệt xét theo từng trường hợp</li>
				</ul>
				<p>
					Để yêu cầu xem xét hoàn tiền, liên hệ:{" "}
					<a href="mailto:contact@leaply.ai.vn">contact@leaply.ai.vn</a>
				</p>
				<hr />
				<h2>7. Chấm dứt Dịch vụ</h2>
				<h3>7.1 Bạn có thể hủy tài khoản</h3>
				<ul>
					<li>Bất kỳ lúc nào qua Cài đặt &gt; Xóa tài khoản</li>
					<li>Dữ liệu được lưu giữ 1 năm theo Chính sách Bảo mật</li>
					<li>Gói đã thanh toán không được hoàn tiền</li>
				</ul>
				<h3>7.2 Chúng tôi có thể tạm ngưng hoặc chấm dứt tài khoản</h3>
				<p>Trong trường hợp:</p>
				<ul>
					<li>Vi phạm Điều khoản Sử dụng</li>
					<li>Hoạt động gian lận hoặc bất hợp pháp</li>
					<li>Không thanh toán gói dịch vụ</li>
					<li>Yêu cầu từ cơ quan có thẩm quyền</li>
				</ul>
				<p>
					Chúng tôi sẽ thông báo trước khi chấm dứt, trừ trường hợp khẩn cấp.
				</p>
				<hr />
				<h2>8. Giới hạn Trách nhiệm</h2>
				<h3>8.1 Dịch vụ cung cấp &quot;nguyên trạng&quot;</h3>
				<p>
					Leaply được cung cấp &quot;nguyên trạng&quot; (as is) và &quot;sẵn
					có&quot; (as available). Chúng tôi không đảm bảo:
				</p>
				<ul>
					<li>Dịch vụ hoạt động không gián đoạn</li>
					<li>Thông tin chương trình học luôn chính xác 100%</li>
					<li>Kết quả ứng tuyển cụ thể</li>
				</ul>
				<h3>8.2 Giới hạn bồi thường</h3>
				<p>
					Trong phạm vi pháp luật cho phép, trách nhiệm bồi thường của Leaply
					(nếu có) không vượt quá số tiền bạn đã thanh toán trong 12 tháng gần
					nhất.
				</p>
				<p>Chúng tôi không chịu trách nhiệm cho:</p>
				<ul>
					<li>Thiệt hại gián tiếp, ngẫu nhiên</li>
					<li>Mất dữ liệu do lỗi người dùng</li>
					<li>Hành vi của bên thứ ba</li>
				</ul>
				<hr />
				<h2>9. Beta và Thay đổi Dịch vụ</h2>
				<h3>9.1 Giai đoạn Beta</h3>
				<p>Leaply hiện đang trong giai đoạn beta. Điều này có nghĩa:</p>
				<ul>
					<li>Một số tính năng có thể chưa hoàn thiện</li>
					<li>Có thể có thay đổi đáng kể</li>
					<li>Chúng tôi đánh giá cao phản hồi của bạn</li>
				</ul>
				<h3>9.2 Quyền thay đổi</h3>
				<p>Chúng tôi có quyền:</p>
				<ul>
					<li>Thêm, sửa đổi hoặc loại bỏ tính năng</li>
					<li>Thay đổi giá với thông báo trước 30 ngày</li>
					<li>Tạm ngưng dịch vụ để bảo trì</li>
				</ul>
				<hr />
				<h2>10. Quyền riêng tư</h2>
				<p>
					Việc thu thập và sử dụng thông tin cá nhân được quy định trong{" "}
					<Link href="/privacy">Chính sách Bảo mật</Link> của chúng tôi, là một
					phần không tách rời của Điều khoản Sử dụng này.
				</p>
				<hr />
				<h2>11. Luật áp dụng và Giải quyết Tranh chấp</h2>
				<h3>11.1 Luật áp dụng</h3>
				<p>Điều khoản này được điều chỉnh bởi pháp luật Việt Nam.</p>
				<h3>11.2 Giải quyết tranh chấp</h3>
				<p>Trong trường hợp có tranh chấp:</p>
				<ol>
					<li>
						<strong>Bước 1:</strong> Liên hệ hỗ trợ để giải quyết trực tiếp
					</li>
					<li>
						<strong>Bước 2:</strong> Hòa giải thông qua bên thứ ba
					</li>
					<li>
						<strong>Bước 3:</strong> Giải quyết tại Tòa án có thẩm quyền tại
						Việt Nam
					</li>
				</ol>
				<hr />
				<h2>12. Điều khoản Chung</h2>
				<h3>12.1 Toàn bộ thỏa thuận</h3>
				<p>
					Điều khoản này, cùng với Chính sách Bảo mật, tạo thành toàn bộ thỏa
					thuận giữa bạn và Leaply.
				</p>
				<h3>12.2 Tách rời</h3>
				<p>
					Nếu bất kỳ điều khoản nào bị coi là không hợp lệ, các điều khoản còn
					lại vẫn có hiệu lực.
				</p>
				<h3>12.3 Không từ bỏ quyền</h3>
				<p>
					Việc không thực thi một điều khoản không có nghĩa là từ bỏ quyền thực
					thi trong tương lai.
				</p>
				<h3>12.4 Thay đổi điều khoản</h3>
				<p>
					Chúng tôi có thể cập nhật Điều khoản này. Thay đổi quan trọng sẽ được
					thông báo qua:
				</p>
				<ul>
					<li>Email</li>
					<li>Banner trên website</li>
					<li>Yêu cầu đồng ý lại nếu cần</li>
				</ul>
				<hr />
				<h2>13. Liên hệ</h2>
				<p>Nếu có câu hỏi về Điều khoản Sử dụng:</p>
				<ul>
					<li>
						<strong>Email:</strong>{" "}
						<a href="mailto:contact@leaply.ai.vn">contact@leaply.ai.vn</a>
					</li>
					<li>
						<strong>Địa chỉ:</strong> Hà Nội, Việt Nam
					</li>
				</ul>
				<hr />
				<p>
					Bằng việc sử dụng Leaply, bạn xác nhận đã đọc, hiểu và đồng ý với các
					Điều khoản Sử dụng này.
				</p>
			</article>
		</div>
	);
}
````

## File: app/(marketing)/layout.tsx
````typescript
import { DataInitializer } from "@/components/DataInitializer";
import { Footer } from "@/components/marketing/Footer";
import { Navbar } from "@/components/marketing/Navbar";

export default async function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className={`min-h-screen flex flex-col`}>
			<Navbar />
			<DataInitializer />
			<main className="flex-1 flex flex-col min-h-0">{children}</main>
			<Footer />
		</div>
	);
}
````

## File: app/providers/query-provider.tsx
````typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
						gcTime: 5 * 60 * 1000,
						refetchOnWindowFocus: false,
						retry: 1,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
````

## File: components/app/LanguageSwitcher.tsx
````typescript
"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Language = "en" | "vi";

interface LanguageSwitcherProps {
	className?: string;
	currentLocale?: Language;
}

export function LanguageSwitcher({
	className,
	currentLocale,
}: LanguageSwitcherProps) {
	const router = useRouter();
	const locale = useLocale();
	const activeLocale = currentLocale || (locale as Language);

	const languages: { code: Language; label: string; flag: string }[] = [
		{ code: "en", label: "English", flag: "🇺🇸" },
		{ code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
	];

	const currentLang =
		languages.find((l) => l.code === activeLocale) || languages[0];

	const handleLanguageChange = (newLocale: Language) => {

		if ("cookieStore" in window) {
			(window.cookieStore as CookieStore).set({
				name: "locale",
				value: newLocale,
				path: "/",
				expires: Date.now() + 31536000 * 1000,
				sameSite: "lax",
			});
		} else {

			document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
		}
		router.refresh();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className={className}>
					<span className="text-sm font-medium">
						{currentLang.code.toUpperCase()}
					</span>
					<span className="sr-only">Toggle language</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{languages.map((language) => (
					<DropdownMenuItem
						key={language.code}
						onClick={() => handleLanguageChange(language.code)}
					>
						<span className="mr-2">{language.flag}</span>
						{language.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
````

## File: components/dashboard/DashboardClient.tsx
````typescript
"use client";

import { motion } from "framer-motion";
import {
	ArrowRight,
	Calendar,
	Clock,
	Compass,
	FileText,
	FolderOpen,
	GraduationCap,
	School,
	Sparkles,
	Target,
	User,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
	PageTransition,
	SlideUp,
	StaggerContainer,
	StaggerItem,
} from "@/components/PageTransition";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { HomeResponse } from "@/lib/api/types";
import { useHomeData } from "@/lib/hooks/useHomeData";
import { useUserStore } from "@/lib/store/userStore";

interface DashboardClientProps {
	initialData?: HomeResponse;
}

export function DashboardClient({ initialData }: DashboardClientProps) {
	const tHome = useTranslations("home");
	const { profile, lastActivity } = useUserStore();
	const { data: homeData, isLoading } = useHomeData(initialData);


	const profileCompletion = homeData?.profileCompletion ?? 0;
	const upcomingDeadlinesCount = homeData?.upcomingDeadlines?.length ?? 0;
	const applicationsCount = homeData?.applications?.total ?? 0;
	const submittedApplications =
		homeData?.applications?.byStatus?.submitted ?? 0;
	const discoveryTracks = homeData?.discovery?.completedTracks ?? 0;
	const totalTracks = homeData?.discovery?.totalTracks ?? 4;
	const suggestedAction = homeData?.suggestedAction;
	const recentApplications = homeData?.recentApplications ?? [];


	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return tHome("greeting.morning");
		if (hour < 18) return tHome("greeting.afternoon");
		return tHome("greeting.evening");
	};


	const formatLastActivity = (timestamp?: number) => {
		if (!timestamp) return null;
		const diff = Date.now() - timestamp;
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) return `${days} ${tHome("daysAgo")}`;
		if (hours > 0) return `${hours} ${tHome("hoursAgo")}`;
		if (minutes > 0) return `${minutes} ${tHome("minutesAgo")}`;
		return tHome("justNow");
	};

	return (
		<PageTransition>
			<div className="min-h-screen bg-background">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{}
					<SlideUp>
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-foreground mb-2">
								{getGreeting()},{" "}
								{homeData?.firstName ||
									profile?.fullName?.split(" ").pop() ||
									tHome("you")}
								!
							</h1>
							<p className="text-lg text-muted-foreground">
								{tHome("subtitle")}
							</p>
						</div>
					</SlideUp>

					{}
					<SlideUp delay={0.1}>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							{isLoading ? (
								<Card className="mb-8">
									<CardContent className="p-6">
										<div className="flex items-start gap-4">
											<Skeleton className="w-14 h-14 rounded-2xl" />
											<div className="flex-1 space-y-3">
												<Skeleton className="h-5 w-24" />
												<Skeleton className="h-6 w-48" />
												<Skeleton className="h-4 w-64" />
												<Skeleton className="h-10 w-32" />
											</div>
										</div>
									</CardContent>
								</Card>
							) : suggestedAction?.type === "persona" ||
								suggestedAction?.type === "writing" ? (
								<Card className="mb-8 bg-linear-to-br from-primary/5 via-chart-2/5 to-transparent border-primary/20 overflow-hidden relative">
									<div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
									<CardContent className="p-6 relative">
										<div className="flex items-start gap-4">
											<div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
												<Sparkles className="w-7 h-7 text-primary" />
											</div>
											<div className="flex-1">
												<Badge className="bg-primary/10 text-primary mb-2 hover:bg-primary/20">
													{tHome("suggestedForYou")}
												</Badge>
												<h3 className="text-xl font-semibold text-foreground mb-2">
													{suggestedAction?.title || tHome("startDiscovery")}
												</h3>
												<p className="text-muted-foreground mb-4">
													{suggestedAction?.description ||
														tHome("startDiscoveryDesc")}
												</p>
												<Button asChild>
													<Link href={suggestedAction?.link || "/persona-lab"}>
														{tHome("goToPersonaLab")}
														<ArrowRight className="w-4 h-4 ml-2" />
													</Link>
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							) : suggestedAction?.type === "deadline" ? (
								<Card className="mb-8 bg-linear-to-br from-chart-4/5 via-primary/5 to-transparent border-chart-4/20 overflow-hidden relative">
									<div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-chart-4/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
									<CardContent className="p-6 relative">
										<div className="flex items-start gap-4">
											<div className="w-14 h-14 bg-chart-4/10 rounded-2xl flex items-center justify-center shrink-0">
												<Calendar className="w-7 h-7 text-chart-4" />
											</div>
											<div className="flex-1">
												<Badge className="bg-chart-4/10 text-chart-4 mb-2 hover:bg-chart-4/20">
													{tHome("suggestedForYou")}
												</Badge>
												<h3 className="text-xl font-semibold text-foreground mb-2">
													{suggestedAction?.title}
												</h3>
												<p className="text-muted-foreground mb-4">
													{suggestedAction?.description}
												</p>
												<Button
													asChild
													className="bg-chart-4 hover:bg-chart-4/90"
												>
													<Link
														href={
															suggestedAction?.link || "/dashboard/applications"
														}
													>
														{tHome("viewAll")}
														<ArrowRight className="w-4 h-4 ml-2" />
													</Link>
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							) : (
								<Card className="mb-8 bg-linear-to-br from-chart-2/5 via-primary/5 to-transparent border-chart-2/20 overflow-hidden relative">
									<div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-chart-2/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
									<CardContent className="p-6 relative">
										<div className="flex items-start gap-4">
											<div className="w-14 h-14 bg-chart-2/10 rounded-2xl flex items-center justify-center shrink-0">
												<Target className="w-7 h-7 text-chart-2" />
											</div>
											<div className="flex-1">
												<Badge className="bg-chart-2/10 text-chart-2 mb-2 hover:bg-chart-2/20">
													{tHome("suggestedForYou")}
												</Badge>
												<h3 className="text-xl font-semibold text-foreground mb-2">
													{suggestedAction?.title || tHome("addFirstTarget")}
												</h3>
												<p className="text-muted-foreground mb-4">
													{suggestedAction?.description ||
														tHome("addFirstTargetDesc")}
												</p>
												<Button
													asChild
													className="bg-chart-2 hover:bg-chart-2/90"
												>
													<Link href={suggestedAction?.link || "/explore"}>
														{tHome("exploreSchools")}
														<ArrowRight className="w-4 h-4 ml-2" />
													</Link>
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							)}
						</motion.div>
					</SlideUp>

					{}
					<SlideUp delay={0.2}>
						<StaggerContainer>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
								<StaggerItem>
									<Card className="hover:shadow-md transition-shadow">
										<CardContent className="p-5">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
													<User className="w-5 h-5 text-primary" />
												</div>
												<span className="text-sm font-medium text-muted-foreground">
													{tHome("profile")}
												</span>
											</div>
											<div className="space-y-2">
												<div className="flex items-baseline justify-between">
													<span className="text-2xl font-bold text-foreground">
														{isLoading ? (
															<Skeleton className="h-7 w-12 inline-block" />
														) : (
															`${profileCompletion}%`
														)}
													</span>
													<span className="text-xs text-muted-foreground">
														{tHome("completed")}
													</span>
												</div>
												<Progress
													value={isLoading ? 0 : profileCompletion}
													className="h-2"
												/>
											</div>
										</CardContent>
									</Card>
								</StaggerItem>

								<StaggerItem>
									<Card className="hover:shadow-md transition-shadow">
										<CardContent className="p-5">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-chart-2/10 rounded-lg flex items-center justify-center">
													<FolderOpen className="w-5 h-5 text-chart-2" />
												</div>
												<span className="text-sm font-medium text-muted-foreground">
													{tHome("applications")}
												</span>
											</div>
											<div className="flex items-baseline gap-2">
												<span className="text-2xl font-bold text-foreground">
													{isLoading ? (
														<Skeleton className="h-7 w-8 inline-block" />
													) : (
														applicationsCount
													)}
												</span>
												<span className="text-sm text-muted-foreground">
													{submittedApplications} {tHome("submitted")}
												</span>
											</div>
										</CardContent>
									</Card>
								</StaggerItem>

								<StaggerItem>
									<Card className="hover:shadow-md transition-shadow">
										<CardContent className="p-5">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-chart-4/10 rounded-lg flex items-center justify-center">
													<Calendar className="w-5 h-5 text-chart-4" />
												</div>
												<span className="text-sm font-medium text-muted-foreground">
													{tHome("upcomingDeadlines")}
												</span>
											</div>
											<div className="flex items-baseline gap-2">
												<span className="text-2xl font-bold text-foreground">
													{isLoading ? (
														<Skeleton className="h-7 w-8 inline-block" />
													) : (
														upcomingDeadlinesCount
													)}
												</span>
												<span className="text-sm text-muted-foreground">
													{tHome("deadlines")}
												</span>
											</div>
										</CardContent>
									</Card>
								</StaggerItem>

								<StaggerItem>
									<Card className="hover:shadow-md transition-shadow">
										<CardContent className="p-5">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-chart-3/10 rounded-lg flex items-center justify-center">
													<Compass className="w-5 h-5 text-chart-3" />
												</div>
												<span className="text-sm font-medium text-muted-foreground">
													{tHome("discovery")}
												</span>
											</div>
											<div className="flex items-baseline gap-2">
												<span className="text-2xl font-bold text-foreground">
													{isLoading ? (
														<Skeleton className="h-7 w-8 inline-block" />
													) : (
														discoveryTracks
													)}
												</span>
												<span className="text-sm text-muted-foreground">
													/ {totalTracks} {tHome("tracks")}
												</span>
											</div>
										</CardContent>
									</Card>
								</StaggerItem>
							</div>
						</StaggerContainer>
					</SlideUp>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{}
						<div className="lg:col-span-2">
							<SlideUp delay={0.3}>
								<Card>
									<CardHeader className="flex flex-row items-center justify-between pb-2">
										<CardTitle className="text-lg flex items-center gap-2">
											<School className="w-5 h-5 text-muted-foreground" />
											{tHome("yourApplications")}
										</CardTitle>
										<Button variant="ghost" size="sm" asChild>
											<Link href="/dashboard/applications">
												{tHome("viewAll")}
												<ArrowRight className="w-4 h-4 ml-1" />
											</Link>
										</Button>
									</CardHeader>
									<CardContent>
										{isLoading ? (
											<div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
												{[1, 2, 3].map((i) => (
													<div key={i} className="min-w-[220px] shrink-0">
														<Card className="h-full">
															<CardContent className="p-4 space-y-3">
																<div className="flex items-start gap-3">
																	<Skeleton className="h-10 w-10 rounded-full" />
																	<div className="flex-1 space-y-2">
																		<Skeleton className="h-4 w-24" />
																		<Skeleton className="h-3 w-32" />
																	</div>
																</div>
																<div className="flex justify-between">
																	<Skeleton className="h-5 w-16" />
																	<Skeleton className="h-4 w-12" />
																</div>
															</CardContent>
														</Card>
													</div>
												))}
											</div>
										) : recentApplications.length > 0 ? (
											<div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
												{recentApplications.map((app) => (
													<Link
														key={app.id}
														href={`/dashboard/applications/${app.id}`}
														className="min-w-[220px] shrink-0"
													>
														<Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
															<CardContent className="p-4">
																<div className="flex items-start gap-3 mb-3">
																	<Avatar className="h-10 w-10 shrink-0">
																		<AvatarFallback className="text-xs">
																			{app.universityName
																				.substring(0, 2)
																				.toUpperCase()}
																		</AvatarFallback>
																	</Avatar>
																	<div className="flex-1 min-w-0">
																		<h4 className="font-medium text-sm text-foreground truncate">
																			{app.universityName}
																		</h4>
																		<p className="text-xs text-muted-foreground truncate">
																			{app.programName}
																		</p>
																	</div>
																</div>
																<div className="space-y-2">
																	<div className="flex items-center justify-between">
																		<Badge
																			variant={
																				app.status === "submitted"
																					? "default"
																					: "secondary"
																			}
																			className="text-xs capitalize"
																		>
																			{app.status}
																		</Badge>
																		{app.fitScore && (
																			<span className="text-xs font-medium text-foreground">
																				{app.fitScore}% {tHome("fit")}
																			</span>
																		)}
																	</div>
																</div>
															</CardContent>
														</Card>
													</Link>
												))}
											</div>
										) : (
											<div className="text-center py-8">
												<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
													<GraduationCap className="w-8 h-8 text-muted-foreground" />
												</div>
												<p className="text-muted-foreground mb-4">
													{tHome("noApplicationsYet")}
												</p>
												<Button variant="outline" size="sm" asChild>
													<Link href="/explore">{tHome("exploreSchools")}</Link>
												</Button>
											</div>
										)}
									</CardContent>
								</Card>
							</SlideUp>
						</div>

						{}
						<div>
							<SlideUp delay={0.4}>
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-lg flex items-center gap-2">
											<Clock className="w-5 h-5 text-muted-foreground" />
											{tHome("continueWhereYouLeft")}
										</CardTitle>
									</CardHeader>
									<CardContent>
										{lastActivity ? (
											<div className="space-y-4">
												<div className="p-4 bg-muted/50 rounded-lg">
													<div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
														<Clock className="w-3 h-3" />
														{formatLastActivity(lastActivity.timestamp)}
													</div>
													<p className="font-medium text-foreground mb-1">
														{lastActivity.title}
													</p>
													<p className="text-sm text-muted-foreground">
														{lastActivity.type}
													</p>
												</div>
												<Button className="w-full" asChild>
													<Link href={lastActivity.path}>
														{tHome("continueWhereYouLeft")}
														<ArrowRight className="w-4 h-4 ml-2" />
													</Link>
												</Button>
											</div>
										) : (
											<div className="text-center py-6">
												<div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
													<FileText className="w-6 h-6 text-muted-foreground" />
												</div>
												<p className="text-sm text-muted-foreground">
													{tHome("startYourJourney")}
												</p>
											</div>
										)}
									</CardContent>
								</Card>
							</SlideUp>

							{}
							<SlideUp delay={0.5}>
								<Card className="mt-6">
									<CardHeader className="pb-2">
										<CardTitle className="text-lg">
											{tHome("quickActions")}
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2">
										<Button
											variant="outline"
											className="w-full justify-start"
											asChild
										>
											<Link href="/persona-lab">
												<Sparkles className="w-4 h-4 mr-2 text-primary" />
												Persona Lab
											</Link>
										</Button>
										<Button
											variant="outline"
											className="w-full justify-start"
											asChild
										>
											<Link href="/explore">
												<GraduationCap className="w-4 h-4 mr-2 text-chart-2" />
												{tHome("exploreSchools")}
											</Link>
										</Button>
										<Button
											variant="outline"
											className="w-full justify-start"
											asChild
										>
											<Link href="/dashboard/profile">
												<User className="w-4 h-4 mr-2 text-chart-4" />
												{tHome("updateProfile")}
											</Link>
										</Button>
									</CardContent>
								</Card>
							</SlideUp>
						</div>
					</div>
				</div>
			</div>
		</PageTransition>
	);
}
````

## File: components/explore/program-detail/ApplicationSidebar.tsx
````typescript
"use client";

import { Calendar, Circle } from "lucide-react";
import type {
	ProgramDetailResponse,
	ProgramIntakeResponse,
} from "@/lib/api/types";

interface ApplicationSidebarProps {
	program: ProgramDetailResponse;
}

function getDaysUntil(dateString?: string): number | null {
	if (!dateString) return null;
	const now = new Date();
	const target = new Date(dateString);
	const diff = target.getTime() - now.getTime();
	return Math.ceil(diff / (1000 * 60 * 60 * 24));
}




export function ApplicationSidebar({ program }: ApplicationSidebarProps) {

	const checklistItems = program.requirements?.documents || [
		"Official Transcripts",
		"Test Scores (IELTS/TOEFL)",
		"2 Letters of Recommendation",
		"Statement of Purpose",
		"Resume/CV",
	];


	const upcomingDeadlines = (program.intakes || [])
		.filter((intake) => intake.applicationDeadline || intake.earlyDeadline)
		.slice(0, 3);

	return (
		<div className="space-y-6">
			{}
			<div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
				<div className="p-4 border-b border-border bg-muted/30">
					<h3 className="font-bold text-foreground">Application Checklist</h3>
				</div>
				<div className="p-4">
					<ul className="space-y-3">
						{checklistItems.map((item) => (
							<li key={item} className="flex items-center gap-3 text-sm">
								<Circle className="w-4 h-4 text-muted-foreground" />
								<span className="text-foreground">{item}</span>
							</li>
						))}
					</ul>
					{program.requirements?.notes && (
						<p className="mt-4 text-xs text-muted-foreground border-t border-border pt-3">
							Note: {program.requirements.notes}
						</p>
					)}
				</div>
			</div>

			{}
			<div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
				<div className="p-4 border-b border-border bg-muted/30">
					<h3 className="font-bold text-foreground">Upcoming Deadlines</h3>
				</div>
				<div className="p-4">
					{upcomingDeadlines.length > 0 ? (
						<ul className="space-y-4">
							{upcomingDeadlines.map((intake) => (
								<DeadlineItem key={intake.id} intake={intake} />
							))}
						</ul>
					) : program.nextDeadline ? (
						<div className="flex items-start gap-3">
							<Calendar className="w-5 h-5 text-primary mt-0.5" />
							<div>
								<p className="text-sm font-medium text-foreground">
									Next Deadline
								</p>
								<p className="text-sm text-muted-foreground">
									{new Date(program.nextDeadline).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</p>
								{(() => {
									const daysLeft = getDaysUntil(program.nextDeadline);
									if (daysLeft === null) return null;
									return (
										<span
											className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
												daysLeft <= 30
													? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
													: daysLeft <= 60
														? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
														: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
											}`}
										>
											{daysLeft} days left
										</span>
									);
								})()}
							</div>
						</div>
					) : (
						<p className="text-sm text-muted-foreground">
							No deadline information available.
						</p>
					)}
				</div>
			</div>

			{}
			{program.applicationFeeUsd && (
				<div className="bg-card border border-border rounded-xl p-4 shadow-sm">
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">
							Application Fee
						</span>
						<span className="text-lg font-bold text-foreground">
							${program.applicationFeeUsd}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}

function DeadlineItem({ intake }: { intake: ProgramIntakeResponse }) {
	const earlyDays = getDaysUntil(intake.earlyDeadline);
	const regularDays = getDaysUntil(intake.applicationDeadline);

	return (
		<li className="space-y-2">
			<p className="text-sm font-semibold text-foreground">
				{intake.seasonDisplay} {intake.season}
			</p>
			{intake.earlyDeadline && (
				<div className="flex items-center gap-2 text-sm">
					<Calendar className="w-4 h-4 text-blue-500" />
					<span className="text-muted-foreground">Early:</span>
					<span className="text-foreground">
						{new Date(intake.earlyDeadline).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
						})}
					</span>
					{earlyDays !== null && (
						<span className="text-xs text-muted-foreground">
							({earlyDays} days)
						</span>
					)}
				</div>
			)}
			{intake.applicationDeadline && (
				<div className="flex items-center gap-2 text-sm">
					<Calendar className="w-4 h-4 text-primary" />
					<span className="text-muted-foreground">Regular:</span>
					<span className="text-foreground">
						{new Date(intake.applicationDeadline).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
						})}
					</span>
					{regularDays !== null && (
						<span className="text-xs text-muted-foreground">
							({regularDays} days)
						</span>
					)}
				</div>
			)}
		</li>
	);
}
````

## File: components/explore/program-detail/FitScoreExpanded.tsx
````typescript
"use client";

import type { ProgramDetailResponse } from "@/lib/api/types";

interface FitBreakdown {
	label: string;
	score: number;
	maxScore: number;
}

interface FitScoreExpandedProps {
	program: ProgramDetailResponse;
	breakdown?: FitBreakdown[];
}




export function FitScoreExpanded({
	program,
	breakdown,
}: FitScoreExpandedProps) {
	const fitStyles = {
		reach: {
			badge:
				"bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
			bar: "bg-blue-500",
			label: "REACH SCHOOL",
		},
		target: {
			badge:
				"bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
			bar: "bg-yellow-500",
			label: "TARGET SCHOOL",
		},
		safety: {
			badge:
				"bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30",
			bar: "bg-green-500",
			label: "SAFETY SCHOOL",
		},
	};

	const category = (program.fitCategory || "target") as keyof typeof fitStyles;
	const style = fitStyles[category] || fitStyles.target;


	const defaultBreakdown: FitBreakdown[] = breakdown || [
		{ label: "Academic", score: 18, maxScore: 25 },
		{ label: "English", score: 20, maxScore: 25 },
		{ label: "Financial", score: 12, maxScore: 25 },
		{ label: "Field Match", score: 25, maxScore: 25 },
	];

	return (
		<div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
			{}
			<div className="p-6 border-b border-border bg-muted/30">
				<h3 className="text-lg font-bold text-foreground mb-4">
					Your Fit Analysis
				</h3>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<span className="text-4xl font-bold text-foreground">
							{program.fitScore || 67}
						</span>
						<span className="text-muted-foreground">/100</span>
					</div>
					<span
						className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider border ${style.badge}`}
					>
						{style.label}
					</span>
				</div>
			</div>

			{}
			<div className="p-6 border-b border-border">
				<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
					📊 Breakdown
				</h4>
				<div className="space-y-4">
					{defaultBreakdown.map((item) => (
						<div key={item.label} className="space-y-1.5">
							<div className="flex items-center justify-between text-sm">
								<span className="text-foreground font-medium">
									{item.label}
								</span>
								<span className="text-muted-foreground">
									{item.score}/{item.maxScore}
								</span>
							</div>
							<div className="w-full h-2 bg-muted rounded-full overflow-hidden">
								<div
									className={`h-full ${style.bar} transition-all duration-500`}
									style={{ width: `${(item.score / item.maxScore) * 100}%` }}
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			{}
			{program.fitReasons && program.fitReasons.length > 0 && (
				<div className="p-6 border-b border-border">
					<h4 className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
						✅ Strengths
					</h4>
					<ul className="space-y-2">
						{program.fitReasons.map((reason) => (
							<li
								key={reason}
								className="flex items-start gap-2 text-sm text-foreground"
							>
								<span className="text-green-500 mt-0.5">•</span>
								<span>{reason}</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{}
			{program.fitGaps && program.fitGaps.length > 0 && (
				<div className="p-6">
					<h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
						⚠️ Gaps & Recommendations
					</h4>
					<ul className="space-y-2">
						{program.fitGaps.map((gap) => (
							<li
								key={gap}
								className="flex items-start gap-2 text-sm text-foreground"
							>
								<span className="text-amber-500 mt-0.5">•</span>
								<span>{gap}</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
````

## File: components/explore/program-detail/index.ts
````typescript
export { ApplicationSidebar } from "./ApplicationSidebar";
export { FitScoreExpanded } from "./FitScoreExpanded";
export { ProgramTabs } from "./ProgramTabs";
export { QuickFactsBar } from "./QuickFactsBar";
````

## File: components/explore/program-detail/ProgramTabs.tsx
````typescript
"use client";

import {
	BookOpen,
	Briefcase,
	Calendar,
	ClipboardList,
	GraduationCap,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProgramDetailResponse } from "@/lib/api/types";

interface ProgramTabsProps {
	program: ProgramDetailResponse;
}




export function ProgramTabs({ program }: ProgramTabsProps) {
	return (
		<Tabs defaultValue="overview" className="w-full">
			<TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 gap-0">
				<TabsTrigger
					value="overview"
					className="flex items-center gap-2 px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
				>
					<BookOpen className="w-4 h-4" />
					Overview
				</TabsTrigger>
				<TabsTrigger
					value="requirements"
					className="flex items-center gap-2 px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
				>
					<ClipboardList className="w-4 h-4" />
					Requirements
				</TabsTrigger>
				<TabsTrigger
					value="deadlines"
					className="flex items-center gap-2 px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
				>
					<Calendar className="w-4 h-4" />
					Deadlines
				</TabsTrigger>
				<TabsTrigger
					value="curriculum"
					className="flex items-center gap-2 px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
				>
					<GraduationCap className="w-4 h-4" />
					Curriculum
				</TabsTrigger>
				<TabsTrigger
					value="careers"
					className="flex items-center gap-2 px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
				>
					<Briefcase className="w-4 h-4" />
					Careers
				</TabsTrigger>
			</TabsList>

			{}
			<TabsContent value="overview" className="pt-6">
				<div className="prose dark:prose-invert max-w-none">
					<h3>About this Program</h3>
					<p className="text-muted-foreground leading-relaxed">
						{program.programDescription ||
							`The ${program.programName} at ${program.universityName} is designed to provide students with advanced knowledge and skills in ${program.majorCategories?.join(", ") || "their field of study"}. This ${program.degreeType} program offers a comprehensive curriculum that prepares graduates for success in both academic and professional settings.`}
					</p>

					<h3>About {program.universityName}</h3>
					<p className="text-muted-foreground leading-relaxed">
						{program.universityDescription ||
							`Located in ${program.universityCity}, ${program.universityCountry}, ${program.universityName} is ranked ${program.rankingQsDisplay || "N/A"} globally according to QS World Rankings. The university is known for its research excellence and diverse international community.`}
					</p>

					{program.language && (
						<>
							<h4>Language of Instruction</h4>
							<p className="text-muted-foreground">{program.language}</p>
						</>
					)}

					{program.deliveryMode && (
						<>
							<h4>Delivery Mode</h4>
							<p className="text-muted-foreground">{program.deliveryMode}</p>
						</>
					)}
				</div>
			</TabsContent>

			{}
			<TabsContent value="requirements" className="pt-6">
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{}
						<div className="bg-muted/30 rounded-xl p-6">
							<h4 className="font-bold text-foreground mb-4">
								Academic Requirements
							</h4>
							<ul className="space-y-3 text-sm">
								{program.requirements?.gpaMinimum && (
									<li className="flex justify-between">
										<span className="text-muted-foreground">Minimum GPA</span>
										<span className="font-medium text-foreground">
											{program.requirements.gpaMinimum}/
											{program.requirements.gpaScale || 4.0}
										</span>
									</li>
								)}
								{program.degreeType && (
									<li className="flex justify-between">
										<span className="text-muted-foreground">Degree Type</span>
										<span className="font-medium text-foreground">
											{program.degreeType}
										</span>
									</li>
								)}
								{program.requirements?.workExperienceYears !== undefined &&
									program.requirements.workExperienceYears > 0 && (
										<li className="flex justify-between">
											<span className="text-muted-foreground">
												Work Experience
											</span>
											<span className="font-medium text-foreground">
												{program.requirements.workExperienceYears}+ years
											</span>
										</li>
									)}
							</ul>
						</div>

						{}
						<div className="bg-muted/30 rounded-xl p-6">
							<h4 className="font-bold text-foreground mb-4">
								English Proficiency
							</h4>
							<ul className="space-y-3 text-sm">
								{(program.requirements?.ieltsMinimum ||
									program.ieltsMinimum) && (
									<li className="flex justify-between">
										<span className="text-muted-foreground">IELTS Minimum</span>
										<span className="font-medium text-foreground">
											{program.requirements?.ieltsMinimum ||
												program.ieltsMinimum}
										</span>
									</li>
								)}
								{(program.requirements?.toeflMinimum ||
									program.toeflMinimum) && (
									<li className="flex justify-between">
										<span className="text-muted-foreground">TOEFL Minimum</span>
										<span className="font-medium text-foreground">
											{program.requirements?.toeflMinimum ||
												program.toeflMinimum}
										</span>
									</li>
								)}
							</ul>
						</div>

						{}
						{(program.requirements?.greRequired ||
							program.requirements?.gmatRequired) && (
							<div className="bg-muted/30 rounded-xl p-6">
								<h4 className="font-bold text-foreground mb-4">
									Standardized Tests
								</h4>
								<ul className="space-y-3 text-sm">
									{program.requirements?.greRequired && (
										<li className="flex justify-between">
											<span className="text-muted-foreground">GRE</span>
											<span className="font-medium text-foreground">
												Required
											</span>
										</li>
									)}
									{program.requirements?.gmatRequired && (
										<li className="flex justify-between">
											<span className="text-muted-foreground">GMAT</span>
											<span className="font-medium text-foreground">
												Required
											</span>
										</li>
									)}
								</ul>
							</div>
						)}

						{}
						{program.requirements?.documents &&
							program.requirements.documents.length > 0 && (
								<div className="bg-muted/30 rounded-xl p-6">
									<h4 className="font-bold text-foreground mb-4">
										Required Documents
									</h4>
									<ul className="space-y-2 text-sm">
										{program.requirements.documents.map((doc) => (
											<li
												key={doc}
												className="flex items-center gap-2 text-foreground"
											>
												<span className="w-1.5 h-1.5 rounded-full bg-primary" />
												{doc}
											</li>
										))}
									</ul>
								</div>
							)}
					</div>
				</div>
			</TabsContent>

			{}
			<TabsContent value="deadlines" className="pt-6">
				<div className="space-y-6">
					{program.intakes && program.intakes.length > 0 ? (
						program.intakes.map((intake) => (
							<div
								key={intake.id}
								className="bg-card border border-border rounded-xl p-6"
							>
								<div className="flex items-center justify-between mb-4">
									<h4 className="font-bold text-foreground text-lg">
										{intake.seasonDisplay} Intake
									</h4>
									{intake.isActive && (
										<span className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
											Open
										</span>
									)}
								</div>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
									{intake.earlyDeadline && (
										<div>
											<p className="text-muted-foreground">Early Deadline</p>
											<p className="font-medium text-foreground">
												{new Date(intake.earlyDeadline).toLocaleDateString(
													"en-US",
													{ month: "short", day: "numeric", year: "numeric" },
												)}
											</p>
										</div>
									)}
									{intake.applicationDeadline && (
										<div>
											<p className="text-muted-foreground">Regular Deadline</p>
											<p className="font-medium text-foreground">
												{new Date(
													intake.applicationDeadline,
												).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
												})}
											</p>
										</div>
									)}
									{intake.startDate && (
										<div>
											<p className="text-muted-foreground">Program Starts</p>
											<p className="font-medium text-foreground">
												{new Date(intake.startDate).toLocaleDateString(
													"en-US",
													{
														month: "short",
														day: "numeric",
														year: "numeric",
													},
												)}
											</p>
										</div>
									)}
								</div>
							</div>
						))
					) : (
						<div className="bg-muted/30 rounded-xl p-6 text-center">
							<p className="text-muted-foreground">
								Detailed intake information is not available for this program.
							</p>
							{program.nextDeadline && (
								<p className="mt-2 text-foreground">
									Next deadline:{" "}
									{new Date(program.nextDeadline).toLocaleDateString("en-US", {
										month: "long",
										day: "numeric",
										year: "numeric",
									})}
								</p>
							)}
						</div>
					)}
				</div>
			</TabsContent>

			{}
			<TabsContent value="curriculum" className="pt-6">
				<div className="bg-muted/30 rounded-xl p-8 text-center">
					<GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
					<h4 className="text-lg font-bold text-foreground mb-2">
						Curriculum Details
					</h4>
					<p className="text-muted-foreground max-w-md mx-auto">
						Detailed curriculum information for this program will be available
						soon. Please visit the{" "}
						{program.programUrl ? (
							<a
								href={program.programUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary underline"
							>
								official program page
							</a>
						) : (
							"official university website"
						)}{" "}
						for more information.
					</p>
				</div>
			</TabsContent>

			{}
			<TabsContent value="careers" className="pt-6">
				<div className="bg-muted/30 rounded-xl p-8 text-center">
					<Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
					<h4 className="text-lg font-bold text-foreground mb-2">
						Career Outcomes
					</h4>
					<p className="text-muted-foreground max-w-md mx-auto">
						Career outcome data for this program will be available soon.
						Graduates typically pursue roles in{" "}
						{program.majorCategories?.join(", ") || "their field of expertise"}.
					</p>
				</div>
			</TabsContent>
		</Tabs>
	);
}
````

## File: components/explore/program-detail/QuickFactsBar.tsx
````typescript
"use client";

import { Clock, DollarSign, FileText, GraduationCap } from "lucide-react";
import type { ProgramDetailResponse } from "@/lib/api/types";

interface QuickFactsBarProps {
	program: ProgramDetailResponse;
}




export function QuickFactsBar({ program }: QuickFactsBarProps) {
	const formatCurrency = (amount?: number) => {
		if (!amount) return "N/A";
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const facts = [
		{
			icon: DollarSign,
			label: "Tuition",
			value: program.tuition?.annualUsd
				? `${formatCurrency(program.tuition.annualUsd)}/yr`
				: `${formatCurrency(program.tuitionAnnualUsd)}/yr`,
		},
		{
			icon: Clock,
			label: "Duration",
			value: program.durationMonths
				? `${program.durationMonths} months`
				: "N/A",
		},
		{
			icon: GraduationCap,
			label: "IELTS Min",
			value: program.requirements?.ieltsMinimum
				? program.requirements.ieltsMinimum.toString()
				: program.ieltsMinimum?.toString() || "N/A",
		},
		{
			icon: FileText,
			label: "GPA Min",
			value: program.requirements?.gpaMinimum
				? `${program.requirements.gpaMinimum}/${program.requirements.gpaScale || 4.0}`
				: "N/A",
		},
	];

	return (
		<div className="bg-card border border-border rounded-xl p-4 shadow-sm">
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{facts.map((fact, i) => {
					const Icon = fact.icon;
					return (
						<div
							key={fact.label}
							className={`flex items-center gap-3 ${
								i < facts.length - 1 ? "md:border-r md:border-border" : ""
							}`}
						>
							<div className="p-2 rounded-lg bg-muted">
								<Icon className="w-5 h-5 text-primary" />
							</div>
							<div>
								<p className="text-xs text-muted-foreground uppercase tracking-wider">
									{fact.label}
								</p>
								<p className="text-lg font-bold text-foreground">
									{fact.value}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
````

## File: components/explore/CompareTray.tsx
````typescript
"use client";

import { ArrowRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProgramListItemResponse } from "@/lib/api/types";

interface SelectedProgramChipProps {
	program: ProgramListItemResponse;
	onRemove: () => void;
}




export function SelectedProgramChip({
	program,
	onRemove,
}: SelectedProgramChipProps) {
	return (
		<Badge variant="secondary" className="gap-2 pr-1 text-sm py-1.5 px-3">
			<span className="font-medium">{program.universityName}</span>
			<button
				type="button"
				onClick={onRemove}
				className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
				aria-label="Remove"
			>
				<X className="w-3.5 h-3.5" />
			</button>
		</Badge>
	);
}

interface CompareTrayProps {
	selectedCount: number;
	maxPrograms: number;
	selectedProgramsList: (ProgramListItemResponse | undefined)[];
	onRemoveProgram: (id: string) => void;
	onClearAll: () => void;
	onCompare: () => void;
}




export function CompareTray({
	selectedCount,
	maxPrograms,
	selectedProgramsList,
	onRemoveProgram,
	onClearAll,
	onCompare,
}: CompareTrayProps) {
	if (selectedCount === 0) {
		return null;
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-card via-card to-card/95 border-t-2 border-primary shadow-2xl z-50 backdrop-blur-sm">
			<div className="max-w-7xl mx-auto px-6 py-5">
				<div className="flex items-center justify-between gap-6">
					{}
					<div className="flex-1 space-y-3">
						{}
						<div className="flex items-center gap-2">
							<h3 className="text-lg font-bold text-foreground">
								So sánh chương trình
							</h3>
							<Badge variant="secondary" className="font-semibold">
								{selectedCount}/{maxPrograms}
							</Badge>
						</div>

						{}
						<div className="flex items-center gap-3 flex-wrap">
							<div className="flex items-center gap-2 flex-wrap">
								{selectedProgramsList.map(
									(program) =>
										program && (
											<SelectedProgramChip
												key={program.id}
												program={program}
												onRemove={() => onRemoveProgram(program.id)}
											/>
										),
								)}
								{selectedCount > 3 && (
									<Badge variant="outline" className="font-medium">
										+{selectedCount - 3} chương trình
									</Badge>
								)}
							</div>

							{}
							<button
								type="button"
								onClick={onClearAll}
								className="text-sm text-muted-foreground hover:text-destructive transition-colors font-medium underline underline-offset-2"
							>
								Xóa tất cả
							</button>
						</div>
					</div>

					{}
					<div className="shrink-0">
						<Button
							size="lg"
							className="gap-2 px-8 py-6 text-base font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
							onClick={onCompare}
						>
							So sánh ngay
							<ArrowRight className="w-5 h-5" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
````

## File: components/explore/FilterBar.tsx
````typescript
import {
	Calendar,
	ChevronDown,
	DollarSign,
	GraduationCap,
	Sparkles,
} from "lucide-react";
import { useState } from "react";




export function HorizontalFilterBar() {
	const [isExpanded, setIsExpanded] = useState(false);
	const [activeFilters, setActiveFilters] = useState<string[]>([]);

	const toggleFilter = (filter: string) => {
		setActiveFilters((prev) =>
			prev.includes(filter)
				? prev.filter((f) => f !== filter)
				: [...prev, filter],
		);
	};

	const filters = [
		{ id: "budget", label: "Within Budget", icon: DollarSign },
		{ id: "testscore", label: "Meet Test Req.", icon: GraduationCap },
		{ id: "deadline", label: "Deadline > 60 days", icon: Calendar },
		{ id: "scholarship", label: "Scholarship Available", icon: Sparkles },
	];

	return (
		<div className="bg-card border border-border rounded-xl p-4">
			{}
			<div className="flex items-center gap-3 flex-wrap">
				{filters.map((filter) => {
					const Icon = filter.icon;
					const isActive = activeFilters.includes(filter.id);
					return (
						<button
							key={filter.id}
							type="button"
							onClick={() => toggleFilter(filter.id)}
							className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
								isActive
									? "bg-primary text-primary-foreground border-primary"
									: "bg-muted/50 hover:bg-muted border-border text-foreground"
							}`}
						>
							<Icon className="w-4 h-4" />
							<span className="text-sm font-medium">{filter.label}</span>
						</button>
					);
				})}

				{}
				<button
					type="button"
					onClick={() => setIsExpanded(!isExpanded)}
					className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-full transition-colors"
				>
					<span>{isExpanded ? "Less" : "More"} Filters</span>
					<ChevronDown
						className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
					/>
				</button>
			</div>

			{}
			{isExpanded && (
				<div className="mt-4 pt-4 border-t border-border">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{}
						<div className="space-y-2">
							<span className="text-sm font-medium text-muted-foreground">
								Field of Study
							</span>
							<select className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground">
								<option value="">All Fields</option>
								<option value="cs">Computer Science</option>
								<option value="ds">Data Science</option>
								<option value="ai">Artificial Intelligence</option>
							</select>
						</div>

						{}
						<div className="space-y-2">
							<span className="text-sm font-medium text-muted-foreground">
								Region
							</span>
							<select className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground">
								<option value="">All Regions</option>
								<option value="na">North America</option>
								<option value="eu">Europe</option>
								<option value="asia">Asia Pacific</option>
							</select>
						</div>

						{}
						<div className="space-y-2">
							<span className="text-sm font-medium text-muted-foreground">
								Tuition Range
							</span>
							<select className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground">
								<option value="">Any Budget</option>
								<option value="30000">Under $30,000</option>
								<option value="50000">Under $50,000</option>
								<option value="70000">Under $70,000</option>
							</select>
						</div>

						{}
						<div className="space-y-2">
							<span className="text-sm font-medium text-muted-foreground">
								Duration
							</span>
							<select className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground">
								<option value="">Any Duration</option>
								<option value="12">1 Year</option>
								<option value="18">18 Months</option>
								<option value="24">2 Years</option>
							</select>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
````

## File: components/onboarding/components/StepContainer.tsx
````typescript
"use client";

import { motion } from "framer-motion";
import { FieldGroup } from "@/components/ui/field";
import type { StepContainerProps } from "../types";

export function StepContainer({
	stepKey,
	title,
	subtitle,
	children,
	variant = "card",
}: StepContainerProps) {
	return (
		<motion.div
			key={stepKey}
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="w-full space-y-8"
		>
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
				<p className="text-muted-foreground text-lg">{subtitle}</p>
			</div>

			{variant === "card" ? (
				<FieldGroup className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
					{children}
				</FieldGroup>
			) : (
				children
			)}
		</motion.div>
	);
}
````

## File: components/onboarding/steps/Step1BasicInfo.tsx
````typescript
"use client";

import { FieldLegend, FieldSet } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { StepContainer } from "../components/StepContainer";
import { StepNavigation } from "../components/StepNavigation";
import type {
	BasicInfo,
	OnboardingConstants,
	OnboardingTranslations,
} from "../types";

interface Step1BasicInfoProps {
	translations: OnboardingTranslations;
	constants: OnboardingConstants;
	basicInfo: BasicInfo;
	onBasicInfoChange: (field: keyof BasicInfo, value: string) => void;
	onNext: () => void;
	onBack: () => void;
}

export function Step1BasicInfo({
	translations,
	constants,
	basicInfo,
	onBasicInfoChange,
	onNext,
	onBack,
}: Step1BasicInfoProps) {
	const isValid =
		basicInfo.educationLevel.length > 0 && basicInfo.targetDegree.length > 0;

	return (
		<StepContainer
			stepKey="step1"
			title={translations.step1.title}
			subtitle={translations.step1.subtitle}
		>
			<FieldSet>
				<FieldLegend>
					{translations.step1.educationLevel}{" "}
					<span className="text-red-500">
						{translations.step1.educationLevelRequired}
					</span>
				</FieldLegend>
				<ToggleGroup
					type="single"
					variant="outline"
					spacing={2}
					size="sm"
					value={basicInfo.educationLevel}
					onValueChange={(value: string) => {
						if (value) onBasicInfoChange("educationLevel", value);
					}}
					className="flex flex-wrap gap-2"
				>
					{constants.educationLevels.map((level) => (
						<ToggleGroupItem
							key={level.value}
							value={level.value}
							className="h-auto py-2 px-4 rounded-full border-muted-foreground/30 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary transition-all"
						>
							<span className="text-sm font-medium">{level.label}</span>
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</FieldSet>

			<FieldSet>
				<FieldLegend>
					{translations.step1.targetDegree}{" "}
					<span className="text-red-500">
						{translations.step1.targetDegreeRequired}
					</span>
				</FieldLegend>
				<ToggleGroup
					type="single"
					variant="outline"
					spacing={2}
					size="sm"
					value={basicInfo.targetDegree}
					onValueChange={(value: string) => {
						if (value) onBasicInfoChange("targetDegree", value);
					}}
					className="flex flex-wrap gap-2"
				>
					{constants.programTypes.map((prog) => (
						<ToggleGroupItem
							key={prog.value}
							value={prog.value}
							disabled={prog.disabled}
							className="h-auto py-2 px-4 rounded-full border-muted-foreground/30 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary disabled:opacity-50 transition-all"
						>
							<span className="text-sm font-medium">{prog.label}</span>
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</FieldSet>

			<StepNavigation
				backLabel={translations.buttons.back}
				continueLabel={translations.buttons.continue}
				onBack={onBack}
				onNext={onNext}
				isBackDisabled
				isNextDisabled={!isValid}
			/>
		</StepContainer>
	);
}
````

## File: components/onboarding/steps/Step2Preferences.tsx
````typescript
"use client";

import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { StepContainer } from "../components/StepContainer";
import { StepNavigation } from "../components/StepNavigation";
import type {
	OnboardingConstants,
	OnboardingTranslations,
	Preferences,
} from "../types";

interface Step2PreferencesProps {
	translations: OnboardingTranslations;
	constants: OnboardingConstants;
	prefs: Preferences;
	onPrefsChange: (updates: Partial<Preferences>) => void;
	onNext: () => void;
	onBack: () => void;
}

export function Step2Preferences({
	translations,
	constants,
	prefs,
	onPrefsChange,
	onNext,
	onBack,
}: Step2PreferencesProps) {
	const isValid = prefs.fields.length > 0;

	const selectedCountries = constants.regions
		.filter((r) => prefs.regions.includes(r.name))
		.map((r) => r.countries)
		.join(", ");

	return (
		<StepContainer
			stepKey="step2"
			title={translations.step2.title}
			subtitle={translations.step2.subtitle}
		>
			{}
			<FieldSet>
				<FieldLegend className="flex items-center justify-between w-full">
					<span>
						{translations.step2.fieldsOfInterest}{" "}
						<span className="text-red-500">
							{translations.step2.fieldsRequired}
						</span>
					</span>
					<button
						type="button"
						onClick={() => onPrefsChange({ fields: [] })}
						className="text-xs font-medium hover:underline text-muted-foreground"
					>
						Đặt lại
					</button>
				</FieldLegend>
				<FieldDescription>
					{translations.step2.fieldsOfInterestMax}
				</FieldDescription>
				<ToggleGroup
					type="multiple"
					variant="outline"
					spacing={2}
					size="sm"
					value={prefs.fields}
					onValueChange={(value: string[]) => {
						if (value.length <= 3) {
							onPrefsChange({ fields: value });
						}
					}}
					className="flex flex-wrap gap-2"
				>
					{constants.fieldsOfStudy.map((field) => (
						<ToggleGroupItem
							key={field}
							value={field}
							disabled={
								!prefs.fields.includes(field) && prefs.fields.length >= 3
							}
							className="h-auto py-2 px-4 rounded-full border-muted-foreground/30 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary disabled:opacity-40 transition-all"
						>
							<span className="text-sm font-medium">{field}</span>
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</FieldSet>

			{}
			<FieldSet>
				<FieldLegend className="flex items-center justify-between w-full">
					<span>{translations.step2.regionsOfInterest}</span>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => {
								const allRegionNames = constants.regions.map((r) => r.name);
								onPrefsChange({ regions: allRegionNames });
							}}
							className="text-xs font-medium text-primary hover:underline"
						>
							Chọn tất cả
						</button>
						<button
							type="button"
							onClick={() => onPrefsChange({ regions: [] })}
							className="text-xs font-medium hover:underline text-muted-foreground"
						>
							Đặt lại
						</button>
					</div>
				</FieldLegend>
				<FieldDescription>
					{`Các quốc gia trong vùng lựa chọn: ${selectedCountries || "chưa có"}`}
				</FieldDescription>
				<ToggleGroup
					type="multiple"
					variant="outline"
					spacing={2}
					size="sm"
					value={prefs.regions}
					onValueChange={(value: string[]) => {
						onPrefsChange({ regions: value });
					}}
					className="flex flex-wrap gap-2"
				>
					{constants.regions.map((region) => (
						<ToggleGroupItem
							key={region.name}
							value={region.name}
							className="h-auto py-2 px-4 rounded-full border-muted-foreground/30 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary transition-all"
						>
							<span className="text-sm font-medium">{region.name}</span>
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</FieldSet>

			<StepNavigation
				backLabel={translations.buttons.back}
				continueLabel={translations.buttons.continue}
				onBack={onBack}
				onNext={onNext}
				isNextDisabled={!isValid}
			/>
		</StepContainer>
	);
}
````

## File: components/persona-lab/ChatSidebar/ChatMessage.tsx
````typescript
"use client";

import { motion } from "framer-motion";
import { PartyPopper, Sparkles, User } from "lucide-react";
import type { ConversationMessage } from "@/lib/types/persona";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
	message: ConversationMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
	const isUser = message.role === "user";
	const isAssistant = message.role === "assistant";
	const isCompletion = message.type === "completion";


	if (isCompletion) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3 }}
				className="space-y-2"
			>
				<div className="flex gap-2">
					<div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
						<PartyPopper className="w-3 h-3" />
					</div>
					<div
						className={cn(
							"px-3 py-2 rounded-xl text-sm max-w-[85%]",
							"bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-tl-none",
						)}
					>
						<MessageContent content={message.content} />
					</div>
				</div>
			</motion.div>
		);
	}


	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2 }}
			className={cn("flex gap-2", isUser ? "flex-row-reverse" : "flex-row")}
		>
			<div
				className={cn(
					"w-6 h-6 rounded-full flex items-center justify-center shrink-0",
					isAssistant ? "bg-primary text-primary-foreground" : "bg-muted",
				)}
			>
				{isAssistant ? (
					<Sparkles className="w-3 h-3" />
				) : (
					<User className="w-3 h-3" />
				)}
			</div>
			<div
				className={cn(
					"px-3 py-2 rounded-xl text-sm max-w-[85%]",
					isAssistant
						? "bg-muted/50 border border-border rounded-tl-none"
						: "bg-primary text-primary-foreground rounded-tr-none",
				)}
			>
				<MessageContent content={message.content} />
			</div>
		</motion.div>
	);
}


function MessageContent({ content }: { content: string }) {

	const parts = content.split(/(\*\*.*?\*\*)/g);

	return (
		<span className="whitespace-pre-wrap">
			{parts.map((part, index) => {
				if (part.startsWith("**") && part.endsWith("**")) {
					return (
						<strong key={`${part}-${index}`} className="font-semibold">
							{part.slice(2, -2)}
						</strong>
					);
				}
				return <span key={`text-${index}`}>{part}</span>;
			})}
		</span>
	);
}


export function TypingIndicator() {
	return (
		<div className="flex gap-2">
			<div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
				<Sparkles className="w-3 h-3 animate-pulse" />
			</div>
			<div className="bg-muted/50 border border-border px-3 py-2 rounded-xl rounded-tl-none flex items-center gap-1">
				<span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
				<span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
				<span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
			</div>
		</div>
	);
}






import type {
	ChatMessage as LegacyChatMessageType,
	TrackId,
} from "@/lib/types/persona";
import { TrackActionCards } from "./TrackActionCards";

interface LegacyChatMessageProps {
	message: LegacyChatMessageType;
	onTrackSelect: (trackId: TrackId) => void;
	isLoading?: boolean;
}


export function LegacyChatMessage({
	message,
	onTrackSelect,
	isLoading = false,
}: LegacyChatMessageProps) {
	const isUser = message.role === "user";
	const isAssistant = message.role === "assistant";


	if (
		(message.type === "track_selection" || message.type === "track_complete") &&
		message.actions &&
		message.actions.length > 0
	) {
		return (
			<div className="space-y-2">
				<div className="flex gap-2">
					<div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
						<Sparkles className="w-3 h-3" />
					</div>
					<div
						className={cn(
							"px-3 py-2 rounded-xl text-sm max-w-[85%]",
							"bg-muted/50 border border-border rounded-tl-none",
							message.type === "track_complete" &&
								"border-primary/30 bg-primary/5",
						)}
					>
						<MessageContent content={message.content} />
					</div>
				</div>
				<TrackActionCards
					tracks={message.actions}
					onSelect={onTrackSelect}
					disabled={isLoading}
				/>
			</div>
		);
	}


	return (
		<div className={cn("flex gap-2", isUser ? "flex-row-reverse" : "flex-row")}>
			<div
				className={cn(
					"w-6 h-6 rounded-full flex items-center justify-center shrink-0",
					isAssistant ? "bg-primary text-primary-foreground" : "bg-muted",
				)}
			>
				{isAssistant ? (
					<Sparkles className="w-3 h-3" />
				) : (
					<User className="w-3 h-3" />
				)}
			</div>
			<div
				className={cn(
					"px-3 py-2 rounded-xl text-sm max-w-[85%]",
					isAssistant
						? "bg-muted/50 border border-border rounded-tl-none"
						: "bg-primary text-primary-foreground rounded-tr-none",
				)}
			>
				<MessageContent content={message.content} />
			</div>
		</div>
	);
}
````

## File: components/persona-lab/ChatSidebar/TrackActionCards.tsx
````typescript
"use client";

import { Check, ChevronRight } from "lucide-react";
import { TRACK_COLORS } from "@/lib/constants/tracks";
import type { TrackAction, TrackId } from "@/lib/types/persona";
import { cn } from "@/lib/utils";







interface TrackActionCardsProps {
	tracks: TrackAction[];
	onSelect: (trackId: TrackId) => void;
	disabled?: boolean;
}






export function TrackActionCards({
	tracks,
	onSelect,
	disabled = false,
}: TrackActionCardsProps) {
	return (
		<div className="space-y-1.5 pl-8 mt-2">
			{tracks.map((track, idx) => {
				const colors = TRACK_COLORS[track.trackId];
				const isCompleted = track.status === "completed";

				return (
					<button
						key={track.trackId}
						type="button"
						onClick={() => !isCompleted && !disabled && onSelect(track.trackId)}
						disabled={isCompleted || disabled}
						className={cn(
							"w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all text-sm",
							"border hover:border-2",
							(isCompleted || disabled) && "opacity-50 cursor-not-allowed",
						)}
						style={{
							borderColor: `${colors.primary}40`,
							backgroundColor: `${colors.primary}05`,
						}}
					>
						<span className="text-xs font-mono text-muted-foreground w-4">
							{idx + 1}.
						</span>
						<span className="text-lg">{track.icon}</span>
						<span className="flex-1 font-medium">{track.displayName}</span>
						{isCompleted ? (
							<Check className="w-4 h-4 text-primary" />
						) : (
							<ChevronRight className="w-4 h-4 text-muted-foreground" />
						)}
					</button>
				);
			})}
		</div>
	);
}
````

## File: components/ui/dropdown-menu.tsx
````typescript
"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

function DropdownMenu({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
	return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
	return (
		<DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
	);
}

function DropdownMenuTrigger({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
	return (
		<DropdownMenuPrimitive.Trigger
			data-slot="dropdown-menu-trigger"
			{...props}
		/>
	);
}

function DropdownMenuContent({
	className,
	sideOffset = 4,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
	return (
		<DropdownMenuPrimitive.Portal>
			<DropdownMenuPrimitive.Content
				data-slot="dropdown-menu-content"
				sideOffset={sideOffset}
				className={cn(
					"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
					className,
				)}
				{...props}
			/>
		</DropdownMenuPrimitive.Portal>
	);
}

function DropdownMenuGroup({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
	return (
		<DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
	);
}

function DropdownMenuItem({
	className,
	inset,
	variant = "default",
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
	inset?: boolean;
	variant?: "default" | "destructive";
}) {
	return (
		<DropdownMenuPrimitive.Item
			data-slot="dropdown-menu-item"
			data-inset={inset}
			data-variant={variant}
			className={cn(
				"focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		/>
	);
}

function DropdownMenuCheckboxItem({
	className,
	children,
	checked,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
	return (
		<DropdownMenuPrimitive.CheckboxItem
			data-slot="dropdown-menu-checkbox-item"
			className={cn(
				"focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			checked={checked}
			{...props}
		>
			<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
				<DropdownMenuPrimitive.ItemIndicator>
					<CheckIcon className="size-4" />
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.CheckboxItem>
	);
}

function DropdownMenuRadioGroup({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
	return (
		<DropdownMenuPrimitive.RadioGroup
			data-slot="dropdown-menu-radio-group"
			{...props}
		/>
	);
}

function DropdownMenuRadioItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
	return (
		<DropdownMenuPrimitive.RadioItem
			data-slot="dropdown-menu-radio-item"
			className={cn(
				"focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		>
			<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
				<DropdownMenuPrimitive.ItemIndicator>
					<CircleIcon className="size-2 fill-current" />
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.RadioItem>
	);
}

function DropdownMenuLabel({
	className,
	inset,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
	inset?: boolean;
}) {
	return (
		<DropdownMenuPrimitive.Label
			data-slot="dropdown-menu-label"
			data-inset={inset}
			className={cn(
				"px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
				className,
			)}
			{...props}
		/>
	);
}

function DropdownMenuSeparator({
	className,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
	return (
		<DropdownMenuPrimitive.Separator
			data-slot="dropdown-menu-separator"
			className={cn("bg-border -mx-1 my-1 h-px", className)}
			{...props}
		/>
	);
}

function DropdownMenuShortcut({
	className,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="dropdown-menu-shortcut"
			className={cn(
				"text-muted-foreground ml-auto text-xs tracking-widest",
				className,
			)}
			{...props}
		/>
	);
}

function DropdownMenuSub({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
	return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
	className,
	inset,
	children,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
	inset?: boolean;
}) {
	return (
		<DropdownMenuPrimitive.SubTrigger
			data-slot="dropdown-menu-sub-trigger"
			data-inset={inset}
			className={cn(
				"focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		>
			{children}
			<ChevronRightIcon className="ml-auto size-4" />
		</DropdownMenuPrimitive.SubTrigger>
	);
}

function DropdownMenuSubContent({
	className,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
	return (
		<DropdownMenuPrimitive.SubContent
			data-slot="dropdown-menu-sub-content"
			className={cn(
				"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
				className,
			)}
			{...props}
		/>
	);
}

export {
	DropdownMenu,
	DropdownMenuPortal,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
};
````

## File: components/ui/field.tsx
````typescript
"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
	return (
		<fieldset
			data-slot="field-set"
			className={cn(
				"flex flex-col gap-6",
				"has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
				className,
			)}
			{...props}
		/>
	);
}

function FieldLegend({
	className,
	variant = "legend",
	...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
	return (
		<legend
			data-slot="field-legend"
			data-variant={variant}
			className={cn(
				"mb-3 font-medium",
				"data-[variant=legend]:text-base",
				"data-[variant=label]:text-sm",
				className,
			)}
			{...props}
		/>
	);
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-group"
			className={cn(
				"group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
				className,
			)}
			{...props}
		/>
	);
}

const fieldVariants = cva(
	"group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
	{
		variants: {
			orientation: {
				vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
				horizontal: [
					"flex-row items-center",
					"[&>[data-slot=field-label]]:flex-auto",
					"has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
				],
				responsive: [
					"flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto",
					"@md/field-group:[&>[data-slot=field-label]]:flex-auto",
					"@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
				],
			},
		},
		defaultVariants: {
			orientation: "vertical",
		},
	},
);

function Field({
	className,
	orientation = "vertical",
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
	return (
		<div
			role="group"
			data-slot="field"
			data-orientation={orientation}
			className={cn(fieldVariants({ orientation }), className)}
			{...props}
		/>
	);
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-content"
			className={cn(
				"group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
				className,
			)}
			{...props}
		/>
	);
}

function FieldLabel({
	className,
	...props
}: React.ComponentProps<typeof Label>) {
	return (
		<Label
			data-slot="field-label"
			className={cn(
				"group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
				"has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
				"has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
				className,
			)}
			{...props}
		/>
	);
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-label"
			className={cn(
				"flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="field-description"
			className={cn(
				"text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
				"last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
				"[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
				className,
			)}
			{...props}
		/>
	);
}

function FieldSeparator({
	children,
	className,
	...props
}: React.ComponentProps<"div"> & {
	children?: React.ReactNode;
}) {
	return (
		<div
			data-slot="field-separator"
			data-content={!!children}
			className={cn(
				"relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
				className,
			)}
			{...props}
		>
			<Separator className="absolute inset-0 top-1/2" />
			{children && (
				<span
					className="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
					data-slot="field-separator-content"
				>
					{children}
				</span>
			)}
		</div>
	);
}

function FieldError({
	className,
	children,
	errors,
	...props
}: React.ComponentProps<"div"> & {
	errors?: Array<{ message?: string } | undefined>;
}) {
	const content = useMemo(() => {
		if (children) {
			return children;
		}

		if (!errors?.length) {
			return null;
		}

		const uniqueErrors = [
			...new Map(errors.map((error) => [error?.message, error])).values(),
		];

		if (uniqueErrors?.length === 1) {
			return uniqueErrors[0]?.message;
		}

		return (
			<ul className="ml-4 flex list-disc flex-col gap-1">
				{uniqueErrors.map(
					(error, index) =>
						error?.message && <li key={index}>{error.message}</li>,
				)}
			</ul>
		);
	}, [children, errors]);

	if (!content) {
		return null;
	}

	return (
		<div
			role="alert"
			data-slot="field-error"
			className={cn("text-destructive text-sm font-normal", className)}
			{...props}
		>
			{content}
		</div>
	);
}

export {
	Field,
	FieldLabel,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLegend,
	FieldSeparator,
	FieldSet,
	FieldContent,
	FieldTitle,
};
````

## File: components/GoogleLoginButton.tsx
````typescript
"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface GoogleLoginButtonProps {
	variant?: "login" | "register";
	className?: string;
}

export function GoogleLoginButton({
	variant = "login",
	className,
}: GoogleLoginButtonProps) {
	const t = useTranslations("auth");
	const [isLoading, setIsLoading] = useState(false);

	const handleGoogleLogin = async () => {
		setIsLoading(true);

		try {
			const response = await fetch(`${API_URL}/oauth/google/url`, {
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Failed to get OAuth URL");
			}

			const data = await response.json();

			if (data.success && data.data?.url) {

				window.location.href = data.data.url;
			} else {
				throw new Error(data.message || "Failed to get OAuth URL");
			}
		} catch (error) {
			console.error("Google OAuth error:", error);
			setIsLoading(false);
		}
	};

	return (
		<Button
			variant="outline"
			type="button"
			disabled={isLoading}
			onClick={handleGoogleLogin}
			className={className}
		>
			{isLoading ? (
				<Loader2 className="mr-2 h-4 w-4 animate-spin" />
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					className="mr-2 h-4 w-4"
					aria-hidden="true"
				>
					<title>Google</title>
					<path
						d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
						fill="currentColor"
					/>
				</svg>
			)}
			{variant === "login" ? t("loginWithGoogle") : t("registerWithGoogle")}
		</Button>
	);
}
````

## File: components/ResourceCard.tsx
````typescript
"use client";

import { BookOpen, ExternalLink, FileText, Video } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResourceCardProps {
	title: string;
	summary: string;
	url: string;
	type: "article" | "video" | "guide";
	tags: string[];
	className?: string;
}

const typeConfig = {
	article: { icon: FileText, labelKey: "article" as const },
	video: { icon: Video, labelKey: "video" as const },
	guide: { icon: BookOpen, labelKey: "guide" as const },
};

export function ResourceCard({
	title,
	summary,
	url,
	type,
	tags,
	className,
}: ResourceCardProps) {
	const t = useTranslations("common");
	const config = typeConfig[type];
	const Icon = config.icon;

	return (
		<Card className={cn("hover:shadow-md transition-shadow", className)}>
			<CardHeader>
				<div className="flex items-start gap-3">
					<div className="p-2 bg-primary/10 rounded-lg">
						<Icon className="w-5 h-5 text-primary" />
					</div>
					<div className="flex-1">
						<CardTitle className="text-lg mb-1">{title}</CardTitle>
						<Badge variant="secondary" className="text-xs">
							{t(config.labelKey)}
						</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground mb-4">{summary}</p>

				{tags.length > 0 && (
					<div className="flex flex-wrap gap-2 mb-4">
						{tags.slice(0, 3).map((tag) => (
							<Badge key={tag} variant="outline" className="text-xs">
								{tag}
							</Badge>
						))}
					</div>
				)}

				<Link
					href={url}
					className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent font-medium"
				>
					{t("readMore")}
					<ExternalLink className="w-4 h-4" />
				</Link>
			</CardContent>
		</Card>
	);
}
````

## File: lib/auth/logout.ts
````typescript
import Cookies from "js-cookie";
import { useUserStore } from "@/lib/store/userStore";











export function performLogout(options?: { redirect?: string }) {


	Cookies.remove("leaply-auth-state", { path: "/" });


	useUserStore.getState().logout();



	try {
		localStorage.removeItem("leaply-user-store");
	} catch {

	}


	if (options?.redirect) {
		window.location.href = options.redirect;
	}
}
````

## File: lib/constants/archetypes.ts
````typescript
import type { ArchetypeDefinition, ArchetypeType } from "@/lib/types/persona";

export const ARCHETYPES: Record<ArchetypeType, ArchetypeDefinition> = {
	innovator: {
		type: "innovator",
		title: "The Innovator",
		tagline: "Creating novel solutions to complex problems",
		description:
			"You see possibilities where others see obstacles. Your mind naturally gravitates toward improvement and invention, whether in technology, processes, or ideas.",
		essayStrengths: [
			"Problem-solving narratives",
			"Technical creativity",
			"Future-oriented vision",
		],
		color: "#10B981",
		bgClass: "bg-emerald-500/10",
		textClass: "text-emerald-600",
		borderClass: "border-emerald-300",
		emoji: "💡",
	},
	bridge_builder: {
		type: "bridge_builder",
		title: "The Bridge Builder",
		tagline: "Connecting disparate worlds and people",
		description:
			"You thrive at intersections—between cultures, disciplines, or communities. Your strength lies in translation and synthesis, making connections others miss.",
		essayStrengths: [
			"Cross-cultural narratives",
			"Interdisciplinary thinking",
			"Collaboration stories",
		],
		color: "#3B82F6",
		bgClass: "bg-blue-500/10",
		textClass: "text-blue-600",
		borderClass: "border-blue-300",
		emoji: "🌉",
	},
	scholar: {
		type: "scholar",
		title: "The Scholar",
		tagline: "Driven by intellectual curiosity and depth",
		description:
			"Knowledge isn't just useful to you—it's exciting. You pursue understanding for its own sake and find joy in mastering complex subjects.",
		essayStrengths: [
			"Research motivation",
			"Intellectual journey",
			"Deep expertise",
		],
		color: "#8B5CF6",
		bgClass: "bg-violet-500/10",
		textClass: "text-violet-600",
		borderClass: "border-violet-300",
		emoji: "📚",
	},
	advocate: {
		type: "advocate",
		title: "The Advocate",
		tagline: "Fighting for causes and communities",
		description:
			"You're driven by purpose beyond personal gain. Whether for social justice, environmental causes, or underserved communities, you channel your energy toward meaningful impact.",
		essayStrengths: [
			"Social impact narratives",
			"Community leadership",
			"Values-driven decisions",
		],
		color: "#EC4899",
		bgClass: "bg-pink-500/10",
		textClass: "text-pink-600",
		borderClass: "border-pink-300",
		emoji: "🎯",
	},
	pioneer: {
		type: "pioneer",
		title: "The Pioneer",
		tagline: "Venturing into uncharted territory",
		description:
			"You're drawn to firsts—first in your family, first to try something new, first to take a risk. Uncertainty doesn't deter you; it motivates you.",
		essayStrengths: [
			"First-generation narratives",
			"Risk-taking stories",
			"Trailblazing moments",
		],
		color: "#F59E0B",
		bgClass: "bg-amber-500/10",
		textClass: "text-amber-600",
		borderClass: "border-amber-300",
		emoji: "🚀",
	},
	craftsman: {
		type: "craftsman",
		title: "The Craftsman",
		tagline: "Mastering skills through deliberate practice",
		description:
			"You believe in excellence through dedication. Whether in art, engineering, or any discipline, you pursue mastery with patience and precision.",
		essayStrengths: [
			"Skill development journey",
			"Attention to detail",
			"Long-term commitment",
		],
		color: "#6366F1",
		bgClass: "bg-indigo-500/10",
		textClass: "text-indigo-600",
		borderClass: "border-indigo-300",
		emoji: "🎨",
	},
	resilient: {
		type: "resilient",
		title: "The Resilient",
		tagline: "Transforming challenges into growth",
		description:
			"Your story is defined not by what happened to you, but by how you responded. Setbacks become setups for comebacks in your narrative.",
		essayStrengths: [
			"Overcoming adversity",
			"Growth from failure",
			"Perseverance stories",
		],
		color: "#EF4444",
		bgClass: "bg-red-500/10",
		textClass: "text-red-600",
		borderClass: "border-red-300",
		emoji: "🔥",
	},
	catalyst: {
		type: "catalyst",
		title: "The Catalyst",
		tagline: "Sparking change in systems and people",
		description:
			"You don't just participate—you transform. Whether leading organizations, changing processes, or inspiring others, you leave things different than you found them.",
		essayStrengths: [
			"Leadership transformation",
			"Change management",
			"Influence stories",
		],
		color: "#14B8A6",
		bgClass: "bg-teal-500/10",
		textClass: "text-teal-600",
		borderClass: "border-teal-300",
		emoji: "⚡",
	},
} as const;


export function getArchetype(type: ArchetypeType): ArchetypeDefinition {
	return ARCHETYPES[type];
}


export const ARCHETYPE_TYPES = Object.keys(ARCHETYPES) as ArchetypeType[];
````

## File: lib/data/resources.ts
````typescript
export interface Resource {
	id: string;
	title: string;
	summary: string;
	url: string;
	type: "guide" | "article" | "video";
	tags: string[];
	category: string;
}

export const mockResources: Resource[] = [
	{
		id: "res-001",
		title: "How to Write a Compelling Personal Statement",
		summary:
			"Learn the key elements of a strong personal statement that captures admissions officers' attention.",
		url: "#",
		type: "guide",
		tags: ["essays", "personal statement", "writing"],
		category: "Essays",
	},
	{
		id: "res-002",
		title: "Understanding Financial Aid Options",
		summary:
			"A comprehensive guide to scholarships, grants, loans, and work-study programs.",
		url: "#",
		type: "article",
		tags: ["financial aid", "scholarships", "funding"],
		category: "Financial Aid",
	},
	{
		id: "res-003",
		title: "Preparing for University Interviews",
		summary:
			"Tips and strategies for succeeding in university admissions interviews.",
		url: "#",
		type: "video",
		tags: ["interviews", "preparation", "tips"],
		category: "Interviews",
	},
	{
		id: "res-004",
		title: "Standardized Test Preparation Guide",
		summary:
			"Resources and strategies for SAT, ACT, IELTS, and TOEFL preparation.",
		url: "#",
		type: "guide",
		tags: ["testing", "SAT", "IELTS", "TOEFL"],
		category: "Testing",
	},
	{
		id: "res-005",
		title: "Building a Strong Application Portfolio",
		summary:
			"What admissions committees look for in extracurriculars and achievements.",
		url: "#",
		type: "article",
		tags: ["extracurriculars", "portfolio", "achievements"],
		category: "Applications",
	},
	{
		id: "res-006",
		title: "Getting Strong Letters of Recommendation",
		summary:
			"How to choose recommenders and what makes an effective reference letter.",
		url: "#",
		type: "guide",
		tags: ["recommendations", "references", "letters"],
		category: "Applications",
	},
	{
		id: "res-007",
		title: "Study Abroad: Visa Application Process",
		summary:
			"Step-by-step guide to applying for student visas in different countries.",
		url: "#",
		type: "article",
		tags: ["visa", "immigration", "international"],
		category: "Visa & Immigration",
	},
	{
		id: "res-008",
		title: "Finding the Right University for You",
		summary:
			"Factors to consider when choosing between universities and programs.",
		url: "#",
		type: "video",
		tags: ["university selection", "decision making"],
		category: "University Selection",
	},
	{
		id: "res-009",
		title: "Scholarship Application Strategies",
		summary:
			"Proven techniques for winning competitive scholarships and grants.",
		url: "#",
		type: "guide",
		tags: ["scholarships", "funding", "applications"],
		category: "Financial Aid",
	},
	{
		id: "res-010",
		title: "Managing Application Deadlines",
		summary:
			"Tools and tips for staying organized during the application season.",
		url: "#",
		type: "article",
		tags: ["deadlines", "organization", "time management"],
		category: "Applications",
	},
];
````

## File: lib/hooks/useAiMatch.ts
````typescript
import { useQuery } from "@tanstack/react-query";
import { exploreApi } from "@/lib/api/exploreApi";
import type { AiMatchResponse } from "@/lib/api/types";







export function useAiMatch(
	initialData?: AiMatchResponse,
	limitPerCategory?: number,
) {
	return useQuery({
		queryKey: ["aiMatch", limitPerCategory],
		queryFn: () => exploreApi.getAiMatch(limitPerCategory),
		initialData,
		staleTime: 10 * 60 * 1000,
	});
}
````

## File: lib/hooks/useContainerDimensions.ts
````typescript
import { useEffect, useRef, useState } from "react";

export function useContainerDimensions() {
	const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect;
				setDimensions({ width, height });
			}
		});

		resizeObserver.observe(containerRef.current);
		return () => resizeObserver.disconnect();
	}, []);

	return { dimensions, containerRef };
}
````

## File: lib/hooks/useHomeData.ts
````typescript
import { useQuery } from "@tanstack/react-query";
import { getHomeData } from "@/lib/api/homeApi";
import type { HomeResponse } from "@/lib/api/types";






export function useHomeData(initialData?: HomeResponse) {
	return useQuery({
		queryKey: ["homeData"],
		queryFn: getHomeData,
		initialData,
		staleTime: 5 * 60 * 1000,
	});
}
````

## File: lib/hooks/useLogin.ts
````typescript
import { useMutation } from "@tanstack/react-query";
import type { LoginRequest } from "@/lib/api/types";
import { authService } from "@/lib/services/auth";







export function useLogin() {
	return useMutation({
		mutationFn: (credentials: LoginRequest) => authService.login(credentials),
		retry: false,
	});
}
````

## File: lib/hooks/usePersonaConversation.ts
````typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { personaApi } from "@/lib/api/personaApi";
import type { GraphMessageResponse } from "@/lib/types/persona";


export const personaQueryKeys = {
	all: ["persona"] as const,
	conversation: () => [...personaQueryKeys.all, "conversation"] as const,
	coverage: () => [...personaQueryKeys.all, "coverage"] as const,
	graph: () => [...personaQueryKeys.all, "graph"] as const,
};





export function useConversation(enabled = true) {
	return useQuery({
		queryKey: personaQueryKeys.conversation(),
		queryFn: () => personaApi.getConversation(),
		enabled,
		staleTime: 0,
		refetchOnWindowFocus: false,
	});
}





export function useSendMessage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (content: string) =>
			personaApi.sendConversationMessage(content),
		onSuccess: (data: GraphMessageResponse) => {

			queryClient.invalidateQueries({
				queryKey: personaQueryKeys.conversation(),
			});
			queryClient.invalidateQueries({ queryKey: personaQueryKeys.coverage() });


			if (data.nodesCreated.length > 0 || data.edgesCreated.length > 0) {
				queryClient.invalidateQueries({ queryKey: personaQueryKeys.graph() });
			}
		},
	});
}





export function useResetConversation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => personaApi.resetConversation(),
		onSuccess: () => {

			queryClient.invalidateQueries({ queryKey: personaQueryKeys.all });
		},
	});
}





export function useExpandNode() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (nodeId: string) => personaApi.expandNode(nodeId),
		onSuccess: () => {

			queryClient.invalidateQueries({
				queryKey: personaQueryKeys.conversation(),
			});
		},
	});
}




export function useCoverage(enabled = true) {
	return useQuery({
		queryKey: personaQueryKeys.coverage(),
		queryFn: () => personaApi.getCoverage(),
		enabled,
		staleTime: 30 * 1000,
		refetchOnWindowFocus: false,
	});
}





export function usePrefetchConversation() {
	const queryClient = useQueryClient();

	return () => {
		queryClient.prefetchQuery({
			queryKey: personaQueryKeys.conversation(),
			queryFn: () => personaApi.getConversation(),
		});
	};
}
````

## File: lib/hooks/useRegister.ts
````typescript
import { useMutation } from "@tanstack/react-query";
import type { RegisterRequest } from "@/lib/api/types";
import { authService } from "@/lib/services/auth";







export function useRegister() {
	return useMutation({
		mutationFn: (data: RegisterRequest) => authService.register(data),
		retry: false,
	});
}
````

## File: lib/hooks/useResendVerification.ts
````typescript
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/services/auth";







export function useResendVerification() {
	return useMutation({
		mutationFn: (email: string) => authService.resendVerification(email),
		retry: 1,
	});
}
````

## File: lib/hooks/useVerifyEmail.ts
````typescript
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/lib/services/auth";









export function useVerifyEmail(token: string | null) {
	return useQuery({
		queryKey: ["verifyEmail", token],
		queryFn: () => {
			if (!token) throw new Error("Token is required");
			return authService.verifyEmail(token);
		},
		enabled: !!token,
		staleTime: Number.POSITIVE_INFINITY,
		gcTime: 5 * 60 * 1000,
		retry: false,
	});
}
````

## File: lib/mock/fakerGenerators.ts
````typescript
import { faker } from "@faker-js/faker";
import type {
	AiMatchResponse,
	ApplicationListResponse,

	ApplicationResponse,
	ApplicationSopResponse,
	ApplicationSummaryDto,
	ArchetypeDto,
	AuthResponse,
	CanvasNodeDto,
	ChatMessageDto,
	DiscoveryProgressDto,
	EvaluationResponse,
	FilterOptionsResponse,
	GapDto,

	HomeResponse,
	LoginRequest,
	MessageResponse,

	OnboardingDataResponse,
	OnboardingResponse,
	OnboardingStatusResponse,
	PaginationResponse,

	PersonaStateResponse,
	PreferencesInfo,
	ProfileInfo,
	ProfileResponse,
	ProgramDetailResponse,
	ProgramIntakeResponse,

	ProgramListItemResponse,
	ProgramListResponse,
	ProgramSummaryDto,
	RecentApplicationDto,

	RegisterRequest,
	RequirementsResponse,
	SopFeedbackDto,
	SuggestedActionDto,
	TrackDto,
	TrackSelectResponse,
	TuitionResponse,
	UpcomingDeadlineDto,
	UserContextResponse,

	UserInfo,
	UserMeResponse,
} from "@/lib/api/types";











function getImageUrl(width: number = 200, height?: number): string {
	if (height === undefined) {
		return `https://picsum.photos/${width}`;
	}
	return `https://picsum.photos/${width}/${height}`;
}

const degreeTypes = ["bachelor", "masters", "mba", "phd", "diploma"];
const educationLevels = ["high_school", "undergrad", "graduate", "working"];
const targetDegrees = ["bachelors", "masters", "mba", "phd"];
const regions = ["North America", "Europe", "Asia", "Australia", "UK"];
const fieldsOfInterest = [
	"Computer Science",
	"Business",
	"Engineering",
	"Data Science",
	"Design",
	"Medicine",
	"Law",
	"Arts",
];
const programTypes = ["full-time", "part-time", "online", "hybrid"];
const campusSettings = ["urban", "suburban", "rural"];
const journeyTypes = ["exploring", "has_target"];
const intakeTerms = ["Fall", "Spring", "Summer", "Winter"];
const budgetLabels = ["low", "medium", "high", "very_high"];
const deliveryModes = ["on-campus", "online", "hybrid"];
const languages = ["English", "Spanish", "French", "German", "Mandarin"];
const seasons = ["Fall", "Spring", "Summer", "Winter"];
const trackTypes = [
	"FUTURE_VISION",
	"ACADEMIC_JOURNEY",
	"ACTIVITIES_IMPACT",
	"VALUES_TURNING_POINTS",
];
const archetypeTypes = [
	"The Innovator",
	"The Scholar",
	"The Leader",
	"The Explorer",
	"The Creator",
];
const applicationStatuses = ["planning", "writing", "submitted"];
const fitCategories = ["reach", "target", "safety"] as const;
const gapSeverities = ["low", "medium", "high"] as const;
const suggestedActionTypes = [
	"persona",
	"explore",
	"profile",
	"deadline",
	"writing",
] as const;





export function generateRegisterRequest(): RegisterRequest {
	return {
		fullName: faker.person.fullName(),
		email: faker.internet.email().toLowerCase(),
		password: faker.internet.password({ length: 12 }),
	};
}

export function generateLoginRequest(): LoginRequest {
	return {
		email: faker.internet.email().toLowerCase(),
		password: faker.internet.password({ length: 12 }),
	};
}

export function generateAuthResponse(): AuthResponse {
	return {
		userId: faker.string.uuid(),
		email: faker.internet.email().toLowerCase(),
		accessToken: faker.string.alphanumeric(64),
		refreshToken: faker.string.alphanumeric(64),
		expiresIn: 3600,
		role: faker.helpers.arrayElement(["user", "admin"]),
		onboardingCompleted: faker.datatype.boolean(),
	};
}





export function generateUserInfo(): UserInfo {
	return {
		id: faker.string.uuid(),
		email: faker.internet.email().toLowerCase(),
		isEmailVerified: faker.datatype.boolean(),
		isOnboardingComplete: faker.datatype.boolean(),
		createdAt: faker.date.past().toISOString(),
	};
}

export function generateProfileInfo(): ProfileInfo {
	return {
		fullName: faker.person.fullName(),
		currentEducationLevel: faker.helpers.arrayElement(educationLevels),
		targetDegree: faker.helpers.arrayElement(targetDegrees),
		gpa: faker.number
			.float({ min: 2.0, max: 4.0, fractionDigits: 2 })
			.toString(),
		gpaScale: faker.helpers.arrayElement(["4.0", "5.0", "10.0"]),
		testScores: {
			IELTS: faker.number
				.float({ min: 5.0, max: 9.0, fractionDigits: 1 })
				.toString(),
			TOEFL: faker.number.int({ min: 60, max: 120 }).toString(),
			GRE: faker.number.int({ min: 260, max: 340 }).toString(),
			GMAT: faker.number.int({ min: 400, max: 800 }).toString(),
		},
	};
}

export function generatePreferencesInfo(): PreferencesInfo {
	return {
		fieldOfInterest: faker.helpers.arrayElements(fieldsOfInterest, {
			min: 1,
			max: 3,
		}),
		preferredRegions: faker.helpers.arrayElements(regions, { min: 1, max: 3 }),
		intendedStartTerm: faker.helpers.arrayElement(intakeTerms),
		budgetLabel: faker.helpers.arrayElement(budgetLabels),
		journeyType: faker.helpers.arrayElement(journeyTypes),
		programType: faker.helpers.arrayElement(programTypes),
		campusSetting: faker.helpers.arrayElement(campusSettings),
		interests: faker.helpers.arrayElements(fieldsOfInterest, {
			min: 2,
			max: 5,
		}),
	};
}

export function generateUserContextResponse(): UserContextResponse {
	return {
		user: generateUserInfo(),
		profile: generateProfileInfo(),
		preferences: generatePreferencesInfo(),
	};
}

export function generateProfileResponse(): ProfileResponse {
	return {
		userId: faker.string.uuid(),
		fullName: faker.person.fullName(),
		currentEducationLevel: faker.helpers.arrayElement(educationLevels),
		targetDegree: faker.helpers.arrayElement(targetDegrees),
		gpa: faker.number.float({ min: 2.0, max: 4.0, fractionDigits: 2 }),
		gpaScale: faker.number.float({ min: 4.0, max: 10.0, fractionDigits: 1 }),
		testScores: {
			IELTS: faker.number
				.float({ min: 5.0, max: 9.0, fractionDigits: 1 })
				.toString(),
			TOEFL: faker.number.int({ min: 60, max: 120 }).toString(),
		},
		workExperienceYears: faker.number.int({ min: 0, max: 10 }),
		profileCompletion: faker.number.int({ min: 0, max: 100 }),
	};
}

export function generateUserMeResponse(): UserMeResponse {
	return {
		userId: faker.string.uuid(),
		email: faker.internet.email().toLowerCase(),
		emailVerified: faker.datatype.boolean(),
		createdAt: faker.date.past().toISOString(),
		fullName: faker.person.fullName(),
		currentEducationLevel: faker.helpers.arrayElement(educationLevels),
		targetDegree: faker.helpers.arrayElement(targetDegrees),
		gpa: faker.number.float({ min: 2.0, max: 4.0, fractionDigits: 2 }),
		gpaScale: faker.number.float({ min: 4.0, max: 10.0, fractionDigits: 1 }),
		testScores: {
			IELTS: faker.number
				.float({ min: 5.0, max: 9.0, fractionDigits: 1 })
				.toString(),
			TOEFL: faker.number.int({ min: 60, max: 120 }).toString(),
		},
		workExperienceYears: faker.number.int({ min: 0, max: 10 }),
		profileCompletion: faker.number.int({ min: 0, max: 100 }),
		fieldOfInterest: faker.helpers.arrayElements(fieldsOfInterest, {
			min: 1,
			max: 3,
		}),
		preferredRegions: faker.helpers.arrayElements(regions, { min: 1, max: 3 }),
		intendedStartTerm: faker.helpers.arrayElement(intakeTerms),
		budgetLabel: faker.helpers.arrayElement(budgetLabels),
		journeyType: faker.helpers.arrayElement(journeyTypes),
		programType: faker.helpers.arrayElement(programTypes),
		campusSetting: faker.helpers.arrayElement(campusSettings),
		interests: faker.helpers.arrayElements(fieldsOfInterest, {
			min: 2,
			max: 5,
		}),
	};
}





export function generateOnboardingDataResponse(): OnboardingDataResponse {
	return {
		completedSteps: faker.number.int({ min: 0, max: 6 }),
		isComplete: faker.datatype.boolean(),
	};
}

export function generateOnboardingStatusResponse(): OnboardingStatusResponse {
	return {
		currentStep: faker.number.int({ min: 1, max: 6 }),
		completed: faker.datatype.boolean(),
		data: {
			fullName: faker.person.fullName(),
			currentLevel: faker.helpers.arrayElement(educationLevels),
			targetDegree: faker.helpers.arrayElement(targetDegrees),
		},
	};
}

export function generateOnboardingResponse(): OnboardingResponse {
	return {
		currentStep: faker.number.int({ min: 1, max: 6 }),
		nextStep: faker.number.int({ min: 2, max: 7 }),
		completed: faker.datatype.boolean(),
		redirectTo: faker.helpers.maybe(() => "/dashboard", { probability: 0.3 }),
		message: faker.lorem.sentence(),
	};
}





export function generateProgramListItemResponse(): ProgramListItemResponse {
	const fitCategory = faker.helpers.arrayElement(fitCategories);
	const fitScore =
		fitCategory === "reach"
			? faker.number.int({ min: 50, max: 70 })
			: fitCategory === "target"
				? faker.number.int({ min: 71, max: 85 })
				: faker.number.int({ min: 86, max: 100 });

	return {
		id: faker.string.uuid(),
		universityId: faker.string.uuid(),
		universityName: faker.company.name() + " University",
		universityCountry: faker.location.country(),
		universityCity: faker.location.city(),
		universityLogoUrl: getImageUrl(200, 200),
		programName: faker.helpers.arrayElement([
			`Bachelor of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
			`Master of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
			`MBA in ${faker.helpers.arrayElement(fieldsOfInterest)}`,
			`PhD in ${faker.helpers.arrayElement(fieldsOfInterest)}`,
		]),
		displayName: `${faker.company.name()} University - ${faker.helpers.arrayElement(degreeTypes)}`,
		degreeType: faker.helpers.arrayElement(degreeTypes),
		degreeName: faker.helpers.arrayElement([
			"Bachelor of Science",
			"Master of Science",
			"Master of Arts",
			"MBA",
			"PhD",
		]),
		majorCategories: faker.helpers.arrayElements(fieldsOfInterest, {
			min: 1,
			max: 3,
		}),
		durationMonths: faker.helpers.arrayElement([12, 24, 36, 48]),
		deliveryMode: faker.helpers.arrayElement(deliveryModes),
		tuitionAnnualUsd: faker.number.int({ min: 10000, max: 80000 }),
		scholarshipAvailable: faker.datatype.boolean(),
		ieltsMinimum: faker.number.float({ min: 5.5, max: 8.0, fractionDigits: 1 }),
		toeflMinimum: faker.number.int({ min: 60, max: 120 }),
		nextDeadline: faker.date.future().toISOString().split("T")[0],
		nextIntake: `${faker.helpers.arrayElement(intakeTerms)} ${faker.date.future().getFullYear()}`,
		fitScore,
		fitCategory,
		fitReasons: faker.helpers.arrayElements(
			[
				"Strong program alignment",
				"Good scholarship opportunities",
				"Ranking matches your profile",
				"Location preference",
			],
			{ min: 1, max: 3 },
		),
		fitGaps: faker.helpers.arrayElements(
			[
				"Need higher IELTS score",
				"Portfolio recommended",
				"Work experience preferred",
				"Research experience needed",
			],
			{ min: 0, max: 2 },
		),
		isSaved: faker.helpers.maybe(() => faker.datatype.boolean(), {
			probability: 0.5,
		}),
		rankingQsDisplay: faker.helpers.arrayElement([
			`#${faker.number.int({ min: 1, max: 50 })}`,
			`${faker.number.int({ min: 51, max: 100 })}-${faker.number.int({ min: 101, max: 200 })}`,
		]),
	};
}

export function generateProgramDetailResponse(): ProgramDetailResponse {
	const base = generateProgramListItemResponse();
	const intakes = Array.from(
		{ length: faker.number.int({ min: 1, max: 4 }) },
		() => generateProgramIntakeResponse(),
	);

	return {
		...base,
		universityWebsiteUrl: faker.internet.url(),
		universityDescription: faker.lorem.paragraphs(3),
		rankingTimesDisplay: faker.helpers.arrayElement([
			`#${faker.number.int({ min: 1, max: 100 })}`,
			`${faker.number.int({ min: 101, max: 200 })}-${faker.number.int({ min: 201, max: 300 })}`,
		]),
		rankingNational: faker.number.int({ min: 1, max: 50 }),
		language: faker.helpers.arrayElement(languages),
		programDescription: faker.lorem.paragraphs(5),
		programUrl: faker.internet.url(),
		admissionsUrl: faker.internet.url(),
		tuition: generateTuitionResponse(),
		applicationFeeUsd: faker.number.int({ min: 50, max: 200 }),
		requirements: generateRequirementsResponse(),
		intakes,
	};
}

export function generateProgramIntakeResponse(): ProgramIntakeResponse {
	const season = faker.helpers.arrayElement(seasons);
	const year = faker.date.future().getFullYear();

	return {
		id: faker.string.uuid(),
		season,
		seasonDisplay: `${season} ${year}`,
		applicationStartDate: faker.date.past().toISOString(),
		applicationDeadline: faker.date.future().toISOString(),
		earlyDeadline: faker.helpers.maybe(
			() => faker.date.future().toISOString(),
			{
				probability: 0.5,
			},
		),
		startDate: faker.date.future().toISOString(),
		isActive: faker.datatype.boolean(),
	};
}

export function generateTuitionResponse(): TuitionResponse {
	return {
		annualUsd: faker.number.int({ min: 10000, max: 80000 }),
		totalUsd: faker.helpers.maybe(
			() => faker.number.int({ min: 20000, max: 200000 }),
			{ probability: 0.7 },
		),
		notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
			probability: 0.3,
		}),
	};
}

export function generateRequirementsResponse(): RequirementsResponse {
	return {
		gpaMinimum: faker.number.float({ min: 2.5, max: 3.8, fractionDigits: 2 }),
		gpaScale: faker.number.float({ min: 4.0, max: 10.0, fractionDigits: 1 }),
		ieltsMinimum: faker.number.float({ min: 5.5, max: 8.0, fractionDigits: 1 }),
		toeflMinimum: faker.number.int({ min: 60, max: 120 }),
		greRequired: faker.datatype.boolean(),
		gmatRequired: faker.datatype.boolean(),
		workExperienceYears: faker.helpers.maybe(
			() => faker.number.int({ min: 0, max: 5 }),
			{ probability: 0.4 },
		),
		documents: faker.helpers.arrayElements(
			[
				"Transcript",
				"Recommendation Letters",
				"Statement of Purpose",
				"CV/Resume",
				"Portfolio",
			],
			{ min: 2, max: 5 },
		),
		notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
			probability: 0.3,
		}),
	};
}

export function generatePaginationResponse(
	page: number = 1,
	size: number = 20,
	total: number = 100,
): PaginationResponse {
	return {
		page,
		size,
		total,
		totalPages: Math.ceil(total / size),
	};
}

export function generateProgramListResponse(
	count: number = 20,
	page: number = 1,
	size: number = 20,
): ProgramListResponse {
	const programs = Array.from({ length: count }, () =>
		generateProgramListItemResponse(),
	);
	const total = faker.number.int({ min: count, max: count + 50 });

	return {
		data: programs,
		pagination: generatePaginationResponse(page, size, total),
		appliedFilters: {
			regions: faker.helpers.arrayElements(regions, { min: 0, max: 2 }),
			degreeTypes: faker.helpers.arrayElements(degreeTypes, { min: 0, max: 2 }),
		},
	};
}

export function generateFilterOptionsResponse(): FilterOptionsResponse {
	return {
		majors: Array.from({ length: 20 }, () => ({
			value: faker.helpers.slugify(
				faker.helpers.arrayElement(fieldsOfInterest),
			),
			label: faker.helpers.arrayElement(fieldsOfInterest),
			count: faker.number.int({ min: 10, max: 500 }),
		})),
		countries: Array.from({ length: 15 }, () => ({
			value: faker.location.countryCode().toLowerCase(),
			label: faker.location.country(),
			count: faker.number.int({ min: 5, max: 200 }),
		})),
		regions: Array.from({ length: 5 }, () => ({
			value: faker.helpers.slugify(faker.helpers.arrayElement(regions)),
			label: faker.helpers.arrayElement(regions),
			count: faker.number.int({ min: 20, max: 300 }),
		})),
		degreeTypes: Array.from({ length: 5 }, () => ({
			value: faker.helpers.arrayElement(degreeTypes),
			label: faker.helpers.arrayElement(degreeTypes).toUpperCase(),
			count: faker.number.int({ min: 15, max: 250 }),
		})),
		tuitionRange: {
			min: 5000,
			max: 100000,
			currency: "USD",
		},
		ieltsRange: {
			min: 5.0,
			max: 9.0,
		},
	};
}

export function generateAiMatchResponse(): AiMatchResponse {
	const reachCount = faker.number.int({ min: 3, max: 8 });
	const targetCount = faker.number.int({ min: 5, max: 12 });
	const safetyCount = faker.number.int({ min: 3, max: 8 });

	return {
		reach: Array.from({ length: reachCount }, () => {
			const program = generateProgramListItemResponse();
			return { ...program, fitCategory: "reach" as const };
		}),
		target: Array.from({ length: targetCount }, () => {
			const program = generateProgramListItemResponse();
			return { ...program, fitCategory: "target" as const };
		}),
		safety: Array.from({ length: safetyCount }, () => {
			const program = generateProgramListItemResponse();
			return { ...program, fitCategory: "safety" as const };
		}),
		recommendation: faker.lorem.paragraph(),
		profileCompleteness: faker.number.int({ min: 60, max: 100 }),
		missingFields: faker.helpers.arrayElements(
			["testScores", "workExperience", "portfolio"],
			{ min: 0, max: 2 },
		),
		totalMatched: reachCount + targetCount + safetyCount,
	};
}





export function generateProgramSummaryDto(): ProgramSummaryDto {
	return {
		id: faker.string.uuid(),
		universityName: faker.company.name() + " University",
		programName: faker.helpers.arrayElement([
			`Bachelor of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
			`Master of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
		]),
		degreeName: faker.helpers.arrayElement([
			"Bachelor of Science",
			"Master of Science",
			"MBA",
		]),
		nextDeadline: faker.date.future().toISOString().split("T")[0],
		nextIntake: `${faker.helpers.arrayElement(intakeTerms)} ${faker.date.future().getFullYear()}`,
	};
}

export function generateGapDto(): GapDto {
	return {
		field: faker.helpers.arrayElement([
			"gpa",
			"testScores",
			"workExperience",
			"portfolio",
		]),
		message: faker.lorem.sentence(),
		severity: faker.helpers.arrayElement(gapSeverities),
	};
}

export function generateApplicationResponse(): ApplicationResponse {
	const status = faker.helpers.arrayElement(applicationStatuses);
	const fitCategory = faker.helpers.arrayElement(fitCategories);
	const fitScore =
		fitCategory === "reach"
			? faker.number.int({ min: 50, max: 70 })
			: fitCategory === "target"
				? faker.number.int({ min: 71, max: 85 })
				: faker.number.int({ min: 86, max: 100 });

	return {
		id: faker.string.uuid(),
		program: generateProgramSummaryDto(),
		status,
		fitScore,
		fitCategory,
		gaps: faker.helpers.arrayElements(
			Array.from({ length: 3 }, () => generateGapDto()),
			{ min: 0, max: 3 },
		),
		sopStatus: faker.helpers.maybe(
			() => faker.helpers.arrayElement(["draft", "reviewing", "completed"]),
			{ probability: 0.6 },
		),
		createdAt: faker.date.past().toISOString(),
		updatedAt: faker.date.recent().toISOString(),
	};
}

export function generateApplicationSummaryDto(): ApplicationSummaryDto {
	return {
		total: faker.number.int({ min: 0, max: 20 }),
		byStatus: {
			planning: faker.number.int({ min: 0, max: 10 }),
			writing: faker.number.int({ min: 0, max: 8 }),
			submitted: faker.number.int({ min: 0, max: 5 }),
		},
		byCategory: {
			reach: faker.number.int({ min: 0, max: 5 }),
			target: faker.number.int({ min: 0, max: 8 }),
			safety: faker.number.int({ min: 0, max: 5 }),
		},
	};
}

export function generateUpcomingDeadlineDto(): UpcomingDeadlineDto {
	const deadline = faker.date.future();
	const daysRemaining = Math.ceil(
		(deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
	);

	return {
		applicationId: faker.string.uuid(),
		programName: faker.helpers.arrayElement([
			`Bachelor of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
			`Master of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
		]),
		deadline: deadline.toISOString().split("T")[0],
		daysRemaining: Math.max(0, daysRemaining),
	};
}

export function generateApplicationListResponse(): ApplicationListResponse {
	const applicationCount = faker.number.int({ min: 3, max: 15 });
	const applications = Array.from({ length: applicationCount }, () =>
		generateApplicationResponse(),
	);
	const deadlineCount = faker.number.int({ min: 0, max: 5 });

	return {
		applications,
		summary: generateApplicationSummaryDto(),
		upcomingDeadlines: Array.from({ length: deadlineCount }, () =>
			generateUpcomingDeadlineDto(),
		),
	};
}

export function generateSopFeedbackDto(): SopFeedbackDto {
	return {
		round: faker.number.int({ min: 1, max: 3 }),
		strengths: faker.helpers.arrayElements(
			[
				"Clear narrative structure",
				"Strong personal motivation",
				"Relevant experience highlighted",
				"Good connection to program goals",
			],
			{ min: 2, max: 4 },
		),
		improvements: Array.from(
			{ length: faker.number.int({ min: 2, max: 5 }) },
			() => ({
				point: faker.lorem.sentence(),
				suggestion: faker.lorem.paragraph(),
			}),
		),
		personaSuggestion: faker.helpers.maybe(() => faker.lorem.paragraph(), {
			probability: 0.5,
		}),
		structureNote: faker.helpers.maybe(() => faker.lorem.sentence(), {
			probability: 0.4,
		}),
		generatedAt: faker.date.recent().toISOString(),
	};
}

export function generateApplicationSopResponse(): ApplicationSopResponse {
	return {
		id: faker.string.uuid(),
		applicationId: faker.string.uuid(),
		wordLimit: faker.helpers.maybe(
			() => faker.number.int({ min: 500, max: 2000 }),
			{
				probability: 0.7,
			},
		),
		prompt: faker.helpers.maybe(() => faker.lorem.paragraph(), {
			probability: 0.5,
		}),
		content: faker.helpers.maybe(() => faker.lorem.paragraphs(5), {
			probability: 0.6,
		}),
		wordCount: faker.helpers.maybe(
			() => faker.number.int({ min: 300, max: 2000 }),
			{
				probability: 0.6,
			},
		),
		feedbackRound: faker.helpers.maybe(
			() => faker.number.int({ min: 0, max: 3 }),
			{
				probability: 0.5,
			},
		),
		lastFeedback: faker.helpers.maybe(() => generateSopFeedbackDto(), {
			probability: 0.4,
		}),
		updatedAt: faker.date.recent().toISOString(),
	};
}

export function generateEvaluationResponse(): EvaluationResponse {
	const schoolCount = faker.number.int({ min: 2, max: 8 });

	return {
		schoolGaps: Array.from({ length: schoolCount }, () => ({
			applicationId: faker.string.uuid(),
			programName: faker.helpers.arrayElement([
				`Bachelor of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
				`Master of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
			]),
			gaps: faker.helpers.arrayElements(
				Array.from({ length: 5 }, () => generateGapDto()),
				{ min: 1, max: 4 },
			),
		})),
		commonGaps: Array.from(
			{ length: faker.number.int({ min: 2, max: 5 }) },
			() => ({
				field: faker.helpers.arrayElement([
					"gpa",
					"testScores",
					"workExperience",
					"portfolio",
				]),
				count: faker.number.int({ min: 2, max: schoolCount }),
				message: faker.lorem.sentence(),
			}),
		),
		suggestions: faker.helpers.maybe(() => faker.lorem.paragraphs(2), {
			probability: 0.7,
		}),
		profileCompleteness: faker.number.int({ min: 50, max: 100 }),
		missingFields: faker.helpers.arrayElements(
			["testScores", "workExperience", "portfolio", "recommendations"],
			{ min: 0, max: 3 },
		),
	};
}





export function generateTrackDto(): TrackDto {
	const status = faker.helpers.arrayElement([
		"not_started",
		"in_progress",
		"completed",
	]);
	return {
		id: faker.helpers.arrayElement(trackTypes),
		displayName: faker.helpers.arrayElement([
			"Future Vision",
			"Academic Journey",
			"Activities & Impact",
			"Values & Turning Points",
		]),
		description: faker.lorem.paragraph(),
		icon: faker.helpers.arrayElement(["🎯", "📚", "🌟", "💡"]),
		status,
		completedAt:
			status === "completed" ? faker.date.past().toISOString() : undefined,
	};
}

export function generateArchetypeDto(): ArchetypeDto {
	return {
		type: faker.helpers.arrayElement(archetypeTypes),
		personalizedSummary: faker.lorem.paragraphs(3),
		revealedAt: faker.date.past().toISOString(),
	};
}

export function generateCanvasNodeDto(): CanvasNodeDto {
	return {
		id: faker.string.uuid(),
		type: faker.helpers.arrayElement([
			"insight",
			"experience",
			"value",
			"goal",
		]),
		title: faker.lorem.sentence(),
		content: faker.lorem.paragraph(),
		sourceTrackId: faker.helpers.arrayElement(trackTypes),
		createdAt: faker.date.past().toISOString(),
		archetypeType: faker.helpers.maybe(
			() => faker.helpers.arrayElement(archetypeTypes),
			{ probability: 0.3 },
		),
		personalizedSummary: faker.helpers.maybe(() => faker.lorem.paragraph(), {
			probability: 0.3,
		}),
	};
}

export function generateChatMessageDto(): ChatMessageDto {
	return {
		id: faker.string.uuid(),
		role: faker.helpers.arrayElement(["user", "assistant"]),
		content: faker.lorem.paragraph(),
		type: faker.helpers.arrayElement(["text", "question", "insight"]),
		timestamp: faker.date.recent().toISOString(),
		actions: faker.helpers.maybe(
			() =>
				Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
					trackId: faker.helpers.arrayElement(trackTypes),
					displayName: faker.helpers.arrayElement([
						"Future Vision",
						"Academic Journey",
						"Activities & Impact",
						"Values & Turning Points",
					]),
					icon: faker.helpers.arrayElement(["🎯", "📚", "🌟", "💡"]),
					status: faker.helpers.arrayElement([
						"not_started",
						"in_progress",
						"completed",
					]),
				})),
			{ probability: 0.3 },
		),
		canvasActions: faker.helpers.maybe(
			() =>
				Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => ({
					action: faker.helpers.arrayElement(["add_node", "reveal_archetype"]),
					node: faker.helpers.maybe(() => generateCanvasNodeDto(), {
						probability: 0.5,
					}),
					nodeId: faker.helpers.maybe(() => faker.string.uuid(), {
						probability: 0.5,
					}),
					archetype: faker.helpers.maybe(
						() => ({
							type: faker.helpers.arrayElement(archetypeTypes),
							personalizedSummary: faker.lorem.paragraph(),
						}),
						{ probability: 0.3 },
					),
				})),
			{ probability: 0.2 },
		),
		trackId: faker.helpers.maybe(() => faker.helpers.arrayElement(trackTypes), {
			probability: 0.5,
		}),
	};
}

export function generatePersonaStateResponse(): PersonaStateResponse {
	const nodeCount = faker.number.int({ min: 5, max: 20 });
	const messageCount = faker.number.int({ min: 10, max: 50 });

	return {
		userId: faker.string.uuid(),
		tracks: Object.fromEntries(
			trackTypes.map((trackId) => [trackId, generateTrackDto()]),
		),
		nodes: Array.from({ length: nodeCount }, () => generateCanvasNodeDto()),
		archetype: faker.helpers.maybe(() => generateArchetypeDto(), {
			probability: 0.4,
		}),
		conversationHistory: Array.from({ length: messageCount }, () =>
			generateChatMessageDto(),
		),
		currentTrackId: faker.helpers.maybe(
			() => faker.helpers.arrayElement(trackTypes),
			{
				probability: 0.6,
			},
		),
		createdAt: faker.date.past().toISOString(),
		updatedAt: faker.date.recent().toISOString(),
	};
}

export function generateTrackSelectResponse(): TrackSelectResponse {
	return {
		message: generateChatMessageDto(),
		trackStatus: faker.helpers.arrayElement([
			"not_started",
			"in_progress",
			"completed",
		]),
		currentTrackId: faker.helpers.arrayElement(trackTypes),
	};
}

export function generateMessageResponse(): MessageResponse {
	return {
		message: generateChatMessageDto(),
		conversationState: {
			coreQuestionIndex: faker.number.int({ min: 0, max: 5 }),
			followUpIndex: faker.number.int({ min: 0, max: 3 }),
			totalCoreQuestions: faker.number.int({ min: 3, max: 6 }),
		},
		trackStatus: faker.helpers.arrayElement([
			"not_started",
			"in_progress",
			"completed",
		]),
		currentTrackId: faker.helpers.arrayElement(trackTypes),
		allTracksComplete: faker.datatype.boolean(),
	};
}





export function generateDiscoveryProgressDto(): DiscoveryProgressDto {
	const totalTracks = trackTypes.length;
	const completedTracks = faker.number.int({ min: 0, max: totalTracks });

	return {
		completedTracks,
		totalTracks,
		archetypeRevealed:
			completedTracks === totalTracks ? faker.datatype.boolean() : false,
	};
}

export function generateSuggestedActionDto(): SuggestedActionDto {
	const type = faker.helpers.arrayElement(suggestedActionTypes);
	const actions = {
		persona: {
			title: "Continue Your Persona Discovery",
			description: "Complete your tracks to reveal your archetype",
			link: "/persona-lab",
		},
		explore: {
			title: "Explore Programs",
			description: "Discover programs that match your profile",
			link: "/explore",
		},
		profile: {
			title: "Complete Your Profile",
			description: "Add more details to get better recommendations",
			link: "/dashboard/profile",
		},
		deadline: {
			title: "Upcoming Deadlines",
			description: "You have applications with deadlines approaching",
			link: "/dashboard/applications",
		},
		writing: {
			title: "Continue Writing Your SOP",
			description: "Finish your statement of purpose",
			link: "/dashboard/applications",
		},
	};

	return {
		type,
		...actions[type],
	};
}

export function generateRecentApplicationDto(): RecentApplicationDto {
	const fitCategory = faker.helpers.arrayElement(fitCategories);
	const fitScore =
		fitCategory === "reach"
			? faker.number.int({ min: 50, max: 70 })
			: fitCategory === "target"
				? faker.number.int({ min: 71, max: 85 })
				: faker.number.int({ min: 86, max: 100 });

	return {
		id: faker.string.uuid(),
		universityName: faker.company.name() + " University",
		programName: faker.helpers.arrayElement([
			`Bachelor of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
			`Master of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
		]),
		status: faker.helpers.arrayElement(applicationStatuses),
		fitScore,
	};
}

export function generateHomeResponse(): HomeResponse {
	const firstName = faker.person.firstName();
	const applicationCount = faker.number.int({ min: 0, max: 10 });
	const deadlineCount = faker.number.int({ min: 0, max: 5 });

	return {
		firstName,
		profileCompletion: faker.number.int({ min: 40, max: 100 }),
		journeyType: faker.helpers.arrayElement(journeyTypes),
		discovery: generateDiscoveryProgressDto(),
		applications: generateApplicationSummaryDto(),
		recentApplications: Array.from({ length: applicationCount }, () =>
			generateRecentApplicationDto(),
		),
		upcomingDeadlines: Array.from({ length: deadlineCount }, () =>
			generateUpcomingDeadlineDto(),
		),
		suggestedAction: generateSuggestedActionDto(),
	};
}








export function generateMany<T>(generator: () => T, count: number = 10): T[] {
	return Array.from({ length: count }, generator);
}




export function generateRandom<T>(
	generator: () => T,
	min: number = 1,
	max: number = 10,
): T[] {
	return generateMany(generator, faker.number.int({ min, max }));
}
````

## File: lib/mock/index.ts
````typescript
export * from "./fakerGenerators";
````

## File: lib/mock/README.md
````markdown
# Mock Data Generators

This directory contains mock data generators using [Faker.js](https://fakerjs.dev/) based on the API schema defined in `lib/api/types.ts`.

## Installation

The `@faker-js/faker` package is already installed as a dev dependency.

## Usage

### Basic Usage

```typescript
import { 
  generateProgramListItemResponse, 
  generateUserMeResponse,
  generateApplicationResponse 
} from '@/lib/mock';

// Generate a single instance
const program = generateProgramListItemResponse();
const user = generateUserMeResponse();
const application = generateApplicationResponse();
```

### Generating Multiple Instances

```typescript
import { generateMany, generateRandom } from '@/lib/mock';
import { generateProgramListItemResponse } from '@/lib/mock';

// Generate exactly 10 programs
const programs = generateMany(generateProgramListItemResponse, 10);

// Generate a random number between 5 and 15
const randomPrograms = generateRandom(generateProgramListItemResponse, 5, 15);
```

### Complete Examples

#### Generate Program List Response

```typescript
import { generateProgramListResponse } from '@/lib/mock';

// Generate a paginated program list
const programList = generateProgramListResponse(20, 1, 20);
// Returns: { data: ProgramListItemResponse[], pagination: PaginationResponse }
```

#### Generate AI Match Response

```typescript
import { generateAiMatchResponse } from '@/lib/mock';

// Generate AI-matched programs categorized by fit
const aiMatch = generateAiMatchResponse();
// Returns: { reach: [], target: [], safety: [], ... }
```

#### Generate Home Dashboard Data

```typescript
import { generateHomeResponse } from '@/lib/mock';

// Generate complete home dashboard data
const homeData = generateHomeResponse();
// Returns: { firstName, profileCompletion, discovery, applications, ... }
```

#### Generate Persona State

```typescript
import { generatePersonaStateResponse } from '@/lib/mock';

// Generate complete persona lab state
const personaState = generatePersonaStateResponse();
// Returns: { tracks, nodes, archetype, conversationHistory, ... }
```

## Available Generators

### Authentication
- `generateRegisterRequest()` - Register request data
- `generateLoginRequest()` - Login request data
- `generateAuthResponse()` - Authentication response with tokens

### User & Profile
- `generateUserInfo()` - Basic user information
- `generateProfileInfo()` - User profile data
- `generatePreferencesInfo()` - User preferences
- `generateUserContextResponse()` - Complete user context
- `generateProfileResponse()` - Profile response
- `generateUserMeResponse()` - Complete user/me response

### Onboarding
- `generateOnboardingDataResponse()` - Onboarding progress data
- `generateOnboardingStatusResponse()` - Current onboarding status
- `generateOnboardingResponse()` - Onboarding step response

### Explore
- `generateProgramListItemResponse()` - Single program list item
- `generateProgramDetailResponse()` - Complete program details
- `generateProgramListResponse(count, page, size)` - Paginated program list
- `generateProgramIntakeResponse()` - Program intake information
- `generateTuitionResponse()` - Tuition information
- `generateRequirementsResponse()` - Admission requirements
- `generateFilterOptionsResponse()` - Available filter options
- `generateAiMatchResponse()` - AI-matched programs by category
- `generatePaginationResponse(page, size, total)` - Pagination metadata

### Applications
- `generateApplicationResponse()` - Single application
- `generateApplicationListResponse()` - List of applications with summary
- `generateApplicationSummaryDto()` - Application statistics
- `generateUpcomingDeadlineDto()` - Upcoming deadline information
- `generateProgramSummaryDto()` - Program summary for applications
- `generateGapDto()` - Application gap information
- `generateApplicationSopResponse()` - Statement of Purpose data
- `generateSopFeedbackDto()` - SOP feedback
- `generateEvaluationResponse()` - Application evaluation with gaps

### Persona Lab
- `generatePersonaStateResponse()` - Complete persona state
- `generateTrackDto()` - Track information
- `generateArchetypeDto()` - Archetype data
- `generateCanvasNodeDto()` - Canvas node
- `generateChatMessageDto()` - Chat message
- `generateTrackSelectResponse()` - Track selection response
- `generateMessageResponse()` - Message response with state

### Home Dashboard
- `generateHomeResponse()` - Complete home dashboard data
- `generateDiscoveryProgressDto()` - Discovery progress
- `generateSuggestedActionDto()` - Suggested action
- `generateRecentApplicationDto()` - Recent application summary

## Helper Functions

- `generateMany<T>(generator, count)` - Generate exactly N instances
- `generateRandom<T>(generator, min, max)` - Generate random number of instances

## Notes

- All generators use realistic data ranges based on the API schema
- Dates are generated as ISO strings
- IDs are generated as UUIDs
- Optional fields use `faker.helpers.maybe()` with appropriate probabilities
- Arrays use `faker.helpers.arrayElements()` with min/max counts
- Fit scores and categories are correlated (reach = 50-70, target = 71-85, safety = 86-100)

## Type Safety

All generators return properly typed objects matching the API schema types from `lib/api/types.ts`. TypeScript will provide full type checking and autocomplete.
````

## File: lib/validations/auth.ts
````typescript
import { z } from "zod";





export const loginSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;









export const registerSchema = z
	.object({
		fullName: z
			.string()
			.min(1, "Full name is required")
			.min(2, "Full name must be at least 2 characters")
			.max(100, "Full name must not exceed 100 characters")
			.regex(
				/^[a-zA-ZÀ-ỹ\s'-]+$/,
				"Full name can only contain letters, spaces, hyphens, and apostrophes",
			),
		email: z
			.string()
			.min(1, "Email is required")
			.email("Please enter a valid email address")
			.toLowerCase(),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[0-9]/, "Password must contain at least one number"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type RegisterFormData = z.infer<typeof registerSchema>;




export const verifyEmailSchema = z.object({
	token: z.string().min(1, "Verification token is required"),
});




export const forgotPasswordSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
});




export const resetPasswordSchema = z
	.object({
		token: z.string().min(1, "Reset token is required"),
		newPassword: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[0-9]/, "Password must contain at least one number"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
````

## File: lib/initializeData.ts
````typescript
export function initializeAppData() {


}
````

## File: instrumentation.ts
````typescript
import * as Sentry from "@sentry/nextjs";

export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		await import("./sentry.server.config");
	}

	if (process.env.NEXT_RUNTIME === "edge") {
		await import("./sentry.edge.config");
	}
}

export const onRequestError = Sentry.captureRequestError;
````

## File: sentry.edge.config.ts
````typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: "https://e57948157cff4cc9a0dd76a2a338fb15@app.glitchtip.com/19431",


	tracesSampleRate: 1,


	enableLogs: true,



	sendDefaultPii: true,
});
````

## File: sentry.server.config.ts
````typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: "https://e57948157cff4cc9a0dd76a2a338fb15@app.glitchtip.com/19431",


	tracesSampleRate: 1,


	enableLogs: true,



	sendDefaultPii: true,
});
````

## File: tsconfig.json
````json
{
	"compilerOptions": {
		"target": "es2017",
		"lib": ["dom", "dom.iterable", "es2017"],
		"allowJs": true,
		"skipLibCheck": true,
		"esModuleInterop": true,
		"allowSyntheticDefaultImports": true,
		"strict": true,
		"forceConsistentCasingInFileNames": true,
		"module": "esnext",
		"moduleResolution": "bundler",
		"resolveJsonModule": true,
		"isolatedModules": true,
		"noEmit": true,
		"jsx": "react-jsx",
		"incremental": true,
		"types": ["node", "react", "react-dom"],
		"paths": {
			"@/*": ["./*"]
		},
		"plugins": [
			{
				"name": "next"
			}
		]
	},
	"include": [
		"next-env.d.ts",
		"**/*.ts",
		"**/*.tsx",
		".next/types/**/*.ts",
		".next/dev/types/**/*.ts"
	],
	"exclude": ["node_modules"]
}
````

## File: app/(app)/dashboard/applications/page.tsx
````typescript
"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { ApplicationDashboard } from "@/components/ApplicationDashboard";
import { ApplicationSidebar } from "@/components/ApplicationSidebar";
import { PageTransition } from "@/components/PageTransition";
import { useApplicationsStore } from "@/lib/store/applicationsStore";

export default function ApplicationsPage() {
	const t = useTranslations("applications");
	const {
		applications,
		isLoading,
		error,
		selectedApplicationId,
		fetchApplications,
		setSelectedApplication,
		updateApplicationStatus,
		removeApplication,
		getSelectedApplication,
	} = useApplicationsStore();

	useEffect(() => {
		fetchApplications();
	}, [fetchApplications]);

	const selectedApplication = getSelectedApplication();

	const handleUpdateStatus = async (status: string) => {
		if (selectedApplicationId) {
			return await updateApplicationStatus(selectedApplicationId, {
				status: status as "planning" | "writing" | "submitted",
			});
		}
		return false;
	};

	const handleDelete = async () => {
		if (selectedApplicationId) {
			return await removeApplication(selectedApplicationId);
		}
		return false;
	};

	return (
		<PageTransition>
			<div className="flex min-h-[calc(100vh-16rem)]">
				{}
				<div className="w-full lg:w-80 xl:w-96 shrink-0 hidden lg:block h-[calc(100vh-5rem)] sticky top-0">
					<ApplicationSidebar
						applications={applications}
						selectedId={selectedApplicationId}
						onSelectApplication={setSelectedApplication}
						isLoading={isLoading}
					/>
				</div>

				{}
				<div className="lg:hidden w-full min-h-screen">
					{!selectedApplicationId ? (
						<ApplicationSidebar
							applications={applications}
							selectedId={selectedApplicationId}
							onSelectApplication={setSelectedApplication}
							isLoading={isLoading}
						/>
					) : (
						<div className="flex flex-col">
							{}
							<div className="p-4 border-b border-border bg-card lg:hidden sticky top-0 z-10">
								<button
									type="button"
									onClick={() => setSelectedApplication(null)}
									className="flex items-center gap-2 text-sm text-primary hover:text-foreground transition-colors"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										role="img"
										aria-label="Back to Applications"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 19l-7-7 7-7"
										/>
									</svg>
									{t("backToApplications")}
								</button>
							</div>
							<ApplicationDashboard
								application={selectedApplication}
								onUpdateStatus={handleUpdateStatus}
								onDelete={handleDelete}
							/>
						</div>
					)}
				</div>

				{}
				<div className="hidden lg:block flex-1">
					<ApplicationDashboard
						application={selectedApplication}
						onUpdateStatus={handleUpdateStatus}
						onDelete={handleDelete}
					/>
				</div>
			</div>

			{}
			{error && (
				<div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg">
					{error}
				</div>
			)}
		</PageTransition>
	);
}
````

## File: app/(auth)/layout.tsx
````typescript
import { Raleway } from "next/font/google";
import { DataInitializer } from "@/components/DataInitializer";

const raleway = Raleway({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
	title: "Leaply - Your AI-Powered Study Abroad Companion",
	description:
		"Discover universities, manage applications, and get personalized guidance for studying abroad with Leaply.",
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon.ico",
		apple: "/favicon.ico",
	},
};

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className={`min-h-screen ${raleway.className}`}>
			<DataInitializer />
			{children}
		</div>
	);
}
````

## File: app/(marketing)/resources/page.tsx
````typescript
"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { PageContainer } from "@/components/Layout";
import {
	PageTransition,
	StaggerContainer,
	StaggerItem,
} from "@/components/PageTransition";
import { ResourceCard } from "@/components/ResourceCard";
import { Input } from "@/components/ui/input";
import { mockResources } from "@/lib/data/resources";

export default function ResourcesPage() {
	const t = useTranslations("resources");
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");

	const categories = Array.from(
		new Set(mockResources.map((r) => r.category)),
	).sort();

	const filteredResources = mockResources.filter((resource) => {
		const matchesSearch =
			resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			resource.summary.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory =
			categoryFilter === "all" || resource.category === categoryFilter;
		return matchesSearch && matchesCategory;
	});

	return (
		<PageTransition>
			<PageContainer>
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						{t("title")}
					</h1>
					<p className="text-lg text-muted-foreground">{t("subtitle")}</p>
				</div>

				{}
				<div className="flex flex-col md:flex-row gap-4 mb-8">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							type="text"
							placeholder={t("searchResources")}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
					<select
						value={categoryFilter}
						onChange={(e) => setCategoryFilter(e.target.value)}
						className="md:w-48 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
					>
						<option value="all">{t("allCategories")}</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</div>

				{}
				<p className="text-sm text-muted-foreground mb-6">
					{filteredResources.length}{" "}
					{filteredResources.length !== 1 ? t("resourcePlural") : t("resource")}{" "}
					{t("found")}
				</p>

				{}
				<StaggerContainer>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredResources.map((resource) => (
							<StaggerItem key={resource.id}>
								<ResourceCard
									title={resource.title}
									summary={resource.summary}
									url={resource.url}
									type={resource.type}
									tags={resource.tags}
								/>
							</StaggerItem>
						))}
					</div>
				</StaggerContainer>

				{filteredResources.length === 0 && (
					<div className="text-center py-16">
						<Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-foreground mb-2">
							{t("noResourcesFound")}
						</h3>
						<p className="text-muted-foreground">{t("tryAdjustingFilters")}</p>
					</div>
				)}
			</PageContainer>
		</PageTransition>
	);
}
````

## File: components/explore/AIMatchMode.tsx
````typescript
import { ChevronDown, ShieldCheck, Sparkles, Target } from "lucide-react";
import { useState } from "react";
import { ProgramCard } from "@/components/explore/ProgramCard";
import type { ProgramListItemResponse } from "@/lib/api/types";




export function CategoryContainer({
	title,
	programs,
	variant,
	onSaveToggle,
	onProgramClick,
	defaultExpanded = true,
}: {
	title: string;
	programs: ProgramListItemResponse[];
	variant: "reach" | "target" | "safety";
	onSaveToggle?: (id: string) => void;
	onProgramClick?: (program: ProgramListItemResponse) => void;
	defaultExpanded?: boolean;
}) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);
	const [showAll, setShowAll] = useState(false);

	const variantStyles = {
		reach: {
			border: "border-blue-500/20",
			bg: "bg-blue-500/5",
			text: "text-blue-700 dark:text-blue-300",
			icon: <Target className="w-5 h-5" />,
			description:
				"High ranking programs that are competitive but offer excellent prestige.",
		},
		target: {
			border: "border-yellow-500/20",
			bg: "bg-yellow-500/5",
			text: "text-yellow-700 dark:text-yellow-300",
			icon: <Sparkles className="w-5 h-5" />,
			description:
				"Programs where your profile is a strong match for successful applicants.",
		},
		safety: {
			border: "border-green-500/20",
			bg: "bg-green-500/5",
			text: "text-green-700 dark:text-green-300",
			icon: <ShieldCheck className="w-5 h-5" />,
			description:
				"Solid programs where you exceed the typical admission requirements.",
		},
	};

	const style = variantStyles[variant];


	const MAX_PREVIEW_CARDS = 2;
	const displayedPrograms = showAll
		? programs
		: programs.slice(0, MAX_PREVIEW_CARDS);
	const hasMore = programs.length > MAX_PREVIEW_CARDS;

	return (
		<div
			className={`border rounded-xl overflow-hidden shadow-sm transition-all duration-300 mb-3 ${
				isExpanded ? "ring-1 ring-border" : "hover:border-primary/30"
			}`}
		>
			{}
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
					isExpanded ? style.bg : "bg-card"
				}`}
			>
				<div className="flex items-center gap-3">
					<div className={`p-2 rounded-lg ${style.bg} ${style.text}`}>
						{style.icon}
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h3 className="text-lg font-bold text-foreground">{title}</h3>
							<span
								className={`px-2 py-0.5 rounded-full text-xs font-semibold ${style.bg} ${style.text} border ${style.border}`}
							>
								{programs.length}
							</span>
						</div>
					</div>
				</div>
				<ChevronDown
					className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
						isExpanded ? "rotate-180" : ""
					}`}
				/>
			</button>

			{}
			<div
				className={`transition-all duration-300 ease-in-out ${
					isExpanded ? "max-h-500 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="px-4 pb-4 border-t border-border bg-background">
					{programs.length > 0 ? (
						<>
							{}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
								{displayedPrograms.map((program) => (
									<ProgramCard
										key={program.id}
										program={program}
										onSaveToggle={onSaveToggle}
										onClick={onProgramClick}
									/>
								))}
							</div>

							{}
							{hasMore && !showAll && (
								<div className="mt-4 text-center">
									<button
										type="button"
										onClick={() => setShowAll(true)}
										className="text-sm text-primary hover:text-primary/80 font-medium"
									>
										View all {programs.length} programs →
									</button>
								</div>
							)}

							{}
							{showAll && (
								<div className="mt-4 text-center">
									<button
										type="button"
										onClick={() => setShowAll(false)}
										className="text-sm text-muted-foreground hover:text-foreground font-medium"
									>
										Show less ↑
									</button>
								</div>
							)}
						</>
					) : (
						<div className="py-8 text-center">
							<p className="text-sm text-muted-foreground">
								No programs found in this category.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}




export function SwimLanes({
	programs,
	onSaveToggle,
	onProgramClick,
}: {
	programs: ProgramListItemResponse[];
	onSaveToggle?: (id: string) => void;
	onProgramClick?: (program: ProgramListItemResponse) => void;
}) {
	const reach = programs.filter((p) => p.fitCategory === "reach");
	const target = programs.filter((p) => p.fitCategory === "target");
	const safety = programs.filter((p) => p.fitCategory === "safety");

	return (
		<div className="space-y-2">
			<CategoryContainer
				title="Reach Schools"
				programs={reach}
				variant="reach"
				onSaveToggle={onSaveToggle}
				onProgramClick={onProgramClick}
			/>
			<CategoryContainer
				title="Target Schools"
				programs={target}
				variant="target"
				onSaveToggle={onSaveToggle}
				onProgramClick={onProgramClick}
			/>
			<CategoryContainer
				title="Safety Schools"
				programs={safety}
				variant="safety"
				onSaveToggle={onSaveToggle}
				onProgramClick={onProgramClick}
			/>
		</div>
	);
}
````

## File: components/explore/CompareDialog.tsx
````typescript
"use client";

import {
	AlertTriangle,
	Calendar,
	CheckCircle2,
	DollarSign,
	GraduationCap,
	Info,
	Languages,
	MapPin,
	Plus,
	ThumbsUp,
	TrendingUp,
	Trophy,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ProgramListItemResponse } from "@/lib/api/types";





interface CompareDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedPrograms: Set<string>;
	programs: ProgramListItemResponse[];
	onRemoveProgram: (id: string) => void;
	onAddToDashboard: (id: string) => void;
}

interface DeadlineInfo {
	text: string;
	isUrgent: boolean;
	daysLeft: string | null;
	color?: string;
}

interface GpaRequirement {
	min: string;
	scale: string | null;
	userGpa: string | null;
	status: "pass" | "high";
}

interface EnglishRequirement {
	type: string;
	score: string;
	detail: string | null;
	status: "pass" | "need_improve";
	gap?: string;
}

interface ProgramRequirements {
	gpa: GpaRequirement;
	english: EnglishRequirement;
}

interface ProgramAnalysis {
	pros: string[];
	cons: string[];
	icon: "info" | "success" | "warning";
}








function getMatchBadge(fitCategory?: string, fitScore?: number) {
	const score = fitScore ?? 0;
	switch (fitCategory) {
		case "safety":
			return (
				<Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
					<CheckCircle2 className="w-3 h-3" />
					High Match ({score}%)
				</Badge>
			);
		case "target":
			return (
				<Badge className="bg-blue-100 text-blue-700 border-blue-200 gap-1">
					<ThumbsUp className="w-3 h-3" />
					Good Match ({score}%)
				</Badge>
			);
		case "reach":
			return (
				<Badge className="bg-orange-100 text-orange-700 border-orange-200 gap-1">
					<TrendingUp className="w-3 h-3" />
					Reach ({score}%)
				</Badge>
			);
		default:
			return null;
	}
}




function getDeadlineInfo(deadline?: string): DeadlineInfo {
	if (!deadline) return { text: "N/A", isUrgent: false, daysLeft: null };
	const daysUntil = Math.floor(
		(new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
	);
	const formatted = new Date(deadline).toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

	if (daysUntil < 14) {
		return {
			text: formatted,
			isUrgent: true,
			daysLeft: `Sắp hết hạn (${daysUntil} ngày)`,
			color: "text-destructive",
		};
	}
	if (daysUntil <= 60) {
		return {
			text: formatted,
			isUrgent: false,
			daysLeft: `Còn ${Math.floor(daysUntil / 30)} tháng`,
			color: "text-muted-foreground",
		};
	}
	return {
		text: formatted,
		isUrgent: false,
		daysLeft: `Còn ${daysUntil} ngày`,
		color: "text-muted-foreground",
	};
}




function getMockRequirements(
	program: ProgramListItemResponse,
): ProgramRequirements {
	const hash = program.id.charCodeAt(0) % 3;
	const gpaRequirements: GpaRequirement[] = [
		{ min: "3.0", scale: "4.0", userGpa: "3.8", status: "pass" },
		{ min: "Honors Class II", scale: null, userGpa: null, status: "pass" },
		{ min: "2.5", scale: "4.0", userGpa: "3.8", status: "high" },
	];
	const englishRequirements: EnglishRequirement[] = [
		{ type: "IELTS", score: "6.5", detail: "(all band > 6.0)", status: "pass" },
		{
			type: "IELTS",
			score: "7.0",
			detail: null,
			status: "need_improve",
			gap: "+0.5",
		},
		{ type: "IELTS", score: "6.0", detail: null, status: "pass" },
	];
	return {
		gpa: gpaRequirements[hash],
		english: englishRequirements[hash],
	};
}




function getDetailedAnalysis(
	program: ProgramListItemResponse,
): ProgramAnalysis {
	const analyses: Record<string, ProgramAnalysis> = {
		safety: {
			icon: "info",
			pros: ["Chương trình an toàn. Có khả năng cao nhận offer trong 2 tuần."],
			cons: [
				`Chi phí sinh hoạt tại ${program.universityCity || program.universityCountry} cao hơn dự kiến ngân sách của bạn.`,
			],
		},
		target: {
			icon: "warning",
			pros: ["Background Toán học rất mạnh, phù hợp ngành Data Science."],
			cons: [
				`Điểm Writing của bạn (6.0) thấp hơn yêu cầu ${program.universityName} (6.5). Cần thi lại.`,
			],
		},
		reach: {
			icon: "success",
			pros: [
				`GPA của bạn (3.8) cao hơn mức yêu cầu, tăng khả năng nhận học bổng.`,
				"Hoạt động ngoại khóa phù hợp với tiêu chí tuyển sinh.",
			],
			cons: [],
		},
	};
	return analyses[program.fitCategory || "safety"] || analyses.safety;
}








function ProgramHeaderCell({ program }: { program: ProgramListItemResponse }) {
	return (
		<th className="p-4 text-left border-l border-border min-w-64">
			<div className="space-y-3">
				{}
				<div className="flex items-start justify-between gap-2">
					<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
						{program.universityLogoUrl ? (
							<Image
								src={program.universityLogoUrl}
								alt={program.universityName}
								width={40}
								height={40}
								className="object-contain"
							/>
						) : (
							<span className="text-sm font-bold text-primary">
								{program.universityName.charAt(0).toUpperCase()}
							</span>
						)}
					</div>
					{getMatchBadge(program.fitCategory, program.fitScore)}
				</div>

				{}
				<div>
					<h3 className="font-semibold text-foreground">
						{program.programName}
					</h3>
					<p className="text-sm text-muted-foreground">
						{program.universityName}
					</p>
				</div>

				{}
				<div className="flex items-center gap-1 text-sm text-muted-foreground">
					<MapPin className="w-3.5 h-3.5" />
					{program.universityCountry}
				</div>
			</div>
		</th>
	);
}




function TuitionCell({ program }: { program: ProgramListItemResponse }) {
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-1">
				<p className="font-semibold text-foreground">
					{program.tuitionAnnualUsd
						? `$${program.tuitionAnnualUsd.toLocaleString()} USD`
						: "N/A"}
				</p>
				{program.scholarshipAvailable && (
					<p className="text-sm text-green-600">✓ Có học bổng (đến 20%)</p>
				)}
				{!program.scholarshipAvailable && (
					<p className="text-sm text-muted-foreground italic">
						Không có học bổng kỳ này
					</p>
				)}
			</div>
		</td>
	);
}




function RankingCell({ program }: { program: ProgramListItemResponse }) {
	return (
		<td className="p-4 border-l border-border align-top">
			{program.rankingQsDisplay ? (
				<div className="flex items-center gap-2">
					<Badge
						variant="outline"
						className="font-semibold text-primary border-primary"
					>
						{program.rankingQsDisplay}
					</Badge>
					<span className="text-sm text-muted-foreground">Thế giới</span>
				</div>
			) : (
				<span className="text-muted-foreground">N/A</span>
			)}
		</td>
	);
}




function DeadlineCell({ program }: { program: ProgramListItemResponse }) {
	const deadline = getDeadlineInfo(program.nextDeadline);
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-1">
				<p className="font-semibold text-foreground">{deadline.text}</p>
				{deadline.daysLeft && (
					<p className={`text-sm flex items-center gap-1 ${deadline.color}`}>
						{deadline.isUrgent && <AlertTriangle className="w-3.5 h-3.5" />}
						{deadline.daysLeft}
					</p>
				)}
			</div>
		</td>
	);
}




function GpaCell({ program }: { program: ProgramListItemResponse }) {
	const req = getMockRequirements(program);
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-1">
				<p className="font-semibold text-foreground">
					{req.gpa.scale
						? `Min ${req.gpa.min} / ${req.gpa.scale}`
						: req.gpa.min}
				</p>
				{req.gpa.userGpa && (
					<p
						className={`text-sm ${req.gpa.status === "high" ? "text-green-600" : "text-muted-foreground"}`}
					>
						Bạn đạt: {req.gpa.userGpa}{" "}
						{req.gpa.status === "high"
							? "(Cao)"
							: req.gpa.status === "pass"
								? "(Dư sức)"
								: ""}
					</p>
				)}
				{!req.gpa.userGpa && req.gpa.status === "pass" && (
					<p className="text-sm text-muted-foreground">Bạn đạt yêu cầu</p>
				)}
			</div>
		</td>
	);
}




function EnglishCell({ program }: { program: ProgramListItemResponse }) {
	const req = getMockRequirements(program);
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-1">
				<p className="font-semibold text-foreground">
					{req.english.type} {req.english.score}
					{req.english.detail && (
						<span className="font-normal text-muted-foreground">
							{" "}
							{req.english.detail}
						</span>
					)}
				</p>
				{req.english.status === "pass" && (
					<p className="text-sm text-green-600 flex items-center gap-1">
						<CheckCircle2 className="w-3.5 h-3.5" />
						Đạt
					</p>
				)}
				{req.english.status === "need_improve" && (
					<p className="text-sm text-orange-600 flex items-center gap-1">
						<AlertTriangle className="w-3.5 h-3.5" />
						Bạn cần cải thiện ({req.english.gap})
					</p>
				)}
			</div>
		</td>
	);
}




function AnalysisCell({ program }: { program: ProgramListItemResponse }) {
	const analysis = getDetailedAnalysis(program);
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-2">
				{analysis.pros.map((pro, idx) => (
					<div key={`pro-${idx}`} className="flex items-start gap-2 text-sm">
						<CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
						<span className="text-foreground">{pro}</span>
					</div>
				))}
				{analysis.cons.map((con, idx) => (
					<div key={`con-${idx}`} className="flex items-start gap-2 text-sm">
						<AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
						<span className="text-foreground">{con}</span>
					</div>
				))}
				{analysis.pros.length === 0 && analysis.cons.length === 0 && (
					<div className="flex items-start gap-2 text-sm">
						<Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
						<span className="text-muted-foreground">Đang phân tích...</span>
					</div>
				)}
			</div>
		</td>
	);
}




function ActionsCell({
	program,
	onAddToDashboard,
	onRemoveProgram,
}: {
	program: ProgramListItemResponse;
	onAddToDashboard: (id: string) => void;
	onRemoveProgram: (id: string) => void;
}) {
	return (
		<td className="p-4 border-l border-border align-top">
			<div className="space-y-3">
				<Button className="w-full" onClick={() => onAddToDashboard(program.id)}>
					Thêm vào Dashboard
				</Button>
				<button
					type="button"
					onClick={() => onRemoveProgram(program.id)}
					className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors text-center"
				>
					Bỏ khỏi so sánh
				</button>
			</div>
		</td>
	);
}




function RowLabel({
	icon: Icon,
	label,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
}) {
	return (
		<td className="p-4 align-top">
			<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
				<Icon className="w-4 h-4" />
				{label}
			</div>
		</td>
	);
}








export function CompareDialog({
	open,
	onOpenChange,
	selectedPrograms,
	programs,
	onRemoveProgram,
	onAddToDashboard,
}: CompareDialogProps) {
	const selectedProgramsList = Array.from(selectedPrograms)
		.map((id) => programs.find((p) => p.id === id))
		.filter(Boolean) as ProgramListItemResponse[];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-6xl max-h-[90vh] p-0 gap-0 overflow-hidden">
				<DialogHeader className="sr-only">
					<DialogTitle>So sánh chương trình</DialogTitle>
					<DialogDescription>
						So sánh các chương trình học đã chọn
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className="max-h-[90vh]">
					<div className="p-6">
						{}
						<div className="border border-border rounded-lg overflow-hidden">
							<table className="w-full">
								<thead>
									<tr className="border-b border-border bg-muted/30">
										{}
										<th className="p-4 text-left font-medium text-sm text-muted-foreground w-40 align-top">
											<span className="uppercase tracking-wide text-xs">
												Tiêu chí so sánh
											</span>
										</th>
										{}
										{selectedProgramsList.map((program) => (
											<ProgramHeaderCell key={program.id} program={program} />
										))}
									</tr>
								</thead>
								<tbody>
									{}
									<tr className="border-b border-border">
										<RowLabel icon={DollarSign} label="Học phí / năm" />
										{selectedProgramsList.map((program) => (
											<TuitionCell key={program.id} program={program} />
										))}
									</tr>

									{}
									<tr className="border-b border-border">
										<RowLabel icon={Trophy} label="Xếp hạng QS" />
										{selectedProgramsList.map((program) => (
											<RankingCell key={program.id} program={program} />
										))}
									</tr>

									{}
									<tr className="border-b border-border">
										<RowLabel icon={Calendar} label="Hạn nộp hồ sơ" />
										{selectedProgramsList.map((program) => (
											<DeadlineCell key={program.id} program={program} />
										))}
									</tr>

									{}
									<tr className="border-b border-border">
										<RowLabel icon={GraduationCap} label="Yêu cầu GPA" />
										{selectedProgramsList.map((program) => (
											<GpaCell key={program.id} program={program} />
										))}
									</tr>

									{}
									<tr className="border-b border-border">
										<RowLabel icon={Languages} label="Tiếng Anh" />
										{selectedProgramsList.map((program) => (
											<EnglishCell key={program.id} program={program} />
										))}
									</tr>

									{}
									<tr className="border-b border-border bg-blue-50/50">
										<td className="p-4 align-top">
											<div className="flex items-start gap-2 text-sm font-medium text-primary">
												<Info className="w-4 h-4 mt-0.5" />
												<div>
													<p>Phân tích chi tiết</p>
													<p className="font-normal text-xs text-muted-foreground mt-1">
														So sánh hồ sơ của bạn với yêu cầu từng trường
													</p>
												</div>
											</div>
										</td>
										{selectedProgramsList.map((program) => (
											<AnalysisCell key={program.id} program={program} />
										))}
									</tr>

									{}
									<tr>
										<td className="p-4 align-top" />
										{selectedProgramsList.map((program) => (
											<ActionsCell
												key={program.id}
												program={program}
												onAddToDashboard={onAddToDashboard}
												onRemoveProgram={onRemoveProgram}
											/>
										))}
									</tr>
								</tbody>
							</table>
						</div>

						{}
						{selectedProgramsList.length < 4 && (
							<div className="mt-6 flex justify-center">
								<Button
									variant="outline"
									onClick={() => onOpenChange(false)}
									className="gap-2"
								>
									<Plus className="w-4 h-4" />
									Thêm chương trình khác để so sánh (Tối đa 4)
								</Button>
							</div>
						)}
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
````

## File: components/explore/mockDetailData.ts
````typescript
import type { ProgramDetailResponse } from "@/lib/api/types";
import { generateProgramDetailResponse } from "@/lib/mock";

export const MOCK_PROGRAM_DETAIL: ProgramDetailResponse =
	generateProgramDetailResponse();
````

## File: components/explore/ProgramDetailDrawer.tsx
````typescript
"use client";

import {
	Award,
	Calendar,
	CheckCircle2,
	Clock,
	DollarSign,
	Gift,
	Globe,
	GraduationCap,
	Info,
	Plus,
	RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { ProgramListItemResponse } from "@/lib/api/types";

interface ProgramDetailDrawerProps {
	program: ProgramListItemResponse | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCompare?: (id: string) => void;
	onAddToDashboard?: (id: string) => void;
}


function getCountryFlag(country: string): string {
	const countryMap: Record<string, string> = {
		Netherlands: "🇳🇱",
		Germany: "🇩🇪",
		France: "🇫🇷",
		"United States": "🇺🇸",
		USA: "🇺🇸",
		"United Kingdom": "🇬🇧",
		UK: "🇬🇧",
		Canada: "🇨🇦",
		Australia: "🇦🇺",
		Spain: "🇪🇸",
		Italy: "🇮🇹",
		Sweden: "🇸🇪",
		Denmark: "🇩🇰",
		Switzerland: "🇨🇭",
		Singapore: "🇸🇬",
		Japan: "🇯🇵",
		"South Korea": "🇰🇷",
		China: "🇨🇳",
		"Hong Kong": "🇭🇰",
	};
	return countryMap[country] || "🌍";
}


function formatCurrency(value: number, currency = "USD"): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		maximumFractionDigits: 0,
	}).format(value);
}


function usdToVnd(usd: number): string {
	const rate = 24500;
	const vnd = usd * rate;
	if (vnd >= 1000000000) {
		return `~ ${(vnd / 1000000000).toFixed(2)} tỷ VND`;
	}
	return `~ ${(vnd / 1000000).toFixed(0)} triệu VND`;
}


function formatDuration(months?: number): string {
	if (!months) return "N/A";
	const years = Math.floor(months / 12);
	const remainingMonths = months % 12;
	if (years === 0) return `${remainingMonths} Tháng`;
	if (remainingMonths === 0) return `${years} Năm`;
	return `${years} Năm ${remainingMonths} Tháng`;
}


function formatIntakeMonths(intake?: string): string {
	if (!intake) return "N/A";

	const intakeMonth: Record<string, string> = {
		Spring: "Tháng 2",
		Summer: "Tháng 6",
		Fall: "Tháng 9",
		Winter: "Tháng 1",
	};
	const season = intake.split(" ")[0];
	return intakeMonth[season] || intake;
}

export function ProgramDetailDrawer({
	program,
	open,
	onOpenChange,
	onCompare,
	onAddToDashboard,
}: ProgramDetailDrawerProps) {
	if (!program) return null;


	const entryRequirements = [
		{
			name: "Điểm trung bình (GPA)",
			userValue: "3.6",
			status: "met" as const,
		},
		{
			name: "IELTS",
			userValue: program.ieltsMinimum ? `${program.ieltsMinimum}+` : "6.5+",
			status: "met" as const,
		},
		{
			name: "TOEFL",
			userValue: program.toeflMinimum ? `${program.toeflMinimum}+` : "90+",
			status: "warning" as const,
		},
	];

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-full sm:max-w-lg p-0 flex flex-col"
			>
				{}
				<ScrollArea className="flex-1">
					<div className="p-6 space-y-6">
						{}
						<SheetHeader className="p-0 space-y-4">
							<div className="flex items-start gap-4">
								{}
								<div className="w-14 h-14 rounded-xl bg-linear-to-br from-emerald-800 to-emerald-900 flex items-center justify-center shrink-0 shadow-lg border-2 border-emerald-600/30 overflow-hidden">
									{program.universityLogoUrl ? (
										<Image
											src={program.universityLogoUrl}
											alt={program.universityName}
											width={56}
											height={56}
											className="object-contain"
										/>
									) : (
										<GraduationCap className="w-7 h-7 text-amber-400" />
									)}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<SheetTitle className="text-lg font-bold text-foreground">
											{program.universityName}
										</SheetTitle>
										<span className="text-xl shrink-0">
											{getCountryFlag(program.universityCountry || "")}
										</span>
									</div>
									<SheetDescription className="text-sm text-muted-foreground mt-0.5">
										{program.universityCity || "City"},{" "}
										{program.universityCountry}
									</SheetDescription>
								</div>
							</div>

							{}
							<h2 className="text-xl font-bold text-foreground leading-tight">
								{program.programName}
							</h2>

							{}
							<div className="flex flex-wrap gap-2">
								{program.rankingQsDisplay && (
									<Badge
										variant="outline"
										className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800 px-3 py-1"
									>
										<Award className="w-3.5 h-3.5 mr-1.5" />
										QS Ranking {program.rankingQsDisplay}
									</Badge>
								)}
								{program.fitScore && (
									<Badge
										variant="outline"
										className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800 px-3 py-1"
									>
										<RefreshCw className="w-3.5 h-3.5 mr-1.5" />
										Fit Score: {program.fitScore}%
									</Badge>
								)}
							</div>
						</SheetHeader>

						{}
						<section>
							<div className="flex items-center gap-2 mb-4">
								<Info className="w-5 h-5 text-blue-600" />
								<h3 className="font-semibold text-foreground">Tổng quan</h3>
							</div>
							<div className="grid grid-cols-3 gap-3">
								{}
								<div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
									<div className="flex justify-center mb-3">
										<div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
											<Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
										</div>
									</div>
									<p className="text-xs text-muted-foreground text-center">
										Thời lượng
									</p>
									<p className="font-semibold text-foreground text-center text-sm mt-1">
										{formatDuration(program.durationMonths)}
									</p>
								</div>

								{}
								<div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
									<div className="flex justify-center mb-3">
										<div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
											<Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
										</div>
									</div>
									<p className="text-xs text-muted-foreground text-center">
										Ngôn ngữ
									</p>
									<p className="font-semibold text-foreground text-center text-sm mt-1">
										Tiếng Anh
									</p>
								</div>

								{}
								<div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
									<div className="flex justify-center mb-3">
										<div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
											<Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
										</div>
									</div>
									<p className="text-xs text-muted-foreground text-center">
										Kỳ nhập học
									</p>
									<p className="font-semibold text-foreground text-center text-sm mt-1">
										{formatIntakeMonths(program.nextIntake) || "Tháng 2, 7"}
									</p>
								</div>
							</div>
						</section>

						{}
						<section>
							<div className="flex items-center gap-2 mb-4">
								<DollarSign className="w-5 h-5 text-emerald-600" />
								<h3 className="font-semibold text-foreground">
									Chi phí & Học bổng
								</h3>
							</div>
							<div className="grid grid-cols-2 gap-3 mb-3">
								{}
								<div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
									<div className="flex items-center justify-between mb-2">
										<p className="text-xs text-muted-foreground uppercase tracking-wide">
											Học phí năm
										</p>
										<DollarSign className="w-4 h-4 text-emerald-500" />
									</div>
									<p className="text-xl font-bold text-foreground">
										{program.tuitionAnnualUsd
											? formatCurrency(program.tuitionAnnualUsd, "AUD")
											: "N/A"}
									</p>
									<p className="text-xs text-muted-foreground mt-1">
										{program.tuitionAnnualUsd
											? usdToVnd(program.tuitionAnnualUsd)
											: ""}
									</p>
								</div>

								{/* Total Cost */}
								<div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
									<div className="flex items-center justify-between mb-2">
										<p className="text-xs text-muted-foreground uppercase tracking-wide">
											Tổng khóa
										</p>
										<Gift className="w-4 h-4 text-purple-500" />
									</div>
									<p className="text-xl font-bold text-foreground">
										{program.tuitionAnnualUsd && program.durationMonths
											? formatCurrency(
													(program.tuitionAnnualUsd * program.durationMonths) /
														12,
													"AUD",
												)
											: "N/A"}
									</p>
									<p className="text-xs text-muted-foreground mt-1">
										{program.tuitionAnnualUsd && program.durationMonths
											? usdToVnd(
													(program.tuitionAnnualUsd * program.durationMonths) /
														12,
												)
											: ""}
									</p>
								</div>
							</div>

							{/* Scholarship Info */}
							{program.scholarshipAvailable && (
								<div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
									<div className="flex items-start gap-3">
										<div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
											<GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
										</div>
										<div>
											<h4 className="font-semibold text-foreground text-sm">
												International Fee Remission
											</h4>
											<p className="text-sm text-muted-foreground mt-1">
												Cơ hội nhận học bổng lên đến{" "}
												<span className="font-semibold text-blue-600 dark:text-blue-400">
													10,000 AUD
												</span>{" "}
												cho năm đầu tiên dựa trên GPA xuất sắc.
											</p>
										</div>
									</div>
								</div>
							)}
						</section>

						{}
						<section>
							<div className="flex items-center gap-2 mb-4">
								<CheckCircle2 className="w-5 h-5 text-violet-600" />
								<h3 className="font-semibold text-foreground">
									Yêu cầu đầu vào
								</h3>
							</div>
							<div className="border border-border rounded-xl overflow-hidden">
								{}
								<div className="grid grid-cols-2 bg-muted/50 px-4 py-3 border-b border-border">
									<p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
										Tiêu chí
									</p>
									<p className="text-xs text-muted-foreground uppercase tracking-wide font-medium text-right">
										Trạng thái của bạn
									</p>
								</div>

								{}
								{entryRequirements.map((req, index) => (
									<div
										key={req.name}
										className={`grid grid-cols-2 px-4 py-3 items-center ${
											index < entryRequirements.length - 1
												? "border-b border-border"
												: ""
										}`}
									>
										<div className="flex items-center gap-2">
											<div
												className={`w-6 h-6 rounded-full flex items-center justify-center ${
													req.status === "met"
														? "bg-emerald-100 dark:bg-emerald-900/50"
														: "bg-amber-100 dark:bg-amber-900/50"
												}`}
											>
												{req.status === "met" ? (
													<CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
												) : (
													<Info className="w-4 h-4 text-amber-600 dark:text-amber-400" />
												)}
											</div>
											<span className="text-sm font-medium text-foreground">
												{req.name}
											</span>
										</div>
										<div className="text-right">
											<Badge
												variant="outline"
												className={`${
													req.status === "met"
														? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800"
														: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800"
												}`}
											>
												{req.userValue}
											</Badge>
										</div>
									</div>
								))}
							</div>
						</section>
					</div>
				</ScrollArea>

				{}
				<SheetFooter className="border-t border-border p-4 bg-background">
					<div className="flex gap-3 w-full">
						<Button
							variant="outline"
							className="flex-1 gap-2"
							onClick={() => program && onCompare?.(program.id)}
						>
							<RefreshCw className="w-4 h-4" />
							So sánh
						</Button>
						<Button
							className="flex-2 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
							onClick={() => program && onAddToDashboard?.(program.id)}
						>
							<Plus className="w-4 h-4" />
							Thêm vào Dashboard
						</Button>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
````

## File: components/explore/programMockData.json
````json
[
	{
		"id": "1",
		"universityId": "mit",
		"universityName": "Massachusetts Institute of Technology",
		"universityCountry": "United States",
		"universityCity": "Cambridge, MA",
		"universityLogoUrl": "/universities/mit.png",
		"rankingQsDisplay": "#1",
		"programName": "Master of Science in Computer Science",
		"degreeType": "Master",
		"degreeName": "MS",
		"majorCategories": ["Computer Science", "Technology"],
		"durationMonths": 24,
		"deliveryMode": "On Campus",
		"tuitionAnnualUsd": 58240,
		"scholarshipAvailable": true,
		"ieltsMinimum": 7.5,
		"toeflMinimum": 100,
		"nextDeadline": "2025-12-15",
		"nextIntake": "Fall 2025",
		"fitScore": 48,
		"fitCategory": "reach",
		"fitReasons": ["Strong research fit", "Your field aligns with faculty"],
		"fitGaps": [
			"GPA below requirement (3.3 vs 3.7)",
			"IELTS needs improvement (6.5 vs 7.5)"
		],
		"isSaved": false
	},
	{
		"id": "2",
		"universityId": "stanford",
		"universityName": "Stanford University",
		"universityCountry": "United States",
		"universityCity": "Stanford, CA",
		"universityLogoUrl": "/universities/stanford.png",
		"rankingQsDisplay": "#3",
		"programName": "Master of Science in Artificial Intelligence",
		"degreeType": "Master",
		"degreeName": "MS",
		"majorCategories": ["Artificial Intelligence", "Computer Science"],
		"durationMonths": 18,
		"deliveryMode": "On Campus",
		"tuitionAnnualUsd": 62000,
		"scholarshipAvailable": true,
		"ieltsMinimum": 7.0,
		"toeflMinimum": 100,
		"nextDeadline": "2025-01-10",
		"nextIntake": "Fall 2025",
		"fitScore": 52,
		"fitCategory": "reach",
		"fitReasons": ["Your AI project experience is competitive"],
		"fitGaps": [
			"Average GPA for admits is 3.8+",
			"Consider stronger research experience"
		],
		"isSaved": true
	},
	{
		"id": "3",
		"universityId": "cmu",
		"universityName": "Carnegie Mellon University",
		"universityCountry": "United States",
		"universityCity": "Pittsburgh, PA",
		"universityLogoUrl": "/universities/cmu.png",
		"rankingQsDisplay": "#22",
		"programName": "Master of Science in Machine Learning",
		"degreeType": "Master",
		"degreeName": "MS",
		"majorCategories": ["Machine Learning", "Data Science"],
		"durationMonths": 12,
		"deliveryMode": "On Campus",
		"tuitionAnnualUsd": 52000,
		"scholarshipAvailable": true,
		"ieltsMinimum": 7.0,
		"toeflMinimum": 100,
		"nextDeadline": "2025-02-01",
		"nextIntake": "Fall 2025",
		"fitScore": 67,
		"fitCategory": "target",
		"fitReasons": ["GPA meets requirement", "Perfect field alignment"],
		"fitGaps": ["Consider retaking IELTS (6.5→7.0)", "Strengthen your SOP"],
		"isSaved": false
	},
	{
		"id": "4",
		"universityId": "ucl",
		"universityName": "University College London",
		"universityCountry": "United Kingdom",
		"universityCity": "London",
		"universityLogoUrl": "/universities/ucl.png",
		"rankingQsDisplay": "#9",
		"programName": "MSc Computer Science",
		"degreeType": "Master",
		"degreeName": "MSc",
		"majorCategories": ["Computer Science"],
		"durationMonths": 12,
		"deliveryMode": "On Campus",
		"tuitionAnnualUsd": 38000,
		"scholarshipAvailable": true,
		"ieltsMinimum": 7.0,
		"toeflMinimum": 92,
		"nextDeadline": "2025-03-31",
		"nextIntake": "Fall 2025",
		"fitScore": 72,
		"fitCategory": "target",
		"fitReasons": [
			"Your GPA (3.6) exceeds minimum (3.3)",
			"IELTS meets requirement"
		],
		"fitGaps": ["Budget slightly above your range"],
		"isSaved": true
	},
	{
		"id": "5",
		"universityId": "nus",
		"universityName": "National University of Singapore",
		"universityCountry": "Singapore",
		"universityCity": "Singapore",
		"universityLogoUrl": "/universities/nus.png",
		"rankingQsDisplay": "#8",
		"programName": "Master of Computing",
		"degreeType": "Master",
		"degreeName": "MComp",
		"majorCategories": ["Computer Science", "Software Engineering"],
		"durationMonths": 18,
		"deliveryMode": "On Campus",
		"tuitionAnnualUsd": 32000,
		"scholarshipAvailable": true,
		"ieltsMinimum": 6.5,
		"toeflMinimum": 85,
		"nextDeadline": "2025-05-31",
		"nextIntake": "Fall 2025",
		"fitScore": 87,
		"fitCategory": "safety",
		"fitReasons": [
			"Your profile exceeds requirements",
			"Strong fit in Computer Science"
		],
		"fitGaps": [],
		"isSaved": false
	},
	{
		"id": "6",
		"universityId": "ubc",
		"universityName": "University of British Columbia",
		"universityCountry": "Canada",
		"universityCity": "Vancouver, BC",
		"universityLogoUrl": "/universities/ubc.png",
		"rankingQsDisplay": "#34",
		"programName": "Master of Data Science",
		"degreeType": "Master",
		"degreeName": "MDS",
		"majorCategories": ["Data Science", "Statistics"],
		"durationMonths": 10,
		"deliveryMode": "On Campus",
		"tuitionAnnualUsd": 28000,
		"scholarshipAvailable": true,
		"ieltsMinimum": 6.5,
		"toeflMinimum": 90,
		"nextDeadline": "2025-04-15",
		"nextIntake": "Fall 2025",
		"fitScore": 91,
		"fitCategory": "safety",
		"fitReasons": [
			"Excellent academic fit",
			"Within your budget",
			"IELTS exceeds minimum"
		],
		"fitGaps": [],
		"isSaved": false
	}
]
````

## File: components/marketing/Footer.tsx
````typescript
"use client";

import { Facebook, Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const socialLinks = [
	{ icon: Facebook, href: "#", label: "Facebook" },
	{ icon: Twitter, href: "#", label: "Twitter" },
	{ icon: Instagram, href: "#", label: "Instagram" },
	{ icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
	const t = useTranslations("footer");

	const footerLinks = {
		[t("categories.product")]: [
			{ label: t("links.exploreUniversities"), href: "/explore" },
			{ label: t("links.personaLab"), href: "/persona-lab" },
			{ label: t("links.aiAssistant"), href: "/chatbot" },
			{ label: t("links.dashboard"), href: "/dashboard" },
		],
		[t("categories.resources")]: [
			{ label: t("links.applicationGuide"), href: "/dashboard/resources" },
			{ label: t("links.scholarships"), href: "/dashboard/resources" },
			{ label: t("links.faqs"), href: "#" },
		],
		[t("categories.company")]: [
			{ label: t("links.aboutUs"), href: "/about" },
			{ label: t("links.contact"), href: "/about#contact" },
			{ label: t("links.privacyPolicy"), href: "/privacy" },
			{ label: t("links.termsOfService"), href: "/tos" },
		],
	};

	return (
		<footer className="bg-foreground text-background mt-auto">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
					{}
					<div className="lg:col-span-2">
						<Image
							src="/Logo.png"
							alt="Leaply"
							width={120}
							height={40}
							className="h-8 w-auto mb-4 brightness-0 invert"
						/>
						<p className="text-sm text-gray-300 mb-4">{t("description")}</p>
						<div className="flex items-center gap-4">
							{socialLinks.map((social) => {
								const Icon = social.icon;
								return (
									<a
										key={social.label}
										href={social.href}
										aria-label={social.label}
										className="text-gray-400 hover:text-primary transition-colors"
									>
										<Icon className="w-5 h-5" />
									</a>
								);
							})}
						</div>
					</div>

					{}
					{Object.entries(footerLinks).map(([category, links]) => (
						<div key={category}>
							<h3 className="font-semibold text-background mb-4">{category}</h3>
							<ul className="space-y-2">
								{links.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											className="text-sm text-gray-300 hover:text-primary transition-colors"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{}
				<div className="pt-8 border-t border-gray-700">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						<p className="text-sm text-gray-400">
							{t("copyright", { year: new Date().getFullYear() })}
						</p>
						<div className="flex items-center gap-2 text-sm text-gray-400">
							<Mail className="w-4 h-4" />
							<a
								href="mailto:support@leaply.ai.vn"
								className="hover:text-primary transition-colors"
							>
								support@leaply.ai.vn
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
````

## File: components/onboarding/steps/Step4JourneySelection.tsx
````typescript
"use client";

import { ArrowRight, Compass, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { JourneyType } from "@/lib/store/userStore";
import { StepContainer } from "../components/StepContainer";
import type { OnboardingConstants, OnboardingTranslations } from "../types";

interface Step4JourneySelectionProps {
	translations: OnboardingTranslations;
	constants: OnboardingConstants;
	onJourneySelect: (type: JourneyType) => void;
	onBack: () => void;
}

const COLOR_MAP = {
	primary: {
		bg: "bg-primary/10",
		text: "text-primary",
	},
	"chart-2": {
		bg: "bg-chart-2/10",
		text: "text-chart-2",
	},
} as const;

export function Step4JourneySelection({
	translations,
	constants,
	onJourneySelect,
	onBack,
}: Step4JourneySelectionProps) {
	return (
		<StepContainer
			stepKey="step3"
			title={translations.step3.title}
			subtitle={translations.step3.subtitle}
			variant="plain"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
				{constants.journeyOptions.map((option) => {
					const Icon = option.iconName === "compass" ? Compass : Target;
					const colors =
						COLOR_MAP[option.color as keyof typeof COLOR_MAP] ||
						COLOR_MAP.primary;

					return (
						<Card
							key={option.id}
							onClick={() => onJourneySelect(option.id)}
							className="cursor-pointer hover:border-primary hover:shadow-md transition-all duration-300 group relative overflow-hidden h-full"
						>
							<div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							<CardContent className="p-8 flex flex-col items-center text-center h-full justify-center space-y-4">
								<div
									className={`w-16 h-16 rounded-full ${colors.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}
								>
									<Icon className={`w-8 h-8 ${colors.text}`} />
								</div>
								<h3 className="text-xl font-bold">{option.title}</h3>
								<p className="text-muted-foreground">{option.description}</p>
								<div className="pt-4 opacity-0 text-primary font-medium group-hover:opacity-100 transition-all flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0">
									{translations.step3.startNow}{" "}
									<ArrowRight className="w-4 h-4" />
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<div className="pt-6 flex justify-start border-t border-border mt-6">
				<Button variant="outline" size="lg" onClick={onBack} className="px-8">
					{translations.buttons.back}
				</Button>
			</div>
		</StepContainer>
	);
}
````

## File: components/onboarding/types.ts
````typescript
export interface OnboardingTranslations {
	steps: string[];
	step1: {
		title: string;
		subtitle: string;
		educationLevel: string;
		educationLevelRequired: string;
		targetDegree: string;
		targetDegreeRequired: string;
	};
	step2: {
		title: string;
		subtitle: string;
		fieldsOfInterest: string;
		fieldsOfInterestMax: string;
		fieldsRequired: string;
		regionsOfInterest: string;
		regionsOptional: string;
	};
	step2b: {
		title: string;
		subtitle: string;
		timeline: string;
		timelineRequired: string;
		selectYear: string;
		selectYearPlaceholder: string;
		selectTerm: string;
		selectTermPlaceholder: string;
		budget: string;
		budgetRequired: string;
	};
	step3: {
		title: string;
		subtitle: string;
		startNow: string;
	};
	step4: {
		title: string;
		subtitle: string;
		ctaExploring: string;
		ctaTargeted: string;
	};
	buttons: {
		back: string;
		continue: string;
	};
}

export interface OnboardingConstants {
	educationLevels: Array<{ value: string; label: string }>;
	programTypes: Array<{ value: string; label: string; disabled?: boolean }>;
	fieldsOfStudy: string[];
	regions: Array<{ name: string; countries: string }>;
	startYears: string[];
	startTerms: string[];
	budgetOptions: Array<{ value: number; label: string }>;
	journeyOptions: Array<{
		id: "exploring" | "targeted";
		iconName: "compass" | "target";
		title: string;
		description: string;
		redirect: string;
		color: string;
	}>;
}

export interface BasicInfo {
	educationLevel: string;
	targetDegree: string;
}

export interface Preferences {
	fields: string[];
	regions: string[];
	startYear: string;
	startTerm: string;
	budgetIndex: number;
}

export interface StepProps {
	translations: OnboardingTranslations;
	constants: OnboardingConstants;
	onNext: () => void;
	onBack: () => void;
}

export interface StepContainerProps {
	stepKey: string;
	title: string;
	subtitle: string;
	children: React.ReactNode;
	variant?: "card" | "plain";
}

export interface StepNavigationProps {
	backLabel: string;
	continueLabel: string;
	onBack: () => void;
	onNext: () => void;
	isBackDisabled?: boolean;
	isNextDisabled?: boolean;
	showContinue?: boolean;
}
````

## File: components/providers/Providers.tsx
````typescript
"use client";

import { QueryProvider } from "@/app/providers/query-provider";
import { AuthProvider } from "./AuthProvider";

interface ProvidersProps {
	children: React.ReactNode;
}





export function Providers({ children }: ProvidersProps) {
	return (
		<QueryProvider>
			<AuthProvider>{children}</AuthProvider>
		</QueryProvider>
	);
}
````

## File: components/ui/dialog.tsx
````typescript
"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Dialog({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			data-slot="dialog-overlay"
			className={cn(
				"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
				className,
			)}
			{...props}
		/>
	);
}

function DialogContent({
	className,
	children,
	showCloseButton = true,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
	showCloseButton?: boolean;
}) {
	return (
		<DialogPortal data-slot="dialog-portal">
			<DialogOverlay />
			<DialogPrimitive.Content
				data-slot="dialog-content"
				className={cn(
					"bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg",
					className,
				)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<DialogPrimitive.Close
						data-slot="dialog-close"
						className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
					>
						<XIcon />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				)}
			</DialogPrimitive.Content>
		</DialogPortal>
	);
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-header"
			className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
			{...props}
		/>
	);
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className,
			)}
			{...props}
		/>
	);
}

function DialogTitle({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn("text-lg leading-none font-semibold", className)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
````

## File: components/ui/select.tsx
````typescript
"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ref}
		className={cn(
			"flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
			className,
		)}
		{...props}
	>
		{children}
		<SelectPrimitive.Icon asChild>
			<ChevronDown className="h-4 w-4 opacity-50" />
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollUpButton
		ref={ref}
		className={cn(
			"flex cursor-default items-center justify-center py-1",
			className,
		)}
		{...props}
	>
		<ChevronUp className="h-4 w-4" />
	</SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollDownButton
		ref={ref}
		className={cn(
			"flex cursor-default items-center justify-center py-1",
			className,
		)}
		{...props}
	>
		<ChevronDown className="h-4 w-4" />
	</SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
	SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			ref={ref}
			className={cn(
				"relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
				position === "popper" &&
					"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
				className,
			)}
			position={position}
			{...props}
		>
			<SelectScrollUpButton />
			<SelectPrimitive.Viewport
				className={cn(
					"p-1",
					position === "popper" &&
						"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
				)}
			>
				{children}
			</SelectPrimitive.Viewport>
			<SelectScrollDownButton />
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Label
		ref={ref}
		className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
		{...props}
	/>
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className,
		)}
		{...props}
	>
		<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			<SelectPrimitive.ItemIndicator>
				<Check className="h-4 w-4" />
			</SelectPrimitive.ItemIndicator>
		</span>

		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Separator
		ref={ref}
		className={cn("-mx-1 my-1 h-px bg-muted", className)}
		{...props}
	/>
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectLabel,
	SelectItem,
	SelectSeparator,
	SelectScrollUpButton,
	SelectScrollDownButton,
};
````

## File: components/ui/sheet.tsx
````typescript
"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
	return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
	...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
	return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
	...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
	return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
	...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
	return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
	return (
		<SheetPrimitive.Overlay
			data-slot="sheet-overlay"
			className={cn(
				"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
				className,
			)}
			{...props}
		/>
	);
}

function SheetContent({
	className,
	children,
	side = "right",
	...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
	side?: "top" | "right" | "bottom" | "left";
}) {
	return (
		<SheetPortal>
			<SheetOverlay />
			<SheetPrimitive.Content
				data-slot="sheet-content"
				className={cn(
					"bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
					side === "right" &&
						"data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
					side === "left" &&
						"data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
					side === "top" &&
						"data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
					side === "bottom" &&
						"data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
					className,
				)}
				{...props}
			>
				{children}
				<SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
					<XIcon className="size-4" />
					<span className="sr-only">Close</span>
				</SheetPrimitive.Close>
			</SheetPrimitive.Content>
		</SheetPortal>
	);
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="sheet-header"
			className={cn("flex flex-col gap-1.5 p-4", className)}
			{...props}
		/>
	);
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="sheet-footer"
			className={cn("mt-auto flex flex-col gap-2 p-4", className)}
			{...props}
		/>
	);
}

function SheetTitle({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
	return (
		<SheetPrimitive.Title
			data-slot="sheet-title"
			className={cn("text-foreground font-semibold", className)}
			{...props}
		/>
	);
}

function SheetDescription({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
	return (
		<SheetPrimitive.Description
			data-slot="sheet-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

export {
	Sheet,
	SheetTrigger,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetFooter,
	SheetTitle,
	SheetDescription,
};
````

## File: lib/api/homeApi.ts
````typescript
import { generateHomeResponse } from "@/lib/mock";
import { apiClient } from "./client";
import type { HomeResponse } from "./types";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";





const MOCK_HOME_RESPONSE: HomeResponse = generateHomeResponse();








export async function getHomeData(): Promise<HomeResponse> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return MOCK_HOME_RESPONSE;
	}

	return apiClient.get<HomeResponse>("/v1/home");
}
````

## File: lib/constants/tracks.ts
````typescript
import type { Track, TrackId, TrackStatus } from "@/lib/types/persona";

export interface TrackDefinition {
	id: TrackId;
	displayName: string;
	description: string;
	icon: string;
	order: number;
}

export const TRACKS: Record<TrackId, TrackDefinition> = {
	future_vision: {
		id: "future_vision",
		displayName: "Future Vision",
		description: "Khám phá mục tiêu và động lực",
		icon: "target",
		order: 1,
	},
	academic_journey: {
		id: "academic_journey",
		displayName: "Academic Journey",
		description: "Hành trình học thuật của bạn",
		icon: "book-open",
		order: 2,
	},
	activities_impact: {
		id: "activities_impact",
		displayName: "Activities & Impact",
		description: "Hoạt động và ảnh hưởng",
		icon: "sparkles",
		order: 3,
	},
	values_turning_points: {
		id: "values_turning_points",
		displayName: "Values & Turning Points",
		description: "Giá trị và bước ngoặt",
		icon: "gem",
		order: 4,
	},
} as const;


export const TRACK_EMOJIS: Record<TrackId, string> = {
	future_vision: "🎯",
	academic_journey: "📚",
	activities_impact: "🌟",
	values_turning_points: "💎",
};


export function getTrack(trackId: TrackId): TrackDefinition {
	return TRACKS[trackId];
}


export const TRACK_IDS: TrackId[] = (Object.values(TRACKS) as TrackDefinition[])
	.sort((a, b) => a.order - b.order)
	.map((t) => t.id);


export function createInitialTrack(trackId: TrackId): Track {
	const def = TRACKS[trackId];
	return {
		id: trackId,
		displayName: def.displayName,
		description: def.description,
		icon: def.icon,
		status: "not_started" as TrackStatus,
		completedAt: null,
		coreQuestionIndex: 0,
		followUpIndex: 0,
	};
}



export function calculateTrackProgress(track: Track): number {
	if (track.status === "completed") return 100;
	if (track.status === "not_started") return 0;


	const totalSteps = 4 * 3;
	const completedSteps = track.coreQuestionIndex * 3 + track.followUpIndex;

	return Math.round((completedSteps / totalSteps) * 100);
}


export function calculateOverallProgress(
	tracks: Record<TrackId, Track>,
): number {
	const trackList = Object.values(tracks);
	if (trackList.length === 0) return 0;
	const totalProgress = trackList.reduce(
		(sum, track) => sum + calculateTrackProgress(track),
		0,
	);
	return Math.round(totalProgress / trackList.length);
}


export function getQuestionProgress(track: Track): {
	current: number;
	total: number;
} {
	if (track.status === "completed") return { current: 4, total: 4 };
	if (track.status === "not_started") return { current: 0, total: 4 };


	const current =
		track.followUpIndex > 0
			? track.coreQuestionIndex + 1
			: track.coreQuestionIndex;
	return { current, total: 4 };
}


export function createInitialTracks(): Record<TrackId, Track> {
	return {
		future_vision: createInitialTrack("future_vision"),
		academic_journey: createInitialTrack("academic_journey"),
		activities_impact: createInitialTrack("activities_impact"),
		values_turning_points: createInitialTrack("values_turning_points"),
	};
}


export const TRACK_COLORS: Record<
	TrackId,
	{
		primary: string;
		light: string;
		muted: string;
		bgClass: string;
		textClass: string;
		borderClass: string;
		hoverClass: string;
	}
> = {
	future_vision: {
		primary: "#8B5CF6",
		light: "rgba(139, 92, 246, 0.1)",
		muted: "#C4B5FD",
		bgClass: "bg-violet-500/10",
		textClass: "text-violet-600",
		borderClass: "border-violet-300",
		hoverClass: "hover:bg-violet-500/20",
	},
	academic_journey: {
		primary: "#3B82F6",
		light: "rgba(59, 130, 246, 0.1)",
		muted: "#93C5FD",
		bgClass: "bg-blue-500/10",
		textClass: "text-blue-600",
		borderClass: "border-blue-300",
		hoverClass: "hover:bg-blue-500/20",
	},
	activities_impact: {
		primary: "#F59E0B",
		light: "rgba(245, 158, 11, 0.1)",
		muted: "#FCD34D",
		bgClass: "bg-amber-500/10",
		textClass: "text-amber-600",
		borderClass: "border-amber-300",
		hoverClass: "hover:bg-amber-500/20",
	},
	values_turning_points: {
		primary: "#F43F5E",
		light: "rgba(244, 63, 94, 0.1)",
		muted: "#FDA4AF",
		bgClass: "bg-rose-500/10",
		textClass: "text-rose-600",
		borderClass: "border-rose-300",
		hoverClass: "hover:bg-rose-500/20",
	},
};


export const NODE_TYPE_COLORS = {
	story: {
		primary: "#10B981",
		bgClass: "bg-emerald-500/10",
		textClass: "text-emerald-600",
		borderClass: "border-emerald-300",
	},
	evidence: {
		primary: "#78716C",
		bgClass: "bg-stone-500/10",
		textClass: "text-stone-600",
		borderClass: "border-stone-300",
	},
	insight: {
		primary: "#F59E0B",
		bgClass: "bg-amber-500/10",
		textClass: "text-amber-600",
		borderClass: "border-amber-300",
	},
	archetype: {
		primary: "#16A34A",
		bgClass: "bg-primary/10",
		textClass: "text-primary",
		borderClass: "border-primary/30",
	},
};


export const LAYER_STYLES = {
	story: { label: "Stories", icon: "file-text" },
	evidence: { label: "Evidence", icon: "list" },
	insight: { label: "Insights", icon: "lightbulb" },
	archetype: { label: "Archetype", icon: "target" },
};
````

## File: lib/hooks/usePrograms.ts
````typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { exploreApi } from "@/lib/api/exploreApi";
import type {
	ProgramListItemResponse,
	ProgramListParams,
	ProgramListResponse,
} from "@/lib/api/types";







export function usePrograms(
	filters: ProgramListParams,
	initialData?: ProgramListResponse,
) {
	return useQuery({
		queryKey: ["programs", filters],
		queryFn: () => exploreApi.getPrograms(filters),
		initialData:
			filters.search === "" || !filters.search ? initialData : undefined,
		staleTime: 2 * 60 * 1000, // 2 minutes - consider data fresh
	});
}

/**
 * React Query mutation hook for saving/unsaving programs
 * Includes optimistic updates and automatic rollback on error
 * @returns Mutation function and state
 */
export function useSaveProgram() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, isSaved }: { id: string; isSaved: boolean }) =>
			isSaved ? exploreApi.unsaveProgram(id) : exploreApi.saveProgram(id),
		onMutate: async ({ id, isSaved }) => {
			// Cancel outgoing refetches to prevent race conditions
			await queryClient.cancelQueries({ queryKey: ["programs"] });


			const previousPrograms = queryClient.getQueryData(["programs"]);


			queryClient.setQueriesData<ProgramListResponse>(
				{ queryKey: ["programs"] },
				(old) => {
					if (!old) return old;

					return {
						...old,
						data: old.data.map((program: ProgramListItemResponse) =>
							program.id === id ? { ...program, isSaved: !isSaved } : program,
						),
					};
				},
			);

			return { previousPrograms };
		},
		onError: (err, _variables, context) => {

			if (context?.previousPrograms) {
				queryClient.setQueryData(["programs"], context.previousPrograms);
			}
			console.error("Failed to update save status:", err);
		},
		onSettled: () => {

			queryClient.invalidateQueries({ queryKey: ["programs"] });
		},
	});
}
````

## File: lib/mock/manualModeData.ts
````typescript
import type {
	FilterOptionsResponse,
	ProgramListItemResponse,
} from "@/lib/api/types";
import {
	generateFilterOptionsResponse,
	generateMany,
	generateProgramListItemResponse,
} from "./fakerGenerators";







export const MANUAL_MODE_PROGRAMS: ProgramListItemResponse[] = generateMany(
	generateProgramListItemResponse,
	400,
);





export const FILTER_OPTIONS: FilterOptionsResponse =
	generateFilterOptionsResponse();
````

## File: lib/types/persona-canvas.ts
````typescript
export type StoryType =
	| "achievement"
	| "challenge"
	| "turning_point"
	| "insight"
	| "relationship"
	| "failure"
	| "growth";

export type IdentityFacet =
	| "technical"
	| "leadership"
	| "creative"
	| "analytical"
	| "collaborative"
	| "entrepreneurial"
	| "resilient"
	| "curious";

export type ValueSignal =
	| "efficiency"
	| "impact"
	| "autonomy"
	| "innovation"
	| "pragmatism"
	| "quality"
	| "sustainability"
	| "accessibility";

export type SkillCategory =
	| "technical_depth"
	| "system_design"
	| "problem_solving"
	| "communication"
	| "strategic_thinking"
	| "execution"
	| "learning_agility";

export type NarrativeType =
	| "hero_journey"
	| "overcoming_obstacle"
	| "discovery"
	| "transformation"
	| "collaboration"
	| "innovation";

export type EmotionalWeight = "low" | "medium" | "high" | "critical";

export type EssayPotential =
	| "personal_statement"
	| "diversity_statement"
	| "purpose_statement"
	| "research_statement";

export interface StructuredExtract {
	context: string;
	conflict: string;
	action: string;
	outcome: string;
	learning: string;
	emotion: string;
}

export interface StoryTags {
	identity_facets: IdentityFacet[];
	value_signals: ValueSignal[];
	skill_evidence: SkillCategory[];
	narrative_type: NarrativeType;
	emotional_weight: EmotionalWeight;
	temporal: string;
	essay_potential: EssayPotential[];
}

export interface StoryFragment {
	id: string;
	title: string;
	description: string;
	track:
		| "future_vision"
		| "academic_journey"
		| "activities_impact"
		| "values_turning_points";
	story_type: StoryType;
	raw_text: string;
	structured_extract: StructuredExtract;
	tags: StoryTags;
	connections: {
		patterns: string[];
		archetype: string;
		values: string[];
		skills: string[];
	};
	created_at: string;
}





export type PatternStatus = "emerging" | "validated" | "strong" | "unique";

export interface EssayAngle {
	name: string;
	frame: string;
	narrative_arc: string[];
	fit: EssayPotential[];
	strength: number;
	uniqueness: number;
}

export interface PatternCluster {
	id: string;
	cluster_name: string;
	member_stories: string[];
	shared_tags: {
		identity_facets: IdentityFacet[];
		value_signals: ValueSignal[];
		skill_evidence: SkillCategory[];
	};
	pattern_description: string;
	behavioral_signature: string[];
	essay_angles: EssayAngle[];
	status: PatternStatus;
}





export type ArchetypeType =
	| "architect"
	| "explorer"
	| "builder"
	| "connector"
	| "rebel"
	| "sage"
	| "guardian"
	| "maverick";

export interface TraitVector {
	[key: string]: number;
}

export interface Archetype {
	id: string;
	primary_type: ArchetypeType;
	secondary_traits: ArchetypeType[];
	trait_vector: TraitVector;
	evolution_direction: string;
	evidence_from: string[];
}





export interface ValueTension {
	id: string;
	pole_a: ValueSignal;
	pole_b: ValueSignal;
	evidence: {
		story_a: string;
		story_b: string;
	};
	resolution: string | null;
}

export interface ValueSystem {
	id: string;
	stated_values: ValueSignal[];
	revealed_values: ValueSignal[];
	value_hierarchy: ValueSignal[];
	tensions: ValueTension[];
	evidence: {
		[key in ValueSignal]?: string[];
	};
}





export type ProficiencyLevel =
	| "beginner"
	| "intermediate"
	| "advanced"
	| "expert";

export type GrowthTrajectory =
	| "plateauing"
	| "steady"
	| "accelerating"
	| "breakthrough";

export type PassionLevel =
	| "instrumental"
	| "interested"
	| "passionate"
	| "obsessed";

export interface SkillEvidence {
	id: string;
	skill_name: string;
	category: SkillCategory;
	proficiency: ProficiencyLevel;
	evidence: string[];
	growth_trajectory: GrowthTrajectory;
	passion_level: PassionLevel;
	essay_value: number;
}






export type LegacyNodeType =
	| "story"
	| "pattern"
	| "archetype"
	| "value"
	| "skill";


export type ApiNodeType =
	| "profile_summary"
	| "essay_angle"
	| "key_story"
	| "detail";


export type NodeType = LegacyNodeType | ApiNodeType;

export interface GraphEdge {
	from: string;
	to: string;
	type: "member_of" | "evidences" | "supports" | "conflicts" | "demonstrates";
	strength?: number;
}

export interface GraphMetadata {
	tracks_completed: {
		future_vision: number;
		academic_journey: number;
		activities_impact: number;
		values_turning_points: number;
	};
	completeness_score: number;
	essay_readiness: {
		personal_statement: "not_ready" | "partial" | "ready";
		diversity_statement: "not_ready" | "partial" | "ready";
		purpose_statement: "not_ready" | "partial" | "ready";
	};
	missing_critical: string[];
}

export interface PersonaGraph {
	archetype: Archetype;
	stories: StoryFragment[];
	patterns: PatternCluster[];
	values: ValueSystem;
	skills: SkillEvidence[];
	edges: GraphEdge[];
	metadata: GraphMetadata;
}






export type LegacyGraphData =
	| StoryFragment
	| PatternCluster
	| Archetype
	| ValueSystem
	| SkillEvidence;



export type GraphNodeData = LegacyGraphData | Record<string, any>;

export interface ForceGraphNode {
	id: string;
	type: NodeType;
	label: string;
	size: number;
	color: string;
	data: GraphNodeData;
}

export interface ForceGraphLink {
	source: string;
	target: string;
	type: string;
	strength: number;
	color: string;
}
````

## File: lib/types/persona-graph.ts
````typescript
import type { ArchetypeType, TrackId } from "./persona";





export type GraphNodeType =
	| "profile_summary"
	| "essay_angle"
	| "key_story"
	| "detail";

export type LayerNumber = 0 | 1 | 2 | 3;










export interface PersonaNodeDto {
	id: string;
	type: GraphNodeType;
	layer: LayerNumber;
	title: string;
	description: string;
	tags: string[];


	primaryArchetype?: ArchetypeType;
	secondaryArchetype?: ArchetypeType | null;
	archetypeSummary?: string;


	sourceTrackId: TrackId | null;
	sourceQuestionId: string | null;
	confidence: number;

	createdAt: string;
}













export interface PersonaEdgeDto {
	id: string;
	source: string;
	target: string;
	strength: number;
	createdAt: string;
}





export interface GraphMeta {
	nodeCountByLayer: Record<number, number>;
	topTags: string[];
	hasProfileSummary: boolean;
	totalNodes: number;
	totalEdges: number;
}





export interface PersonaGraphResponse {
	nodes: PersonaNodeDto[];
	edges: PersonaEdgeDto[];
	meta: GraphMeta;
}





export interface GraphSelectionState {
	selectedNodeId: string | null;
	hoveredNodeId: string | null;
	highlightedEdgeIds: string[];
	revealedDetailIds: string[];
	showAllDetails: boolean;
}





export interface LayerConfig {
	radius: number;
	nodeSize: number;
	color: string;
	opacity: number;
}

export const LAYER_CONFIGS: Record<LayerNumber, LayerConfig> = {
	0: { radius: 0, nodeSize: 150, color: "#6366F1", opacity: 1.0 },
	1: { radius: 180, nodeSize: 100, color: "#8B5CF6", opacity: 1.0 },
	2: { radius: 320, nodeSize: 70, color: "#10B981", opacity: 0.9 },
	3: { radius: 460, nodeSize: 40, color: "#94A3B8", opacity: 0.7 },
};





export interface GraphNodeData extends PersonaNodeDto {

	isSelected: boolean;
	isHovered: boolean;
	isHighlighted: boolean;
	isVisible: boolean;
	zoom: number;
	childCount?: number;

	[key: string]: unknown;
}





export interface GraphCanvasAction {
	action:
		| "add_node"
		| "remove_node"
		| "add_edge"
		| "remove_edge"
		| "update_profile";
	node?: PersonaNodeDto;
	edge?: PersonaEdgeDto;
	nodeId?: string;
	edgeId?: string;
	profileUpdate?: {
		primaryArchetype: ArchetypeType;
		secondaryArchetype?: ArchetypeType | null;
		archetypeSummary: string;
	};
}
````

## File: .env.example
````
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Feature Flags
# Set to "true" to use mock data instead of real API calls
NEXT_PUBLIC_USE_MOCK_DATA=false
````

## File: biome.json
````json
{
	"$schema": "https://biomejs.dev/schemas/2.3.10/schema.json",
	"vcs": {
		"enabled": true,
		"clientKind": "git",
		"useIgnoreFile": true
	},
	"files": {
		"ignoreUnknown": false
	},
	"formatter": {
		"enabled": true,
		"indentStyle": "tab"
	},
	"linter": {
		"enabled": true,
		"rules": {
			"recommended": true,
			"suspicious": {
				"noArrayIndexKey": "warn"
			},
			"a11y": {
				"useSemanticElements": "warn"
			}
		}
	},
	"javascript": {
		"formatter": {
			"quoteStyle": "double"
		}
	},
	"assist": {
		"enabled": true,
		"actions": {
			"source": {
				"organizeImports": "on"
			}
		}
	},
	"css": {
		"parser": {
			"tailwindDirectives": true
		}
	}
}
````

## File: knip.json
````json
{
	"$schema": "https://unpkg.com/knip@5/schema.json",
	"ignoreExportsUsedInFile": {
		"interface": true,
		"type": true
	},
	"tags": ["-lintignore"]
}
````

## File: proxy.ts
````typescript
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";


const PROTECTED_ROUTES = ["/dashboard", "/explore", "/persona-lab"];


const AUTH_ROUTES = ["/login", "/register"];


const ONBOARDING_ROUTES = ["/onboarding"];

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;


	const isProtectedRoute = PROTECTED_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);


	const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);


	const isOnboardingRoute = ONBOARDING_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);


	if (!isProtectedRoute && !isAuthRoute && !isOnboardingRoute) {
		return NextResponse.next();
	}


	const authStateCookie = request.cookies.get("leaply-auth-state")?.value;
	let isAuthenticated = false;
	let isOnboardingComplete = false;

	if (authStateCookie) {
		try {
			const authState = JSON.parse(authStateCookie);
			isAuthenticated = authState.isAuthenticated;
			isOnboardingComplete = authState.isOnboardingComplete;
		} catch {

		}
	}


	if (isAuthRoute) {
		if (isAuthenticated) {
			const redirectPath = isOnboardingComplete ? "/dashboard" : "/onboarding";
			return NextResponse.redirect(new URL(redirectPath, request.url));
		}
		return NextResponse.next();
	}


	if (isOnboardingRoute) {
		if (!isAuthenticated) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
		if (isOnboardingComplete) {

			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
		return NextResponse.next();
	}


	if (isProtectedRoute) {
		if (!isAuthenticated) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
		if (!isOnboardingComplete) {
			return NextResponse.redirect(new URL("/onboarding", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [

		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
	],
};
````

## File: app/(app)/dashboard/applications/[id]/tasks/page.tsx
````typescript
"use client";

import { ArrowLeft, CheckSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageContainer } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TasksPage() {
	const t = useTranslations("tasks");
	const router = useRouter();

	return (
		<PageTransition>
			<PageContainer>
				<Button variant="ghost" onClick={() => router.back()} className="mb-6">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back
				</Button>

				<Card>
					<CardContent className="flex flex-col items-center justify-center py-16">
						<CheckSquare className="w-16 h-16 text-muted-foreground mb-4" />
						<h1 className="text-2xl font-bold text-foreground mb-2">
							{t("title")}
						</h1>
						<p className="text-muted-foreground text-center max-w-md">
							Task management feature is coming soon. You&apos;ll be able to
							track all your application tasks and deadlines here.
						</p>
					</CardContent>
				</Card>
			</PageContainer>
		</PageTransition>
	);
}
````

## File: app/(app)/dashboard/applications/[id]/page.tsx
````typescript
"use client";

import {
	AlertCircle,
	ArrowLeft,
	Calendar,
	FileText,
	Target,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageContainer } from "@/components/Layout";
import { PageTransition, SlideUp } from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useApplicationsStore } from "@/lib/store/applicationsStore";
import { cn } from "@/lib/utils";

const statusConfig: Record<
	string,
	{
		label: string;
		variant: "default" | "secondary" | "outline" | "destructive";
	}
> = {
	planning: { label: "Planning", variant: "secondary" },
	writing: { label: "Writing", variant: "outline" },
	submitted: { label: "Submitted", variant: "default" },
	accepted: { label: "Accepted", variant: "default" },
	rejected: { label: "Rejected", variant: "destructive" },
};

const gapSeverityConfig: Record<string, { color: string }> = {
	critical: { color: "text-red-600 bg-red-50 border-red-200" },
	warning: { color: "text-amber-600 bg-amber-50 border-amber-200" },
	info: { color: "text-blue-600 bg-blue-50 border-blue-200" },
};

export default function ApplicationDetailPage() {
	const params = useParams();
	const router = useRouter();
	const { applications, fetchApplications, isLoading } = useApplicationsStore();

	useEffect(() => {
		if (applications.length === 0) {
			fetchApplications();
		}
	}, [applications.length, fetchApplications]);

	const application = applications.find((app) => app.id === params.id);

	if (isLoading) {
		return (
			<PageContainer>
				<div className="text-center py-16">
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</PageContainer>
		);
	}

	if (!application) {
		return (
			<PageContainer>
				<div className="text-center py-16">
					<h1 className="text-2xl font-bold text-foreground mb-2">
						Application not found
					</h1>
					<Button onClick={() => router.push("/dashboard/applications")}>
						Back to Applications
					</Button>
				</div>
			</PageContainer>
		);
	}

	const config = statusConfig[application.status] || statusConfig.planning;


	const getDaysUntilDeadline = () => {
		if (!application.program.nextDeadline) return null;
		const deadline = new Date(application.program.nextDeadline);
		const now = new Date();
		const diff = deadline.getTime() - now.getTime();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	};

	const daysUntilDeadline = getDaysUntilDeadline();

	return (
		<PageTransition>
			<PageContainer>
				<Button variant="ghost" onClick={() => router.back()} className="mb-6">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Applications
				</Button>

				{}
				<SlideUp>
					<Card className="mb-8">
						<CardHeader>
							<div className="flex items-start justify-between">
								<div>
									<CardTitle className="text-2xl mb-2">
										{application.program.universityName}
									</CardTitle>
									<p className="text-lg text-muted-foreground">
										{application.program.programName}
									</p>
									{application.program.degreeName && (
										<p className="text-sm text-muted-foreground">
											{application.program.degreeName}
										</p>
									)}
								</div>
								<Badge variant={config.variant} className="text-sm">
									{config.label}
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
								{}
								<div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
									<div className="flex items-center gap-2 mb-1">
										<Target className="w-4 h-4 text-primary" />
										<span className="text-xs font-medium text-muted-foreground">
											Fit Score
										</span>
									</div>
									<p className="text-2xl font-bold text-primary">
										{application.fitScore || "—"}%
									</p>
									{application.fitCategory && (
										<Badge
											variant="outline"
											className={cn(
												"mt-1 text-xs capitalize",
												application.fitCategory === "safety" &&
													"border-green-500",
												application.fitCategory === "target" &&
													"border-blue-500",
												application.fitCategory === "reach" &&
													"border-amber-500",
											)}
										>
											{application.fitCategory}
										</Badge>
									)}
								</div>

								{}
								<div className="p-4 bg-muted/50 rounded-lg">
									<div className="flex items-center gap-2 mb-1">
										<FileText className="w-4 h-4 text-muted-foreground" />
										<span className="text-xs font-medium text-muted-foreground">
											SOP Status
										</span>
									</div>
									<p className="text-lg font-semibold text-foreground capitalize">
										{application.sopStatus?.replace("_", " ") || "Not Started"}
									</p>
								</div>

								{}
								<div
									className={cn(
										"p-4 rounded-lg",
										daysUntilDeadline !== null && daysUntilDeadline <= 7
											? "bg-red-50 border border-red-200"
											: "bg-muted/50",
									)}
								>
									<div className="flex items-center gap-2 mb-1">
										<Calendar className="w-4 h-4 text-muted-foreground" />
										<span className="text-xs font-medium text-muted-foreground">
											Next Deadline
										</span>
									</div>
									{application.program.nextDeadline ? (
										<>
											<p className="text-sm font-semibold text-foreground">
												{new Date(
													application.program.nextDeadline,
												).toLocaleDateString()}
											</p>
											{daysUntilDeadline !== null && (
												<p
													className={cn(
														"text-xs font-medium",
														daysUntilDeadline <= 7
															? "text-red-600"
															: daysUntilDeadline <= 30
																? "text-amber-600"
																: "text-muted-foreground",
													)}
												>
													{daysUntilDeadline} days remaining
												</p>
											)}
										</>
									) : (
										<p className="text-sm text-muted-foreground">No deadline</p>
									)}
								</div>

								{}
								<div className="p-4 bg-muted/50 rounded-lg">
									<div className="flex items-center gap-2 mb-1">
										<Calendar className="w-4 h-4 text-muted-foreground" />
										<span className="text-xs font-medium text-muted-foreground">
											Next Intake
										</span>
									</div>
									<p className="text-lg font-semibold text-foreground">
										{application.program.nextIntake || "—"}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</SlideUp>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{}
					<div className="lg:col-span-2 space-y-6">
						{}
						{application.gaps && application.gaps.length > 0 && (
							<SlideUp delay={0.1}>
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-lg">
											<AlertCircle className="w-5 h-5 text-amber-500" />
											Gaps to Address
										</CardTitle>
										<CardDescription>
											Areas to improve for this application
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{application.gaps.map((gap, index) => {
												const severityConfig =
													gapSeverityConfig[gap.severity] ||
													gapSeverityConfig.info;
												return (
													<div
														key={index}
														className={cn(
															"flex items-start gap-3 p-3 rounded-lg border",
															severityConfig.color,
														)}
													>
														<AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
														<div>
															<p className="font-medium text-sm capitalize">
																{gap.field.replace("_", " ")}
															</p>
															<p className="text-sm opacity-80">
																{gap.message}
															</p>
														</div>
													</div>
												);
											})}
										</div>
									</CardContent>
								</Card>
							</SlideUp>
						)}

						{}
						<SlideUp delay={0.2}>
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Actions</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex flex-wrap gap-3">
										<Button asChild>
											<Link
												href={`/dashboard/applications/${application.id}/sop`}
											>
												<FileText className="w-4 h-4 mr-2" />
												{application.sopStatus === "not_started" ||
												!application.sopStatus
													? "Start SOP"
													: "Continue SOP"}
											</Link>
										</Button>

										<Button variant="outline" asChild>
											<Link href={`/explore/${application.program.id}`}>
												View Program Details
											</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						</SlideUp>
					</div>

					{}
					<div className="space-y-6">
						<SlideUp delay={0.3}>
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Program Info</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<p className="text-sm text-muted-foreground">University</p>
										<p className="font-medium">
											{application.program.universityName}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Program</p>
										<p className="font-medium">
											{application.program.programName}
										</p>
									</div>
									{application.program.degreeName && (
										<div>
											<p className="text-sm text-muted-foreground">Degree</p>
											<p className="font-medium">
												{application.program.degreeName}
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						</SlideUp>

						<SlideUp delay={0.4}>
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Timeline</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3 text-sm">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Added</span>
											<span>
												{new Date(application.createdAt).toLocaleDateString()}
											</span>
										</div>
										{application.updatedAt !== application.createdAt && (
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Last Updated
												</span>
												<span>
													{new Date(application.updatedAt).toLocaleDateString()}
												</span>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</SlideUp>
					</div>
				</div>
			</PageContainer>
		</PageTransition>
	);
}
````

## File: app/(app)/layout.tsx
````typescript
import { DataInitializer } from "@/components/DataInitializer";
import { Navbar } from "@/components/Navbar";

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="h-screen flex flex-col">
			<DataInitializer />
			<Navbar />
			<main className="flex-1 overflow-y-auto pt-16">{children}</main>
		</div>
	);
}
````

## File: app/oauth/success/page.tsx
````typescript
"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/store/userStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default function OAuthSuccessPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const login = useUserStore((state) => state.login);
	const updatePreferences = useUserStore((state) => state.updatePreferences);
	const [status, setStatus] = useState<"loading" | "error">("loading");

	useEffect(() => {
		const verifyAuth = async () => {
			try {

				const response = await fetch(`${API_URL}/v1/auth/me`, {
					credentials: "include",
				});

				if (!response.ok) {
					throw new Error("Authentication failed");
				}

				const data = await response.json();

				if (data.success && data.data) {
					const userContext = data.data;


					const userProfile = {
						id: userContext.user.id,
						email: userContext.user.email,
						fullName: userContext.profile?.fullName || "",
					};

					// Login to store with COOKIE_AUTH marker
					// Backend sets httpOnly cookies (access_token, refresh_token)
					// Frontend cannot access these cookies, so we use a marker token
					login(
						userProfile,
						"COOKIE_AUTH",
						"COOKIE_AUTH",
						0,
						userContext.user.isOnboardingComplete,
					);


					if (userContext.preferences) {
						updatePreferences({
							fieldOfInterest: userContext.preferences.fieldOfInterest,
							preferredRegions: userContext.preferences.preferredRegions,
							intendedStartTerm: userContext.preferences.intendedStartTerm,
							budgetLabel: userContext.preferences.budgetLabel,
							journeyType: userContext.preferences.journeyType,
							programType: userContext.preferences.programType,
							campusSetting: userContext.preferences
								.campusSetting as UserPreferences["campusSetting"],
							interests: userContext.preferences.interests,
						});
					}


					const needsOnboarding = searchParams.get("onboarding") === "true";

					if (needsOnboarding || !userContext.user.isOnboardingComplete) {
						router.replace("/onboarding");
					} else {
						router.replace("/dashboard");
					}
				} else {
					throw new Error("Invalid response");
				}
			} catch (error) {
				console.error("OAuth verification failed:", error);
				setStatus("error");

				setTimeout(() => {
					router.replace("/login?error=oauth_failed");
				}, 2000);
			}
		};

		verifyAuth();
	}, [router, login, updatePreferences, searchParams]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-muted">
			<div className="flex flex-col items-center gap-4">
				{status === "loading" ? (
					<>
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<p className="text-muted-foreground">Đang xử lý...</p>
					</>
				) : (
					<>
						<p className="text-destructive">Đăng nhập thất bại</p>
						<p className="text-sm text-muted-foreground">
							Đang chuyển hướng...
						</p>
					</>
				)}
			</div>
		</div>
	);
}


interface UserPreferences {
	campusSetting?: "urban" | "suburban" | "rural";
}
````

## File: app/onboarding/page.tsx
````typescript
import { getTranslations } from "next-intl/server";
import { OnboardingClient } from "@/components/onboarding/OnboardingClient";

const START_YEARS = ["2026", "2027", "2028", "2029"];

export default async function OnboardingPage() {
	const t = await getTranslations("onboarding");


	const educationLevels = [
		{ value: "high_school", label: t("step1.levels.highSchool") },
		{
			value: "undergrad",
			label: t("step1.levels.undergraduate"),
		},
		{ value: "graduate", label: t("step1.levels.graduate") },
		{
			value: "working",
			label: t("step1.levels.working"),
		},
	];

	const programTypes = [
		{
			value: "bachelors",
			label: t("step1.programs.bachelors"),
			disabled: true,
		},
		{ value: "masters", label: t("step1.programs.masters") },
		{ value: "mba", label: t("step1.programs.mba") },
		{ value: "phd", label: t("step1.programs.phd") },
	];

	const fieldsOfStudy = [
		t("step2.fields.cs"),
		t("step2.fields.business"),
		t("step2.fields.finance"),
		t("step2.fields.engineering"),
		t("step2.fields.dataScience"),
		t("step2.fields.design"),
		t("step2.fields.health"),
		t("step2.fields.other"),
	];

	const regions = [
		{
			name: t("step2.regions.eastAsia"),
			countries: t("step2.regions.eastAsiaCountries"),
		},
		{
			name: t("step2.regions.southeastAsia"),
			countries: t("step2.regions.southeastAsiaCountries"),
		},
		{
			name: t("step2.regions.westernEurope"),
			countries: t("step2.regions.westernEuropeCountries"),
		},
		{
			name: t("step2.regions.northernEurope"),
			countries: t("step2.regions.northernEuropeCountries"),
		},
		{
			name: t("step2.regions.northAmerica"),
			countries: t("step2.regions.northAmericaCountries"),
		},
		{
			name: t("step2.regions.oceania"),
			countries: t("step2.regions.oceaniaCountries"),
		},
	];

	const budgetOptions = [
		{ value: 0, label: t("step2.budgetOptions.low") },
		{ value: 1, label: t("step2.budgetOptions.medium") },
		{ value: 2, label: t("step2.budgetOptions.high") },
		{ value: 3, label: t("step2.budgetOptions.scholarship") },
	];

	const startTerms = [t("step2.terms.spring"), t("step2.terms.fall")];

	const journeyOptions = [
		{
			id: "exploring" as const,
			iconName: "compass" as const,
			title: t("step3.exploring.title"),
			description: t("step3.exploring.description"),
			redirect: "/persona-lab",
			color: "chart-2",
		},
		{
			id: "targeted" as const,
			iconName: "target" as const,
			title: t("step3.targeted.title"),
			description: t("step3.targeted.description"),
			redirect: "/explore",
			color: "primary",
		},
	];

	const translations = {
		steps: [
			t("steps.basicInfo"),
			t("steps.preferences"),
			t("steps.plan"),
			t("steps.journey"),
			t("steps.complete"),
		],
		step1: {
			title: t("step1.title"),
			subtitle: t("step1.subtitle"),
			educationLevel: t("step1.educationLevel"),
			educationLevelRequired: t("step1.educationLevelRequired"),
			targetDegree: t("step1.targetDegree"),
			targetDegreeRequired: t("step1.targetDegreeRequired"),
		},
		step2: {
			title: t("step2.title"),
			subtitle: t("step2.subtitle"),
			fieldsOfInterest: t("step2.fieldsOfInterest"),
			fieldsOfInterestMax: t("step2.fieldsOfInterestMax"),
			fieldsRequired: t("step2.fieldsRequired"),
			regionsOfInterest: t("step2.regionsOfInterest"),
			regionsOptional: t("step2.regionsOptional"),
		},
		step2b: {
			title: t("step2b.title"),
			subtitle: t("step2b.subtitle"),
			timeline: t("step2b.timeline"),
			timelineRequired: t("step2b.timelineRequired"),
			selectYear: t("step2b.selectYear"),
			selectYearPlaceholder: t("step2b.selectYearPlaceholder"),
			selectTerm: t("step2b.selectTerm"),
			selectTermPlaceholder: t("step2b.selectTermPlaceholder"),
			budget: t("step2b.budget"),
			budgetRequired: t("step2b.budgetRequired"),
		},
		step3: {
			title: t("step3.title"),
			subtitle: t("step3.subtitle"),
			startNow: t("step3.startNow"),
		},
		step4: {
			title: t("step4.title"),
			subtitle: t("step4.subtitle"),
			ctaExploring: t("step4.ctaExploring"),
			ctaTargeted: t("step4.ctaTargeted"),
		},
		buttons: {
			back: t("buttons.back"),
			continue: t("buttons.continue"),
		},
	};

	const constants = {
		educationLevels,
		programTypes,
		fieldsOfStudy,
		regions,
		startYears: START_YEARS,
		startTerms,
		budgetOptions,
		journeyOptions,
	};

	return <OnboardingClient translations={translations} constants={constants} />;
}
````

## File: components/explore/ManualMode.tsx
````typescript
"use client";

import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CompareDialog } from "@/components/explore/CompareDialog";
import { CompareTray } from "@/components/explore/CompareTray";
import { HorizontalFilterBar } from "@/components/explore/FilterBar";
import { ProgramDetailDrawer } from "@/components/explore/ProgramDetailDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ProgramListItemResponse } from "@/lib/api/types";

interface ManualModeProps {
	programs: ProgramListItemResponse[];
}




function ProgramTableRow({
	program,
	selected,
	onSelect,
	onClick,
	onAddToDashboard,
	isMaxReached,
}: {
	program: ProgramListItemResponse;
	selected: boolean;
	onSelect: () => void;
	onClick: () => void;
	onAddToDashboard: () => void;
	isMaxReached: boolean;
}) {
	const getDeadlineUrgency = (deadline?: string) => {
		if (!deadline) return { color: "text-muted-foreground", label: "N/A" };
		const daysUntil = Math.floor(
			(new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
		);

		if (daysUntil < 14) {
			return { color: "text-destructive", label: `⚠️ Còn ${daysUntil} ngày` };
		}
		if (daysUntil <= 30) {
			return { color: "text-orange-600", label: `⚠️ Còn ${daysUntil} ngày` };
		}
		return {
			color: "text-foreground",
			label: new Date(deadline).toLocaleDateString("vi-VN", {
				day: "2-digit",
				month: "short",
				year: "numeric",
			}),
		};
	};

	const getFitBadge = (category?: string) => {
		switch (category) {
			case "safety":
				return (
					<Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
						An toàn
					</Badge>
				);
			case "target":
				return (
					<Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
						Cần nỗ lực
					</Badge>
				);
			case "reach":
				return (
					<Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
						Thách thức
					</Badge>
				);
			default:
				return null;
		}
	};

	const getRankingBadge = (rankingDisplay?: string) => {
		if (!rankingDisplay)
			return <span className="text-muted-foreground">N/A</span>;


		const rankNum = Number.parseInt(rankingDisplay.replace(/[^0-9]/g, ""), 10);
		let colorClass = "bg-gray-100 text-gray-700 border-gray-200";

		if (!Number.isNaN(rankNum)) {
			if (rankNum <= 50) {
				colorClass = "bg-purple-100 text-purple-700 border-purple-200";
			} else if (rankNum <= 100) {
				colorClass = "bg-blue-100 text-blue-700 border-blue-200";
			} else if (rankNum <= 200) {
				colorClass = "bg-slate-100 text-slate-700 border-slate-200";
			}
		}

		return (
			<Badge className={`${colorClass} hover:${colorClass}`}>
				{rankingDisplay}
			</Badge>
		);
	};

	const deadline = getDeadlineUrgency(program.nextDeadline);

	return (
		<tr
			className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
			onClick={(e) => {

				if ((e.target as HTMLElement).closest("input, button")) return;
				onClick();
			}}
		>
			{}
			<td className="p-4 w-12">
				<input
					type="checkbox"
					checked={selected}
					onChange={onSelect}
					onClick={(e) => e.stopPropagation()}
					disabled={isMaxReached && !selected}
					className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				/>
			</td>

			{}
			<td className="p-4">
				<div className="flex items-start gap-3">
					<div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
						{program.universityLogoUrl ? (
							<Image
								src={program.universityLogoUrl}
								alt={program.universityName}
								width={48}
								height={48}
								className="object-contain"
							/>
						) : (
							<span className="text-xs font-bold text-primary">
								{program.universityName.substring(0, 2).toUpperCase()}
							</span>
						)}
					</div>
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-1">
							<h3 className="font-semibold text-foreground text-sm">
								{program.universityName}
							</h3>
							<span className="text-xs text-muted-foreground">
								{program.universityCountry}
							</span>
						</div>
						<p className="text-sm text-muted-foreground">
							{program.programName}
						</p>
					</div>
				</div>
			</td>

			{}
			<td className="p-4 text-center">
				{getRankingBadge(program.rankingQsDisplay)}
			</td>

			{}
			<td className="p-4 text-center">
				{program.tuitionAnnualUsd ? (
					<div className="flex flex-col items-center gap-1">
						<span className="font-semibold text-foreground">
							${program.tuitionAnnualUsd.toLocaleString()}
						</span>
						{program.scholarshipAvailable && (
							<span className="text-xs text-green-600">💰 Có học bổng</span>
						)}
					</div>
				) : (
					<span className="text-muted-foreground">N/A</span>
				)}
			</td>

			{}
			<td className="p-4 text-center">
				<span className={`text-sm font-medium ${deadline.color}`}>
					{deadline.label}
				</span>
			</td>

			{}
			<td className="p-4 text-center">{getFitBadge(program.fitCategory)}</td>

			{}
			<td className="p-4 text-center">
				<Button
					variant="outline"
					size="sm"
					onClick={(e) => {
						e.stopPropagation();
						onAddToDashboard();
					}}
					className="gap-2"
				>
					<Plus className="w-4 h-4" />
					Add to dashboard
				</Button>
			</td>
		</tr>
	);
}




export function ManualMode({ programs }: ManualModeProps) {

	const MAX_COMPARE_PROGRAMS = 4;


	const [selectedPrograms, setSelectedPrograms] = useState<Set<string>>(
		new Set(),
	);


	const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);


	const [selectedProgram, setSelectedProgram] =
		useState<ProgramListItemResponse | null>(null);
	const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);


	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;


	const [sortBy, setSortBy] = useState("ranking");


	const [searchQuery, setSearchQuery] = useState("");

	// Toggle program selection
	const toggleProgramSelection = (id: string) => {
		setSelectedPrograms((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				// Always allow deselecting
				newSet.delete(id);
			} else {
				// Only add if under the limit
				if (newSet.size < MAX_COMPARE_PROGRAMS) {
					newSet.add(id);
				}
			}
			return newSet;
		});
	};

	// Check if max selection limit is reached
	const isMaxReached = selectedPrograms.size >= MAX_COMPARE_PROGRAMS;

	// Filter programs by search query
	const filteredPrograms = programs.filter((program) => {
		if (!searchQuery) return true;
		const query = searchQuery.toLowerCase();
		return (
			program.universityName.toLowerCase().includes(query) ||
			program.programName.toLowerCase().includes(query) ||
			(program.universityCountry || "").toLowerCase().includes(query)
		);
	});

	// Helper to parse ranking display string to number for sorting
	const parseRanking = (rankingDisplay?: string): number => {
		if (!rankingDisplay) return 999;
		const num = Number.parseInt(rankingDisplay.replace(/[^0-9]/g, ""), 10);
		return Number.isNaN(num) ? 999 : num;
	};

	// Sort programs
	const sortedPrograms = [...filteredPrograms].sort((a, b) => {
		switch (sortBy) {
			case "ranking":
				return (
					parseRanking(a.rankingQsDisplay) - parseRanking(b.rankingQsDisplay)
				);
			case "cost_asc":
				return (a.tuitionAnnualUsd || 0) - (b.tuitionAnnualUsd || 0);
			case "cost_desc":
				return (b.tuitionAnnualUsd || 0) - (a.tuitionAnnualUsd || 0);
			case "deadline":
				return (
					new Date(a.nextDeadline || "9999-12-31").getTime() -
					new Date(b.nextDeadline || "9999-12-31").getTime()
				);
			default:
				return 0;
		}
	});


	const totalPages = Math.ceil(sortedPrograms.length / itemsPerPage);
	const paginatedPrograms = sortedPrograms.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	const selectedCount = selectedPrograms.size;
	const selectedProgramsList = Array.from(selectedPrograms)
		.map((id) => programs.find((p) => p.id === id))
		.filter(Boolean)
		.slice(0, 3);

	return (
		<div className="space-y-6">
			{}
			<HorizontalFilterBar />

			{}
			<div className="space-y-4">
				{}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<p className="text-sm text-muted-foreground">
							Hiện {paginatedPrograms.length} trong {sortedPrograms.length} kết
							quả
						</p>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Tìm kiếm trường, program..."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setCurrentPage(1);
								}}
								className="pl-9 w-64"
							/>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-sm text-foreground">Sắp xếp:</span>
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-50">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ranking">Ranking (cao → thấp)</SelectItem>
								<SelectItem value="cost_asc">Chi phí (thấp → cao)</SelectItem>
								<SelectItem value="cost_desc">Chi phí (cao → thấp)</SelectItem>
								<SelectItem value="deadline">Deadline (gần nhất)</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{}
				<div className="border border-border rounded-lg overflow-hidden">
					<table className="w-full">
						<thead className="bg-muted/50">
							<tr className="border-b border-border">
								<th className="p-4 text-left font-semibold text-sm text-foreground">
									So sánh
								</th>
								<th className="p-4 text-left font-semibold text-sm text-foreground">
									Chương trình
								</th>
								<th className="p-4 text-center font-semibold text-sm text-foreground">
									Xếp hạng
								</th>
								<th className="p-4 text-center font-semibold text-sm text-foreground">
									Chi phí
								</th>
								<th className="p-4 text-center font-semibold text-sm text-foreground">
									Deadline
								</th>
								<th className="p-4 text-center font-semibold text-sm text-foreground">
									Độ phù hợp
								</th>
								<th className="p-4 text-center font-semibold text-sm text-foreground">
									Hành động
								</th>
							</tr>
						</thead>
						<tbody>
							{paginatedPrograms.map((program) => (
								<ProgramTableRow
									key={program.id}
									program={program}
									selected={selectedPrograms.has(program.id)}
									onSelect={() => toggleProgramSelection(program.id)}
									onClick={() => {
										setSelectedProgram(program);
										setIsDetailDrawerOpen(true);
									}}
									onAddToDashboard={() => {

										console.log("Add to dashboard:", program.id);
									}}
									isMaxReached={isMaxReached}
								/>
							))}
						</tbody>
					</table>
				</div>

				{}
				{totalPages > 1 && (
					<div className="flex items-center justify-between">
						{}
						<p className="text-sm text-muted-foreground">
							Hiện {(currentPage - 1) * itemsPerPage + 1}-
							{Math.min(currentPage * itemsPerPage, sortedPrograms.length)}{" "}
							trong {sortedPrograms.length} kết quả
						</p>

						{}
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								disabled={currentPage === 1}
								onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							>
								<ChevronLeft className="w-4 h-4" />
							</Button>

							{[...Array(Math.min(5, totalPages))].map((_, i) => {
								const pageNum = i + 1;
								return (
									<Button
										key={pageNum}
										variant={currentPage === pageNum ? "default" : "outline"}
										size="icon"
										onClick={() => setCurrentPage(pageNum)}
									>
										{pageNum}
									</Button>
								);
							})}

							{totalPages > 5 && (
								<span className="text-muted-foreground">...</span>
							)}

							<Button
								variant="outline"
								size="icon"
								disabled={currentPage === totalPages}
								onClick={() =>
									setCurrentPage((p) => Math.min(totalPages, p + 1))
								}
							>
								<ChevronRight className="w-4 h-4" />
							</Button>
						</div>
					</div>
				)}
			</div>

			{}
			<CompareTray
				selectedCount={selectedCount}
				maxPrograms={MAX_COMPARE_PROGRAMS}
				selectedProgramsList={selectedProgramsList}
				onRemoveProgram={toggleProgramSelection}
				onClearAll={() => setSelectedPrograms(new Set())}
				onCompare={() => setIsCompareDialogOpen(true)}
			/>

			{}
			<CompareDialog
				open={isCompareDialogOpen}
				onOpenChange={setIsCompareDialogOpen}
				selectedPrograms={selectedPrograms}
				programs={programs}
				onRemoveProgram={(id) => {
					toggleProgramSelection(id);

					if (selectedPrograms.size <= 1) {
						setIsCompareDialogOpen(false);
					}
				}}
				onAddToDashboard={(id) => {

					console.log("Add to dashboard:", id);
				}}
			/>

			{}
			<ProgramDetailDrawer
				program={selectedProgram}
				open={isDetailDrawerOpen}
				onOpenChange={setIsDetailDrawerOpen}
				onCompare={(id) => {
					toggleProgramSelection(id);
					setIsDetailDrawerOpen(false);
				}}
				onAddToDashboard={(id) => {

					console.log("Add to dashboard:", id);
					setIsDetailDrawerOpen(false);
				}}
			/>
		</div>
	);
}
````

## File: components/explore/ProgramCard.tsx
````typescript
"use client";

import {
	Building2,
	Calendar,
	CheckCircle,
	DollarSign,
	FileWarning,
	Plus,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { ProgramListItemResponse } from "@/lib/api/types";

interface ProgramCardProps {
	program: ProgramListItemResponse;
	onSaveToggle?: (id: string) => void;
	onClick?: (program: ProgramListItemResponse) => void;
}


function getCountryFlag(country: string): string {
	const countryMap: Record<string, string> = {
		Netherlands: "🇳🇱",
		Germany: "🇩🇪",
		France: "🇫🇷",
		"United States": "🇺🇸",
		USA: "🇺🇸",
		"United Kingdom": "🇬🇧",
		UK: "🇬🇧",
		Canada: "🇨🇦",
		Australia: "🇦🇺",
		Spain: "🇪🇸",
		Italy: "🇮🇹",
		Sweden: "🇸🇪",
		Denmark: "🇩🇰",
		Switzerland: "🇨🇭",
	};
	return countryMap[country] || "🌍";
}


function formatTuition(tuitionAnnualUsd?: number): string {
	if (!tuitionAnnualUsd) return "N/A";
	const formatted = (tuitionAnnualUsd / 1000).toFixed(0);
	return `~${formatted}tr/năm`;
}


function formatDeadline(deadline?: string): string {
	if (!deadline) return "N/A";
	const date = new Date(deadline);
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${month}/${day}`;
}

export function ProgramCard({ program, onClick }: ProgramCardProps) {
	return (
		<div
			className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
			onClick={() => onClick?.(program)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					onClick?.(program);
				}
			}}
			role="button"
			tabIndex={0}
		>
			{}
			<div className="p-4 border-b border-border">
				<div className="flex items-center gap-3">
					{}
					<div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
						{program.universityLogoUrl ? (
							<Image
								src={program.universityLogoUrl}
								alt={program.universityName}
								width={48}
								height={48}
								className="object-contain"
							/>
						) : (
							<Building2 className="w-6 h-6 text-muted-foreground" />
						)}
					</div>

					{}
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2">
							<h3 className="font-semibold text-foreground truncate text-base">
								{program.universityName}
							</h3>
							<span className="text-xl shrink-0">
								{getCountryFlag(program.universityCountry || "")}
							</span>
						</div>
						<p className="text-sm text-slate-600 dark:text-slate-400">
							{program.universityCountry}
						</p>
					</div>
				</div>
			</div>

			{}
			<div className="p-4 space-y-4">
				{}
				<h4 className="font-semibold text-foreground line-clamp-2 text-base">
					{program.programName}
				</h4>

				{}
				<div className="flex flex-wrap items-center gap-3 text-sm">
					{}
					{program.rankingQsDisplay && (
						<div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-md border border-blue-200 dark:border-blue-800">
							<span className="font-medium">
								🌍 {program.rankingQsDisplay} Global
							</span>
						</div>
					)}

					{}
					<div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
						<DollarSign className="w-4 h-4" />
						<span>{formatTuition(program.tuitionAnnualUsd)}</span>
					</div>

					{}
					{program.nextDeadline && (
						<div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
							<Calendar className="w-4 h-4" />
							<span className="font-medium">
								Deadline: {formatDeadline(program.nextDeadline)}
							</span>
						</div>
					)}
				</div>

				{}
				<div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 space-y-3 border border-slate-200 dark:border-slate-800">
					{}
					{program.fitReasons && program.fitReasons.length > 0 && (
						<div className="flex items-start gap-2">
							<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
							<div className="flex-1">
								<p className="text-sm font-medium text-green-700 dark:text-green-400">
									Phù hợp:
								</p>
								<p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
									{program.fitReasons.join(", ")}
								</p>
							</div>
						</div>
					)}

					{}
					{program.fitGaps && program.fitGaps.length > 0 && (
						<div className="flex items-start gap-2">
							<FileWarning className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
							<div className="flex-1">
								<p className="text-sm font-medium text-amber-700 dark:text-amber-400">
									Lưu ý:
								</p>
								<p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
									{program.fitGaps.join(", ")}
								</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{}
			<div className="p-4 border-t border-border flex justify-between items-center gap-3">
				{}
				<Button
					variant="default"
					size="sm"
					className="flex-1 bg-primary/70 hover:bg-primary/90 text-white"
				>
					<Plus /> Thêm vào Dashboard
				</Button>

				{}
				<Button variant="ghost" size="sm" className="text-primary px-3">
					Xem chi tiết
				</Button>
			</div>
		</div>
	);
}
````

## File: components/onboarding/steps/Step3Plan.tsx
````typescript
"use client";

import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { StepContainer } from "../components/StepContainer";
import { StepNavigation } from "../components/StepNavigation";
import type {
	OnboardingConstants,
	OnboardingTranslations,
	Preferences,
} from "../types";

interface Step3PlanProps {
	translations: OnboardingTranslations;
	constants: OnboardingConstants;
	prefs: Preferences;
	onPrefsChange: (updates: Partial<Preferences>) => void;
	onNext: () => void;
	onBack: () => void;
}

export function Step3Plan({
	translations,
	constants,
	prefs,
	onPrefsChange,
	onNext,
	onBack,
}: Step3PlanProps) {
	const isValid = prefs.startYear.length > 0 && prefs.startTerm.length > 0;

	return (
		<StepContainer
			stepKey="step2b"
			title={translations.step2b.title}
			subtitle={translations.step2b.subtitle}
		>
			{}
			<FieldSet>
				<FieldLegend>
					{translations.step2b.timeline}{" "}
					<span className="text-red-500">
						{translations.step2b.timelineRequired}
					</span>
				</FieldLegend>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-2">
						<FieldDescription>
							{translations.step2b.selectYear}
						</FieldDescription>
						<select
							value={prefs.startYear}
							onChange={(e) => onPrefsChange({ startYear: e.target.value })}
							className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<option value="" disabled>
								{translations.step2b.selectYearPlaceholder}
							</option>
							{constants.startYears.map((year) => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-2">
						<FieldDescription>
							{translations.step2b.selectTerm}
						</FieldDescription>
						<select
							value={prefs.startTerm}
							onChange={(e) => onPrefsChange({ startTerm: e.target.value })}
							className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<option value="" disabled>
								{translations.step2b.selectTermPlaceholder}
							</option>
							{constants.startTerms.map((term) => (
								<option key={term} value={term}>
									{term}
								</option>
							))}
						</select>
					</div>
				</div>
			</FieldSet>

			{/* Budget */}
			<FieldSet>
				<FieldLegend>
					{translations.step2b.budget}{" "}
					<span className="text-red-500">
						{translations.step2b.budgetRequired}
					</span>
				</FieldLegend>
				<ToggleGroup
					type="single"
					variant="outline"
					spacing={2}
					size="sm"
					value={prefs.budgetIndex.toString()}
					onValueChange={(value: string) => {
						if (value) {
							onPrefsChange({ budgetIndex: parseInt(value, 10) });
						}
					}}
					className="flex flex-wrap gap-2 pt-2"
				>
					{constants.budgetOptions.map((option, index) => (
						<ToggleGroupItem
							key={option.value}
							value={index.toString()}
							className="h-auto py-2 px-4 rounded-full border-muted-foreground/30 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary transition-all"
						>
							<span className="text-sm font-medium">{option.label}</span>
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</FieldSet>

			<StepNavigation
				backLabel={translations.buttons.back}
				continueLabel={translations.buttons.continue}
				onBack={onBack}
				onNext={onNext}
				isNextDisabled={!isValid}
			/>
		</StepContainer>
	);
}
````

## File: components/persona-lab/ChatSidebar/BackToTracksButton.tsx
````typescript
"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";







interface BackToTracksButtonProps {
	onClick: () => void;
	disabled?: boolean;
}






export function BackToTracksButton({
	onClick,
	disabled = false,
}: BackToTracksButtonProps) {
	const t = useTranslations("personaLab");

	return (
		<div className="px-3 py-2 border-b border-border/50 bg-muted/30">
			<Button
				variant="ghost"
				size="sm"
				onClick={onClick}
				disabled={disabled}
				className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
			>
				<ArrowLeft className="w-3 h-3 mr-1.5" />
				{t("backToTracks")}
			</Button>
		</div>
	);
}
````

## File: components/persona-lab/ChatSidebar/ChatHeader.tsx
````typescript
"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { COVERAGE_COLORS, COVERAGE_LABELS } from "@/lib/config/graphConfig";
import type { Coverage } from "@/lib/types/persona";

interface ChatHeaderProps {
	coverage: Coverage;
	completionReady?: boolean;
	totalNodeCount?: number;
}

interface CoverageSegmentProps {
	category: keyof Coverage;
	value: number;
	color: string;
	label: string;
}

function CoverageSegment({
	category: _category,
	value,
	color,
	label,
}: CoverageSegmentProps) {
	const isComplete = value >= 60;

	return (
		<div className="flex-1 min-w-0 group relative">
			{}
			<div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
				<div className="bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-md whitespace-nowrap border border-border">
					{label}: {value}%
				</div>
			</div>

			{}
			<div className="h-2 bg-muted rounded-full overflow-hidden">
				<motion.div
					className="h-full rounded-full"
					initial={{ width: 0 }}
					animate={{ width: `${value}%` }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					style={{ backgroundColor: color }}
				/>
			</div>

			{}
			{isComplete && (
				<div
					className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center"
					style={{ backgroundColor: color }}
				>
					<CheckCircle2 className="w-2 h-2 text-white" />
				</div>
			)}
		</div>
	);
}

export function ChatHeader({
	coverage,
	completionReady = false,
	totalNodeCount = 0,
}: ChatHeaderProps) {
	const t = useTranslations("personaLab");


	const averageCoverage = useMemo(() => {
		const values = Object.values(coverage);
		return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
	}, [coverage]);


	const segments: { key: keyof Coverage; label: string; color: string }[] = [
		{
			key: "goals",
			label: COVERAGE_LABELS.goals,
			color: COVERAGE_COLORS.goals,
		},
		{
			key: "evidence",
			label: COVERAGE_LABELS.evidence,
			color: COVERAGE_COLORS.evidence,
		},
		{
			key: "skills",
			label: COVERAGE_LABELS.skills,
			color: COVERAGE_COLORS.skills,
		},
		{
			key: "values",
			label: COVERAGE_LABELS.values,
			color: COVERAGE_COLORS.values,
		},
		{
			key: "tensions",
			label: COVERAGE_LABELS.tensions,
			color: COVERAGE_COLORS.tensions,
		},
	];

	return (
		<div className="px-4 py-3 border-b border-border shrink-0">
			{}
			<div className="flex items-center gap-2 mb-3">
				<div className="p-1.5 rounded-lg bg-primary/10">
					<Sparkles className="w-4 h-4 text-primary" />
				</div>
				<div className="flex-1">
					<h2 className="font-semibold text-sm">{t("discoveryChat")}</h2>
					<div className="flex items-center gap-2 mt-0.5">
						<span className="text-[10px] text-muted-foreground">
							{totalNodeCount} {totalNodeCount === 1 ? "story" : "stories"}
						</span>
						{completionReady && (
							<span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
								Ready!
							</span>
						)}
					</div>
				</div>
				<span className="text-xs font-semibold text-primary">
					{averageCoverage}%
				</span>
			</div>

			{}
			<div className="flex items-center gap-1">
				{segments.map((segment) => (
					<CoverageSegment
						key={segment.key}
						category={segment.key}
						value={coverage[segment.key]}
						color={segment.color}
						label={segment.label}
					/>
				))}
			</div>

			{}
			<div className="flex items-center gap-1 mt-1.5">
				{segments.map((segment) => (
					<div
						key={segment.key}
						className="flex-1 text-center text-[9px] text-muted-foreground truncate"
					>
						{segment.label}
					</div>
				))}
			</div>
		</div>
	);
}







export function LegacyChatHeader() {

	const legacyCoverage: Coverage = {
		goals: 0,
		evidence: 0,
		skills: 0,
		values: 0,
		tensions: 0,
	};

	return <ChatHeader coverage={legacyCoverage} />;
}
````

## File: components/persona-lab/ChatSidebar/MessageInput.tsx
````typescript
"use client";

import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


const MIN_CHARS = 10;
const MAX_CHARS = 5000;

interface MessageInputProps {
	onSend: (content: string) => void;
	disabled?: boolean;
	placeholder?: string;
}

export function MessageInput({
	onSend,
	disabled = false,
	placeholder,
}: MessageInputProps) {
	const t = useTranslations("personaLab");
	const defaultPlaceholder = placeholder ?? t("shareYourStory");
	const [input, setInput] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const charCount = input.trim().length;
	const isBelowMin = charCount < MIN_CHARS;
	const isAboveMax = charCount > MAX_CHARS;
	const canSend = !isBelowMin && !isAboveMax && !disabled;

	// Auto-resize textarea based on content
	// biome-ignore lint/correctness/useExhaustiveDependencies: input is intentionally a dependency to trigger resize
	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
		}
	}, [input]);

	const handleSend = () => {
		const trimmed = input.trim();
		if (!canSend || !trimmed) return;

		onSend(trimmed);
		setInput("");

		// Reset textarea height
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;

		if (value.length <= MAX_CHARS + 100) {
			setInput(value);
		}
	};

	return (
		<div className="p-3 border-t border-border shrink-0">
			<div className="flex items-end gap-2 bg-muted/30 p-2 rounded-xl border border-border focus-within:border-primary/50 transition-colors">
				<textarea
					ref={textareaRef}
					value={input}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder={defaultPlaceholder}
					disabled={disabled}
					className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none p-1.5 min-h-9 max-h-[120px] resize-none text-sm placeholder:text-muted-foreground disabled:opacity-50"
					rows={1}
				/>
				<Button
					onClick={handleSend}
					disabled={!canSend}
					size="icon"
					className={cn(
						"h-8 w-8 rounded-lg shrink-0 transition-all",
						!canSend && "opacity-50 cursor-not-allowed",
					)}
				>
					<ArrowUp className="w-4 h-4" />
				</Button>
			</div>

			{}
			<div className="flex justify-end mt-1.5 px-1">
				<span
					className={cn(
						"text-xs transition-colors",
						charCount === 0
							? "text-muted-foreground/50"
							: isBelowMin
								? "text-amber-500"
								: isAboveMax
									? "text-destructive"
									: "text-muted-foreground",
					)}
				>
					{charCount === 0 ? (
						<span className="text-muted-foreground/50">
							{t("minCharacters", { count: MIN_CHARS })}
						</span>
					) : isBelowMin ? (
						<span>
							{t("moreCharactersNeeded", { count: MIN_CHARS - charCount })}
						</span>
					) : (
						<span>
							{charCount.toLocaleString()}/{MAX_CHARS.toLocaleString()}
						</span>
					)}
				</span>
			</div>
		</div>
	);
}
````

## File: components/ui/alert.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
	"relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
	{
		variants: {
			variant: {
				default: "bg-card text-card-foreground",
				destructive:
					"text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Alert({
	className,
	variant,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
	return (
		<div
			data-slot="alert"
			role="alert"
			className={cn(alertVariants({ variant }), className)}
			{...props}
		/>
	);
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-title"
			className={cn(
				"col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
				className,
			)}
			{...props}
		/>
	);
}

function AlertDescription({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-description"
			className={cn(
				"text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
				className,
			)}
			{...props}
		/>
	);
}

export { Alert, AlertTitle, AlertDescription };
````

## File: lib/api/exploreApi.ts
````typescript
import { apiClient } from "./client";
import type {
	AiMatchResponse,
	FilterOptionsResponse,
	ProgramDetailResponse,
	ProgramListParams,
	ProgramListResponse,
	SaveProgramResponse,
} from "./types";









export async function getPrograms(
	params?: ProgramListParams,
): Promise<ProgramListResponse> {
	const searchParams = new URLSearchParams();

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				searchParams.append(key, String(value));
			}
		});
	}

	const queryString = searchParams.toString();
	const endpoint = `/v1/explore/programs${queryString ? `?${queryString}` : ""}`;

	return apiClient.get<ProgramListResponse>(endpoint);
}





export async function getProgramDetail(
	id: string,
): Promise<ProgramDetailResponse> {
	return apiClient.get<ProgramDetailResponse>(`/v1/explore/programs/${id}`);
}





export async function getAiMatch(
	limitPerCategory?: number,
): Promise<AiMatchResponse> {
	const params = limitPerCategory
		? `?limit_per_category=${limitPerCategory}`
		: "";
	return apiClient.get<AiMatchResponse>(
		`/v1/explore/programs/matched${params}`,
	);
}

/**
 * Get user's saved programs
 * GET /v1/explore/programs/saved
 */
export async function getSavedPrograms(): Promise<ProgramListResponse> {
	return apiClient.get<ProgramListResponse>("/v1/explore/programs/saved");
}





export async function getFilterOptions(): Promise<FilterOptionsResponse> {
	return apiClient.get<FilterOptionsResponse>("/v1/explore/filters");
}





export async function saveProgram(id: string): Promise<SaveProgramResponse> {
	return apiClient.post<SaveProgramResponse>(
		`/v1/explore/programs/${id}/save`,
		{},
	);
}





export async function unsaveProgram(id: string): Promise<SaveProgramResponse> {
	return apiClient.delete<SaveProgramResponse>(
		`/v1/explore/programs/${id}/save`,
	);
}






export const exploreApi = {
	getPrograms,
	getProgramDetail,
	getAiMatch,
	getFilterOptions,
	saveProgram,
	unsaveProgram,
	getSavedPrograms,
};
````

## File: lib/hooks/useForceLayout.ts
````typescript
"use client";

import type { Edge, Node } from "@xyflow/react";
import {
	forceCenter,
	forceCollide,
	forceLink,
	forceManyBody,
	forceSimulation,
	type Simulation,
	type SimulationLinkDatum,
	type SimulationNodeDatum,
} from "d3-force";
import { useCallback, useRef, useState } from "react";
import type {
	GraphNodeData,
	LayerNumber,
	PersonaEdgeDto,
	PersonaNodeDto,
} from "@/lib/types/persona-graph";


export { LAYER_CONFIGS } from "@/lib/types/persona-graph";


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


interface ForceNode extends SimulationNodeDatum {
	id: string;
	layer: LayerNumber;
	fx?: number | null;
	fy?: number | null;
}


interface ForceLink extends SimulationLinkDatum<ForceNode> {
	id: string;
	strength: number;
}

interface LayoutResult {
	nodes: Node<GraphNodeData>[];
	edges: Edge[];
}

interface UseForceLayoutOptions {
	width?: number;
	height?: number;
	selectedNodeId?: string | null;
	hoveredNodeId?: string | null;
	showAllDetails?: boolean;
}




export function useForceLayout(options: UseForceLayoutOptions = {}) {
	const {
		width = 800,
		height = 600,
		selectedNodeId = null,
		hoveredNodeId = null,
		showAllDetails = false,
	} = options;

	const _simulationRef = useRef<Simulation<ForceNode, ForceLink> | null>(null);
	const [_positions, _setPositions] = useState<
		Map<string, { x: number; y: number }>
	>(new Map());




	const findParentNodeId = useCallback(
		(nodeId: string, edges: PersonaEdgeDto[]): string | null => {
			const edge = edges.find((e) => e.target === nodeId);
			return edge?.source || null;
		},
		[],
	);




	const isDetailNodeVisible = useCallback(
		(
			node: PersonaNodeDto,
			edges: PersonaEdgeDto[],
			selectedId: string | null,
			hoveredId: string | null,
			showAll: boolean,
		): boolean => {
			if (node.layer !== 3) return true;
			if (showAll) return true;

			const parentId = findParentNodeId(node.id, edges);
			if (!parentId) return false;

			return parentId === selectedId || parentId === hoveredId;
		},
		[findParentNodeId],
	);




	const createEdgesWithCenterConnections = useCallback(
		(
			apiNodes: PersonaNodeDto[],
			apiEdges: PersonaEdgeDto[],
		): PersonaEdgeDto[] => {
			const edges = [...apiEdges];


			const centerNode = apiNodes.find((n) => n.layer === 0);
			if (!centerNode) return edges;


			const layer2Nodes = apiNodes.filter((n) => n.layer === 2);
			layer2Nodes.forEach((storyNode) => {

				const exists = edges.some(
					(e) =>
						(e.source === centerNode.id && e.target === storyNode.id) ||
						(e.target === centerNode.id && e.source === storyNode.id),
				);
				if (!exists) {
					edges.push({
						id: `center-${storyNode.id}`,
						source: centerNode.id,
						target: storyNode.id,
						strength: 0.5,
						createdAt: new Date().toISOString(),
					});
				}
			});

			return edges;
		},
		[],
	);




	const runSimulation = useCallback(
		(
			apiNodes: PersonaNodeDto[],
			apiEdges: PersonaEdgeDto[],
			centerX: number,
			centerY: number,
		): Map<string, { x: number; y: number }> => {

			const allEdges = createEdgesWithCenterConnections(apiNodes, apiEdges);


			const forceNodes: ForceNode[] = apiNodes.map((node) => {

				if (node.layer === 0) {
					return {
						id: node.id,
						layer: node.layer,
						x: centerX,
						y: centerY,
						fx: centerX,
						fy: centerY,
					};
				}

				const angle = Math.random() * Math.PI * 2;
				const radius = 100 + node.layer * 80 + Math.random() * 50;
				return {
					id: node.id,
					layer: node.layer,
					x: centerX + Math.cos(angle) * radius,
					y: centerY + Math.sin(angle) * radius,
				};
			});


			const forceLinks: ForceLink[] = allEdges.map((edge) => ({
				id: edge.id,
				source: edge.source,
				target: edge.target,
				strength: edge.strength,
			}));


			const nodeMap = new Map(forceNodes.map((n) => [n.id, n]));


			const getLinkDistance = (link: ForceLink): number => {
				const sourceNode =
					typeof link.source === "string"
						? nodeMap.get(link.source)
						: (link.source as ForceNode);
				const targetNode =
					typeof link.target === "string"
						? nodeMap.get(link.target)
						: (link.target as ForceNode);

				if (!sourceNode || !targetNode)
					return LAYOUT_CONFIG.forces.linkDistance;


				if (sourceNode.layer === 0 || targetNode.layer === 0) {
					return LAYOUT_CONFIG.forces.linkDistance * 1.2;
				}

				if (sourceNode.layer === 2 && targetNode.layer === 3) {
					return LAYOUT_CONFIG.forces.linkDistance * 0.6;
				}
				return LAYOUT_CONFIG.forces.linkDistance;
			};


			const simulation = forceSimulation<ForceNode>(forceNodes)
				.force(
					"link",
					forceLink<ForceNode, ForceLink>(forceLinks)
						.id((d) => d.id)
						.distance(getLinkDistance)
						.strength(LAYOUT_CONFIG.forces.linkStrength),
				)
				.force(
					"charge",
					forceManyBody<ForceNode>().strength((d) => {

						const baseStrength = LAYOUT_CONFIG.forces.chargeStrength;
						if (d.layer === 0) return baseStrength * 2;
						if (d.layer === 3) return baseStrength * 0.3;
						return baseStrength;
					}),
				)
				.force(
					"center",
					forceCenter<ForceNode>(centerX, centerY).strength(
						LAYOUT_CONFIG.forces.centerStrength,
					),
				)
				.force(
					"collide",
					forceCollide<ForceNode>()
						.radius((d) => LAYOUT_CONFIG.nodeSize[d.layer] / 2 + 15)
						.strength(0.8),
				)
				.alphaDecay(LAYOUT_CONFIG.forces.alphaDecay)
				.velocityDecay(LAYOUT_CONFIG.forces.velocityDecay);



			simulation.tick(500);
			simulation.stop();


			const newPositions = new Map<string, { x: number; y: number }>();
			forceNodes.forEach((node) => {
				newPositions.set(node.id, {
					x: node.x ?? centerX,
					y: node.y ?? centerY,
				});
			});

			return newPositions;
		},
		[createEdgesWithCenterConnections],
	);




	const calculateLayout = useCallback(
		(
			apiNodes: PersonaNodeDto[],
			apiEdges: PersonaEdgeDto[],
			layoutOptions: {
				centerX?: number;
				centerY?: number;
				selectedNodeId?: string | null;
				hoveredNodeId?: string | null;
				showAllDetails?: boolean;
				zoom?: number;
			} = {},
		): LayoutResult => {
			const {
				centerX = width / 2,
				centerY = height / 2,
				selectedNodeId: selId = selectedNodeId,
				hoveredNodeId: hovId = hoveredNodeId,
				showAllDetails: showAll = showAllDetails,
				zoom = 1,
			} = layoutOptions;


			const nodePositions = runSimulation(apiNodes, apiEdges, centerX, centerY);


			const allEdges = createEdgesWithCenterConnections(apiNodes, apiEdges);


			const nodes: Node<GraphNodeData>[] = apiNodes.map((node) => {
				const position = nodePositions.get(node.id) || {
					x: centerX,
					y: centerY,
				};
				const isVisible = isDetailNodeVisible(
					node,
					apiEdges,
					selId,
					hovId,
					showAll,
				);


				let childCount = 0;
				if (node.layer === 2) {
					childCount = apiEdges.filter((e) => e.source === node.id).length;
				}

				const nodeData: GraphNodeData = {
					...node,
					isSelected: node.id === selId,
					isHovered: node.id === hovId,
					isHighlighted: false,
					isVisible,
					zoom,
					childCount,
				};

				return {
					id: node.id,
					type: node.type,
					position: {
						x: position.x - LAYOUT_CONFIG.nodeSize[node.layer] / 2,
						y: position.y - LAYOUT_CONFIG.nodeSize[node.layer] / 2,
					},
					data: nodeData,
					hidden: !isVisible,
					style: {
						width: LAYOUT_CONFIG.nodeSize[node.layer],
						height: LAYOUT_CONFIG.nodeSize[node.layer],
					},
				};
			});


			const edges: Edge[] = allEdges.map((edge) => {
				const sourceNode = apiNodes.find((n) => n.id === edge.source);
				const targetNode = apiNodes.find((n) => n.id === edge.target);
				const isDetailEdge = targetNode?.layer === 3;
				const isCenterEdge = sourceNode?.layer === 0;


				const edgeColor = "#94a3b8";

				return {
					id: edge.id,
					source: edge.source,
					target: edge.target,
					type: "straight",
					animated: false,
					style: {
						stroke: edgeColor,
						strokeWidth: isDetailEdge ? 0.75 : 1,
						opacity: isDetailEdge ? 0.4 : isCenterEdge ? 0.5 : 0.6,
					},
				};
			});

			return { nodes, edges };
		},
		[
			width,
			height,
			selectedNodeId,
			hoveredNodeId,
			showAllDetails,
			runSimulation,
			createEdgesWithCenterConnections,
			isDetailNodeVisible,
		],
	);




	const recalculateOnAdd = useCallback(
		(
			newNode: PersonaNodeDto,
			existingNodes: PersonaNodeDto[],
			existingEdges: PersonaEdgeDto[],
			layoutOptions: {
				centerX?: number;
				centerY?: number;
				selectedNodeId?: string | null;
				hoveredNodeId?: string | null;
				showAllDetails?: boolean;
				zoom?: number;
			} = {},
		): LayoutResult => {
			const allNodes = [...existingNodes, newNode];
			return calculateLayout(allNodes, existingEdges, layoutOptions);
		},
		[calculateLayout],
	);




	const getNodeSize = useCallback(
		(layer: LayerNumber): { width: number; height: number } => ({
			width: LAYOUT_CONFIG.nodeSize[layer],
			height: LAYOUT_CONFIG.nodeSize[layer],
		}),
		[],
	);




	const getLayerColor = useCallback((layer: LayerNumber): string => {
		return LAYOUT_CONFIG.colors[layer];
	}, []);

	return {
		calculateLayout,
		recalculateOnAdd,
		getNodeSize,
		getLayerColor,
		LAYOUT_CONFIG,
	};
}
````

## File: lib/hooks/useGraphControls.ts
````typescript
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
````

## File: lib/mock/personaGraphData.ts
````typescript
import type {
	Archetype,
	PatternCluster,
	PersonaGraph,
	SkillEvidence,
	StoryFragment,
	ValueSystem,
} from "@/lib/types/persona-canvas";





const story1: StoryFragment = {
	id: "story_1",
	title: "10-Year Architect Path",
	description:
		"Strategic career planning from senior engineer to software architect, recognizing the reality of aging in tech and proactively pivoting from hands-on coding to architectural decision-making before technical skills become outdated.",
	track: "future_vision",
	story_type: "insight",
	raw_text:
		"Tao nghĩ là 5 năm lên Senior, 10 năm lên kiến trúc sư. Sang phần ra quyết định. 5 năm senior code đủ nhiều rồi, 10 năm tao e là không theo kịp công nghệ mới, rút về làm kiến trúc là ổn",
	structured_extract: {
		context: "Lên kế hoạch sự nghiệp dài hạn trong tech",
		conflict: "Lo sợ không theo kịp công nghệ sau 10 năm code",
		action: "Chuyển từ IC (individual contributor) sang architect role",
		outcome: "Định hướng rõ: 5 năm Senior → 10 năm Architect",
		learning: "Nhận thức được giới hạn của deep technical path",
		emotion: "Thực dụng, có chút e ngại về aging trong tech",
	},
	tags: {
		identity_facets: ["analytical", "technical", "resilient"],
		value_signals: ["pragmatism", "autonomy", "sustainability"],
		skill_evidence: ["technical_depth", "strategic_thinking", "system_design"],
		narrative_type: "transformation",
		emotional_weight: "high",
		temporal: "5-10 years future",
		essay_potential: ["purpose_statement", "personal_statement"],
	},
	connections: {
		patterns: ["pattern_1", "pattern_2"],
		archetype: "archetype_1",
		values: ["value_system_1"],
		skills: ["skill_1", "skill_2"],
	},
	created_at: "2024-01-08T10:00:00Z",
};

const story2: StoryFragment = {
	id: "story_2",
	title: "Paper Document Pain",
	description:
		"Discovering a massive market opportunity through personal frustration with university's paper-based document management system. Converting daily annoyance with inefficient bureaucracy into a vision for enterprise knowledge management solutions with OCR capabilities.",
	track: "future_vision",
	story_type: "turning_point",
	raw_text:
		"Knowledge management thì nó bao gồm cả OCR nữa mà. Tao muốn tăng tốc các doanh nghiệp bị níu chân bởi đống văn bản. Tao đang phải soạn văn bản ở trường đại học đây, mà nó toàn lưu bằng giấy làm tao phát ngán.",
	structured_extract: {
		context: "Đang làm việc tại đại học, phải xử lý văn bản giấy tờ",
		conflict: "Frustration với inefficiency của legacy document systems",
		action: "Nhận diện market problem từ personal annoyance",
		outcome: "Vision rõ ràng: Build knowledge management tools cho enterprises",
		learning: "Personal pain point → Market opportunity",
		emotion: "Bực bội nhưng có động lực giải quyết",
	},
	tags: {
		identity_facets: ["entrepreneurial", "analytical", "resilient"],
		value_signals: ["efficiency", "impact", "innovation"],
		skill_evidence: ["problem_solving", "system_design"],
		narrative_type: "discovery",
		emotional_weight: "critical",
		temporal: "present",
		essay_potential: [
			"purpose_statement",
			"personal_statement",
			"diversity_statement",
		],
	},
	connections: {
		patterns: ["pattern_1", "pattern_3"],
		archetype: "archetype_1",
		values: ["value_system_1"],
		skills: ["skill_3", "skill_4"],
	},
	created_at: "2024-01-08T10:15:00Z",
};

const story3: StoryFragment = {
	id: "story_3",
	title: "Weekly Burnout Cycle",
	description:
		"Working at a 5-person startup with extreme intensity, experiencing burnout once per week. Recognizing the need for a strategic pause through a master's program to prevent complete exhaustion while expanding international network and maintaining career sustainability.",
	track: "future_vision",
	story_type: "challenge",
	raw_text:
		"Tao đang ở team startup 5 người. Làm startup thần tối 7 ngày burnout 1 lần. Tao muốn mở rộng quan hệ với những người học ở nước ngoài, tao cũng muốn đi học, kiểu small gap trong lúc làm nghề kẻo bị burn out.",
	structured_extract: {
		context: "Đang làm việc tại startup 5 người, intensity cao",
		conflict: "Burnout frequency: 1 lần/tuần do work intensity",
		action: "Nhận diện nhu cầu strategic pause qua master's program",
		outcome: "Plan: Work → Master → Work (gối lên để tránh burnout)",
		learning: "Sustainable career cần rhythm giữa work và learning",
		emotion: "Exhausted but self-aware",
	},
	tags: {
		identity_facets: ["resilient", "analytical", "entrepreneurial"],
		value_signals: ["sustainability", "autonomy", "quality"],
		skill_evidence: ["execution", "learning_agility"],
		narrative_type: "overcoming_obstacle",
		emotional_weight: "high",
		temporal: "present",
		essay_potential: ["personal_statement", "diversity_statement"],
	},
	connections: {
		patterns: ["pattern_2"],
		archetype: "archetype_1",
		values: ["value_system_1"],
		skills: ["skill_5"],
	},
	created_at: "2024-01-08T10:30:00Z",
};

const story4: StoryFragment = {
	id: "story_4",
	title: "Global Network Strategy",
	description:
		"Viewing master's education as a strategic investment to access global tech ecosystem, connect with industry leaders and VCs through alumni networks, and learn international work culture. Understanding that network advantage is critical for startup scaling beyond local market limitations.",
	track: "future_vision",
	story_type: "achievement",
	raw_text:
		"Chắc chắn là build startup network hoặc network với các cao thủ đầu ngành, sau đó cũng tiện tham khảo văn hoá làm việc. Các trường cũng có mạng lưới Alumni rất đáng mong chờ để tao có thể kết nối với các VC nếu cần. Industry connection và Global Tech Ecosystem",
	structured_extract: {
		context: "Nhận thức value của global network trong startup journey",
		conflict: "Local ecosystem limitations for scaling",
		action:
			"Strategic investment in international network through master's program",
		outcome: "Access to VCs, industry leaders, alumni network",
		learning: "Network = competitive advantage trong entrepreneurship",
		emotion: "Ambitious, calculated",
	},
	tags: {
		identity_facets: ["entrepreneurial", "analytical", "collaborative"],
		value_signals: ["impact", "autonomy", "innovation"],
		skill_evidence: ["strategic_thinking", "communication"],
		narrative_type: "hero_journey",
		emotional_weight: "medium",
		temporal: "2-3 years future",
		essay_potential: ["purpose_statement", "diversity_statement"],
	},
	connections: {
		patterns: ["pattern_3"],
		archetype: "archetype_1",
		values: ["value_system_1"],
		skills: ["skill_2", "skill_4"],
	},
	created_at: "2024-01-08T10:45:00Z",
};

const story5: StoryFragment = {
	id: "story_5",
	title: "Lean Team Philosophy",
	description:
		"Strong conviction that optimal team size is around 20 people for maximum impact. Believing that small, efficient teams can drive significant change while maintaining cost-effectiveness and operational excellence, rejecting the notion that big impact requires big teams.",
	track: "future_vision",
	story_type: "insight",
	raw_text:
		"Startup, onsite. Team size tầm 20 là đẹp, lean team big change, vận hành hiệu quả tiết kiệm chi phí.",
	structured_extract: {
		context: "Vision về ideal work environment",
		conflict: "Trade-off giữa team size và impact",
		action: "Optimize for lean operations (20 people)",
		outcome: "Maximize efficiency/cost ratio while maintaining impact",
		learning: "Small teams can drive big change with right structure",
		emotion: "Confident, opinionated",
	},
	tags: {
		identity_facets: ["entrepreneurial", "analytical", "leadership"],
		value_signals: ["efficiency", "impact", "pragmatism"],
		skill_evidence: ["strategic_thinking", "execution"],
		narrative_type: "innovation",
		emotional_weight: "medium",
		temporal: "5-10 years future",
		essay_potential: ["purpose_statement"],
	},
	connections: {
		patterns: ["pattern_1", "pattern_3"],
		archetype: "archetype_1",
		values: ["value_system_1"],
		skills: ["skill_4"],
	},
	created_at: "2024-01-08T11:00:00Z",
};

const story6: StoryFragment = {
	id: "story_6",
	title: "Selfish Altruism Vision",
	description:
		"Honest admission that the drive to digitize legacy enterprises stems from personal frustration with signing endless paper forms. Transforming personal annoyance into market opportunity by aligning enterprise digitization with government initiatives, proving that selfish motivations can create altruistic outcomes at scale.",
	track: "future_vision",
	story_type: "turning_point",
	raw_text:
		"Tao muốn là toàn bộ doanh nghiệp legacy nhờ có công cụ của bọn tao có thể chuyển dịch hiệu quả hơn, tiết kiệm chi phí hơn, và đấu nối tốt với mục tiêu chuyển đổi số của Chính phủ Việt Nam. Như vậy tao dùng dịch vụ nói chung sẽ đỡ phải ký tá viết tay nhiều",
	structured_extract: {
		context: "Frustration với bureaucracy trong services",
		conflict: "Personal annoyance vs systemic impact",
		action: "Frame personal pain as market opportunity",
		outcome:
			"Vision: Enterprise digitization aligned với government initiatives",
		learning: "Authentic motivation (selfish) → Scalable impact (altruistic)",
		emotion: "Brutally honest, grounded",
	},
	tags: {
		identity_facets: ["entrepreneurial", "resilient", "analytical"],
		value_signals: ["efficiency", "impact", "accessibility"],
		skill_evidence: ["problem_solving", "strategic_thinking"],
		narrative_type: "discovery",
		emotional_weight: "critical",
		temporal: "present + 10 years vision",
		essay_potential: [
			"personal_statement",
			"purpose_statement",
			"diversity_statement",
		],
	},
	connections: {
		patterns: ["pattern_1", "pattern_3"],
		archetype: "archetype_1",
		values: ["value_system_1"],
		skills: ["skill_3", "skill_4"],
	},
	created_at: "2024-01-08T11:15:00Z",
};





const pattern1: PatternCluster = {
	id: "pattern_1",
	cluster_name: "Pragmatic Architect",
	member_stories: ["story_1", "story_2", "story_5", "story_6"],
	shared_tags: {
		identity_facets: ["resilient", "analytical", "analytical"],
		value_signals: ["efficiency", "pragmatism", "impact"],
		skill_evidence: ["system_design", "strategic_thinking"],
	},
	pattern_description:
		"Consistently demonstrates practical, efficiency-driven approach to solving real problems. Rejects idealism in favor of what works.",
	behavioral_signature: [
		"Starts from personal pain point",
		"Quantifies constraints (team size, timeline)",
		"Optimizes for sustainability over heroics",
		"Transparent about selfish motivations",
	],
	essay_angles: [
		{
			name: "The Reluctant Optimizer",
			frame:
				"Engineer who solves problems not out of altruism, but because inefficiency personally offends them",
			narrative_arc: ["story_6", "story_2", "story_5"],
			fit: ["personal_statement", "purpose_statement"],
			strength: 85,
			uniqueness: 92,
		},
		{
			name: "10-Year Realist",
			frame:
				"Career planning that acknowledges aging in tech and plans strategic pivots",
			narrative_arc: ["story_1", "story_5"],
			fit: ["purpose_statement"],
			strength: 75,
			uniqueness: 70,
		},
	],
	status: "strong",
};

const pattern2: PatternCluster = {
	id: "pattern_2",
	cluster_name: "Burnout-Aware Builder",
	member_stories: ["story_1", "story_3"],
	shared_tags: {
		identity_facets: ["resilient", "analytical"],
		value_signals: ["sustainability", "autonomy"],
		skill_evidence: ["execution", "learning_agility"],
	},
	pattern_description:
		"Recognizes limits and plans for sustainable career rhythm. Not afraid to admit exhaustion.",
	behavioral_signature: [
		"Acknowledges burnout openly (1x/week)",
		"Plans strategic pauses (work → study → work)",
		"Prioritizes long-term sustainability over short-term grind",
	],
	essay_angles: [
		{
			name: "The Marathon Sprinter",
			frame:
				"Startup operator who learned to pace themselves through strategic breaks",
			narrative_arc: ["story_3", "story_1"],
			fit: ["personal_statement", "diversity_statement"],
			strength: 80,
			uniqueness: 75,
		},
	],
	status: "validated",
};

const pattern3: PatternCluster = {
	id: "pattern_3",
	cluster_name: "Ecosystem Entrepreneur",
	member_stories: ["story_2", "story_4", "story_5", "story_6"],
	shared_tags: {
		identity_facets: ["entrepreneurial", "collaborative"],
		value_signals: ["impact", "innovation", "accessibility"],
		skill_evidence: ["strategic_thinking", "communication"],
	},
	pattern_description:
		"Thinks in systems and networks. Sees value in alumni connections, government alignment, and ecosystem plays.",
	behavioral_signature: [
		"Maps stakeholders (VCs, government, enterprises)",
		"Values network effects",
		"Aligns personal goals with broader ecosystem trends",
	],
	essay_angles: [
		{
			name: "The Ecosystem Insider",
			frame:
				"Builder who leverages government digitization initiatives as market tailwind",
			narrative_arc: ["story_6", "story_4", "story_2"],
			fit: ["purpose_statement", "diversity_statement"],
			strength: 88,
			uniqueness: 85,
		},
	],
	status: "strong",
};





const archetype1: Archetype = {
	id: "archetype_1",
	primary_type: "builder",
	secondary_traits: ["architect", "maverick"],
	trait_vector: {
		pragmatism: 95,
		technical_depth: 85,
		strategic_thinking: 80,
		self_awareness: 90,
		brutal_honesty: 92,
		efficiency_obsession: 88,
		sustainability_mindset: 75,
		network_thinking: 70,
	},
	evolution_direction:
		"Moving from pure IC (individual contributor) → Architect/Entrepreneur hybrid. Becoming more systems-aware while retaining hands-on pragmatism.",
	evidence_from: [
		"story_1",
		"story_2",
		"story_3",
		"story_4",
		"story_5",
		"story_6",
	],
};





const valueSystem1: ValueSystem = {
	id: "value_system_1",
	stated_values: ["efficiency", "impact", "innovation"],
	revealed_values: [
		"pragmatism",
		"efficiency",
		"sustainability",
		"autonomy",
		"accessibility",
	],
	value_hierarchy: [
		"pragmatism",
		"efficiency",
		"sustainability",
		"impact",
		"autonomy",
	],
	tensions: [
		{
			id: "tension_1",
			pole_a: "efficiency",
			pole_b: "sustainability",
			evidence: {
				story_a: "story_2",
				story_b: "story_3",
			},
			resolution:
				"Strategic pauses (master's) to prevent burnout while maintaining high performance during work phases",
		},
		{
			id: "tension_2",
			pole_a: "autonomy",
			pole_b: "impact",
			evidence: {
				story_a: "story_5",
				story_b: "story_6",
			},
			resolution:
				"Lean operations enabling large market impact (quality over quantity)",
		},
	],
	evidence: {
		pragmatism: ["story_1", "story_2", "story_6"],
		efficiency: ["story_2", "story_5", "story_6"],
		sustainability: ["story_1", "story_3"],
		impact: ["story_2", "story_4", "story_6"],
		autonomy: ["story_1", "story_3", "story_5"],
		innovation: ["story_2", "story_4"],
		accessibility: ["story_6"],
	},
};





const skill1: SkillEvidence = {
	id: "skill_1",
	skill_name: "System Architecture",
	category: "system_design",
	proficiency: "advanced",
	evidence: ["story_1", "story_2"],
	growth_trajectory: "steady",
	passion_level: "passionate",
	essay_value: 75,
};

const skill2: SkillEvidence = {
	id: "skill_2",
	skill_name: "Strategic Career Planning",
	category: "strategic_thinking",
	proficiency: "advanced",
	evidence: ["story_1", "story_4"],
	growth_trajectory: "accelerating",
	passion_level: "interested",
	essay_value: 70,
};

const skill3: SkillEvidence = {
	id: "skill_3",
	skill_name: "Problem Discovery (Market Sensing)",
	category: "problem_solving",
	proficiency: "expert",
	evidence: ["story_2", "story_6"],
	growth_trajectory: "breakthrough",
	passion_level: "obsessed",
	essay_value: 95,
};

const skill4: SkillEvidence = {
	id: "skill_4",
	skill_name: "Ecosystem Thinking",
	category: "strategic_thinking",
	proficiency: "intermediate",
	evidence: ["story_2", "story_4", "story_5", "story_6"],
	growth_trajectory: "accelerating",
	passion_level: "passionate",
	essay_value: 85,
};

const skill5: SkillEvidence = {
	id: "skill_5",
	skill_name: "Burnout Management",
	category: "execution",
	proficiency: "intermediate",
	evidence: ["story_3"],
	growth_trajectory: "steady",
	passion_level: "instrumental",
	essay_value: 60,
};





export const mockPersonaGraph: PersonaGraph = {
	archetype: archetype1,
	stories: [story1, story2, story3, story4, story5, story6],
	patterns: [pattern1, pattern2, pattern3],
	values: valueSystem1,
	skills: [skill1, skill2, skill3, skill4, skill5],
	edges: [

		{ from: "story_1", to: "pattern_1", type: "member_of", strength: 80 },
		{ from: "story_1", to: "pattern_2", type: "member_of", strength: 70 },
		{ from: "story_2", to: "pattern_1", type: "member_of", strength: 90 },
		{ from: "story_2", to: "pattern_3", type: "member_of", strength: 85 },
		{ from: "story_3", to: "pattern_2", type: "member_of", strength: 95 },
		{ from: "story_4", to: "pattern_3", type: "member_of", strength: 90 },
		{ from: "story_5", to: "pattern_1", type: "member_of", strength: 75 },
		{ from: "story_5", to: "pattern_3", type: "member_of", strength: 70 },
		{ from: "story_6", to: "pattern_1", type: "member_of", strength: 100 },
		{ from: "story_6", to: "pattern_3", type: "member_of", strength: 95 },


		{
			from: "pattern_1",
			to: "archetype_1",
			type: "evidences",
			strength: 95,
		},
		{
			from: "pattern_2",
			to: "archetype_1",
			type: "evidences",
			strength: 80,
		},
		{
			from: "pattern_3",
			to: "archetype_1",
			type: "evidences",
			strength: 85,
		},


		{
			from: "story_1",
			to: "value_system_1",
			type: "supports",
			strength: 75,
		},
		{
			from: "story_2",
			to: "value_system_1",
			type: "supports",
			strength: 90,
		},
		{
			from: "story_3",
			to: "value_system_1",
			type: "supports",
			strength: 85,
		},
		{
			from: "story_4",
			to: "value_system_1",
			type: "supports",
			strength: 70,
		},
		{
			from: "story_5",
			to: "value_system_1",
			type: "supports",
			strength: 80,
		},
		{
			from: "story_6",
			to: "value_system_1",
			type: "supports",
			strength: 95,
		},


		{
			from: "story_2",
			to: "story_3",
			type: "conflicts",
			strength: 65,
		},
		{
			from: "story_5",
			to: "story_6",
			type: "conflicts",
			strength: 50,
		},


		{
			from: "story_1",
			to: "skill_1",
			type: "demonstrates",
			strength: 80,
		},
		{
			from: "story_1",
			to: "skill_2",
			type: "demonstrates",
			strength: 90,
		},
		{
			from: "story_2",
			to: "skill_1",
			type: "demonstrates",
			strength: 75,
		},
		{
			from: "story_2",
			to: "skill_3",
			type: "demonstrates",
			strength: 95,
		},
		{
			from: "story_2",
			to: "skill_4",
			type: "demonstrates",
			strength: 70,
		},
		{
			from: "story_3",
			to: "skill_5",
			type: "demonstrates",
			strength: 85,
		},
		{
			from: "story_4",
			to: "skill_2",
			type: "demonstrates",
			strength: 75,
		},
		{
			from: "story_4",
			to: "skill_4",
			type: "demonstrates",
			strength: 90,
		},
		{
			from: "story_5",
			to: "skill_4",
			type: "demonstrates",
			strength: 80,
		},
		{
			from: "story_6",
			to: "skill_3",
			type: "demonstrates",
			strength: 100,
		},
		{
			from: "story_6",
			to: "skill_4",
			type: "demonstrates",
			strength: 85,
		},


		{
			from: "skill_1",
			to: "archetype_1",
			type: "evidences",
			strength: 85,
		},
		{
			from: "skill_2",
			to: "archetype_1",
			type: "evidences",
			strength: 70,
		},
		{
			from: "skill_3",
			to: "archetype_1",
			type: "evidences",
			strength: 95,
		},
		{
			from: "skill_4",
			to: "archetype_1",
			type: "evidences",
			strength: 80,
		},
		{
			from: "skill_5",
			to: "archetype_1",
			type: "evidences",
			strength: 60,
		},
	],
	metadata: {
		tracks_completed: {
			future_vision: 0.85,
			academic_journey: 0,
			activities_impact: 0,
			values_turning_points: 0.2,
		},
		completeness_score: 0.25,
		essay_readiness: {
			personal_statement: "partial",
			diversity_statement: "partial",
			purpose_statement: "ready",
		},
		missing_critical: [
			"Academic mentors/influences (Track 2)",
			"Leadership evidence (Track 3)",
			"Turning point moments (Track 4)",
			"Failure/vulnerability stories",
			"Collaboration examples",
		],
	},
};
````

## File: lib/services/onboarding.ts
````typescript
import { apiClient } from "@/lib/api/client";
import type {
	OnboardingDataResponse,
	UpdateOnboardingRequest,
} from "@/lib/api/types";

export const onboardingService = {








	getOnboardingStatus: async (): Promise<OnboardingDataResponse> => {
		return apiClient.get<OnboardingDataResponse>("/v1/onboarding/status");
	},









	updateOnboarding: async (
		data: UpdateOnboardingRequest,
	): Promise<OnboardingDataResponse> => {
		return apiClient.patch<OnboardingDataResponse>("/v1/onboarding", data);
	},
};
````

## File: lib/services/user.ts
````typescript
import { apiClient } from "@/lib/api/client";
import type {
	PreferencesResponse,
	ProfileResponse,
	UpdatePreferencesRequest,
	UpdateProfileRequest,
	UserMeResponse,
} from "@/lib/api/types";

export const userService = {







	getMe: async (): Promise<UserMeResponse> => {
		return apiClient.get<UserMeResponse>("/v1/user/me");
	},








	getProfile: async (): Promise<ProfileResponse> => {
		return apiClient.get<ProfileResponse>("/v1/user/profile");
	},




	updateProfile: async (
		data: UpdateProfileRequest,
	): Promise<ProfileResponse> => {
		return apiClient.patch<ProfileResponse>("/v1/user/profile", data);
	},








	getPreferences: async (): Promise<PreferencesResponse> => {
		return apiClient.get<PreferencesResponse>("/v1/user/preferences");
	},




	updatePreferences: async (
		data: UpdatePreferencesRequest,
	): Promise<PreferencesResponse> => {
		return apiClient.patch<PreferencesResponse>("/v1/user/preferences", data);
	},
};
````

## File: lib/types/persona.ts
````typescript
export type TrackId =
	| "future_vision"
	| "academic_journey"
	| "activities_impact"
	| "values_turning_points";

export type TrackStatus = "not_started" | "in_progress" | "completed";

export interface Track {
	id: TrackId;
	displayName: string;
	description: string;
	icon: string;
	status: TrackStatus;
	completedAt: string | null;

	coreQuestionIndex: number;
	followUpIndex: number;
}





export type MessageRole = "assistant" | "user";
export type MessageType = "text" | "track_selection" | "track_complete";

export interface TrackAction {
	trackId: TrackId;
	displayName: string;
	icon: string;
	status: TrackStatus;
}

export interface CanvasAction {
	action: "add" | "remove" | "reveal_archetype";
	node?: CanvasNode;
	nodeId?: string;
	archetype?: {
		type: ArchetypeType;
		personalizedSummary: string;
	};
}

export interface ChatMessage {
	id: string;
	role: MessageRole;
	content: string;
	type: MessageType;
	timestamp: string;
	actions?: TrackAction[];
	canvasActions?: CanvasAction[];
}





export type NodeType = "story" | "evidence" | "insight" | "archetype";

export interface CanvasNode {
	id: string;
	type: NodeType;
	title: string;
	content: string;
	sourceTrackId: TrackId | null;
	createdAt: string;
	archetypeType?: ArchetypeType;
	personalizedSummary?: string;
}





export type ArchetypeType =
	| "innovator"
	| "bridge_builder"
	| "scholar"
	| "advocate"
	| "pioneer"
	| "craftsman"
	| "resilient"
	| "catalyst";

export interface ArchetypeDefinition {
	type: ArchetypeType;
	title: string;
	tagline: string;
	description: string;
	essayStrengths: string[];
	color: string;
	bgClass: string;
	textClass: string;
	borderClass: string;
	emoji: string;
}





export interface PersonaState {
	userId: string;
	tracks: Record<TrackId, Track>;
	nodes: CanvasNode[];
	archetype: {
		type: ArchetypeType;
		personalizedSummary: string;
		revealedAt: string;
	} | null;
	conversationHistory: ChatMessage[];
	currentTrackId: TrackId | null;
	createdAt: string | null;
	updatedAt: string | null;
}





export interface PersonaApiResponse {
	success: boolean;
	data: PersonaState;
}

export interface TrackSelectResponse {
	message: ChatMessage;
	trackStatus: TrackStatus;
	currentTrackId: TrackId;
}

export interface ArchetypeCandidate {
	type: ArchetypeType;
	probability: number;
	evidence?: string;
}

export interface ArchetypeHints {
	totalQuestionsAnswered: number;
	confidence: "none" | "early" | "emerging" | "strong" | "final";
	candidates: ArchetypeCandidate[];
}

export interface MessageResponse {
	message: ChatMessage;
	conversationState?: {
		coreQuestionIndex: number;
		followUpIndex: number;
		totalCoreQuestions: number;
	};
	trackStatus?: TrackStatus;
	currentTrackId?: TrackId | null;
	allTracksComplete?: boolean;
	archetypeHints?: ArchetypeHints;
}

export interface KeywordRequest {
	content: string;
	trackId: string;
}

export interface KeywordResponse {
	keywords: string[];
	trackId: string;
}

export interface BackToTrackResponse {
	message: ChatMessage;
	currentTrackId: null;
}

export interface RedoTrackResponse {
	message: ChatMessage;
	trackStatus: TrackStatus;
	currentTrackId: TrackId;
	removedNodeIds: string[];
}





export type LegacyTrackId = "academic" | "activities" | "values" | "future";

export const LEGACY_TRACK_MAPPING: Record<LegacyTrackId, TrackId> = {
	academic: "academic_journey",
	activities: "activities_impact",
	values: "values_turning_points",
	future: "future_vision",
};

export const REVERSE_TRACK_MAPPING: Record<TrackId, LegacyTrackId> = {
	academic_journey: "academic",
	activities_impact: "activities",
	values_turning_points: "values",
	future_vision: "future",
};









export interface Coverage {
	goals: number;
	evidence: number;
	skills: number;
	values: number;
	tensions: number;
}





export interface StarStructure {
	situation?: string;
	task?: string;
	action?: string;
	result?: string;
	emotion?: string;
	insight?: string;
}


export type GraphNodeLayer = 0 | 1 | 2 | 3;


export type GraphNodeType =
	| "profile_summary"
	| "essay_angle"
	| "key_story"
	| "detail";


export type ConnectionEdgeLabel =
	| "enables"
	| "builds_on"
	| "supports"
	| "complements";


export type TensionEdgeLabel =
	| "contradicts"
	| "evolved_from"
	| "challenged_by"
	| "transformed";


export type GraphEdgeLabel = ConnectionEdgeLabel | TensionEdgeLabel;


export type GraphEdgeType = "connection" | "tension";




export interface GraphNode {
	id: string;
	type: GraphNodeType;
	layer: GraphNodeLayer;
	title: string;
	content: string;
	structuredContent?: StarStructure;
	tags: string[];
	bestFor?: string[];
	wordCountPotential?: string;
	essayAngle?: string;
}




export interface GraphEdge {
	id: string;
	sourceNodeId: string;
	targetNodeId: string;
	edgeType: GraphEdgeType;
	label: GraphEdgeLabel;
	strength: number;
}




export interface ConversationMessage {
	id: string;
	role: "assistant" | "user";
	content: string;
	type: "text" | "question" | "completion";
	timestamp: string;
}





export interface GraphMessageResponse {
	message: ConversationMessage;
	nodesCreated: GraphNode[];
	edgesCreated: GraphEdge[];
	coverage: Coverage;
	voiceSample: string | null;
	completionReady: boolean;
	starGapsForLastStory: (keyof StarStructure)[] | null;
	totalNodeCount: number;
}





export interface ConversationStartResponse {
	message: ConversationMessage;
	coverage: Coverage;
	totalNodeCount: number;
}




export interface CoverageResponse {
	coverage: Coverage;
	completionReady: boolean;
	totalNodeCount: number;
}





export interface VoiceProfileResponse {
	personaId: string;
	sentenceStyle: string;
	toneMarkers: {
		formality: string;
		confidence: string;
		emotionLevel: string;
	};
	vocabularyPatterns: string[];
	sampleExcerpts: string[];
	sampleCount: number;
}




export interface NodeExpandResponse extends GraphMessageResponse {}




export interface ResetConversationResponse {
	success: boolean;
	message: ConversationMessage;
}




export interface PersonaGraphResponse {
	nodes: GraphNode[];
	edges: GraphEdge[];
	coverage: Coverage;
	completionReady: boolean;
}
````

## File: lib/utils/graphTransform.ts
````typescript
import {
	EDGE_CONFIG,
	GRAPH_EDGE_CONFIG,
	GRAPH_NODE_CONFIG,
	NODE_CONFIG,
} from "@/lib/config/graphConfig";
import { mockPersonaGraph } from "@/lib/mock/personaGraphData";
import type {
	GraphEdge,
	GraphEdgeLabel,
	GraphNode,
	GraphNodeType,
} from "@/lib/types/persona";
import type {
	ForceGraphLink,
	ForceGraphNode,
} from "@/lib/types/persona-canvas";

export function transformGraphData(): {
	nodes: ForceGraphNode[];
	links: ForceGraphLink[];
} {
	const nodes: ForceGraphNode[] = [];
	const links: ForceGraphLink[] = [];


	nodes.push({
		id: mockPersonaGraph.archetype.id,
		type: "archetype",
		label: `${mockPersonaGraph.archetype.primary_type.toUpperCase()}`,
		size: NODE_CONFIG.archetype.size,
		color: NODE_CONFIG.archetype.color,
		data: mockPersonaGraph.archetype,
	});


	for (const story of mockPersonaGraph.stories) {
		nodes.push({
			id: story.id,
			type: "story",
			label: story.title,
			size: NODE_CONFIG.story.size,
			color: NODE_CONFIG.story.color,
			data: story,
		});
	}


	for (const pattern of mockPersonaGraph.patterns) {
		nodes.push({
			id: pattern.id,
			type: "pattern",
			label: pattern.cluster_name,
			size: NODE_CONFIG.pattern.size,
			color: NODE_CONFIG.pattern.color,
			data: pattern,
		});
	}


	nodes.push({
		id: mockPersonaGraph.values.id,
		type: "value",
		label: "Value System",
		size: NODE_CONFIG.value.size,
		color: NODE_CONFIG.value.color,
		data: mockPersonaGraph.values,
	});


	for (const skill of mockPersonaGraph.skills) {
		nodes.push({
			id: skill.id,
			type: "skill",
			label: skill.skill_name,
			size: NODE_CONFIG.skill.size,
			color: NODE_CONFIG.skill.color,
			data: skill,
		});
	}


	for (const edge of mockPersonaGraph.edges) {
		const config = EDGE_CONFIG[edge.type as keyof typeof EDGE_CONFIG];
		links.push({
			source: edge.from,
			target: edge.to,
			type: edge.type,
			strength: edge.strength || 50,
			color: config?.color || "rgba(148, 163, 184, 0.3)",
		});
	}

	return { nodes, links };
}






export interface ApiForceGraphNode extends ForceGraphNode {
	layer: number;
	nodeData: GraphNode;
}

export interface ApiForceGraphLink extends ForceGraphLink {
	animated: boolean;
	pulseColor?: string;
	edgeType: "connection" | "tension";
	label: GraphEdgeLabel;
	width: number;
}






export function transformApiGraphData(
	nodes: GraphNode[],
	edges: GraphEdge[],
): {
	nodes: ApiForceGraphNode[];
	links: ApiForceGraphLink[];
} {
	const forceNodes: ApiForceGraphNode[] = nodes.map((node) => {
		const config = GRAPH_NODE_CONFIG[node.type as GraphNodeType];

		return {
			id: node.id,
			type: node.type,
			label: node.title,
			size: config?.size || 40,
			color: config?.color || "#94a3b8",
			data: node,

			layer: node.layer,
			nodeData: node,
		};
	});

	const forceLinks: ApiForceGraphLink[] = edges.map((edge) => {
		const edgeLabel = edge.label as keyof typeof GRAPH_EDGE_CONFIG;
		const config = GRAPH_EDGE_CONFIG[edgeLabel];
		const isAnimated = config?.animated || false;


		const pulseColor =
			isAnimated && "pulseColor" in config
				? (config.pulseColor as string)
				: undefined;

		return {
			source: edge.sourceNodeId,
			target: edge.targetNodeId,
			type: edge.label,
			strength: Math.round(edge.strength * 100),
			color: config?.color || "rgba(148, 163, 184, 0.3)",

			animated: isAnimated,
			pulseColor,
			edgeType: edge.edgeType,
			label: edge.label,
			width: config?.width || 2,
		};
	});

	return { nodes: forceNodes, links: forceLinks };
}




export function groupNodesByLayer(
	nodes: ApiForceGraphNode[],
): Record<number, ApiForceGraphNode[]> {
	const grouped: Record<number, ApiForceGraphNode[]> = {
		0: [],
		1: [],
		2: [],
		3: [],
	};

	for (const node of nodes) {
		const layer = node.layer;
		if (layer >= 0 && layer <= 3) {
			grouped[layer].push(node);
		}
	}

	return grouped;
}




export function getLayerRadius(layer: number): number {
	const radii: Record<number, number> = {
		0: 0,
		1: 150,
		2: 280,
		3: 450,
	};
	return radii[layer] || 300;
}




export function getTensionEdges(
	edges: ApiForceGraphLink[],
): ApiForceGraphLink[] {
	return edges.filter((edge) => edge.edgeType === "tension");
}




export function getConnectionEdges(
	edges: ApiForceGraphLink[],
): ApiForceGraphLink[] {
	return edges.filter((edge) => edge.edgeType === "connection");
}
````

## File: vercel.json
````json
{
	"$schema": "https://openapi.vercel.sh/vercel.json",
	"buildCommand": "npm run build",
	"framework": "nextjs",
	"cleanUrls": true,
	"installCommand": "npm install",
	"outputDirectory": ".next"
}
````

## File: app/(auth)/forgot-password/page.tsx
````typescript
"use client";

import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/services/auth";

type ForgotState = "form" | "sending" | "sent";

export default function ForgotPasswordPage() {
	const t = useTranslations("auth.forgotPassword");

	const [state, setState] = useState<ForgotState>("form");
	const [email, setEmail] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setState("sending");
		setError(null);

		try {
			await authService.forgotPassword(email);
			setState("sent");
		} catch (_err) {


			setState("sent");
		}
	};

	const handleTryAgain = () => {
		setState("form");
		setEmail("");
	};

	const renderContent = () => {
		switch (state) {
			case "sending":
				return (
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">{t("email")}</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder={t("emailPlaceholder")}
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled
								/>
							</Field>
							<Field>
								<Button type="submit" disabled className="w-full">
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t("sending")}
								</Button>
							</Field>
						</FieldGroup>
					</form>
				);

			case "sent":
				return (
					<div className="flex flex-col items-center gap-4 py-6">
						<div className="rounded-full bg-green-100 p-3">
							<CheckCircle2 className="h-12 w-12 text-green-600" />
						</div>
						<div className="text-center">
							<h3 className="text-xl font-semibold text-green-600">
								{t("emailSent")}
							</h3>
							<p className="mt-2 text-muted-foreground">
								{t("emailSentMessage")}
							</p>
							<p className="mt-2 text-sm text-muted-foreground">
								{t("checkSpam")}
							</p>
						</div>
						<div className="mt-4 flex w-full flex-col gap-2">
							<Button
								onClick={handleTryAgain}
								variant="outline"
								className="w-full"
							>
								{t("tryAgain")}
							</Button>
							<Link href="/login">
								<Button variant="ghost" className="w-full">
									<ArrowLeft className="mr-2 h-4 w-4" />
									{t("backToLogin")}
								</Button>
							</Link>
						</div>
					</div>
				);
			default:
				return (
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<div className="flex justify-center pb-4">
								<div className="rounded-full bg-primary/10 p-3">
									<Mail className="h-8 w-8 text-primary" />
								</div>
							</div>

							{error && (
								<p className="text-center text-sm text-red-500">{error}</p>
							)}

							<Field>
								<FieldLabel htmlFor="email">{t("email")}</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder={t("emailPlaceholder")}
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</Field>
							<Field>
								<Button type="submit" className="w-full">
									{t("sendLink")}
								</Button>
							</Field>
							<Field>
								<Link href="/login">
									<Button variant="ghost" className="w-full">
										<ArrowLeft className="mr-2 h-4 w-4" />
										{t("backToLogin")}
									</Button>
								</Link>
							</Field>
						</FieldGroup>
					</form>
				);
		}
	};

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link
					href="/"
					className="flex items-center gap-2 self-center font-medium"
				>
					<Image
						src="/Logo.png"
						alt="Leaply"
						width={120}
						height={40}
						className="h-10 w-auto"
					/>
				</Link>
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-xl">{t("title")}</CardTitle>
						<CardDescription>{t("subtitle")}</CardDescription>
					</CardHeader>
					<CardContent>{renderContent()}</CardContent>
				</Card>
			</div>
		</div>
	);
}
````

## File: app/(auth)/reset-password/page.tsx
````typescript
"use client";

import { Check, CheckCircle2, Loader2, Lock, X, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/services/auth";
import { cn } from "@/lib/utils";

type ResetState = "form" | "submitting" | "success" | "error";

interface PasswordRequirement {
	key: string;
	label: string;
	test: (password: string) => boolean;
}

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const t = useTranslations("auth.resetPassword");

	const token = searchParams.get("token");

	const [state, setState] = useState<ResetState>(token ? "form" : "error");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	// Redirect to forgot-password if no token
	useEffect(() => {
		if (!token) {
			router.replace("/forgot-password");
		}
	}, [token, router]);

	const passwordRequirements: PasswordRequirement[] = [
		{
			key: "minLength",
			label: t("minLength"),
			test: (p) => p.length >= 8,
		},
		{
			key: "uppercase",
			label: t("uppercase"),
			test: (p) => /[A-Z]/.test(p),
		},
		{
			key: "lowercase",
			label: t("lowercase"),
			test: (p) => /[a-z]/.test(p),
		},
		{
			key: "number",
			label: t("number"),
			test: (p) => /\d/.test(p),
		},
	];

	const isPasswordValid = passwordRequirements.every((req) =>
		req.test(newPassword),
	);
	const doPasswordsMatch =
		newPassword === confirmPassword && confirmPassword.length > 0;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isPasswordValid) {
			setError("Please meet all password requirements");
			return;
		}

		if (!doPasswordsMatch) {
			setError(t("passwordsNotMatch"));
			return;
		}

		if (!token) {
			setState("error");
			return;
		}

		setState("submitting");
		setError(null);

		try {
			await authService.resetPassword(token, newPassword);
			setState("success");
		} catch (err) {
			setState("error");
			setError(err instanceof Error ? err.message : "Password reset failed");
		}
	};

	const handleGoToLogin = () => {
		router.push("/login");
	};

	const renderContent = () => {
		switch (state) {
			case "submitting":
				return (
					<div className="flex flex-col items-center gap-4 py-8">
						<Loader2 className="h-12 w-12 animate-spin text-primary" />
						<p className="text-muted-foreground">{t("resetting")}</p>
					</div>
				);

			case "success":
				return (
					<div className="flex flex-col items-center gap-4 py-6">
						<div className="rounded-full bg-green-100 p-3">
							<CheckCircle2 className="h-12 w-12 text-green-600" />
						</div>
						<div className="text-center">
							<h3 className="text-xl font-semibold text-green-600">
								{t("success")}
							</h3>
							<p className="mt-2 text-muted-foreground">
								{t("successMessage")}
							</p>
						</div>
						<Button onClick={handleGoToLogin} className="mt-4 w-full">
							{t("goToLogin")}
						</Button>
					</div>
				);

			case "error":
				return (
					<div className="flex flex-col items-center gap-4 py-6">
						<div className="rounded-full bg-red-100 p-3">
							<XCircle className="h-12 w-12 text-red-600" />
						</div>
						<div className="text-center">
							<h3 className="text-xl font-semibold text-red-600">
								{t("invalidToken")}
							</h3>
							<p className="mt-2 text-muted-foreground">
								{t("invalidTokenMessage")}
							</p>
							{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
						</div>
						<Link href="/forgot-password" className="mt-4 w-full">
							<Button variant="outline" className="w-full">
								{t("requestNew")}
							</Button>
						</Link>
					</div>
				);
			default:
				return (
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<div className="flex justify-center pb-4">
								<div className="rounded-full bg-primary/10 p-3">
									<Lock className="h-8 w-8 text-primary" />
								</div>
							</div>

							{error && (
								<p className="text-center text-sm text-red-500">{error}</p>
							)}

							<Field>
								<FieldLabel htmlFor="newPassword">
									{t("newPassword")}
								</FieldLabel>
								<Input
									id="newPassword"
									type="password"
									placeholder={t("newPasswordPlaceholder")}
									required
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
								/>
							</Field>

							{}
							<div className="rounded-lg border bg-muted/50 p-3">
								<p className="mb-2 text-sm font-medium text-muted-foreground">
									{t("requirements")}
								</p>
								<ul className="space-y-1">
									{passwordRequirements.map((req) => {
										const isMet = req.test(newPassword);
										return (
											<li
												key={req.key}
												className={cn(
													"flex items-center gap-2 text-sm transition-colors",
													isMet ? "text-green-600" : "text-muted-foreground",
												)}
											>
												{isMet ? (
													<Check className="h-4 w-4" />
												) : (
													<X className="h-4 w-4" />
												)}
												{req.label}
											</li>
										);
									})}
								</ul>
							</div>

							<Field>
								<FieldLabel htmlFor="confirmPassword">
									{t("confirmPassword")}
								</FieldLabel>
								<Input
									id="confirmPassword"
									type="password"
									placeholder={t("confirmPasswordPlaceholder")}
									required
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
								{confirmPassword && !doPasswordsMatch && (
									<FieldDescription className="text-red-500">
										{t("passwordsNotMatch")}
									</FieldDescription>
								)}
								{doPasswordsMatch && (
									<FieldDescription className="text-green-600">
										<Check className="mr-1 inline h-3 w-3" />
										Passwords match
									</FieldDescription>
								)}
							</Field>

							<Field>
								<Button
									type="submit"
									className="w-full"
									disabled={!isPasswordValid || !doPasswordsMatch}
								>
									{t("resetPassword")}
								</Button>
							</Field>
						</FieldGroup>
					</form>
				);
		}
	};

	if (!token) {
		return null;
	}

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link
					href="/"
					className="flex items-center gap-2 self-center font-medium"
				>
					<Image
						src="/Logo.png"
						alt="Leaply"
						width={120}
						height={40}
						className="h-10 w-auto"
					/>
				</Link>
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-xl">{t("title")}</CardTitle>
						<CardDescription>{t("subtitle")}</CardDescription>
					</CardHeader>
					<CardContent>{renderContent()}</CardContent>
				</Card>
			</div>
		</div>
	);
}
````

## File: app/(auth)/verify-email/page.tsx
````typescript
"use client";

import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useResendVerification } from "@/lib/hooks/useResendVerification";
import { useVerifyEmail } from "@/lib/hooks/useVerifyEmail";
import { useUserStore } from "@/lib/store/userStore";

export default function VerifyEmailPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const t = useTranslations("auth.verifyEmail");
	const profile = useUserStore((state) => state.profile);

	const token = searchParams.get("token");


	const {
		error: verifyError,
		isLoading: isVerifying,
		isSuccess: verifySuccess,
	} = useVerifyEmail(token);


	const resendMutation = useResendVerification();

	const [countdown, setCountdown] = useState(0);


	useEffect(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [countdown]);

	const handleSendVerification = async () => {
		if (!profile?.email) return;

		try {
			await resendMutation.mutateAsync(profile.email);
			setCountdown(60);
		} catch (err) {
			console.error("Failed to resend verification", err);
		}
	};

	const handleResend = async () => {
		if (countdown > 0 || !profile?.email) return;
		await handleSendVerification();
	};

	const handleSkip = () => {
		router.push("/onboarding");
	};

	const handleGoToDashboard = () => {
		router.push("/dashboard");
	};


	const renderContent = () => {

		if (token) {
			if (isVerifying) {
				return (
					<div className="flex flex-col items-center gap-4 py-8">
						<Loader2 className="h-12 w-12 animate-spin text-primary" />
						<p className="text-muted-foreground">{t("verifying")}</p>
					</div>
				);
			}

			if (verifySuccess) {
				return (
					<div className="flex flex-col items-center gap-4 py-6">
						<div className="rounded-full bg-green-100 p-3">
							<CheckCircle2 className="h-12 w-12 text-green-600" />
						</div>
						<div className="text-center">
							<h3 className="text-xl font-semibold text-green-600">
								{t("success")}
							</h3>
							<p className="mt-2 text-muted-foreground">
								{t("successMessage")}
							</p>
						</div>
						<Button onClick={handleGoToDashboard} className="mt-4 w-full">
							{t("goToDashboard")}
						</Button>
					</div>
				);
			}

			if (verifyError) {
				return (
					<div className="flex flex-col items-center gap-4 py-6">
						<div className="rounded-full bg-red-100 p-3">
							<XCircle className="h-12 w-12 text-red-600" />
						</div>
						<div className="text-center">
							<h3 className="text-xl font-semibold text-red-600">
								{t("invalidToken")}
							</h3>
							<p className="mt-2 text-muted-foreground">
								{t("invalidTokenMessage")}
							</p>
							{verifyError instanceof Error && (
								<p className="mt-1 text-sm text-red-500">
									{verifyError.message}
								</p>
							)}
						</div>
						<Button
							onClick={handleSendVerification}
							variant="outline"
							className="mt-4 w-full"
						>
							{t("requestNew")}
						</Button>
					</div>
				);
			}
		}


		if (resendMutation.isSuccess) {
			return (
				<div className="flex flex-col items-center gap-4 py-6">
					<div className="rounded-full bg-green-100 p-3">
						<CheckCircle2 className="h-12 w-12 text-green-600" />
					</div>
					<div className="text-center">
						<h3 className="text-xl font-semibold text-green-600">
							{t("emailSent")}
						</h3>
						<p className="mt-2 text-muted-foreground">{t("checkInbox")}</p>
						{profile?.email && (
							<p className="mt-1 text-sm font-medium">{profile.email}</p>
						)}
					</div>
					<div className="mt-4 flex w-full flex-col gap-2">
						<Button
							onClick={handleResend}
							variant="outline"
							disabled={countdown > 0}
							className="w-full"
						>
							{countdown > 0 ? `${t("resendIn")} ${countdown}s` : t("resend")}
						</Button>
						<Button onClick={handleSkip} variant="ghost" className="w-full">
							{t("skipForNow")}
						</Button>
					</div>
				</div>
			);
		}


		return (
			<div className="flex flex-col items-center gap-4 py-6">
				<div className="rounded-full bg-primary/10 p-3">
					<Mail className="h-12 w-12 text-primary" />
				</div>
				<div className="text-center">
					<h3 className="text-xl font-semibold">{t("promptTitle")}</h3>
					<p className="mt-2 text-muted-foreground">{t("promptSubtitle")}</p>
					{profile?.email && (
						<p className="mt-1 text-sm font-medium">{profile.email}</p>
					)}
				</div>
				{resendMutation.error && (
					<p className="text-sm text-red-500">
						{resendMutation.error instanceof Error
							? resendMutation.error.message
							: "Failed to send verification email"}
					</p>
				)}
				<div className="mt-4 flex w-full flex-col gap-2">
					<Button
						onClick={handleSendVerification}
						disabled={resendMutation.isPending}
						className="w-full"
					>
						{resendMutation.isPending && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						{resendMutation.isPending ? t("sending") : t("sendVerification")}
					</Button>
					<Button onClick={handleSkip} variant="ghost" className="w-full">
						{t("skipForNow")}
					</Button>
				</div>
			</div>
		);
	};

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link
					href="/"
					className="flex items-center gap-2 self-center font-medium"
				>
					<Image src="/Logo.png" alt="Leaply" width={120} height={40} />
				</Link>
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-xl">{t("title")}</CardTitle>
						<CardDescription>{t("subtitle")}</CardDescription>
					</CardHeader>
					<CardContent>{renderContent()}</CardContent>
				</Card>
				{!token && !resendMutation.isSuccess && (
					<p className="px-6 text-center text-sm text-muted-foreground">
						{t("alreadyVerified")}{" "}
						<Link
							href="/dashboard"
							className="underline underline-offset-4 hover:text-primary"
						>
							{t("continueToApp")}
						</Link>
					</p>
				)}
			</div>
		</div>
	);
}
````

## File: app/layout.tsx
````typescript
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";


export const dynamic = "force-dynamic";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "Leaply - Study Abroad Simplified",
	description:
		"Your personal study abroad mentor. Find your perfect university match with AI-powered recommendations.",
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon.ico",
		apple: "/favicon.ico",
	},
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const locale = await getLocale();
	return (
		<html lang={locale}>
			<body className={raleway.variable}>
				<NextIntlClientProvider>
					<Providers>{children}</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
````

## File: components/explore/ExploreClient.tsx
````typescript
"use client";

import { Sparkles, Table } from "lucide-react";
import { useState } from "react";
import { SwimLanes } from "@/components/explore/AIMatchMode";
import { ManualMode } from "@/components/explore/ManualMode";
import { ProgramDetailDrawer } from "@/components/explore/ProgramDetailDrawer";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import type {
	AiMatchResponse,
	ProgramListItemResponse,
	ProgramListResponse,
} from "@/lib/api/types";
import { useAiMatch } from "@/lib/hooks/useAiMatch";
import { usePrograms, useSaveProgram } from "@/lib/hooks/usePrograms";
import {
	generateAiMatchResponse,
	generateMany,
	generateProgramListItemResponse,
} from "@/lib/mock";
import { MANUAL_MODE_PROGRAMS } from "@/lib/mock/manualModeData";
import { cn } from "@/lib/utils";


const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";


const MOCK_PROGRAMS = generateMany(generateProgramListItemResponse, 20);


const MOCK_MATCH_DATA: AiMatchResponse = generateAiMatchResponse();

interface ExploreClientProps {
	initialPrograms?: ProgramListResponse;
	initialAiMatch?: AiMatchResponse;
}




function ProgramCardSkeleton() {
	return (
		<div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm animate-pulse">
			<div className="p-4 border-b border-border">
				<div className="flex items-center gap-3">
					<div className="h-12 w-12 rounded-lg bg-muted" />
					<div className="flex-1 space-y-2">
						<div className="h-4 bg-muted rounded w-3/4" />
						<div className="h-3 bg-muted rounded w-1/2" />
					</div>
				</div>
			</div>
			<div className="p-4 space-y-4">
				<div className="h-5 bg-muted rounded w-full" />
				<div className="h-4 bg-muted rounded w-2/3" />
				<div className="bg-muted/30 rounded-lg p-4 space-y-3">
					<div className="h-6 bg-muted rounded w-1/3" />
					<div className="h-2 bg-muted rounded w-full" />
					<div className="space-y-2">
						<div className="h-3 bg-muted rounded w-4/5" />
						<div className="h-3 bg-muted rounded w-3/5" />
					</div>
				</div>
			</div>
			<div className="p-4 border-t border-border flex justify-between">
				<div className="h-9 w-9 bg-muted rounded-lg" />
				<div className="h-9 w-24 bg-muted rounded-lg" />
			</div>
		</div>
	);
}

export function ExploreClient({
	initialPrograms,
	initialAiMatch,
}: ExploreClientProps) {
	const [activeMode, setActiveMode] = useState<"ai" | "manual">("ai");


	const [selectedProgram, setSelectedProgram] =
		useState<ProgramListItemResponse | null>(null);
	const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);


	const { data: programsResponse } = usePrograms(
		{},
		USE_MOCK_DATA
			? {
					data: MOCK_PROGRAMS,
					pagination: {
						page: 1,
						size: 50,
						total: MOCK_PROGRAMS.length,
						totalPages: 1,
					},
				}
			: initialPrograms,
	);

	const {
		data: aiMatchData,
		isLoading: isLoadingAiMatch,
		error: aiMatchError,
	} = useAiMatch(USE_MOCK_DATA ? MOCK_MATCH_DATA : initialAiMatch);

	const saveMutation = useSaveProgram();


	const programs = programsResponse?.data ?? [];

	const handleSaveToggle = (id: string) => {
		const program = programs.find((p) => p.id === id);
		if (!program) return;


		saveMutation.mutate({ id, isSaved: program.isSaved ?? false });
	};


	const swimLanePrograms = aiMatchData
		? [
				...(aiMatchData.reach || []),
				...(aiMatchData.target || []),
				...(aiMatchData.safety || []),
			]
		: programs;

	return (
		<PageTransition className="flex flex-col min-h-screen">
			{}
			<div className="border-b border-border bg-card/80 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-foreground">
								Explore Programs
							</h1>
							<p className="text-sm text-muted-foreground mt-1">
								{aiMatchData?.totalMatched || programs.length} programs matched
								to your profile
							</p>
						</div>

						{}
						<div className="flex items-center bg-muted rounded-lg p-1">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setActiveMode("ai")}
								className={cn(
									"h-9 px-4 rounded-md gap-2",
									activeMode === "ai"
										? "bg-background shadow-sm"
										: "hover:bg-transparent",
								)}
							>
								<Sparkles className="w-4 h-4" />
								<span className="text-sm font-medium">AI Enhanced</span>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setActiveMode("manual")}
								className={cn(
									"h-9 px-4 rounded-md gap-2",
									activeMode === "manual"
										? "bg-background shadow-sm"
										: "hover:bg-transparent",
								)}
							>
								<Table className="w-4 h-4" />
								<span className="text-sm font-medium">Manual</span>
							</Button>
						</div>
					</div>
				</div>
			</div>

			{}
			<div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				{}
				{activeMode === "ai" && (
					<div className="space-y-6">
						{isLoadingAiMatch ? (
							<>
								{}
								<div className="bg-card border border-border rounded-xl p-6 animate-pulse">
									<div className="flex items-start gap-4">
										<div className="w-12 h-12 rounded-full bg-muted" />
										<div className="flex-1 space-y-3">
											<div className="h-5 bg-muted rounded w-1/3" />
											<div className="h-4 bg-muted rounded w-full" />
											<div className="h-4 bg-muted rounded w-4/5" />
										</div>
									</div>
								</div>

								{}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									{[1, 2, 3].map((i) => (
										<div key={i} className="space-y-4">
											<div className="h-6 bg-muted rounded w-24 mb-4" />
											<ProgramCardSkeleton />
											<ProgramCardSkeleton />
										</div>
									))}
								</div>
							</>
						) : aiMatchError && !aiMatchData ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
									<span className="text-2xl">⚠️</span>
								</div>
								<h2 className="text-xl font-semibold text-foreground mb-2">
									Failed to Load AI Matches
								</h2>
								<p className="text-muted-foreground mb-6">
									{aiMatchError instanceof Error
										? aiMatchError.message
										: "Unknown error"}
								</p>
								<button
									type="button"
									onClick={() => window.location.reload()}
									className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
								>
									Try Again
								</button>
							</div>
						) : (
							<>
								{}
								<SwimLanes
									programs={swimLanePrograms}
									onSaveToggle={handleSaveToggle}
									onProgramClick={(program) => {
										setSelectedProgram(program);
										setIsDetailDrawerOpen(true);
									}}
								/>

								{}
								<div className="text-center py-4">
									<p className="text-muted-foreground">
										💡 Recommendation: Apply to 2-3 Safety, 3-4 Target, 1-2
										Reach
									</p>
								</div>
							</>
						)}
					</div>
				)}

				{}
				{activeMode === "manual" && (
					<ManualMode
						programs={USE_MOCK_DATA ? MANUAL_MODE_PROGRAMS : programs}
					/>
				)}
			</div>

			{}
			<ProgramDetailDrawer
				program={selectedProgram}
				open={isDetailDrawerOpen}
				onOpenChange={setIsDetailDrawerOpen}
				onCompare={(id) => {
					console.log("Compare:", id);
					setIsDetailDrawerOpen(false);
				}}
				onAddToDashboard={(id) => {
					console.log("Add to dashboard:", id);
					setIsDetailDrawerOpen(false);
				}}
			/>
		</PageTransition>
	);
}
````

## File: components/marketing/Navbar.tsx
````typescript
"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/app/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store/userStore";
import { cn } from "@/lib/utils";

export function Navbar() {
	const tNav = useTranslations("nav");
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);


	const navLinks = [
		{ href: "/", labelKey: "home" },
		{ href: "/features", labelKey: "features" },
		{ href: "/about", labelKey: "about" },
	];

	return (
		<nav className="bg-card border-b border-border sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{}
					<Link href="/" className="flex items-center gap-2">
						<Image
							src="/Logo.png"
							alt="Leaply"
							width={120}
							height={40}
							className="h-8 w-auto"
						/>
					</Link>

					{}
					<div className="hidden md:flex items-center gap-6">
						{navLinks.map((link) => {
							const isActive =
								link.href === "/"
									? pathname === "/"
									: pathname === link.href || pathname?.startsWith(link.href);
							return (
								<Link
									key={link.href}
									href={link.href}
									className={cn(
										"text-sm font-medium transition-colors hover:text-primary",
										isActive ? "text-primary" : "text-foreground",
									)}
								>
									{tNav(link.labelKey)}
								</Link>
							);
						})}
					</div>

					{}
					<div className="hidden md:flex items-center gap-3">
						<LanguageSwitcher />
						{isAuthenticated ? (
							<Button size="sm" asChild>
								<Link href="/dashboard">{tNav("goToDashboard")}</Link>
							</Button>
						) : (
							<>
								<Button variant="ghost" size="sm" asChild>
									<Link href="/login">{tNav("login")}</Link>
								</Button>
								<Button size="sm" asChild>
									<Link href="/register">{tNav("getStarted")}</Link>
								</Button>
							</>
						)}
					</div>

					{}
					<div className="flex items-center gap-2 md:hidden">
						<LanguageSwitcher />
						<button
							type="button"
							className="p-2 text-foreground"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							{mobileMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>
					</div>
				</div>

				{}
				{mobileMenuOpen && (
					<div className="md:hidden py-4 border-t border-border">
						<div className="flex flex-col gap-4">
							{navLinks.map((link) => {
								const isActive =
									link.href === "/"
										? pathname === "/"
										: pathname === link.href || pathname?.startsWith(link.href);
								return (
									<Link
										key={link.href}
										href={link.href}
										className={cn(
											"text-sm font-medium",
											isActive ? "text-primary" : "text-foreground",
										)}
										onClick={() => setMobileMenuOpen(false)}
									>
										{tNav(link.labelKey)}
									</Link>
								);
							})}
							<div className="pt-4 border-t border-border flex flex-col gap-2">
								{isAuthenticated ? (
									<Button size="sm" className="w-full" asChild>
										<Link
											href="/dashboard"
											onClick={() => setMobileMenuOpen(false)}
										>
											{tNav("goToDashboard")}
										</Link>
									</Button>
								) : (
									<>
										<Button
											variant="outline"
											size="sm"
											className="w-full"
											asChild
										>
											<Link
												href="/login"
												onClick={() => setMobileMenuOpen(false)}
											>
												{tNav("login")}
											</Link>
										</Button>
										<Button size="sm" className="w-full" asChild>
											<Link
												href="/register"
												onClick={() => setMobileMenuOpen(false)}
											>
												{tNav("getStarted")}
											</Link>
										</Button>
									</>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
````

## File: components/ApplicationDashboard.tsx
````typescript
"use client";

import {
	AlertCircle,
	Calendar,
	CheckCircle2,
	ChevronRight,
	ExternalLink,
	FileText,
	Target,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ApplicationResponse } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface ApplicationDashboardProps {
	application: ApplicationResponse | null;
	onUpdateStatus?: (status: string) => Promise<boolean>;
	onDelete?: () => Promise<boolean>;
}

const statusConfig: Record<
	string,
	{
		label: string;
		variant: "default" | "secondary" | "outline" | "destructive";
		color: string;
	}
> = {
	planning: {
		label: "Planning",
		variant: "secondary",
		color: "text-muted-foreground bg-muted",
	},
	writing: {
		label: "Writing",
		variant: "outline",
		color: "text-blue-600 bg-blue-50",
	},
	submitted: {
		label: "Submitted",
		variant: "default",
		color: "text-primary bg-primary/10",
	},
	accepted: {
		label: "Accepted",
		variant: "default",
		color: "text-green-600 bg-green-50",
	},
	rejected: {
		label: "Rejected",
		variant: "destructive",
		color: "text-red-600 bg-red-50",
	},
};

const gapSeverityConfig: Record<
	string,
	{ color: string; icon: typeof AlertCircle }
> = {
	critical: {
		color: "text-red-600 bg-red-50 border-red-200",
		icon: AlertCircle,
	},
	warning: {
		color: "text-amber-600 bg-amber-50 border-amber-200",
		icon: AlertCircle,
	},
	info: {
		color: "text-blue-600 bg-blue-50 border-blue-200",
		icon: AlertCircle,
	},
};

export function ApplicationDashboard({
	application,
	onUpdateStatus,
	onDelete,
}: ApplicationDashboardProps) {
	const t = useTranslations("applications");
	const _router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	if (!application) {
		return (
			<div className="flex items-center justify-center h-full bg-muted/30">
				<div className="text-center">
					<FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-foreground mb-2">
						{t("noApplicationSelected")}
					</h3>
					<p className="text-muted-foreground mb-4">{t("selectApplication")}</p>
					<Button asChild>
						<Link href="/explore">
							{t("explorePrograms")}
							<ExternalLink className="w-4 h-4 ml-2" />
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	const config = statusConfig[application.status] || statusConfig.planning;


	const getDaysUntilDeadline = () => {
		if (!application.program.nextDeadline) return null;
		const deadline = new Date(application.program.nextDeadline);
		const now = new Date();
		const diff = deadline.getTime() - now.getTime();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	};

	const daysUntilDeadline = getDaysUntilDeadline();

	const handleStatusChange = async (newStatus: string) => {
		if (onUpdateStatus) {
			await onUpdateStatus(newStatus);
		}
	};

	const handleDelete = async () => {
		if (onDelete) {
			setIsDeleting(true);
			const success = await onDelete();
			setIsDeleting(false);
			if (success) {
				setDeleteDialogOpen(false);
			}
		}
	};

	return (
		<div className="flex-1 overflow-y-auto bg-muted/30">
			<div className="max-w-4xl mx-auto p-6 space-y-6">
				{}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl font-bold text-foreground mb-1">
							{application.program.universityName}
						</h1>
						<p className="text-lg text-muted-foreground">
							{application.program.programName}
						</p>
						{application.program.degreeName && (
							<p className="text-sm text-muted-foreground">
								{application.program.degreeName}
							</p>
						)}
					</div>
					<div className="flex items-center gap-2">
						<Badge variant={config.variant} className="text-sm">
							{t(`status.${application.status}`)}
						</Badge>
					</div>
				</div>

				{}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{}
					<Card className="bg-gradient-to-br from-primary/5 to-primary/10">
						<CardContent className="p-4">
							<div className="flex items-center gap-2 mb-1">
								<Target className="w-4 h-4 text-primary" />
								<span className="text-xs font-medium text-muted-foreground">
									{t("fitScore")}
								</span>
							</div>
							<p className="text-2xl font-bold text-primary">
								{application.fitScore || "—"}%
							</p>
							{application.fitCategory && (
								<Badge
									variant="outline"
									className={cn(
										"mt-1 text-xs capitalize",
										application.fitCategory === "safety" && "border-green-500",
										application.fitCategory === "target" && "border-blue-500",
										application.fitCategory === "reach" && "border-amber-500",
									)}
								>
									{application.fitCategory}
								</Badge>
							)}
						</CardContent>
					</Card>

					{}
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-2 mb-1">
								<CheckCircle2 className="w-4 h-4 text-muted-foreground" />
								<span className="text-xs font-medium text-muted-foreground">
									{t("status.label")}
								</span>
							</div>
							<Select
								value={application.status}
								onValueChange={handleStatusChange}
							>
								<SelectTrigger className="w-full h-8 text-sm mt-1">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="planning">
										{t("status.planning")}
									</SelectItem>
									<SelectItem value="writing">{t("status.writing")}</SelectItem>
									<SelectItem value="submitted">
										{t("status.submitted")}
									</SelectItem>
								</SelectContent>
							</Select>
						</CardContent>
					</Card>

					{}
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-2 mb-1">
								<FileText className="w-4 h-4 text-muted-foreground" />
								<span className="text-xs font-medium text-muted-foreground">
									{t("sopStatus")}
								</span>
							</div>
							<p className="text-lg font-semibold text-foreground capitalize">
								{application.sopStatus?.replace("_", " ") || t("notStarted")}
							</p>
						</CardContent>
					</Card>

					{}
					<Card
						className={cn(
							daysUntilDeadline !== null &&
								daysUntilDeadline <= 7 &&
								"border-red-200 bg-red-50",
						)}
					>
						<CardContent className="p-4">
							<div className="flex items-center gap-2 mb-1">
								<Calendar className="w-4 h-4 text-muted-foreground" />
								<span className="text-xs font-medium text-muted-foreground">
									{t("nextDeadline")}
								</span>
							</div>
							{application.program.nextDeadline ? (
								<>
									<p className="text-sm font-semibold text-foreground">
										{new Date(
											application.program.nextDeadline,
										).toLocaleDateString()}
									</p>
									{daysUntilDeadline !== null && (
										<p
											className={cn(
												"text-xs font-medium",
												daysUntilDeadline <= 7
													? "text-red-600"
													: daysUntilDeadline <= 30
														? "text-amber-600"
														: "text-muted-foreground",
											)}
										>
											{daysUntilDeadline} {t("daysRemaining")}
										</p>
									)}
								</>
							) : (
								<p className="text-sm text-muted-foreground">
									{t("noDeadline")}
								</p>
							)}
						</CardContent>
					</Card>
				</div>

				{}
				{application.gaps && application.gaps.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg">
								<AlertCircle className="w-5 h-5 text-amber-500" />
								{t("gapsToAddress")}
							</CardTitle>
							<CardDescription>{t("gapsDescription")}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{application.gaps.map((gap, index) => {
									const severityConfig =
										gapSeverityConfig[gap.severity] || gapSeverityConfig.info;
									return (
										<div
											key={index}
											className={cn(
												"flex items-start gap-3 p-3 rounded-lg border",
												severityConfig.color,
											)}
										>
											<severityConfig.icon className="w-5 h-5 mt-0.5 shrink-0" />
											<div>
												<p className="font-medium text-sm capitalize">
													{gap.field.replace("_", " ")}
												</p>
												<p className="text-sm opacity-80">{gap.message}</p>
											</div>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				)}

				{}
				{application.program.nextIntake && (
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">{t("intakeInfo")}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">
										{t("nextIntake")}
									</p>
									<p className="text-lg font-semibold">
										{application.program.nextIntake}
									</p>
								</div>
								<Button variant="outline" asChild>
									<Link href={`/explore/${application.program.id}`}>
										{t("viewProgramDetails")}
										<ChevronRight className="w-4 h-4 ml-1" />
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">{t("actions")}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-3">
							<Button asChild>
								<Link href={`/dashboard/applications/${application.id}/sop`}>
									<FileText className="w-4 h-4 mr-2" />
									{application.sopStatus === "not_started" ||
									!application.sopStatus
										? t("startSop")
										: t("continueSop")}
								</Link>
							</Button>

							<Button variant="outline" asChild>
								<Link href={`/explore/${application.program.id}`}>
									<ExternalLink className="w-4 h-4 mr-2" />
									{t("viewProgram")}
								</Link>
							</Button>

							<Dialog
								open={deleteDialogOpen}
								onOpenChange={setDeleteDialogOpen}
							>
								<DialogTrigger asChild>
									<Button variant="ghost" className="text-destructive">
										<Trash2 className="w-4 h-4 mr-2" />
										{t("removeApplication")}
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>{t("confirmRemove")}</DialogTitle>
										<DialogDescription>
											{t("confirmRemoveDescription", {
												program: application.program.programName,
												university: application.program.universityName,
											})}
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<Button
											variant="outline"
											onClick={() => setDeleteDialogOpen(false)}
										>
											{t("cancel")}
										</Button>
										<Button
											variant="destructive"
											onClick={handleDelete}
											disabled={isDeleting}
										>
											{isDeleting ? t("removing") : t("remove")}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					</CardContent>
				</Card>

				{}
				<div className="text-xs text-muted-foreground text-center">
					{t("addedOn")} {new Date(application.createdAt).toLocaleDateString()}
					{application.updatedAt !== application.createdAt && (
						<>
							{" "}
							• {t("lastUpdated")}{" "}
							{new Date(application.updatedAt).toLocaleDateString()}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
````

## File: components/ApplicationSidebar.tsx
````typescript
"use client";

import { AlertCircle, FileText, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ApplicationResponse } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface ApplicationSidebarProps {
	applications: ApplicationResponse[];
	selectedId: string | null;
	onSelectApplication: (id: string) => void;
	isLoading?: boolean;
}

const statusConfig: Record<
	string,
	{
		label: string;
		variant: "default" | "secondary" | "outline" | "destructive";
	}
> = {
	planning: { label: "Planning", variant: "secondary" },
	writing: { label: "Writing", variant: "outline" },
	submitted: { label: "Submitted", variant: "default" },
	accepted: { label: "Accepted", variant: "default" },
	rejected: { label: "Rejected", variant: "destructive" },
};

export function ApplicationSidebar({
	applications,
	selectedId,
	onSelectApplication,
	isLoading,
}: ApplicationSidebarProps) {
	const t = useTranslations("applications");
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");

	// Filter applications based on search (handle undefined safely)
	const filteredApplications = useMemo(() => {
		const apps = applications ?? [];
		if (!searchQuery) return apps;

		const query = searchQuery.toLowerCase();
		return apps.filter(
			(app) =>
				app.program?.universityName?.toLowerCase().includes(query) ||
				app.program?.programName?.toLowerCase().includes(query),
		);
	}, [applications, searchQuery]);

	// Get fit score color based on category
	const getFitScoreStyle = (
		fitScore?: number,
		fitCategory?: string,
	): string => {
		if (!fitScore) return "text-muted-foreground bg-muted";

		switch (fitCategory) {
			case "safety":
				return "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30";
			case "target":
				return "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30";
			case "reach":
				return "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30";
			default:
				if (fitScore >= 80) return "text-green-600 bg-green-50";
				if (fitScore >= 60) return "text-blue-600 bg-blue-50";
				return "text-amber-600 bg-amber-50";
		}
	};


	const getSopStatusBadge = (sopStatus?: string) => {
		if (!sopStatus || sopStatus === "not_started") return null;
		if (sopStatus === "in_progress") {
			return (
				<Badge variant="outline" className="text-xs">
					<FileText className="w-3 h-3 mr-1" />
					SOP Draft
				</Badge>
			);
		}
		if (sopStatus === "done") {
			return (
				<Badge variant="default" className="text-xs bg-green-600">
					<FileText className="w-3 h-3 mr-1" />
					SOP Done
				</Badge>
			);
		}
		return null;
	};

	const handleNewApplication = () => {
		router.push("/explore");
	};

	return (
		<div className="flex flex-col h-full bg-card border-r border-border">
			{}
			<div className="p-4 border-b border-border space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-foreground">
						{t("title")}
					</h2>
					<span className="text-sm text-muted-foreground">
						{applications?.length ?? 0}
					</span>
				</div>

				{}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						type="text"
						placeholder={t("searchUniversities")}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>

				{}
				<Button onClick={handleNewApplication} className="w-full" size="sm">
					<Plus className="w-4 h-4 mr-2" />
					{t("newApplication")}
				</Button>
			</div>

			{}
			<div className="flex-1 overflow-y-auto pb-4">
				{isLoading ? (
					<div className="p-4 space-y-3">
						{[1, 2, 3].map((i) => (
							<div key={i} className="animate-pulse">
								<div className="h-20 bg-muted rounded-lg" />
							</div>
						))}
					</div>
				) : filteredApplications.length === 0 ? (
					<div className="p-6 text-center">
						<FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
						<p className="text-sm text-muted-foreground mb-4">
							{searchQuery ? t("noApplicationsFound") : t("noApplicationsYet")}
						</p>
						{!searchQuery && (
							<Button
								onClick={handleNewApplication}
								variant="outline"
								size="sm"
							>
								<Plus className="w-4 h-4 mr-2" />
								{t("explorePrograms")}
							</Button>
						)}
					</div>
				) : (
					<div>
						{filteredApplications.map((app, index) => (
							<button
								type="button"
								key={app.id}
								onClick={() => onSelectApplication(app.id)}
								className={cn(
									"w-full px-4 py-4 text-left hover:bg-muted/50 transition-colors border-b border-border",
									selectedId === app.id &&
										"bg-primary/5 border-l-4 border-l-primary",
									index === filteredApplications.length - 1 && "border-b-0",
								)}
							>
								{}
								<div className="mb-2">
									<h3 className="font-semibold text-foreground text-sm truncate">
										{app.program.universityName}
									</h3>
									<p className="text-xs text-muted-foreground truncate">
										{app.program.programName}
									</p>
								</div>

								{}
								<div className="flex items-center justify-between gap-2 mb-2">
									{}
									{app.fitScore && (
										<span
											className={cn(
												"inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold",
												getFitScoreStyle(app.fitScore, app.fitCategory),
											)}
										>
											{app.fitScore}% {t("match")}
										</span>
									)}

									{}
									<Badge
										variant={statusConfig[app.status]?.variant || "secondary"}
										className="text-xs"
									>
										{t(`status.${app.status}`)}
									</Badge>
								</div>

								{}
								{app.gaps && app.gaps.length > 0 && (
									<div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
										<AlertCircle className="w-3 h-3" />
										<span>
											{app.gaps.length} {t("gapsToAddress")}
										</span>
									</div>
								)}

								{}
								{getSopStatusBadge(app.sopStatus)}

								{}
								{app.program.nextDeadline && (
									<div className="mt-2 text-xs text-muted-foreground">
										Deadline:{" "}
										{new Date(app.program.nextDeadline).toLocaleDateString()}
									</div>
								)}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
````

## File: i18n/request.ts
````typescript
import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const SUPPORTED_LOCALES = ["vi", "en"];

export default getRequestConfig(async () => {
	let locale = "vi";

	try {
		const store = await cookies();
		const cookieLocale = store.get("locale")?.value;

		if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
			locale = cookieLocale;
		}
	} catch {


	}

	return {
		locale,
		messages: (await import(`../messages/${locale}.json`)).default,
	};
});
````

## File: lib/config/graphConfig.ts
````typescript
export const NODE_CONFIG = {
	archetype: {
		color: "#f59e0b",
		hoverColor: "#d97706",
		size: 20,
		layer: 0,
		label: "Archetype",
	},
	pattern: {
		color: "#8b5cf6",
		hoverColor: "#7c3aed",
		size: 12,
		layer: 1,
		label: "Pattern",
	},
	value: {
		color: "#10b981",
		hoverColor: "#059669",
		size: 10,
		layer: 2,
		label: "Values",
	},
	skill: {
		color: "#ec4899",
		hoverColor: "#db2777",
		size: 10,
		layer: 2,
		label: "Skill",
	},
	story: {
		color: "#3b82f6",
		hoverColor: "#2563eb",
		size: 6,
		layer: 3,
		label: "Story",
	},
} as const;


export const EDGE_CONFIG = {
	member_of: { color: "rgba(59, 130, 246, 0.3)", width: 2 },
	evidences: { color: "rgba(245, 158, 11, 0.4)", width: 3 },
	supports: { color: "rgba(16, 185, 129, 0.3)", width: 2 },
	conflicts: { color: "rgba(239, 68, 68, 0.5)", width: 1.5, dashed: true },
	demonstrates: { color: "rgba(236, 72, 153, 0.3)", width: 2 },
} as const;






export const GRAPH_NODE_CONFIG = {
	profile_summary: {
		color: "#f59e0b",
		hoverColor: "#d97706",
		size: 24,
		layer: 0,
		label: "Profile",
		description: "Overall profile with archetype",
	},
	essay_angle: {
		color: "#8b5cf6",
		hoverColor: "#7c3aed",
		size: 16,
		layer: 1,
		label: "Essay Angle",
		description: "Patterns and themes for essays",
	},
	key_story: {
		color: "#10b981",
		hoverColor: "#059669",
		size: 12,
		layer: 2,
		label: "Story",
		description: "Complete narratives with STAR structure",
	},
	detail: {
		color: "#3b82f6",
		hoverColor: "#2563eb",
		size: 8,
		layer: 3,
		label: "Detail",
		description: "Specific achievements and evidence",
	},
} as const;







export const GRAPH_EDGE_CONFIG = {

	enables: {
		color: "rgba(59, 130, 246, 0.4)",
		width: 2,
		animated: false,
	},
	builds_on: {
		color: "rgba(16, 185, 129, 0.4)",
		width: 2,
		animated: false,
	},
	supports: {
		color: "rgba(139, 92, 246, 0.3)",
		width: 2,
		animated: false,
	},
	complements: {
		color: "rgba(148, 163, 184, 0.3)",
		width: 1.5,
		animated: false,
	},


	contradicts: {
		color: "rgba(249, 115, 22, 0.6)",
		width: 2.5,
		animated: true,
		pulseColor: "rgba(249, 115, 22, 0.3)",
	},
	evolved_from: {
		color: "rgba(251, 146, 60, 0.5)",
		width: 2,
		animated: true,
		pulseColor: "rgba(251, 146, 60, 0.2)",
	},
	challenged_by: {
		color: "rgba(234, 88, 12, 0.6)",
		width: 2.5,
		animated: true,
		pulseColor: "rgba(234, 88, 12, 0.3)",
	},
	transformed: {
		color: "rgba(253, 186, 116, 0.5)",
		width: 2,
		animated: true,
		pulseColor: "rgba(253, 186, 116, 0.2)",
	},
} as const;


export function isTensionEdge(
	edgeType: keyof typeof GRAPH_EDGE_CONFIG,
): boolean {
	return [
		"contradicts",
		"evolved_from",
		"challenged_by",
		"transformed",
	].includes(edgeType);
}


export const COVERAGE_COLORS = {
	goals: "#8b5cf6",
	evidence: "#3b82f6",
	skills: "#10b981",
	values: "#f59e0b",
	tensions: "#f97316",
} as const;


export const COVERAGE_LABELS = {
	goals: "Goals",
	evidence: "Evidence",
	skills: "Skills",
	values: "Values",
	tensions: "Tensions",
} as const;






export const ALL_NODE_CONFIG = {

	...NODE_CONFIG,

	...GRAPH_NODE_CONFIG,
} as const;


export function getNodeConfig(nodeType: string) {
	return (
		ALL_NODE_CONFIG[nodeType as keyof typeof ALL_NODE_CONFIG] || {
			color: "#94a3b8",
			hoverColor: "#64748b",
			size: 10,
			layer: 2,
			label: nodeType,
		}
	);
}


export type LegacyNodeType = keyof typeof NODE_CONFIG;
export type GraphNodeType = keyof typeof GRAPH_NODE_CONFIG;
export type AllNodeType = keyof typeof ALL_NODE_CONFIG;
export type GraphEdgeLabel = keyof typeof GRAPH_EDGE_CONFIG;
export type CoverageCategory = keyof typeof COVERAGE_COLORS;
````

## File: lib/store/applicationsStore.ts
````typescript
import * as Sentry from "@sentry/nextjs";
import { create } from "zustand";
import {
	createApplication,
	deleteApplication as deleteApplicationApi,
	getApplications,
	updateApplication as updateApplicationApi,
} from "@/lib/api/applicationsApi";
import type {
	ApplicationListResponse,
	ApplicationResponse,
	ApplicationSummaryDto,
	CreateApplicationRequest,
	UpcomingDeadlineDto,
	UpdateApplicationRequest,
} from "@/lib/api/types";

interface ApplicationsState {

	applications: ApplicationResponse[];
	summary: ApplicationSummaryDto | null;
	upcomingDeadlines: UpcomingDeadlineDto[];


	isLoading: boolean;
	error: string | null;
	selectedApplicationId: string | null;


	fetchApplications: () => Promise<void>;
	addApplication: (request: CreateApplicationRequest) => Promise<string | null>;
	updateApplicationStatus: (
		id: string,
		request: UpdateApplicationRequest,
	) => Promise<boolean>;
	removeApplication: (id: string) => Promise<boolean>;
	setSelectedApplication: (id: string | null) => void;
	getSelectedApplication: () => ApplicationResponse | null;
	clearError: () => void;
}

export const useApplicationsStore = create<ApplicationsState>((set, get) => ({

	applications: [],
	summary: null,
	upcomingDeadlines: [],
	isLoading: false,
	error: null,
	selectedApplicationId: null,


	fetchApplications: async () => {
		set({ isLoading: true, error: null });
		try {
			const response: ApplicationListResponse = await getApplications();
			set({
				applications: response.applications,
				summary: response.summary,
				upcomingDeadlines: response.upcomingDeadlines,
				isLoading: false,
			});


			const state = get();
			if (!state.selectedApplicationId && response.applications.length > 0) {
				set({ selectedApplicationId: response.applications[0].id });
			}
		} catch (error) {

			if (!(error instanceof Error && error.name === "ApiError")) {
				Sentry.captureException(error, {
					tags: { store: "applications", action: "fetch" },
				});
			}
			console.error("Failed to fetch applications:", error);
			set({
				isLoading: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to load applications",
			});
		}
	},


	addApplication: async (request: CreateApplicationRequest) => {
		set({ isLoading: true, error: null });
		try {
			const response = await createApplication(request);


			await get().fetchApplications();


			set({ selectedApplicationId: response.id });

			return response.id;
		} catch (error) {

			if (!(error instanceof Error && error.name === "ApiError")) {
				Sentry.captureException(error, {
					tags: { store: "applications", action: "create" },
				});
			}
			console.error("Failed to create application:", error);
			set({
				isLoading: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to add program to applications",
			});
			return null;
		}
	},


	updateApplicationStatus: async (
		id: string,
		request: UpdateApplicationRequest,
	) => {
		try {
			await updateApplicationApi(id, request);


			set((state) => ({
				applications: state.applications.map((app) =>
					app.id === id
						? { ...app, status: request.status || app.status }
						: app,
				),
			}));

			return true;
		} catch (error) {

			if (!(error instanceof Error && error.name === "ApiError")) {
				Sentry.captureException(error, {
					tags: { store: "applications", action: "update" },
				});
			}
			console.error("Failed to update application:", error);
			set({
				error:
					error instanceof Error
						? error.message
						: "Failed to update application",
			});
			return false;
		}
	},


	removeApplication: async (id: string) => {
		try {
			await deleteApplicationApi(id);


			set((state) => {
				const newApplications = state.applications.filter(
					(app) => app.id !== id,
				);
				const newSelectedId =
					state.selectedApplicationId === id
						? newApplications[0]?.id || null
						: state.selectedApplicationId;

				return {
					applications: newApplications,
					selectedApplicationId: newSelectedId,
					summary: state.summary
						? { ...state.summary, total: state.summary.total - 1 }
						: null,
				};
			});

			return true;
		} catch (error) {

			if (!(error instanceof Error && error.name === "ApiError")) {
				Sentry.captureException(error, {
					tags: { store: "applications", action: "delete" },
				});
			}
			console.error("Failed to delete application:", error);
			set({
				error:
					error instanceof Error
						? error.message
						: "Failed to remove application",
			});
			return false;
		}
	},


	setSelectedApplication: (id: string | null) => {
		set({ selectedApplicationId: id });
	},


	getSelectedApplication: () => {
		const state = get();
		return (
			state.applications.find(
				(app) => app.id === state.selectedApplicationId,
			) || null
		);
	},


	clearError: () => {
		set({ error: null });
	},
}));
````

## File: .mcp.json
````json
{
	"mcpServers": {
		"context7": {
			"command": "npx",
			"args": ["-y", "@upstash/context7-mcp@latest"]
		},
		"shadcn": {
			"command": "npx",
			"args": ["shadcn@latest", "mcp"]
		},
		"next-devtools": {
			"command": "npx",
			"args": ["-y", "next-devtools-mcp@latest"]
		}
	}
}
````

## File: CLAUDE.md
````markdown
# Leaply Claude Code Configuration

## Stack

- **Next.js 16.1.1** App Router + **React 19.2.1**
- **TypeScript 5.9** + **Tailwind CSS 4.1** + **Lucide** icons
- **shadcn/ui** (New York style) + **next-intl** (i18n)
- **TanStack Query v5** (React Query) - Server state management
- **Zustand** - Client state (auth) + **Framer Motion** animations
- **Bun 1.3.3** runtime
- **Biome 2.3** linting/formatting
- **Knip 5.80** dead code removal

## Core Principles

- **Client Components primary** - Current app uses `'use client'` extensively (marketing pages, animations)
- **API-based architecture** - Backend API at `NEXT_PUBLIC_API_URL` with mock data fallback
- **Accessibility-first** - Full keyboard/screen reader support
- **Type safety** - TypeScript strict mode
- **i18n ready** - next-intl for internationalization

## Code Quality Standards

**Clean Code Principles (apply rigorously):**
- **SOLID** - Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion
- **DRY** - Don't Repeat Yourself (extract reusable logic)
- **KISS** - Keep It Simple, Stupid (avoid over-engineering)
- **YAGNI** - You Aren't Gonna Need It (don't add speculative features)

**Web Security (OWASP Top 10 + SANS CWE):**
- A01: Broken Access Control
- A02: Cryptographic Failures
- A03: Injection (SQL, XSS, Command)
- A07: Identification/Authentication Failures
- A08: Software/Data Integrity Failures
- Always validate, sanitize, escape user input
- Use parameterized queries, CSP headers, HTTPS only

**MCP Tools Available:**
- **next-devtools** - Next.js docs, runtime inspection, migrations
- **shadcn** - Component search, examples, installation
- **context7** - Any library documentation lookup

**When Uncertain:**
- **STOP and ASK** - If you don't know how to implement something correctly, ask the user for clarification
- Never guess security-critical implementations
- Never invent APIs - use MCP to lookup docs

## Code Change Checklist

**REQUIRED: Apply this checklist to EVERY code change before implementation:**

**1. Security Review**
- [ ] Input validation with Zod (forms, API params, user data)
- [ ] XSS prevention (sanitize/escape user content)
- [ ] SQL injection prevention (use parameterized queries/ORMs)
- [ ] Authentication/authorization checks in place
- [ ] No sensitive data in client code or logs
- [ ] HTTPS only for API calls
- [ ] Rate limiting on public endpoints

**2. Code Quality**
- [ ] SOLID principles applied (single responsibility per function/component)
- [ ] DRY - no code duplication (extract reusable logic)
- [ ] KISS - simplest solution that works
- [ ] YAGNI - only implement what's requested
- [ ] Meaningful variable/function names
- [ ] No magic numbers/strings (use constants)
- [ ] Proper error handling (try/catch, error boundaries)

**3. TypeScript**
- [ ] Full type safety (no `any`, use proper types)
- [ ] Zod schemas for runtime validation
- [ ] Type imports from proper sources

**4. React/Next.js Best Practices**
- [ ] Use Client Component (`'use client'`) only when needed
- [ ] Proper use of hooks (useEffect cleanup, dependency arrays)
- [ ] **TanStack Query for data fetching** (not useEffect)
- [ ] Follow established patterns: Server Component wrapper → Client Component with hooks
- [ ] Accessibility (ARIA labels, keyboard navigation, semantic HTML)
- [ ] Performance (memoization, lazy loading if needed)

**5. UI Implementation (shadcn/ui first)**
- [ ] **BEFORE implementing ANY UI component:**
  - Search shadcn MCP: `search_items_in_registries` for the component
  - Check examples: `get_item_examples_from_registries` for usage patterns
  - If exists: Install via `bunx shadcn@latest add [component]` (or `npx`)
  - Only build custom if shadcn doesn't have it
- [ ] Use installed components from `components/ui/`
- [ ] Follow New York style conventions
- [ ] Maintain Tailwind CSS + Lucide icons consistency

**6. Code Formatting**
- [ ] Run `bun check` (or `npm run check`) before committing
- [ ] Tabs for indentation, double quotes
- [ ] Auto-organized imports (Biome)

**7. Before Commit**
- [ ] Build passes (`bun build` or `npm run build`)
- [ ] No Biome errors (`bun check:ci` or `npm run check:ci`)
- [ ] No unused code (`bun knip` or `npm run knip`)
- [ ] Test in browser if UI change
- [ ] Review git diff for unintended changes

## Runtime Preference

**Runtime Detection (check BEFORE running commands):**

```bash
# Check if Bun is available
which bun  # or: bun --version
```

**If Bun is installed (preferred):**
- Use `bun` commands (faster, better performance)
- Bun 1.3.3+ recommended

**If Bun is NOT installed:**
- Fall back to `npm` commands (Node.js 18+)
- Use `npx` instead of `bunx`
- Project works fine with npm, just slower

**Installation (optional, recommended):**
- macOS/Linux: `curl -fsSL https://bun.sh/install | bash`
- Windows: `powershell -c "irm bun.sh/install.ps1 | iex"`

## Commands

**Detect runtime first, then use appropriate commands:**

```bash
# Development (use bun if available, otherwise npm)
bun install  OR  npm install
bun dev      OR  npm run dev
bun build    OR  npm run build
bun start    OR  npm start

# Code quality (Biome)
bun check       OR  npm run check       # lint + format + fix
bun check:ci    OR  npm run check:ci    # CI mode, no fixes
bun format      OR  npm run format      # format only
bun lint        OR  npm run lint        # lint only
bun knip        OR  npm run knip        # find unused code

# Components
bunx shadcn@latest add [component]  OR  npx shadcn@latest add [component]
```

## Security Checklist

- [ ] Zod for validation
- [ ] Environment vars: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_USE_MOCK_DATA`
- [ ] Rate limiting
- [ ] CSP headers to next.config.ts

## TanStack Query Patterns

**Creating Query Hooks:**
```typescript
// lib/hooks/useHomeData.ts
import { useQuery } from "@tanstack/react-query";
import { getHomeData } from "@/lib/api/homeApi";
import type { HomeResponse } from "@/lib/api/types";

export function useHomeData(initialData?: HomeResponse) {
  return useQuery({
    queryKey: ["homeData"],
    queryFn: getHomeData,
    initialData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

**Creating Mutation Hooks with Optimistic Updates:**
```typescript
// lib/hooks/usePrograms.ts
export function useSaveProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isSaved }) =>
      isSaved ? exploreApi.unsaveProgram(id) : exploreApi.saveProgram(id),
    onMutate: async ({ id, isSaved }) => {
      await queryClient.cancelQueries({ queryKey: ["programs"] });
      const previousPrograms = queryClient.getQueryData(["programs"]);

      // Optimistic update
      queryClient.setQueriesData({ queryKey: ["programs"] }, (old) => {
        // Update UI immediately
      });

      return { previousPrograms }; // For rollback
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPrograms) {
        queryClient.setQueryData(["programs"], context.previousPrograms);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
}
```

**Using Hooks in Components:**
```typescript
"use client";
export function ExploreClient() {
  // Query
  const { data, isLoading, error } = usePrograms(filters);

  // Mutation
  const saveMutation = useSaveProgram();

  const handleSave = (id: string) => {
    saveMutation.mutate({ id, isSaved: false });
  };

  return <>{/* UI */}</>;
}
```

**File Naming Convention:**
- Custom hooks: `lib/hooks/useFeatureName.ts` (camelCase)
- Client components: `components/feature/FeatureClient.tsx` (PascalCase)
- Server components: `app/(app)/feature/page.tsx`

**Benefits:**
- ✅ Automatic caching and deduplication
- ✅ No double fetches in React Strict Mode
- ✅ Optimistic updates with automatic rollback
- ✅ Built-in loading/error states
- ✅ Background refetching and stale-while-revalidate

## Documentation Lookup

**Always use MCP tools - never guess APIs:**

- **Next.js:** next-devtools MCP (init, docs, index, call) or Context7 → `/vercel/next.js`
- **React:** Context7 → `/facebook/react`
- **TanStack Query:** Context7 → `/tanstack/query` (use for advanced patterns)
- **shadcn/ui:** shadcn MCP (search, view, get_examples, add_command)
- **Other libs:** Context7 → `resolve-library-id` then `query-docs`

**Migrations:** Use next-devtools MCP (upgrade_nextjs_16, enable_cache_components) + codemods

## File Conventions (App Router)

- `page.tsx` - Route UI
- `layout.tsx` - Shared layout
- `loading.tsx` - Suspense fallback
- `error.tsx` - Error boundary (Client Component)
- `not-found.tsx` - 404
- `route.ts` - API handler

## Current Architecture

**Data Flow:**
- **TanStack Query** for all server state (API data fetching, caching, mutations)
- External API calls via `NEXT_PUBLIC_API_URL`
- Mock data fallback when `NEXT_PUBLIC_USE_MOCK_DATA=true`
- Client-side data fetching (Server Components can't access browser-based auth)
- Zustand for client state (authentication tokens)
- No Server Actions currently implemented

**Authentication:**
- **Cookie-based** (`leaply-auth-state`) - Used by proxy.ts for route protection
- **Zustand store** (`useUserStore`) - Provides Bearer token for API client
- **proxy.ts** (Next.js 16) - Protects routes, redirects unauthenticated users

**TanStack Query Setup:**
- **Provider:** `app/providers/query-provider.tsx` - Global QueryClient config
- **Hooks:** `lib/hooks/use*.ts` - Custom hooks for queries/mutations (camelCase naming)
- **Cache:** 1min default staleTime, 5min gcTime, no window refocus
- **DevTools:** Available in development mode

**Data Fetching Pattern:**
```typescript
// Server Component (page.tsx)
export default function DashboardPage() {
  return <DashboardClient />; // Simple wrapper, no SSR
}

// Client Component (*Client.tsx)
"use client";
export function DashboardClient() {
  const { data, isLoading, error } = useHomeData(); // TanStack Query hook
  // Render UI with data
}
```

**Why Client-Only Fetching:**
- Server Components can't access Zustand store (browser-only)
- Avoids 403 errors when server lacks auth token
- TanStack Query provides caching benefits even without SSR
- Can be enhanced with cookie-based SSR later (optional)

**Route Groups:**
- `(auth)`: login, register, verify-email, forgot/reset-password
- `(marketing)`: landing, about, features, resources, privacy, tos
- `(app)`: dashboard, applications, explore, persona-lab, profile
- `oauth`: OAuth success handling
- `onboarding`: user onboarding flow

## Installed Components

alert, avatar, badge, button, card, dialog, dropdown-menu, field, input, label, progress, scroll-area, select, separator, skeleton, tabs, toggle, toggle-group

**shadcn config:** New York style, slate base, CSS variables, Lucide icons

## Key Dependencies

- **Data:** @tanstack/react-query v5, @tanstack/react-query-devtools
- **Viz:** @xyflow/react, react-force-graph-2d, d3-force
- **UI:** framer-motion, class-variance-authority, clsx, tailwind-merge
- **State:** zustand (client state)
- **Utils:** js-cookie, next-intl
- **Radix:** 10+ primitives (dialog, dropdown, select, tabs, etc.)

## Deployment Checklist

- [ ] Build passes (`bun run build`)
- [ ] Biome clean (`bun check:ci`)
- [ ] Knip clean (`bun knip`)
- [ ] Env vars: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_USE_MOCK_DATA`
- [ ] Implement Zod validation for forms
- [ ] Add rate limiting + CSP headers
- [ ] Test i18n locales

## Biome Config

- **Format:** Tabs, double quotes
- **VCS:** Git integration enabled
- **CSS:** Tailwind directives support
- **Assist:** Auto-organize imports

## Path Aliases

```typescript
@/*            → ./*
@/components/* → ./components/*
@/lib/*        → ./lib/*
@/app/*        → ./app/*
```
````

## File: instrumentation-client.ts
````typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: "https://e57948157cff4cc9a0dd76a2a338fb15@app.glitchtip.com/19431",


	tracesSampleRate: 1,

	enableLogs: true,




	replaysSessionSampleRate: 0.1,


	replaysOnErrorSampleRate: 1.0,



	sendDefaultPii: true,



	beforeSend(event) {

		if (event.exception && event.event_id) {
			Sentry.showReportDialog({
				eventId: event.event_id,

				title: "It looks like we're having issues.",
				subtitle: "Our team has been notified.",
				subtitle2: "If you'd like to help, tell us what happened below.",
				labelName: "Name",
				labelEmail: "Email",
				labelComments: "What happened?",
				labelClose: "Close",
				labelSubmit: "Submit",

				errorGeneric:
					"An unknown error occurred while submitting your report. Please try again.",
				errorFormEntry:
					"Some fields were invalid. Please correct the errors and try again.",
				successMessage: "Your feedback has been sent. Thank you!",
			});
		}
		return event;
	},
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
````

## File: app/(app)/explore/page.tsx
````typescript
import { ExploreClient } from "@/components/explore/ExploreClient";

export default function ExplorePage() {
	return <ExploreClient />;
}
````

## File: components/onboarding/OnboardingClient.tsx
````typescript
"use client";

import { AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { PageTransition } from "@/components/PageTransition";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { onboardingService } from "@/lib/services/onboarding";
import { userService } from "@/lib/services/user";
import { type JourneyType, useUserStore } from "@/lib/store/userStore";
import { OnboardingHeader } from "./OnboardingHeader";
import {
	Step1BasicInfo,
	Step2Preferences,
	Step3Plan,
	Step4JourneySelection,
	Step5Completion,
} from "./steps";
import type {
	BasicInfo,
	OnboardingConstants,
	OnboardingTranslations,
	Preferences,
} from "./types";

interface OnboardingClientProps {
	translations: OnboardingTranslations;
	constants: OnboardingConstants;
}

export function OnboardingClient({
	translations,
	constants,
}: OnboardingClientProps) {
	const router = useRouter();
	const {
		profile,
		updateProfile,
		preferences,
		updatePreferences,
		completeOnboarding,
		setJourneyType,
	} = useUserStore();

	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);


	const [basicInfo, setBasicInfo] = useState<BasicInfo>({
		educationLevel: profile?.currentEducationLevel || "",
		targetDegree: profile?.targetDegree || "",
	});

	const [prefs, setPrefs] = useState<Preferences>({
		fields: preferences?.fieldOfInterest || [],
		regions: preferences?.preferredRegions || [],
		startYear: "",
		startTerm: "",
		budgetIndex: 1,
	});

	const [selectedJourney, setSelectedJourney] = useState<JourneyType | null>(
		null,
	);

	// --- Load Initial Data ---
	useEffect(() => {
		const loadOnboardingData = async () => {
			try {
				setIsLoading(true);
				console.log("OnboardingClient: Starting data load...");

				// Get onboarding status to determine starting step
				const status = await onboardingService
					.getOnboardingStatus()
					.catch((error) => {
						console.warn(
							"OnboardingClient: Status fetch failed, defaulting to 0",
							error,
						);

						if (error?.status === 404 || error?.message?.includes("404")) {
							return { completedSteps: 0, isComplete: false };
						}
						return { completedSteps: 0, isComplete: false };
					});

				console.log("OnboardingClient: Status received:", status);


				if (status?.isComplete) {
					console.log(
						"OnboardingClient: Onboarding complete, redirecting to dashboard",
					);
					completeOnboarding();
					router.push(`/dashboard`);
					return;
				}



				const startingStep = Math.min(
					Math.max(status?.completedSteps || 0, 0),
					4,
				);
				console.log(
					`OnboardingClient: Setting initial step to ${startingStep}`,
				);
				setCurrentStep(startingStep);


				const [profileData, preferencesData] = await Promise.all([
					userService.getProfile().catch((e) => {
						console.warn("OnboardingClient: Failed to fetch profile", e);
						return null;
					}),
					userService.getPreferences().catch((e) => {
						console.warn("OnboardingClient: Failed to fetch preferences", e);
						return null;
					}),
				]);


				if (profileData) {
					console.log("OnboardingClient: Populating basic info");
					setBasicInfo({
						educationLevel: profileData.currentEducationLevel || "",
						targetDegree: profileData.targetDegree || "",
					});
				}

				if (preferencesData) {
					console.log("OnboardingClient: Populating preferences");

					const timeline = preferencesData.intendedStartTerm || "";
					const parts = timeline.split(" ");
					const year = parts[0] || "";
					const term = parts.slice(1).join(" ") || "";

					setPrefs({
						fields: preferencesData.fieldOfInterest || [],
						regions: preferencesData.preferredRegions || [],
						startYear: year,
						startTerm: term,
						budgetIndex:
							constants.budgetOptions.findIndex(
								(opt) => opt.label === preferencesData.budgetLabel,
							) === -1
								? 1
								: constants.budgetOptions.findIndex(
										(opt) => opt.label === preferencesData.budgetLabel,
									),
					});
				}
				console.log("OnboardingClient: Initial data load successful");
			} catch (error) {
				console.error(
					"OnboardingClient: Critical failure loading data:",
					error,
				);

				setCurrentStep(0);
			} finally {
				setIsLoading(false);
			}
		};

		loadOnboardingData();
	}, [router, completeOnboarding, constants.budgetOptions]);



	const handleBasicInfoChange = (field: keyof BasicInfo, value: string) => {
		setBasicInfo((prev) => ({ ...prev, [field]: value }));
	};

	const handlePrefsChange = (updates: Partial<Preferences>) => {
		setPrefs((prev) => ({ ...prev, ...updates }));
	};
	const handleStep1Next = async () => {
		try {

			updateProfile({
				currentEducationLevel: basicInfo.educationLevel,
				targetDegree: basicInfo.targetDegree,
			});


			await onboardingService.updateOnboarding({
				currentLevel: basicInfo.educationLevel as
					| "high_school"
					| "undergrad"
					| "graduate"
					| "working",
				targetDegree: basicInfo.targetDegree as
					| "bachelors"
					| "masters"
					| "mba"
					| "phd",
			});

			setCurrentStep(1);
			setError(null);
		} catch (error) {
			console.error("Failed to save step 1:", error);
			setError("Failed to save your information. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};
	const handleStep2Next = async () => {
		try {

			updatePreferences({
				fieldOfInterest: prefs.fields,
				preferredRegions: prefs.regions,
			});


			await onboardingService.updateOnboarding({
				targetFields: prefs.fields,
				targetRegions: prefs.regions,
			});

			setCurrentStep(2);
			setError(null);
		} catch (error) {
			console.error("Failed to save step 2:", error);
			setError("Failed to save your preferences. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};
	const handleStep3Next = async () => {
		try {
			const formattedTimeline = `${prefs.startYear} ${prefs.startTerm}`;
			const budgetLabel = constants.budgetOptions[prefs.budgetIndex].label;


			updatePreferences({
				intendedStartTerm: formattedTimeline,
				budgetLabel: budgetLabel,
			});


			await onboardingService.updateOnboarding({
				targetIntake: formattedTimeline,
				budgetRange: budgetLabel,
			});

			setCurrentStep(3);
			setError(null);
		} catch (error) {
			console.error("Failed to save step 3:", error);
			setError("Failed to save your plan. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};
	const handleJourneySelect = async (type: JourneyType) => {
		try {
			setSelectedJourney(type);
			setJourneyType(type);


			updatePreferences({
				journeyType: type || undefined,
			});


			await onboardingService.updateOnboarding({
				direction: type === "exploring" ? "exploring" : "has_target",
			});

			completeOnboarding();
			setCurrentStep(4);
			setError(null);
		} catch (error) {
			console.error("Failed to save journey selection:", error);
			setError("Failed to save your journey selection. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCompletion = () => {
		const redirectPath =
			selectedJourney === "targeted" ? "/explore" : "/persona-lab";
		router.push(`${redirectPath}`);
	};


	if (isLoading) {
		return (
			<PageTransition>
				<div className="min-h-screen bg-background flex items-center justify-center">
					<div className="text-center space-y-4">
						<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
						<p className="text-muted-foreground">Loading your onboarding...</p>
					</div>
				</div>
			</PageTransition>
		);
	}

	return (
		<PageTransition>
			<div className="min-h-screen bg-background flex flex-col">
				<OnboardingHeader />

				{currentStep < 4 && (
					<div className="w-full max-w-3xl mx-auto px-6 py-8 space-y-4">
						<AnimatePresence>
							{error && (
								<PageTransition>
									<Alert variant="destructive" className="relative pr-10">
										<AlertCircle className="h-4 w-4" />
										<AlertTitle>Error</AlertTitle>
										<AlertDescription>{error}</AlertDescription>
										<button
											type="button"
											onClick={() => setError(null)}
											className="absolute right-3 top-3 text-destructive/60 hover:text-destructive"
										>
											<X className="h-4 w-4" />
										</button>
									</Alert>
								</PageTransition>
							)}
						</AnimatePresence>

						<OnboardingProgress
							steps={translations.steps}
							currentStep={currentStep}
						/>
					</div>
				)}

				<div className="flex-1 flex flex-col items-center justify-start pt-4 px-4 sm:px-6 pb-12 w-full max-w-2xl mx-auto">
					<AnimatePresence mode="wait">
						{currentStep === 0 && (
							<Step1BasicInfo
								translations={translations}
								constants={constants}
								basicInfo={basicInfo}
								onBasicInfoChange={handleBasicInfoChange}
								onNext={handleStep1Next}
								onBack={handleBack}
							/>
						)}

						{currentStep === 1 && (
							<Step2Preferences
								translations={translations}
								constants={constants}
								prefs={prefs}
								onPrefsChange={handlePrefsChange}
								onNext={handleStep2Next}
								onBack={handleBack}
							/>
						)}

						{currentStep === 2 && (
							<Step3Plan
								translations={translations}
								constants={constants}
								prefs={prefs}
								onPrefsChange={handlePrefsChange}
								onNext={handleStep3Next}
								onBack={handleBack}
							/>
						)}

						{currentStep === 3 && (
							<Step4JourneySelection
								translations={translations}
								constants={constants}
								onJourneySelect={handleJourneySelect}
								onBack={handleBack}
							/>
						)}

						{currentStep === 4 && (
							<Step5Completion
								translations={translations}
								selectedJourney={selectedJourney}
								onComplete={handleCompletion}
							/>
						)}
					</AnimatePresence>
				</div>
			</div>
		</PageTransition>
	);
}
````

## File: lib/hooks/useGraphInteraction.ts
````typescript
import { useCallback, useState } from "react";
import type { ForceGraphMethods, NodeObject } from "react-force-graph-2d";
import type {
	ForceGraphLink,
	ForceGraphNode,
	NodeType,
} from "@/lib/types/persona-canvas";

interface UseGraphInteractionProps {
	graphData: {
		nodes: ForceGraphNode[];
		links: ForceGraphLink[];
	};
	fgRef: React.RefObject<ForceGraphMethods | undefined>;
	dimensions: { width: number; height: number };
}

export function useGraphInteraction({
	graphData,
	fgRef,
	dimensions,
}: UseGraphInteractionProps) {
	const [selectedNode, setSelectedNode] = useState<ForceGraphNode | null>(null);
	const [hoveredNode, setHoveredNode] = useState<ForceGraphNode | null>(null);
	const [hiddenNodeTypes, setHiddenNodeTypes] = useState<Set<NodeType>>(
		new Set(),
	);
	const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
	const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());


	const handleNodeClick = useCallback(
		(node: NodeObject) => {
			console.log("[GraphInteraction] Node clicked:", node);
			const graphNode = node as unknown as ForceGraphNode;


			if (selectedNode?.id === graphNode.id) {
				setSelectedNode(null);
				setHighlightNodes(new Set());
				setHighlightLinks(new Set());

				if (fgRef.current) {
					fgRef.current.zoomToFit(400, 50);
				}
				return;
			}

			setSelectedNode(graphNode);


			const connectedNodeIds = new Set<string>();
			const connectedLinkIds = new Set<string>();
			const connectedNodeObjects: NodeObject[] = [];


			connectedNodeIds.add(graphNode.id);
			connectedNodeObjects.push(node);


			graphData.links.forEach((link) => {
				const sourceId =
					typeof link.source === "object"
						? (link.source as ForceGraphNode).id
						: link.source;
				const targetId =
					typeof link.target === "object"
						? (link.target as ForceGraphNode).id
						: link.target;


				if (sourceId === graphNode.id || targetId === graphNode.id) {

					connectedLinkIds.add(`${sourceId}-${targetId}`);


					if (sourceId === graphNode.id) {
						connectedNodeIds.add(targetId);

						if (typeof link.target === "object") {
							connectedNodeObjects.push(link.target);
						}
					} else {
						connectedNodeIds.add(sourceId);

						if (typeof link.source === "object") {
							connectedNodeObjects.push(link.source);
						}
					}
				}
			});

			setHighlightNodes(connectedNodeIds);
			setHighlightLinks(connectedLinkIds);


			if (fgRef.current && connectedNodeObjects.length > 0) {

				let minX = Infinity;
				let maxX = -Infinity;
				let minY = Infinity;
				let maxY = -Infinity;

				connectedNodeObjects.forEach((n) => {
					const x = n.x || 0;
					const y = n.y || 0;
					const nodeSize = (n as unknown as ForceGraphNode).size || 10;

					minX = Math.min(minX, x - nodeSize);
					maxX = Math.max(maxX, x + nodeSize);
					minY = Math.min(minY, y - nodeSize);
					maxY = Math.max(maxY, y + nodeSize);
				});


				const centerX = (minX + maxX) / 2;
				const centerY = (minY + maxY) / 2;


				const width = maxX - minX;
				const height = maxY - minY;
				const canvasWidth = dimensions.width;
				const canvasHeight = dimensions.height;


				const panelWidth = 400;
				const effectiveCanvasWidth = canvasWidth - panelWidth;


				const paddingFactor = 0.85;
				const zoomX = (effectiveCanvasWidth * paddingFactor) / width;
				const zoomY = (canvasHeight * paddingFactor) / height;
				const targetZoom = Math.min(zoomX, zoomY, 4);


				setTimeout(() => {
					if (fgRef.current) {
						const offsetX = centerX + panelWidth / (2 * targetZoom);
						fgRef.current.centerAt(offsetX, centerY, 600);

						setTimeout(() => {
							if (fgRef.current) {
								fgRef.current.zoom(targetZoom, 600);
							}
						}, 100);
					}
				}, 50);
			}
		},
		[selectedNode, graphData.links, dimensions, fgRef],
	);


	const handleNodeHover = useCallback((node: NodeObject | null) => {
		if (node) {
			console.log(
				"[GraphInteraction] Node hover:",
				(node as ForceGraphNode).label,
			);
		}
		setHoveredNode(node as unknown as ForceGraphNode | null);
	}, []);


	const handleBackgroundClick = useCallback(() => {
		if (selectedNode) {
			setSelectedNode(null);
			setHighlightNodes(new Set());
			setHighlightLinks(new Set());
			if (fgRef.current) {
				fgRef.current.zoomToFit(400, 50);
			}
		}
	}, [selectedNode, fgRef]);


	const toggleNodeTypeVisibility = useCallback((type: NodeType) => {
		setHiddenNodeTypes((prev) => {
			const next = new Set(prev);
			if (next.has(type)) {
				next.delete(type);
			} else {
				next.add(type);
			}
			return next;
		});
	}, []);

	return {
		selectedNode,
		hoveredNode,
		hiddenNodeTypes,
		highlightNodes,
		highlightLinks,
		handleNodeClick,
		handleNodeHover,
		handleBackgroundClick,
		toggleNodeTypeVisibility,
	};
}
````

## File: lib/hooks/useGraphRenderers.ts
````typescript
import { useCallback } from "react";
import type { LinkObject, NodeObject } from "react-force-graph-2d";
import { EDGE_CONFIG, getNodeConfig } from "@/lib/config/graphConfig";
import type {
	ForceGraphLink,
	ForceGraphNode,
	NodeType,
} from "@/lib/types/persona-canvas";

interface UseGraphRenderersProps {
	selectedNode: ForceGraphNode | null;
	hoveredNode: ForceGraphNode | null;
	showLabels: boolean;
	highlightNodes: Set<string>;
	highlightLinks: Set<string>;
	hiddenNodeTypes: Set<NodeType>;
}

export function useGraphRenderers({
	selectedNode,
	hoveredNode,
	showLabels,
	highlightNodes,
	highlightLinks,
	hiddenNodeTypes,
}: UseGraphRenderersProps) {

	const paintNode = useCallback(
		(node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
			const graphNode = node as unknown as ForceGraphNode;
			const isSelected = selectedNode?.id === graphNode.id;
			const isHovered = hoveredNode?.id === graphNode.id;
			const isHighlighted = highlightNodes.has(graphNode.id);
			const isHidden = hiddenNodeTypes.has(graphNode.type);
			const isFaded = (selectedNode && !isHighlighted) || isHidden;
			const config = getNodeConfig(graphNode.type);


			ctx.beginPath();
			ctx.arc(node.x || 0, node.y || 0, graphNode.size, 0, 2 * Math.PI);


			if (isFaded) {
				ctx.globalAlpha = 0.15;
			} else {
				ctx.globalAlpha = 1.0;
			}

			ctx.fillStyle =
				isSelected || isHovered ? config.hoverColor : graphNode.color;
			ctx.fill();


			if (isSelected) {
				ctx.strokeStyle = config.hoverColor;
				ctx.lineWidth = 3 / globalScale;
				ctx.stroke();
			}


			if (isHighlighted && !isSelected) {
				ctx.strokeStyle = config.color;
				ctx.lineWidth = 2 / globalScale;
				ctx.stroke();
			}


			ctx.globalAlpha = 1.0;


			const shouldShowLabel = showLabels || isHovered || isSelected;

			if (shouldShowLabel) {

				const maxLength = 20;
				const label =
					graphNode.label.length > maxLength
						? `${graphNode.label.slice(0, maxLength)}...`
						: graphNode.label;

				const fontSize = 12 / globalScale;
				ctx.font = `${fontSize}px Inter, sans-serif`;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";


				if (isFaded) {
					ctx.globalAlpha = 0.15;
				}


				const textWidth = ctx.measureText(label).width;
				const padding = 4 / globalScale;
				ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
				ctx.fillRect(
					(node.x || 0) - textWidth / 2 - padding,
					(node.y || 0) + graphNode.size + padding,
					textWidth + padding * 2,
					fontSize + padding * 2,
				);


				ctx.fillStyle = "#ffffff";
				ctx.fillText(
					label,
					node.x || 0,
					(node.y || 0) + graphNode.size + fontSize / 2 + padding * 2,
				);


				ctx.globalAlpha = 1.0;
			}
		},
		[selectedNode, hoveredNode, showLabels, highlightNodes, hiddenNodeTypes],
	);


	const paintLink = useCallback(
		(link: LinkObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
			const graphLink = link as unknown as ForceGraphLink;
			const config = EDGE_CONFIG[graphLink.type as keyof typeof EDGE_CONFIG];

			if (!link.source || !link.target) return;

			const start =
				typeof link.source === "object" ? link.source : { x: 0, y: 0 };
			const end =
				typeof link.target === "object" ? link.target : { x: 0, y: 0 };


			const sourceId =
				typeof link.source === "object"
					? (link.source as ForceGraphNode).id
					: link.source;
			const targetId =
				typeof link.target === "object"
					? (link.target as ForceGraphNode).id
					: link.target;
			const linkId = `${sourceId}-${targetId}`;
			const isHighlighted = highlightLinks.has(linkId);


			const sourceNode =
				typeof link.source === "object"
					? (link.source as ForceGraphNode)
					: null;
			const targetNode =
				typeof link.target === "object"
					? (link.target as ForceGraphNode)
					: null;
			const isConnectedToHidden =
				(sourceNode && hiddenNodeTypes.has(sourceNode.type)) ||
				(targetNode && hiddenNodeTypes.has(targetNode.type));

			const isFaded = (selectedNode && !isHighlighted) || isConnectedToHidden;


			if (isFaded) {
				ctx.globalAlpha = 0.05;
			} else {
				ctx.globalAlpha = 1.0;
			}


			const baseOpacity = isHighlighted ? 0.6 : 0.3;
			const strengthBonus = (graphLink.strength / 100) * 0.3;
			const opacity = Math.min(baseOpacity + strengthBonus, 0.8);

			ctx.strokeStyle = graphLink.color.replace(/[\d.]+\)$/, `${opacity})`);
			ctx.lineWidth = isHighlighted
				? ((config?.width || 1) * 1.5) / globalScale
				: (config?.width || 1) / globalScale;


			if (config && "dashed" in config) {
				ctx.setLineDash([5 / globalScale, 3 / globalScale]);
			}

			ctx.beginPath();
			ctx.moveTo(start.x || 0, start.y || 0);
			ctx.lineTo(end.x || 0, end.y || 0);
			ctx.stroke();

			ctx.setLineDash([]);
			ctx.globalAlpha = 1.0;
		},
		[selectedNode, highlightLinks, hiddenNodeTypes],
	);


	const paintNodePointerArea = useCallback(
		(node: NodeObject, color: string, ctx: CanvasRenderingContext2D) => {
			const graphNode = node as unknown as ForceGraphNode;

			const clickRadius = Math.max(graphNode.size * 1.5, 20);
			ctx.beginPath();
			ctx.arc(node.x || 0, node.y || 0, clickRadius, 0, 2 * Math.PI);
			ctx.fillStyle = color;
			ctx.fill();
		},
		[],
	);


	const nodeTooltip = useCallback((node: NodeObject) => {
		const graphNode = node as unknown as ForceGraphNode;
		const config = getNodeConfig(graphNode.type);
		return `<div style="background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px;">
			<strong>${graphNode.label}</strong><br/>
			<span style="color: ${graphNode.color};">● ${config.label}</span>
		</div>`;
	}, []);

	return {
		paintNode,
		paintLink,
		paintNodePointerArea,
		nodeTooltip,
	};
}
````

## File: lib/services/auth.ts
````typescript
import { apiClient } from "@/lib/api/client";
import type {
	AuthResponse,
	GoogleAuthRequest,
	LoginRequest,
	RegisterRequest,
	UserContextResponse,
} from "@/lib/api/types";

export interface VerifyEmailRequest {
	token: string;
}

export interface ResendVerificationRequest {
	email: string;
}

export interface ForgotPasswordRequest {
	email: string;
}

export interface ResetPasswordRequest {
	token: string;
	newPassword: string;
}

export const authService = {
	login: async (credentials: LoginRequest): Promise<AuthResponse> => {
		return apiClient.post<AuthResponse>("/v1/auth/login", credentials);
	},

	register: async (data: RegisterRequest): Promise<AuthResponse> => {
		return apiClient.post<AuthResponse>("/v1/auth/register", data);
	},

	googleAuth: async (idToken: string): Promise<AuthResponse> => {
		const payload: GoogleAuthRequest = { idToken };
		return apiClient.post<AuthResponse>("/v1/auth/google", payload);
	},

	refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
		return apiClient.post<AuthResponse>("/v1/auth/refresh", { refreshToken });
	},

	logout: async (): Promise<string> => {
		return apiClient.post<string>("/v1/auth/logout", {});
	},

	getCurrentUser: async (): Promise<UserContextResponse> => {
		return apiClient.get<UserContextResponse>("/v1/auth/me");
	},


	verifyEmail: async (token: string): Promise<string> => {
		return apiClient.post<string>("/v1/auth/verify-email", { token });
	},

	resendVerification: async (email: string): Promise<string> => {
		return apiClient.post<string>("/v1/auth/resend-verification", { email });
	},


	forgotPassword: async (email: string): Promise<string> => {
		return apiClient.post<string>("/v1/auth/forgot-password", { email });
	},

	resetPassword: async (
		token: string,
		newPassword: string,
	): Promise<string> => {
		return apiClient.post<string>("/v1/auth/reset-password", {
			token,
			newPassword,
		});
	},
};
````

## File: lib/store/userStore.ts
````typescript
import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
	id: string;
	email: string;
	fullName: string;
	dateOfBirth?: string;
	nationality?: string;
	currentEducationLevel?: string;
	targetDegree?: string;
	gpa?: number;
	gpaScale?: string;
	currentMajor?: string;
	testScores?: {
		type: string;
		score: string;
	}[];
	intendedStartYear?: number;
	profilePicture?: string;
}

export interface UserPreferences {
	desiredMajor?: string;
	desiredMajors?: string[];
	preferredRegions?: string[];
	targetCountries?: string[];
	budgetRange?: {
		min: number;
		max: number;
	};
	budgetLabel?: string;
	timeline?: string;
	campusSetting?: "urban" | "suburban" | "rural";
	languagesOfInstruction?: string[];
	interests?: string[];
	priorities?: string[];
	selfDescription?: string;

	programType?: string;
	fieldOfInterest?: string[];
	intendedStartTerm?: string;
	journeyType?: string;
}

export type JourneyType = "exploring" | "targeted" | null;

interface UserState {
	profile: UserProfile | null;
	accessToken: string | null;
	refreshToken: string | null;
	tokenExpiresAt: number | null;
	preferences: UserPreferences;
	journeyType: JourneyType;
	isOnboardingComplete: boolean;
	isAuthenticated: boolean;
	lastActivity?: {
		type: string;
		path: string;
		title: string;
		timestamp: number;
	};
	setProfile: (profile: UserProfile) => void;
	updateProfile: (updates: Partial<UserProfile>) => void;
	setPreferences: (preferences: UserPreferences) => void;
	updatePreferences: (updates: Partial<UserPreferences>) => void;
	setJourneyType: (journeyType: JourneyType) => void;
	setLastActivity: (activity: {
		type: string;
		path: string;
		title: string;
	}) => void;
	completeOnboarding: () => void;
	login: (
		profile: UserProfile,
		accessToken: string,
		refreshToken: string,
		expiresIn: number,
		isOnboardingComplete?: boolean,
	) => void;
	setTokens: (
		accessToken: string,
		refreshToken: string,
		expiresIn: number,
	) => void;
	logout: () => void;

	get token(): string | null;
}

export const useUserStore = create<UserState>()(
	persist(
		(set, get) => ({
			profile: null,
			accessToken: null,
			refreshToken: null,
			tokenExpiresAt: null,
			preferences: {},
			journeyType: null,
			isOnboardingComplete: false,
			isAuthenticated: false,
			lastActivity: undefined,


			get token() {
				return get().accessToken;
			},

			setProfile: (profile) => set({ profile }),

			updateProfile: (updates) =>
				set((state) => ({
					profile: state.profile
						? { ...state.profile, ...updates }
						: { id: crypto.randomUUID(), email: "", fullName: "", ...updates },
				})),

			setPreferences: (preferences) => set({ preferences }),

			updatePreferences: (updates) =>
				set((state) => ({
					preferences: { ...state.preferences, ...updates },
				})),

			setJourneyType: (journeyType) => set({ journeyType }),

			setLastActivity: (activity) =>
				set({
					lastActivity: {
						...activity,
						timestamp: Date.now(),
					},
				}),

			completeOnboarding: () => set({ isOnboardingComplete: true }),

			login: (
				profile,
				accessToken,
				refreshToken,
				expiresIn,
				isOnboardingComplete = false,
			) =>
				set({
					profile,
					accessToken,
					refreshToken,
					tokenExpiresAt: Date.now() + expiresIn * 1000,
					isAuthenticated: true,
					isOnboardingComplete,
				}),

			setTokens: (accessToken, refreshToken, expiresIn) =>
				set({
					accessToken,
					refreshToken,
					tokenExpiresAt: Date.now() + expiresIn * 1000,
				}),

			logout: () => {
				// Clear cookie SYNCHRONOUSLY inside the action
				// This ensures cookie is cleared before any redirect happens
				// The subscription below runs asynchronously and may not clear in time
				Cookies.remove("leaply-auth-state", { path: "/" });

				set({
					profile: null,
					accessToken: null,
					refreshToken: null,
					tokenExpiresAt: null,
					isAuthenticated: false,
					isOnboardingComplete: false,
					preferences: {},
					journeyType: null,
					lastActivity: undefined,
				});
			},
		}),
		{
			name: "leaply-user-store",
			partialize: (state) => ({
				profile: state.profile,
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
				tokenExpiresAt: state.tokenExpiresAt,
				preferences: state.preferences,
				journeyType: state.journeyType,
				isOnboardingComplete: state.isOnboardingComplete,
				isAuthenticated: state.isAuthenticated,
				lastActivity: state.lastActivity,
			}),
		},
	),
);


useUserStore.subscribe((state) => {
	const authState = {
		isAuthenticated: state.isAuthenticated,
		isOnboardingComplete: state.isOnboardingComplete,
	};
	Cookies.set("leaply-auth-state", JSON.stringify(authState), {
		expires: 7,
		path: "/",
		sameSite: "lax",
	});
});
````

## File: app/(app)/dashboard/profile/page.tsx
````typescript
"use client";

import {
	AlertCircle,
	BookOpen,
	Briefcase,
	Calendar,
	Check,
	CheckCircle,
	ChevronRight,
	Edit2,
	GraduationCap,
	KeyRound,
	Loader2,
	Mail,
	MapPin,
	Shield,
	Sparkles,
	Target,
	User,
	X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
	PageTransition,
	SlideUp,
	StaggerContainer,
	StaggerItem,
} from "@/components/PageTransition";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserMeResponse } from "@/lib/api/types";
import { authService } from "@/lib/services/auth";
import { userService } from "@/lib/services/user";
import { useUserStore } from "@/lib/store/userStore";

const EDUCATION_LEVELS = [
	{ value: "high_school", labelKey: "highSchool" },
	{ value: "undergrad", labelKey: "undergraduate" },
	{ value: "graduate", labelKey: "graduate" },
	{ value: "working", labelKey: "working" },
];

const TARGET_DEGREES = [
	{ value: "bachelors", labelKey: "bachelors" },
	{ value: "masters", labelKey: "masters" },
	{ value: "mba", labelKey: "mba" },
	{ value: "phd", labelKey: "phd" },
];

const CAMPUS_SETTINGS = [
	{ value: "urban", labelKey: "urban" },
	{ value: "suburban", labelKey: "suburban" },
	{ value: "rural", labelKey: "rural" },
];

export default function ProfilePage() {
	const t = useTranslations("profile");
	const { profile: _storeProfile, updateProfile: updateStoreProfile } =
		useUserStore();

	const [userData, setUserData] = useState<UserMeResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isResettingPassword, setIsResettingPassword] = useState(false);
	const [isSendingVerification, setIsSendingVerification] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);


	const [formData, setFormData] = useState({
		fullName: "",
		currentEducationLevel: "",
		targetDegree: "",
		gpa: "",
		gpaScale: "",
		workExperienceYears: "",
		testScores: {} as Record<string, string>,
	});

	// Fetch user data
	useEffect(() => {
		async function fetchData() {
			try {
				const data = await userService.getMe();
				setUserData(data);
				setFormData({
					fullName: data.fullName || "",
					currentEducationLevel: data.currentEducationLevel || "",
					targetDegree: data.targetDegree || "",
					gpa: data.gpa?.toString() || "",
					gpaScale: data.gpaScale?.toString() || "4.0",
					workExperienceYears: data.workExperienceYears?.toString() || "",
					testScores: data.testScores || {},
				});
			} catch (error) {
				console.error("Failed to fetch user data:", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, []);

	// Get user initials for avatar
	const getInitials = (name?: string) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	// Format date
	const formatDate = (dateStr?: string) => {
		if (!dateStr) return t("noData");
		return new Date(dateStr).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};


	const getEducationLabel = (value?: string) => {
		const level = EDUCATION_LEVELS.find((l) => l.value === value);
		return level ? t(level.labelKey) : t("noData");
	};


	const getDegreeLabel = (value?: string) => {
		const degree = TARGET_DEGREES.find((d) => d.value === value);
		return degree ? t(degree.labelKey) : t("noData");
	};


	const getCampusLabel = (value?: string) => {
		const setting = CAMPUS_SETTINGS.find((s) => s.value === value);
		return setting ? t(setting.labelKey) : t("noData");
	};


	const getJourneyLabel = (value?: string) => {
		if (value === "exploring") return t("exploring");
		if (value === "targeted") return t("targeted");
		return t("noData");
	};


	const handleSave = async () => {
		setIsSaving(true);
		setMessage(null);

		try {
			const updateData = {
				fullName: formData.fullName || undefined,
				currentEducationLevel: formData.currentEducationLevel || undefined,
				targetDegree: formData.targetDegree || undefined,
				gpa: formData.gpa ? Number.parseFloat(formData.gpa) : undefined,
				gpaScale: formData.gpaScale
					? Number.parseFloat(formData.gpaScale)
					: undefined,
				workExperienceYears: formData.workExperienceYears
					? Number.parseInt(formData.workExperienceYears, 10)
					: undefined,
				testScores:
					Object.keys(formData.testScores).length > 0
						? formData.testScores
						: undefined,
			};

			await userService.updateProfile(updateData);


			const data = await userService.getMe();
			setUserData(data);


			if (data.fullName) {
				updateStoreProfile({ fullName: data.fullName });
			}

			setIsEditing(false);
			setMessage({ type: "success", text: t("updateSuccess") });


			setTimeout(() => setMessage(null), 3000);
		} catch (error) {
			console.error("Failed to update profile:", error);
			setMessage({ type: "error", text: t("updateError") });
		} finally {
			setIsSaving(false);
		}
	};


	const handleResetPassword = async () => {
		if (!userData?.email) return;

		setIsResettingPassword(true);
		setMessage(null);

		try {
			await authService.forgotPassword(userData.email);
			setMessage({ type: "success", text: t("resetPasswordSent") });
		} catch (error) {
			console.error("Failed to request password reset:", error);
			setMessage({ type: "error", text: t("resetPasswordError") });
		} finally {
			setIsResettingPassword(false);
		}
	};


	const handleSendVerification = async () => {
		if (!userData?.email) return;

		setIsSendingVerification(true);
		setMessage(null);

		try {
			await authService.resendVerification(userData.email);
			setMessage({ type: "success", text: t("verificationSent") });
		} catch (error) {
			console.error("Failed to send verification email:", error);
			setMessage({ type: "error", text: t("verificationError") });
		} finally {
			setIsSendingVerification(false);
		}
	};


	const handleTestScoreChange = (type: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			testScores: {
				...prev.testScores,
				[type]: value,
			},
		}));
	};


	const getCompletionColor = (completion: number) => {
		if (completion >= 80) return "text-green-500";
		if (completion >= 50) return "text-yellow-500";
		return "text-orange-500";
	};

	if (isLoading) {
		return (
			<PageTransition>
				<div className="min-h-screen bg-background">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<div className="space-y-6">
							<Skeleton className="h-8 w-48" />
							<Skeleton className="h-4 w-72" />
							<Skeleton className="h-48 w-full rounded-lg" />
							<Skeleton className="h-64 w-full rounded-lg" />
							<Skeleton className="h-48 w-full rounded-lg" />
						</div>
					</div>
				</div>
			</PageTransition>
		);
	}

	return (
		<PageTransition>
			<div className="min-h-screen bg-background">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{}
					<SlideUp>
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-foreground mb-2">
								{t("title")}
							</h1>
							<p className="text-lg text-muted-foreground">{t("subtitle")}</p>
						</div>
					</SlideUp>

					{}
					{message && (
						<SlideUp>
							<Alert
								className={`mb-6 ${message.type === "success" ? "border-green-500" : "border-destructive"}`}
							>
								{message.type === "success" ? (
									<CheckCircle className="h-4 w-4 text-green-500" />
								) : (
									<AlertCircle className="h-4 w-4" />
								)}
								<AlertDescription
									className={message.type === "success" ? "text-green-600" : ""}
								>
									{message.text}
								</AlertDescription>
							</Alert>
						</SlideUp>
					)}

					<StaggerContainer>
						<div className="space-y-6">
							{}
							<StaggerItem>
								<Card className="overflow-hidden">
									<div className="bg-linear-to-r from-primary/10 via-chart-2/10 to-transparent p-6">
										<div className="flex items-center gap-6">
											<Avatar className="h-20 w-20 border-4 border-background shadow-lg">
												<AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
													{getInitials(userData?.fullName)}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<h2 className="text-2xl font-bold text-foreground mb-1">
													{userData?.fullName || t("noData")}
												</h2>
												<div className="flex items-center gap-2 text-muted-foreground mb-3 flex-wrap">
													<Mail className="h-4 w-4" />
													<span>{userData?.email}</span>
													{userData?.emailVerified ? (
														<Badge
															variant="secondary"
															className="text-xs bg-green-100 text-green-700"
														>
															<Check className="h-3 w-3 mr-1" />
															{t("emailVerified")}
														</Badge>
													) : (
														<>
															<Badge
																variant="secondary"
																className="text-xs bg-yellow-100 text-yellow-700"
															>
																{t("emailNotVerified")}
															</Badge>
															<Button
																variant="link"
																size="sm"
																className="h-auto p-0 text-xs text-primary"
																onClick={handleSendVerification}
																disabled={isSendingVerification}
															>
																{isSendingVerification ? (
																	<Loader2 className="h-3 w-3 animate-spin mr-1" />
																) : null}
																{t("verifyNow")}
															</Button>
														</>
													)}
												</div>
												<div className="space-y-2">
													<div className="flex items-center justify-between text-sm">
														<span className="text-muted-foreground">
															{t("profileCompletion")}
														</span>
														<span
															className={`font-semibold ${getCompletionColor(userData?.profileCompletion || 0)}`}
														>
															{userData?.profileCompletion || 0}%
														</span>
													</div>
													<Progress
														value={userData?.profileCompletion || 0}
														className="h-2"
													/>
													{(userData?.profileCompletion || 0) < 100 && (
														<p className="text-xs text-muted-foreground">
															{t("completeProfile")}
														</p>
													)}
												</div>
											</div>
										</div>
									</div>
								</Card>
							</StaggerItem>

							{}
							<StaggerItem>
								<Card>
									<CardHeader className="flex flex-row items-center justify-between">
										<div>
											<CardTitle className="flex items-center gap-2">
												<User className="h-5 w-5 text-muted-foreground" />
												{t("personalInformation")}
											</CardTitle>
											<CardDescription>
												{isEditing
													? "Edit your personal details"
													: "Your personal details"}
											</CardDescription>
										</div>
										{!isEditing ? (
											<Button
												variant="outline"
												size="sm"
												onClick={() => setIsEditing(true)}
											>
												<Edit2 className="h-4 w-4 mr-2" />
												{t("editProfile")}
											</Button>
										) : (
											<div className="flex gap-2">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => {
														setIsEditing(false);

														setFormData({
															fullName: userData?.fullName || "",
															currentEducationLevel:
																userData?.currentEducationLevel || "",
															targetDegree: userData?.targetDegree || "",
															gpa: userData?.gpa?.toString() || "",
															gpaScale: userData?.gpaScale?.toString() || "4.0",
															workExperienceYears:
																userData?.workExperienceYears?.toString() || "",
															testScores: userData?.testScores || {},
														});
													}}
												>
													<X className="h-4 w-4 mr-2" />
													{t("cancel")}
												</Button>
												<Button
													size="sm"
													onClick={handleSave}
													disabled={isSaving}
												>
													{isSaving ? (
														<>
															<Loader2 className="h-4 w-4 mr-2 animate-spin" />
															{t("saving")}
														</>
													) : (
														<>
															<Check className="h-4 w-4 mr-2" />
															{t("saveChanges")}
														</>
													)}
												</Button>
											</div>
										)}
									</CardHeader>
									<CardContent>
										{isEditing ? (
											<div className="grid gap-6 sm:grid-cols-2">
												<div className="space-y-2">
													<Label htmlFor="fullName">{t("fullName")}</Label>
													<Input
														id="fullName"
														value={formData.fullName}
														onChange={(e) =>
															setFormData((prev) => ({
																...prev,
																fullName: e.target.value,
															}))
														}
														placeholder={t("fullNamePlaceholder")}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="educationLevel">
														{t("educationLevel")}
													</Label>
													<Select
														value={formData.currentEducationLevel}
														onValueChange={(value) =>
															setFormData((prev) => ({
																...prev,
																currentEducationLevel: value,
															}))
														}
													>
														<SelectTrigger>
															<SelectValue placeholder={t("selectLevel")} />
														</SelectTrigger>
														<SelectContent>
															{EDUCATION_LEVELS.map((level) => (
																<SelectItem
																	key={level.value}
																	value={level.value}
																>
																	{t(level.labelKey)}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<div className="space-y-2">
													<Label htmlFor="targetDegree">
														{t("targetDegree")}
													</Label>
													<Select
														value={formData.targetDegree}
														onValueChange={(value) =>
															setFormData((prev) => ({
																...prev,
																targetDegree: value,
															}))
														}
													>
														<SelectTrigger>
															<SelectValue placeholder={t("selectLevel")} />
														</SelectTrigger>
														<SelectContent>
															{TARGET_DEGREES.map((degree) => (
																<SelectItem
																	key={degree.value}
																	value={degree.value}
																>
																	{t(degree.labelKey)}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<div className="space-y-2">
													<Label htmlFor="gpa">{t("gpa")}</Label>
													<div className="flex gap-2">
														<Input
															id="gpa"
															type="number"
															step="0.01"
															min="0"
															max="10"
															value={formData.gpa}
															onChange={(e) =>
																setFormData((prev) => ({
																	...prev,
																	gpa: e.target.value,
																}))
															}
															placeholder="3.5"
															className="flex-1"
														/>
														<span className="flex items-center text-muted-foreground">
															/
														</span>
														<Input
															type="number"
															step="0.1"
															min="1"
															max="10"
															value={formData.gpaScale}
															onChange={(e) =>
																setFormData((prev) => ({
																	...prev,
																	gpaScale: e.target.value,
																}))
															}
															placeholder="4.0"
															className="w-20"
														/>
													</div>
												</div>
												<div className="space-y-2">
													<Label htmlFor="workExp">{t("workExperience")}</Label>
													<div className="flex gap-2 items-center">
														<Input
															id="workExp"
															type="number"
															min="0"
															max="50"
															value={formData.workExperienceYears}
															onChange={(e) =>
																setFormData((prev) => ({
																	...prev,
																	workExperienceYears: e.target.value,
																}))
															}
															placeholder="0"
															className="w-24"
														/>
														<span className="text-muted-foreground">
															{t("years")}
														</span>
													</div>
												</div>
											</div>
										) : (
											<div className="grid gap-4 sm:grid-cols-2">
												<div className="flex items-start gap-3">
													<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
														<User className="h-4 w-4 text-muted-foreground" />
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															{t("fullName")}
														</p>
														<p className="font-medium">
															{userData?.fullName || t("noData")}
														</p>
													</div>
												</div>
												<div className="flex items-start gap-3">
													<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
														<GraduationCap className="h-4 w-4 text-muted-foreground" />
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															{t("educationLevel")}
														</p>
														<p className="font-medium">
															{getEducationLabel(
																userData?.currentEducationLevel,
															)}
														</p>
													</div>
												</div>
												<div className="flex items-start gap-3">
													<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
														<Target className="h-4 w-4 text-muted-foreground" />
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															{t("targetDegree")}
														</p>
														<p className="font-medium">
															{getDegreeLabel(userData?.targetDegree)}
														</p>
													</div>
												</div>
												<div className="flex items-start gap-3">
													<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
														<BookOpen className="h-4 w-4 text-muted-foreground" />
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															{t("gpa")}
														</p>
														<p className="font-medium">
															{userData?.gpa
																? `${userData.gpa}/${userData?.gpaScale || 4.0}`
																: t("noData")}
														</p>
													</div>
												</div>
												<div className="flex items-start gap-3">
													<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
														<Briefcase className="h-4 w-4 text-muted-foreground" />
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															{t("workExperience")}
														</p>
														<p className="font-medium">
															{userData?.workExperienceYears
																? `${userData.workExperienceYears} ${t("years")}`
																: t("noData")}
														</p>
													</div>
												</div>
											</div>
										)}
									</CardContent>
								</Card>
							</StaggerItem>

							{}
							<StaggerItem>
								<Card>
									<CardHeader className="flex flex-row items-center justify-between">
										<div>
											<CardTitle className="flex items-center gap-2">
												<BookOpen className="h-5 w-5 text-muted-foreground" />
												{t("testScores")}
											</CardTitle>
											<CardDescription>
												Your standardized test scores
											</CardDescription>
										</div>
									</CardHeader>
									<CardContent>
										{isEditing ? (
											<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
												{["IELTS", "TOEFL", "GRE", "GMAT"].map((testType) => (
													<div key={testType} className="space-y-2">
														<Label htmlFor={testType}>{testType}</Label>
														<Input
															id={testType}
															type="number"
															step={testType === "IELTS" ? "0.5" : "1"}
															min="0"
															max={
																testType === "IELTS"
																	? "9"
																	: testType === "TOEFL"
																		? "120"
																		: "800"
															}
															value={formData.testScores[testType] || ""}
															onChange={(e) =>
																handleTestScoreChange(testType, e.target.value)
															}
															placeholder={
																testType === "IELTS"
																	? "7.0"
																	: testType === "TOEFL"
																		? "100"
																		: testType === "GRE"
																			? "320"
																			: "700"
															}
														/>
													</div>
												))}
											</div>
										) : userData?.testScores &&
											Object.keys(userData.testScores).length > 0 ? (
											<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
												{Object.entries(userData.testScores).map(
													([type, score]) => (
														<div
															key={type}
															className="p-4 rounded-lg bg-muted/50 text-center"
														>
															<p className="text-sm text-muted-foreground mb-1">
																{type}
															</p>
															<p className="text-2xl font-bold text-foreground">
																{score}
															</p>
														</div>
													),
												)}
											</div>
										) : (
											<div className="text-center py-8 text-muted-foreground">
												<BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
												<p>{t("noTestScores")}</p>
												<Button
													variant="outline"
													size="sm"
													className="mt-4"
													onClick={() => setIsEditing(true)}
												>
													{t("addTestScore")}
												</Button>
											</div>
										)}
									</CardContent>
								</Card>
							</StaggerItem>

							{}
							<StaggerItem>
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Sparkles className="h-5 w-5 text-muted-foreground" />
											{t("preferences")}
										</CardTitle>
										<CardDescription>
											Your study abroad preferences
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid gap-4 sm:grid-cols-2">
											<div className="flex items-start gap-3">
												<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
													<BookOpen className="h-4 w-4 text-muted-foreground" />
												</div>
												<div>
													<p className="text-sm text-muted-foreground">
														{t("fieldsOfInterest")}
													</p>
													<div className="flex flex-wrap gap-1 mt-1">
														{userData?.fieldOfInterest &&
														userData.fieldOfInterest.length > 0 ? (
															userData.fieldOfInterest.map((field) => (
																<Badge
																	key={field}
																	variant="secondary"
																	className="text-xs"
																>
																	{field}
																</Badge>
															))
														) : (
															<span className="text-muted-foreground">
																{t("noData")}
															</span>
														)}
													</div>
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
													<MapPin className="h-4 w-4 text-muted-foreground" />
												</div>
												<div>
													<p className="text-sm text-muted-foreground">
														{t("preferredRegions")}
													</p>
													<div className="flex flex-wrap gap-1 mt-1">
														{userData?.preferredRegions &&
														userData.preferredRegions.length > 0 ? (
															userData.preferredRegions.map((region) => (
																<Badge
																	key={region}
																	variant="secondary"
																	className="text-xs"
																>
																	{region}
																</Badge>
															))
														) : (
															<span className="text-muted-foreground">
																{t("noData")}
															</span>
														)}
													</div>
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
													<Calendar className="h-4 w-4 text-muted-foreground" />
												</div>
												<div>
													<p className="text-sm text-muted-foreground">
														{t("intendedStartTerm")}
													</p>
													<p className="font-medium">
														{userData?.intendedStartTerm || t("noData")}
													</p>
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
													<Target className="h-4 w-4 text-muted-foreground" />
												</div>
												<div>
													<p className="text-sm text-muted-foreground">
														{t("budgetRange")}
													</p>
													<p className="font-medium">
														{userData?.budgetLabel || t("noData")}
													</p>
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
													<Sparkles className="h-4 w-4 text-muted-foreground" />
												</div>
												<div>
													<p className="text-sm text-muted-foreground">
														{t("journeyType")}
													</p>
													<p className="font-medium">
														{getJourneyLabel(userData?.journeyType)}
													</p>
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
													<MapPin className="h-4 w-4 text-muted-foreground" />
												</div>
												<div>
													<p className="text-sm text-muted-foreground">
														{t("campusSetting")}
													</p>
													<p className="font-medium">
														{getCampusLabel(userData?.campusSetting)}
													</p>
												</div>
											</div>
										</div>
										{userData?.interests && userData.interests.length > 0 && (
											<>
												<Separator className="my-4" />
												<div className="flex items-start gap-3">
													<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
														<Sparkles className="h-4 w-4 text-muted-foreground" />
													</div>
													<div>
														<p className="text-sm text-muted-foreground mb-2">
															{t("interests")}
														</p>
														<div className="flex flex-wrap gap-1">
															{userData.interests.map((interest) => (
																<Badge
																	key={interest}
																	variant="outline"
																	className="text-xs"
																>
																	{interest}
																</Badge>
															))}
														</div>
													</div>
												</div>
											</>
										)}
									</CardContent>
								</Card>
							</StaggerItem>

							{}
							<StaggerItem>
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Shield className="h-5 w-5 text-muted-foreground" />
											{t("accountSecurity")}
										</CardTitle>
										<CardDescription>
											Manage your account security settings
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
													<Calendar className="h-5 w-5 text-muted-foreground" />
												</div>
												<div>
													<p className="font-medium">{t("memberSince")}</p>
													<p className="text-sm text-muted-foreground">
														{formatDate(userData?.createdAt)}
													</p>
												</div>
											</div>
										</div>
										<Separator />
										<div className="flex items-center justify-between p-4 rounded-lg border">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
													<KeyRound className="h-5 w-5 text-muted-foreground" />
												</div>
												<div>
													<p className="font-medium">{t("resetPassword")}</p>
													<p className="text-sm text-muted-foreground">
														{t("resetPasswordDesc")}
													</p>
												</div>
											</div>
											<Button
												variant="outline"
												size="sm"
												onClick={handleResetPassword}
												disabled={isResettingPassword}
											>
												{isResettingPassword ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : (
													<>
														{t("resetPassword")}
														<ChevronRight className="h-4 w-4 ml-1" />
													</>
												)}
											</Button>
										</div>
									</CardContent>
								</Card>
							</StaggerItem>
						</div>
					</StaggerContainer>
				</div>
			</div>
		</PageTransition>
	);
}
````

## File: app/(marketing)/page.tsx
````typescript
"use client";

import { motion } from "framer-motion";
import {
	AlertCircle,
	ArrowRight,
	Bot,
	Brain,
	ChevronDown,
	FileCheck,
	Globe,
	MapPin,
	School,
	Sparkles,
	Target,
	User,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import {
	SlideUp,
	StaggerContainer,
	StaggerItem,
} from "@/components/PageTransition";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const featuredUniversities = [
	{
		name: "Harvard University",
		location: "USA",
		logo: "/universities/havard.png",
	},
	{
		name: "Massachusetts Institute of Technology",
		location: "USA",
		logo: "/universities/mit.png",
	},
	{
		name: "Stanford University",
		location: "USA",
		logo: "/universities/stanford.png",
	},
	{ name: "Yale University", location: "USA", logo: "/universities/yale.png" },
	{
		name: "Princeton University",
		location: "USA",
		logo: "/universities/princeton.png",
	},
	{
		name: "University of Oxford",
		location: "UK",
		logo: "/universities/oxford.png",
	},
	{
		name: "University of Cambridge",
		location: "UK",
		logo: "/universities/cambridge.png",
	},
	{
		name: "Imperial College London",
		location: "UK",
		logo: "/universities/imperial_college_london.png",
	},
	{
		name: "University College London",
		location: "UK",
		logo: "/universities/ucl.png",
	},
	{
		name: "King's College London",
		location: "UK",
		logo: "/universities/london.png",
	},
	{
		name: "ETH Zurich",
		location: "Switzerland",
		logo: "/universities/eth_zurich.png",
	},
	{
		name: "Technical University of Munich",
		location: "Germany",
		logo: "/universities/tu_muenchen.png",
	},
	{
		name: "National University of Singapore",
		location: "Singapore",
		logo: "/universities/nus.png",
	},
	{
		name: "Peking University",
		location: "China",
		logo: "/universities/peking.png",
	},
	{
		name: "Tsinghua University",
		location: "China",
		logo: "/universities/tshinghua.png",
	},
	{
		name: "University of Tokyo",
		location: "Japan",
		logo: "/universities/tokyo.png",
	},
	{
		name: "Seoul National University",
		location: "South Korea",
		logo: "/universities/snu.png",
	},
	{
		name: "University of Toronto",
		location: "Canada",
		logo: "/universities/toronto.png",
	},
	{
		name: "University of British Columbia",
		location: "Canada",
		logo: "/universities/ubc.png",
	},
	{
		name: "McGill University",
		location: "Canada",
		logo: "/universities/mcgill.png",
	},
	{
		name: "University of Melbourne",
		location: "Australia",
		logo: "/universities/melbourne.png",
	},
	{
		name: "University of Sydney",
		location: "Australia",
		logo: "/universities/usyd.png",
	},
];

interface StepVisual {
	step: number;
	icon: React.ComponentType<{
		className?: string;
		style?: React.CSSProperties;
	}>;
	color: string;
	title: string;
	imagePath: string;
}

function ScrollHighlightStep({ children }: { children: React.ReactNode }) {
	return <div className="relative">{children}</div>;
}

function ParallaxVisual() {
	const [activeStep, setActiveStep] = React.useState(1);
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	React.useEffect(() => {
		if (!mounted) return;

		const observerOptions = {
			root: null,
			rootMargin: "-40% 0px -40% 0px",
			threshold: 0,
		};

		const observerCallback = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const stepElement = entry.target as HTMLElement;
					const stepNumber = stepElement.getAttribute("data-step");
					if (stepNumber) {
						setActiveStep(parseInt(stepNumber, 10));
					}
				}
			});
		};

		const observer = new IntersectionObserver(
			observerCallback,
			observerOptions,
		);

		const setupObserver = () => {
			const steps = document.querySelectorAll<HTMLDivElement>("[data-step]");
			if (steps.length > 0) {

				steps.forEach((step) => observer.observe(step));
				return true;
			}
			return false;
		};

		if (!setupObserver()) {
			const timeoutId = setTimeout(setupObserver, 200);
			return () => {
				clearTimeout(timeoutId);
				observer.disconnect();
			};
		}

		return () => observer.disconnect();
	}, [mounted]);

	const stepVisuals: StepVisual[] = [
		{
			step: 1,
			icon: Users,
			color: "#95CA55",
			title: "Profile Setup",
			imagePath: "/how-it-works/step-1.png",
		},
		{
			step: 2,
			icon: Brain,
			color: "#4CA8D3",
			title: "AI Matching",
			imagePath: "/how-it-works/step-2.png",
		},
		{
			step: 3,
			icon: FileCheck,
			color: "#E8A634",
			title: "Application Tracking",
			imagePath: "/how-it-works/step-3.png",
		},
		{
			step: 4,
			icon: Sparkles,
			color: "#95CA55",
			title: "AI Enhancement",
			imagePath: "/how-it-works/step-4.png",
		},
	];

	const currentVisual = stepVisuals[activeStep - 1];
	const Icon = currentVisual.icon;

	return (
		<div className="relative w-full h-full bg-card rounded-2xl shadow-2xl p-8 overflow-hidden">
			<motion.div
				className="absolute inset-0 opacity-5"
				animate={{
					background: `radial-gradient(circle at 50% 50%, ${currentVisual.color} 0%, transparent 70%)`,
				}}
				transition={{ duration: 0.6, ease: "easeOut" }}
			/>
			<div className="relative flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					<div
						className="w-12 h-12 rounded-xl flex items-center justify-center"
						style={{ backgroundColor: `${currentVisual.color}20` }}
					>
						<Icon className="w-6 h-6" style={{ color: currentVisual.color }} />
					</div>
					<div>
						<p className="text-sm text-muted-foreground font-medium">
							Step {currentVisual.step}
						</p>
						<p className="text-lg font-bold text-foreground">
							{currentVisual.title}
						</p>
					</div>
				</div>
				<div className="flex gap-2">
					{[1, 2, 3, 4].map((step) => (
						<div
							key={step}
							className={`w-2 h-2 rounded-full transition-all duration-300 ${step === activeStep ? "bg-primary" : "bg-muted"}`}
							style={{
								width: step === activeStep ? "24px" : "8px",
								backgroundColor:
									step === activeStep ? currentVisual.color : undefined,
							}}
						/>
					))}
				</div>
			</div>
			<div className="relative h-[450px] w-full rounded-xl overflow-hidden flex items-center justify-center">
				<Image
					src={currentVisual.imagePath}
					alt={currentVisual.title}
					fill
					className="object-contain p-4"
					priority={activeStep === 1}
				/>
			</div>
		</div>
	);
}

export default function HomePage() {
	const t = useTranslations("landing");
	const tNav = useTranslations("nav");
	const tAuth = useTranslations("auth");
	const searchParams = useSearchParams();
	const [showExpiredAlert, setShowExpiredAlert] = useState(false);


	useEffect(() => {
		const expired = searchParams.get("expired");
		if (expired === "true") {
			setShowExpiredAlert(true);

			const timer = setTimeout(() => {
				setShowExpiredAlert(false);
			}, 10000);
			return () => clearTimeout(timer);
		}
	}, [searchParams]);

	const marqueeUniversities = [
		...featuredUniversities,
		...featuredUniversities,
	];


	const _stats = [
		{ value: "2,000+", labelKey: "statsStudents", icon: Users },
		{ value: "1,500+", labelKey: "statsUniversities", icon: School },
		{ value: "50+", labelKey: "statsCountries", icon: MapPin },
	];


	const features = [
		{
			icon: Globe,
			titleKey: "feature1Title",
			descKey: "feature1Desc",
			href: "/features",
		},
		{
			icon: Brain,
			titleKey: "feature2Title",
			descKey: "feature2Desc",
			href: "/features",
		},
		{
			icon: Target,
			titleKey: "feature3Title",
			descKey: "feature3Desc",
			href: "/features",
		},
		{
			icon: Sparkles,
			titleKey: "feature4Title",
			descKey: "feature4Desc",
			href: "/features",
		},
	];


	const howItWorksSteps = [
		{
			step: 1,
			icon: Users,
			titleKey: "step1Title",
			quoteKey: "step1Quote",
			descKey: "step1Desc",
		},
		{
			step: 2,
			icon: Brain,
			titleKey: "step2Title",
			quoteKey: "step2Quote",
			descKey: "step2Desc",
		},
		{
			step: 3,
			icon: FileCheck,
			titleKey: "step3Title",
			quoteKey: "step3Quote",
			descKey: "step3Desc",
		},
		{
			step: 4,
			icon: Sparkles,
			titleKey: "step4Title",
			quoteKey: "step4Quote",
			descKey: "step4Desc",
		},
	];

	return (
		<div className="min-h-screen">
			{}
			{showExpiredAlert && (
				<div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
					<Alert variant="destructive" className="shadow-lg">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>{tAuth("sessionExpired")}</AlertTitle>
						<AlertDescription>
							{tAuth("sessionExpiredMessage")}
						</AlertDescription>
						<button
							type="button"
							onClick={() => setShowExpiredAlert(false)}
							className="absolute top-2 right-2 p-1 rounded-md hover:bg-destructive/10 transition-colors"
							aria-label="Close"
						>
							<span className="sr-only">Close</span>
							<svg
								className="h-4 w-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Close notification</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</Alert>
				</div>
			)}

			{}
			<section className="relative bg-background py-20 md:py-32 overflow-hidden">
				<div className="absolute inset-0 z-0">
					<Image
						src="/hero.png"
						alt="Hero background"
						fill
						className="object-cover opacity-15"
						priority
						quality={90}
					/>
					<div className="absolute inset-0 bg-linear-to-b from-background/50 via-transparent to-background" />
				</div>

				<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
					<motion.div
						className="absolute top-20 left-[10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl"
						animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
						transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
					/>
					<motion.div
						className="absolute bottom-20 right-[10%] w-80 h-80 bg-chart-2/10 rounded-full blur-3xl"
						animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
						transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
					/>
				</div>

				<div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="flex flex-col items-center gap-8">
						<SlideUp>
							<div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-4">
								<Sparkles className="w-4 h-4" />
								{t("badge")}
							</div>
						</SlideUp>
						<SlideUp delay={0.05}>
							<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
								{t("heroTitle")}
								<br />
								<span className="text-primary">{t("heroTitleHighlight")}</span>
							</h1>
						</SlideUp>
						<SlideUp delay={0.1}>
							<p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl">
								{t("heroSubtitle")}
							</p>
						</SlideUp>
						<SlideUp delay={0.15}>
							<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center mt-4">
								<Button
									size="lg"
									className="text-lg px-8 py-6 sm:min-w-[220px] shadow-lg shadow-primary/25"
									asChild
								>
									<Link href="/register">
										{t("ctaStart")}
										<ArrowRight className="ml-2 w-5 h-5" />
									</Link>
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="text-lg px-8 py-6 sm:min-w-[220px]"
									asChild
								>
									<Link href="#features">
										{t("ctaLearnMore")}
										<ChevronDown className="ml-2 w-5 h-5" />
									</Link>
								</Button>
							</div>
							<p className="text-sm text-muted-foreground mt-4">
								{t("alreadyHaveAccount")}{" "}
								<Link
									href="/login"
									className="text-primary hover:underline font-medium"
								>
									{tNav("login")}
								</Link>
							</p>
						</SlideUp>
					</div>
				</div>
			</section>

			{}
			<section className="py-16 bg-muted">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<SlideUp>
							<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
								{t("universitiesTitle")}
							</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								{t("universitiesSubtitle")}
							</p>
						</SlideUp>
					</div>

					<div className="relative overflow-hidden">
						<div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-muted to-transparent pointer-events-none" />
						<div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-muted to-transparent pointer-events-none" />
						<div className="marquee-track flex items-center gap-10 py-6">
							{marqueeUniversities.map((university, index) => (
								<div
									key={`${university.name}-${index}`}
									className="flex items-center shrink-0"
								>
									<div className="relative w-32 h-16">
										<Image
											src={university.logo}
											alt={university.name}
											fill
											className="object-contain"
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{}
			<section id="features" className="py-20 bg-background scroll-mt-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-16">
						<SlideUp>
							<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
								<h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight max-w-xl">
									<span className="relative inline-block">
										<span className="absolute inset-x-0 bottom-1 h-3 bg-accent/60 rounded-md" />
										<span className="relative">{t("featuresTitle")}</span>
									</span>{" "}
									{t("featuresTitleSuffix")}
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl">
									{t("featuresSubtitle")}
								</p>
							</div>
						</SlideUp>
					</div>

					<StaggerContainer>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
							{features.map((feature) => {
								const Icon = feature.icon;
								return (
									<StaggerItem key={feature.titleKey}>
										<Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-200 group">
											<CardContent className="p-6 flex flex-col h-full gap-4">
												<div className="p-3 bg-primary/10 rounded-2xl w-fit group-hover:bg-primary/20 transition-colors">
													<Icon className="w-6 h-6 text-primary" />
												</div>
												<div className="flex-1">
													<h3 className="text-lg font-semibold text-foreground mb-2">
														{t(feature.titleKey)}
													</h3>
													<p className="text-sm text-muted-foreground leading-relaxed">
														{t(feature.descKey)}
													</p>
												</div>
												<div className="mt-auto pt-4">
													<Link
														href={feature.href}
														className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
													>
														{t("learnMore")}
														<ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
													</Link>
												</div>
											</CardContent>
										</Card>
									</StaggerItem>
								);
							})}
						</div>
					</StaggerContainer>
				</div>
			</section>

			{}
			<section id="how-it-works" className="py-20 bg-muted scroll-mt-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<SlideUp>
							<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
								{t("howItWorksTitle")}
							</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								{t("howItWorksSubtitle")}
							</p>
						</SlideUp>
					</div>

					{}
					<div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start hidden">
						<div className="space-y-32 py-12">
							{howItWorksSteps.map((item) => (
								<ScrollHighlightStep key={item.step}>
									<div className="relative" data-step={item.step}>
										<div className="flex items-start gap-6 mb-6">
											<div className="shrink-0 w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
												{item.step}
											</div>
											<div className="flex-1 pt-2">
												<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
													{t(item.titleKey)}
												</h3>
											</div>
										</div>
										<div className="space-y-4 mb-6">
											<div className="flex justify-end gap-3">
												<div className="max-w-[85%] rounded-lg px-4 py-3 bg-primary text-primary-foreground shadow-sm">
													<p className="text-base leading-relaxed">
														{t(item.quoteKey)}
													</p>
												</div>
												<div className="shrink-0 w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
													<User className="w-5 h-5 text-background" />
												</div>
											</div>
											<div className="flex justify-start gap-3">
												<div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
													<Bot className="w-5 h-5 text-primary-foreground" />
												</div>
												<div className="max-w-[85%] rounded-lg px-4 py-3 bg-card border border-border shadow-sm">
													<p className="text-base text-foreground leading-relaxed">
														{t(item.descKey)}
													</p>
												</div>
											</div>
										</div>
									</div>
								</ScrollHighlightStep>
							))}
						</div>
						<div className="sticky top-24 h-[600px] flex items-center justify-center">
							<ParallaxVisual />
						</div>
					</div>

					{}
					<div className="lg:hidden space-y-24">
						{howItWorksSteps.map((item) => (
							<ScrollHighlightStep key={item.step}>
								<div className="relative">
									<div className="flex items-start gap-6 mb-6">
										<div className="shrink-0 w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
											{item.step}
										</div>
										<div className="flex-1 pt-2">
											<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
												{t(item.titleKey)}
											</h3>
										</div>
									</div>
									<div className="space-y-4 mb-6">
										<div className="flex justify-end gap-3">
											<div className="max-w-[85%] rounded-lg px-4 py-3 bg-primary text-primary-foreground shadow-sm">
												<p className="text-base leading-relaxed">
													{t(item.quoteKey)}
												</p>
											</div>
											<div className="shrink-0 w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
												<User className="w-5 h-5 text-background" />
											</div>
										</div>
										<div className="flex justify-start gap-3">
											<div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
												<Bot className="w-5 h-5 text-primary-foreground" />
											</div>
											<div className="max-w-[85%] rounded-lg px-4 py-3 bg-card border border-border shadow-sm">
												<p className="text-base text-foreground leading-relaxed">
													{t(item.descKey)}
												</p>
											</div>
										</div>
									</div>
								</div>
							</ScrollHighlightStep>
						))}
					</div>
				</div>
			</section>

			{}
			<section className="py-24 cta-pattern text-secondary-foreground/90 relative overflow-hidden">
				<div className="absolute inset-0 bg-background/40 z-0" />
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
					<SlideUp>
						<div className="inline-flex items-center gap-2 bg-primary-foreground/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
							<Sparkles className="w-4 h-4" />
							{t("ctaFree")}
						</div>
						<h2 className="text-3xl md:text-5xl font-bold mb-6">
							{t("ctaTitle")}
						</h2>
						<p className="text-lg md:text-xl mb-10 text-secondary-foreground/90 max-w-2xl mx-auto">
							{t("ctaSubtitle")}
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button
								size="lg"
								variant="secondary"
								className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold text-lg px-8 py-6"
								asChild
							>
								<Link href="/register">
									{t("ctaCreateAccount")}
									<ArrowRight className="ml-2 w-5 h-5" />
								</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="bg-transparent border-secondary-foreground text-secondary-foreground/90 hover:bg-primary-foreground hover:text-primary text-lg px-8 py-6"
								asChild
							>
								{}
								<Link href="/login">{tNav("login")}</Link>
							</Button>
						</div>
					</SlideUp>
				</div>
			</section>

			<style jsx global>{`
				@keyframes leaply-marquee {
					from { transform: translateX(0); }
					to { transform: translateX(-50%); }
				}
				.marquee-track {
					width: max-content;
					animation: leaply-marquee 30s linear infinite;
				}
				.cta-pattern {
					--s: 185px;
					--c1: #9bdb70;
					--c2: #e3ffd1;
					--c3: #638e57;
					--_g: 0 120deg,#0000 0;
					background:
						conic-gradient(at calc(250%/3) calc(100%/3),var(--c3) var(--_g)),
						conic-gradient(from -120deg at calc( 50%/3) calc(100%/3),var(--c2) var(--_g)),
						conic-gradient(from  120deg at calc(100%/3) calc(250%/3),var(--c1) var(--_g)),
						conic-gradient(from  120deg at calc(200%/3) calc(250%/3),var(--c1) var(--_g)),
						conic-gradient(from -180deg at calc(100%/3) 50%,var(--c2)  60deg,var(--c1) var(--_g)),
						conic-gradient(from   60deg at calc(200%/3) 50%,var(--c1)  60deg,var(--c3) var(--_g)),
						conic-gradient(from  -60deg at 50% calc(100%/3),var(--c1) 120deg,var(--c2) 0 240deg,var(--c3) 0);
					background-size: calc(var(--s)*sqrt(3)) var(--s);
				}
			`}</style>
		</div>
	);
}
````

## File: app/globals.css
````css
@import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap");
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@plugin "@tailwindcss/forms";
@plugin "@tailwindcss/typography";

:root {
	--card: oklch(1 0 0);
	--card-foreground: oklch(0.129 0.042 264.695);
	--popover: oklch(1 0 0);
	--popover-foreground: oklch(0.129 0.042 264.695);
	--primary: oklch(0.7776 0.1578 129.8379);
	--primary-foreground: oklch(0.984 0.003 247.858);
	--secondary: oklch(0.968 0.007 247.896);
	--secondary-foreground: oklch(0.208 0.042 265.755);
	--muted: oklch(0.968 0.007 247.896);
	--muted-foreground: oklch(0.554 0.046 257.417);
	--accent: oklch(0.9676 0.0673 99.321);
	--accent-foreground: oklch(0.208 0.042 265.755);
	--destructive: oklch(0.577 0.245 27.325);
	--destructive-foreground: oklch(1 0 0);
	--border: oklch(0.929 0.013 255.508);
	--input: oklch(0.929 0.013 255.508);
	--ring: oklch(0.7776 0.1578 129.8379);
	--chart-1: oklch(0.7776 0.1578 129.8379);
	--chart-2: oklch(0.7137 0.1434 254.624);
	--chart-3: oklch(0.9052 0.1657 98.1108);
	--chart-4: oklch(0.7576 0.159 55.9344);
	--chart-5: oklch(0.709 0.1592 293.5412);
	--sidebar: oklch(0.984 0.003 247.858);
	--sidebar-foreground: oklch(0.129 0.042 264.695);
	--sidebar-primary: oklch(0.7776 0.1578 129.8379);
	--sidebar-primary-foreground: oklch(0.984 0.003 247.858);
	--sidebar-accent: oklch(0.8868 0.1822 95.3305);
	--sidebar-accent-foreground: oklch(0.208 0.042 265.755);
	--sidebar-border: oklch(0.929 0.013 255.508);
	--sidebar-ring: oklch(0.7776 0.1578 129.8379);
	--font-sans: Raleway, ui-sans-serif, sans-serif, system-ui;
	--font-serif: "Lora", serif;
	--font-mono: "Fira Code", monospace;
	--radius: 0.625rem;
	--shadow-x: 0rem;
	--shadow-y: 0.25rem;
	--shadow-blur: 1rem;
	--shadow-spread: 0rem;
	--shadow-opacity: 0.1;
	--shadow-color: #95ca55;
	--shadow-2xs: 0rem 0.25rem 1rem 0rem hsl(87.1795 52.4664% 56.2745% / 0.05);
	--shadow-xs: 0rem 0.25rem 1rem 0rem hsl(87.1795 52.4664% 56.2745% / 0.05);
	--shadow-sm:
		0rem 0.25rem 1rem 0rem hsl(87.1795 52.4664% 56.2745% / 0.1), 0rem 1px 2px
		-1px hsl(87.1795 52.4664% 56.2745% / 0.1);
	--shadow:
		0rem 0.25rem 1rem 0rem hsl(87.1795 52.4664% 56.2745% / 0.1), 0rem 1px 2px
		-1px hsl(87.1795 52.4664% 56.2745% / 0.1);
	--shadow-md:
		0rem 0.25rem 1rem 0rem hsl(87.1795 52.4664% 56.2745% / 0.1), 0rem 2px 4px
		-1px hsl(87.1795 52.4664% 56.2745% / 0.1);
	--shadow-lg:
		0rem 0.25rem 1rem 0rem hsl(87.1795 52.4664% 56.2745% / 0.1), 0rem 4px 6px
		-1px hsl(87.1795 52.4664% 56.2745% / 0.1);
	--shadow-xl:
		0rem 0.25rem 1rem 0rem hsl(87.1795 52.4664% 56.2745% / 0.1), 0rem 8px 10px
		-1px hsl(87.1795 52.4664% 56.2745% / 0.1);
	--shadow-2xl: 0rem 0.25rem 1rem 0rem hsl(87.1795 52.4664% 56.2745% / 0.25);
	--tracking-normal: 0em;
	--spacing: 0.25rem;
	--background: oklch(0.9846 0.0017 247.8389);
	--foreground: oklch(0.2781 0.0296 256.848);
}

.dark {
	--background: oklch(0.129 0.042 264.695);
	--foreground: oklch(0.984 0.003 247.858);
	--card: oklch(0.208 0.042 265.755);
	--card-foreground: oklch(0.984 0.003 247.858);
	--popover: oklch(0.208 0.042 265.755);
	--popover-foreground: oklch(0.984 0.003 247.858);
	--primary: oklch(0.7776 0.1578 129.8379);
	--primary-foreground: oklch(0.208 0.042 265.755);
	--secondary: oklch(0.279 0.041 260.031);
	--secondary-foreground: oklch(0.984 0.003 247.858);
	--muted: oklch(0.279 0.041 260.031);
	--muted-foreground: oklch(0.704 0.04 256.788);
	--accent: oklch(0.279 0.041 260.031);
	--accent-foreground: oklch(0.984 0.003 247.858);
	--destructive: oklch(0.704 0.191 22.216);
	--destructive-foreground: oklch(1 0 0);
	--border: oklch(1 0 0 / 10%);
	--input: oklch(1 0 0 / 15%);
	--ring: oklch(0.7776 0.1578 129.8379);
	--chart-1: oklch(0.7776 0.1578 129.8379);
	--chart-2: oklch(0.7137 0.1434 254.624);
	--chart-3: oklch(0.9052 0.1657 98.1108);
	--chart-4: oklch(0.7576 0.159 55.9344);
	--chart-5: oklch(0.709 0.1592 293.5412);
	--sidebar: oklch(0.2433 0.0247 263.9506);
	--sidebar-foreground: oklch(0.9288 0.0126 255.5078);
	--sidebar-primary: oklch(0.7776 0.1578 129.8379);
	--sidebar-primary-foreground: oklch(1 0 0);
	--sidebar-accent: oklch(0.8868 0.1822 95.3305);
	--sidebar-accent-foreground: oklch(0.2781 0.0296 256.848);
	--sidebar-border: oklch(0.3729 0.0306 259.7328);
	--sidebar-ring: oklch(0.7776 0.1578 129.8379);
	--font-sans: Raleway, ui-sans-serif, sans-serif, system-ui;
	--font-serif: "Lora", serif;
	--font-mono: "Fira Code", monospace;
	--radius: 0.5rem;
	--shadow-x: 0rem;
	--shadow-y: 0.25rem;
	--shadow-blur: 1rem;
	--shadow-spread: 0rem;
	--shadow-opacity: 0.2;
	--shadow-color: #000000;
	--shadow-2xs: 0rem 0.25rem 1rem 0rem hsl(0 0% 0% / 0.1);
	--shadow-xs: 0rem 0.25rem 1rem 0rem hsl(0 0% 0% / 0.1);
	--shadow-sm:
		0rem 0.25rem 1rem 0rem hsl(0 0% 0% / 0.2), 0rem 1px 2px -1px
		hsl(0 0% 0% / 0.2);
	--shadow:
		0rem 0.25rem 1rem 0rem hsl(0 0% 0% / 0.2), 0rem 1px 2px -1px
		hsl(0 0% 0% / 0.2);
	--shadow-md:
		0rem 0.25rem 1rem 0rem hsl(0 0% 0% / 0.2), 0rem 2px 4px -1px
		hsl(0 0% 0% / 0.2);
	--shadow-lg:
		0rem 0.25rem 1rem 0rem hsl(0 0% 0% / 0.2), 0rem 4px 6px -1px
		hsl(0 0% 0% / 0.2);
	--shadow-xl:
		0rem 0.25rem 1rem 0rem hsl(0 0% 0% / 0.2), 0rem 8px 10px -1px
		hsl(0 0% 0% / 0.2);
	--shadow-2xl: 0rem 0.25rem 1rem 0rem hsl(0 0% 0% / 0.5);
}

@theme inline {
	--color-background: var(--background);
	--color-foreground: var(--foreground);
	--color-card: var(--card);
	--color-card-foreground: var(--card-foreground);
	--color-popover: var(--popover);
	--color-popover-foreground: var(--popover-foreground);
	--color-primary: var(--primary);
	--color-primary-foreground: var(--primary-foreground);
	--color-secondary: var(--secondary);
	--color-secondary-foreground: var(--secondary-foreground);
	--color-muted: var(--muted);
	--color-muted-foreground: var(--muted-foreground);
	--color-accent: var(--accent);
	--color-accent-foreground: var(--accent-foreground);
	--color-destructive: var(--destructive);
	--color-destructive-foreground: var(--destructive-foreground);
	--color-border: var(--border);
	--color-input: var(--input);
	--color-ring: var(--ring);
	--color-chart-1: var(--chart-1);
	--color-chart-2: var(--chart-2);
	--color-chart-3: var(--chart-3);
	--color-chart-4: var(--chart-4);
	--color-chart-5: var(--chart-5);
	--color-sidebar: var(--sidebar);
	--color-sidebar-foreground: var(--sidebar-foreground);
	--color-sidebar-primary: var(--sidebar-primary);
	--color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
	--color-sidebar-accent: var(--sidebar-accent);
	--color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
	--color-sidebar-border: var(--sidebar-border);
	--color-sidebar-ring: var(--sidebar-ring);

	--font-sans: var(--font-sans);
	--font-mono: var(--font-mono);
	--font-serif: var(--font-serif);

	--radius-sm: calc(var(--radius) - 4px);
	--radius-md: calc(var(--radius) - 2px);
	--radius-lg: var(--radius);
	--radius-xl: calc(var(--radius) + 4px);

	--shadow-2xs: var(--shadow-2xs);
	--shadow-xs: var(--shadow-xs);
	--shadow-sm: var(--shadow-sm);
	--shadow: var(--shadow);
	--shadow-md: var(--shadow-md);
	--shadow-lg: var(--shadow-lg);
	--shadow-xl: var(--shadow-xl);
	--shadow-2xl: var(--shadow-2xl);

	--animate-fade-in: fadeIn 0.3s ease-out;
	--animate-slide-up: slideUp 0.4s ease-out;
	--animate-slide-down: slideDown 0.4s ease-out;

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes slideUp {
		0% {
			transform: translateY(20px);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}
	@keyframes slideDown {
		0% {
			transform: translateY(-20px);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}
}

@utility container-padding {
	@apply px-4 sm:px-6 lg:px-8;
}

@utility page-container {
	@apply max-w-7xl mx-auto container-padding py-8;
}

@layer base {
	:root {
		--radius: 0.5rem;
	}

	* {
		@apply border-border outline-ring/50;
	}

	body {
		@apply bg-background text-foreground;
	}
}
````

## File: components/onboarding/OnboardingHeader.tsx
````typescript
"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/app/LanguageSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { performLogout } from "@/lib/auth/logout";
import { useUserStore } from "@/lib/store/userStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export function OnboardingHeader() {
	const t = useTranslations("nav");
	const { profile } = useUserStore();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);


	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = async () => {
		try {

			await fetch(`${API_URL}/oauth/logout`, {
				method: "POST",
				credentials: "include",
			});
		} catch (error) {
			console.error("Logout API error:", error);
		} finally {

			performLogout({ redirect: "/" });
		}
	};

	const getInitials = (name?: string) => {
		if (!name) return "U";
		const parts = name.trim().split(" ");
		if (parts.length >= 2) {
			return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
		}
		return name.slice(0, 2).toUpperCase();
	};

	return (
		<div className="w-full border-b border-border">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
				<div className="flex items-center justify-between">
					<Link href="/" className="flex items-center">
						<Image
							src="/Logo.png"
							alt="Leaply"
							width={120}
							height={40}
							className="h-8 w-auto"
						/>
					</Link>
					<div className="flex items-center gap-3">
						<LanguageSwitcher />
						{}
						<div className="relative" ref={dropdownRef}>
							<button
								type="button"
								onClick={() => setDropdownOpen(!dropdownOpen)}
								className="flex items-center focus:outline-none"
								aria-label="User menu"
							>
								<Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
									<AvatarImage
										src={profile?.profilePicture}
										alt={profile?.fullName || "User"}
									/>
									<AvatarFallback className="bg-primary/10 text-primary font-medium">
										{getInitials(profile?.fullName)}
									</AvatarFallback>
								</Avatar>
							</button>
							{dropdownOpen && (
								<div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
									<button
										type="button"
										onClick={handleLogout}
										className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
									>
										<LogOut className="w-4 h-4" />
										{t("logout")}
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
````

## File: components/persona-lab/canvas/GraphListView.tsx
````typescript
"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	BookOpen,
	ChevronDown,
	ChevronRight,
	FileText,
	Monitor,
	Sparkles,
	Target,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ARCHETYPES } from "@/lib/constants/archetypes";
import { TRACK_COLORS } from "@/lib/constants/tracks";
import { LAYOUT_CONFIG } from "@/lib/hooks/useForceLayout";
import { usePersonaStore } from "@/lib/store/personaStore";
import type { LayerNumber, PersonaNodeDto } from "@/lib/types/persona-graph";
import { cn } from "@/lib/utils";


function useIsMobile(breakpoint = 768) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < breakpoint);
		};


		checkMobile();


		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, [breakpoint]);

	return isMobile;
}

const LAYER_CONFIG = {
	0: {
		label: "Hồ sơ cá nhân",
		icon: Sparkles,
		description: "Tổng quan về bạn và archetype",
	},
	1: {
		label: "Góc nhìn Essay",
		icon: Target,
		description: "Các chủ đề chính cho bài essay",
	},
	2: {
		label: "Câu chuyện chính",
		icon: BookOpen,
		description: "Những trải nghiệm quan trọng",
	},
	3: {
		label: "Chi tiết",
		icon: FileText,
		description: "Bằng chứng và insights hỗ trợ",
	},
};

interface GraphListViewProps {
	className?: string;
}







export function GraphListView({ className }: GraphListViewProps) {
	const { graphNodes, isGraphLoading, fetchPersonaGraph } = usePersonaStore();
	const [expandedLayers, setExpandedLayers] = useState<Set<number>>(
		new Set([0, 1]),
	);
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
	const isMobile = useIsMobile(768);


	useEffect(() => {
		fetchPersonaGraph();
	}, [fetchPersonaGraph]);


	const nodesByLayer = useMemo(() => {
		const validLayers: LayerNumber[] = [0, 1, 2, 3];
		const groups = new Map<LayerNumber, PersonaNodeDto[]>();
		validLayers.forEach((layer) => {
			groups.set(layer, []);
		});

		graphNodes.forEach((node) => {

			const layer = node.layer as number;
			if (!validLayers.includes(layer as LayerNumber)) {
				console.warn(
					`[GraphListView] Invalid layer ${layer} for node ${node.id}, defaulting to layer 3`,
				);

				const layerNodes = groups.get(3) || [];
				layerNodes.push(node);
				groups.set(3, layerNodes);
				return;
			}
			const layerNodes = groups.get(layer as LayerNumber) || [];
			layerNodes.push(node);
			groups.set(layer as LayerNumber, layerNodes);
		});

		return groups;
	}, [graphNodes]);


	const toggleLayer = (layer: number) => {
		setExpandedLayers((prev) => {
			const next = new Set(prev);
			if (next.has(layer)) {
				next.delete(layer);
			} else {
				next.add(layer);
			}
			return next;
		});
	};


	if (isGraphLoading) {
		return (
			<div
				className={cn("flex items-center justify-center h-full p-8", className)}
			>
				<div className="flex flex-col items-center gap-3">
					<div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
					<p className="text-sm text-muted-foreground">Đang tải...</p>
				</div>
			</div>
		);
	}

	return (
		<div className={cn("flex flex-col h-full overflow-hidden", className)}>
			{}
			{isMobile && (
				<div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
						<Monitor className="w-5 h-5" />
					</div>
					<div>
						<p className="text-sm font-medium">Xem graph đầy đủ trên desktop</p>
						<p className="text-xs text-white/80">
							Mở trên màn hình lớn để trải nghiệm visualization tương tác
						</p>
					</div>
				</div>
			)}

			{}
			<div className="flex-1 overflow-y-auto">
				{([0, 1, 2, 3] as LayerNumber[]).map((layer) => {
					const nodes = nodesByLayer.get(layer) || [];
					const config = LAYER_CONFIG[layer];
					const isExpanded = expandedLayers.has(layer);
					const layerColor = LAYOUT_CONFIG.colors[layer];
					const Icon = config.icon;

					if (nodes.length === 0 && layer !== 0) return null;

					return (
						<div key={layer} className="border-b last:border-b-0">
							{}
							<button
								type="button"
								className={cn(
									"w-full flex items-center gap-3 p-4 text-left",
									"hover:bg-muted/50 transition-colors",
								)}
								onClick={() => toggleLayer(layer)}
							>
								<div
									className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
									style={{ backgroundColor: `${layerColor}15` }}
								>
									<Icon className="w-4 h-4" style={{ color: layerColor }} />
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<span className="text-sm font-semibold">
											{config.label}
										</span>
										<span
											className="text-xs px-1.5 py-0.5 rounded-full"
											style={{
												backgroundColor: `${layerColor}15`,
												color: layerColor,
											}}
										>
											{nodes.length}
										</span>
									</div>
									<p className="text-xs text-muted-foreground truncate">
										{config.description}
									</p>
								</div>

								{isExpanded ? (
									<ChevronDown className="w-4 h-4 text-muted-foreground" />
								) : (
									<ChevronRight className="w-4 h-4 text-muted-foreground" />
								)}
							</button>

							{}
							<AnimatePresence>
								{isExpanded && (
									<motion.div
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: "auto", opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.2 }}
										className="overflow-hidden"
									>
										{nodes.length === 0 ? (
											<div className="px-4 pb-4 pl-14">
												<p className="text-xs text-muted-foreground italic">
													Chưa có dữ liệu. Hoàn thành thêm tracks để khám phá.
												</p>
											</div>
										) : (
											<div className="px-4 pb-4 pl-14 space-y-2">
												{nodes.map((node) => (
													<NodeListItem
														key={node.id}
														node={node}
														layerColor={layerColor}
														isSelected={selectedNodeId === node.id}
														onClick={() =>
															setSelectedNodeId(
																selectedNodeId === node.id ? null : node.id,
															)
														}
													/>
												))}
											</div>
										)}
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					);
				})}
			</div>
		</div>
	);
}


interface NodeListItemProps {
	node: PersonaNodeDto;
	layerColor: string;
	isSelected: boolean;
	onClick: () => void;
}

function NodeListItem({
	node,
	layerColor,
	isSelected,
	onClick,
}: NodeListItemProps) {
	const trackColors = node.sourceTrackId
		? TRACK_COLORS[node.sourceTrackId]
		: null;

	const primaryArchetype = node.primaryArchetype
		? ARCHETYPES[node.primaryArchetype]
		: null;

	return (
		<motion.button
			className={cn(
				"w-full text-left p-3 rounded-lg border transition-all",
				"hover:shadow-sm",
				isSelected
					? "border-2 shadow-sm"
					: "border-border hover:border-muted-foreground/30",
			)}
			style={{
				borderColor: isSelected ? layerColor : undefined,
				backgroundColor: isSelected ? `${layerColor}05` : "transparent",
			}}
			onClick={onClick}
			initial={false}
			animate={{ scale: isSelected ? 1.01 : 1 }}
		>
			{}
			<h4 className="text-sm font-medium text-foreground mb-1">{node.title}</h4>

			{}
			<p
				className={cn(
					"text-xs text-muted-foreground",
					isSelected ? "" : "line-clamp-2",
				)}
			>
				{node.description}
			</p>

			{}
			{primaryArchetype && (
				<div
					className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-medium"
					style={{
						backgroundColor: `${primaryArchetype.color}15`,
						color: primaryArchetype.color,
					}}
				>
					<Sparkles className="w-3 h-3" />
					{primaryArchetype.title}
				</div>
			)}

			{}
			{isSelected && node.tags && node.tags.length > 0 && (
				<div className="flex flex-wrap gap-1 mt-2">
					{node.tags.map((tag) => (
						<span
							key={tag}
							className="text-[10px] px-1.5 py-0.5 rounded-full"
							style={{
								backgroundColor: `${layerColor}15`,
								color: layerColor,
							}}
						>
							{tag}
						</span>
					))}
				</div>
			)}

			{}
			{trackColors && node.sourceTrackId && (
				<div className="flex items-center gap-1.5 mt-2">
					<div
						className="w-1.5 h-1.5 rounded-full"
						style={{ backgroundColor: trackColors.primary }}
					/>
					<span className="text-[10px] text-muted-foreground">
						{node.sourceTrackId.replace(/_/g, " ")}
					</span>
				</div>
			)}
		</motion.button>
	);
}
````

## File: components/providers/AuthProvider.tsx
````typescript
"use client";

import Cookies from "js-cookie";
import { useEffect, useRef } from "react";
import { performLogout } from "@/lib/auth/logout";
import { authService } from "@/lib/services/auth";
import { useUserStore } from "@/lib/store/userStore";




function decodeJwtPayload(token: string): { exp?: number } | null {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) return null;
		const payload = JSON.parse(atob(parts[1]));
		return payload;
	} catch {
		return null;
	}
}




function isTokenExpired(token: string): boolean {
	const payload = decodeJwtPayload(token);
	if (!payload?.exp) return true;


	return payload.exp * 1000 < Date.now() + 60000;
}

interface AuthProviderProps {
	children: React.ReactNode;
}





const COOKIE_AUTH_TOKEN = "COOKIE_AUTH";











export function AuthProvider({ children }: AuthProviderProps) {
	const { accessToken, isAuthenticated, login, profile } = useUserStore();
	const validationDone = useRef(false);

	useEffect(() => {

		if (validationDone.current) return;
		validationDone.current = true;

		async function validateAuth() {

			const authStateCookie = Cookies.get("leaply-auth-state");
			let cookieAuth = false;

			try {
				const parsed = JSON.parse(authStateCookie || "{}");
				cookieAuth = parsed.isAuthenticated === true;
			} catch {

			}



			if (cookieAuth && !isAuthenticated) {
				console.warn("Auth state corruption detected: clearing stale cookie");
				Cookies.remove("leaply-auth-state", { path: "/" });
				return;
			}



			if (isAuthenticated && !accessToken) {
				console.warn("Auth state corruption detected: auth but no token");
				performLogout();
				return;
			}


			if (!isAuthenticated) return;


			const isCookieAuth =
				!accessToken || accessToken === "" || accessToken === COOKIE_AUTH_TOKEN;

			// For token-based auth, check JWT expiry locally first
			// Note: API client will automatically refresh expired tokens,
			// but we can catch obviously expired tokens before making a request
			if (!isCookieAuth) {
				if (isTokenExpired(accessToken)) {
					// Don't logout immediately - the API client will attempt refresh
					// Just log for debugging
					console.debug(
						"Access token expired, will attempt refresh on next API call",
					);
				}
			}



			try {
				const userContext = await authService.getCurrentUser();


				if (
					isCookieAuth &&
					accessToken !== COOKIE_AUTH_TOKEN &&
					userContext.user
				) {

					login(
						profile || {
							id: userContext.user.id,
							email: userContext.user.email,
							fullName: "",
						},
						COOKIE_AUTH_TOKEN,
						COOKIE_AUTH_TOKEN,
						0,
						userContext.user.isOnboardingComplete,
					);
				}

				console.log("Auth validated successfully");
			} catch (error) {



				console.error("Auth validation error:", error);
			}
		}

		validateAuth();
	}, [isAuthenticated, accessToken, login, profile]);

	return <>{children}</>;
}
````

## File: .gitignore
````
# Dependencies
node_modules/
.pnp.*

# Build output
.next/
out/
build/
dist/
.turbo/
next-env.d.ts

# Runtime
.vercel/

# Testing
coverage/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*
bun-debug.log*
*.log

# OS metadata
.DS_Store
Thumbs.db

# TypeScript
*.tsbuildinfo

# Local dev
.vscode
.agent
.serena

# Generated Claude Code configurations
.claude/
/docs
.vercel

# Sentry Config File
.env.sentry-build-plugin
````

## File: app/(app)/dashboard/page.tsx
````typescript
import { DashboardClient } from "@/components/dashboard/DashboardClient";







export default function DashboardPage() {


	return <DashboardClient />;
}
````

## File: app/(app)/persona-lab/page.tsx
````typescript
"use client";

import { motion } from "framer-motion";
import { ChevronLeft, LayoutGrid, List, MessageSquare } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import { ChatSidebar } from "@/components/persona-lab/ChatSidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePersonaStore } from "@/lib/store/personaStore";
import { cn } from "@/lib/utils";


const ConcentricGraphCanvas = dynamic(
	() =>
		import("@/components/persona-lab/canvas/ConcentricGraphCanvas").then(
			(mod) => mod.ConcentricGraphCanvas,
		),
	{
		ssr: false,
		loading: () => (
			<div className="flex-1 flex items-center justify-center bg-muted/20">
				<div className="text-center space-y-4">
					<Skeleton className="w-32 h-32 rounded-full mx-auto" />
					<Skeleton className="w-24 h-3 mx-auto" />
				</div>
			</div>
		),
	},
);


const GraphListView = dynamic(
	() =>
		import("@/components/persona-lab/canvas/GraphListView").then(
			(mod) => mod.GraphListView,
		),
	{
		ssr: false,
		loading: () => (
			<div className="p-6 space-y-4">
				<Skeleton className="h-16 w-full rounded-xl" />
				<Skeleton className="h-20 w-full rounded-xl" />
				<Skeleton className="h-20 w-full rounded-xl" />
			</div>
		),
	},
);


function useIsMobile(breakpoint = 768) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < breakpoint);
		};


		checkMobile();


		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, [breakpoint]);

	return isMobile;
}

export default function PersonaLabPage() {
	const t = useTranslations("personaLab");
	const { viewMode, setViewMode } = usePersonaStore();
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const isMobile = useIsMobile(768);


	const renderContent = () => {

		if (isMobile) {
			return <GraphListView className="w-full h-full" />;
		}


		if (viewMode === "list") {
			return <GraphListView className="w-full h-full" />;
		}

		return <ConcentricGraphCanvas className="w-full h-full" />;
	};

	return (
		<PageTransition className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
			<div className="flex flex-1 min-h-0 h-full w-full bg-background overflow-hidden relative">
				{}
				<motion.aside
					initial={false}
					animate={{
						width: isSidebarCollapsed ? 0 : 320,
						opacity: isSidebarCollapsed ? 0 : 1,
					}}
					transition={{ type: "spring", stiffness: 300, damping: 30 }}
					className={cn(
						"relative border-r border-border bg-card/50 backdrop-blur-sm hidden lg:flex flex-col overflow-hidden z-20",
						isSidebarCollapsed ? "border-r-0" : "border-r",
					)}
				>
					<div className="w-[320px] h-full flex flex-col">
						<ChatSidebar />
					</div>
				</motion.aside>

				{}
				<motion.div
					initial={false}
					animate={{
						left: isSidebarCollapsed ? 16 : 304,
						top: isSidebarCollapsed ? "50%" : 16,
						y: isSidebarCollapsed ? "-50%" : 0,
					}}
					transition={{ type: "spring", stiffness: 300, damping: 30 }}
					className="absolute z-30"
				>
					<Button
						variant="secondary"
						size="icon"
						onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
						className={cn(
							"rounded-full shadow-md border border-border transition-all duration-300 hover:bg-primary/10 group",
							isSidebarCollapsed
								? "h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
								: "h-8 w-8",
						)}
					>
						{isSidebarCollapsed ? (
							<MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
						) : (
							<ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
						)}
					</Button>
				</motion.div>

				{}
				<main className="flex-1 min-w-0 flex flex-col min-h-0">
					{}
					<div className="border-b border-border bg-card/80 backdrop-blur-sm px-6 py-3 shrink-0">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-xl font-bold text-foreground">
									{t("canvasTitle")}
								</h1>
								<p className="text-sm text-muted-foreground">
									{t("canvasSubtitle")}
								</p>
							</div>

							{}
							<div className="flex items-center bg-muted rounded-lg p-1">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setViewMode("canvas")}
									className={cn(
										"h-8 px-3 rounded-md gap-1.5",
										viewMode === "canvas"
											? "bg-background shadow-sm"
											: "hover:bg-transparent",
									)}
								>
									<LayoutGrid className="w-4 h-4" />
									<span className="hidden sm:inline text-sm">
										{t("viewCanvas")}
									</span>
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setViewMode("list")}
									className={cn(
										"h-8 px-3 rounded-md gap-1.5",
										viewMode === "list"
											? "bg-background shadow-sm"
											: "hover:bg-transparent",
									)}
								>
									<List className="w-4 h-4" />
									<span className="hidden sm:inline text-sm">
										{t("viewList")}
									</span>
								</Button>
							</div>
						</div>
					</div>

					{}
					<div className="flex-1 min-h-0">{renderContent()}</div>
				</main>
			</div>
		</PageTransition>
	);
}
````

## File: lib/api/applicationsApi.ts
````typescript
import {
	generateApplicationListResponse,
	generateApplicationSopResponse,
	generateEvaluationResponse,
	generateSopFeedbackDto,
} from "@/lib/mock";
import { apiClient } from "./client";
import type {
	ApplicationListResponse,
	ApplicationSopResponse,
	CreateApplicationRequest,
	CreateApplicationResponse,
	DeleteApplicationResponse,
	EvaluationResponse,
	SaveSopRequest,
	SaveSopResponse,
	SopFeedbackDto,
	UpdateApplicationRequest,
	UpdateApplicationResponse,
} from "./types";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";





const MOCK_APPLICATION_LIST: ApplicationListResponse =
	generateApplicationListResponse();

const MOCK_SOP_RESPONSE: ApplicationSopResponse =
	generateApplicationSopResponse();

const MOCK_EVALUATION: EvaluationResponse = generateEvaluationResponse();








export async function getApplications(): Promise<ApplicationListResponse> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return MOCK_APPLICATION_LIST;
	}

	return apiClient.get<ApplicationListResponse>("/v1/applications");
}




export async function createApplication(
	request: CreateApplicationRequest,
): Promise<CreateApplicationResponse> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return {
			id: `app-${Date.now()}`,
			message: "Application created successfully",
		};
	}

	return apiClient.post<CreateApplicationResponse>("/v1/applications", request);
}




export async function updateApplication(
	id: string,
	request: UpdateApplicationRequest,
): Promise<UpdateApplicationResponse> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return {
			id,
			status: request.status || "planning",
			updatedAt: new Date().toISOString(),
		};
	}

	return apiClient.patch<UpdateApplicationResponse>(
		`/v1/applications/${id}`,
		request,
	);
}




export async function deleteApplication(
	id: string,
): Promise<DeleteApplicationResponse> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return {
			success: true,
			message: "Application deleted successfully",
		};
	}

	return apiClient.delete<DeleteApplicationResponse>(`/v1/applications/${id}`);
}








export async function getSop(
	applicationId: string,
): Promise<ApplicationSopResponse> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return { ...MOCK_SOP_RESPONSE, applicationId };
	}

	return apiClient.get<ApplicationSopResponse>(
		`/v1/applications/${applicationId}/sop`,
	);
}




export async function saveSop(
	applicationId: string,
	request: SaveSopRequest,
): Promise<SaveSopResponse> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return {
			id: `sop-${Date.now()}`,
			wordCount: request.content.split(/\s+/).filter(Boolean).length,
			updatedAt: new Date().toISOString(),
		};
	}

	return apiClient.put<SaveSopResponse>(
		`/v1/applications/${applicationId}/sop`,
		request,
	);
}




export async function getSopFeedback(
	applicationId: string,
): Promise<SopFeedbackDto> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return generateSopFeedbackDto();
	}

	return apiClient.post<SopFeedbackDto>(
		`/v1/applications/${applicationId}/sop/feedback`,
		{},
	);
}








export async function getEvaluation(): Promise<EvaluationResponse> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return MOCK_EVALUATION;
	}

	return apiClient.get<EvaluationResponse>("/v1/applications/evaluation");
}
````

## File: app/(app)/explore/[id]/page.tsx
````typescript
"use client";

import {
	ArrowLeft,
	Bookmark,
	BookmarkCheck,
	Check,
	Loader2,
	MapPin,
	Plus,
	Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { MOCK_PROGRAM_DETAIL } from "@/components/explore/mockDetailData";
import {
	ApplicationSidebar,
	FitScoreExpanded,
	ProgramTabs,
	QuickFactsBar,
} from "@/components/explore/program-detail";
import { PageTransition, SlideUp } from "@/components/PageTransition";
import { exploreApi } from "@/lib/api/exploreApi";
import type { ProgramDetailResponse } from "@/lib/api/types";
import { useApplicationsStore } from "@/lib/store/applicationsStore";


const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export default function ProgramDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const resolvedParams = use(params);
	const router = useRouter();
	const [program, setProgram] = useState<ProgramDetailResponse | null>(
		USE_MOCK_DATA ? MOCK_PROGRAM_DETAIL : null,
	);
	const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);
	const [error, setError] = useState<string | null>(null);
	const [isSaved, setIsSaved] = useState(false);
	const [isAddingToApplications, setIsAddingToApplications] = useState(false);
	const [addedToApplications, setAddedToApplications] = useState(false);

	const { addApplication, applications, fetchApplications } =
		useApplicationsStore();


	useEffect(() => {
		fetchApplications();
	}, [fetchApplications]);


	useEffect(() => {
		if (program && applications.length > 0) {
			const isAlreadyAdded = applications.some(
				(app) => app.program.id === program.id,
			);
			setAddedToApplications(isAlreadyAdded);
		}
	}, [program, applications]);

	useEffect(() => {
		if (USE_MOCK_DATA) {
			setProgram(MOCK_PROGRAM_DETAIL);
			setIsSaved(MOCK_PROGRAM_DETAIL.isSaved ?? false);
			return;
		}

		async function fetchProgram() {
			try {
				setIsLoading(true);
				setError(null);
				const data = await exploreApi.getProgramDetail(resolvedParams.id);
				setProgram(data);
				setIsSaved(data.isSaved ?? false);
			} catch (err) {
				console.error("Failed to fetch program detail:", err);
				setError(
					err instanceof Error ? err.message : "Failed to load program details",
				);

				if (process.env.NODE_ENV === "development") {
					setProgram(MOCK_PROGRAM_DETAIL);
					setIsSaved(MOCK_PROGRAM_DETAIL.isSaved ?? false);
				}
			} finally {
				setIsLoading(false);
			}
		}

		fetchProgram();
	}, [resolvedParams.id]);

	const handleSaveToggle = async () => {
		if (!program) return;

		const newSavedState = !isSaved;
		setIsSaved(newSavedState);

		if (!USE_MOCK_DATA) {
			try {
				if (newSavedState) {
					await exploreApi.saveProgram(program.id);
				} else {
					await exploreApi.unsaveProgram(program.id);
				}
			} catch (err) {
				console.error("Failed to update save status:", err);
				setIsSaved(!newSavedState);
			}
		}
	};

	const handleAddToApplications = async () => {
		if (!program || addedToApplications || isAddingToApplications) return;

		setIsAddingToApplications(true);
		try {
			const applicationId = await addApplication({ programId: program.id });
			if (applicationId) {
				setAddedToApplications(true);

				router.push("/dashboard/applications");
			}
		} catch (err) {
			console.error("Failed to add to applications:", err);
		} finally {
			setIsAddingToApplications(false);
		}
	};


	if (isLoading) {
		return (
			<PageTransition>
				<section className="relative bg-background border-b border-border">
					<div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background" />
					<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						{}
						<Link
							href="/explore"
							className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to Explore
						</Link>

						{}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
							<div className="lg:col-span-2">
								<div className="flex items-start gap-4 mb-6">
									<div className="h-20 w-20 rounded-xl bg-muted" />
									<div className="flex-1 space-y-3">
										<div className="h-4 bg-muted rounded w-32" />
										<div className="h-8 bg-muted rounded w-3/4" />
										<div className="h-4 bg-muted rounded w-40" />
									</div>
								</div>
							</div>
							<div className="lg:col-span-1">
								<div className="bg-card border border-border rounded-xl p-4">
									<div className="space-y-3">
										<div className="h-4 bg-muted rounded w-24" />
										<div className="h-10 bg-muted rounded w-16" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{}
				<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="flex items-center justify-center py-24">
						<Loader2 className="w-8 h-8 animate-spin text-primary" />
						<span className="ml-3 text-muted-foreground">
							Loading program details...
						</span>
					</div>
				</section>
			</PageTransition>
		);
	}


	if (error && !program) {
		return (
			<PageTransition>
				<section className="relative bg-background border-b border-border">
					<div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background" />
					<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<Link
							href="/explore"
							className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to Explore
						</Link>
					</div>
				</section>

				<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="flex flex-col items-center justify-center py-24 text-center">
						<div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
							<span className="text-2xl">⚠️</span>
						</div>
						<h2 className="text-xl font-semibold text-foreground mb-2">
							Failed to Load Program
						</h2>
						<p className="text-muted-foreground mb-6">{error}</p>
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
						>
							Try Again
						</button>
					</div>
				</section>
			</PageTransition>
		);
	}


	if (!program) {
		return null;
	}

	return (
		<PageTransition>
			{}
			<section className="relative bg-background border-b border-border">
				{}
				<div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background" />

				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{}
					<SlideUp>
						<Link
							href="/explore"
							className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to Explore
						</Link>
					</SlideUp>

					{}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{}
						<div className="lg:col-span-2">
							<SlideUp delay={0.1}>
								<div className="flex items-start gap-4 mb-6">
									{}
									<div className="h-20 w-20 rounded-xl bg-card border border-border flex items-center justify-center text-3xl font-bold text-muted-foreground shrink-0">
										{program.universityLogoUrl ? (
											<Image
												src={program.universityLogoUrl}
												alt={program.universityName}
												width={80}
												height={80}
												className="rounded-xl object-contain"
											/>
										) : (
											program.universityName.charAt(0)
										)}
									</div>

									{}
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<span className="text-sm font-medium text-muted-foreground">
												{program.universityName}
											</span>
											{program.rankingQsDisplay && (
												<span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
													{program.rankingQsDisplay} QS World
												</span>
											)}
										</div>
										<h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-2">
											{program.programName}
										</h1>
										<div className="flex items-center gap-2 text-muted-foreground">
											<MapPin className="w-4 h-4" />
											<span>
												{program.universityCity}, {program.universityCountry}
											</span>
										</div>
									</div>
								</div>

								{}
								<div className="flex flex-wrap gap-3">
									<button
										type="button"
										onClick={handleSaveToggle}
										className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
											isSaved
												? "bg-primary text-primary-foreground"
												: "bg-card border border-border text-foreground hover:bg-muted"
										}`}
									>
										{isSaved ? (
											<BookmarkCheck className="w-5 h-5" />
										) : (
											<Bookmark className="w-5 h-5" />
										)}
										{isSaved ? "Saved" : "Save to List"}
									</button>

									<button
										type="button"
										onClick={handleAddToApplications}
										disabled={isAddingToApplications || addedToApplications}
										className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
											addedToApplications
												? "bg-green-600 text-white cursor-default"
												: isAddingToApplications
													? "bg-primary/70 text-primary-foreground cursor-wait"
													: "bg-primary text-primary-foreground hover:bg-primary/90"
										}`}
									>
										{isAddingToApplications ? (
											<>
												<Loader2 className="w-4 h-4 animate-spin" />
												Adding...
											</>
										) : addedToApplications ? (
											<>
												<Check className="w-4 h-4" />
												Added to Applications
											</>
										) : (
											<>
												<Plus className="w-4 h-4" />
												Add to My Applications
											</>
										)}
									</button>

									<button
										type="button"
										className="inline-flex items-center gap-2 px-4 py-2.5 bg-card border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
									>
										<Share2 className="w-4 h-4" />
									</button>
								</div>
							</SlideUp>
						</div>

						{}
						<div className="lg:col-span-1">
							<SlideUp delay={0.2}>
								<div className="bg-card border border-border rounded-xl p-4 shadow-sm">
									<div className="flex items-center justify-between mb-2">
										<span className="text-sm font-medium text-muted-foreground">
											Your Fit Score
										</span>
										<span
											className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
												program.fitCategory === "reach"
													? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
													: program.fitCategory === "safety"
														? "bg-green-500/20 text-green-700 dark:text-green-300"
														: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
											}`}
										>
											{program.fitCategory} School
										</span>
									</div>
									<div className="flex items-baseline gap-1">
										<span className="text-4xl font-bold text-foreground">
											{program.fitScore}
										</span>
										<span className="text-muted-foreground">/100</span>
									</div>
								</div>
							</SlideUp>
						</div>
					</div>
				</div>
			</section>

			{}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
				<SlideUp delay={0.3}>
					<QuickFactsBar program={program} />
				</SlideUp>
			</section>

			{}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{}
					<div className="lg:col-span-2 space-y-8">
						<SlideUp delay={0.4}>
							<ProgramTabs program={program} />
						</SlideUp>

						{}
						<SlideUp delay={0.5}>
							<FitScoreExpanded program={program} />
						</SlideUp>
					</div>

					{}
					<div className="lg:col-span-1">
						<div className="sticky top-24">
							<SlideUp delay={0.5}>
								<ApplicationSidebar program={program} />
							</SlideUp>
						</div>
					</div>
				</div>
			</section>
		</PageTransition>
	);
}
````

## File: app/global-error.tsx
````typescript
"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";






export default function GlobalError({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	useEffect(() => {

		Sentry.captureException(error);
	}, [error]);

	return (
		<html lang="en">
			<body
				style={{
					margin: 0,
					padding: 0,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
					fontFamily:
						"Raleway, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
					backgroundColor: "#0a0a0a",
					color: "#fafafa",
					textAlign: "center",
				}}
			>
				<h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
					Something went wrong
				</h2>
				<p
					style={{
						fontSize: "14px",
						color: "#a1a1aa",
						marginBottom: "24px",
						maxWidth: "400px",
						padding: "0 20px",
					}}
				>
					An unexpected error occurred. Please try again or refresh the page.
				</p>
				<button
					type="button"
					onClick={reset}
					style={{
						padding: "12px 24px",
						fontSize: "14px",
						fontWeight: 500,
						backgroundColor: "#6366f1",
						color: "#ffffff",
						border: "none",
						borderRadius: "8px",
						cursor: "pointer",
					}}
				>
					Try again
				</button>
			</body>
		</html>
	);
}
````

## File: lib/hooks/useGraphForces.ts
````typescript
import * as d3Force from "d3-force";
import { useEffect, useRef, useState } from "react";
import type { ForceGraphMethods } from "react-force-graph-2d";
import { usePersonaStore } from "@/lib/store/personaStore";
import type {
	ForceGraphLink,
	ForceGraphNode,
} from "@/lib/types/persona-canvas";
import { transformApiGraphData } from "@/lib/utils/graphTransform";






export function useGraphForces() {
	const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
	const [graphData, setGraphData] = useState<{
		nodes: ForceGraphNode[];
		links: ForceGraphLink[];
	}>({ nodes: [], links: [] });


	const apiGraphNodes = usePersonaStore((state) => state.apiGraphNodes);
	const apiGraphEdges = usePersonaStore((state) => state.apiGraphEdges);


	useEffect(() => {
		if (apiGraphNodes.length > 0) {

			const { nodes, links } = transformApiGraphData(
				apiGraphNodes,
				apiGraphEdges,
			);
			setGraphData({ nodes, links });
		} else {

			setGraphData({ nodes: [], links: [] });
		}
	}, [apiGraphNodes, apiGraphEdges]);



	useEffect(() => {
		if (!fgRef.current) return;


		fgRef.current.d3Force("charge")?.strength(-600);


		const collideForce = d3Force.forceCollide((node) => {
			const graphNode = node as ForceGraphNode;

			const minRadius = 40;
			return Math.max(graphNode.size * 2.5 + 30, minRadius);
		});
		fgRef.current.d3Force("collide", collideForce);


		const radialForce = d3Force
			.forceRadial(
				(node) => {
					const graphNode = node as ForceGraphNode & { layer?: number };

					if (graphNode.layer !== undefined) {

						switch (graphNode.layer) {
							case 0:
								return 0;
							case 1:
								return 150;
							case 2:
								return 280;
							case 3:
								return 420;
							default:
								return 280;
						}
					}

					if (graphNode.type === "archetype") return 0;
					if (graphNode.type === "pattern") return 150;
					if (graphNode.type === "value" || graphNode.type === "skill")
						return 280;
					if (graphNode.type === "story") return 420;
					return 280;
				},
				0,
				0,
			)
			.strength(0.8);
		fgRef.current.d3Force("radial", radialForce);


		fgRef.current.d3Force("link")?.distance(150);


		fgRef.current.d3ReheatSimulation();
	}, [graphData]);

	return { fgRef, graphData };
}
````

## File: lib/api/personaApi.ts
````typescript
import {
	createInitialTracks,
	TRACK_EMOJIS,
	TRACKS,
} from "@/lib/constants/tracks";
import type {
	ArchetypeCandidate,
	ArchetypeHints,
	ArchetypeType,
	BackToTrackResponse,
	CanvasNode,
	ChatMessage,
	ConversationMessage,
	ConversationStartResponse,
	Coverage,
	CoverageResponse,
	GraphEdge,
	GraphMessageResponse,
	GraphNode,
	KeywordResponse,
	MessageResponse,
	NodeExpandResponse,
	NodeType,
	PersonaState,
	RedoTrackResponse,
	ResetConversationResponse,
	StarStructure,
	TrackAction,
	TrackId,
	TrackSelectResponse,
	TrackStatus,
} from "@/lib/types/persona";
import type {
	GraphMeta,
	PersonaEdgeDto,
	PersonaGraphResponse,
	PersonaNodeDto,
} from "@/lib/types/persona-graph";
import { apiClient } from "./client";


const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";


const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


let idCounter = 0;
const generateId = () => {
	idCounter += 1;
	return `${Date.now()}-${idCounter}-${Math.random().toString(36).substring(2, 11)}`;
};






interface MockConversationState {
	currentTrackId: TrackId | null;
	coreQuestionIndex: number;
	followUpIndex: number;
	tracks: Record<TrackId, TrackStatus>;
	nodes: CanvasNode[];
	conversationHistory: ChatMessage[];
}

let mockState: MockConversationState = {
	currentTrackId: null,
	coreQuestionIndex: 0,
	followUpIndex: 0,
	tracks: {
		future_vision: "not_started",
		academic_journey: "not_started",
		activities_impact: "not_started",
		values_turning_points: "not_started",
	},
	nodes: [],
	conversationHistory: [],
};





interface GraphConversationState {
	messages: ConversationMessage[];
	graphNodes: GraphNode[];
	graphEdges: GraphEdge[];
	coverage: Coverage;
	completionReady: boolean;
	totalNodeCount: number;
	starGaps: Map<string, (keyof StarStructure)[]>;
	voiceSamples: string[];
}

let graphMockState: GraphConversationState = {
	messages: [],
	graphNodes: [],
	graphEdges: [],
	coverage: {
		goals: 0,
		evidence: 0,
		skills: 0,
		values: 0,
		tensions: 0,
	},
	completionReady: false,
	totalNodeCount: 0,
	starGaps: new Map(),
	voiceSamples: [],
};


export function resetGraphMockState() {
	graphMockState = {
		messages: [],
		graphNodes: [],
		graphEdges: [],
		coverage: {
			goals: 0,
			evidence: 0,
			skills: 0,
			values: 0,
			tensions: 0,
		},
		completionReady: false,
		totalNodeCount: 0,
		starGaps: new Map(),
		voiceSamples: [],
	};
}


const _COVERAGE_CATEGORIES = [
	"goals",
	"evidence",
	"skills",
	"values",
	"tensions",
] as const;


const COVERAGE_QUESTIONS: Record<keyof Coverage, string[]> = {
	goals: [
		"5-10 năm sau, bạn hình dung bản thân đang làm gì và ở đâu?",
		"Vấn đề nào bạn muốn góp phần giải quyết qua sự nghiệp của mình?",
		"Điều gì thúc đẩy bạn dậy sớm mỗi ngày và bắt đầu làm việc?",
	],
	evidence: [
		"Hãy kể về một dự án hoặc thành tựu bạn tự hào nhất. Bạn đã đóng vai trò gì?",
		"Có thành tích cụ thể nào (số liệu, giải thưởng) bạn muốn chia sẻ?",
		"Bạn đã lãnh đạo hoặc tổ chức điều gì? Kết quả ra sao?",
	],
	skills: [
		"Kỹ năng nào bạn cảm thấy là điểm mạnh nhất của mình?",
		"Bạn đã phát triển khả năng này như thế nào qua thời gian?",
		"Trong tình huống thử thách, bạn thường xử lý như thế nào?",
	],
	values: [
		"3 giá trị quan trọng nhất với bạn là gì? Tại sao?",
		"Điều gì bạn sẽ không bao giờ thỏa hiệp dù trong hoàn cảnh nào?",
		"Ai ảnh hưởng lớn nhất đến quan điểm sống của bạn?",
	],
	tensions: [
		"Có khi nào bạn phải đối mặt với sự mâu thuẫn giữa các giá trị của mình không?",
		"Trải nghiệm nào đã thay đổi hoàn toàn cách nhìn của bạn về một điều gì đó?",
		"Có điều gì về bản thân trước đây mà bạn đã chọn thay đổi?",
	],
};


const STAR_FOLLOWUPS: Record<keyof StarStructure, string> = {
	situation:
		"Bạn có thể mô tả bối cảnh cụ thể hơn không? Khi đó đang xảy ra chuyện gì?",
	task: "Thử thách hoặc nhiệm vụ cụ thể bạn cần giải quyết là gì?",
	action: "Bạn đã làm gì cụ thể? Có thể mô tả các bước bạn thực hiện?",
	result: "Kết quả cuối cùng như thế nào? Có số liệu hoặc thành tích cụ thể?",
	emotion: "Cảm giác của bạn khi trải qua điều đó như thế nào?",
	insight: "Nhìn lại, bạn đã học được điều gì quan trọng từ trải nghiệm này?",
};


export function resetMockState() {
	mockState = {
		currentTrackId: null,
		coreQuestionIndex: 0,
		followUpIndex: 0,
		tracks: {
			future_vision: "not_started",
			academic_journey: "not_started",
			activities_impact: "not_started",
			values_turning_points: "not_started",
		},
		nodes: [],
		conversationHistory: [],
	};
}


const MOCK_QUESTIONS: Record<TrackId, string[]> = {
	future_vision: [
		"5-10 năm sau, một ngày làm việc điển hình của bạn như thế nào? Hãy mô tả chi tiết: bạn làm gì, ở đâu, với ai?",
		"Vấn đề nào bạn muốn góp phần giải quyết qua công việc của mình?",
		"Tại sao bạn chọn học thạc sĩ ở nước ngoài thay vì trong nước hoặc đi làm ngay?",
		"Chương trình hoặc trường nào bạn đang hướng đến? Điều gì thu hút bạn về họ?",
	],
	academic_journey: [
		"Môn học hoặc dự án nào khiến bạn hứng thú nhất trong quá trình học? Tại sao?",
		"Thử thách học thuật lớn nhất bạn đã vượt qua là gì?",
		"Nếu được nghiên cứu bất kỳ chủ đề nào không giới hạn, đó sẽ là gì?",
		"Có giáo sư hoặc mentor nào ảnh hưởng lớn đến định hướng học thuật của bạn?",
	],
	activities_impact: [
		"Hoạt động nào bạn dành nhiều thời gian và tâm huyết nhất ngoài việc học?",
		"Bạn đã khởi xướng hoặc lãnh đạo điều gì? Kết quả ra sao?",
		"Kể về một lần bạn tạo ra thay đổi tích cực cho người khác hoặc cộng đồng.",
		"Kỹ năng hoặc bài học quan trọng nhất bạn học được từ hoạt động ngoại khóa là gì?",
	],
	values_turning_points: [
		"3 giá trị quan trọng nhất với bạn là gì? Tại sao những giá trị đó?",
		"Trải nghiệm nào đã thay đổi cách bạn nhìn nhận cuộc sống hoặc bản thân?",
		"Ai ảnh hưởng lớn nhất đến con người bạn hôm nay? Họ dạy bạn điều gì?",
		"Điều gì khiến bạn khác biệt so với những người có background tương tự?",
	],
};


const MOCK_FOLLOWUPS = {
	detail: [
		"Cụ thể bạn đã làm gì trong tình huống đó? Có thể cho ví dụ cụ thể không?",
		"Bạn có thể mô tả chi tiết hơn không? Chuyện gì đã xảy ra?",
		"Kết quả cụ thể như thế nào? Có số liệu hoặc thành tích nào đáng nhớ?",
	],
	emotion: [
		"Cảm giác của bạn như thế nào khi trải qua điều đó? Có moment nào đặc biệt không?",
		"Điều gì đã thay đổi trong bạn sau trải nghiệm đó?",
		"Nếu nhìn lại, bạn đã học được gì quan trọng từ việc này?",
	],
};





function createTrackActions(): TrackAction[] {
	return (Object.keys(TRACKS) as TrackId[]).map((trackId) => ({
		trackId,
		displayName: TRACKS[trackId].displayName,
		icon: TRACK_EMOJIS[trackId],
		status: mockState.tracks[trackId],
	}));
}

function createWelcomeMessage(): ChatMessage {
	return {
		id: generateId(),
		role: "assistant",
		content:
			"Chào bạn! Tôi là mentor AI của Leaply, sẵn sàng giúp bạn khám phá câu chuyện cá nhân cho hành trình du học.\n\nChúng ta sẽ cùng nhau đi qua 4 chủ đề khám phá. Hãy chọn một chủ đề để bắt đầu:",
		type: "track_selection",
		timestamp: new Date().toISOString(),
		actions: createTrackActions(),
	};
}

function getRandomFollowup(type: "detail" | "emotion"): string {
	const followups = MOCK_FOLLOWUPS[type];
	return followups[Math.floor(Math.random() * followups.length)];
}

function shouldCreateNode(): boolean {

	return Math.random() > 0.4;
}


function calculateTotalQuestionsAnswered(): number {
	let total = 0;
	for (const trackId of Object.keys(mockState.tracks) as TrackId[]) {
		const status = mockState.tracks[trackId];
		if (status === "completed") {
			total += 12;
		} else if (
			status === "in_progress" &&
			trackId === mockState.currentTrackId
		) {
			total += mockState.coreQuestionIndex * 3 + mockState.followUpIndex;
		}
	}
	return total;
}


function generateArchetypeHints(): ArchetypeHints | undefined {
	const totalQ = calculateTotalQuestionsAnswered();

	if (totalQ < 6) {
		return undefined;
	}

	const archetypeTypes: ArchetypeType[] = [
		"innovator",
		"bridge_builder",
		"scholar",
		"advocate",
		"pioneer",
		"craftsman",
		"resilient",
		"catalyst",
	];


	let confidence: ArchetypeHints["confidence"];
	let spreadFactor: number;
	if (totalQ >= 24) {
		confidence = "final";
		spreadFactor = 0.4;
	} else if (totalQ >= 18) {
		confidence = "strong";
		spreadFactor = 0.3;
	} else if (totalQ >= 12) {
		confidence = "emerging";
		spreadFactor = 0.2;
	} else {
		confidence = "early";
		spreadFactor = 0.1;
	}


	const seed = totalQ * 7 + mockState.nodes.length * 3;
	const shuffled = [...archetypeTypes].sort(
		(a, b) => ((a.charCodeAt(0) + seed) % 13) - ((b.charCodeAt(0) + seed) % 13),
	);


	const base = 100 / 3;
	const top3 = shuffled.slice(0, 3);
	const probabilities = [
		Math.round(base + spreadFactor * 50),
		Math.round(base),
		Math.round(base - spreadFactor * 50),
	];


	const evidenceSnippets: Record<ArchetypeType, string> = {
		innovator: "Your creative approach to problem-solving",
		bridge_builder: "Your ability to connect different perspectives",
		scholar: "Your deep intellectual curiosity",
		advocate: "Your passion for making a difference",
		pioneer: "Your willingness to explore new paths",
		craftsman: "Your dedication to mastering your craft",
		resilient: "Your strength in overcoming challenges",
		catalyst: "Your ability to inspire change in others",
	};

	const candidates: ArchetypeCandidate[] = top3.map((type, i) => ({
		type,
		probability: probabilities[i],
		evidence: evidenceSnippets[type],
	}));

	return {
		totalQuestionsAnswered: totalQ,
		confidence,
		candidates,
	};
}


function extractMockKeywords(content: string): string[] {
	const stopWords = new Set([
		"tôi",
		"mình",
		"là",
		"có",
		"được",
		"của",
		"và",
		"với",
		"trong",
		"cho",
		"i",
		"me",
		"my",
		"we",
		"the",
		"a",
		"an",
		"is",
		"are",
		"was",
		"were",
		"to",
		"of",
		"in",
		"for",
		"on",
		"with",
		"at",
		"by",
		"from",
		"as",
	]);

	const words = content
		.toLowerCase()
		.replace(
			/[^\w\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/g,
			" ",
		)
		.split(/\s+/)
		.filter((w) => w.length >= 3 && !stopWords.has(w));


	const freq: Record<string, number> = {};
	for (const w of words) {
		freq[w] = (freq[w] || 0) + 1;
	}


	return Object.entries(freq)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 2)
		.map(([word]) => word);
}

function generateMockNode(
	trackId: TrackId,
	type: NodeType = "story",
): CanvasNode {
	const titles: Record<NodeType, string[]> = {
		story: [
			"Personal transformation moment",
			"Key learning experience",
			"Defining challenge overcome",
			"Meaningful connection made",
		],
		evidence: [
			"Leadership achievement",
			"Academic milestone",
			"Project success",
			"Measurable impact",
		],
		insight: [
			"Self-awareness realization",
			"Values clarification",
			"Growth mindset shift",
			"Purpose discovery",
		],
		archetype: ["Your identity archetype"],
	};

	const typeOptions = titles[type];
	const title = typeOptions[Math.floor(Math.random() * typeOptions.length)];

	return {
		id: generateId(),
		type,
		title,
		content: `This ${type} was extracted from your conversation in the ${TRACKS[trackId].displayName} track. It represents a meaningful aspect of your personal narrative.`,
		sourceTrackId: trackId,
		createdAt: new Date().toISOString(),
	};
}





function getLowestCoverageCategory(): keyof Coverage {
	const entries = Object.entries(graphMockState.coverage) as [
		keyof Coverage,
		number,
	][];
	entries.sort((a, b) => a[1] - b[1]);
	return entries[0][0];
}

function getQuestionForCategory(category: keyof Coverage): string {
	const questions = COVERAGE_QUESTIONS[category];
	const usedCount = Math.floor(graphMockState.coverage[category] / 20);
	const questionIndex = Math.min(usedCount, questions.length - 1);
	return questions[questionIndex];
}

function updateCoverage(category: keyof Coverage, amount: number): void {
	graphMockState.coverage[category] = Math.min(
		100,
		graphMockState.coverage[category] + amount,
	);
}

function checkCompletionReady(): boolean {
	const allAbove60 = Object.values(graphMockState.coverage).every(
		(v) => v >= 60,
	);
	const hasEnoughNodes = graphMockState.totalNodeCount >= 15;
	return allAbove60 || hasEnoughNodes;
}

function generateGraphNode(
	content: string,
	category: keyof Coverage,
): GraphNode {
	const nodeId = generateId();
	const starGaps: (keyof StarStructure)[] = [];


	const starElements: (keyof StarStructure)[] = [
		"situation",
		"task",
		"action",
		"result",
	];
	for (const element of starElements) {
		if (Math.random() > 0.6) {
			starGaps.push(element);
		}
	}


	const structuredContent: StarStructure = {};
	if (!starGaps.includes("situation")) {
		structuredContent.situation = "Extracted from your response...";
	}
	if (!starGaps.includes("task")) {
		structuredContent.task = "The challenge you faced...";
	}
	if (!starGaps.includes("action")) {
		structuredContent.action = "Steps you took...";
	}
	if (!starGaps.includes("result")) {
		structuredContent.result = "The outcome achieved...";
	}

	if (starGaps.length > 0) {
		graphMockState.starGaps.set(nodeId, starGaps);
	}

	const node: GraphNode = {
		id: nodeId,
		type: "key_story",
		layer: 2,
		title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
		content: content.slice(0, 200),
		structuredContent,
		tags: [category, "story"],
		bestFor: ["personal_statement", "why_mba"],
		wordCountPotential: "150-200",
		essayAngle: `This story demonstrates your ${category}`,
	};

	return node;
}

function generateGraphEdge(
	sourceNodeId: string,
	targetNodeId: string,
	isTension: boolean = false,
): GraphEdge {
	const connectionLabels: (
		| "enables"
		| "builds_on"
		| "supports"
		| "complements"
	)[] = ["enables", "builds_on", "supports", "complements"];
	const tensionLabels: (
		| "contradicts"
		| "evolved_from"
		| "challenged_by"
		| "transformed"
	)[] = ["contradicts", "evolved_from", "challenged_by", "transformed"];

	const labels = isTension ? tensionLabels : connectionLabels;
	const label = labels[Math.floor(Math.random() * labels.length)];

	return {
		id: generateId(),
		sourceNodeId,
		targetNodeId,
		edgeType: isTension ? "tension" : "connection",
		label,
		strength: 0.5 + Math.random() * 0.5,
	};
}

function extractVoiceSample(content: string): string | null {

	const sentences = content.split(/[.!?]/).filter((s) => s.trim().length > 20);
	if (sentences.length > 0 && Math.random() > 0.6) {
		const sample =
			sentences[Math.floor(Math.random() * sentences.length)].trim();
		graphMockState.voiceSamples.push(sample);
		return sample;
	}
	return null;
}





function generateMockGraphData(): PersonaGraphResponse {
	const nodes: PersonaNodeDto[] = [];
	const edges: PersonaEdgeDto[] = [];


	const completedTracks = Object.values(mockState.tracks).filter(
		(s) => s === "completed",
	).length;
	const hasProfile = completedTracks >= 2;

	if (hasProfile) {
		const profileNode: PersonaNodeDto = {
			id: "profile-summary-1",
			type: "profile_summary",
			layer: 0,
			title: "Hồ sơ cá nhân",
			description:
				"Bạn là người có tư duy sáng tạo, luôn tìm kiếm cách tiếp cận mới cho những vấn đề phức tạp. Với nền tảng học thuật vững chắc và kinh nghiệm hoạt động ngoại khóa phong phú.",
			tags: ["leadership", "innovation", "impact"],
			primaryArchetype: "innovator",
			secondaryArchetype: "bridge_builder",
			archetypeSummary:
				"The Innovator with Bridge Builder tendencies - creating novel solutions while connecting diverse perspectives.",
			sourceTrackId: null,
			sourceQuestionId: null,
			confidence: 0.85,
			createdAt: new Date().toISOString(),
		};
		nodes.push(profileNode);
	}


	const essayAngles: PersonaNodeDto[] = [
		{
			id: "angle-1",
			type: "essay_angle",
			layer: 1,
			title: "Người tiên phong đổi mới",
			description:
				"Từ những trải nghiệm của bạn, nổi bật lên hình ảnh một người luôn dẫn đầu trong việc tìm kiếm giải pháp sáng tạo.",
			tags: ["innovation", "leadership", "problem-solving"],
			sourceTrackId: "future_vision",
			sourceQuestionId: null,
			confidence: 0.82,
			createdAt: new Date().toISOString(),
		},
		{
			id: "angle-2",
			type: "essay_angle",
			layer: 1,
			title: "Cầu nối văn hóa",
			description:
				"Khả năng kết nối các quan điểm khác nhau và tạo ra sự hiểu biết chung là một điểm mạnh đáng chú ý.",
			tags: ["culture", "communication", "diversity"],
			sourceTrackId: "activities_impact",
			sourceQuestionId: null,
			confidence: 0.78,
			createdAt: new Date().toISOString(),
		},
		{
			id: "angle-3",
			type: "essay_angle",
			layer: 1,
			title: "Học giả tò mò",
			description:
				"Sự đam mê học hỏi và khám phá tri thức mới thể hiện qua mọi câu chuyện bạn chia sẻ.",
			tags: ["curiosity", "learning", "academic"],
			sourceTrackId: "academic_journey",
			sourceQuestionId: null,
			confidence: 0.75,
			createdAt: new Date().toISOString(),
		},
	];


	if (completedTracks >= 1) {
		nodes.push(...essayAngles.slice(0, Math.min(completedTracks + 1, 3)));
	}


	const storyNodes: PersonaNodeDto[] = mockState.nodes
		.filter((n) => n.type === "story")
		.map((n, _idx) => ({
			id: `story-${n.id}`,
			type: "key_story" as const,
			layer: 2 as const,
			title: n.title,
			description: n.content,
			tags: ["experience", "growth"],
			sourceTrackId: n.sourceTrackId,
			sourceQuestionId: null,
			confidence: 0.7 + Math.random() * 0.2,
			createdAt: n.createdAt,
		}));

	nodes.push(...storyNodes);


	const detailNodes: PersonaNodeDto[] = mockState.nodes
		.filter((n) => n.type === "evidence" || n.type === "insight")
		.map((n) => ({
			id: `detail-${n.id}`,
			type: "detail" as const,
			layer: 3 as const,
			title: n.title,
			description: n.content,
			tags:
				n.type === "evidence"
					? ["evidence", "fact"]
					: ["insight", "reflection"],
			sourceTrackId: n.sourceTrackId,
			sourceQuestionId: null,
			confidence: 0.6 + Math.random() * 0.3,
			createdAt: n.createdAt,
		}));

	nodes.push(...detailNodes);



	if (hasProfile) {
		for (const angle of nodes.filter((n) => n.type === "essay_angle")) {
			edges.push({
				id: `edge-profile-${angle.id}`,
				source: "profile-summary-1",
				target: angle.id,
				strength: 0.8 + Math.random() * 0.2,
				createdAt: new Date().toISOString(),
			});
		}
	}


	for (const angle of nodes.filter((n) => n.type === "essay_angle")) {
		const relatedStories = storyNodes.filter(
			(s) => s.sourceTrackId === angle.sourceTrackId,
		);
		for (const story of relatedStories) {
			edges.push({
				id: `edge-${angle.id}-${story.id}`,
				source: angle.id,
				target: story.id,
				strength: 0.6 + Math.random() * 0.3,
				createdAt: new Date().toISOString(),
			});
		}
	}


	for (const story of storyNodes) {
		const relatedDetails = detailNodes.filter(
			(d) => d.sourceTrackId === story.sourceTrackId,
		);

		for (const detail of relatedDetails.slice(0, 2)) {
			edges.push({
				id: `edge-${story.id}-${detail.id}`,
				source: story.id,
				target: detail.id,
				strength: 0.5 + Math.random() * 0.4,
				createdAt: new Date().toISOString(),
			});
		}
	}


	const nodeCountByLayer: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
	for (const node of nodes) {
		nodeCountByLayer[node.layer] = (nodeCountByLayer[node.layer] || 0) + 1;
	}

	const allTags = nodes.flatMap((n) => n.tags);
	const tagCounts: Record<string, number> = {};
	for (const tag of allTags) {
		tagCounts[tag] = (tagCounts[tag] || 0) + 1;
	}
	const topTags = Object.entries(tagCounts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([tag]) => tag);

	const meta: GraphMeta = {
		nodeCountByLayer,
		topTags,
		hasProfileSummary: hasProfile,
		totalNodes: nodes.length,
		totalEdges: edges.length,
	};

	return { nodes, edges, meta };
}





const mockPersonaApi = {

	async getPersonaState(): Promise<PersonaState> {
		await delay(800);


		if (mockState.conversationHistory.length === 0) {
			mockState.conversationHistory.push(createWelcomeMessage());
		}

		const tracks = createInitialTracks();
		for (const trackId of Object.keys(tracks) as TrackId[]) {
			tracks[trackId].status = mockState.tracks[trackId];
		}

		return {
			userId: "demo_user",
			tracks,
			nodes: mockState.nodes,
			archetype: null,
			conversationHistory: mockState.conversationHistory,
			currentTrackId: mockState.currentTrackId,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
	},


	async selectTrack(trackId: TrackId): Promise<TrackSelectResponse> {
		await delay(600);

		mockState.currentTrackId = trackId;
		mockState.tracks[trackId] = "in_progress";
		mockState.coreQuestionIndex = 0;
		mockState.followUpIndex = 0;

		const track = TRACKS[trackId];
		const questions = MOCK_QUESTIONS[trackId] || [];

		if (questions.length === 0) {
			console.error(`personaApi: No questions found for track ${trackId}`);
			throw new Error(
				`Technical error: Missing questions for track ${trackId}`,
			);
		}

		const firstQuestion = questions[0];

		const message: ChatMessage = {
			id: generateId(),
			role: "assistant",
			content: `Tuyệt vời! Hãy bắt đầu khám phá ${track.displayName} của bạn.\n\n${firstQuestion}`,
			type: "text",
			timestamp: new Date().toISOString(),
		};

		mockState.conversationHistory.push(message);

		return {
			message,
			trackStatus: "in_progress",
			currentTrackId: trackId,
		};
	},


	async sendMessage(content: string): Promise<MessageResponse> {
		await delay(1000);

		if (!mockState.currentTrackId) {
			throw new Error("No track selected");
		}


		const userMessage: ChatMessage = {
			id: generateId(),
			role: "user",
			content,
			type: "text",
			timestamp: new Date().toISOString(),
		};
		mockState.conversationHistory.push(userMessage);

		const trackId = mockState.currentTrackId;
		let responseMessage: ChatMessage;
		const canvasActions: CanvasNode[] = [];


		if (mockState.followUpIndex === 0) {

			responseMessage = {
				id: generateId(),
				role: "assistant",
				content: getRandomFollowup("detail"),
				type: "text",
				timestamp: new Date().toISOString(),
			};
			mockState.followUpIndex = 1;
		} else if (mockState.followUpIndex === 1) {

			responseMessage = {
				id: generateId(),
				role: "assistant",
				content: getRandomFollowup("emotion"),
				type: "text",
				timestamp: new Date().toISOString(),
			};
			mockState.followUpIndex = 2;
		} else {

			mockState.followUpIndex = 0;
			mockState.coreQuestionIndex++;


			if (shouldCreateNode()) {
				const nodeTypes: NodeType[] = ["story", "evidence", "insight"];
				const nodeType =
					nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
				const newNode = generateMockNode(trackId, nodeType);
				mockState.nodes.push(newNode);
				canvasActions.push(newNode);
			}


			if (mockState.coreQuestionIndex >= MOCK_QUESTIONS[trackId].length) {

				mockState.tracks[trackId] = "completed";
				mockState.currentTrackId = null;


				const allComplete = (
					Object.values(mockState.tracks) as TrackStatus[]
				).every((s) => s === "completed");

				if (allComplete) {

					responseMessage = {
						id: generateId(),
						role: "assistant",
						content: `Chúc mừng! 🎊 Bạn đã hoàn thành tất cả 4 discovery tracks!\n\nSau khi phân tích toàn bộ câu chuyện của bạn, tôi nhận ra bạn là **The Innovator** - người tạo ra giải pháp mới cho những vấn đề phức tạp.\n\nBạn có thể xem chi tiết archetype và các insights trên canvas bên phải.`,
						type: "track_complete",
						timestamp: new Date().toISOString(),
						canvasActions: [
							{
								action: "reveal_archetype",
								archetype: {
									type: "innovator" as ArchetypeType,
									personalizedSummary:
										"Từ những câu chuyện bạn chia sẻ, tôi thấy rõ khả năng sáng tạo và tư duy giải quyết vấn đề của bạn. Bạn không chỉ nhìn thấy thách thức mà còn tìm ra cách tiếp cận mới.",
								},
							},
						],
					};

					mockState.conversationHistory.push(responseMessage);

					return {
						message: responseMessage,
						trackStatus: "completed",
						currentTrackId: null,
						allTracksComplete: true,
					};
				}


				responseMessage = {
					id: generateId(),
					role: "assistant",
					content: `Tuyệt vời! 🎉 Bạn đã hoàn thành ${TRACKS[trackId].displayName}!\n\nTôi đã thu thập được nhiều insight quý giá. Bạn muốn khám phá track nào tiếp theo?`,
					type: "track_complete",
					timestamp: new Date().toISOString(),
					actions: createTrackActions().filter((a) => a.status !== "completed"),
					canvasActions:
						canvasActions.length > 0
							? canvasActions.map((n) => ({ action: "add" as const, node: n }))
							: undefined,
				};

				mockState.conversationHistory.push(responseMessage);

				return {
					message: responseMessage,
					trackStatus: "completed",
					currentTrackId: null,
				};
			}


			const questions = MOCK_QUESTIONS[trackId] || [];
			const nextQuestion = questions[mockState.coreQuestionIndex];

			if (!nextQuestion) {
				console.error(
					`personaApi: Question at index ${mockState.coreQuestionIndex} missing for track ${trackId}`,
				);
				throw new Error(
					"I've run out of questions for this track. Let's try another one!",
				);
			}

			const acknowledgment =
				content.length > 50
					? "Cảm ơn bạn đã chia sẻ chi tiết! "
					: "Cảm ơn bạn! ";

			responseMessage = {
				id: generateId(),
				role: "assistant",
				content: `${acknowledgment}\n\nCâu tiếp theo: ${nextQuestion}`,
				type: "text",
				timestamp: new Date().toISOString(),
				canvasActions:
					canvasActions.length > 0
						? canvasActions.map((n) => ({ action: "add" as const, node: n }))
						: undefined,
			};
		}

		mockState.conversationHistory.push(responseMessage);

		return {
			message: responseMessage,
			conversationState: {
				coreQuestionIndex: mockState.coreQuestionIndex,
				followUpIndex: mockState.followUpIndex,
				totalCoreQuestions: 4,
			},
			trackStatus: mockState.tracks[trackId],
			currentTrackId: trackId,
			archetypeHints: generateArchetypeHints(),
		};
	},


	async extractKeywords(
		content: string,
		trackId: string,
	): Promise<KeywordResponse> {
		await delay(300);

		const keywords = extractMockKeywords(content);

		return {
			keywords,
			trackId,
		};
	},


	async goBackToTrackSelection(): Promise<BackToTrackResponse> {
		await delay(400);

		mockState.currentTrackId = null;

		const message: ChatMessage = {
			id: generateId(),
			role: "assistant",
			content:
				"Không sao! Bạn có thể quay lại track này bất cứ lúc nào.\n\nBạn muốn khám phá track nào?",
			type: "track_selection",
			timestamp: new Date().toISOString(),
			actions: createTrackActions(),
		};

		mockState.conversationHistory.push(message);

		return {
			message,
			currentTrackId: null,
		};
	},


	async redoTrack(trackId: TrackId): Promise<RedoTrackResponse> {
		await delay(600);


		const removedNodeIds = mockState.nodes
			.filter((n) => n.sourceTrackId === trackId)
			.map((n) => n.id);

		mockState.nodes = mockState.nodes.filter(
			(n) => n.sourceTrackId !== trackId,
		);


		mockState.tracks[trackId] = "in_progress";
		mockState.currentTrackId = trackId;
		mockState.coreQuestionIndex = 0;
		mockState.followUpIndex = 0;

		const firstQuestion = MOCK_QUESTIONS[trackId][0];

		const message: ChatMessage = {
			id: generateId(),
			role: "assistant",
			content: `Đã reset ${TRACKS[trackId].displayName}. Hãy bắt đầu lại nhé!\n\n${firstQuestion}`,
			type: "text",
			timestamp: new Date().toISOString(),
			canvasActions: removedNodeIds.map((id) => ({
				action: "remove" as const,
				nodeId: id,
			})),
		};

		mockState.conversationHistory.push(message);

		return {
			message,
			trackStatus: "in_progress",
			currentTrackId: trackId,
			removedNodeIds,
		};
	},


	async getPersonaGraph(): Promise<PersonaGraphResponse> {
		await delay(600);
		return generateMockGraphData();
	},






	async getConversation(): Promise<ConversationStartResponse> {
		await delay(600);


		if (graphMockState.messages.length === 0) {
			const category = getLowestCoverageCategory();
			const question = getQuestionForCategory(category);

			const message: ConversationMessage = {
				id: generateId(),
				role: "assistant",
				content: `Chào bạn! Tôi là mentor AI của Leaply, sẵn sàng giúp bạn khám phá câu chuyện cá nhân cho hành trình du học.\n\nHãy bắt đầu với câu hỏi đầu tiên:\n\n${question}`,
				type: "question",
				timestamp: new Date().toISOString(),
			};

			graphMockState.messages.push(message);
		}

		return {
			message: graphMockState.messages[graphMockState.messages.length - 1],
			coverage: { ...graphMockState.coverage },
			totalNodeCount: graphMockState.totalNodeCount,
		};
	},


	async sendConversationMessage(
		content: string,
	): Promise<GraphMessageResponse> {
		await delay(1000);


		const userMessage: ConversationMessage = {
			id: generateId(),
			role: "user",
			content,
			type: "text",
			timestamp: new Date().toISOString(),
		};
		graphMockState.messages.push(userMessage);


		const category = getLowestCoverageCategory();


		const coverageIncrease = 10 + Math.floor(Math.random() * 15);
		updateCoverage(category, coverageIncrease);


		const nodesCreated: GraphNode[] = [];
		const edgesCreated: GraphEdge[] = [];
		let starGapsForLastStory: (keyof StarStructure)[] | null = null;

		if (Math.random() > 0.4) {
			const newNode = generateGraphNode(content, category);
			nodesCreated.push(newNode);
			graphMockState.graphNodes.push(newNode);
			graphMockState.totalNodeCount++;


			const gaps = graphMockState.starGaps.get(newNode.id);
			if (gaps && gaps.length > 0) {
				starGapsForLastStory = gaps;
			}


			const existingNodes = graphMockState.graphNodes.filter(
				(n) => n.id !== newNode.id,
			);
			let edgeCount = 0;
			for (const existingNode of existingNodes) {
				if (edgeCount >= 2) break;
				if (Math.random() > 0.6) {
					const isTension = Math.random() > 0.8;
					const edge = generateGraphEdge(
						existingNode.id,
						newNode.id,
						isTension,
					);
					edgesCreated.push(edge);
					graphMockState.graphEdges.push(edge);
					edgeCount++;
				}
			}
		}


		const voiceSample = extractVoiceSample(content);


		graphMockState.completionReady = checkCompletionReady();


		let responseContent: string;
		let messageType: "text" | "question" | "completion" = "question";

		if (graphMockState.completionReady) {
			responseContent =
				"Tuyệt vời! 🎉 Bạn đã hoàn thành quá trình khám phá cá nhân!\n\nTôi đã thu thập được đủ thông tin để giúp bạn viết essay. Hãy xem lại các nodes trên canvas để chuẩn bị cho bước tiếp theo.";
			messageType = "completion";
		} else if (starGapsForLastStory && starGapsForLastStory.length > 0) {

			const gap = starGapsForLastStory[0];
			responseContent = `Cảm ơn bạn đã chia sẻ! ${STAR_FOLLOWUPS[gap]}`;
		} else {

			const nextCategory = getLowestCoverageCategory();
			const nextQuestion = getQuestionForCategory(nextCategory);
			responseContent = `Cảm ơn bạn! Đây là một câu chuyện rất thú vị.\n\nCâu tiếp theo: ${nextQuestion}`;
		}

		const assistantMessage: ConversationMessage = {
			id: generateId(),
			role: "assistant",
			content: responseContent,
			type: messageType,
			timestamp: new Date().toISOString(),
		};
		graphMockState.messages.push(assistantMessage);

		return {
			message: assistantMessage,
			nodesCreated,
			edgesCreated,
			coverage: { ...graphMockState.coverage },
			voiceSample,
			completionReady: graphMockState.completionReady,
			starGapsForLastStory,
			totalNodeCount: graphMockState.totalNodeCount,
		};
	},


	async resetConversation(): Promise<ResetConversationResponse> {
		await delay(500);

		resetGraphMockState();

		const message: ConversationMessage = {
			id: generateId(),
			role: "assistant",
			content:
				"Đã reset cuộc trò chuyện. Hãy bắt đầu lại từ đầu!\n\n5-10 năm sau, bạn hình dung bản thân đang làm gì và ở đâu?",
			type: "question",
			timestamp: new Date().toISOString(),
		};
		graphMockState.messages.push(message);

		return {
			success: true,
			message,
		};
	},


	async expandNode(nodeId: string): Promise<NodeExpandResponse> {
		await delay(800);

		const gaps = graphMockState.starGaps.get(nodeId);
		let responseContent: string;

		if (gaps && gaps.length > 0) {
			const gap = gaps[0];
			responseContent = STAR_FOLLOWUPS[gap];


			const remainingGaps = gaps.slice(1);
			if (remainingGaps.length > 0) {
				graphMockState.starGaps.set(nodeId, remainingGaps);
			} else {
				graphMockState.starGaps.delete(nodeId);
			}
		} else {
			responseContent =
				"Bạn có thể chia sẻ thêm chi tiết về trải nghiệm này không?";
		}

		const message: ConversationMessage = {
			id: generateId(),
			role: "assistant",
			content: responseContent,
			type: "question",
			timestamp: new Date().toISOString(),
		};
		graphMockState.messages.push(message);

		return {
			message,
			nodesCreated: [],
			edgesCreated: [],
			coverage: { ...graphMockState.coverage },
			voiceSample: null,
			completionReady: graphMockState.completionReady,
			starGapsForLastStory: gaps ? gaps.slice(1) : null,
			totalNodeCount: graphMockState.totalNodeCount,
		};
	},


	async getCoverage(): Promise<CoverageResponse> {
		await delay(300);

		return {
			coverage: { ...graphMockState.coverage },
			completionReady: graphMockState.completionReady,
			totalNodeCount: graphMockState.totalNodeCount,
		};
	},
};






const realPersonaApi = {
	async getPersonaState(): Promise<PersonaState> {
		return apiClient.get<PersonaState>("/v1/persona");
	},

	async selectTrack(trackId: TrackId): Promise<TrackSelectResponse> {
		return apiClient.post<TrackSelectResponse>("/v1/persona/track/select", {
			trackId,
		});
	},

	async sendMessage(content: string): Promise<MessageResponse> {
		return apiClient.post<MessageResponse>("/v1/persona/message", {
			content,
		});
	},

	async goBackToTrackSelection(): Promise<BackToTrackResponse> {
		return apiClient.post<BackToTrackResponse>("/v1/persona/track/back", {});
	},

	async redoTrack(trackId: TrackId): Promise<RedoTrackResponse> {
		return apiClient.post<RedoTrackResponse>(
			`/v1/persona/track/${trackId}/redo`,
			{},
		);
	},

	async extractKeywords(
		content: string,
		trackId: string,
	): Promise<KeywordResponse> {
		return apiClient.post<KeywordResponse>("/v1/persona/extract-keywords", {
			content,
			trackId,
		});
	},

	async getPersonaGraph(): Promise<PersonaGraphResponse> {
		return apiClient.get<PersonaGraphResponse>("/v1/persona/graph");
	},





	async getConversation(): Promise<ConversationStartResponse> {
		return apiClient.get<ConversationStartResponse>("/v1/persona/conversation");
	},

	async sendConversationMessage(
		content: string,
	): Promise<GraphMessageResponse> {
		return apiClient.post<GraphMessageResponse>(
			"/v1/persona/conversation/message",
			{
				content,
			},
		);
	},

	async resetConversation(): Promise<ResetConversationResponse> {
		return apiClient.post<ResetConversationResponse>(
			"/v1/persona/conversation/reset",
			{},
		);
	},

	async expandNode(nodeId: string): Promise<NodeExpandResponse> {
		return apiClient.post<NodeExpandResponse>(
			`/v1/persona/node/${nodeId}/expand`,
			{},
		);
	},

	async getCoverage(): Promise<CoverageResponse> {
		return apiClient.get<CoverageResponse>("/v1/persona/coverage");
	},
};





export const personaApi = USE_MOCK ? mockPersonaApi : realPersonaApi;


export type {
	PersonaState,
	TrackSelectResponse,
	MessageResponse,
	BackToTrackResponse,
	RedoTrackResponse,
	PersonaGraphResponse,

	ConversationStartResponse,
	GraphMessageResponse,
	ResetConversationResponse,
	NodeExpandResponse,
	CoverageResponse,
	Coverage,
	GraphNode,
	GraphEdge,
	ConversationMessage,
};
````

## File: next.config.ts
````typescript
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "logo.clearbit.com",
				port: "",
				pathname: "
````

## File: components/persona-lab/canvas/ConcentricGraphCanvas.tsx
````typescript
"use client";

import {
	ChevronRight,
	Eye,
	EyeOff,
	Info,
	Maximize2,
	MessageCircle,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import { useTranslations } from "next-intl";
import ForceGraph2D from "react-force-graph-2d";
import { Button } from "@/components/ui/button";
import { getNodeConfig } from "@/lib/config/graphConfig";
import { useContainerDimensions } from "@/lib/hooks/useContainerDimensions";
import { useGraphControls } from "@/lib/hooks/useGraphControls";
import { useGraphForces } from "@/lib/hooks/useGraphForces";
import { useGraphInteraction } from "@/lib/hooks/useGraphInteraction";
import { useGraphRenderers } from "@/lib/hooks/useGraphRenderers";
import { useExpandNode } from "@/lib/hooks/usePersonaConversation";
import { usePersonaStore } from "@/lib/store/personaStore";
import type { GraphNode, StarStructure } from "@/lib/types/persona";
import type { ForceGraphNode, NodeType } from "@/lib/types/persona-canvas";
import { cn } from "@/lib/utils";


const STAR_LABELS: Record<keyof StarStructure, string> = {
	situation: "Situation",
	task: "Task",
	action: "Action",
	result: "Result",
	emotion: "Emotion",
	insight: "Insight",
};

interface ConcentricGraphCanvasProps {
	className?: string;
}





export function ConcentricGraphCanvas({
	className,
}: ConcentricGraphCanvasProps) {
	const t = useTranslations("personaLab");


	const { fgRef, graphData } = useGraphForces();
	const { dimensions, containerRef } = useContainerDimensions();


	const expandNodeMutation = useExpandNode();


	const getStarGapsForNode = usePersonaStore(
		(state) => state.getStarGapsForNode,
	);

	const {
		selectedNode,
		hoveredNode,
		hiddenNodeTypes,
		highlightNodes,
		highlightLinks,
		handleNodeClick,
		handleNodeHover,
		handleBackgroundClick,
		toggleNodeTypeVisibility,
	} = useGraphInteraction({ graphData, fgRef, dimensions });

	const {
		showLabels,
		handleZoomIn,
		handleZoomOut,
		handleFitView,
		toggleLabels,
	} = useGraphControls(fgRef);

	const { paintNode, paintLink, paintNodePointerArea, nodeTooltip } =
		useGraphRenderers({
			selectedNode,
			hoveredNode,
			showLabels,
			highlightNodes,
			highlightLinks,
			hiddenNodeTypes,
		});


	const handleExpandNode = (nodeId: string) => {
		expandNodeMutation.mutate(nodeId);
	};


	const selectedGraphNode: GraphNode | undefined = selectedNode?.data
		? (() => {
				const data = selectedNode.data as GraphNode;

				if (
					data &&
					typeof data.id === "string" &&
					typeof data.content === "string"
				) {
					return data;
				}
				console.warn("[ConcentricGraphCanvas] Invalid node data:", data);
				return undefined;
			})()
		: undefined;


	const selectedNodeStarGaps =
		selectedNode && selectedNode.type === "key_story"
			? getStarGapsForNode(selectedNode.id)
			: [];


	const isEmpty = graphData.nodes.length === 0;


	const hasProfileCenter = graphData.nodes.some(
		(node) => node.type === "profile_summary",
	);

	return (
		<div ref={containerRef} className={cn("relative h-full w-full", className)}>
			{}
			{isEmpty && (
				<div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
					<div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
						<MessageCircle className="w-8 h-8 text-muted-foreground" />
					</div>
					<h3 className="text-lg font-semibold mb-2">
						{t("emptyCanvasTitle")}
					</h3>
					<p className="text-sm text-muted-foreground max-w-xs">
						{t("emptyCanvasDesc")}
					</p>
				</div>
			)}

			{}
			{!isEmpty && !hasProfileCenter && (
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center pointer-events-none z-10">
					<div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-dashed border-amber-500/30 flex items-center justify-center">
						<MessageCircle className="w-8 h-8 text-amber-500/50" />
					</div>
					<p className="text-sm text-muted-foreground mt-3 max-w-[180px]">
						{t("centerPlaceholder")}
					</p>
				</div>
			)}

			{}
			<ForceGraph2D
				ref={fgRef}
				graphData={graphData}
				width={dimensions.width}
				height={dimensions.height}
				nodeRelSize={1}
				nodeVal={(node) => (node as unknown as ForceGraphNode).size}
				nodeCanvasObject={paintNode}
				nodePointerAreaPaint={paintNodePointerArea}
				linkCanvasObject={paintLink}
				onNodeClick={handleNodeClick}
				onNodeHover={handleNodeHover}
				onBackgroundClick={handleBackgroundClick}
				nodeLabel={nodeTooltip}
				enableNodeDrag={true}
				enableZoomInteraction={true}
				enablePanInteraction={true}
				cooldownTicks={100}
				onEngineStop={() => fgRef.current?.zoomToFit(400, 50)}
				d3AlphaDecay={0.02}
				d3VelocityDecay={0.3}
				warmupTicks={100}
			/>

			{}
			{!isEmpty && (
				<div className="absolute top-4 right-4 flex flex-col gap-2">
					<Button
						variant="secondary"
						size="icon"
						onClick={handleZoomIn}
						className="shadow-lg"
						title="Zoom In"
					>
						<ZoomIn className="h-4 w-4" />
					</Button>
					<Button
						variant="secondary"
						size="icon"
						onClick={handleZoomOut}
						className="shadow-lg"
						title="Zoom Out"
					>
						<ZoomOut className="h-4 w-4" />
					</Button>
					<Button
						variant="secondary"
						size="icon"
						onClick={handleFitView}
						className="shadow-lg"
						title="Fit View"
					>
						<Maximize2 className="h-4 w-4" />
					</Button>
					<Button
						variant="secondary"
						size="icon"
						onClick={toggleLabels}
						className="shadow-lg"
						title={showLabels ? "Hide Labels" : "Show Labels"}
					>
						{showLabels ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</Button>
				</div>
			)}

			{}
			{!isEmpty && (
				<div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
					<h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
						<Info className="h-4 w-4" />
						Graph Layers
					</h3>
					<div className="space-y-2 text-xs">
						{}
						{(
							[
								"profile_summary",
								"essay_angle",
								"key_story",
								"detail",
							] as NodeType[]
						).map((type) => {
							const config = getNodeConfig(type);
							const isHidden = hiddenNodeTypes.has(type);
							return (
								<button
									key={type}
									type="button"
									className="flex items-center gap-2 w-full hover:bg-muted/50 rounded px-2 py-1 transition-colors"
									onClick={() => toggleNodeTypeVisibility(type)}
									title={
										isHidden ? `Show ${config.label}` : `Hide ${config.label}`
									}
								>
									<div
										className="w-3 h-3 rounded-full shrink-0"
										style={{
											backgroundColor: config.color,
											opacity: isHidden ? 0.3 : 1,
										}}
									/>
									<span
										className="text-muted-foreground flex-1 text-left"
										style={{ opacity: isHidden ? 0.5 : 1 }}
									>
										{config.label}
										{config.layer === 0 && " (Center)"}
									</span>
									{isHidden ? (
										<EyeOff className="h-3 w-3 text-muted-foreground shrink-0" />
									) : (
										<Eye className="h-3 w-3 text-muted-foreground shrink-0" />
									)}
								</button>
							);
						})}
					</div>

					<div className="mt-4 pt-3 border-t border-border">
						<div className="text-xs text-muted-foreground space-y-1">
							<div className="flex items-center gap-2">
								<div className="w-8 h-0.5 bg-blue-500/40" />
								<span>Connection</span>
							</div>
							<div className="flex items-center gap-2">
								<div
									className="w-8 h-0.5 animate-pulse"
									style={{
										background:
											"linear-gradient(90deg, #f97316 0%, rgba(249, 115, 22, 0.3) 50%, #f97316 100%)",
									}}
								/>
								<span>Tension</span>
							</div>
						</div>
					</div>
				</div>
			)}

			{}
			{selectedNode && (
				<div
					className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm border-2 rounded-lg p-5 shadow-2xl max-w-md min-w-[320px]"
					style={{
						borderColor: getNodeConfig(selectedNode.type).color,
					}}
				>
					<div className="flex items-start justify-between mb-4">
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-2">
								<div
									className="rounded-full"
									style={{
										backgroundColor: getNodeConfig(selectedNode.type).color,
										width: "16px",
										height: "16px",
										boxShadow: `0 0 0 2px rgba(255,255,255,0.1), 0 0 0 4px ${getNodeConfig(selectedNode.type).color}40`,
									}}
								/>
								<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
									{selectedNode.type === "story"
										? (
												(selectedNode.data as { story_type?: string })
													?.story_type ?? "Story"
											).replace("_", " ")
										: getNodeConfig(selectedNode.type).label}
								</span>
							</div>
							<h3 className="font-bold text-base">{selectedNode.label}</h3>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleBackgroundClick}
							className="h-7 w-7 p-0 hover:bg-destructive/10"
						>
							×
						</Button>
					</div>

					{}
					<div className="space-y-3">
						{

}

						{}
						{selectedNode.type === "profile_summary" && selectedGraphNode && (
							<>
								<div className="p-3 bg-muted/50 rounded-md">
									<p className="text-xs leading-relaxed">
										{selectedGraphNode.content}
									</p>
								</div>
								{selectedGraphNode.tags.length > 0 && (
									<div className="flex flex-wrap gap-1">
										{selectedGraphNode.tags.map((tag) => (
											<span
												key={tag}
												className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary"
											>
												{tag}
											</span>
										))}
									</div>
								)}
							</>
						)}

						{}
						{selectedNode.type === "essay_angle" && selectedGraphNode && (
							<>
								<div className="p-3 bg-muted/50 rounded-md">
									<p className="text-xs leading-relaxed">
										{selectedGraphNode.content}
									</p>
								</div>
								{selectedGraphNode.essayAngle && (
									<div className="p-3 bg-violet-500/10 rounded-md">
										<span className="text-xs font-semibold text-violet-600 block mb-1">
											Essay Angle
										</span>
										<p className="text-xs text-muted-foreground">
											{selectedGraphNode.essayAngle}
										</p>
									</div>
								)}
								{selectedGraphNode.bestFor &&
									selectedGraphNode.bestFor.length > 0 && (
										<div>
											<span className="text-xs font-medium text-foreground block mb-1">
												Best for:
											</span>
											<div className="flex flex-wrap gap-1">
												{selectedGraphNode.bestFor.map((type) => (
													<span
														key={type}
														className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary"
													>
														{type.replace(/_/g, " ")}
													</span>
												))}
											</div>
										</div>
									)}
							</>
						)}

						{}
						{selectedNode.type === "key_story" && selectedGraphNode && (
							<>
								<div className="p-3 bg-muted/50 rounded-md">
									<p className="text-xs leading-relaxed">
										{selectedGraphNode.content}
									</p>
								</div>

								{}
								{selectedGraphNode.structuredContent && (
									<div className="p-3 bg-emerald-500/5 rounded-md border border-emerald-500/20">
										<span className="text-xs font-semibold text-emerald-600 block mb-2">
											STAR Structure
										</span>
										<div className="space-y-2">
											{(
												Object.keys(STAR_LABELS) as (keyof StarStructure)[]
											).map((key) => {
												const value =
													selectedGraphNode.structuredContent?.[key];
												const hasGap = selectedNodeStarGaps.includes(key);
												return (
													<div
														key={key}
														className={cn("text-xs", hasGap && "opacity-50")}
													>
														<span
															className={cn(
																"font-medium",
																hasGap ? "text-orange-500" : "text-foreground",
															)}
														>
															{STAR_LABELS[key]}:
														</span>{" "}
														<span className="text-muted-foreground">
															{value || (
																<span className="italic text-orange-500">
																	Missing - expand for details
																</span>
															)}
														</span>
													</div>
												);
											})}
										</div>
									</div>
								)}

								{}
								{selectedNodeStarGaps.length > 0 && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleExpandNode(selectedNode.id)}
										disabled={expandNodeMutation.isPending}
										className="w-full text-xs border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/10"
									>
										{expandNodeMutation.isPending ? (
											"Generating question..."
										) : (
											<>
												<ChevronRight className="w-3 h-3 mr-1" />
												Expand: Tell me more about{" "}
												{selectedNodeStarGaps
													.slice(0, 2)
													.map((g) => STAR_LABELS[g].toLowerCase())
													.join(", ")}
											</>
										)}
									</Button>
								)}

								{}
								{selectedGraphNode.tags.length > 0 && (
									<div className="flex flex-wrap gap-1">
										{selectedGraphNode.tags.map((tag) => (
											<span
												key={tag}
												className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary"
											>
												{tag}
											</span>
										))}
									</div>
								)}
							</>
						)}

						{}
						{selectedNode.type === "detail" && selectedGraphNode && (
							<>
								<div className="p-3 bg-muted/50 rounded-md">
									<p className="text-xs leading-relaxed">
										{selectedGraphNode.content}
									</p>
								</div>
								{selectedGraphNode.wordCountPotential && (
									<div className="text-xs">
										<span className="font-medium text-foreground">
											Word count potential:
										</span>{" "}
										<span className="text-muted-foreground">
											{selectedGraphNode.wordCountPotential}
										</span>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			)}

			{}
			{!isEmpty && (
				<div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
					<div className="text-xs text-muted-foreground">
						<span className="font-medium">{graphData.nodes.length}</span> nodes
						· <span className="font-medium">{graphData.links.length}</span>{" "}
						connections
					</div>
				</div>
			)}
		</div>
	);
}
````

## File: components/persona-lab/ChatSidebar/index.tsx
````typescript
"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	useConversation,
	useCoverage,
	useResetConversation,
	useSendMessage,
} from "@/lib/hooks/usePersonaConversation";
import { usePersonaStore } from "@/lib/store/personaStore";
import type {
	ConversationMessage,
	Coverage,
	GraphMessageResponse,
	ResetConversationResponse,
} from "@/lib/types/persona";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage, TypingIndicator } from "./ChatMessage";
import { MessageInput } from "./MessageInput";


const DEFAULT_COVERAGE: Coverage = {
	goals: 0,
	evidence: 0,
	skills: 0,
	values: 0,
	tensions: 0,
};

export function ChatSidebar() {
	const t = useTranslations("personaLab");
	const router = useRouter();
	const scrollRef = useRef<HTMLDivElement>(null);
	const [showResetDialog, setShowResetDialog] = useState(false);


	const messages = usePersonaStore((state) => state.graphMessages);
	const addGraphMessage = usePersonaStore((state) => state.addGraphMessage);
	const clearGraphMessages = usePersonaStore(
		(state) => state.clearGraphMessages,
	);


	const processGraphUpdate = usePersonaStore(
		(state) => state.processGraphUpdate,
	);
	const clearApiGraph = usePersonaStore((state) => state.clearApiGraph);


	const {
		data: conversationData,
		isLoading: isLoadingConversation,
		error: conversationError,
	} = useConversation();

	const { data: coverageData } = useCoverage();

	const sendMessageMutation = useSendMessage();
	const resetMutation = useResetConversation();


	useEffect(() => {
		if (conversationData?.message && messages.length === 0) {
			addGraphMessage(conversationData.message);
		}
	}, [conversationData, messages.length, addGraphMessage]);


	const messageCount = messages.length;

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messageCount, sendMessageMutation.isPending]);

	const handleSendMessage = useCallback(
		(content: string) => {

			const userMessage: ConversationMessage = {
				id: `user-${Date.now()}`,
				role: "user",
				type: "text",
				content,
				timestamp: new Date().toISOString(),
			};
			addGraphMessage(userMessage);


			sendMessageMutation.mutate(content, {
				onSuccess: (data: GraphMessageResponse) => {

					addGraphMessage(data.message);


					processGraphUpdate(data);


					if (data.completionReady) {
						const completionMessage: ConversationMessage = {
							id: `completion-${Date.now()}`,
							role: "assistant",
							type: "completion",
							content: t("conversationComplete"),
							timestamp: new Date().toISOString(),
						};
						addGraphMessage(completionMessage);
					}
				},
			});
		},
		[sendMessageMutation, t, processGraphUpdate, addGraphMessage],
	);

	const handleReset = useCallback(() => {
		setShowResetDialog(false);
		resetMutation.mutate(undefined, {
			onSuccess: (data: ResetConversationResponse) => {

				clearGraphMessages();
				addGraphMessage(data.message);

				clearApiGraph();
			},
		});
	}, [resetMutation, clearApiGraph, clearGraphMessages, addGraphMessage]);


	const coverage = coverageData?.coverage || DEFAULT_COVERAGE;
	const totalNodeCount = coverageData?.totalNodeCount || 0;
	const completionReady = coverageData?.completionReady || false;
	const isSending = sendMessageMutation.isPending || resetMutation.isPending;
	const error =
		conversationError?.message || sendMessageMutation.error?.message;


	if (isLoadingConversation && messages.length === 0) {
		return (
			<div className="flex flex-col h-full">
				<ChatHeader
					coverage={DEFAULT_COVERAGE}
					totalNodeCount={0}
					completionReady={false}
				/>
				<div className="flex-1 min-h-0 p-4 space-y-4">
					<div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
					<div className="h-12 bg-muted/30 rounded-lg animate-pulse ml-8" />
					<div className="h-12 bg-muted/30 rounded-lg animate-pulse ml-8" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full min-h-0 overflow-hidden">
			{}
			<ChatHeader
				coverage={coverage}
				totalNodeCount={totalNodeCount}
				completionReady={completionReady}
			/>

			{}
			<div className="px-3 py-2 border-b border-border flex justify-end">
				<Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
					<DialogTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="text-xs text-muted-foreground hover:text-foreground"
							disabled={isSending}
						>
							<RotateCcw className="w-3 h-3 mr-1" />
							{t("resetData")}
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{t("resetConfirmTitle")}</DialogTitle>
							<DialogDescription>
								{t("resetConfirmDescription")}
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setShowResetDialog(false)}
							>
								{t("cancel")}
							</Button>
							<Button variant="destructive" onClick={handleReset}>
								{t("confirmReset")}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{}
			<ScrollArea className="flex-1 p-3" type="always">
				<div className="space-y-3">
					{messages.map((message, index) => (
						<ChatMessage key={`${message.id}-${index}`} message={message} />
					))}

					{}
					{isSending && <TypingIndicator />}

					{}
					{error && (
						<div className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
							{error}
						</div>
					)}

					<div ref={scrollRef} />
				</div>
			</ScrollArea>

			{}
			<div className="flex-shrink-0">
				{completionReady ? (
					<div className="p-3 border-t border-border">
						<Button
							className="w-full"
							onClick={() => router.push("/applications")}
						>
							{t("goToApplications")}
							<ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					</div>
				) : (
					<MessageInput
						onSend={handleSendMessage}
						disabled={isSending}
						placeholder={t("shareYourStory")}
					/>
				)}
			</div>
		</div>
	);
}






import type { TrackId } from "@/lib/types/persona";
import { BackToTracksButton } from "./BackToTracksButton";
import { LegacyChatMessage } from "./ChatMessage";


export function LegacyChatSidebar() {
	const t = useTranslations("personaLab");
	const {
		conversationHistory,
		currentTrackId,
		isLoading,
		isSending,
		error,
		fetchPersonaState,
		selectTrack,
		sendMessage,
		goBackToTrackSelection,
		extractKeywords,
	} = usePersonaStore();

	const scrollRef = useRef<HTMLDivElement>(null);


	useEffect(() => {
		fetchPersonaState();
	}, [fetchPersonaState]);


	const messageCount = conversationHistory.length;

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messageCount]);

	const handleTrackSelect = (trackId: TrackId) => {
		selectTrack(trackId);
	};

	const handleSendMessage = (content: string) => {
		sendMessage(content);

		if (currentTrackId) {
			extractKeywords(content, currentTrackId);
		}
	};

	const handleBackToTracks = () => {
		goBackToTrackSelection();
	};


	const legacyCoverage: Coverage = {
		goals: 0,
		evidence: 0,
		skills: 0,
		values: 0,
		tensions: 0,
	};


	if (isLoading && conversationHistory.length === 0) {
		return (
			<div className="flex flex-col h-full">
				<ChatHeader coverage={legacyCoverage} />
				<div className="flex-1 min-h-0 p-4 space-y-4">
					<div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
					<div className="h-12 bg-muted/30 rounded-lg animate-pulse ml-8" />
					<div className="h-12 bg-muted/30 rounded-lg animate-pulse ml-8" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full min-h-0 overflow-hidden">
			{}
			<ChatHeader coverage={legacyCoverage} />

			{}
			{currentTrackId && (
				<BackToTracksButton onClick={handleBackToTracks} disabled={isSending} />
			)}

			{}
			<ScrollArea className="flex-1 p-3" type="always">
				<div className="space-y-3">
					{conversationHistory.map((message, index) => (
						<LegacyChatMessage
							key={`${message.id}-${index}`}
							message={message}
							onTrackSelect={handleTrackSelect}
							isLoading={isSending}
						/>
					))}

					{}
					{isSending && <TypingIndicator />}

					{}
					{error && (
						<div className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
							{error}
						</div>
					)}

					<div ref={scrollRef} />
				</div>
			</ScrollArea>

			{}
			{currentTrackId && (
				<div className="shrink-0">
					<MessageInput
						onSend={handleSendMessage}
						disabled={isSending}
						placeholder={t("shareYourStory")}
					/>
				</div>
			)}
		</div>
	);
}

export { BackToTracksButton } from "./BackToTracksButton";

export { ChatHeader, LegacyChatHeader } from "./ChatHeader";
export { ChatMessage, LegacyChatMessage, TypingIndicator } from "./ChatMessage";
export { MessageInput } from "./MessageInput";
export { TrackActionCards } from "./TrackActionCards";
````

## File: components/Navbar.tsx
````typescript
"use client";

import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/app/LanguageSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { performLogout } from "@/lib/auth/logout";
import { useUserStore } from "@/lib/store/userStore";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export function Navbar() {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { isAuthenticated, profile } = useUserStore();


	const t = useTranslations("nav");


	const publicNavLinks = [
		{ href: "/", labelKey: "home" },
		{ href: "/features", labelKey: "features" },
		{ href: "/about", labelKey: "about" },
	];

	const authNavLinks = [
		{ href: "/dashboard", labelKey: "home" },
		{ href: "/explore", labelKey: "explore" },
		{ href: "/dashboard/applications", labelKey: "applications" },
		{ href: "/persona-lab", labelKey: "personaLab" },
	];


	const navLinks = isAuthenticated ? authNavLinks : publicNavLinks;


	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setAvatarDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);


	const getInitials = (name?: string) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	// Handle logout - call backend to clear httpOnly cookies, then use performLogout
	const handleLogout = async () => {
		try {
			// Clear httpOnly cookies via backend (for OAuth)
			await fetch(`${API_URL}/oauth/logout`, {
				method: "POST",
				credentials: "include",
			});
		} catch (error) {
			console.error("Logout API error:", error);
		} finally {

			performLogout({ redirect: "/" });
		}
	};

	return (
		<nav className="bg-card border-b border-border fixed top-0 left-0 right-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{}
					<Link
						href={isAuthenticated ? "/dashboard" : "/"}
						className="flex items-center gap-2"
					>
						<Image
							src="/Logo.png"
							alt="Leaply"
							width={120}
							height={40}
							className="h-8 w-auto"
						/>
					</Link>

					{}
					<div className="hidden md:flex items-center gap-6">
						{navLinks.map((link) => {
							const isActive =
								link.href === "/" || link.href === "/dashboard"
									? pathname === link.href
									: pathname === link.href || pathname?.startsWith(link.href);
							return (
								<Link
									key={link.href}
									href={link.href}
									className={cn(
										"text-sm font-medium transition-colors hover:text-primary",
										isActive ? "text-primary" : "text-foreground",
									)}
								>
									{t(link.labelKey)}
								</Link>
							);
						})}
					</div>

					{}
					<div className="hidden md:flex items-center gap-3">
						<LanguageSwitcher />

						{isAuthenticated ? (
							<div className="relative" ref={dropdownRef}>
								<button
									type="button"
									onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
									className="flex items-center gap-2 p-1 rounded-full hover:bg-muted transition-colors"
								>
									<Avatar className="w-8 h-8 border-2 border-primary/20">
										<AvatarImage
											src={profile?.profilePicture}
											alt={profile?.fullName}
										/>
										<AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
											{getInitials(profile?.fullName)}
										</AvatarFallback>
									</Avatar>
									<ChevronDown
										className={cn(
											"w-4 h-4 text-muted-foreground transition-transform",
											avatarDropdownOpen && "rotate-180",
										)}
									/>
								</button>

								{}
								{avatarDropdownOpen && (
									<div className="absolute right-0 mt-2 w-56 bg-card rounded-lg border border-border shadow-lg py-2 z-50">
										<div className="px-4 py-2 border-b border-border">
											<p className="text-sm font-medium text-foreground truncate">
												{profile?.fullName || "User"}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{profile?.email}
											</p>
										</div>
										<div className="py-1">
											<Link
												href="/dashboard/profile"
												className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
												onClick={() => setAvatarDropdownOpen(false)}
											>
												<User className="w-4 h-4" />
												{t("profile")}
											</Link>
											<button
												type="button"
												onClick={() => {
													setAvatarDropdownOpen(false);
													handleLogout();
												}}
												className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
											>
												<LogOut className="w-4 h-4" />
												{t("logout")}
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<>
								<Button variant="ghost" size="sm" asChild>
									<Link href="/login">{t("login")}</Link>
								</Button>
								<Button size="sm" asChild>
									<Link href="/register">{t("getStarted")}</Link>
								</Button>
							</>
						)}
					</div>

					{}
					<div className="flex items-center gap-2 md:hidden">
						<LanguageSwitcher />
						<button
							type="button"
							className="p-2 text-foreground"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							{mobileMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>
					</div>
				</div>

				{}
				{mobileMenuOpen && (
					<div className="md:hidden py-4 border-t border-border">
						<div className="flex flex-col gap-4">
							{navLinks.map((link) => {
								const isActive =
									link.href === "/" || link.href === "/dashboard"
										? pathname === link.href
										: pathname === link.href || pathname?.startsWith(link.href);
								return (
									<Link
										key={link.href}
										href={link.href}
										className={cn(
											"text-sm font-medium",
											isActive ? "text-primary" : "text-foreground",
										)}
										onClick={() => setMobileMenuOpen(false)}
									>
										{t(link.labelKey)}
									</Link>
								);
							})}
							<div className="pt-4 border-t border-border flex flex-col gap-2">
								{isAuthenticated ? (
									<>
										<div className="flex items-center gap-3 px-1 py-2">
											<Avatar className="w-8 h-8 border-2 border-primary/20">
												<AvatarImage
													src={profile?.profilePicture}
													alt={profile?.fullName}
												/>
												<AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
													{getInitials(profile?.fullName)}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-foreground truncate">
													{profile?.fullName || "User"}
												</p>
												<p className="text-xs text-muted-foreground truncate">
													{profile?.email}
												</p>
											</div>
										</div>
										<Button variant="outline" type="button" size="sm" asChild>
											<Link
												href="/dashboard/profile"
												onClick={() => setMobileMenuOpen(false)}
											>
												<User className="w-4 h-4 mr-2" />
												{t("profile")}
											</Link>
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												setMobileMenuOpen(false);
												handleLogout();
											}}
										>
											<LogOut className="w-4 h-4 mr-2" />
											{t("logout")}
										</Button>
									</>
								) : (
									<>
										<Button variant="outline" size="sm" asChild>
											<Link
												href="/login"
												onClick={() => setMobileMenuOpen(false)}
											>
												{t("login")}
											</Link>
										</Button>
										<Button size="sm" asChild>
											<Link
												href="/register"
												onClick={() => setMobileMenuOpen(false)}
											>
												{t("getStarted")}
											</Link>
										</Button>
									</>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
````

## File: package.json
````json
{
	"name": "leaply-app",
	"version": "0.1.0",
	"private": true,
	"scripts": {
		"dev": "next dev",
		"build": "next build",
		"start": "next start",
		"format": "biome format --write .",
		"format:check": "biome format .",
		"lint": "biome lint --write .",
		"lint:check": "biome lint .",
		"check": "biome check --write .",
		"check:ci": "biome check .",
		"knip": "knip"
	},
	"dependencies": {
		"@faker-js/faker": "^10.2.0",
		"@radix-ui/react-dialog": "^1.1.15",
		"@radix-ui/react-dropdown-menu": "^2.1.16",
		"@radix-ui/react-label": "^2.1.8",
		"@radix-ui/react-scroll-area": "^1.2.10",
		"@radix-ui/react-select": "^2.2.6",
		"@radix-ui/react-separator": "^1.1.8",
		"@radix-ui/react-slot": "^1.2.4",
		"@radix-ui/react-tabs": "^1.1.13",
		"@radix-ui/react-toggle": "^1.1.10",
		"@radix-ui/react-toggle-group": "^1.1.11",
		"@sentry/nextjs": "^10",
		"@tailwindcss/forms": "^0.5.10",
		"@tailwindcss/postcss": "^4.1.17",
		"@tanstack/react-query": "^5.90.16",
		"@types/d3-force": "^3.0.10",
		"@xyflow/react": "^12.10.0",
		"class-variance-authority": "^0.7.1",
		"clsx": "^2.1.1",
		"d3-force": "^3.0.0",
		"framer-motion": "^12.23.25",
		"js-cookie": "^3.0.5",
		"lucide-react": "^0.556.0",
		"next": "^16.1.1",
		"next-intl": "^4.7.0",
		"postcss": "^8.4.0",
		"react": "19.2.1",
		"react-dom": "19.2.1",
		"react-force-graph-2d": "^1.29.0",
		"tailwind-merge": "^3.4.0",
		"tailwindcss": "^4.1.18",
		"zod": "^4.3.5",
		"zustand": "^5.0.9"
	},
	"devDependencies": {
		"@biomejs/biome": "^2.3.10",
		"@tailwindcss/typography": "^0.5.19",
		"@types/js-cookie": "^3.0.6",
		"@types/node": "^25.0.3",
		"@types/react": "19.2.7",
		"@types/react-dom": "19.2.3",
		"knip": "^5.80.0",
		"shadcn": "^3.6.3",
		"tw-animate-css": "^1.4.0",
		"typescript": "^5.9.3",
		"@tanstack/react-query-devtools": "^5.91.2"
	},
	"overrides": {
		"@types/react": "19.2.7",
		"@types/react-dom": "19.2.3"
	},
	"trustedDependencies": [
		"@parcel/watcher",
		"@swc/core",
		"unrs-resolver"
	]
}
````

## File: lib/api/client.ts
````typescript
import * as Sentry from "@sentry/nextjs";
import { performLogout } from "../auth/logout";
import { useUserStore } from "../store/userStore";
import type { ApiResponse, AuthResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const isDev = process.env.NODE_ENV === "development";


const COOKIE_AUTH_TOKEN = "COOKIE_AUTH";


let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];


const REFRESH_TIMEOUT_MS = 10000;




function subscribeTokenRefresh(callback: (token: string | null) => void) {
	refreshSubscribers.push(callback);
}




function onTokenRefreshed(newToken: string | null) {
	for (const callback of refreshSubscribers) {
		callback(newToken);
	}
	refreshSubscribers = [];
}




function clearRefreshSubscribers() {
	for (const callback of refreshSubscribers) {
		callback(null);
	}
	refreshSubscribers = [];
}




function isCookieAuth(): boolean {
	const { accessToken, refreshToken } = useUserStore.getState();
	return (
		accessToken === COOKIE_AUTH_TOKEN || refreshToken === COOKIE_AUTH_TOKEN
	);
}






async function refreshAccessToken(): Promise<string | null> {
	const { refreshToken, setTokens } = useUserStore.getState();



	if (isCookieAuth()) {
		if (isDev) console.warn("Cookie-based auth: cannot refresh from frontend");
		return null;
	}

	if (!refreshToken) {
		if (isDev) console.warn("No refresh token available");
		return null;
	}

	try {
		const response = await fetch(`${API_URL}/v1/auth/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refreshToken }),
		});

		if (!response.ok) {
			if (isDev)
				console.warn("Token refresh failed with status:", response.status);
			return null;
		}

		const data = (await response.json()) as ApiResponse<AuthResponse>;

		if (data.success && data.data) {
			const {
				accessToken,
				refreshToken: newRefreshToken,
				expiresIn,
			} = data.data;
			setTokens(accessToken, newRefreshToken, expiresIn);
			if (isDev) console.log("Token refreshed successfully");
			return accessToken;
		}

		return null;
	} catch (error) {
		if (isDev) console.error("Token refresh error:", error);
		return null;
	}
}





async function handleUnauthorized(): Promise<string | null> {
	if (typeof window === "undefined") return null;

	const { isAuthenticated } = useUserStore.getState();
	if (!isAuthenticated) return null;


	if (isRefreshing) {
		return new Promise<string | null>((resolve) => {
			subscribeTokenRefresh((token) => resolve(token));
		});
	}

	isRefreshing = true;

	try {

		const newToken = await Promise.race([
			refreshAccessToken(),
			new Promise<null>((_, reject) =>
				setTimeout(
					() => reject(new Error("Token refresh timeout")),
					REFRESH_TIMEOUT_MS,
				),
			),
		]);

		if (newToken) {
			onTokenRefreshed(newToken);
			return newToken;
		}


		console.warn("Token refresh failed. Logging out...");
		clearRefreshSubscribers();
		performLogout({ redirect: "/?expired=true" });
		return null;
	} catch (error) {

		console.error("Token refresh error:", error);
		clearRefreshSubscribers();
		performLogout({ redirect: "/?expired=true" });
		return null;
	} finally {
		isRefreshing = false;
	}
}




function handleForbidden() {
	if (isDev) console.warn("Access denied (403 Forbidden)");

}

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions extends RequestInit {
	token?: string;
	_retry?: boolean;
}

export class ApiError extends Error {
	constructor(
		public message: string,
		public status: number,
		public code?: string,
		public field?: string,
		public details?: Record<string, unknown>,
		public endpoint?: string,
		public timestamp?: string,
	) {
		super(message);
		this.name = "ApiError";
	}


	getUserMessage(): string {
		switch (this.status) {
			case 400:
				return this.message || "Invalid request. Please check your input.";
			case 401:
				return "Please log in to continue.";
			case 403:
				return "You don't have permission to perform this action.";
			case 404:
				return "The requested resource was not found.";
			case 500:
				return "Something went wrong on our end. Please try again later.";
			default:
				return this.message || "An unexpected error occurred.";
		}
	}


	logDetails(): void {
		console.error(`API Error [${this.status}] - ${this.endpoint}`, {
			message: this.message,
			code: this.code || "N/A",
			field: this.field || "N/A",
			details: this.details || "N/A",
			timestamp: this.timestamp || "N/A",
		});
	}
}

async function apiFetch<T>(
	endpoint: string,
	method: RequestMethod = "GET",
	body?: unknown,
	options: FetchOptions = {},
): Promise<T> {
	const { token, headers, _retry, ...customConfig } = options;

	const requestHeaders: HeadersInit = {
		"Content-Type": "application/json",
		...((headers as Record<string, string>) || {}),
	};

	if (token && token !== COOKIE_AUTH_TOKEN) {

		requestHeaders.Authorization = `Bearer ${token}`;
	} else if (!token) {

		try {
			const storeToken = useUserStore.getState().accessToken;

			if (storeToken && storeToken !== COOKIE_AUTH_TOKEN) {
				requestHeaders.Authorization = `Bearer ${storeToken}`;
			}


		} catch (e) {

			if (isDev) console.warn("Failed to retrieve token from store", e);
		}
	}


	const config: RequestInit = {
		method,
		headers: requestHeaders,
		credentials: "include",
		...customConfig,
	};

	if (body) {
		config.body = JSON.stringify(body);
	}


	const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
	const url = `${API_URL}${path}`;


	if (isDev) {
		console.log(`📡 [${method}] ${path}`, body ? { body } : "");
	}

	const startTime = performance.now();

	try {
		const response = await fetch(url, config);

		// Try to parse JSON, handle non-JSON responses
		let data: ApiResponse<T> | null = null;
		const contentType = response.headers.get("content-type");

		if (contentType?.includes("application/json")) {
			try {
				data = (await response.json()) as ApiResponse<T>;
			} catch (parseError) {
				if (isDev) console.error("Failed to parse JSON response:", parseError);
				throw new ApiError(
					"Invalid response from server",
					response.status,
					"PARSE_ERROR",
					undefined,
					{ parseError: String(parseError) },
					path,
				);
			}
		} else {

			const textBody = await response.text();
			if (isDev) console.error("Non-JSON response:", textBody);
			throw new ApiError(
				"Unexpected response format from server",
				response.status,
				"INVALID_CONTENT_TYPE",
				undefined,
				{ contentType, body: textBody.slice(0, 500) },
				path,
			);
		}


		if (isDev) {
			const duration = (performance.now() - startTime).toFixed(0);
			console.log(
				`${response.ok ? "✅" : "❌"} [${method}] ${path} - ${response.status} (${duration}ms)`,
			);
		}

		if (!response.ok || !data?.success) {

			if (response.status === 401 && !_retry) {
				if (isDev) console.log("401 received, attempting token refresh...");
				const newToken = await handleUnauthorized();

				if (newToken) {

					if (isDev) console.log("Retrying request with new token...");
					return apiFetch<T>(endpoint, method, body, {
						...options,
						token: newToken,
						_retry: true,
					});
				}

			}


			if (response.status === 403) {
				handleForbidden();

			}

			const apiError = new ApiError(
				data?.message || "An error occurred",
				response.status,
				data?.error?.code,
				data?.error?.field,
				data?.error?.details,
				path,
				data?.timestamp,
			);


			if (isDev) apiError.logDetails();


			if (response.status >= 500) {
				Sentry.captureException(apiError, {
					extra: {
						endpoint: path,
						status: response.status,
						code: data?.error?.code,
					},
				});
			}

			throw apiError;
		}

		return data.data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}


		const isNetworkError =
			error instanceof TypeError && error.message.includes("fetch");

		if (isDev) {
			console.error(`🌐 Network Error [${method}] ${path}:`, error);
		}


		Sentry.captureException(error, {
			extra: {
				endpoint: path,
				method,
				isNetworkError,
			},
			tags: {
				errorType: isNetworkError ? "network" : "unknown",
			},
		});

		throw new ApiError(
			isNetworkError
				? "Unable to connect to server. Please check your connection."
				: error instanceof Error
					? error.message
					: "Network error",
			0,
			isNetworkError ? "NETWORK_ERROR" : "UNKNOWN_ERROR",
			undefined,
			{ originalError: String(error) },
			path,
		);
	}
}

export const apiClient = {
	get: <T>(endpoint: string, options?: FetchOptions) =>
		apiFetch<T>(endpoint, "GET", undefined, options),
	post: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
		apiFetch<T>(endpoint, "POST", body, options),
	put: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
		apiFetch<T>(endpoint, "PUT", body, options),
	delete: <T>(endpoint: string, options?: FetchOptions) =>
		apiFetch<T>(endpoint, "DELETE", undefined, options),
	patch: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
		apiFetch<T>(endpoint, "PATCH", body, options),
};
````

## File: lib/store/personaStore.ts
````typescript
import * as Sentry from "@sentry/nextjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiError } from "@/lib/api/client";
import { personaApi } from "@/lib/api/personaApi";
import { createInitialTracks } from "@/lib/constants/tracks";
import type {
	GraphEdge as ApiGraphEdge,
	GraphNode as ApiGraphNode,
	ArchetypeHints,
	ArchetypeType,
	CanvasAction,
	CanvasNode,
	ChatMessage,
	ConversationMessage,
	Coverage,
	GraphMessageResponse,
	NodeType,
	StarStructure,
	Track,
	TrackId,
	TrackStatus,
} from "@/lib/types/persona";
import type {
	GraphMeta,
	PersonaEdgeDto,
	PersonaNodeDto,
} from "@/lib/types/persona-graph";


export type { TrackId, TrackStatus, Track, ChatMessage, CanvasNode, NodeType };


export type LegacyTrackId = "academic" | "activities" | "values" | "future";
export type NodeLayer = "story" | "evidence" | "insight" | "archetype";
export type ViewMode = "list" | "canvas";

export interface VisibleLayers {
	story: boolean;
	evidence: boolean;
	insight: boolean;
	archetype: boolean;
}


export interface CanvasKeyword {
	id: string;
	keyword: string;
	trackId: TrackId;
	createdAt: string;
}


interface PersonaStoreState {

	tracks: Record<TrackId, Track>;
	nodes: CanvasNode[];
	archetype: {
		type: ArchetypeType;
		personalizedSummary: string;
		revealedAt: string;
	} | null;
	conversationHistory: ChatMessage[];


	archetypeHints: ArchetypeHints | null;
	keywords: CanvasKeyword[];


	currentTrackId: TrackId | null;
	isLoading: boolean;
	isSending: boolean;
	error: string | null;
	viewMode: ViewMode;
	visibleLayers: VisibleLayers;
	selectedNodeId: string | null;
	isExtractingKeywords: boolean;


	expandedTrackId: TrackId | null;
	expandedStoryId: string | null;


	graphNodes: PersonaNodeDto[];
	graphEdges: PersonaEdgeDto[];
	graphMeta: GraphMeta | null;
	isGraphLoading: boolean;
	selectedGraphNodeId: string | null;
	hoveredNodeId: string | null;
	showAllDetails: boolean;


	apiGraphNodes: ApiGraphNode[];
	apiGraphEdges: ApiGraphEdge[];
	coverage: Coverage;
	completionReady: boolean;
	totalNodeCount: number;
	starGapsMap: Record<string, (keyof StarStructure)[]>;


	graphMessages: ConversationMessage[];




	fetchPersonaState: () => Promise<void>;


	selectTrack: (trackId: TrackId) => Promise<void>;
	sendMessage: (content: string) => Promise<void>;
	goBackToTrackSelection: () => Promise<void>;
	redoTrack: (trackId: TrackId) => Promise<void>;


	setViewMode: (mode: ViewMode) => void;
	toggleLayer: (layer: NodeLayer) => void;
	setVisibleLayers: (layers: VisibleLayers) => void;
	selectNode: (nodeId: string | null) => void;
	processCanvasActions: (actions: CanvasAction[]) => void;


	setExpandedTrack: (trackId: TrackId | null) => void;
	setExpandedStory: (storyId: string | null) => void;


	extractKeywords: (content: string, trackId: TrackId) => Promise<void>;
	addKeywords: (keywords: string[], trackId: TrackId) => void;
	updateArchetypeHints: (hints: ArchetypeHints) => void;
	getKeywordsForTrack: (trackId: TrackId) => CanvasKeyword[];


	getCompletedTrackCount: () => number;
	getAvailableTracks: () => Track[];
	isArchetypeRevealed: () => boolean;
	getTrackProgress: () => { completed: number; total: number };


	fetchPersonaGraph: () => Promise<void>;
	selectGraphNode: (nodeId: string | null) => void;
	setHoveredNode: (nodeId: string | null) => void;
	setShowAllDetails: (show: boolean) => void;


	processGraphUpdate: (response: GraphMessageResponse) => void;
	setCoverage: (coverage: Coverage) => void;
	setCompletionReady: (ready: boolean) => void;
	addStarGaps: (nodeId: string, gaps: (keyof StarStructure)[]) => void;
	clearApiGraph: () => void;
	getStarGapsForNode: (nodeId: string) => (keyof StarStructure)[];


	addGraphMessage: (message: ConversationMessage) => void;
	clearGraphMessages: () => void;


	resetPersona: () => void;
	clearError: () => void;
}


const initialState = {
	tracks: createInitialTracks(),
	nodes: [] as CanvasNode[],
	archetype: null,
	conversationHistory: [] as ChatMessage[],
	archetypeHints: null as ArchetypeHints | null,
	keywords: [] as CanvasKeyword[],
	currentTrackId: null,
	isLoading: false,
	isSending: false,
	isExtractingKeywords: false,
	error: null,
	viewMode: "canvas" as ViewMode,
	visibleLayers: {
		story: true,
		evidence: true,
		insight: true,
		archetype: true,
	},
	selectedNodeId: null,
	expandedTrackId: null,
	expandedStoryId: null,

	graphNodes: [] as PersonaNodeDto[],
	graphEdges: [] as PersonaEdgeDto[],
	graphMeta: null as GraphMeta | null,
	isGraphLoading: false,
	selectedGraphNodeId: null as string | null,
	hoveredNodeId: null as string | null,
	showAllDetails: false,

	apiGraphNodes: [] as ApiGraphNode[],
	apiGraphEdges: [] as ApiGraphEdge[],
	coverage: {
		goals: 0,
		evidence: 0,
		skills: 0,
		values: 0,
		tensions: 0,
	} as Coverage,
	completionReady: false,
	totalNodeCount: 0,
	starGapsMap: {} as Record<string, (keyof StarStructure)[]>,

	graphMessages: [] as ConversationMessage[],
};

export const usePersonaStore = create<PersonaStoreState>()(
	persist(
		(set, get) => ({

			...initialState,




			fetchPersonaState: async () => {
				set({ isLoading: true, error: null });
				console.log("PersonaStore: Fetching persona state...");
				try {
					const state = await personaApi.getPersonaState();
					console.log("PersonaStore: State received:", state);
					set({
						tracks: state.tracks,
						nodes: state.nodes,
						archetype: state.archetype,
						conversationHistory: state.conversationHistory,
						currentTrackId: state.currentTrackId,
						isLoading: false,
					});
				} catch (err) {
					console.error("PersonaStore: Failed to fetch state:", err);
					if (err instanceof ApiError) {
						err.logDetails();
					} else {

						Sentry.captureException(err, {
							tags: { store: "persona", action: "fetchState" },
						});
					}
					set({
						error:
							err instanceof ApiError
								? err.getUserMessage()
								: (err as Error).message ||
									"Failed to load persona data. Please refresh.",
						isLoading: false,
					});
				}
			},


			selectTrack: async (trackId: TrackId) => {
				set({ isSending: true, error: null });
				console.log(`PersonaStore: Selecting track: ${trackId}`);
				try {
					const response = await personaApi.selectTrack(trackId);
					console.log("PersonaStore: Track selection successful");

					set((state) => ({
						conversationHistory: [
							...state.conversationHistory,
							response.message,
						],
						currentTrackId: response.currentTrackId,
						tracks: {
							...state.tracks,
							[trackId]: {
								...state.tracks[trackId],
								status: response.trackStatus,
							},
						},
						isSending: false,
					}));
				} catch (err) {
					console.error(
						`PersonaStore: Failed to select track ${trackId}:`,
						err,
					);
					if (err instanceof ApiError) {
						err.logDetails();
					} else {
						Sentry.captureException(err, {
							tags: { store: "persona", action: "selectTrack" },
						});
					}
					set({
						error:
							err instanceof ApiError
								? err.getUserMessage()
								: (err as Error).message ||
									`Failed to select ${trackId}. Please try again.`,
						isSending: false,
					});
				}
			},


			sendMessage: async (content: string) => {
				const { currentTrackId } = get();
				if (!currentTrackId) {
					set({ error: "No track selected" });
					return;
				}


				const userMessage: ChatMessage = {
					id: `temp-${Date.now()}`,
					role: "user",
					content,
					type: "text",
					timestamp: new Date().toISOString(),
				};

				set((state) => ({
					conversationHistory: [...state.conversationHistory, userMessage],
					isSending: true,
					error: null,
				}));

				try {
					const response = await personaApi.sendMessage(content);

					set((state) => {

						let nodes = [...state.nodes];
						let archetype = state.archetype;

						if (response.message.canvasActions) {
							console.log(
								"PersonaStore: Processing canvas actions:",
								response.message.canvasActions,
							);
							for (const action of response.message.canvasActions) {
								if (action.action === "add" && action.node) {

									if (!nodes.find((n) => n.id === action.node?.id)) {
										nodes.push(action.node);
									}
								}
								if (action.action === "remove" && action.nodeId) {

									nodes = nodes.filter((n) => n.id !== action.nodeId);
								}
								if (action.action === "reveal_archetype" && action.archetype) {

									archetype = {
										type: action.archetype.type,
										personalizedSummary: action.archetype.personalizedSummary,
										revealedAt: new Date().toISOString(),
									};
								}
							}
						}


						const updatedTracks = { ...state.tracks };
						if (response.currentTrackId) {
							const trackId = response.currentTrackId;
							updatedTracks[trackId] = {
								...updatedTracks[trackId],
								status: response.trackStatus ?? updatedTracks[trackId].status,
								completedAt:
									response.trackStatus === "completed"
										? new Date().toISOString()
										: updatedTracks[trackId].completedAt,

								coreQuestionIndex:
									response.conversationState?.coreQuestionIndex ??
									updatedTracks[trackId].coreQuestionIndex,
								followUpIndex:
									response.conversationState?.followUpIndex ??
									updatedTracks[trackId].followUpIndex,
							};
						}


						if (
							response.allTracksComplete &&
							response.message.canvasActions &&
							!archetype
						) {
							const revealAction = response.message.canvasActions.find(
								(a) => a.action === "reveal_archetype",
							);
							if (revealAction?.archetype) {
								archetype = {
									type: revealAction.archetype.type,
									personalizedSummary:
										revealAction.archetype.personalizedSummary,
									revealedAt: new Date().toISOString(),
								};
							}
						}

						console.log(
							"PersonaStore: State updated - nodes:",
							nodes.length,
							"archetype:",
							archetype?.type,
						);

						return {
							conversationHistory: [
								...state.conversationHistory,
								response.message,
							],
							currentTrackId: response.currentTrackId ?? null,
							tracks: updatedTracks,
							nodes,
							archetype,
							archetypeHints: response.archetypeHints ?? state.archetypeHints,
							isSending: false,
						};
					});
				} catch (err) {
					console.error("PersonaStore: Failed to send message:", err);
					if (err instanceof ApiError) {
						err.logDetails();
					} else {
						Sentry.captureException(err, {
							tags: { store: "persona", action: "sendMessage" },
						});
					}

					set((state) => ({
						conversationHistory: state.conversationHistory.filter(
							(m) => !m.id.startsWith("temp-"),
						),
						error:
							err instanceof ApiError
								? err.getUserMessage()
								: (err as Error).message ||
									"Failed to send message. Please try again.",
						isSending: false,
					}));
				}
			},


			goBackToTrackSelection: async () => {
				set({ isSending: true, error: null });
				try {
					const response = await personaApi.goBackToTrackSelection();
					set((state) => ({
						conversationHistory: [
							...state.conversationHistory,
							response.message,
						],
						currentTrackId: null,
						isSending: false,
					}));
				} catch (err) {
					console.error("PersonaStore: Failed to go back:", err);
					if (err instanceof ApiError) {
						err.logDetails();
					} else {
						Sentry.captureException(err, {
							tags: { store: "persona", action: "goBack" },
						});
					}
					set({
						error:
							err instanceof ApiError
								? err.getUserMessage()
								: (err as Error).message ||
									"Failed to go back. Please try again.",
						isSending: false,
					});
				}
			},


			redoTrack: async (trackId: TrackId) => {
				set({ isSending: true, error: null });
				try {
					const response = await personaApi.redoTrack(trackId);

					set((state) => {

						const nodes = state.nodes.filter(
							(n) => !response.removedNodeIds.includes(n.id),
						);

						return {
							conversationHistory: [
								...state.conversationHistory,
								response.message,
							],
							currentTrackId: response.currentTrackId,
							tracks: {
								...state.tracks,
								[trackId]: {
									...state.tracks[trackId],
									status: response.trackStatus,
									completedAt: null,
								},
							},
							nodes,

							archetype: null,
							isSending: false,
						};
					});
				} catch (err) {
					console.error("PersonaStore: Failed to redo track:", err);
					if (err instanceof ApiError) {
						err.logDetails();
					} else {
						Sentry.captureException(err, {
							tags: { store: "persona", action: "redoTrack" },
						});
					}
					set({
						error:
							err instanceof ApiError
								? err.getUserMessage()
								: (err as Error).message ||
									"Failed to redo track. Please try again.",
						isSending: false,
					});
				}
			},


			setViewMode: (mode) => set({ viewMode: mode }),

			toggleLayer: (layer: NodeLayer) =>
				set((state) => ({
					visibleLayers: {
						...state.visibleLayers,
						[layer]: !state.visibleLayers[layer],
					},
				})),

			setVisibleLayers: (layers) => set({ visibleLayers: layers }),

			selectNode: (nodeId) => set({ selectedNodeId: nodeId }),


			setExpandedTrack: (trackId) =>
				set({
					expandedTrackId: trackId,
					expandedStoryId: null,
				}),
			setExpandedStory: (storyId) => set({ expandedStoryId: storyId }),

			processCanvasActions: (actions: CanvasAction[]) => {
				set((state) => {
					let nodes = [...state.nodes];
					let archetype = state.archetype;

					for (const action of actions) {
						if (action.action === "add" && action.node) {

							if (!nodes.find((n) => n.id === action.node?.id)) {
								nodes.push(action.node);
							}
						}
						if (action.action === "remove" && action.nodeId) {

							nodes = nodes.filter((n) => n.id !== action.nodeId);
						}
						if (action.action === "reveal_archetype" && action.archetype) {

							archetype = {
								type: action.archetype.type,
								personalizedSummary: action.archetype.personalizedSummary,
								revealedAt: new Date().toISOString(),
							};
						}
					}

					return { nodes, archetype };
				});
			},


			extractKeywords: async (content: string, trackId: TrackId) => {
				set({ isExtractingKeywords: true });
				try {
					const response = await personaApi.extractKeywords(content, trackId);
					if (response.keywords && response.keywords.length > 0) {
						get().addKeywords(response.keywords, trackId);
					}
				} catch (err) {
					console.error("PersonaStore: Failed to extract keywords:", err);

				} finally {
					set({ isExtractingKeywords: false });
				}
			},

			addKeywords: (newKeywords: string[], trackId: TrackId) => {
				set((state) => {
					const MAX_KEYWORDS_PER_TRACK = 10;
					const existingForTrack = state.keywords.filter(
						(k) => k.trackId === trackId,
					);
					const otherKeywords = state.keywords.filter(
						(k) => k.trackId !== trackId,
					);


					const newCanvasKeywords: CanvasKeyword[] = newKeywords.map((kw) => ({
						id: `kw-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
						keyword: kw,
						trackId,
						createdAt: new Date().toISOString(),
					}));


					let trackKeywords = [...existingForTrack, ...newCanvasKeywords];
					if (trackKeywords.length > MAX_KEYWORDS_PER_TRACK) {

						trackKeywords = trackKeywords.slice(-MAX_KEYWORDS_PER_TRACK);
					}

					return {
						keywords: [...otherKeywords, ...trackKeywords],
					};
				});
			},

			updateArchetypeHints: (hints: ArchetypeHints) => {
				set({ archetypeHints: hints });
			},

			getKeywordsForTrack: (trackId: TrackId) => {
				return get().keywords.filter((k) => k.trackId === trackId);
			},


			getCompletedTrackCount: () => {
				const { tracks } = get();
				return Object.values(tracks).filter((t) => t.status === "completed")
					.length;
			},

			getAvailableTracks: () => {
				const { tracks } = get();
				return Object.values(tracks).filter((t) => t.status !== "completed");
			},

			isArchetypeRevealed: () => {
				return get().archetype !== null;
			},

			getTrackProgress: () => {
				const { tracks } = get();
				const trackList = Object.values(tracks);
				const completed = trackList.filter(
					(t) => t.status === "completed",
				).length;
				return { completed, total: trackList.length };
			},




			fetchPersonaGraph: async () => {
				set({ isGraphLoading: true, error: null });
				console.log("PersonaStore: Fetching persona graph...");
				try {
					const graphData = await personaApi.getPersonaGraph();
					console.log("PersonaStore: Graph data received:", graphData);
					set({
						graphNodes: graphData.nodes,
						graphEdges: graphData.edges,
						graphMeta: graphData.meta,
						isGraphLoading: false,
					});
				} catch (err) {
					console.error("PersonaStore: Failed to fetch graph:", err);
					if (err instanceof ApiError) {
						err.logDetails();
					} else {
						Sentry.captureException(err, {
							tags: { store: "persona", action: "fetchGraph" },
						});
					}
					set({
						error:
							err instanceof ApiError
								? err.getUserMessage()
								: (err as Error).message ||
									"Failed to load graph data. Please refresh.",
						isGraphLoading: false,
					});
				}
			},


			selectGraphNode: (nodeId: string | null) =>
				set({ selectedGraphNodeId: nodeId }),


			setHoveredNode: (nodeId: string | null) => set({ hoveredNodeId: nodeId }),


			setShowAllDetails: (show: boolean) => set({ showAllDetails: show }),




			processGraphUpdate: (response: GraphMessageResponse) => {
				set((state) => {

					const existingNodeIds = new Set(state.apiGraphNodes.map((n) => n.id));
					const newNodes = response.nodesCreated.filter(
						(n) => !existingNodeIds.has(n.id),
					);


					const existingEdgeIds = new Set(state.apiGraphEdges.map((e) => e.id));
					const newEdges = response.edgesCreated.filter(
						(e) => !existingEdgeIds.has(e.id),
					);


					const starGapsMap = { ...state.starGapsMap };
					if (
						response.starGapsForLastStory &&
						response.starGapsForLastStory.length > 0
					) {

						const lastStoryNode = [...newNodes]
							.reverse()
							.find((n) => n.type === "key_story");
						if (lastStoryNode) {
							starGapsMap[lastStoryNode.id] = response.starGapsForLastStory;
						}
					}

					return {
						apiGraphNodes: [...state.apiGraphNodes, ...newNodes],
						apiGraphEdges: [...state.apiGraphEdges, ...newEdges],
						coverage: response.coverage,
						completionReady: response.completionReady,
						totalNodeCount: response.totalNodeCount,
						starGapsMap,
					};
				});
			},


			setCoverage: (coverage: Coverage) => set({ coverage }),


			setCompletionReady: (ready: boolean) => set({ completionReady: ready }),


			addStarGaps: (nodeId: string, gaps: (keyof StarStructure)[]) => {
				set((state) => ({
					starGapsMap: {
						...state.starGapsMap,
						[nodeId]: gaps,
					},
				}));
			},


			clearApiGraph: () =>
				set({
					apiGraphNodes: [],
					apiGraphEdges: [],
					coverage: {
						goals: 0,
						evidence: 0,
						skills: 0,
						values: 0,
						tensions: 0,
					},
					completionReady: false,
					totalNodeCount: 0,
					starGapsMap: {},
				}),


			getStarGapsForNode: (nodeId: string) => {
				return get().starGapsMap[nodeId] || [];
			},




			addGraphMessage: (message: ConversationMessage) => {
				set((state) => ({
					graphMessages: [...state.graphMessages, message],
				}));
			},


			clearGraphMessages: () => set({ graphMessages: [] }),


			resetPersona: () => set(initialState),

			clearError: () => set({ error: null }),
		}),
		{
			name: "leaply-persona-store-v3",
			partialize: (state) => ({

				tracks: state.tracks,
				nodes: state.nodes,
				archetype: state.archetype,
				conversationHistory: state.conversationHistory,
				archetypeHints: state.archetypeHints,
				keywords: state.keywords,
				currentTrackId: state.currentTrackId,
				viewMode: state.viewMode,
				visibleLayers: state.visibleLayers,
				expandedTrackId: state.expandedTrackId,
				expandedStoryId: state.expandedStoryId,

				graphNodes: state.graphNodes,
				graphEdges: state.graphEdges,
				graphMeta: state.graphMeta,

				apiGraphNodes: state.apiGraphNodes,
				apiGraphEdges: state.apiGraphEdges,
				coverage: state.coverage,
				completionReady: state.completionReady,
				totalNodeCount: state.totalNodeCount,
				starGapsMap: state.starGapsMap,

				graphMessages: state.graphMessages,
			}),
		},
	),
);


export const selectConversationHistory = (state: PersonaStoreState) =>
	state.conversationHistory;
export const selectNodes = (state: PersonaStoreState) => state.nodes;
export const selectTracks = (state: PersonaStoreState) => state.tracks;
export const selectCurrentTrackId = (state: PersonaStoreState) =>
	state.currentTrackId;
export const selectIsLoading = (state: PersonaStoreState) => state.isLoading;
export const selectIsSending = (state: PersonaStoreState) => state.isSending;
export const selectArchetype = (state: PersonaStoreState) => state.archetype;
export const selectVisibleLayers = (state: PersonaStoreState) =>
	state.visibleLayers;
export const selectViewMode = (state: PersonaStoreState) => state.viewMode;


export const selectGraphNodes = (state: PersonaStoreState) => state.graphNodes;
export const selectGraphEdges = (state: PersonaStoreState) => state.graphEdges;
export const selectGraphMeta = (state: PersonaStoreState) => state.graphMeta;
export const selectIsGraphLoading = (state: PersonaStoreState) =>
	state.isGraphLoading;
export const selectSelectedGraphNodeId = (state: PersonaStoreState) =>
	state.selectedGraphNodeId;
export const selectHoveredNodeId = (state: PersonaStoreState) =>
	state.hoveredNodeId;
export const selectShowAllDetails = (state: PersonaStoreState) =>
	state.showAllDetails;


export const selectApiGraphNodes = (state: PersonaStoreState) =>
	state.apiGraphNodes;
export const selectApiGraphEdges = (state: PersonaStoreState) =>
	state.apiGraphEdges;
export const selectCoverage = (state: PersonaStoreState) => state.coverage;
export const selectCompletionReady = (state: PersonaStoreState) =>
	state.completionReady;
export const selectTotalNodeCount = (state: PersonaStoreState) =>
	state.totalNodeCount;
export const selectStarGapsMap = (state: PersonaStoreState) =>
	state.starGapsMap;
export const selectGraphMessages = (state: PersonaStoreState) =>
	state.graphMessages;


export type { PersonaNodeDto, PersonaEdgeDto, GraphMeta };

export type {
	ApiGraphNode,
	ApiGraphEdge,
	Coverage,
	StarStructure,
	GraphMessageResponse,
};
````

## File: components/login-form.tsx
````typescript
"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/lib/hooks/useLogin";
import { useUserStore } from "@/lib/store/userStore";
import { cn } from "@/lib/utils";
import { type LoginFormData, loginSchema } from "@/lib/validations/auth";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const t = useTranslations("auth");
	const login = useUserStore((state) => state.login);
	const loginMutation = useLogin();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<
		Partial<Record<keyof LoginFormData, string>>
	>({});

	// Check for OAuth error or session expired in URL params
	useEffect(() => {
		const oauthError = searchParams.get("error");
		const expired = searchParams.get("expired");

		if (oauthError === "oauth_failed") {
			setError(t("oauthFailed"));
		} else if (expired === "true") {
			setError(t("sessionExpired"));
		}
	}, [searchParams, t]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setFieldErrors({});

		try {

			const formData = loginSchema.parse({ email, password });

			const response = await loginMutation.mutateAsync(formData);


			const userProfile = {
				id: response.userId,
				email: response.email,
				fullName: "", // API doesn't return name on login yet, will need to fetch profile or adjust
			};

			login(
				userProfile,
				response.accessToken,
				response.refreshToken,
				response.expiresIn,
				response.onboardingCompleted,
			);

			if (response.onboardingCompleted) {
				router.push("/dashboard");
			} else {
				router.push("/onboarding");
			}
		} catch (err) {
			console.error("Login failed", err);


			if (err && typeof err === "object" && "errors" in err) {
				const zodError = err as {
					errors: Array<{ path: string[]; message: string }>;
				};
				const errors: Partial<Record<keyof LoginFormData, string>> = {};
				zodError.errors.forEach((error) => {
					const field = error.path[0] as keyof LoginFormData;
					if (field) {
						errors[field] = error.message;
					}
				});
				setFieldErrors(errors);
				setError("Please fix the errors below");
			} else {
				setError(
					err instanceof Error ? err.message : "Invalid email or password",
				);
			}
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">{t("loginTitle")}</CardTitle>
					<CardDescription>{t("loginSubtitle")}</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field>
								<GoogleLoginButton variant="login" />
							</Field>
							<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
								{t("orContinueWith")}
							</FieldSeparator>

							{error && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>{t("error")}</AlertTitle>
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<Field>
								<FieldLabel htmlFor="email">{t("email")}</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder={t("emailPlaceholder")}
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={loginMutation.isPending}
									className={fieldErrors.email ? "border-destructive" : ""}
								/>
								{fieldErrors.email && (
									<p className="text-sm text-destructive">
										{fieldErrors.email}
									</p>
								)}
							</Field>
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">{t("password")}</FieldLabel>
									<Link
										href="/forgot-password"
										className="ml-auto text-sm underline-offset-4 hover:underline"
									>
										{t("forgotPasswordLink")}
									</Link>
								</div>
								<Input
									id="password"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									disabled={loginMutation.isPending}
									className={fieldErrors.password ? "border-destructive" : ""}
								/>
								{fieldErrors.password && (
									<p className="text-sm text-destructive">
										{fieldErrors.password}
									</p>
								)}
							</Field>
							<Field>
								<Button type="submit" disabled={loginMutation.isPending}>
									{loginMutation.isPending && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{loginMutation.isPending ? t("loggingIn") : t("signIn")}
								</Button>
								<FieldDescription className="text-center">
									{t("noAccount")} <Link href="/register">{t("signUp")}</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center">
				{t("tosAgreement")} <Link href="/tos">{t("tos")}</Link> {t("and")}{" "}
				<Link href="/privacy">{t("privacyPolicy")}</Link>.
			</FieldDescription>
		</div>
	);
}
````

## File: components/signup-form.tsx
````typescript
"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/lib/hooks/useRegister";
import { useUserStore } from "@/lib/store/userStore";
import { cn } from "@/lib/utils";
import { type RegisterFormData, registerSchema } from "@/lib/validations/auth";

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const t = useTranslations("auth");
	const login = useUserStore((state) => state.login);
	const registerMutation = useRegister();
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<
		Partial<Record<keyof RegisterFormData, string>>
	>({});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setFieldErrors({});

		try {
			// Validate form data with Zod
			const validatedData = registerSchema.parse(formData);

			// Register returns AuthResponse which includes token
			const response = await registerMutation.mutateAsync({
				fullName: validatedData.fullName,
				email: validatedData.email,
				password: validatedData.password,
			});

			// Transform to UserProfile
			const userProfile = {
				id: response.userId,
				email: response.email,
				fullName: validatedData.fullName,
			};

			login(
				userProfile,
				response.accessToken,
				response.refreshToken,
				response.expiresIn,
				response.onboardingCompleted,
			);

			// Redirect to verify-email page for email verification prompt
			router.push("/verify-email");
		} catch (err) {
			console.error("Registration failed", err);


			if (err && typeof err === "object" && "errors" in err) {
				const zodError = err as {
					errors: Array<{ path: string[]; message: string }>;
				};
				const errors: Partial<Record<keyof RegisterFormData, string>> = {};
				zodError.errors.forEach((error) => {
					const field = error.path[0] as keyof RegisterFormData;
					if (field) {
						errors[field] = error.message;
					}
				});
				setFieldErrors(errors);
				setError("Please fix the errors below");
			} else {
				setError(
					err instanceof Error ? err.message : "Failed to create account",
				);
			}
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">{t("signupTitle")}</CardTitle>
					<CardDescription>{t("signupSubtitle")}</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field>
								<GoogleLoginButton variant="register" />
							</Field>
							<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
								{t("orContinueWith")}
							</FieldSeparator>

							{error && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>{t("error")}</AlertTitle>
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<Field>
								<FieldLabel htmlFor="fullName">{t("fullName")}</FieldLabel>
								<Input
									id="fullName"
									type="text"
									placeholder={t("fullNamePlaceholder")}
									required
									value={formData.fullName}
									onChange={handleChange}
									disabled={registerMutation.isPending}
									className={fieldErrors.fullName ? "border-destructive" : ""}
								/>
								{fieldErrors.fullName && (
									<p className="text-sm text-destructive">
										{fieldErrors.fullName}
									</p>
								)}
							</Field>
							<Field>
								<FieldLabel htmlFor="email">{t("email")}</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder={t("emailPlaceholder")}
									required
									value={formData.email}
									onChange={handleChange}
									disabled={registerMutation.isPending}
									className={fieldErrors.email ? "border-destructive" : ""}
								/>
								{fieldErrors.email && (
									<p className="text-sm text-destructive">
										{fieldErrors.email}
									</p>
								)}
							</Field>
							<Field>
								<Field className="grid grid-cols-2 gap-4">
									<Field>
										<FieldLabel htmlFor="password">{t("password")}</FieldLabel>
										<Input
											id="password"
											type="password"
											required
											value={formData.password}
											onChange={handleChange}
											disabled={registerMutation.isPending}
											className={
												fieldErrors.password ? "border-destructive" : ""
											}
										/>
										{fieldErrors.password && (
											<p className="text-sm text-destructive">
												{fieldErrors.password}
											</p>
										)}
									</Field>
									<Field>
										<FieldLabel htmlFor="confirmPassword">
											{t("confirmPassword")}
										</FieldLabel>
										<Input
											id="confirmPassword"
											type="password"
											required
											value={formData.confirmPassword}
											onChange={handleChange}
											disabled={registerMutation.isPending}
											className={
												fieldErrors.confirmPassword ? "border-destructive" : ""
											}
										/>
										{fieldErrors.confirmPassword && (
											<p className="text-sm text-destructive">
												{fieldErrors.confirmPassword}
											</p>
										)}
									</Field>
								</Field>
								<FieldDescription>{t("passwordDescription")}</FieldDescription>
							</Field>
							<Field>
								<Button type="submit" disabled={registerMutation.isPending}>
									{registerMutation.isPending && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{registerMutation.isPending
										? t("creatingAccount")
										: t("createAccount")}
								</Button>
								<FieldDescription className="text-center">
									{t("alreadyHaveAccount")}{" "}
									<Link href="/login">{t("signIn")}</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center">
				{t("tosAgreement")} <Link href="/tos">{t("tos")}</Link> {t("and")}{" "}
				<Link href="/privacy">{t("privacyPolicy")}</Link>.
			</FieldDescription>
		</div>
	);
}
````

## File: lib/api/types.ts
````typescript
export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
	error?: ErrorDetails;
	timestamp: string;
}

export interface ErrorDetails {
	code?: string;
	field?: string;
	details?: Record<string, unknown>;
}





export interface RegisterRequest {
	fullName: string;
	email: string;
	password: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface GoogleAuthRequest {
	idToken: string;
}

export interface AuthResponse {
	userId: string;
	email: string;
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
	role?: string;
	onboardingCompleted: boolean;
}

export interface RefreshTokenRequest {
	refreshToken: string;
}

export interface TokenErrorResponse {
	success: false;
	message: string;
	error: {
		code: "token_expired" | "invalid_token" | "unauthorized";
		details?: Record<string, unknown>;
	};
	timestamp: string;
}





export interface UserInfo {
	id: string;
	email: string;
	isEmailVerified: boolean;
	isOnboardingComplete: boolean;
	createdAt: string;
}

export interface ProfileInfo {
	fullName?: string;
	currentEducationLevel?: string;
	targetDegree?: string;
	gpa?: string;
	gpaScale?: string;
	testScores?: Record<string, string>;
}

export interface PreferencesInfo {
	fieldOfInterest?: string[];
	preferredRegions?: string[];
	intendedStartTerm?: string;
	budgetLabel?: string;
	journeyType?: string;
	programType?: string;
	campusSetting?: string;
	interests?: string[];
}

export interface UserContextResponse {
	user: UserInfo;
	profile: ProfileInfo;
	preferences: PreferencesInfo;
}

export interface ProfileResponse {
	userId: string;
	fullName?: string;
	currentEducationLevel?: string;
	targetDegree?: string;
	gpa?: number;
	gpaScale?: number;
	testScores?: Record<string, string>;
	workExperienceYears?: number;
	profileCompletion?: number;
}

export interface UpdateProfileRequest {
	fullName?: string;
	currentEducationLevel?: string;
	targetDegree?: string;
	gpa?: number;
	gpaScale?: number;
	currentMajor?: string;
	testScores?: Record<string, string>;
	intendedStartYear?: number;
	workExperienceYears?: number;
}

export interface PreferencesResponse {
	userId: string;
	fieldOfInterest?: string[];
	preferredRegions?: string[];
	intendedStartTerm?: string;
	budgetLabel?: string;
	journeyType?: string;
	programType?: string;
	campusSetting?: string;
	interests?: string[];
}

export interface UserMeResponse {

	userId: string;
	email: string;
	emailVerified?: boolean;
	createdAt?: string;

	fullName?: string;
	currentEducationLevel?: string;
	targetDegree?: string;
	gpa?: number;
	gpaScale?: number;
	testScores?: Record<string, string>;
	workExperienceYears?: number;
	profileCompletion?: number;

	fieldOfInterest?: string[];
	preferredRegions?: string[];
	intendedStartTerm?: string;
	budgetLabel?: string;
	journeyType?: string;
	programType?: string;
	campusSetting?: string;
	interests?: string[];
}

export interface UpdatePreferencesRequest {
	fieldOfInterest?: string[];
	preferredRegions?: string[];
	intendedStartTerm?: string;
	budgetLabel?: string;
	journeyType?: string;
	programType?: string;
	campusSetting?: string;
	interests?: string[];
}





export interface UpdateOnboardingRequest {
	fullName?: string;
	currentLevel?: "high_school" | "undergrad" | "graduate" | "working";
	targetDegree?: "bachelors" | "masters" | "mba" | "phd";
	targetRegions?: string[];
	budgetRange?: string;
	targetFields?: string[];
	targetIntake?: string;
	direction?: "exploring" | "has_target";
}

export interface OnboardingDataResponse {
	completedSteps: number;
	isComplete: boolean;
}

export interface OnboardingStatusResponse {
	currentStep: number;
	completed: boolean;
	data?: Record<string, unknown>;
}

export interface OnboardingResponse {
	currentStep: number;
	nextStep: number;
	completed: boolean;
	redirectTo?: string;
	message?: string;
}





export interface ProgramListParams {
	search?: string;
	majors?: string;
	countries?: string;
	regions?: string;
	degree_types?: string;
	tuition_max?: number;
	ielts_max?: number;
	scholarship_only?: boolean;
	deadline_within?: number;
	sort?:
		| "fit_score"
		| "ranking_qs"
		| "tuition_asc"
		| "tuition_desc"
		| "deadline";
	sort_dir?: "asc" | "desc";
	page?: number;
	size?: number;
}

export interface PaginationResponse {
	page: number;
	size: number;
	total: number;
	totalPages: number;
}

export interface ProgramListItemResponse {
	id: string;
	universityId?: string;
	universityName: string;
	universityCountry?: string;
	universityCity?: string;
	universityLogoUrl?: string;
	programName: string;
	displayName?: string;
	degreeType: string;
	degreeName?: string;
	majorCategories: string[];
	durationMonths?: number;
	deliveryMode?: string;
	tuitionAnnualUsd?: number;
	scholarshipAvailable?: boolean;
	ieltsMinimum?: number;
	toeflMinimum?: number;
	nextDeadline?: string;
	nextIntake?: string;
	fitScore?: number;
	fitCategory?: "reach" | "target" | "safety";
	fitReasons?: string[];
	fitGaps?: string[];
	isSaved?: boolean;
	rankingQsDisplay?: string;
}

export interface ProgramListResponse {
	data: ProgramListItemResponse[];
	pagination: PaginationResponse;
	appliedFilters?: Record<string, unknown>;
}

export interface TuitionResponse {
	annualUsd?: number;
	totalUsd?: number;
	notes?: string;
}

export interface RequirementsResponse {
	gpaMinimum?: number;
	gpaScale?: number;
	ieltsMinimum?: number;
	toeflMinimum?: number;
	greRequired?: boolean;
	gmatRequired?: boolean;
	workExperienceYears?: number;
	documents?: string[];
	notes?: string;
}

export interface ProgramIntakeResponse {
	id: string;
	season: string;
	seasonDisplay: string;
	applicationStartDate?: string;
	applicationDeadline?: string;
	earlyDeadline?: string;
	startDate?: string;
	isActive: boolean;
}

export interface ProgramDetailResponse extends ProgramListItemResponse {
	universityWebsiteUrl?: string;
	universityDescription?: string;
	rankingTimesDisplay?: string;
	rankingNational?: number;
	language?: string;
	programDescription?: string;
	programUrl?: string;
	admissionsUrl?: string;
	tuition?: TuitionResponse;
	applicationFeeUsd?: number;
	requirements?: RequirementsResponse;
	intakes?: ProgramIntakeResponse[];
}

export interface FilterOption {
	value: string;
	label: string;
	count: number;
}

export interface RangeOption {
	min: number;
	max: number;
	currency?: string;
}

export interface FilterOptionsResponse {
	majors: FilterOption[];
	countries: FilterOption[];
	regions: FilterOption[];
	degreeTypes: FilterOption[];
	tuitionRange?: RangeOption;
	ieltsRange?: RangeOption;
}

export interface AiMatchResponse {
	reach: ProgramListItemResponse[];
	target: ProgramListItemResponse[];
	safety: ProgramListItemResponse[];
	recommendation?: string;
	profileCompleteness?: number;
	missingFields?: string[];
	totalMatched: number;
}

export interface SaveProgramResponse {
	success: boolean;
	message: string;
	savedCount: number;
}





export interface CreateApplicationRequest {
	programId: string;
	intakeId?: string;
}

export interface CreateApplicationResponse {
	id: string;
	message: string;
}

export interface UpdateApplicationRequest {
	status?: "planning" | "writing" | "submitted";
}

export interface UpdateApplicationResponse {
	id: string;
	status: string;
	updatedAt: string;
}

export interface DeleteApplicationResponse {
	success: boolean;
	message: string;
}

export interface ProgramSummaryDto {
	id: string;
	universityName: string;
	programName: string;
	degreeName: string;
	nextDeadline?: string;
	nextIntake?: string;
}

export interface GapDto {
	field: string;
	message: string;
	severity: string;
}

export interface ApplicationResponse {
	id: string;
	program: ProgramSummaryDto;
	status: string;
	fitScore?: number;
	fitCategory?: string;
	gaps?: GapDto[];
	sopStatus?: string;
	createdAt: string;
	updatedAt: string;
}

export interface ApplicationSummaryDto {
	total: number;
	byStatus: Record<string, number>;
	byCategory: Record<string, number>;
}

export interface UpcomingDeadlineDto {
	applicationId: string;
	programName: string;
	deadline: string;
	daysRemaining: number;
}

export interface ApplicationListResponse {
	applications: ApplicationResponse[];
	summary: ApplicationSummaryDto;
	upcomingDeadlines: UpcomingDeadlineDto[];
}


export interface SaveSopRequest {
	content: string;
	wordLimit?: number;
	prompt?: string;
}

export interface SaveSopResponse {
	id: string;
	wordCount: number;
	updatedAt: string;
}

export interface ImprovementDto {
	point: string;
	suggestion: string;
}

export interface SopFeedbackDto {
	round: number;
	strengths: string[];
	improvements: ImprovementDto[];
	personaSuggestion?: string;
	structureNote?: string;
	generatedAt: string;
}

export interface ApplicationSopResponse {
	id: string;
	applicationId: string;
	wordLimit?: number;
	prompt?: string;
	content?: string;
	wordCount?: number;
	feedbackRound?: number;
	lastFeedback?: SopFeedbackDto;
	updatedAt: string;
}


export interface SchoolGapDto {
	applicationId: string;
	programName: string;
	gaps: GapDto[];
}

export interface CommonGapDto {
	field: string;
	count: number;
	message: string;
}

export interface EvaluationResponse {
	schoolGaps: SchoolGapDto[];
	commonGaps: CommonGapDto[];
	suggestions?: string;
	profileCompleteness?: number;
	missingFields?: string[];
}





export type TrackType =
	| "FUTURE_VISION"
	| "ACADEMIC_JOURNEY"
	| "ACTIVITIES_IMPACT"
	| "VALUES_TURNING_POINTS";


export interface TrackStartResponse {
	track: string;
	displayName: string;
	description: string;
	status: string;
	progress: number;
	openingMessage: string;
	coreQuestions: string[];
	resuming: boolean;
}

export interface ConversationRequest {
	message: string;
}

export interface ConversationResponse {
	userMessage: string;
	assistantMessage: string;
	responseType: string;
	currentProgress: number;
	trackComplete: boolean;
}

export interface TrackDetailResponse {
	track: string;
	displayName: string;
	description: string;
	status: string;
	progress: number;
	layers: Record<string, unknown>;
	coreQuestions: string[];
	recentMessages: Record<string, unknown>[];
}

export interface TrackSummary {
	status: string;
	progress: number;
	displayName: string;
	description: string;
}

export interface PersonaResponse {
	archetype: Record<string, unknown>;
	tracks: Record<string, TrackSummary>;
	lastActiveTrack: string;
}


export interface TrackDto {
	id: string;
	displayName: string;
	description: string;
	icon: string;
	status: string;
	completedAt?: string;
}

export interface ArchetypeDto {
	type: string;
	personalizedSummary: string;
	revealedAt?: string;
}

export interface ArchetypeReveal {
	type: string;
	personalizedSummary: string;
}

export interface CanvasNodeDto {
	id: string;
	type: string;
	title: string;
	content: string;
	sourceTrackId?: string;
	createdAt?: string;
	archetypeType?: string;
	personalizedSummary?: string;
}

export interface TrackActionDto {
	trackId: string;
	displayName: string;
	icon: string;
	status: string;
}

export interface CanvasActionDto {
	action: string;
	node?: CanvasNodeDto;
	nodeId?: string;
	archetype?: ArchetypeReveal;
}

export interface ChatMessageDto {
	id: string;
	role: string;
	content: string;
	type?: string;
	timestamp?: string;
	actions?: TrackActionDto[];
	canvasActions?: CanvasActionDto[];
	trackId?: string;
}

export interface PersonaStateResponse {
	userId: string;
	tracks: Record<string, TrackDto>;
	nodes: CanvasNodeDto[];
	archetype?: ArchetypeDto;
	conversationHistory: ChatMessageDto[];
	currentTrackId?: string;
	createdAt?: string;
	updatedAt?: string;
}


export interface TrackSelectRequest {
	trackId: string;
}

export interface TrackSelectResponse {
	message: ChatMessageDto;
	trackStatus: string;
	currentTrackId?: string;
}

export interface BackToTrackResponse {
	message: ChatMessageDto;
	currentTrackId?: string;
}

export interface RedoTrackResponse {
	message: ChatMessageDto;
	trackStatus: string;
	currentTrackId?: string;
	removedNodeIds?: string[];
}


export interface MessageRequest {
	content: string;
}

export interface ConversationState {
	coreQuestionIndex: number;
	followUpIndex: number;
	totalCoreQuestions: number;
}

export interface MessageResponse {
	message: ChatMessageDto;
	conversationState?: ConversationState;
	trackStatus: string;
	currentTrackId?: string;
	allTracksComplete?: boolean;
}


export interface SynthesisResponse {
	track: string;
	layers: Record<string, unknown>;
	success: boolean;
	message: string;
	nodeCount?: number;
}

export interface ArchetypeResponse {
	archetype: Record<string, unknown>;
	success: boolean;
	message: string;
	completedTracks: number;
	isComplete?: boolean;
}





export interface DiscoveryProgressDto {
	completedTracks: number;
	totalTracks: number;
	archetypeRevealed: boolean;
}

export interface SuggestedActionDto {
	type: string;
	title: string;
	description: string;
	link: string;
}

export interface RecentApplicationDto {
	id: string;
	universityName: string;
	programName: string;
	status: string;
	fitScore?: number;
}

export interface HomeResponse {
	firstName: string;
	profileCompletion: number;
	journeyType?: string;
	discovery: DiscoveryProgressDto;
	applications: ApplicationSummaryDto;
	recentApplications: RecentApplicationDto[];
	upcomingDeadlines: UpcomingDeadlineDto[];
	suggestedAction: SuggestedActionDto;
}
````

## File: messages/vi.json
````json
{
	"nav": {
		"home": "Trang chủ",
		"features": "Tính năng",
		"about": "Về chúng mình",
		"explore": "Khám phá",
		"applications": "Hồ sơ",
		"personaLab": "Persona Lab",
		"login": "Đăng nhập",
		"getStarted": "Bắt đầu",
		"profile": "Tài khoản",
		"logout": "Đăng xuất",
		"goToDashboard": "Đến trang Quản lý"
	},
	"onboarding": {
		"steps": {
			"basicInfo": "Thông tin cơ bản",
			"preferences": "Mong muốn",
			"plan": "Kế hoạch",
			"journey": "Chọn hướng đi",
			"complete": "Hoàn thành"
		},
		"step1": {
			"title": "Thông tin cơ bản",
			"subtitle": "Chúng mình cần biết một chút về bạn để bắt đầu",
			"educationLevel": "Trình độ hiện tại",
			"educationLevelRequired": "*",
			"targetDegree": "Chương trình tìm kiếm",
			"targetDegreeRequired": "*",
			"levels": {
				"highSchool": "Trung học phổ thông",
				"undergraduate": "Đang học đại học",
				"graduate": "Cử nhân",
				"working": "Đang đi làm"
			},
			"programs": {
				"bachelors": "Cử nhân",
				"masters": "Thạc sĩ",
				"mba": "MBA",
				"phd": "Tiến sĩ"
			}
		},
		"step2": {
			"title": "Mong muốn của bạn",
			"subtitle": "Giúp Leaply hiểu rõ hơn về nhu cầu du học của bạn",
			"fieldsOfInterest": "Lĩnh vực quan tâm",
			"fieldsOfInterestMax": "(Tối đa 3)",
			"fieldsRequired": "*",
			"regionsOfInterest": "Khu vực quan tâm",
			"regionsOptional": "(Có thể bỏ qua)",
			"timeline": "Thời gian nhập học",
			"timelineRequired": "*",
			"selectYear": "Thời gian nhập học dự kiến?",
			"selectYearPlaceholder": "Chọn năm",
			"selectTerm": "Kỳ học",
			"selectTermPlaceholder": "Chọn kỳ",
			"budget": "Ngân sách dự kiến",
			"budgetRequired": "*",
			"fields": {
				"cs": "Khoa học máy tính / IT",
				"business": "Kinh doanh / Quản trị",
				"finance": "Kinh tế / Tài chính",
				"engineering": "Khoa học kỹ thuật",
				"dataScience": "Khoa học Dữ liệu / Phân tích",
				"design": "Thiết kế (UX/UI, Công nghiệp)",
				"health": "Y tế cộng đồng / Y tế",
				"other": "Khác / Chưa xác định"
			},
			"regions": {
				"eastAsia": "Đông Á",
				"eastAsiaCountries": "Trung Quốc, Hàn Quốc, Nhật Bản, Đài Loan, Hồng Kông",
				"southeastAsia": "Đông Nam Á",
				"southeastAsiaCountries": "Singapore, Malaysia, Thái Lan",
				"westernEurope": "Tây Âu",
				"westernEuropeCountries": "Anh, Pháp, Đức, Hà Lan",
				"northernEurope": "Bắc Âu",
				"northernEuropeCountries": "Thụy Điển, Đan Mạch, Phần Lan",
				"northAmerica": "Bắc Mỹ",
				"northAmericaCountries": "Hoa Kỳ, Canada",
				"oceania": "Châu Đại Dương",
				"oceaniaCountries": "Úc, New Zealand"
			},
			"budgetOptions": {
				"low": "<500 triệu",
				"medium": "500 triệu - 1 tỷ",
				"high": ">1 tỷ",
				"scholarship": "Cần học bổng full"
			},
			"terms": {
				"spring": "Kỳ xuân",
				"summer": "Kỳ hè",
				"fall": "Kỳ thu",
				"winter": "Kỳ đông"
			}
		},
		"step2b": {
			"title": "Kế hoạch của bạn",
			"subtitle": "Hãy nói về thời gian và ngân sách dự kiến",
			"timeline": "Thời gian nhập học",
			"timelineRequired": "*",
			"selectYear": "Thời gian nhập học dự kiến?",
			"selectYearPlaceholder": "Chọn năm",
			"selectTerm": "Kỳ học",
			"selectTermPlaceholder": "Chọn kỳ",
			"budget": "Ngân sách dự kiến",
			"budgetRequired": "*",
			"budgetOptions": {
				"low": "<500 triệu",
				"medium": "500 triệu - 1 tỷ",
				"high": ">1 tỷ",
				"scholarship": "Cần học bổng full"
			},
			"terms": {
				"spring": "Kỳ xuân",
				"summer": "Kỳ hè",
				"fall": "Kỳ thu",
				"winter": "Kỳ đông"
			}
		},
		"step3": {
			"title": "Chọn hướng đi của bạn",
			"subtitle": "Bạn đang ở giai đoạn nào của quá trình du học?",
			"exploring": {
				"title": "Tôi đang khám phá",
				"description": "Chưa chắc chắn, muốn tìm hiểu thêm"
			},
			"targeted": {
				"title": "Tôi đã có mục tiêu",
				"description": "Đã biết trường/ngành muốn apply"
			},
			"startNow": "Chọn hướng này"
		},
		"step4": {
			"title": "Chúc mừng bạn!",
			"subtitle": "Bạn đã sẵn sàng để bắt đầu hành trình.",
			"ctaExploring": "Bắt đầu khám phá bản thân",
			"ctaTargeted": "Khám phá danh sách chương trình"
		},
		"buttons": {
			"back": "Quay lại",
			"continue": "Tiếp tục"
		}
	},
	"landing": {
		"badge": "Người bạn đồng hành du học của bạn",
		"heroTitle": "Du học thật đơn giản",
		"heroTitleHighlight": "cùng Leaply",
		"heroSubtitle": "Không còn hoang mang. Không còn áp lực. Chỉ có bạn, ước mơ của bạn, và con đường rõ ràng phía trước.",
		"ctaStart": "Bắt đầu ngay — miễn phí",
		"ctaLearnMore": "Xem cách hoạt động",
		"statsStudents": "Bạn trẻ tin dùng",
		"statsUniversities": "Trường đại học",
		"statsCountries": "Quốc gia",
		"universitiesTitle": "Trường trong mơ? Chúng mình có hết",
		"universitiesSubtitle": "Từ Ivy League đến những viên ngọc ẩn — khám phá trường phù hợp với bạn",
		"featuresTitle": "Tất cả những gì bạn cần",
		"featuresTitleSuffix": "ở một nơi",
		"featuresSubtitle": "Chúng mình hiểu cảm giác đó. Du học có thể rất choáng ngợp. Đó là lý do chúng mình tạo ra những công cụ thực sự hữu ích.",
		"learnMore": "Tìm hiểu thêm",
		"feature1Title": "Tìm trường hợp gu",
		"feature1Desc": "Duyệt qua 1,500+ trường. Lọc theo những gì quan trọng với bạn — ngân sách, địa điểm, ngành học. Trường phù hợp đang chờ bạn.",
		"feature2Title": "Gợi ý thông minh",
		"feature2Desc": "Kể cho chúng mình nghe về bạn, AI sẽ gợi ý những trường thực sự phù hợp. Không còn phải đoán mò.",
		"feature3Title": "Không lỡ deadline",
		"feature3Desc": "Deadline, giấy tờ, yêu cầu — mình theo dõi hết để bạn không phải lo. Mọi thứ gọn gàng một chỗ.",
		"feature4Title": "Persona Lab",
		"feature4Desc": "Khám phá điều làm bạn đặc biệt. Viết essay mang đậm dấu ấn cá nhân. Mentor AI luôn sẵn sàng 24/7.",
		"howItWorksTitle": "Cách Leaply hoạt động",
		"howItWorksSubtitle": "Bốn bước. Chỉ vậy thôi để đi từ 'bắt đầu từ đâu?' đến 'mình làm được!'",
		"step1Title": "Kể về bản thân",
		"step1Quote": "Mình không biết bắt đầu từ đâu luôn...",
		"step1Desc": "Đừng lo! Chỉ cần trả lời vài câu hỏi về bản thân, sở thích và ước mơ của bạn. Chúng mình sẽ lo phần còn lại.",
		"step2Title": "Nhận gợi ý phù hợp",
		"step2Quote": "Có QUÁ nhiều trường... trường nào mới phù hợp với mình?",
		"step2Desc": "AI của chúng mình phân tích và tìm ra những trường phù hợp với profile, ngân sách và mục tiêu của bạn. Mỗi gợi ý đều có điểm match và insights thực tế.",
		"step3Title": "Apply không stress",
		"step3Quote": "Làm sao nhớ hết mấy cái deadline này?!",
		"step3Desc": "Chúng mình hỗ trợ bạn. Nhắc deadline, checklist giấy tờ, theo dõi tiến độ — tất cả một chỗ. Không còn hỗn loạn Excel.",
		"step4Title": "Tỏa sáng",
		"step4Quote": "Essay của mình nghe... nhàm quá. Làm sao để nổi bật?",
		"step4Desc": "Câu chuyện của bạn là độc nhất — hãy để nó tỏa sáng. Mentor AI giúp bạn viết essay chính là BẠN. Loại essay mà admission sẽ nhớ mãi.",
		"ctaFree": "Hoàn toàn miễn phí",
		"ctaTitle": "Hành trình của bạn bắt đầu từ đây",
		"ctaSubtitle": "Hàng ngàn bạn trẻ đã bắt đầu hành trình. Bạn sẵn sàng chưa?",
		"ctaCreateAccount": "Tạo tài khoản miễn phí",
		"alreadyHaveAccount": "Đã có tài khoản?"
	},
	"features": {
		"heroTitle": "Công cụ thực sự",
		"heroTitleHighlight": "tạo nên khác biệt",
		"heroSubtitle": "Chúng mình tạo ra Leaply vì ước gì có thứ này khi chúng mình apply. Giờ thì có rồi.",
		"exploreTitle": "Khám phá",
		"exploreTagline": "Trường trong mơ đang chờ bạn. Cùng tìm nhé.",
		"exploreDesc": "1,500+ trường đại học trong tầm tay. Tìm kiếm, lọc, so sánh — và để AI gợi ý những trường bạn chưa từng nghĩ đến.",
		"exploreBenefit1Title": "Tìm theo cách của bạn",
		"exploreBenefit1Desc": "Ngân sách eo hẹp? Thích thời tiết đẹp? Cần ngành IT mạnh? Lọc theo những gì quan trọng với bạn",
		"exploreBenefit2Title": "AI hiểu bạn",
		"exploreBenefit2Desc": "AI học từ sở thích của bạn và tìm trường thực sự phù hợp — không phải gợi ý ngẫu nhiên",
		"exploreBenefit3Title": "So sánh trực quan",
		"exploreBenefit3Desc": "Đặt những lựa chọn hàng đầu cạnh nhau. Xem học phí, xếp hạng, yêu cầu — tất cả trong một màn hình",
		"applicationsTitle": "Hồ sơ",
		"applicationsTagline": "Tạm biệt Excel hỗn loạn. Xin chào sự yên tâm.",
		"applicationsDesc": "Nhiều trường, hàng tá deadline, vô số giấy tờ. Quen quá phải không? Chúng mình sắp xếp mọi thứ để bạn tập trung vào điều quan trọng — hồ sơ của bạn.",
		"applicationsBenefit1Title": "Nhìn tất cả một lần",
		"applicationsBenefit1Desc": "Một dashboard. Tất cả hồ sơ. Mọi deadline. Không bất ngờ",
		"applicationsBenefit2Title": "Không bỏ lỡ ngày nào",
		"applicationsBenefit2Desc": "Chúng mình sẽ nhắc bạn trước deadline. Đủ sớm để bạn còn kịp làm gì đó",
		"applicationsBenefit3Title": "Tick từng mục",
		"applicationsBenefit3Desc": "Mỗi trường yêu cầu khác nhau. Chúng mình theo dõi bạn cần gì và đã làm gì",
		"personaLabTitle": "Persona Lab",
		"personaLabTagline": "Câu chuyện của bạn là độc nhất. Hãy để nó tỏa sáng.",
		"personaLabDesc": "Viết essay khó lắm. Chúng mình hiểu. Đó là lý do chúng mình tạo ra không gian để bạn khám phá điều làm bạn là CHÍNH BẠN — và biến nó thành essay mà admission thực sự muốn đọc.",
		"personaLabBenefit1Title": "Hiểu bản thân hơn",
		"personaLabBenefit1Desc": "4 chủ đề hướng dẫn giúp bạn khám phá điểm mạnh, giá trị và câu chuyện mà bạn không ngờ mình có",
		"personaLabBenefit2Title": "Viết tự tin",
		"personaLabBenefit2Desc": "Gợi ý AI nghe như bạn, không phải robot. Chỉnh sửa, hoàn thiện, biến nó thành của bạn",
		"personaLabBenefit3Title": "Nhận phản hồi thật",
		"personaLabBenefit3Desc": "Mentor AI đọc như người thật. Nhận xét cụ thể. Gợi ý hành động được. Không nói suông",
		"additionalTitle": "Và những điều cơ bản làm đúng",
		"additionalSubtitle": "Vì những điều nhỏ cũng quan trọng",
		"benefit1Title": "Dữ liệu được bảo vệ",
		"benefit1Desc": "Chúng mình coi trọng quyền riêng tư. Thông tin của bạn thuộc về bạn",
		"benefit2Title": "Bạn không đơn độc",
		"benefit2Desc": "Kết nối với những người đã trải qua. Alumni, sinh viên hiện tại, bạn bè cùng apply",
		"benefit3Title": "Luôn cập nhật",
		"benefit3Desc": "Yêu cầu thay đổi. Xếp hạng cập nhật. Chúng mình giữ dữ liệu mới nhất để bạn không phải lo",
		"ctaTitle": "Sẵn sàng bắt đầu?",
		"ctaSubtitle": "Tham gia cùng hàng ngàn bạn trẻ đã chọn con đường dễ dàng hơn. Bạn cũng xứng đáng.",
		"startFree": "Bắt đầu miễn phí",
		"aboutUs": "Gặp đội ngũ",
		"startUsing": "Thử ngay"
	},
	"about": {
		"badge": "Câu chuyện của mình",
		"heroTitle": "Chúng mình đã từng ở",
		"heroTitleHighlight": "vị trí của bạn",
		"heroSubtitle": "Chúng mình là một nhóm sinh viên và cựu sinh viên Việt Nam đã tự trải qua quá trình du học. Mình biết nó có thể khó hiểu đến mức nào. Đó là lý do mình tạo ra Leaply.",
		"missionTitle": "Tại sao chúng mình làm điều này",
		"missionText": "Apply du học không nên giống như đi trong mê cung bịt mắt. Chúng mình nhớ những đêm khuya google tìm thông tin, lo lắng về deadline, những essay viết đi viết lại cả trăm lần. Chúng mình xây Leaply để trở thành người bạn mà chúng mình ước gì mình có — một người thực sự hiểu và có thể giúp bạn tìm ra mọi thứ.",
		"value1Title": "Chúng mình quan tâm thật sự",
		"value1Desc": "Đây không chỉ là sản phẩm với chúng mình. Mỗi bạn dùng Leaply là người chúng mình thực sự muốn thấy thành công.",
		"value2Title": "Công nghệ có trái tim",
		"value2Desc": "AI rất mạnh, nhưng chỉ khi phục vụ nhu cầu thực của con người. Chúng mình xây công nghệ thực sự giúp ích, không chỉ để gây ấn tượng.",
		"value3Title": "Xây dựng cho bạn",
		"value3Desc": "Học sinh Việt Nam có những thử thách riêng. Chúng mình xây dựng cho những thử thách đó, không phải cho 'du học sinh' chung chung.",
		"teamTitle": "Những con người đằng sau Leaply",
		"teamSubtitle": "Một đội ngũ nhỏ nhưng mạnh mẽ của những người mơ ước, những người xây dựng, và những cựu applicant từng stress nặng.",
		"contactTitle": "Chào mình nhé!",
		"contactSubtitle": "Có câu hỏi? Góp ý? Hay chỉ muốn nói chuyện? Chúng mình rất muốn nghe từ bạn. Thật đấy, chúng mình đọc từng tin nhắn.",
		"email": "Email",
		"address": "Chúng mình ở đâu",
		"followUs": "Kết nối với mình",
		"formName": "Tên bạn",
		"formNamePlaceholder": "Chúng mình gọi bạn là gì?",
		"formEmail": "Email",
		"formEmailPlaceholder": "Chúng mình liên lạc với bạn ở đâu?",
		"formMessage": "Lời nhắn",
		"formMessagePlaceholder": "Bất cứ điều gì bạn muốn chia sẻ...",
		"formSubmit": "Gửi đi!",
		"formSubmitting": "Đang gửi...",
		"formThankYou": "Nhận được rồi! 🎉",
		"formSuccess": "Cảm ơn bạn đã liên hệ! Chúng mình sẽ phản hồi sớm nhé.",
		"formSendAnother": "Gửi tin khác",
		"ctaTitle": "Sẵn sàng bắt đầu?",
		"ctaSubtitle": "Trường trong mơ đang chờ bạn. Cùng biến nó thành hiện thực nhé.",
		"ctaButton": "Bắt đầu miễn phí"
	},
	"dashboard": {
		"title": "Tổng quan",
		"subtitle": "Chào mừng trở lại! Đây là tiến độ hồ sơ của bạn.",
		"stats": {
			"savedUniversities": "Trường đã lưu",
			"savedUniversitiesDesc": "Trường trong danh sách",
			"activeApplications": "Hồ sơ đang xử lý",
			"activeApplicationsDesc": "Đang xử lý hoặc đã nộp",
			"pendingTasks": "Công việc chờ xử lý",
			"pendingTasksDesc": "Công việc cần hoàn thành",
			"resources": "Tài nguyên",
			"resourcesDesc": "Hướng dẫn và bài viết"
		},
		"recentApplications": "Hồ sơ gần đây",
		"viewAll": "Xem tất cả",
		"seeAll": "Xem tất cả",
		"noApplications": "Chưa có hồ sơ nào",
		"browseUniversities": "Duyệt trường",
		"upcomingTasks": "Công việc sắp tới",
		"allCaughtUp": "Đã hoàn thành hết!",
		"quickActions": "Hành động nhanh",
		"exploreUniversities": "Khám phá trường",
		"askAIAssistant": "Hỏi trợ lý AI",
		"browseResources": "Xem tài nguyên",
		"share": "Chia sẻ",
		"addApplication": "+ Thêm hồ sơ",
		"applications": "Hồ sơ",
		"submitted": "Đã nộp",
		"inProgress": "Đang tiến hành",
		"myApplications": "Hồ sơ của tôi",
		"thisWeek": "Tuần này",
		"application": "Hồ sơ",
		"program": "Chương trình",
		"status": "Trạng thái",
		"schedule": "Lịch trình",
		"notes": "Ghi chú",
		"markComplete": "Đánh dấu hoàn thành"
	},
	"applications": {
		"title": "Hồ sơ",
		"newApplication": "Hồ sơ mới",
		"searchUniversities": "Tìm kiếm trường...",
		"noApplicationsFound": "Không tìm thấy hồ sơ",
		"noApplicationsYet": "Chưa có hồ sơ nào",
		"explorePrograms": "Khám phá chương trình",
		"backToApplications": "Quay lại danh sách",
		"noApplicationSelected": "Chưa chọn hồ sơ",
		"selectApplication": "Chọn một hồ sơ từ thanh bên để xem chi tiết",
		"gapsToAddress": "điểm cần cải thiện",
		"gapsDescription": "Đây là những điểm hồ sơ của bạn chưa đáp ứng yêu cầu chương trình",
		"fitScore": "Điểm phù hợp",
		"sopStatus": "Trạng thái SOP",
		"notStarted": "Chưa bắt đầu",
		"noDeadline": "Chưa có deadline",
		"intakeInfo": "Thông tin kỳ nhập học",
		"nextIntake": "Kỳ nhập học tiếp theo",
		"viewProgramDetails": "Xem chi tiết chương trình",
		"actions": "Hành động",
		"startSop": "Bắt đầu viết SOP",
		"continueSop": "Tiếp tục viết SOP",
		"viewProgram": "Xem chương trình",
		"removeApplication": "Xóa",
		"confirmRemove": "Xóa hồ sơ?",
		"confirmRemoveDescription": "Bạn có chắc muốn xóa {program} tại {university} khỏi danh sách hồ sơ? Hành động này không thể hoàn tác.",
		"cancel": "Hủy",
		"remove": "Xóa",
		"removing": "Đang xóa...",
		"addedOn": "Thêm vào",
		"lastUpdated": "Cập nhật lần cuối",
		"status": {
			"label": "Trạng thái",
			"draft": "Nháp",
			"planning": "Lập kế hoạch",
			"writing": "Đang viết",
			"submitted": "Đã nộp",
			"under_review": "Đang xét duyệt",
			"accepted": "Đã chấp nhận",
			"waitlisted": "Danh sách chờ",
			"rejected": "Bị từ chối"
		},
		"submitted": "Đã nộp",
		"decisionBy": "Quyết định trước",
		"viewApplication": "Xem hồ sơ",
		"progress": "Tiến độ",
		"match": "Phù hợp",
		"applicationStatus": "Trạng thái hồ sơ",
		"trackProgress": "Theo dõi tiến độ hồ sơ và các chỉ số quan trọng",
		"completion": "Hoàn thành",
		"documents": "Tài liệu",
		"uploaded": "đã tải lên",
		"tasks": "Công việc",
		"completed": "hoàn thành",
		"deadlines": "Deadline",
		"upcoming": "sắp tới",
		"currentStatus": "Trạng thái hiện tại",
		"notYetSubmitted": "Chưa nộp",
		"nextDeadline": "Deadline tiếp theo",
		"daysRemaining": "ngày còn lại",
		"noPendingDeadlines": "✓ Không có deadline",
		"decisionExpectedBy": "Dự kiến có kết quả:",
		"applicationComplete": "✓ Hồ sơ hoàn tất!",
		"remainingToComplete": "còn lại cần hoàn thành",
		"profileEvaluation": "Đánh giá hồ sơ",
		"yourFitForProgram": "Độ phù hợp với chương trình",
		"overallFitScore": "Điểm phù hợp",
		"strengths": "Điểm mạnh",
		"yourStrengths": "Điểm mạnh của bạn",
		"areasToConsider": "Điểm cần xem xét",
		"viewDetailedAnalysis": "Xem phân tích chi tiết",
		"profileEvaluationDetails": "Chi tiết đánh giá hồ sơ",
		"comprehensiveAnalysis": "Phân tích toàn diện độ phù hợp cho",
		"schoolInformation": "Thông tin trường",
		"keyDetails": "Thông tin chính về trường",
		"location": "Địa điểm",
		"worldRanking": "Xếp hạng thế giới",
		"tuitionRange": "Học phí",
		"program": "Chương trình",
		"viewUniversityDetails": "Xem chi tiết trường",
		"nextActions": "Hành động tiếp theo",
		"tasksToComplete": "Công việc cần hoàn thành cho hồ sơ này",
		"noTasksToComplete": "Không có công việc",
		"due": "Hạn",
		"urgent": "Khẩn cấp",
		"high": "cao",
		"medium": "trung bình",
		"low": "thấp",
		"taskCompleted": "công việc hoàn thành",
		"helpfulResources": "Tài nguyên hữu ích",
		"guidesAndTools": "Hướng dẫn và công cụ để cải thiện hồ sơ",
		"essayWritingGuide": "Hướng dẫn viết essay",
		"tipsForStatements": "Mẹo viết bài luận ấn tượng",
		"learnEffectiveStatements": "Học cách viết bài luận cá nhân hiệu quả",
		"interviewPreparation": "Chuẩn bị phỏng vấn",
		"commonQuestions": "Câu hỏi thường gặp",
		"prepareForInterviews": "Chuẩn bị cho phỏng vấn",
		"scholarshipFinder": "Tìm học bổng",
		"findFunding": "Tìm cơ hội tài trợ",
		"discoverScholarships": "Khám phá học bổng có sẵn",
		"askAIAssistant": "Hỏi trợ lý AI",
		"getPersonalizedAdvice": "Nhận tư vấn cá nhân hóa",
		"chatWithAI": "Trò chuyện với AI về hồ sơ này"
	},
	"tasks": {
		"title": "Công việc",
		"subtitle": "Quản lý công việc và deadline của bạn",
		"addTask": "Thêm công việc",
		"show": "Hiển thị:",
		"allTasks": "Tất cả",
		"pending": "Chờ xử lý",
		"completed": "Hoàn thành",
		"sortBy": "Sắp xếp theo:",
		"dueDate": "Hạn chót",
		"priority": "Độ ưu tiên",
		"task": "công việc",
		"taskPlural": "công việc",
		"noTasksFound": "Không tìm thấy công việc",
		"noCompletedTasks": "Chưa có công việc nào hoàn thành.",
		"noPendingTasks": "Đã xong hết! Không có công việc chờ xử lý.",
		"startByAdding": "Bắt đầu bằng cách thêm công việc đầu tiên.",
		"addYourFirstTask": "Thêm công việc đầu tiên"
	},
	"resources": {
		"title": "Tài nguyên",
		"subtitle": "Hướng dẫn, bài viết và công cụ giúp bạn thành công trong hồ sơ",
		"searchResources": "Tìm tài nguyên...",
		"allCategories": "Tất cả danh mục",
		"resource": "tài nguyên",
		"resourcePlural": "tài nguyên",
		"found": "tìm thấy",
		"noResourcesFound": "Không tìm thấy tài nguyên",
		"tryAdjustingFilters": "Thử điều chỉnh tìm kiếm hoặc bộ lọc"
	},
	"profile": {
		"title": "Tài khoản",
		"subtitle": "Quản lý thông tin cá nhân và cài đặt",
		"personalInformation": "Thông tin cá nhân",
		"editProfile": "Chỉnh sửa",
		"cancel": "Hủy",
		"saveChanges": "Lưu thay đổi",
		"saving": "Đang lưu...",
		"fullName": "Họ và tên",
		"fullNamePlaceholder": "Nhập họ và tên",
		"email": "Email",
		"emailVerified": "Đã xác thực",
		"emailNotVerified": "Chưa xác thực",
		"dateOfBirth": "Ngày sinh",
		"nationality": "Quốc tịch",
		"selectNationality": "Chọn quốc tịch",
		"educationLevel": "Trình độ học vấn",
		"selectLevel": "Chọn trình độ",
		"highSchool": "Trung học phổ thông",
		"undergraduate": "Đại học",
		"graduate": "Sau đại học",
		"working": "Đang đi làm",
		"targetDegree": "Bằng cấp mục tiêu",
		"bachelors": "Cử nhân",
		"masters": "Thạc sĩ",
		"mba": "MBA",
		"phd": "Tiến sĩ",
		"gpa": "GPA",
		"gpaScale": "Thang điểm GPA",
		"notSet": "Chưa đặt",
		"workExperience": "Kinh nghiệm làm việc",
		"years": "năm",
		"testScores": "Điểm thi",
		"noTestScores": "Chưa có điểm thi",
		"addTestScore": "Thêm điểm thi",
		"editTestScores": "Sửa điểm",
		"preferences": "Sở thích",
		"fieldsOfInterest": "Lĩnh vực quan tâm",
		"preferredRegions": "Khu vực ưa thích",
		"intendedStartTerm": "Thời gian dự định",
		"budgetRange": "Ngân sách",
		"journeyType": "Loại hành trình",
		"exploring": "Đang khám phá",
		"targeted": "Có mục tiêu",
		"programType": "Loại chương trình",
		"campusSetting": "Môi trường học",
		"urban": "Thành thị",
		"suburban": "Ngoại ô",
		"rural": "Nông thôn",
		"interests": "Sở thích",
		"accountSecurity": "Tài khoản & Bảo mật",
		"memberSince": "Thành viên từ",
		"resetPassword": "Đặt lại mật khẩu",
		"resetPasswordDesc": "Gửi liên kết đặt lại mật khẩu đến email của bạn",
		"resetPasswordSent": "Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư.",
		"resetPasswordError": "Gửi email thất bại. Vui lòng thử lại.",
		"verifyNow": "Xác thực ngay",
		"verificationSent": "Email xác thực đã được gửi! Vui lòng kiểm tra hộp thư.",
		"verificationError": "Gửi email xác thực thất bại. Vui lòng thử lại.",
		"profileCompletion": "Hoàn thiện hồ sơ",
		"completeProfile": "Hoàn thiện hồ sơ để nhận được gợi ý tốt hơn",
		"updateSuccess": "Cập nhật hồ sơ thành công",
		"updateError": "Cập nhật hồ sơ thất bại",
		"noData": "Chưa đặt",
		"unitedStates": "Hoa Kỳ",
		"unitedKingdom": "Vương quốc Anh",
		"canada": "Canada",
		"australia": "Úc",
		"india": "Ấn Độ",
		"china": "Trung Quốc",
		"other": "Khác"
	},
	"explore": {
		"title": "Tìm trường phù hợp với bạn",
		"aiMatch": "AI gợi ý",
		"match": "Phù hợp",
		"why": "Tại sao?",
		"whySchool": "Tại sao trường này?",
		"whySchoolDesc": "Đây là lý do chúng tôi nghĩ trường này có thể phù hợp với bạn",
		"basedOnProfile": "Dựa trên hồ sơ và sở thích của bạn",
		"matchReasons": "Lý do phù hợp",
		"completeProfileForReasons": "Hoàn thiện hồ sơ để xem lý do phù hợp cá nhân!",
		"viewDetails": "Xem chi tiết",
		"askAI": "Hỏi AI",
		"learnMore": "Tìm hiểu thêm",
		"saved": "Đã lưu",
		"addToDreamList": "Thêm vào danh sách",
		"striveForIt": "Cố lên!",
		"askAIAboutSchool": "Hỏi AI về trường này",
		"acceptance": "tỷ lệ chấp nhận",
		"public": "Công lập",
		"private": "Tư thục",
		"perYear": "/năm",
		"subtitle": "Gợi ý cá nhân hóa hoặc khám phá 1000+ trường trên thế giới",
		"searchPlaceholder": "Tìm trường, chương trình, hoặc quốc gia...",
		"exploreAll": "Khám phá tất cả",
		"basedOnProfileFound": "Dựa trên hồ sơ của bạn, chúng mình tìm được",
		"universitiesFit": "trường có thể rất phù hợp với bạn",
		"completeProfileForRecommendations": "Hoàn thiện hồ sơ để xem gợi ý AI cá nhân hóa",
		"noMatchesFound": "Không tìm thấy kết quả",
		"completeProfile": "Hoàn thiện hồ sơ",
		"tryAdjusting": "Thử điều chỉnh tìm kiếm hoặc sở thích để xem thêm kết quả",
		"completeProfileToSeeMatches": "Hoàn thiện hồ sơ và sở thích để xem gợi ý trường phù hợp",
		"completeProfileButton": "Hoàn thiện hồ sơ",
		"allUniversities": "Tất cả các trường",
		"showing": "Hiển thị",
		"results": "kết quả",
		"noUniversitiesFound": "Không tìm thấy trường nào",
		"tryAdjustingFilters": "Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm"
	},
	"personaLab": {
		"title": "Persona Lab",
		"subtitle": "Khám phá bản thân và chuẩn bị essay",
		"canvasTitle": "Persona Canvas",
		"canvasSubtitle": "Câu chuyện của bạn được trực quan hóa",
		"viewCanvas": "Canvas",
		"viewList": "Danh sách",
		"discoveryChat": "Trò chuyện khám phá",
		"backToTracks": "Quay lại chọn chủ đề",
		"shareYourStory": "Chia sẻ câu chuyện của bạn...",
		"minCharacters": "Tối thiểu {count} ký tự",
		"moreCharactersNeeded": "Cần thêm {count} ký tự",
		"yourArchetype": "Archetype của bạn",
		"completeAllTracks": "Hoàn thành tất cả tracks để khám phá",
		"discovery": "Khám phá",
		"myPersona": "Hồ sơ của tôi",
		"essays": "Essay",
		"topTrait": "Đặc điểm nổi bật",
		"topTraits": "Đặc điểm nổi bật",
		"personaSummary": "Tóm tắt Persona",
		"academicStats": "Thông tin học thuật",
		"from": "Từ",
		"discoveryWord": "khám phá",
		"highlightedAchievement": "Thành tựu nổi bật",
		"discoveryProgress": "Tiến độ khám phá",
		"tracksCompleted": "Tracks hoàn thành",
		"targetCountries": "Quốc gia mục tiêu",
		"savedSchools": "Trường đã lưu",
		"moreSchools": "trường khác",
		"intendedMajor": "Ngành mong muốn",
		"otherTraits": "Đặc điểm khác",
		"noName": "Chưa có tên",
		"certificates": "Chứng chỉ & Thành tích",
		"discoveryTitle": "Khám phá bản thân",
		"discoverySubtitle": "Hoàn thành các track để Leaply hiểu rõ hơn về câu chuyện của bạn",
		"tracks": "tracks",
		"statusCompleted": "Hoàn thành",
		"statusInProgress": "Đang làm",
		"statusNotStarted": "Chưa bắt đầu",
		"questions": "câu hỏi",
		"backToList": "Quay lại danh sách",
		"question": "Câu",
		"writeAnswer": "Viết câu trả lời của bạn ở đây...",
		"exit": "Thoát",
		"back": "Quay lại",
		"skip": "Bỏ qua",
		"complete": "Hoàn thành",
		"next": "Tiếp theo",
		"whyImportant": "Tại sao điều này quan trọng?",
		"whyImportantDesc": "Các câu hỏi này giúp Leaply hiểu được câu chuyện độc đáo của bạn. Từ đó, chúng tôi có thể gợi ý các góc nhìn hay cho essay và giúp bạn nổi bật trong hồ sơ du học.",
		"myPersonaTitle": "My Persona",
		"myPersonaSubtitle": "Những insights về bạn được Leaply phân tích từ Discovery",
		"retakeQuiz": "Làm lại",
		"personalityTags": "Personality Tags",
		"addTag": "Thêm tag",
		"enterTag": "Nhập tag...",
		"completeDiscoveryForTags": "Hoàn thành Discovery để Leaply tạo personality tags cho bạn",
		"keyStories": "Key Stories",
		"pinned": "Đã ghim",
		"other": "Khác",
		"storiesAppear": "Câu chuyện của bạn sẽ xuất hiện ở đây sau khi hoàn thành Discovery",
		"essayAngles": "Essay Angles",
		"suggested": "Gợi ý",
		"createEssayFromIdea": "Tạo essay từ ý tưởng này",
		"noPersonaData": "Chưa có dữ liệu persona",
		"completeOneTrack": "Hoàn thành ít nhất 1 track trong Discovery để xem persona của bạn. Leaply sẽ phân tích câu trả lời và tạo insights cho bạn.",
		"startDiscovery": "Bắt đầu Discovery",
		"newEssay": "Essay mới",
		"searchEssay": "Tìm essay...",
		"noEssays": "Chưa có essay nào",
		"noEssayFound": "Không tìm thấy essay",
		"total": "Tổng",
		"reviewed": "Reviewed",
		"pending": "Đang chờ",
		"selectEssayToStart": "Chọn essay để bắt đầu",
		"selectFromList": "Chọn một essay từ danh sách bên trái hoặc tạo essay mới",
		"statusDraft": "Bản nháp",
		"statusSubmitted": "Đã gửi",
		"statusReviewed": "Đã review",
		"createNewEssay": "Tạo essay mới",
		"selectSchoolAndType": "Chọn trường và loại essay để bắt đầu viết",
		"university": "Trường đại học",
		"selectSchool": "Chọn trường",
		"essayType": "Loại essay",
		"selectType": "Chọn loại",
		"essayPrompt": "Essay prompt",
		"enterPrompt": "Nhập câu hỏi / prompt của essay...",
		"wordLimit": "Giới hạn từ (không bắt buộc)",
		"selectWordLimit": "Chọn giới hạn từ",
		"eg": "VD",
		"cancel": "Hủy",
		"createEssay": "Tạo essay",
		"prompt": "Prompt",
		"startWriting": "Bắt đầu viết essay của bạn...\n\nTip: Hãy viết theo ý của bạn trước, Leaply sẽ giúp bạn cải thiện sau. Đừng lo lắng về sự hoàn hảo ngay từ đầu.",
		"words": "từ",
		"unsaved": "Chưa lưu",
		"save": "Lưu",
		"saving": "Đang lưu...",
		"submitForReview": "Gửi để review",
		"feedback": "Feedback",
		"feedbackFromMentor": "Góp ý từ Leaply mentor",
		"noFeedback": "Chưa có feedback",
		"submitToGetFeedback": "Gửi essay để nhận góp ý",
		"observation": "Quan sát",
		"recommendation": "Gợi ý",
		"justNow": "Vừa xong",
		"resetData": "Xóa dữ liệu",
		"resetConfirmTitle": "Xóa cuộc trò chuyện?",
		"resetConfirmDescription": "Điều này sẽ xóa toàn bộ dữ liệu cuộc trò chuyện và bắt đầu lại từ đầu. Dữ liệu canvas của bạn sẽ bị mất.",
		"confirmReset": "Đồng ý, xóa",
		"conversationComplete": "Hoàn thành! Persona của bạn đã sẵn sàng.",
		"goToApplications": "Tiếp tục đến Ứng dụng",
		"emptyCanvasTitle": "Persona Canvas",
		"emptyCanvasDesc": "Bắt đầu trò chuyện để xây dựng persona của bạn. Câu chuyện và insight sẽ hiển thị tại đây.",
		"centerPlaceholder": "Tiếp tục trò chuyện để xây dựng hồ sơ"
	},
	"home": {
		"greeting": {
			"morning": "Chào buổi sáng",
			"afternoon": "Chào buổi chiều",
			"evening": "Chào buổi tối"
		},
		"subtitle": "Đây là hành trình của bạn",
		"you": "bạn",
		"suggestedForYou": "Gợi ý cho bạn",
		"startDiscovery": "Bắt đầu khám phá bản thân",
		"startDiscoveryDesc": "Hiểu rõ điểm mạnh và câu chuyện của bạn trước khi chọn trường phù hợp. Persona Lab sẽ giúp bạn khám phá những điều tuyệt vời về bản thân.",
		"goToPersonaLab": "Vào Persona Lab",
		"addFirstTarget": "Thêm trường mục tiêu đầu tiên",
		"addFirstTargetDesc": "Khám phá các trường phù hợp với profile của bạn và bắt đầu xây dựng danh sách trường mục tiêu.",
		"exploreSchools": "Khám phá trường",
		"profile": "Profile",
		"completed": "hoàn thành",
		"schoolsSaved": "Trường đã lưu",
		"schools": "trường",
		"applications": "Hồ sơ",
		"submitted": "đã nộp",
		"upcomingDeadlines": "Deadline sắp tới",
		"deadlines": "deadline",
		"discovery": "Discovery",
		"tracks": "tracks",
		"yourSchools": "Trường của bạn",
		"yourApplications": "Hồ sơ của bạn",
		"viewAll": "Xem tất cả",
		"saved": "Đã lưu",
		"noSchoolsSaved": "Chưa có trường nào được lưu",
		"noApplicationsYet": "Chưa có hồ sơ nào",
		"fit": "phù hợp",
		"draft": "Nháp",
		"underReview": "Đang xét",
		"continueWhereYouLeft": "Tiếp tục",
		"startYourJourney": "Bắt đầu hành trình của bạn",
		"quickActions": "Hành động nhanh",
		"updateProfile": "Cập nhật profile",
		"daysAgo": "ngày trước",
		"hoursAgo": "giờ trước",
		"minutesAgo": "phút trước",
		"justNow": "Vừa xong"
	},
	"auth": {
		"signupTitle": "Tạo tài khoản",
		"signupSubtitle": "Khởi đầu hành trình du học của bạn",
		"alreadyHaveAccount": "Đã có tài khoản?",
		"login": "Đăng nhập",
		"loginTitle": "Chào mừng trở lại",
		"loginSubtitle": "Đăng nhập vào tài khoản Leaply của bạn",
		"loginWithGoogle": "Đăng nhập với Google",
		"registerWithGoogle": "Đăng ký với Google",
		"loggingIn": "Đang đăng nhập...",
		"creatingAccount": "Đang tạo tài khoản...",
		"error": "Lỗi",
		"oauthFailed": "Đăng nhập thất bại, vui lòng thử lại",
		"sessionExpired": "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
		"sessionExpiredMessage": "Để bảo mật, bạn đã được đăng xuất. Vui lòng đăng nhập lại để tiếp tục.",
		"passwordsNotMatch": "Mật khẩu không khớp",
		"fullName": "Họ và tên",
		"fullNamePlaceholder": "Nguyễn Văn A",
		"email": "Email",
		"emailPlaceholder": "email@example.com",
		"emailDescription": "Chúng mình sẽ dùng email này để liên lạc với bạn. Chúng mình sẽ không chia sẻ email của bạn với ai khác.",
		"password": "Mật khẩu",
		"passwordDescription": "Phải có ít nhất 8 ký tự.",
		"confirmPassword": "Xác nhận mật khẩu",
		"confirmPasswordDescription": "Vui lòng xác nhận mật khẩu.",
		"createAccount": "Tạo tài khoản",
		"tosAgreement": "Bằng cách tiếp tục, bạn đồng ý với",
		"tos": "Điều khoản dịch vụ",
		"and": "và",
		"privacyPolicy": "Chính sách bảo mật",
		"orContinueWith": "Hoặc tiếp tục với",
		"signupWithGithub": "Đăng ký với GitHub",
		"rememberMe": "Ghi nhớ đăng nhập",
		"forgotPasswordLink": "Quên mật khẩu?",
		"signIn": "Đăng nhập",
		"noAccount": "Chưa có tài khoản?",
		"signUp": "Đăng ký",
		"verifyEmail": {
			"title": "Xác thực Email",
			"subtitle": "Chúng mình đã gửi liên kết xác thực đến email của bạn",
			"promptTitle": "Sắp xong rồi!",
			"promptSubtitle": "Xác thực email để bảo mật tài khoản",
			"sendVerification": "Gửi Email Xác thực",
			"sending": "Đang gửi...",
			"skipForNow": "Bỏ qua",
			"emailSent": "Email xác thực đã được gửi!",
			"checkInbox": "Vui lòng kiểm tra hộp thư và nhấp vào liên kết xác thực.",
			"resendIn": "Gửi lại sau",
			"resend": "Gửi lại Email",
			"verifying": "Đang xác thực...",
			"success": "Email đã được xác thực!",
			"successMessage": "Email của bạn đã được xác thực thành công. Bạn có thể truy cập tất cả các tính năng.",
			"goToDashboard": "Về Trang chủ",
			"invalidToken": "Liên kết không hợp lệ hoặc đã hết hạn",
			"invalidTokenMessage": "Liên kết xác thực này không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.",
			"requestNew": "Yêu cầu Liên kết Mới",
			"alreadyVerified": "Đã xác thực?",
			"continueToApp": "Tiếp tục sử dụng"
		},
		"forgotPassword": {
			"title": "Quên mật khẩu",
			"subtitle": "Nhập email để nhận liên kết đặt lại",
			"email": "Địa chỉ Email",
			"emailPlaceholder": "Nhập email của bạn",
			"sendLink": "Gửi Liên kết Đặt lại",
			"sending": "Đang gửi...",
			"backToLogin": "Quay lại Đăng nhập",
			"emailSent": "Liên kết Đặt lại đã được gửi!",
			"emailSentMessage": "Nếu tài khoản với email này tồn tại, bạn sẽ nhận được liên kết đặt lại mật khẩu.",
			"checkSpam": "Không thấy? Kiểm tra thư mục spam.",
			"tryAgain": "Thử lại"
		},
		"resetPassword": {
			"title": "Đặt lại Mật khẩu",
			"subtitle": "Tạo mật khẩu mới cho tài khoản của bạn",
			"newPassword": "Mật khẩu Mới",
			"newPasswordPlaceholder": "Nhập mật khẩu mới",
			"confirmPassword": "Xác nhận Mật khẩu",
			"confirmPasswordPlaceholder": "Xác nhận mật khẩu mới",
			"resetPassword": "Đặt lại Mật khẩu",
			"resetting": "Đang đặt lại...",
			"requirements": "Mật khẩu phải có:",
			"minLength": "Ít nhất 8 ký tự",
			"uppercase": "Một chữ cái viết hoa",
			"lowercase": "Một chữ cái viết thường",
			"number": "Một chữ số",
			"success": "Đã Đặt lại Mật khẩu!",
			"successMessage": "Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập bằng mật khẩu mới.",
			"goToLogin": "Đến Đăng nhập",
			"invalidToken": "Liên kết không hợp lệ hoặc đã hết hạn",
			"invalidTokenMessage": "Liên kết đặt lại này không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.",
			"requestNew": "Yêu cầu Liên kết Mới",
			"passwordsNotMatch": "Mật khẩu không khớp"
		}
	},
	"common": {
		"leaply": "Leaply",
		"vietnam": "Việt Nam",
		"hanoi": "Hà Nội, Việt Nam",
		"due": "Hạn",
		"overdue": "Quá hạn",
		"readMore": "Xem thêm",
		"article": "Bài viết",
		"video": "Video",
		"guide": "Hướng dẫn",
		"low": "thấp",
		"medium": "trung bình",
		"high": "cao"
	},
	"footer": {
		"description": "Người bạn đồng hành AI của bạn trong hành trình du học. Khám phá trường đại học, quản lý hồ sơ và nhận hướng dẫn cá nhân hóa.",
		"copyright": "© {year} Leaply. Tất cả các quyền được bảo lưu.",
		"categories": {
			"product": "Sản phẩm",
			"resources": "Tài nguyên",
			"company": "Công ty"
		},
		"links": {
			"exploreUniversities": "Khám phá trường",
			"personaLab": "Persona Lab",
			"aiAssistant": "Trợ lý AI",
			"dashboard": "Tổng quan",
			"applicationGuide": "Hướng dẫn hồ sơ",
			"scholarships": "Học bổng",
			"faqs": "Câu hỏi thường gặp",
			"aboutUs": "Về chúng mình",
			"contact": "Liên hệ",
			"privacyPolicy": "Chính sách bảo mật",
			"termsOfService": "Điều khoản dịch vụ"
		}
	}
}
````

## File: messages/en.json
````json
{
	"nav": {
		"home": "Home",
		"features": "Features",
		"about": "About",
		"explore": "Explore",
		"applications": "Applications",
		"personaLab": "Persona Lab",
		"login": "Log in",
		"getStarted": "Get Started",
		"profile": "Profile",
		"logout": "Log out",
		"goToDashboard": "Go to Dashboard"
	},
	"onboarding": {
		"steps": {
			"basicInfo": "Basic Information",
			"preferences": "Your Preferences",
			"plan": "Your Plan",
			"journey": "Choose Your Path",
			"complete": "Complete"
		},
		"step1": {
			"title": "Basic Information",
			"subtitle": "We need to know a little about you to get started",
			"educationLevel": "Current Education Level",
			"educationLevelRequired": "*",
			"targetDegree": "Program you're looking for",
			"targetDegreeRequired": "*",
			"levels": {
				"highSchool": "High School",
				"undergraduate": "Undergraduate",
				"graduate": "Graduate",
				"working": "Working Professional"
			},
			"programs": {
				"bachelors": "Bachelor's",
				"masters": "Master's",
				"mba": "MBA",
				"phd": "PhD"
			}
		},
		"step2": {
			"title": "Your Preferences",
			"subtitle": "Help Leaply understand your study abroad needs better",
			"fieldsOfInterest": "Fields of Interest",
			"fieldsOfInterestMax": "(Max 3)",
			"fieldsRequired": "*",
			"regionsOfInterest": "Regions of Interest",
			"regionsOptional": "(Optional)",
			"timeline": "Intended Start Date",
			"timelineRequired": "*",
			"selectYear": "When do you hope to start?",
			"selectYearPlaceholder": "Select Year",
			"selectTerm": "Select your semester",
			"selectTermPlaceholder": "Select Term",
			"budget": "Estimated Budget",
			"budgetRequired": "*",
			"fields": {
				"cs": "Computer Science / IT",
				"business": "Business / Management",
				"finance": "Finance / Economics",
				"engineering": "Engineering",
				"dataScience": "Data Science / Analytics",
				"design": "Design (UX/UI, Industrial)",
				"health": "Public Health / Healthcare",
				"other": "Other / Undecided"
			},
			"regions": {
				"eastAsia": "East Asia",
				"eastAsiaCountries": "China, South Korea, Japan, Taiwan, Hong Kong",
				"southeastAsia": "Southeast Asia",
				"southeastAsiaCountries": "Singapore, Malaysia, Thailand",
				"westernEurope": "Western Europe",
				"westernEuropeCountries": "UK, France, Germany, Netherlands",
				"northernEurope": "Northern Europe",
				"northernEuropeCountries": "Sweden, Denmark, Finland",
				"northAmerica": "North America",
				"northAmericaCountries": "USA, Canada",
				"oceania": "Oceania",
				"oceaniaCountries": "Australia, New Zealand"
			},
			"budgetOptions": {
				"low": "<500M VND",
				"medium": "500M-1B VND",
				"high": ">1B VND",
				"scholarship": "Need Full Scholarship"
			},
			"terms": {
				"spring": "Spring",
				"summer": "Summer",
				"fall": "Fall",
				"winter": "Winter"
			}
		},
		"step2b": {
			"title": "Your Plan",
			"subtitle": "Let's talk about timing and budget",
			"timeline": "Intended Start Date",
			"timelineRequired": "*",
			"selectYear": "When do you hope to start?",
			"selectYearPlaceholder": "Select Year",
			"selectTerm": "Select your semester",
			"selectTermPlaceholder": "Select Term",
			"budget": "Estimated Budget",
			"budgetRequired": "*",
			"budgetOptions": {
				"low": "<500M VND",
				"medium": "500M-1B VND",
				"high": ">1B VND",
				"scholarship": "Need Full Scholarship"
			},
			"terms": {
				"spring": "Spring",
				"summer": "Summer",
				"fall": "Fall",
				"winter": "Winter"
			}
		},
		"step3": {
			"title": "Choose Your Path",
			"subtitle": "Where are you in your study abroad journey?",
			"exploring": {
				"title": "I'm Exploring",
				"description": "Not sure yet, want to learn more"
			},
			"targeted": {
				"title": "I Have a Goal",
				"description": "Already know which school/program to apply to"
			},
			"startNow": "Select This Path"
		},
		"step4": {
			"title": "Congratulations!",
			"subtitle": "You're all set to begin your journey.",
			"ctaExploring": "Go to Persona Lab",
			"ctaTargeted": "Start Exploring Schools"
		},
		"buttons": {
			"back": "Back",
			"continue": "Continue"
		}
	},
	"landing": {
		"badge": "Your personal study abroad mentor",
		"heroTitle": "Study abroad,",
		"heroTitleHighlight": "simplified by Leaply",
		"heroSubtitle": "No more confusion. No more stress. Just you, your dreams, and a clear path to get there.",
		"ctaStart": "Get started — it's free",
		"ctaLearnMore": "See how it works",
		"statsStudents": "Happy students",
		"statsUniversities": "Universities",
		"statsCountries": "Countries",
		"universitiesTitle": "Dream schools? We've got them all",
		"universitiesSubtitle": "From Ivy League to hidden gems — explore universities that match your vibe",
		"featuresTitle": "Everything you need",
		"featuresTitleSuffix": "in one place",
		"featuresSubtitle": "We've been there. We know how overwhelming it can be. That's why we built tools that actually help.",
		"learnMore": "Learn more",
		"feature1Title": "Find Your Fit",
		"feature1Desc": "Browse 1,500+ universities. Filter by what matters to you — budget, location, programs, vibes. Your perfect match is out there.",
		"feature2Title": "Smart Recommendations",
		"feature2Desc": "Tell us about yourself, and our AI will suggest schools that actually make sense for you. No more guessing games.",
		"feature3Title": "Stay on Track",
		"feature3Desc": "Deadlines, documents, requirements — we keep track so you don't have to stress. Everything organized in one dashboard.",
		"feature4Title": "Persona Lab",
		"feature4Desc": "Discover what makes you unique. Write essays that actually sound like you. Our AI mentor is here 24/7.",
		"howItWorksTitle": "How it works",
		"howItWorksSubtitle": "Four steps. That's all it takes to go from 'where do I start?' to 'I got this!'",
		"step1Title": "Tell us about you",
		"step1Quote": "I don't even know where to start...",
		"step1Desc": "No worries! Just answer a few questions about your background, interests, and dreams. We'll take it from there.",
		"step2Title": "Get your matches",
		"step2Quote": "There are SO many schools... which one is right for me?",
		"step2Desc": "Our AI crunches the numbers and finds schools that fit your profile, budget, and goals. Each recommendation comes with a match score and real insights.",
		"step3Title": "Apply stress-free",
		"step3Quote": "How do I keep track of all these deadlines?!",
		"step3Desc": "We've got your back. Deadline reminders, document checklists, progress tracking — all in one place. No more spreadsheet chaos.",
		"step4Title": "Stand out",
		"step4Quote": "My essay sounds so... boring. How do I make it special?",
		"step4Desc": "Your story is unique — let's make sure it shines. Our AI mentor helps you craft essays that are authentically YOU. The kind admissions officers remember.",
		"ctaFree": "100% free to start",
		"ctaTitle": "Your journey starts here",
		"ctaSubtitle": "Thousands of students have already taken the first step. Ready to join them?",
		"ctaCreateAccount": "Create free account",
		"alreadyHaveAccount": "Already have an account?"
	},
	"features": {
		"heroTitle": "Tools that actually",
		"heroTitleHighlight": "make a difference",
		"heroSubtitle": "We built Leaply because we wished something like this existed when we were applying. Now it does.",
		"exploreTitle": "Explore",
		"exploreTagline": "Your dream school is out there. Let's find it.",
		"exploreDesc": "1,500+ universities at your fingertips. Search, filter, compare — and let our AI suggest schools you might not have even considered.",
		"exploreBenefit1Title": "Search your way",
		"exploreBenefit1Desc": "Budget tight? Want sunny weather? Need strong CS programs? Filter by what actually matters to you",
		"exploreBenefit2Title": "AI that gets you",
		"exploreBenefit2Desc": "Our AI learns your preferences and finds schools that truly fit — not just random suggestions",
		"exploreBenefit3Title": "Compare side-by-side",
		"exploreBenefit3Desc": "Put your top choices next to each other. See tuition, rankings, requirements — all in one view",
		"applicationsTitle": "Applications",
		"applicationsTagline": "Goodbye spreadsheet chaos. Hello peace of mind.",
		"applicationsDesc": "Multiple schools, dozens of deadlines, endless documents. Sound familiar? We organize everything so you can focus on what matters — your applications.",
		"applicationsBenefit1Title": "See everything at once",
		"applicationsBenefit1Desc": "One dashboard. All your applications. Every deadline. No surprises",
		"applicationsBenefit2Title": "Never miss a date",
		"applicationsBenefit2Desc": "We'll ping you before deadlines. Early enough to actually do something about it",
		"applicationsBenefit3Title": "Check things off",
		"applicationsBenefit3Desc": "Each school has different requirements. We track what you need and what you've done",
		"personaLabTitle": "Persona Lab",
		"personaLabTagline": "Your story is unique. Let's make it shine.",
		"personaLabDesc": "Essays are hard. We get it. That's why we built a space where you can discover what makes you YOU — and turn it into essays that admissions officers actually want to read.",
		"personaLabBenefit1Title": "Know yourself better",
		"personaLabBenefit1Desc": "4 guided tracks help you uncover strengths, values, and stories you didn't know you had",
		"personaLabBenefit2Title": "Write with confidence",
		"personaLabBenefit2Desc": "AI suggestions that sound like you, not like a robot. Edit, refine, make it yours",
		"personaLabBenefit3Title": "Get real feedback",
		"personaLabBenefit3Desc": "Our AI mentor reads like a real person. Specific observations. Actionable suggestions. No fluff",
		"additionalTitle": "Plus, the basics done right",
		"additionalSubtitle": "Because the little things matter too",
		"benefit1Title": "Your data, protected",
		"benefit1Desc": "We take privacy seriously. Your information stays yours",
		"benefit2Title": "You're not alone",
		"benefit2Desc": "Connect with others who've been through it. Alumni, current students, fellow applicants",
		"benefit3Title": "Always fresh",
		"benefit3Desc": "Requirements change. Rankings update. We keep our data current so you don't have to worry",
		"ctaTitle": "Ready to get started?",
		"ctaSubtitle": "Join thousands of students who chose the easier path. You deserve it too.",
		"startFree": "Start free",
		"aboutUs": "Meet the team",
		"startUsing": "Try it now"
	},
	"about": {
		"badge": "Our Story",
		"heroTitle": "We've been in",
		"heroTitleHighlight": "your shoes",
		"heroSubtitle": "We're a team of Vietnamese students and recent grads who went through the study abroad process ourselves. We know how confusing it can be. That's why we built Leaply.",
		"missionTitle": "Why we do this",
		"missionText": "Applying to study abroad shouldn't feel like navigating a maze blindfolded. We remember the late nights googling, the anxiety over deadlines, the essays we rewrote a hundred times. We built Leaply to be the friend we wished we had — someone who actually gets it and can help you figure things out.",
		"value1Title": "We care. A lot.",
		"value1Desc": "This isn't just a product to us. Every student who uses Leaply is someone we genuinely want to see succeed.",
		"value2Title": "Tech with heart",
		"value2Desc": "AI is powerful, but only when it serves real human needs. We build tech that actually helps, not just impresses.",
		"value3Title": "Built for you",
		"value3Desc": "Vietnamese students have unique challenges. We build for those, not for some generic 'international student'.",
		"teamTitle": "The humans behind Leaply",
		"teamSubtitle": "A small but mighty team of dreamers, builders, and former stressed-out applicants.",
		"contactTitle": "Say hi!",
		"contactSubtitle": "Got questions? Feedback? Just want to chat? We'd love to hear from you. Seriously, we read every message.",
		"email": "Email",
		"address": "Where we are",
		"followUs": "Stay connected",
		"formName": "Your name",
		"formNamePlaceholder": "What should we call you?",
		"formEmail": "Email",
		"formEmailPlaceholder": "Where can we reach you?",
		"formMessage": "Your message",
		"formMessagePlaceholder": "Whatever's on your mind...",
		"formSubmit": "Send it!",
		"formSubmitting": "Sending...",
		"formThankYou": "Got it! 🎉",
		"formSuccess": "Thanks for reaching out! We'll get back to you soon.",
		"formSendAnother": "Send another",
		"ctaTitle": "Ready to start?",
		"ctaSubtitle": "Your dream school is waiting. Let's make it happen together.",
		"ctaButton": "Get started free"
	},
	"dashboard": {
		"title": "Dashboard",
		"subtitle": "Welcome back! Here's your application progress at a glance.",
		"stats": {
			"savedUniversities": "Saved Universities",
			"savedUniversitiesDesc": "Universities in your shortlist",
			"activeApplications": "Active Applications",
			"activeApplicationsDesc": "In progress or submitted",
			"pendingTasks": "Pending Tasks",
			"pendingTasksDesc": "Tasks to complete",
			"resources": "Resources",
			"resourcesDesc": "Guides and articles"
		},
		"recentApplications": "Recent Applications",
		"viewAll": "View All",
		"seeAll": "See All",
		"noApplications": "No applications yet",
		"browseUniversities": "Browse Universities",
		"upcomingTasks": "Upcoming Tasks",
		"allCaughtUp": "All caught up!",
		"quickActions": "Quick Actions",
		"exploreUniversities": "Explore Universities",
		"askAIAssistant": "Ask AI Assistant",
		"browseResources": "Browse Resources",
		"share": "Share",
		"addApplication": "+ Add Application",
		"applications": "Applications",
		"submitted": "Submitted",
		"inProgress": "In-progress",
		"myApplications": "My Applications",
		"thisWeek": "This Week",
		"application": "Application",
		"program": "Program",
		"status": "Status",
		"schedule": "Schedule",
		"notes": "Notes",
		"markComplete": "Mark as complete"
	},
	"applications": {
		"title": "Applications",
		"newApplication": "New Application",
		"searchUniversities": "Search universities...",
		"noApplicationsFound": "No applications found",
		"noApplicationsYet": "No applications yet",
		"explorePrograms": "Explore Programs",
		"backToApplications": "Back to Applications",
		"noApplicationSelected": "No Application Selected",
		"selectApplication": "Select an application from the sidebar to view details",
		"gapsToAddress": "gaps to address",
		"gapsDescription": "These are areas where your profile doesn't fully meet the program requirements",
		"fitScore": "Fit Score",
		"sopStatus": "SOP Status",
		"notStarted": "Not Started",
		"noDeadline": "No deadline set",
		"intakeInfo": "Intake Information",
		"nextIntake": "Next Intake",
		"viewProgramDetails": "View Program Details",
		"actions": "Actions",
		"startSop": "Start SOP",
		"continueSop": "Continue SOP",
		"viewProgram": "View Program",
		"removeApplication": "Remove",
		"confirmRemove": "Remove Application?",
		"confirmRemoveDescription": "Are you sure you want to remove {program} at {university} from your applications? This action cannot be undone.",
		"cancel": "Cancel",
		"remove": "Remove",
		"removing": "Removing...",
		"addedOn": "Added on",
		"lastUpdated": "Last updated",
		"status": {
			"label": "Status",
			"draft": "Draft",
			"planning": "Planning",
			"writing": "Writing",
			"submitted": "Submitted",
			"under_review": "Under Review",
			"accepted": "Accepted",
			"waitlisted": "Waitlisted",
			"rejected": "Rejected"
		},
		"submitted": "Submitted",
		"decisionBy": "Decision by",
		"viewApplication": "View Application",
		"progress": "Progress",
		"match": "Match",
		"applicationStatus": "Application Status",
		"trackProgress": "Track your application progress and key metrics",
		"completion": "Completion",
		"documents": "Documents",
		"uploaded": "uploaded",
		"tasks": "Tasks",
		"completed": "completed",
		"deadlines": "Deadlines",
		"upcoming": "upcoming",
		"currentStatus": "Current Status",
		"notYetSubmitted": "Not yet submitted",
		"nextDeadline": "Next Deadline",
		"daysRemaining": "days remaining",
		"noPendingDeadlines": "✓ No pending deadlines",
		"decisionExpectedBy": "Decision expected by:",
		"applicationComplete": "✓ Application complete!",
		"remainingToComplete": "remaining to complete",
		"profileEvaluation": "Profile Evaluation",
		"yourFitForProgram": "Your fit for this program",
		"overallFitScore": "Overall Fit Score",
		"strengths": "Strengths",
		"yourStrengths": "Your Strengths",
		"areasToConsider": "Areas to Consider",
		"viewDetailedAnalysis": "View Detailed Analysis",
		"profileEvaluationDetails": "Profile Evaluation Details",
		"comprehensiveAnalysis": "Comprehensive analysis of your fit for",
		"schoolInformation": "School Information",
		"keyDetails": "Key details about this university",
		"location": "Location",
		"worldRanking": "World Ranking",
		"tuitionRange": "Tuition Range",
		"program": "Program",
		"viewUniversityDetails": "View University Details",
		"nextActions": "Next Actions",
		"tasksToComplete": "Tasks to complete for this application",
		"noTasksToComplete": "No tasks to complete",
		"due": "Due",
		"urgent": "Urgent",
		"high": "high",
		"medium": "medium",
		"low": "low",
		"taskCompleted": "task(s) completed",
		"helpfulResources": "Helpful Resources",
		"guidesAndTools": "Guides and tools to strengthen your application",
		"essayWritingGuide": "Essay Writing Guide",
		"tipsForStatements": "Tips for compelling statements",
		"learnEffectiveStatements": "Learn how to write effective personal statements",
		"interviewPreparation": "Interview Preparation",
		"commonQuestions": "Common questions & answers",
		"prepareForInterviews": "Prepare for university interviews",
		"scholarshipFinder": "Scholarship Finder",
		"findFunding": "Find funding opportunities",
		"discoverScholarships": "Discover available scholarships",
		"askAIAssistant": "Ask AI Assistant",
		"getPersonalizedAdvice": "Get personalized advice",
		"chatWithAI": "Chat with AI about this application"
	},
	"tasks": {
		"title": "Tasks",
		"subtitle": "Manage your application tasks and deadlines",
		"addTask": "Add Task",
		"show": "Show:",
		"allTasks": "All Tasks",
		"pending": "Pending",
		"completed": "Completed",
		"sortBy": "Sort by:",
		"dueDate": "Due Date",
		"priority": "Priority",
		"task": "task",
		"taskPlural": "tasks",
		"noTasksFound": "No tasks found",
		"noCompletedTasks": "No completed tasks yet.",
		"noPendingTasks": "All caught up! No pending tasks.",
		"startByAdding": "Start by adding your first task.",
		"addYourFirstTask": "Add Your First Task"
	},
	"resources": {
		"title": "Resources",
		"subtitle": "Guides, articles, and tools to help you succeed in your applications",
		"searchResources": "Search resources...",
		"allCategories": "All Categories",
		"resource": "resource",
		"resourcePlural": "resources",
		"found": "found",
		"noResourcesFound": "No resources found",
		"tryAdjustingFilters": "Try adjusting your search or filters"
	},
	"profile": {
		"title": "Profile",
		"subtitle": "Manage your personal information and preferences",
		"personalInformation": "Personal Information",
		"editProfile": "Edit Profile",
		"cancel": "Cancel",
		"saveChanges": "Save Changes",
		"saving": "Saving...",
		"fullName": "Full Name",
		"fullNamePlaceholder": "Enter your full name",
		"email": "Email",
		"emailVerified": "Verified",
		"emailNotVerified": "Not verified",
		"dateOfBirth": "Date of Birth",
		"nationality": "Nationality",
		"selectNationality": "Select nationality",
		"educationLevel": "Education Level",
		"selectLevel": "Select level",
		"highSchool": "High School",
		"undergraduate": "Undergraduate",
		"graduate": "Graduate",
		"working": "Working Professional",
		"targetDegree": "Target Degree",
		"bachelors": "Bachelor's",
		"masters": "Master's",
		"mba": "MBA",
		"phd": "PhD",
		"gpa": "GPA",
		"gpaScale": "GPA Scale",
		"notSet": "Not set",
		"workExperience": "Work Experience",
		"years": "years",
		"testScores": "Test Scores",
		"noTestScores": "No test scores added",
		"addTestScore": "Add Test Score",
		"editTestScores": "Edit Scores",
		"preferences": "Preferences",
		"fieldsOfInterest": "Fields of Interest",
		"preferredRegions": "Preferred Regions",
		"intendedStartTerm": "Intended Start Term",
		"budgetRange": "Budget Range",
		"journeyType": "Journey Type",
		"exploring": "Exploring",
		"targeted": "Targeted",
		"programType": "Program Type",
		"campusSetting": "Campus Setting",
		"urban": "Urban",
		"suburban": "Suburban",
		"rural": "Rural",
		"interests": "Interests",
		"accountSecurity": "Account & Security",
		"memberSince": "Member since",
		"resetPassword": "Reset Password",
		"resetPasswordDesc": "Send a password reset link to your email",
		"resetPasswordSent": "Password reset email sent! Please check your inbox.",
		"resetPasswordError": "Failed to send reset email. Please try again.",
		"verifyNow": "Verify now",
		"verificationSent": "Verification email sent! Please check your inbox.",
		"verificationError": "Failed to send verification email. Please try again.",
		"profileCompletion": "Profile Completion",
		"completeProfile": "Complete your profile to get better recommendations",
		"updateSuccess": "Profile updated successfully",
		"updateError": "Failed to update profile",
		"noData": "Not set",
		"unitedStates": "United States",
		"unitedKingdom": "United Kingdom",
		"canada": "Canada",
		"australia": "Australia",
		"india": "India",
		"china": "China",
		"other": "Other"
	},
	"explore": {
		"title": "Discover Your Perfect Match",
		"aiMatch": "AI Match",
		"match": "Match",
		"why": "Why?",
		"whySchool": "Why this school?",
		"whySchoolDesc": "Here's why we think this university could be a great match for you",
		"basedOnProfile": "Based on your profile and preferences",
		"matchReasons": "Match Reasons",
		"completeProfileForReasons": "Complete your profile to see personalized match reasons!",
		"viewDetails": "View Details",
		"askAI": "Ask AI",
		"learnMore": "Learn More",
		"saved": "Saved",
		"addToDreamList": "Add to Dream List",
		"striveForIt": "Strive for it!",
		"askAIAboutSchool": "Ask AI about this school",
		"acceptance": "acceptance",
		"public": "Public",
		"private": "Private",
		"perYear": "/year",
		"subtitle": "Personalized recommendations or explore 1000+ universities worldwide",
		"searchPlaceholder": "Search universities, programs, or countries...",
		"exploreAll": "Explore All",
		"basedOnProfileFound": "Based on your profile, we've found",
		"universitiesFit": "universities that may be a great fit for you",
		"completeProfileForRecommendations": "Complete your profile to see personalized AI recommendations",
		"noMatchesFound": "No matches found",
		"completeProfile": "Complete your profile",
		"tryAdjusting": "Try adjusting your search or preferences to see more results",
		"completeProfileToSeeMatches": "Complete your profile and preferences to see personalized university matches",
		"completeProfileButton": "Complete Profile",
		"allUniversities": "All Universities",
		"showing": "Showing",
		"results": "results",
		"noUniversitiesFound": "No universities found",
		"tryAdjustingFilters": "Try adjusting your filters or search query to see more results"
	},
	"personaLab": {
		"title": "Persona Lab",
		"subtitle": "Discover yourself and prepare essays",
		"canvasTitle": "Persona Canvas",
		"canvasSubtitle": "Your unique story visualized",
		"viewCanvas": "Canvas",
		"viewList": "List",
		"discoveryChat": "Discovery Chat",
		"backToTracks": "Back to select topic",
		"shareYourStory": "Share your story...",
		"minCharacters": "Min {count} characters",
		"moreCharactersNeeded": "{count} more characters needed",
		"yourArchetype": "Your Archetype",
		"completeAllTracks": "Complete all tracks to discover",
		"discovery": "Discovery",
		"myPersona": "My Persona",
		"essays": "Essays",
		"topTrait": "Top Trait",
		"topTraits": "Top Traits",
		"personaSummary": "Persona Summary",
		"academicStats": "Academic Stats",
		"from": "From",
		"discoveryWord": "discovery",
		"highlightedAchievement": "Highlighted Achievement",
		"discoveryProgress": "Discovery Progress",
		"tracksCompleted": "Tracks completed",
		"targetCountries": "Target Countries",
		"savedSchools": "Saved Schools",
		"moreSchools": "more schools",
		"intendedMajor": "Intended Major",
		"otherTraits": "Other Traits",
		"noName": "No name set",
		"certificates": "Certificates & Achievements",
		"discoveryTitle": "Discover Yourself",
		"discoverySubtitle": "Complete the tracks so Leaply can better understand your story",
		"tracks": "tracks",
		"statusCompleted": "Completed",
		"statusInProgress": "In Progress",
		"statusNotStarted": "Not Started",
		"questions": "questions",
		"backToList": "Back to list",
		"question": "Question",
		"writeAnswer": "Write your answer here...",
		"exit": "Exit",
		"back": "Back",
		"skip": "Skip",
		"complete": "Complete",
		"next": "Next",
		"whyImportant": "Why is this important?",
		"whyImportantDesc": "These questions help Leaply understand your unique story. From there, we can suggest interesting angles for essays and help you stand out in your study abroad application.",
		"myPersonaTitle": "My Persona",
		"myPersonaSubtitle": "Insights about you analyzed by Leaply from Discovery",
		"retakeQuiz": "Retake Quiz",
		"personalityTags": "Personality Tags",
		"addTag": "Add tag",
		"enterTag": "Enter tag...",
		"completeDiscoveryForTags": "Complete Discovery so Leaply can create personality tags for you",
		"keyStories": "Key Stories",
		"pinned": "Pinned",
		"other": "Other",
		"storiesAppear": "Your stories will appear here after completing Discovery",
		"essayAngles": "Essay Angles",
		"suggested": "Suggested",
		"createEssayFromIdea": "Create essay from this idea",
		"noPersonaData": "No persona data yet",
		"completeOneTrack": "Complete at least 1 track in Discovery to see your persona. Leaply will analyze your answers and create insights for you.",
		"startDiscovery": "Start Discovery",
		"newEssay": "New Essay",
		"searchEssay": "Search essay...",
		"noEssays": "No essays yet",
		"noEssayFound": "No essay found",
		"total": "Total",
		"reviewed": "Reviewed",
		"pending": "Pending",
		"selectEssayToStart": "Select an essay to start",
		"selectFromList": "Select an essay from the list on the left or create a new essay",
		"statusDraft": "Draft",
		"statusSubmitted": "Submitted",
		"statusReviewed": "Reviewed",
		"createNewEssay": "Create new essay",
		"selectSchoolAndType": "Select school and essay type to start writing",
		"university": "University",
		"selectSchool": "Select school",
		"essayType": "Essay type",
		"selectType": "Select type",
		"essayPrompt": "Essay prompt",
		"enterPrompt": "Enter the essay question / prompt...",
		"wordLimit": "Word limit (optional)",
		"selectWordLimit": "Select word limit",
		"eg": "E.g.",
		"cancel": "Cancel",
		"createEssay": "Create essay",
		"prompt": "Prompt",
		"startWriting": "Start writing your essay...\n\nTip: Write in your own words first, Leaply will help you improve later. Don't worry about perfection from the start.",
		"words": "words",
		"unsaved": "Unsaved",
		"save": "Save",
		"saving": "Saving...",
		"submitForReview": "Submit for review",
		"feedback": "Feedback",
		"feedbackFromMentor": "Feedback from Leaply mentor",
		"noFeedback": "No feedback yet",
		"submitToGetFeedback": "Submit essay to get feedback",
		"observation": "Observation",
		"recommendation": "Recommendation",
		"justNow": "Just now",
		"resetData": "Reset data",
		"resetConfirmTitle": "Reset conversation?",
		"resetConfirmDescription": "This will clear all your conversation data and start fresh. Your canvas data will be lost.",
		"confirmReset": "Yes, reset",
		"conversationComplete": "Conversation complete! Your persona is ready.",
		"goToApplications": "Continue to Applications",
		"emptyCanvasTitle": "Your Persona Canvas",
		"emptyCanvasDesc": "Start chatting in the Discovery panel to build your persona graph. Your stories and insights will appear here as interactive nodes.",
		"centerPlaceholder": "Keep chatting to build your profile"
	},
	"home": {
		"greeting": {
			"morning": "Good morning",
			"afternoon": "Good afternoon",
			"evening": "Good evening"
		},
		"subtitle": "Here's your journey",
		"you": "you",
		"suggestedForYou": "Suggested for you",
		"startDiscovery": "Start discovering yourself",
		"startDiscoveryDesc": "Understand your strengths and story before choosing the right schools. Persona Lab will help you discover the amazing things about yourself.",
		"goToPersonaLab": "Go to Persona Lab",
		"addFirstTarget": "Add your first target school",
		"addFirstTargetDesc": "Discover schools that match your profile and start building your target school list.",
		"exploreSchools": "Explore Schools",
		"profile": "Profile",
		"completed": "completed",
		"schoolsSaved": "Schools saved",
		"schools": "schools",
		"applications": "Applications",
		"submitted": "submitted",
		"upcomingDeadlines": "Upcoming deadlines",
		"deadlines": "deadlines",
		"discovery": "Discovery",
		"tracks": "tracks",
		"yourSchools": "Your Schools",
		"yourApplications": "Your Applications",
		"viewAll": "View all",
		"saved": "Saved",
		"noSchoolsSaved": "No schools saved yet",
		"noApplicationsYet": "No applications yet",
		"fit": "fit",
		"draft": "Draft",
		"underReview": "Under Review",
		"continueWhereYouLeft": "Continue",
		"startYourJourney": "Start your journey",
		"quickActions": "Quick Actions",
		"updateProfile": "Update profile",
		"daysAgo": "days ago",
		"hoursAgo": "hours ago",
		"minutesAgo": "minutes ago",
		"justNow": "Just now"
	},
	"auth": {
		"signupTitle": "Create your account",
		"signupSubtitle": "Start your journey to global education",
		"alreadyHaveAccount": "Already have an account?",
		"login": "Login",
		"loginTitle": "Welcome Back",
		"loginSubtitle": "Sign in to your Leaply account",
		"loginWithGoogle": "Login with Google",
		"registerWithGoogle": "Register with Google",
		"loggingIn": "Logging in...",
		"creatingAccount": "Creating Account...",
		"error": "Error",
		"oauthFailed": "Login failed, please try again",
		"sessionExpired": "Your session has expired. Please log in again.",
		"sessionExpiredMessage": "For your security, you've been logged out. Please log in again to continue.",
		"passwordsNotMatch": "Passwords do not match",
		"fullName": "Full Name",
		"fullNamePlaceholder": "John Doe",
		"email": "Email",
		"emailPlaceholder": "m@example.com",
		"emailDescription": "We'll use this to contact you. We will not share your email with anyone else.",
		"password": "Password",
		"passwordDescription": "Must be at least 8 characters long.",
		"confirmPassword": "Confirm Password",
		"confirmPasswordDescription": "Please confirm your password.",
		"createAccount": "Create Account",
		"tosAgreement": "By clicking continue, you agree to our",
		"tos": "Terms of Service",
		"and": "and",
		"privacyPolicy": "Privacy Policy",
		"orContinueWith": "Or continue with",
		"signupWithGithub": "Sign up with GitHub",
		"rememberMe": "Remember me",
		"forgotPasswordLink": "Forgot password?",
		"signIn": "Sign In",
		"noAccount": "Don't have an account?",
		"signUp": "Sign up",
		"verifyEmail": {
			"title": "Verify Your Email",
			"subtitle": "We've sent a verification link to your email",
			"promptTitle": "Almost there!",
			"promptSubtitle": "Verify your email to secure your account",
			"sendVerification": "Send Verification Email",
			"sending": "Sending...",
			"skipForNow": "Skip for now",
			"emailSent": "Verification email sent!",
			"checkInbox": "Please check your inbox and click the verification link.",
			"resendIn": "Resend in",
			"resend": "Resend Email",
			"verifying": "Verifying...",
			"success": "Email Verified!",
			"successMessage": "Your email has been successfully verified. You can now access all features.",
			"goToDashboard": "Go to Dashboard",
			"invalidToken": "Invalid or Expired Link",
			"invalidTokenMessage": "This verification link is invalid or has expired. Please request a new one.",
			"requestNew": "Request New Link",
			"alreadyVerified": "Already verified?",
			"continueToApp": "Continue to App"
		},
		"forgotPassword": {
			"title": "Forgot Password",
			"subtitle": "Enter your email to receive a reset link",
			"email": "Email Address",
			"emailPlaceholder": "Enter your email",
			"sendLink": "Send Reset Link",
			"sending": "Sending...",
			"backToLogin": "Back to Login",
			"emailSent": "Reset Link Sent!",
			"emailSentMessage": "If an account exists with this email, you'll receive a password reset link.",
			"checkSpam": "Don't see it? Check your spam folder.",
			"tryAgain": "Try Again"
		},
		"resetPassword": {
			"title": "Reset Password",
			"subtitle": "Create a new password for your account",
			"newPassword": "New Password",
			"newPasswordPlaceholder": "Enter new password",
			"confirmPassword": "Confirm Password",
			"confirmPasswordPlaceholder": "Confirm new password",
			"resetPassword": "Reset Password",
			"resetting": "Resetting...",
			"requirements": "Password must contain:",
			"minLength": "At least 8 characters",
			"uppercase": "One uppercase letter",
			"lowercase": "One lowercase letter",
			"number": "One number",
			"success": "Password Reset!",
			"successMessage": "Your password has been successfully reset. You can now login with your new password.",
			"goToLogin": "Go to Login",
			"invalidToken": "Invalid or Expired Link",
			"invalidTokenMessage": "This reset link is invalid or has expired. Please request a new one.",
			"requestNew": "Request New Link",
			"passwordsNotMatch": "Passwords do not match"
		}
	},
	"common": {
		"leaply": "Leaply",
		"vietnam": "Vietnam",
		"hanoi": "Hanoi, Vietnam",
		"due": "Due",
		"overdue": "Overdue",
		"readMore": "Read More",
		"article": "Article",
		"video": "Video",
		"guide": "Guide",
		"low": "low",
		"medium": "medium",
		"high": "high"
	},
	"footer": {
		"description": "Your AI-powered companion for studying abroad. Discover universities, manage applications, and get personalized guidance.",
		"copyright": "© {year} Leaply. All rights reserved.",
		"categories": {
			"product": "Product",
			"resources": "Resources",
			"company": "Company"
		},
		"links": {
			"exploreUniversities": "Explore Universities",
			"personaLab": "Persona Lab",
			"aiAssistant": "AI Assistant",
			"dashboard": "Dashboard",
			"applicationGuide": "Application Guide",
			"scholarships": "Scholarships",
			"faqs": "FAQs",
			"aboutUs": "About Us",
			"contact": "Contact",
			"privacyPolicy": "Privacy Policy",
			"termsOfService": "Terms of Service"
		}
	}
}
````
