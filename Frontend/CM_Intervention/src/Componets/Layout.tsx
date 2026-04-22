// Layout and prose components: headings, paragraphs.

import { s } from "../Static/officestyles";
import { rcStyles } from "../Static/rockClimbingStyles";

/**
 * A helper type for a custom React component that takes a few custom props, and passes the rest of the props to an underlying built-in component.
 */
type InheritProps<
    InheritedElement extends React.ElementType,
    NewProps extends Record<string, any> = {},
> = Omit<React.ComponentPropsWithoutRef<InheritedElement>, keyof NewProps> &
    NewProps;

/**
 * Given an existing set of React props, add a class name to the `className` prop.
 * If the `className` prop doesn't exist, it becomes the given class name, otherwise the class name is added to the list of existing class names.
 * 
 * @param props The existing props.
 * @param className The class name to add.
 * @returns The props with the class name.
 */
export function addClassNameToProps<T extends { className?: string } & object>(
    props: T,
    className: string,
): T {
    return { ...props, className: `${className} ${props.className ?? ""}` };
}

/**
 * A React component for the root of an activity page.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function Container(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.container)} />;
}

/**
 * A React component for the top row within a `Container`.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function TopRow(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.topRow)} />;
}

/**
 * A React component for a section within a `Container`.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function Section(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.section)} />;
}

/**
 * A React component for a title within a `Container` or `Section`.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function Title(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.title)} />;
}

/**
 * A React component for a main title of an activity, normally within a `Header`.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function MainTitle(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.mainTitle)} />;
}

/**
 * A React component for an activity "scene pill", normally within a `Header`.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function ScenePill(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.scenePill)} />;
}

/**
 * A React component for a subtitle, normally within a `Section` below a `Title`.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function Subtitle(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.subtitle)} />;
}

/**
 * A React component for a paragraph.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function Paragraph(props: InheritProps<"p">) {
    return <p {...addClassNameToProps(props, rcStyles.paragraph)} />;
}

/**
 * A React component for a `Header`, normally the first child of a `Container`.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function Header(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.header)} />;
}

/**
 * A React component for the left side of a `Header`.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function HeaderLeft(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.headerLeft)} />;
}

/**
 * A React component for the right side of a `Header`.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function HeaderRight(props: InheritProps<"div">) {
    return (
        <div
            {...addClassNameToProps(
                props,
                "flex flex-wrap items-center gap-2 justify-end",
            )}
        />
    );
}

/**
 * A React component for the main subtitle of a `Container`, normally within a `Header` below a `MainTitle`.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function HeaderSubtitle(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.headerSubtitle)} />;
}

/**
 * A React component for a generic button.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function Button(props: InheritProps<"button">) {
  return <button {...addClassNameToProps(props, rcStyles.button)} />;
}

/**
 * A React component for a generic primary button, sometimes next to a `SecondaryButton`.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function PrimaryButton(props: InheritProps<"button">) {
    return <button {...addClassNameToProps(props, rcStyles.primaryButton)} />;
}

/**
 * A React component for a generic secondary button, sometimes next to a `PrimaryButton`.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function SecondaryButton(props: InheritProps<"button">) {
    return <button {...addClassNameToProps(props, rcStyles.secondaryButton)} />;
}

/**
 * A React component for the reset button of an activity.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function ResetButton(props: InheritProps<"button">) {
    return (
        <button {...addClassNameToProps(props, rcStyles.resetButton)}>
            {"children" in props ? props.children : <>Reset</>}
        </button>
    );
}

/**
 * A React component for the back button of an activity.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function BackButton(props: InheritProps<"button">) {
    return (
        <SecondaryButton {...props}>
            {"children" in props ? props.children : <>Back</>}
        </SecondaryButton>
    );
}

/**
 * A React component for an italic paragraph. An italic variant of `Paragraph`.
 * 
 * @param {Object} props The underlying built-in component's props.
 * @returns The React component.
 */
export function ParagraphItalic(props: InheritProps<"p">) {
  return <p {...addClassNameToProps(props, s.paragraphItalic)} />;
}
