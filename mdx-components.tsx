import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

const components: MDXComponents = {
  img: (props) => (
    <Image
      sizes="100vw"
      width={1600}
      height={900}
      className="rounded-lg w-full h-auto my-8"
      {...(props as ImageProps)}
      alt={props.alt ?? ""}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
