// ActivityImage component.
type ActivityImageProps = {
    id?: string;
    src: string;
};

export default function ActivityImage({ id, src }: ActivityImageProps) {
    return <img className="og-image" src={src}></img>;
}
