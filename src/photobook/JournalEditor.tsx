import { useEffect, useRef, useState } from "react";

export function JournalEditor({
    initialText,
    onSave,
    onClose,
}: {
    initialText: string;
    onSave: (text: string) => void;
    onClose: () => void;
}) {
    const [text, setText] = useState(initialText);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const handleSave = () => {
        onSave(text);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="mx-4 flex w-full max-w-lg flex-col rounded-lg bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                    <h2 className="text-lg font-bold tracking-wide text-stone-700">
                        Edit Journal Entry
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-stone-400 hover:text-stone-600"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="p-5">
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write your journal entry here..."
                        className="journal-text h-64 w-full resize-none rounded-lg border border-stone-200 p-4 text-lg leading-relaxed text-stone-700 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-400"
                    />
                </div>

                <div className="flex justify-end gap-3 border-t border-stone-200 px-5 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 font-bold tracking-wide text-stone-400 transition-colors hover:text-stone-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="rounded-lg bg-stone-800 px-5 py-2 font-bold tracking-wide text-white transition-all hover:bg-stone-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

function CloseIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}
