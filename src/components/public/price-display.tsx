import { cn } from "@/lib/utils";

interface PriceDisplayProps {
    priceNet: number;
    vatRate: number;
    className?: string;
    large?: boolean;
}

export function PriceDisplay({ priceNet, vatRate, className, large = false }: PriceDisplayProps) {
    const vatAmount = priceNet * vatRate;
    const priceGross = priceNet + vatAmount;

    return (
        <div className={cn("flex flex-col items-start", className)}>
            <span className={cn("font-bold text-gray-900", large ? "text-4xl" : "text-xl")}>
                €{priceNet.toLocaleString("it-IT", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                <span className="text-sm font-normal text-gray-500 ml-1">+ IVA</span>
            </span>
            {/* Optional: Show gross price in tooltip or small text? Requirement: "Prices must always be shown NET of VAT (IVA). VAT can be shown separately as +22% by default." */}
            {/* We just show Net + IVA label. Maybe show gross in small text if helpful, but 'Net' is primary. */}
        </div>
    );
}
