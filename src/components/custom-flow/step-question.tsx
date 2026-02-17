import { Question } from "@/lib/config-schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface StepQuestionProps {
    question: Question;
    onAnswer: (val: boolean) => void;
    canGoBack: boolean;
    onBack: () => void;
}

export function StepQuestion({ question, onAnswer, canGoBack, onBack }: StepQuestionProps) {
    return (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-10 flex flex-col items-center text-center space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">{question.questionText}</h2>

                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <Button
                        variant="outline"
                        size="lg"
                        className="h-16 text-lg hover:bg-gray-100"
                        onClick={() => onAnswer(false)}
                    >
                        {question.noLabel}
                    </Button>
                    <Button
                        size="lg"
                        className="h-16 text-lg"
                        onClick={() => onAnswer(true)}
                    >
                        {question.yesLabel}
                    </Button>
                </div>

                {canGoBack && (
                    <Button variant="ghost" size="sm" onClick={onBack} className="absolute top-4 left-4 text-gray-400 hover:text-gray-900">
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Indietro
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
