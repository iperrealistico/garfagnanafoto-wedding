import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Package } from "@/lib/config-schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "./price-display";
import { cn } from "@/lib/utils";
import { getLocalized } from "@/lib/i18n-utils";

interface PackageCardProps {
    pkg: Package;
    vatRate: number;
    href: string;
    isPopular?: boolean;
    lang?: string;
}

export function PackageCard({ pkg, vatRate, href, isPopular, lang = "it" }: PackageCardProps) {
    // Calculate total net for fixed package defaults
    const subtotal = pkg.lineItems.reduce((sum, item) => sum + item.priceNet, 0);
    const totalNet = Math.max(0, subtotal + pkg.packageAdjustmentNet);

    return (
        <Card className={cn("flex flex-col h-full relative", isPopular && "border-black shadow-lg")}>
            {isPopular && (
                <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Consigliato
                </div>
            )}
            <CardHeader>
                <CardTitle>{getLocalized(pkg.name, lang)}</CardTitle>
                <CardDescription>{getLocalized(pkg.tagline, lang)}</CardDescription>
                <div className="mt-4">
                    <PriceDisplay priceNet={totalNet} vatRate={vatRate} large />
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-gray-600 mb-4 h-12">{getLocalized(pkg.description, lang)}</p>
                <ul className="space-y-2">
                    {pkg.lineItems.map((item) => (
                        <li key={item.id} className="flex items-start text-sm text-gray-700">
                            <FontAwesomeIcon icon={faCheck} className="text-green-600 mt-1 mr-2 w-4 h-4" />
                            <span>{getLocalized(item.label, lang)}</span>
                        </li>
                    ))}
                    {pkg.packageAdjustmentNet < 0 && (
                        <li className="flex items-start text-sm text-green-700 font-medium">
                            <FontAwesomeIcon icon={faCheck} className="text-green-600 mt-1 mr-2 w-4 h-4" />
                            <span>Sconto pacchetto applicato</span>
                        </li>
                    )}
                </ul>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full" variant={isPopular ? "default" : "outline"}>
                    <Link href={href}>Scegli {getLocalized(pkg.name, lang)}</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

