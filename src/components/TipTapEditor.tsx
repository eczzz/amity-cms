import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, TiptapBubbleMenu, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { Node, mergeAttributes } from '@tiptap/core';
import { requestPresignedUrl, uploadToR2, saveMediaMetadata } from '../lib/r2';
import { useAuth } from '../contexts/AuthContext';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Code2,
  Heading1, Heading2, Heading3, Heading4,
  List, ListOrdered, Indent, Outdent,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Quote, Minus, Table as TableIcon, Image as ImageIcon,
  Youtube as YoutubeIcon, Link as LinkIcon, Unlink,
  Palette, Highlighter, Type, Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon, FileUp, Hash,
  Info, AlertTriangle, CheckCircle, StickyNote,
  Plus, Trash2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Rows, Columns
} from 'lucide-react';

// ─── Callout Custom Node ────────────────────────────────────────────────────

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attrs?: { variant?: string }) => ReturnType;
      toggleCallout: (attrs?: { variant?: string }) => ReturnType;
      unsetCallout: () => ReturnType;
    };
  }
}

const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      variant: {
        default: 'info',
        parseHTML: element => element.getAttribute('data-variant') || 'info',
        renderHTML: attributes => ({
          'data-variant': attributes.variant,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-callout]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-callout': '' }), 0];
  },

  addCommands() {
    return {
      setCallout:
        (attrs) =>
        ({ commands }) => {
          return commands.wrapIn(this.name, attrs);
        },
      toggleCallout:
        (attrs) =>
        ({ commands }) => {
          return commands.toggleWrap(this.name, attrs);
        },
      unsetCallout:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
    };
  },
});

// ─── Types ──────────────────────────────────────────────────────────────────

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: 'small' | 'medium' | 'large';
}

// ─── Constants ──────────────────────────────────────────────────────────────

const SPECIAL_CHARACTERS = [
  { char: '§', name: 'Section' },
  { char: '¶', name: 'Pilcrow' },
  { char: '©', name: 'Copyright' },
  { char: '®', name: 'Registered' },
  { char: '™', name: 'Trademark' },
  { char: '°', name: 'Degree' },
  { char: '±', name: 'Plus-minus' },
  { char: '×', name: 'Multiply' },
  { char: '÷', name: 'Divide' },
  { char: '—', name: 'Em dash' },
  { char: '–', name: 'En dash' },
  { char: '\u2018', name: 'Left single quote' },
  { char: '\u2019', name: 'Right single quote' },
  { char: '\u201C', name: 'Left double quote' },
  { char: '\u201D', name: 'Right double quote' },
  { char: '…', name: 'Ellipsis' },
  { char: '†', name: 'Dagger' },
  { char: '‡', name: 'Double dagger' },
  { char: '•', name: 'Bullet' },
];

const TEXT_COLORS = [
  '#000000', '#374151', '#6B7280', '#991B1B', '#B91C1C', '#DC2626',
  '#C2410C', '#D97706', '#CA8A04', '#15803D', '#0D9488', '#0369A1',
  '#1D4ED8', '#6D28D9', '#9333EA', '#BE185D',
];

const HIGHLIGHT_COLORS = [
  '#FEF3C7', '#FDE68A', '#FCA5A5', '#FECACA', '#BBF7D0', '#A7F3D0',
  '#BAE6FD', '#BFDBFE', '#DDD6FE', '#E9D5FF', '#FBCFE8', '#FED7AA',
];

const CALLOUT_VARIANTS = [
  { value: 'info', label: 'Info', icon: Info, bgClass: 'bg-blue-50', borderClass: 'border-blue-300', textClass: 'text-blue-800' },
  { value: 'warning', label: 'Warning', icon: AlertTriangle, bgClass: 'bg-yellow-50', borderClass: 'border-yellow-300', textClass: 'text-yellow-800' },
  { value: 'success', label: 'Success', icon: CheckCircle, bgClass: 'bg-green-50', borderClass: 'border-green-300', textClass: 'text-green-800' },
  { value: 'note', label: 'Note', icon: StickyNote, bgClass: 'bg-slate-50', borderClass: 'border-slate-300', textClass: 'text-slate-700' },
];

const heightMap = {
  small: '150px',
  medium: '250px',
  large: '350px',
};

// ─── ToolbarButton ──────────────────────────────────────────────────────────

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
  className = '',
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-text-muted hover:bg-bg-light-gray hover:text-text-primary'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-bg-slate mx-1 self-center" />;
}

// ─── Dropdown Wrapper ───────────────────────────────────────────────────────

function ToolbarDropdown({
  trigger,
  isOpen,
  onToggle,
  children,
  align = 'left',
}: {
  trigger: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  align?: 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as globalThis.Node)) {
        if (isOpen) onToggle();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={ref}>
      <div onClick={onToggle}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute z-50 mt-1 bg-white border border-bg-slate rounded-lg shadow-lg ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main Editor Component ──────────────────────────────────────────────────

export default function TipTapEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  className = '',
  minHeight = 'medium',
}: TipTapEditorProps) {
  const { user } = useAuth();
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlSource, setHtmlSource] = useState(value);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showToc, setShowToc] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSettingContent = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        codeBlock: false,
        horizontalRule: {},
        blockquote: {},
      }),
      Underline,
      Superscript,
      Subscript,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline hover:text-primary/80' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-lg max-w-full h-auto' },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: { class: 'border-collapse table-auto w-full' },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        HTMLAttributes: { class: 'rounded-lg overflow-hidden' },
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
      Callout,
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => {
      if (!isSettingContent.current) {
        const html = ed.getHTML();
        onChange(html);
      }
    },
  });

  // Sync external value changes into the editor
  useEffect(() => {
    if (!editor || isHtmlMode) return;
    const currentHTML = editor.getHTML();
    if (value !== currentHTML) {
      isSettingContent.current = true;
      editor.commands.setContent(value || '', { emitUpdate: false });
      isSettingContent.current = false;
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isHtmlMode) {
      setHtmlSource(value);
    }
  }, [isHtmlMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Dropdown toggle helper
  const toggleDropdown = useCallback(
    (name: string) => setOpenDropdown((prev) => (prev === name ? null : name)),
    []
  );

  const closeDropdowns = useCallback(() => setOpenDropdown(null), []);

  // ── Image upload using Amity R2 presigned URL pattern ─────────────────────
  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      if (file.size > 10 * 1024 * 1024) {
        alert('Image must be less than 10MB');
        return;
      }

      setIsUploadingImage(true);
      try {
        let uploadFile = file;
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          // Convert unsupported formats to JPEG
          const img = new window.Image();
          const reader = new FileReader();
          uploadFile = await new Promise<File>((resolve, reject) => {
            reader.onload = (event) => {
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('No canvas context'));
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(
                  (blob) => {
                    if (blob) resolve(new File([blob], `image-${Date.now()}.jpg`, { type: 'image/jpeg' }));
                    else reject(new Error('Conversion failed'));
                  },
                  'image/jpeg',
                  0.9
                );
              };
              img.onerror = reject;
              img.src = event.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }

        // Use Amity's R2 presigned URL pattern
        const { presignedUrl, publicUrl, filename } = await requestPresignedUrl(
          uploadFile.name,
          uploadFile.type
        );

        await uploadToR2(uploadFile, presignedUrl);

        // Save media metadata
        if (user) {
          await saveMediaMetadata(filename, publicUrl, uploadFile.type, uploadFile.size, user.id);
        }

        editor.chain().focus().setImage({ src: publicUrl, alt: file.name }).run();
      } catch (err) {
        console.error('Image upload error:', err);
        alert('Failed to upload image');
      } finally {
        setIsUploadingImage(false);
        if (imageInputRef.current) imageInputRef.current.value = '';
      }
    },
    [editor, user]
  );

  // ── File/document upload
  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      if (file.size > 25 * 1024 * 1024) {
        alert('File must be less than 25MB');
        return;
      }

      setIsUploadingFile(true);
      try {
        const { presignedUrl, publicUrl, filename } = await requestPresignedUrl(
          file.name,
          file.type
        );

        await uploadToR2(file, presignedUrl);

        if (user) {
          await saveMediaMetadata(filename, publicUrl, file.type, file.size, user.id);
        }

        editor
          .chain()
          .focus()
          .insertContent(
            `<p><a href="${publicUrl}" target="_blank" rel="noopener noreferrer">📎 ${file.name}</a></p>`
          )
          .run();
      } catch (err) {
        console.error('File upload error:', err);
        alert('Failed to upload file');
      } finally {
        setIsUploadingFile(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [editor, user]
  );

  // ── YouTube embed
  const handleYouTubeEmbed = useCallback(() => {
    if (!editor) return;
    const url = prompt('Enter YouTube URL:');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url, width: 640, height: 360 });
    }
    closeDropdowns();
  }, [editor, closeDropdowns]);

  // ── Link
  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href || '';
    const url = prompt('Enter URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  // ── Insert special character
  const insertSpecialChar = useCallback(
    (char: string) => {
      if (!editor) return;
      editor.chain().focus().insertContent(char).run();
      closeDropdowns();
    },
    [editor, closeDropdowns]
  );

  // ── Table of Contents
  const tocItems = useMemo(() => {
    if (!editor) return [];
    const items: { level: number; text: string; id: string }[] = [];
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        const text = node.textContent;
        items.push({ level: node.attrs.level, text, id: `heading-${pos}` });
      }
    });
    return items;
  }, [editor, editor?.state.doc]);

  // ── Callout
  const insertCallout = useCallback(
    (variant: string) => {
      if (!editor) return;
      editor.chain().focus().setCallout({ variant }).run();
      closeDropdowns();
    },
    [editor, closeDropdowns]
  );

  // ── Toggle HTML mode
  const toggleHtmlMode = useCallback(() => {
    if (isHtmlMode) {
      onChange(htmlSource);
      if (editor) {
        isSettingContent.current = true;
        editor.commands.setContent(htmlSource, { emitUpdate: false });
        isSettingContent.current = false;
      }
    } else {
      if (editor) {
        setHtmlSource(editor.getHTML());
      }
    }
    setIsHtmlMode(!isHtmlMode);
  }, [isHtmlMode, htmlSource, editor, onChange]);

  if (!editor) {
    return (
      <div className="border border-bg-slate rounded-lg p-8 text-center text-text-muted">
        Loading editor...
      </div>
    );
  }

  // ── HTML Source View
  if (isHtmlMode) {
    return (
      <div className={`tiptap-editor ${className}`}>
        <div className="border border-bg-slate rounded-lg overflow-hidden">
          <div className="bg-bg-light-gray border-b border-bg-slate px-3 py-2 flex items-center justify-between">
            <span className="text-tiny font-medium text-text-muted">HTML Source</span>
            <button
              type="button"
              onClick={toggleHtmlMode}
              className="flex items-center gap-1.5 px-3 py-1 text-tiny font-medium btn-primary rounded"
            >
              <Code className="w-3.5 h-3.5" />
              Visual
            </button>
          </div>
          <textarea
            value={htmlSource}
            onChange={(e) => {
              setHtmlSource(e.target.value);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full px-4 py-3 font-mono text-small bg-bg-light-gray text-text-primary outline-none resize-y"
            style={{ minHeight: heightMap[minHeight] }}
          />
        </div>
      </div>
    );
  }

  // ── Visual Editor
  return (
    <div className={`tiptap-editor ${className}`}>
      <div className="border border-bg-slate rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        {/* Toolbar */}
        <div className="bg-bg-light-gray border-b border-bg-slate px-2 py-1.5 flex flex-wrap items-center gap-0.5">
          {/* Headings */}
          <ToolbarDropdown
            trigger={
              <ToolbarButton onClick={() => {}} title="Headings" isActive={editor.isActive('heading')}>
                <Type className="w-4 h-4" />
              </ToolbarButton>
            }
            isOpen={openDropdown === 'headings'}
            onToggle={() => toggleDropdown('headings')}
          >
            <div className="py-1 w-48">
              <button
                type="button"
                className="w-full text-left px-3 py-1.5 text-small hover:bg-bg-light-gray flex items-center gap-2"
                onClick={() => { editor.chain().focus().setParagraph().run(); closeDropdowns(); }}
              >
                <Type className="w-4 h-4" /> Normal text
              </button>
              {([1, 2, 3, 4] as const).map((level) => {
                const icons = { 1: Heading1, 2: Heading2, 3: Heading3, 4: Heading4 };
                const Icon = icons[level];
                return (
                  <button
                    key={level}
                    type="button"
                    className={`w-full text-left px-3 py-1.5 text-small hover:bg-bg-light-gray flex items-center gap-2 ${
                      editor.isActive('heading', { level }) ? 'bg-primary/10 text-primary' : ''
                    }`}
                    onClick={() => {
                      editor.chain().focus().toggleHeading({ level }).run();
                      closeDropdowns();
                    }}
                  >
                    <Icon className="w-4 h-4" /> Heading {level}
                  </button>
                );
              })}
            </div>
          </ToolbarDropdown>

          <ToolbarDivider />

          {/* Text formatting */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold (⌘B)">
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic (⌘I)">
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline (⌘U)">
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editor.isActive('superscript')} title="Superscript">
            <SuperscriptIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} isActive={editor.isActive('subscript')} title="Subscript">
            <SubscriptIcon className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Colors */}
          <ToolbarDropdown
            trigger={
              <ToolbarButton onClick={() => {}} title="Text Color">
                <div className="flex flex-col items-center">
                  <Palette className="w-4 h-4" />
                  <div
                    className="w-4 h-0.5 rounded-full mt-0.5"
                    style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }}
                  />
                </div>
              </ToolbarButton>
            }
            isOpen={openDropdown === 'textColor'}
            onToggle={() => toggleDropdown('textColor')}
          >
            <div className="p-2 w-52">
              <div className="text-tiny font-medium text-text-muted mb-1.5">Text Color</div>
              <div className="grid grid-cols-8 gap-1">
                {TEXT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-5 h-5 rounded border border-bg-slate hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                    onClick={() => {
                      editor.chain().focus().setColor(color).run();
                      closeDropdowns();
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                className="mt-2 text-tiny text-text-muted hover:text-text-primary"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  closeDropdowns();
                }}
              >
                Reset color
              </button>
            </div>
          </ToolbarDropdown>

          <ToolbarDropdown
            trigger={
              <ToolbarButton onClick={() => {}} isActive={editor.isActive('highlight')} title="Highlight">
                <Highlighter className="w-4 h-4" />
              </ToolbarButton>
            }
            isOpen={openDropdown === 'highlight'}
            onToggle={() => toggleDropdown('highlight')}
          >
            <div className="p-2 w-52">
              <div className="text-tiny font-medium text-text-muted mb-1.5">Highlight Color</div>
              <div className="grid grid-cols-6 gap-1">
                {HIGHLIGHT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-6 h-6 rounded border border-bg-slate hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color }).run();
                      closeDropdowns();
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                className="mt-2 text-tiny text-text-muted hover:text-text-primary"
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  closeDropdowns();
                }}
              >
                Remove highlight
              </button>
            </div>
          </ToolbarDropdown>

          <ToolbarDivider />

          {/* Lists */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
            disabled={!editor.can().sinkListItem('listItem')}
            title="Indent"
          >
            <Indent className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().liftListItem('listItem').run()}
            disabled={!editor.can().liftListItem('listItem')}
            title="Outdent"
          >
            <Outdent className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Alignment */}
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justify">
            <AlignJustify className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Block elements */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
            <Minus className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
            <Code2 className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Link */}
          <ToolbarButton onClick={handleSetLink} isActive={editor.isActive('link')} title="Insert Link">
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>
          {editor.isActive('link') && (
            <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} title="Remove Link">
              <Unlink className="w-4 h-4" />
            </ToolbarButton>
          )}

          <ToolbarDivider />

          {/* Table */}
          <ToolbarDropdown
            trigger={
              <ToolbarButton onClick={() => {}} isActive={editor.isActive('table')} title="Table">
                <TableIcon className="w-4 h-4" />
              </ToolbarButton>
            }
            isOpen={openDropdown === 'table'}
            onToggle={() => toggleDropdown('table')}
          >
            <div className="py-1 w-56">
              {!editor.isActive('table') ? (
                <button
                  type="button"
                  className="w-full text-left px-3 py-1.5 text-small hover:bg-bg-light-gray flex items-center gap-2"
                  onClick={() => {
                    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                    closeDropdowns();
                  }}
                >
                  <Plus className="w-4 h-4" /> Insert 3×3 Table
                </button>
              ) : (
                <>
                  <button type="button" className="w-full text-left px-3 py-1.5 text-small hover:bg-bg-light-gray flex items-center gap-2" onClick={() => { editor.chain().focus().addColumnBefore().run(); closeDropdowns(); }}>
                    <ArrowLeft className="w-4 h-4" /> Add Column Before
                  </button>
                  <button type="button" className="w-full text-left px-3 py-1.5 text-small hover:bg-bg-light-gray flex items-center gap-2" onClick={() => { editor.chain().focus().addColumnAfter().run(); closeDropdowns(); }}>
                    <ArrowRight className="w-4 h-4" /> Add Column After
                  </button>
                  <button type="button" className="w-full text-left px-3 py-1.5 text-small hover:bg-bg-light-gray flex items-center gap-2" onClick={() => { editor.chain().focus().addRowBefore().run(); closeDropdowns(); }}>
                    <ArrowUp className="w-4 h-4" /> Add Row Before
                  </button>
                  <button type="button" className="w-full text-left px-3 py-1.5 text-small hover:bg-bg-light-gray flex items-center gap-2" onClick={() => { editor.chain().focus().addRowAfter().run(); closeDropdowns(); }}>
                    <ArrowDown className="w-4 h-4" /> Add Row After
                  </button>
                  <div className="border-t border-bg-slate my-1" />
                  <button type="button" className="w-full text-left px-3 py-1.5 text-small hover:bg-bg-light-gray flex items-center gap-2" onClick={() => { editor.chain().focus().deleteColumn().run(); closeDropdowns(); }}>
                    <Columns className="w-4 h-4" /> Delete Column
                  </button>
                  <button type="button" className="w-full text-left px-3 py-1.5 text-small hover:bg-bg-light-gray flex items-center gap-2" onClick={() => { editor.chain().focus().deleteRow().run(); closeDropdowns(); }}>
                    <Rows className="w-4 h-4" /> Delete Row
                  </button>
                  <button type="button" className="w-full text-left px-3 py-1.5 text-small text-red-600 hover:bg-red-50 flex items-center gap-2" onClick={() => { editor.chain().focus().deleteTable().run(); closeDropdowns(); }}>
                    <Trash2 className="w-4 h-4" /> Delete Table
                  </button>
                </>
              )}
            </div>
          </ToolbarDropdown>

          <ToolbarDivider />

          {/* Media */}
          <ToolbarButton
            onClick={() => imageInputRef.current?.click()}
            disabled={isUploadingImage}
            title={isUploadingImage ? 'Uploading...' : 'Insert Image'}
          >
            {isUploadingImage ? (
              <div className="w-4 h-4 border-2 border-bg-slate border-t-primary rounded-full animate-spin" />
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}
          </ToolbarButton>
          <ToolbarButton onClick={handleYouTubeEmbed} title="Embed YouTube">
            <YoutubeIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingFile}
            title={isUploadingFile ? 'Uploading...' : 'Upload Document'}
          >
            {isUploadingFile ? (
              <div className="w-4 h-4 border-2 border-bg-slate border-t-primary rounded-full animate-spin" />
            ) : (
              <FileUp className="w-4 h-4" />
            )}
          </ToolbarButton>

          <ToolbarDivider />

          {/* Special Characters */}
          <ToolbarDropdown
            trigger={
              <ToolbarButton onClick={() => {}} title="Special Characters">
                <Hash className="w-4 h-4" />
              </ToolbarButton>
            }
            isOpen={openDropdown === 'specialChars'}
            onToggle={() => toggleDropdown('specialChars')}
          >
            <div className="p-2 w-64">
              <div className="text-tiny font-medium text-text-muted mb-1.5">Special Characters</div>
              <div className="grid grid-cols-9 gap-1">
                {SPECIAL_CHARACTERS.map(({ char, name }) => (
                  <button
                    key={char}
                    type="button"
                    title={name}
                    className="w-7 h-7 flex items-center justify-center text-small rounded hover:bg-bg-light-gray border border-bg-slate transition-colors"
                    onClick={() => insertSpecialChar(char)}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>
          </ToolbarDropdown>

          {/* Callout */}
          <ToolbarDropdown
            trigger={
              <ToolbarButton onClick={() => {}} isActive={editor.isActive('callout')} title="Callout Box">
                <Info className="w-4 h-4" />
              </ToolbarButton>
            }
            isOpen={openDropdown === 'callout'}
            onToggle={() => toggleDropdown('callout')}
          >
            <div className="py-1 w-48">
              {CALLOUT_VARIANTS.map(({ value: variant, label, icon: Icon, textClass }) => (
                <button
                  key={variant}
                  type="button"
                  className={`w-full text-left px-3 py-1.5 text-small hover:bg-bg-light-gray flex items-center gap-2 ${textClass}`}
                  onClick={() => insertCallout(variant)}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
              {editor.isActive('callout') && (
                <>
                  <div className="border-t border-bg-slate my-1" />
                  <button
                    type="button"
                    className="w-full text-left px-3 py-1.5 text-small text-red-600 hover:bg-red-50 flex items-center gap-2"
                    onClick={() => {
                      editor.chain().focus().unsetCallout().run();
                      closeDropdowns();
                    }}
                  >
                    <Trash2 className="w-4 h-4" /> Remove Callout
                  </button>
                </>
              )}
            </div>
          </ToolbarDropdown>

          <ToolbarDivider />

          {/* TOC button */}
          <ToolbarButton onClick={() => setShowToc(!showToc)} isActive={showToc} title="Table of Contents">
            <List className="w-4 h-4" />
          </ToolbarButton>

          {/* Spacer */}
          <div className="flex-1" />

          {/* HTML toggle */}
          <ToolbarButton onClick={toggleHtmlMode} title="HTML Source">
            <Code className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* TOC Panel */}
        {showToc && tocItems.length > 0 && (
          <div className="bg-bg-light-gray border-b border-bg-slate px-4 py-2">
            <div className="text-tiny font-semibold text-text-muted uppercase tracking-wide mb-1">Table of Contents</div>
            <ul className="space-y-0.5">
              {tocItems.map((item, i) => (
                <li
                  key={i}
                  className="text-small text-primary hover:text-primary/80 cursor-pointer"
                  style={{ paddingLeft: `${(item.level - 1) * 16}px` }}
                  onClick={() => {
                    let pos = 0;
                    let found = false;
                    editor.state.doc.descendants((node, nodePos) => {
                      if (!found && node.type.name === 'heading' && node.textContent === item.text) {
                        pos = nodePos;
                        found = true;
                      }
                    });
                    if (found) {
                      editor.chain().focus().setTextSelection(pos + 1).run();
                    }
                  }}
                >
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        )}
        {showToc && tocItems.length === 0 && (
          <div className="bg-bg-light-gray border-b border-bg-slate px-4 py-2">
            <div className="text-tiny text-text-muted">No headings found. Add headings to generate a table of contents.</div>
          </div>
        )}

        {/* Editor Content */}
        <EditorContent
          editor={editor}
          className="tiptap-content prose max-w-none"
          style={{ minHeight: heightMap[minHeight] }}
        />

        {/* Word/Character Count */}
        <div className="bg-bg-light-gray border-t border-bg-slate px-3 py-1.5 flex items-center justify-between text-tiny text-text-muted">
          <div className="flex items-center gap-3">
            <span>{editor.storage.characterCount.words()} words</span>
            <span>{editor.storage.characterCount.characters()} characters</span>
          </div>
        </div>
      </div>

      {/* Bubble Menu for links */}
      {editor && editor.isActive('link') && (
        <TiptapBubbleMenu>
          <div className="bg-white border border-bg-slate rounded-lg shadow-lg px-2 py-1 flex items-center gap-1">
            <a
              href={editor.getAttributes('link').href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-tiny text-primary hover:text-primary/80 px-1 max-w-[200px] truncate"
            >
              {editor.getAttributes('link').href}
            </a>
            <button
              type="button"
              onClick={handleSetLink}
              className="p-1 text-text-muted hover:text-text-primary rounded"
              title="Edit Link"
            >
              <LinkIcon className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="p-1 text-text-muted hover:text-red-600 rounded"
              title="Remove Link"
            >
              <Unlink className="w-3 h-3" />
            </button>
          </div>
        </TiptapBubbleMenu>
      )}

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.csv,.zip"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
