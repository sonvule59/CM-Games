import { rcStyles } from "../Static/rockClimbingStyles";

// ActionPanel component.
type ActionSpec = {
    id: string;
    className?: string;
    label: string;
    icon?: string;
    desc?: string;
    action: () => void;
};

type ActionPanelProps = {
    id?: string;
    title?: string;
    tasks: Array<ActionSpec>;
};

function ActionPanel({ id, title, tasks }: ActionPanelProps) {
    return (
        <>
            {title !== undefined && (
                <div className={rcStyles.title}>{title}</div>
            )}
            <section className={rcStyles.buttonGroup} id={id}>
                {tasks.map((task) => (
                    <button
                        key={task.id}
                        className={`${rcStyles.button} ${task.className ?? ""}`}
                        onClick={task.action}
                    >
                        {task.icon === undefined ? <></> : <>{task.icon} </>}
                        <>{task.desc ?? task.label}</>
                    </button>
                ))}
            </section>
        </>
    );
}

export { ActionPanel, ActionSpec };
