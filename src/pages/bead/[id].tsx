import { type NextPage } from "next";
import { useRouter } from "next/router";

import { api } from "../../utils/api";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Loading } from "../../components/Loading";

const BeadDetail: NextPage = () => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
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
    return <Loading />;
  }

  if (!detail.data?.beadBlob) {
    throw new Error("Ingen perling her");
  }

  function handleDelete() {
    if (deleteConfirm) {
      deleteBead.mutate(idNumber);
    } else {
      setDeleteConfirm(true);
    }
  }

  return (
    <main className="wrapper m-auto max-w-md">
      <h1 className="mb-4 text-2xl">
        {detail.data.child.name} sin perling av {detail.data.pokemon?.name}
      </h1>
      <div className="flex items-center">
        <Image
          width={250}
          height={250}
          src={detail.data.beadBlob.image}
          alt="Perling"
        />

        <Image
          width={96}
          height={96}
          src={`/images/${detail.data.pokemon?.number ?? 0}.png`}
          alt="Perling"
        />
      </div>
      <div className="mb-4"></div>

      <Link className="link mb-8 inline-block" href="/">
        Tilbake
      </Link>

      <div className="relative">
        {deleteConfirm ? (
          <p className="top-50 absolute left-auto mb-4">
            Sikker på at du vil slette?
          </p>
        ) : null}
        <button
          className="mb-4 mt-8 border-2 border-solid bg-sky-500 p-2 text-white hover:bg-sky-700"
          type="button"
          onClick={handleDelete}
        >
          Slett
        </button>
      </div>
    </main>
  );
};

export default BeadDetail;
