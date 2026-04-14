// Layout and prose components: headings, paragraphs.

import { rcStyles } from "../Static/rockClimbingStyles";

type InheritProps<
    InheritedElement extends React.ElementType,
    NewProps extends Record<string, any> = {},
> = Omit<React.ComponentPropsWithoutRef<InheritedElement>, keyof NewProps> &
    NewProps;

export function addClassNameToProps<T extends { className?: string } & object>(
    props: T,
    className: string,
): T {
    return { ...props, className: `${className} ${props.className ?? ""}` };
}

export function Container(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.container)} />;
}

export function TopRow(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.topRow)} />;
}

export function Section(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.section)} />;
}

export function Title(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.title)} />;
}

export function MainTitle(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.mainTitle)} />;
}

export function ScenePill(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.scenePill)} />;
}

export function Subtitle(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.subtitle)} />;
}

export function Paragraph(props: InheritProps<"p">) {
    return <p {...addClassNameToProps(props, rcStyles.paragraph)} />;
}

export function Header(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.header)} />;
}

export function HeaderLeft(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.headerLeft)} />;
}

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

export function HeaderSubtitle(props: InheritProps<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.headerSubtitle)} />;
}

export function Button({
    isPrimary,
    ...props
}: InheritProps<"button", { isPrimary?: boolean }>) {
    return (
        <button
            {...addClassNameToProps(
                props,
                (isPrimary ?? true)
                    ? rcStyles.primaryButton
                    : rcStyles.secondaryButton,
            )}
        />
    );
}

export function PrimaryButton(props: InheritProps<"button">) {
    return <Button {...props} isPrimary={true} />;
}

export function SecondaryButton(props: InheritProps<"button">) {
    return <Button {...props} isPrimary={false} />;
}

export function ResetButton(props: InheritProps<"button">) {
    return (
        <button {...addClassNameToProps(props, rcStyles.resetButton)}>
            {"children" in props ? props.children : <>Reset</>}
        </button>
    );
}

export function BackButton(props: InheritProps<"button">) {
    return (
        <SecondaryButton>
            {"children" in props ? props.children : <>Back</>}
        </SecondaryButton>
    );
}
