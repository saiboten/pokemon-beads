import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { BeadDetails } from "../../components/BeadDetail";

const BeadDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const idNumber = typeof id === "string" ? parseInt(id) : -1;

  return (
    <div className="m-auto mt-8 max-w-lg">
      <BeadDetails id={idNumber} />
      <Link className="link mb-8 mt-8 mr-2 inline-block" href="/">
        Tilbake
      </Link>
    </div>
  );
};

export default BeadDetailPage;
