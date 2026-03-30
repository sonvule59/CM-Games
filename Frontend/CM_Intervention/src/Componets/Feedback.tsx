const POSITIVE_FEEDBACK_MESSAGES: readonly string[] = [
    "Good job!",
    "Well done!",
    "Awesome!",
    "Great work!",
    "Way to go!",
    "Congratulations!",
];
const NEGATIVE_FEEDBACK_MESSAGES: readonly string[] = ["Oh no!", "Uh oh!"];

function randomElement<T>(array: readonly T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function positiveFeedback(message: string): string {
    return `${randomElement(POSITIVE_FEEDBACK_MESSAGES)} ${message}`;
}

function negativeFeedback(message: string): string {
    return `${randomElement(NEGATIVE_FEEDBACK_MESSAGES)} ${message}`;
}

type FeedbackProps = { feedback: string | undefined };

function Feedback({ feedback }: FeedbackProps) {
    return (
        <>
            {feedback != undefined && (
                <div className="og-feedback" key={feedback}>
                    {feedback}
                </div>
            )}
        </>
    );
}

export {
    Feedback,
    randomElement,
    positiveFeedback,
    negativeFeedback,
    POSITIVE_FEEDBACK_MESSAGES,
    NEGATIVE_FEEDBACK_MESSAGES,
};
