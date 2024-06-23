import { Card, CardHeader, CardBody, CardFooter, User, Image, Button } from '@nextui-org/react'


type IPostImage = {
    src: string,
    alt?: string
    date: string
}

function PostImage({ src, alt, date }: IPostImage) {
    return (
        <Card
            isFooterBlurred
            radius="lg"
            className="border-none"
        >
            <Image
                alt={alt}
                className="object-cover w-full max-h-96"
                src={src}
            />
            <CardFooter className="absolute z-10 justify-center w-40 ml-1 overflow-hidden before:bg-white/10 border-white/20 border-1 before:rounded-xl rounded-large bottom-1 shadow-small">
                <p className="font-bold text-tiny text-white/80">{date}</p>
            </CardFooter>
        </Card>
    )
}

export default PostImage