import { type NextPage } from "next";
import { useRouter } from "next/router";

import { api } from "../../utils/api";
import Image from "next/image";
import Link from "next/link";
import { capitalize } from "../../utils/capitalize";
import { Loading } from "../../components/Loading";

const Child: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const idNumber = typeof id === "string" ? parseInt(id) : -1;

  const detail = api.example.getChildDetails.useQuery(idNumber);

  if (detail.isLoading) {
    return <Loading />;
  }

  return (
    <main className="wrapper max-w-lg">
      <h1 className="mb-4 text-3xl">Perlene til {detail.data?.name}</h1>

      {detail.data?.Beads.map((bead) => {
        return (
          <div key={bead.id}>
            <p className="text-white">
              {capitalize(bead.pokemon?.name)} ({bead.pokemon?.number})
            </p>
            <div className="flex items-center">
              <Image
                width={250}
                height={250}
                src={bead.beadBlob?.image ?? ""}
                alt="Perling"
              />

              <Image
                width={96}
                height={96}
                src={`/images/${bead.pokemon?.number ?? 0}.png`}
                alt="Perling"
              />
            </div>
          </div>
        );
      })}

      <div className="mb-4"></div>

      <Link className="link" href="/">
        Tilbake
      </Link>
    </main>
  );
};

export default Child;
