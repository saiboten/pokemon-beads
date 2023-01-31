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
      <div className="relative m-auto w-64">
        <Image
          width={250}
          height={250}
          src={detail.data.beadBlob.image}
          alt="Perling"
        />

        <Image
          className="absolute -right-4 -top-4"
          width={96}
          height={96}
          src={`/images/${detail.data.pokemon?.number ?? 0}.png`}
          alt="Perling"
        />
      </div>
      <div className="mb-4"></div>

      <Link className="link mb-8 mr-2 inline-block" href="/">
        Tilbake
      </Link>

      <span className="relative">
        {deleteConfirm ? (
          <p className="top-50 absolute left-auto mb-4">
            Sikker på at du vil slette?
          </p>
        ) : null}
        <button className="btn-warning" type="button" onClick={handleDelete}>
          Slett
        </button>
      </span>
    </main>
  );
};

export default BeadDetail;
