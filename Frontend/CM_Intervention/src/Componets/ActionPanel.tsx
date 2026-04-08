import { rcStyles } from "../Static/rockClimbingStyles";
import { Title } from "./Layout";

// ActionPanel component.
type ActionSpec = {
    id: string;
    key?: React.Key;
    className?: string;
    label: string;
    icon?: string;
    desc?: string;
    action: () => void;
};

type ActionPanelProps = {
    id?: string;
    key?: React.Key;
    title?: string;
    actions: Array<ActionSpec>;
};

function ActionPanel({ id, key, title, actions }: ActionPanelProps) {
    return (
        <>
            {title !== undefined && <Title>{title}</Title>}
            <section className={rcStyles.buttonGroup} id={id} key={key}>
                {actions.map((action) => (
                    <button
                        key={action.key}
                        className={`${rcStyles.button} ${action.className ?? ""}`}
                        onClick={action.action}
                    >
                        {action.icon === undefined ? (
                            <></>
                        ) : (
                            <>{action.icon} </>
                        )}
                        <>{action.desc ?? action.label}</>
                    </button>
                ))}
            </section>
        </>
    );
}

export { ActionPanel, ActionSpec };
