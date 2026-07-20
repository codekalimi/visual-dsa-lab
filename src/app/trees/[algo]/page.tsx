import { AlgorithmPage } from "@/components/lab/AlgorithmPage";

type Props = { params: Promise<{ algo: string }> };

export default async function TreesAlgoPage({ params }: Props) {
  const { algo } = await params;
  return <AlgorithmPage engine="trees" algoId={algo} />;
}
