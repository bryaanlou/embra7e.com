import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

const components: MDXComponents = {
  img: (props) => {
    const src = typeof props.src === "string" ? props.src : "";
    return (
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="block my-8"
        aria-label={`Open ${props.alt ?? "image"} in new tab`}
      >
        <Image
          sizes="100vw"
          width={1600}
          height={900}
          className="rounded-lg w-full h-auto cursor-zoom-in"
          {...(props as ImageProps)}
          alt={props.alt ?? ""}
        />
      </a>
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
