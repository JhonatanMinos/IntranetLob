import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List } from 'lucide-react';
import { useEffect } from 'react';

const ToolbarButton = ({
    onClick,
    isActive,
    title,
    children,
}: {
    onClick: () => void;
    isActive: boolean;
    title: string;
    children: React.ReactNode;
}) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        aria-label={title}
        aria-pressed={isActive}
        className={`rounded-md p-2 hover:bg-muted ${isActive ? 'bg-secondary' : ''}`}
    >
        {children}
    </button>
);

export default function TiptapEditor({
    content,
    onChange,
}: {
    content: string;
    onChange: (html: string) => void;
}) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'min-h-[150px] w-full rounded-md border border-input bg-sidebar px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring prose dark:prose-invert max-w-none',
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [content, editor]);
    if (!editor) return null;

    const tools = [
        {
            title: 'Negrita',
            icon: <Bold className="h-4 w-4" />,
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive('bold'),
        },
        {
            title: 'Itálica',
            icon: <Italic className="h-4 w-4" />,
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive('italic'),
        },
        {
            title: 'Lista',
            icon: <List className="h-4 w-4" />,
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive('bulletList'),
        },
    ];

    return (
        <div className="rounded-md border bg-muted">
            {/* Mini Toolbar */}
            <div className="mb-1 flex gap-1 border-b p-1">
                {tools.map((tool) => (
                    <ToolbarButton
                        key={tool.title}
                        onClick={tool.action}
                        isActive={tool.isActive}
                        title={tool.title}
                    >
                        {tool.icon}
                    </ToolbarButton>
                ))}
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}
