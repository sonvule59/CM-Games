import type { JSX } from "react";
import { rcStyles } from "../Static/rockClimbingStyles";

// ActivityImage component.
type ActivityImageProps = {
    id?: string;
    key?: React.Key;
    subtitle?: React.ReactNode;
} & ({ src: string; alt?: string } | { children: React.ReactNode });

/**
 * A React component to display an image for an activity.
 * 
 * @param {Object} props The React component's props.
 * @param props.id The optional HTML ID of the element.
 * @param props.key The optional key of the component, for assisting React diffing.
 * @param props.src The URL of the displayed image.
 * @param props.alt Optional alt text for the displayed image. Only available if `props.src` is given.
 * @param props.children The JSX elements to be displayed in place of an image. Mutually exclusive with `props.src`.
 * @param props.subtitle An optional subtitle displayed below the image. This is usually a string, but can be JSX.
 * @returns The React component.
 */
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
