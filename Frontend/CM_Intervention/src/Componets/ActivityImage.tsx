import type { JSX } from "react";

// ActivityImage component.
type ActivityImageProps = {
    id?: string;
    key?: React.Key;
} & ({ src: string } | { children: React.ReactNode });

export default function ActivityImage(props: ActivityImageProps) {
    if ("children" in props) {
        return (
            <div className="og-image" key={props.key} id={props.id}>
                {props.children}
            </div>
        );
    } else if ("src" in props) {
        return (
            <img
                className="og-image"
                key={props.key}
                id={props.id}
                src={props.src}
            ></img>
        );
    } else {
        props satisfies never;
        throw new Error();
    }
}
