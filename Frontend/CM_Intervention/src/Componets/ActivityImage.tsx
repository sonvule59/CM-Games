import type { JSX } from "react";
import { rcStyles } from "../Static/rockClimbingStyles";

// ActivityImage component.
type ActivityImageProps = {
    id?: string;
    key?: React.Key;
    subtitle?: React.ReactNode;
} & ({ src: string; alt?: string } | { children: React.ReactNode });

export default function ActivityImage(props: ActivityImageProps) {
    let image: React.ReactNode;
    if ("children" in props) {
        image = (
            <div className={rcStyles.sceneImage} key={props.key} id={props.id}>
                {props.children}
            </div>
        );
    } else if ("src" in props) {
        image = (
            <img
                className={rcStyles.sceneImage}
                key={props.key}
                id={props.id}
                src={props.src}
                alt={props.alt}
            />
        );
    } else {
        props satisfies never;
        throw new Error();
    }
    return (
        <div className={rcStyles.sceneImageWrap}>
            {image}
            {props.subtitle != undefined && (
                <div className="px-3 py-2 border-t border-indigo-100 bg-white/70 text-center text-sm font-semibold text-slate-800">
                    {props.subtitle}
                </div>
            )}
        </div>
    );
}
