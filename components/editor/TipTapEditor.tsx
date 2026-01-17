"use client";

import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
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
	placeholder?: string;
	debounceMs?: number;
	className?: string;
}

export function TipTapEditor({
	initialContent = "",
	onSave,
	placeholder = "Bắt đầu viết essay của bạn...",
	debounceMs = 2000,
	className,
}: TipTapEditorProps) {
	const [isSaving, setIsSaving] = useState(false);
	const [lastSaved, setLastSaved] = useState<Date | null>(null);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const debounceTimer = useRef<NodeJS.Timeout | null>(null);

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [2, 3],
				},
			}),
			Placeholder.configure({
				placeholder,
			}),
			CharacterCount,
		],
		content: initialContent,
		editorProps: {
			attributes: {
				class: "prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4",
			},
		},
		onUpdate: ({ editor }) => {
			setHasUnsavedChanges(true);

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
		<div className={cn("border rounded-lg bg-card", className)}>
			{/* Toolbar */}
			<div className="flex items-center justify-between border-b p-2 bg-muted/30">
				<div className="flex items-center gap-1">
					{/* Text formatting */}
					<Button
						variant="ghost"
						size="icon"
						onClick={() => editor.chain().focus().toggleBold().run()}
						className={cn("h-8 w-8", editor.isActive("bold") && "bg-muted")}
						title="Bold (Ctrl+B)"
					>
						<Bold className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => editor.chain().focus().toggleItalic().run()}
						className={cn("h-8 w-8", editor.isActive("italic") && "bg-muted")}
						title="Italic (Ctrl+I)"
					>
						<Italic className="h-4 w-4" />
					</Button>

					<div className="w-px h-6 bg-border mx-1" />

					{/* Headings */}
					<Button
						variant="ghost"
						size="icon"
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 2 }).run()
						}
						className={cn(
							"h-8 w-8",
							editor.isActive("heading", { level: 2 }) && "bg-muted",
						)}
						title="Heading 2"
					>
						<Heading2 className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 3 }).run()
						}
						className={cn(
							"h-8 w-8",
							editor.isActive("heading", { level: 3 }) && "bg-muted",
						)}
						title="Heading 3"
					>
						<Heading3 className="h-4 w-4" />
					</Button>

					<div className="w-px h-6 bg-border mx-1" />

					{/* Lists */}
					<Button
						variant="ghost"
						size="icon"
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						className={cn(
							"h-8 w-8",
							editor.isActive("bulletList") && "bg-muted",
						)}
						title="Bullet List"
					>
						<List className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						className={cn(
							"h-8 w-8",
							editor.isActive("orderedList") && "bg-muted",
						)}
						title="Numbered List"
					>
						<ListOrdered className="h-4 w-4" />
					</Button>

					<div className="w-px h-6 bg-border mx-1" />

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

				{/* Save button */}
				<div className="flex items-center gap-2">
					{hasUnsavedChanges && (
						<span className="text-xs text-amber-600">Chưa lưu</span>
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
								Đang lưu...
							</>
						) : (
							<>
								<Save className="h-4 w-4 mr-1" />
								Lưu
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Editor */}
			<EditorContent editor={editor} />

			{/* Footer - Word count & status */}
			<div className="flex items-center justify-between border-t p-2 text-xs text-muted-foreground bg-muted/30">
				<div className="flex items-center gap-4">
					<span>{wordCount.toLocaleString()} từ</span>
					<span>{characterCount.toLocaleString()} ký tự</span>
				</div>
				{lastSaved && (
					<span>Đã lưu lúc {lastSaved.toLocaleTimeString("vi-VN")}</span>
				)}
			</div>
		</div>
	);
}
