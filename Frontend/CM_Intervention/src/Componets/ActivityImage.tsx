import type { JSX } from "react";
import { rcStyles } from "../Static/rockClimbingStyles";

// ActivityImage component.
type ActivityImageProps = {
    id?: string;
    key?: React.Key;
} & ({ src: string } | { children: React.ReactNode });

export default function ActivityImage(props: ActivityImageProps) {
    if ("children" in props) {
        return (
            <div className={rcStyles.sceneImageWrap}>
                <div
                    className={rcStyles.sceneImage}
                    key={props.key}
                    id={props.id}
                >
                    {props.children}
                </div>
            </div>
        );
    } else if ("src" in props) {
        return (
            <div className={rcStyles.sceneImageWrap}>
                <img
                    className={rcStyles.sceneImage}
                    key={props.key}
                    id={props.id}
                    src={props.src}
                ></img>
            </div>
        );
    } else {
        props satisfies never;
        throw new Error();
    }
}
