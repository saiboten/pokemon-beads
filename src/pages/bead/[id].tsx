import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { BeadDetails } from "../../components/BeadDetail";
import { Loading } from "../../components/Loading";
import { api } from "../../utils/api";

const BeadDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const idNumber = typeof id === "string" ? parseInt(id) : -1;

  const detail = api.example.getBeadDetails.useQuery(idNumber);

  if (detail.isLoading) {
    return <Loading />;
  }

  if (!detail.data?.beadBlob) {
    throw new Error("Ingen perling her");
  }

  return (
    <div className="m-auto mt-8 max-w-lg">
      <BeadDetails bead={detail.data} />
      <Link className="link mb-8 mt-8 mr-2 inline-block" href="/">
        Tilbake
      </Link>
    </div>
  );
};

export default BeadDetailPage;
