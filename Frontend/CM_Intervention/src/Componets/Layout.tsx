// Layout and prose components: headings, paragraphs.

import { rcStyles } from "../Static/rockClimbingStyles";

export function addClassNameToProps<T extends { className?: string } & object>(
    props: T,
    className: string,
): T {
    return { ...props, className: `${className} ${props.className ?? ""}` };
}

export function Container(props: React.ComponentPropsWithoutRef<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.container)} />;
}

export function TopRow(props: React.ComponentPropsWithoutRef<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.topRow)} />;
}

export function Section(props: React.ComponentPropsWithoutRef<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.section)} />;
}

export function Title(props: React.ComponentPropsWithoutRef<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.title)} />;
}

export function Subtitle(props: React.ComponentPropsWithoutRef<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.subtitle)} />;
}

export function Paragraph(props: React.ComponentPropsWithoutRef<"p">) {
    return <p {...addClassNameToProps(props, rcStyles.paragraph)} />;
}

export function Header(props: React.ComponentPropsWithoutRef<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.header)} />;
}

export function HeaderLeft(props: React.ComponentPropsWithoutRef<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.headerLeft)} />;
}

export function HeaderSubtitle(props: React.ComponentPropsWithoutRef<"div">) {
    return <div {...addClassNameToProps(props, rcStyles.headerSubtitle)} />;
}

export function Button(
    props: { isPrimary?: boolean } & React.ComponentPropsWithoutRef<"button">,
) {
    return (
        <button
            {...addClassNameToProps(
                props,
                (props.isPrimary ?? true)
                    ? rcStyles.primaryButton
                    : rcStyles.secondaryButton,
            )}
        />
    );
}

export function PrimaryButton(props: React.ComponentPropsWithoutRef<"button">) {
    return <Button {...props} isPrimary={true} />;
}

export function SecondaryButton(
    props: React.ComponentPropsWithoutRef<"button">,
) {
    return <Button {...props} isPrimary={false} />;
}
