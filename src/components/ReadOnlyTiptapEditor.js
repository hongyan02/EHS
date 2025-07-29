"use client";
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";

// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension.js";
import { Selection } from "@/components/tiptap-extension/selection-extension.js";
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension.js";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";
import "./ReadOnlyTiptapEditor.scss";

// --- Lib ---
import { MAX_FILE_SIZE } from "@/lib/tiptap-utils";

/**
 * 只读Tiptap编辑器组件
 * 用于显示HTML格式的内容，不显示工具栏
 * @param {Object} props - 组件属性
 * @param {string} props.content - HTML内容
 * @param {string} props.className - 自定义样式类名
 * @returns {JSX.Element} 只读Tiptap编辑器组件
 */
function ReadOnlyTiptapEditor({ content = "", className = "" }) {
    // 初始化只读富文本编辑器
    const editor = useEditor({
        immediatelyRender: false,
        editable: false, // 设置为只读模式
        editorProps: {
            attributes: {
                "aria-label": "Read-only content area.",
            },
        },
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Underline,
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Image,
            Typography,
            Superscript,
            Subscript,
            Selection,
            ImageUploadNode.configure({
                accept: "image/*",
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: () => Promise.reject("Upload disabled in read-only mode"),
                onError: () => {},
            }),
            TrailingNode,
            Link.configure({ openOnClick: true }), // 允许点击链接
        ],
        content: content,
    });

    // 当content prop变化时更新编辑器内容
    React.useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [editor, content]);

    if (!editor) {
        return null;
    }

    return (
        <div className={`read-only-tiptap-editor ${className}`}>
            <div className="content-wrapper">
                <EditorContent
                    editor={editor}
                    role="presentation"
                    className="simple-editor-content"
                    style={{ 
                        maxWidth: "none", 
                        minHeight: "auto",
                        padding: "0" // 移除默认padding
                    }}
                />
            </div>
        </div>
    );
}

ReadOnlyTiptapEditor.displayName = "ReadOnlyTiptapEditor";

export default ReadOnlyTiptapEditor;