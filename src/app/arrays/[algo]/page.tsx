import { AlgorithmPage } from "@/components/lab/AlgorithmPage";

type Props = { params: Promise<{ algo: string }> };

export default async function ArraysAlgoPage({ params }: Props) {
  const { algo } = await params;
  return <AlgorithmPage engine="arrays" algoId={algo} />;
}
