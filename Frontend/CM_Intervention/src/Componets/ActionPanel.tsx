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

/**
 * The type of an action item within a list passed to `ActionPanel`.
 * 
 * Properties:
 * @property {React.Key} id (or key) An identifier, unique within the list, for the action. This is usually a string, but can be JSX.
 * @property {React.ReactNode} label (or name) The displayed name of the action. This is usually a string, but can be JSX.
 * @property {React.ReactNode} icon The displayed icon of the action. This is usually an emoji, but can be any text or JSX.
 * @property {React.ReactNode} desc The description text displayed beside the name. This is usually a string, but can be JSX.
 * @property {boolean} [isPrimary=true] Whether or not the action button should be given special highlighting or emphasis.
 * @property {() => void} callback (or action or onClick): A callback invoked when the action button is clicked.
 */
export type ActionSpec = ({ id: string } | { key: React.Key }) &
    ({ label: React.ReactNode } | { name: React.ReactNode }) & {
        icon?: React.ReactNode;
    } & { desc?: React.ReactNode } & { isPrimary?: boolean } & (
        | { callback: () => void }
        | { action: () => void }
        | { onClick: () => void }
    ) &
    Partial<ButtonEventListeners>;

/**
 * `ActionSpec` is intentionally permissive in its property names to facilitate use by multiple programmers.
 * Therefore, this function exists to parse a list of `ActionSpec` to a more standardized internal format.
 * It also emits warnings to the browser console for malformed `ActionSpec` objects.
 * 
 * @param actions The list (iterable) of user-provided `ActionSpec` objects.
 * @returns An iterable of internal action objects.
 */
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
/**
 * Get or set the current button style setting, which applies throughout the entire application, and is stored in the browser's local storage.
 * 
 * @returns The current button style setting, and a function to change the button style setting.
 */
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

/**
 * A React component that lets the user switch the button style setting.
 * 
 * @returns The React component.
 */
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

/**
 * A React component to display a list of action buttons.
 * 
 * See the documentation of the `ActionSpec` type for how to specify the action buttons.
 * 
 * @param {Object} props The React component's props. In addition to the ones explicitly documented, generic HTML properties, such as `className`, are also supported.
 * @param props.title An optional title text to display above the actions.
 * @param props.actions The list of actions.
 * @param props.buttonStyle An optional override of the button style. Normally, the button style is consistent throughout the application.
 * @returns The React component.
 */
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

/**
 * A React component to display a list of action buttons.
 * 
 * Unlike `ActionPanel`, `SecondaryActionPanel` is usually used for response buttons, such as "Continue" or "Go Back".
 * 
 * See the documentation of the `ActionSpec` type for how to specify the action buttons.
 * 
 * @param {Object} props The React component's props. In addition to the ones explicitly documented, generic HTML properties, such as `className`, are also supported.
 * @param props.title An optional title text to display above the actions.
 * @param props.actions The list of actions.
 * @returns The React component.
 */
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
