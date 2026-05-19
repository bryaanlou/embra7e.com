import { notFound, redirect } from "next/navigation";
import {
  BENCHMARKS,
  getBenchmarkConfig,
} from "@/lib/benchmarks-config";

export const dynamicParams = false;

export function generateStaticParams() {
  return BENCHMARKS.map((b) => ({ slug: b.slug }));
}

export default async function BenchmarkSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getBenchmarkConfig(slug);
  if (!config) notFound();
  redirect(`/benchmarks/${slug}/${config.defaultDifficulty}`);
}
