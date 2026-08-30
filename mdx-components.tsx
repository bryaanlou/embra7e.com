import type { MDXComponents } from "mdx/types";
import type { ImageProps } from "next/image";
import { ZoomableImage } from "@/components/ZoomableImage";
import { Scenario } from "@/components/Scenario";
import { VideoThumbnail } from "@/components/VideoThumbnail";

const components: MDXComponents = {
  img: (props) => (
    <ZoomableImage
      sizes="100vw"
      width={1600}
      height={900}
      className="rounded-lg w-full h-auto"
      unoptimized
      {...(props as ImageProps)}
      alt={props.alt ?? ""}
      wrapperClassName="block my-8 cursor-zoom-in border-0 bg-transparent p-0 w-full text-left"
    />
  ),
  Scenario,
  VideoThumbnail,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
