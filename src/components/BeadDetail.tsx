import { useRouter } from "next/router";

import { api } from "../utils/api";
import Image from "next/image";
import { useState } from "react";
import { Loading } from "../components/Loading";

import { capitalize } from "../utils/capitalize";
import type { Bead, BeadImage, Child, Pokemon } from "@prisma/client";

interface Props {
  bead: Bead & {
    pokemon: Pokemon | null;
    beadBlob: BeadImage | null;
    child: Child | null;
  };
}

export const BeadDetails = ({ bead }: Props) => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const router = useRouter();
  const deleteBead = api.example.deleteBead.useMutation({
    onSuccess: async () => {
      await router.push("/");
    },
  });

  if (deleteBead.isLoading) {
    return <Loading />;
  }

  function handleDelete() {
    if (deleteConfirm) {
      deleteBead.mutate(bead.id);
    } else {
      setDeleteConfirm(true);
    }
  }

  return (
    <main className="wrapper m-auto max-w-md rounded-xl border-4">
      <h1 className="mb-4 text-2xl">
        {bead.child?.name} sin perling av {capitalize(bead.pokemon?.name)}
      </h1>
      <div className="relative m-auto w-64">
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
      <div className="mb-4"></div>

      <span className="relative">
        {deleteConfirm ? (
          <p className="mb-4">Sikker på at du vil slette?</p>
        ) : null}
        <button className="btn-warning" type="button" onClick={handleDelete}>
          Slett
        </button>
      </span>
    </main>
  );
};
