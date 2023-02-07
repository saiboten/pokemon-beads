import { useRouter } from "next/router";

import { api } from "../utils/api";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Loading } from "../components/Loading";

interface Props {
  id: number;
}

export const BeadDetails = ({ id }: Props) => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const router = useRouter();

  const detail = api.example.getBeadDetails.useQuery(id);
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
      deleteBead.mutate(id);
    } else {
      setDeleteConfirm(true);
    }
  }

  return (
    <main className="wrapper m-auto max-w-md rounded-xl border-4">
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
