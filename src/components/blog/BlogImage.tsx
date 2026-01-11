import Image from 'next/image';

interface BlogImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export default function BlogImage({ src, alt, caption }: BlogImageProps) {
  return (
    <figure className="my-8">
      <Image
        src={src}
        alt={alt}
        width={800}
        height={500}
        className="object-cover w-full h-auto bg-neutral-100"
      />
      {caption && (
        <figcaption className="mt-3 text-center font-sans text-sm text-neutral-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
