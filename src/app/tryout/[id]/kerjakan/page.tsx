import KerjakanReal from "./KerjakanReal";
export default function Page({ params }: { params: { id: string } }) {
  return <KerjakanReal params={params} />;
}
