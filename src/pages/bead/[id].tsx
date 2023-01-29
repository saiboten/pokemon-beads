import { type NextPage } from "next";
import { useRouter } from "next/router";

import { api } from "../../utils/api";
import { Wrapper } from "../../components/Wrapper";
import Image from "next/image";
import { Text } from "../../components/Text";
import { StyledLink } from "../../components/StyledLink";

const BeadDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const idNumber = typeof id === "string" ? parseInt(id) : -1;

  const detail = api.example.getBeadDetails.useQuery(idNumber);
  const deleteBead = api.example.deleteBead.useMutation({
    onSuccess: async () => {
      await router.push("/");
    },
  });

  if (detail.isLoading || deleteBead.isLoading) {
    return <Wrapper>Loading</Wrapper>;
  }

  if (!detail.data?.beadBlob) {
    throw new Error("Ingen perling her");
  }

  function handleDelete() {
    deleteBead.mutate(idNumber);
  }

  return (
    <Wrapper>
      <Text>
        {detail.data.child.name} sin perling av {detail.data.pokemon?.name}
      </Text>
      <Image
        width={250}
        height={250}
        src={detail.data.beadBlob.image}
        alt="Perling"
      />

      <Image
        width={250}
        height={250}
        src={`/images/${detail.data.pokemon?.number ?? 0}.png`}
        alt="Perling"
      />
      <div className="mb-4"></div>

      <button
        className="mb-4 border-2 border-solid bg-sky-500 p-2 text-white hover:bg-sky-700"
        type="button"
        onClick={handleDelete}
      >
        Slett
      </button>

      <StyledLink link="/" text="Tilbake" />
    </Wrapper>
  );
};

export default BeadDetail;
