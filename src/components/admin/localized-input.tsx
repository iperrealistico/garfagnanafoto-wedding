import { LocalizedString } from "@/lib/config-schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface LocalizedInputProps {
    value: LocalizedString;
    onChange: (val: LocalizedString) => void;
    label?: string;
    multiline?: boolean;
}

export function LocalizedInput({ value, onChange, label, multiline }: LocalizedInputProps) {
    return (
        <div className="space-y-2">
            {label && <Label>{label}</Label>}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <span className="text-xs text-muted-foreground mb-1 block">IT</span>
                    {multiline ? (
                        <Textarea
                            value={value.it}
                            onChange={(e) => onChange({ ...value, it: e.target.value })}
                        />
                    ) : (
                        <Input
                            value={value.it}
                            onChange={(e) => onChange({ ...value, it: e.target.value })}
                        />
                    )}
                </div>
                <div>
                    <span className="text-xs text-muted-foreground mb-1 block">EN</span>
                    {multiline ? (
                        <Textarea
                            value={value.en || ""}
                            onChange={(e) => onChange({ ...value, en: e.target.value })}
                        />
                    ) : (
                        <Input
                            value={value.en || ""}
                            onChange={(e) => onChange({ ...value, en: e.target.value })}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
