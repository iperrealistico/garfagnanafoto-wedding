import { Question } from "@/lib/config-schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface StepQuestionProps {
    question: Question;
    onAnswer: (val: boolean | string) => void;
    canGoBack: boolean;
    onBack: () => void;
    lang?: string;
    initialValue?: boolean | string;
}

import { getLocalized } from "@/lib/i18n-utils";

export function StepQuestion({
    question,
    onAnswer,
    canGoBack,
    onBack,
    lang = "it",
    initialValue
}: StepQuestionProps) {
    const [textValue, setTextValue] = useState(typeof initialValue === "string" ? initialValue : "");

    useEffect(() => {
        if (typeof initialValue === "string") {
            setTextValue(initialValue);
        } else {
            setTextValue("");
        }
    }, [question.id, initialValue]);

    const isText = question.type === "text";

    return (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-4">
                {canGoBack ? (
                    <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-400 hover:text-gray-900 px-0">
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        {lang === 'it' ? 'Indietro' : 'Back'}
                    </Button>
                ) : <div />}
            </div>
            <CardContent className="p-10 flex flex-col items-center text-center space-y-8">
                <div className="space-y-4 w-full">
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                        {getLocalized(question.questionText, lang)}
                    </h2>
                    {question.placeholder && (
                        <p className="text-gray-500 text-sm">
                            {getLocalized(question.placeholder, lang)}
                        </p>
                    )}
                </div>

                {isText ? (
                    <div className="w-full max-w-md space-y-4">
                        <Input
                            value={textValue}
                            onChange={(e) => setTextValue(e.target.value)}
                            placeholder={lang === 'it' ? "Scrivi qui..." : "Type here..."}
                            className="h-14 text-lg border-2 focus:ring-[#719436]"
                            autoFocus
                        />
                        <Button
                            className="w-full h-14 text-lg"
                            disabled={question.required && !textValue.trim()}
                            onClick={() => onAnswer(textValue)}
                        >
                            {lang === 'it' ? 'Continua' : 'Continue'}
                            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-20 text-xl hover:bg-gray-100 border-2 rounded-2xl transition-all"
                            onClick={() => onAnswer(false)}
                        >
                            {getLocalized(question.noLabel, lang)}
                        </Button>
                        <Button
                            size="lg"
                            className="h-20 text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all"
                            onClick={() => onAnswer(true)}
                        >
                            {getLocalized(question.yesLabel, lang)}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
