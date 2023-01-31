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
    <main className="wrapper max-w-xxl">
      <h1 className="mb-4 text-3xl">Perlene til {detail.data?.name}</h1>
      <Link className="link mb-8 mr-2 inline-block" href="/">
        Tilbake
      </Link>

      <div className="flex flex-wrap gap-4">
        {detail.data?.Beads.map((bead) => {
          return (
            <div
              key={bead.id}
              className="w-64 rounded-lg border-2 border-solid p-4"
            >
              <p className="mb-2 text-lg">
                {capitalize(bead.pokemon?.name)} #{bead.pokemon?.number}
              </p>
              <div className="relative">
                <Image
                  width={250}
                  height={250}
                  src={bead.beadBlob?.image ?? ""}
                  alt="Perling"
                />

                <Image
                  className="absolute -right-4 -top-4"
                  width={96}
                  height={96}
                  src={`/images/${bead.pokemon?.number ?? 0}.png`}
                  alt="Perling"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-4"></div>

      <Link className="link" href="/">
        Tilbake
      </Link>
    </main>
  );
};

export default Child;
