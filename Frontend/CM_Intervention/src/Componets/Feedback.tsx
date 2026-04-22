import { rcStyles } from "../Static/rockClimbingStyles";
import { Paragraph } from "./Layout";

/**
 * A set of generic positive feedback phrases.
 */
const POSITIVE_FEEDBACK_MESSAGES: readonly string[] = [
    "Good job!",
    "Well done!",
    "Awesome!",
    "Great work!",
    "Way to go!",
    "Congratulations!",
];

/**
 * A set of generic negative feedback phrases.
 */
const NEGATIVE_FEEDBACK_MESSAGES: readonly string[] = ["Oh no!", "Uh oh!"];

/**
 * Pick a random element from an array.
 * 
 * @param array The array to pick random elements from.
 * @returns The random element.
 */
function randomElement<T>(array: readonly T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a positive feedback message to display to the user, either generic or with some custom message.
 * 
 * @param message The custom message.
 * @returns The feedback message.
 */
function positiveFeedback(message?: string): string {
    if (message === undefined) return randomElement(POSITIVE_FEEDBACK_MESSAGES);
    return `${randomElement(POSITIVE_FEEDBACK_MESSAGES)} ${message}`;
}

/**
 * Generate a negative feedback message to display to the user, either generic or with some custom message.
 * 
 * @param message The custom message.
 * @returns The feedback message.
 */
function negativeFeedback(message?: string): string {
    if (message === undefined) return randomElement(NEGATIVE_FEEDBACK_MESSAGES);
    return `${randomElement(NEGATIVE_FEEDBACK_MESSAGES)} ${message}`;
}

type FeedbackProps = { feedback: string | undefined };

/**
 * A React component to display a feedback subtitle.
 * 
 * @param {Object} props The React component's props.
 * @param props.feedback The feedback text.
 * @returns The React component.
 */
function Feedback({ feedback }: FeedbackProps) {
    return (
        <>
            {feedback != undefined && (
                <Paragraph key={feedback}>{feedback}</Paragraph>
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
