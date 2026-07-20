import { AlgorithmPage } from "@/components/lab/AlgorithmPage";

type Props = { params: Promise<{ algo: string }> };

export default async function LinkedListAlgoPage({ params }: Props) {
  const { algo } = await params;
  return <AlgorithmPage engine="linked-list" algoId={algo} />;
}
