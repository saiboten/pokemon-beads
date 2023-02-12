import { type NextPage } from "next";
import { useRouter } from "next/router";

import { api } from "../../utils/api";
import { Loading } from "../../components/Loading";
import { BeadDetails } from "../../components/BeadDetail";

const Child: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const idNumber = typeof id === "string" ? parseInt(id) : -1;

  const detail = api.example.getChildDetails.useQuery(idNumber);

  if (detail.isLoading) {
    return <Loading />;
  }

  return (
    <main className="wrapper max-w-xxl">
      <h1 className="mb-4 text-3xl">Perlene til {detail.data?.name}</h1>
      <button className="button mb-4" onClick={() => router.back()}>
        Tilbake
      </button>

      <div className="flex flex-wrap gap-4">
        {detail.data?.Beads.map((bead) => {
          return <BeadDetails key={bead.id} bead={bead} />;
        })}
      </div>

      <div className="mb-4"></div>

      <button className="link" onClick={() => router.back()}>
        Tilbake
      </button>
    </main>
  );
};

export default Child;
