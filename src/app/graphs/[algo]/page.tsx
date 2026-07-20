import { AlgorithmPage } from "@/components/lab/AlgorithmPage";

type Props = { params: Promise<{ algo: string }> };

export default async function GraphsAlgoPage({ params }: Props) {
  const { algo } = await params;
  return <AlgorithmPage engine="graphs" algoId={algo} />;
}
