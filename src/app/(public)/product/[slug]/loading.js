import { Loader2 } from "lucide-react";

export default function ProductLoading() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-boutique-bg">
            <Loader2 className="w-8 h-8 text-boutique-rose animate-spin" />
            <p className="text-xs uppercase tracking-[0.2em] text-boutique-taupe font-medium">
                Loading outfit…
            </p>
        </div>
    );
}
