import { type NextPage } from "next";
import { useRouter } from "next/router";

import { api } from "../../utils/api";
import Image from "next/image";
import { Text } from "../../components/Text";
import { StyledLink } from "../../components/StyledLink";

const Child: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const idNumber = typeof id === "string" ? parseInt(id) : -1;

  const detail = api.example.getChildDetails.useQuery(idNumber);

  if (detail.isLoading) {
    return <div className="wrapper">Loading</div>;
  }

  return (
    <main className="wrapper">
      <Text>Hei og hopp</Text>

      {detail.data?.Beads.map((bead) => {
        return (
          <li key={bead.id}>
            <p className="text-white">
              {bead.pokemon?.name} ({bead.pokemon?.number})
            </p>
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
          </li>
        );
      })}

      <div className="mb-4"></div>

      <StyledLink link="/" text="Tilbake" />
    </main>
  );
};

export default Child;
