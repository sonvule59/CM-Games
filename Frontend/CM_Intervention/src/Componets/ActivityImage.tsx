import { rcStyles } from "../Static/rockClimbingStyles";

// ActivityImage component.
type ActivityImageProps = {
    id?: string;
    src: string;
};

export default function ActivityImage({ id, src }: ActivityImageProps) {
    return (
        <div className={rcStyles.sceneImageWrap}>
            <img className={rcStyles.sceneImage} src={src}></img>
        </div>
    );
}
