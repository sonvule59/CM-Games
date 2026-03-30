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
    title: string;
    tasks: Array<ActionSpec>;
};

function ActionPanel({ id, title, tasks }: ActionPanelProps) {
    return (
        <>
            <div className="og-tasks-title">{title}</div>
            <section className="og-tasks" id={id}>
                {tasks.map((task) => (
                    <button
                        key={task.id}
                        className={`task-card ${task.className ?? ""}`}
                        onClick={task.action}
                    >
                        {task.icon === undefined ? (
                            <></>
                        ) : (
                            <span className="task-icon">{task.icon}</span>
                        )}
                        <span className="task-name">{task.label}</span>
                        {task.desc === undefined ? (
                            <></>
                        ) : (
                            <span className="task-desc">{task.desc}</span>
                        )}
                    </button>
                ))}
            </section>
        </>
    );
}

export { ActionPanel, ActionSpec };
