"use client";

import CharacterCount from "@tiptap/extension-character-count";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold,
	Heading2,
	Heading3,
	Italic,
	List,
	ListOrdered,
	Loader2,
	Redo,
	Save,
	Undo,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TipTapEditorProps {
	initialContent?: string;
	onSave: (content: string) => Promise<void>;
	onChange?: (content: string) => void;
	onWordCountChange?: (wordCount: number) => void;
	debounceMs?: number;
	className?: string;
	customActions?: React.ReactNode;
}

export function TipTapEditor({
	initialContent = "",
	onSave,
	onChange,
	onWordCountChange,
	debounceMs = 2000,
	className,
	customActions,
}: TipTapEditorProps) {
	const [isSaving, setIsSaving] = useState(false);
	const [lastSaved, setLastSaved] = useState<Date | null>(null);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const debounceTimer = useRef<NodeJS.Timeout | null>(null);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [2, 3],
				},
			}),
			CharacterCount,
		],
		content: initialContent,
		editorProps: {
			attributes: {
				class:
					"prose prose-sm max-w-none focus:outline-none flex-1 p-4 outline-none",
			},
		},
		onUpdate: ({ editor }) => {
			setHasUnsavedChanges(true);

			if (onChange) {
				onChange(editor.getHTML());
			}

			if (onWordCountChange) {
				onWordCountChange(editor.storage.characterCount.words());
			}

			// Clear existing timer
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current);
			}

			// Set new debounce timer
			debounceTimer.current = setTimeout(() => {
				handleSave(editor.getHTML());
			}, debounceMs);
		},
	});

	const handleSave = useCallback(
		async (content: string) => {
			if (isSaving) return;

			setIsSaving(true);
			try {
				await onSave(content);
				setLastSaved(new Date());
				setHasUnsavedChanges(false);
			} catch {
				// Error handling is done in parent
			} finally {
				setIsSaving(false);
			}
		},
		[onSave, isSaving],
	);

	// Manual save handler
	const handleManualSave = useCallback(() => {
		if (editor) {
			// Clear debounce timer
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current);
			}
			handleSave(editor.getHTML());
		}
	}, [editor, handleSave]);

	// Cleanup debounce timer on unmount
	useEffect(() => {
		return () => {
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current);
			}
		};
	}, []);

	// Update content when initialContent changes
	useEffect(() => {
		if (editor && initialContent && editor.isEmpty) {
			editor.commands.setContent(initialContent);
		}
	}, [editor, initialContent]);

	if (!editor) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	const wordCount = editor.storage.characterCount.words();
	const characterCount = editor.storage.characterCount.characters();

	return (
		<div
			className={cn(
				"border rounded-lg bg-card flex flex-col min-h-[400px]",
				className,
			)}
		>
			{/* Editor Content */}
			<EditorContent
				editor={editor}
				className="flex-1 overflow-y-auto flex flex-col [&>div]:flex-1 [&>div]:cursor-text"
			/>

			{/* Footer / Toolbar */}
			<div className="flex items-center justify-between border-t p-2 bg-muted/30 shrink-0 flex-wrap gap-2">
				<div className="flex items-center gap-1 flex-wrap">
					{/* Undo/Redo */}
					<Button
						variant="ghost"
						size="icon"
						onClick={() => editor.chain().focus().undo().run()}
						disabled={!editor.can().undo()}
						className="h-8 w-8"
						title="Undo (Ctrl+Z)"
					>
						<Undo className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => editor.chain().focus().redo().run()}
						disabled={!editor.can().redo()}
						className="h-8 w-8"
						title="Redo (Ctrl+Shift+Z)"
					>
						<Redo className="h-4 w-4" />
					</Button>
				</div>

				{/* Save & Word count */}
				<div className="flex items-center gap-3 shrink-0">
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<span>{wordCount.toLocaleString()} từ</span>
						<span className="hidden sm:inline">
							{characterCount.toLocaleString()} ký tự
						</span>
					</div>

					<div className="w-px h-6 bg-border mx-1 hidden sm:block" />

					<div className="flex items-center gap-2">
						{hasUnsavedChanges && (
							<span className="text-xs text-amber-600">Chưa lưu</span>
						)}
						{lastSaved && !hasUnsavedChanges && (
							<span className="text-xs text-muted-foreground hidden sm:inline">
								Đã lưu{" "}
								{lastSaved.toLocaleTimeString("vi-VN", {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						)}
						<Button
							variant="outline"
							size="sm"
							onClick={handleManualSave}
							disabled={isSaving || !hasUnsavedChanges}
						>
							{isSaving ? (
								<>
									<Loader2 className="h-4 w-4 mr-1 animate-spin" />
									Đang lưu
								</>
							) : (
								<>
									<Save className="h-4 w-4 mr-1" />
									Lưu
								</>
							)}
						</Button>
						{customActions && (
							<>
								<div className="w-px h-6 bg-border mx-1" />
								{customActions}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
