const ACTION_BUTTON_STYLE: "dylan" | "kelly" = "dylan";

import { s } from "../Static/officestyles";
import { rcStyles } from "../Static/rockClimbingStyles";
import { addClassNameToProps, Title } from "./Layout";

type ButtonProps = React.ComponentPropsWithoutRef<"button">;
type ButtonEventListeners = {
    -readonly [K in keyof ButtonProps &
        `on${Capitalize<string>}`]-?: NonNullable<ButtonProps[K]>;
};

export type ActionSpec = ({ id: string } | { key: React.Key }) &
    ({ label: React.ReactNode } | { name: React.ReactNode }) & {
        icon?: React.ReactNode;
    } & { desc?: React.ReactNode } & { isPrimary?: boolean } & (
        | { callback: () => void }
        | { action: () => void }
        | { onClick: () => void }
    ) &
    Partial<ButtonEventListeners>;

function* parseActionSpecs(actions: Iterable<ActionSpec>) {
    const seenActionKeys: Set<React.Key> = new Set();
    for (const actionSpec of actions) {
        const eventListeners: Partial<ButtonEventListeners> = {};
        for (const property in actionSpec) {
            if (
                property.startsWith("on") &&
                property.charAt(3) == property.charAt(3).toUpperCase()
            ) {
                eventListeners[property as keyof ButtonEventListeners] =
                    actionSpec[property as keyof ButtonEventListeners] as any;
            }
        }
        const action = {
            key: "key" in actionSpec ? actionSpec.key : actionSpec.id,
            icon: actionSpec.icon,
            label: "label" in actionSpec ? actionSpec.label : actionSpec.name,
            desc: actionSpec.desc,
            callback:
                "callback" in actionSpec
                    ? actionSpec.callback
                    : "action" in actionSpec
                      ? actionSpec.action
                      : actionSpec.onClick,
            eventListeners,
            isPrimary: actionSpec.isPrimary ?? true,
        };
        switch (+("key" in actionSpec) + +("id" in actionSpec)) {
            case 0:
                console.warn("no action key");
                break;
            default:
                console.warn("action key overdetermined:", action.key);
            case 1:
                if (action.key == undefined)
                    console.warn("undefined action key");
                else {
                    if (seenActionKeys.has(action.key))
                        console.warn("duplicate action key:", action.key);
                    seenActionKeys.add(action.key);
                }
        }
        if (!("icon" in actionSpec))
            console.warn("no action icon:", action.key);
        switch (+("label" in actionSpec) + +("name" in actionSpec)) {
            case 0:
                console.warn("no action label:", action.key);
                break;
            default:
                console.warn("action label overdetermined:", action.key);
            case 1:
        }
        if (!("desc" in actionSpec))
            console.warn("no action desc:", action.key);
        switch (
            +("callback" in actionSpec) +
            +("action" in actionSpec) +
            +("onClick" in actionSpec)
        ) {
            case 0:
                console.warn("no action callback:", action.key);
                break;
            default:
                console.warn("action callback overdetermined:", action.key);
            case 1:
                if (action.callback == undefined)
                    console.warn("undefined action callback");
        }
        yield action;
    }
}

export function ActionPanel({
    title,
    actions,
    buttonStyle = ACTION_BUTTON_STYLE,
    ...otherProps
}: {
    title?: React.ReactNode;
    actions: Array<ActionSpec>;
    buttonStyle?: typeof ACTION_BUTTON_STYLE;
} & Omit<
    React.ComponentPropsWithoutRef<"section">,
    "children" | "title" | "actions" | "buttonStyle"
>) {
    switch (buttonStyle) {
        default:
            buttonStyle satisfies never;
            console.warn("unrecognized action button style", buttonStyle);
        case "dylan":
            return (
                <>
                    {title != undefined && <Title>{title}</Title>}
                    <section
                        {...addClassNameToProps(
                            otherProps,
                            rcStyles.buttonGroup,
                        )}
                    >
                        {Array.from(
                            parseActionSpecs(actions),
                            ({
                                key,
                                icon,
                                label,
                                desc,
                                callback,
                                eventListeners,
                                isPrimary,
                            }) => (
                                <button
                                    key={key}
                                    className={rcStyles.button}
                                    onClick={callback}
                                    {...eventListeners}
                                >
                                    {label ?? desc}
                                </button>
                            ),
                        )}
                    </section>
                </>
            );
        case "kelly":
            return (
                <>
                    {title != undefined && <Title>{title}</Title>}
                    <section {...addClassNameToProps(otherProps, s.taskGrid)}>
                        {Array.from(
                            parseActionSpecs(actions),
                            ({
                                key,
                                icon,
                                label,
                                desc,
                                callback,
                                eventListeners,
                                isPrimary,
                            }) => (
                                <button
                                    key={key}
                                    className={s.taskCard}
                                    onClick={callback}
                                    {...eventListeners}
                                >
                                    {icon != undefined && (
                                        <span className={s.taskIcon}>
                                            {icon}
                                        </span>
                                    )}
                                    {label != undefined && (
                                        <span className={s.taskName}>
                                            {label}
                                        </span>
                                    )}
                                    {desc != undefined && (
                                        <span className={s.taskDesc}>
                                            {desc}
                                        </span>
                                    )}
                                </button>
                            ),
                        )}
                    </section>
                </>
            );
    }
}

export function SecondaryActionPanel({
    title,
    actions,
    ...otherProps
}: {
    title?: React.ReactNode;
    actions: Array<ActionSpec>;
} & Omit<
    React.ComponentPropsWithoutRef<"section">,
    "children" | "title" | "actions"
>) {
    return (
        <>
            {title != undefined && <Title>{title}</Title>}
            <section {...addClassNameToProps(otherProps, s.buttonRow)}>
                {Array.from(
                    parseActionSpecs(actions),
                    ({
                        key,
                        icon,
                        label,
                        desc,
                        callback,
                        eventListeners,
                        isPrimary,
                    }) => (
                        <button
                            key={key}
                            className={`${
                                isPrimary ? s.primaryButton : s.secondaryButton
                            } flex-1`}
                            onClick={callback}
                            {...eventListeners}
                        >
                            {label ?? desc}
                        </button>
                    ),
                )}
            </section>
        </>
    );
}
