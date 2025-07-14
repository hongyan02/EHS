"use client";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function Page() {
    return (
        <div className="min-h-screen w-full overflow-y-auto">
            <SimpleEditor />
        </div>
    );
}
