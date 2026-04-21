const ACTION_BUTTON_STYLE: "dylan" | "kelly" = "dylan";

import { useSyncExternalStore } from "react";
import { s } from "../Static/officestyles";
import { rcStyles } from "../Static/rockClimbingStyles";
import { addClassNameToProps, SecondaryButton, Title } from "./Layout";

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

const _buttonStyleSettingListeners = new Set<() => void>();
function useButtonStyleSetting() {
    const COOKIE_NAME = "cm_intervention_buttonStyle";

    type ButtonStyle = typeof ACTION_BUTTON_STYLE | undefined;

    function setButtonStyleSetting(name: ButtonStyle) {
        if (name == undefined) {
            localStorage.removeItem(COOKIE_NAME);
        } else {
            localStorage.setItem(COOKIE_NAME, name);
        }
        for (const listener of _buttonStyleSettingListeners) {
            listener();
        }
    }
    const buttonStyleSetting = useSyncExternalStore<ButtonStyle>(
        (onStoreChange) => {
            function storageEventListener(event: StorageEvent) {
                if (
                    event.storageArea === localStorage &&
                    event.key == COOKIE_NAME
                ) {
                    onStoreChange();
                }
            }
            window.addEventListener("storage", storageEventListener);
            _buttonStyleSettingListeners.add(onStoreChange);

            function unsubscribe() {
                window.removeEventListener("storage", storageEventListener);
                _buttonStyleSettingListeners.delete(onStoreChange);
            }
            return unsubscribe;
        },
        () => localStorage.getItem(COOKIE_NAME) as ButtonStyle,
        () => undefined,
    );
    return [buttonStyleSetting, setButtonStyleSetting] as const;
}

export function ActionPanelButtonStyleToggle() {
    const [buttonStyleSetting, setButtonStyleSetting] = useButtonStyleSetting();
    function onClick() {
        const buttonStyle = buttonStyleSetting ?? ACTION_BUTTON_STYLE;
        switch (buttonStyle) {
            default:
                buttonStyle satisfies never;
                console.warn(
                    "unrecognized action button style setting",
                    buttonStyleSetting,
                );
            case "dylan":
                setButtonStyleSetting("kelly");
                break;
            case "kelly":
                setButtonStyleSetting("dylan");
                break;
        }
    }
    return (
        <SecondaryButton onClick={onClick}>Toggle Button Style</SecondaryButton>
    );
}

export function ActionPanel({
    title,
    actions,
    buttonStyle,
    ...otherProps
}: {
    title?: React.ReactNode;
    actions: Array<ActionSpec>;
    buttonStyle?: typeof ACTION_BUTTON_STYLE;
} & Omit<
    React.ComponentPropsWithoutRef<"section">,
    "children" | "title" | "actions" | "buttonStyle"
>) {
    const [buttonStyleSetting, _setButtonStyleSetting] =
        useButtonStyleSetting();

    buttonStyle ??= buttonStyleSetting;
    buttonStyle ??= ACTION_BUTTON_STYLE;

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
