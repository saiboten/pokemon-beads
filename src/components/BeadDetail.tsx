import { useRouter } from "next/router";

import { api } from "../utils/api";
import Image from "next/image";
import { useState } from "react";
import { Loading } from "../components/Loading";

import { capitalize } from "../utils/capitalize";
import type { Bead, Child, Pokemon } from "@prisma/client";
import { nameTypeMapper } from "../utils/nameMapper";
import type { pokemonTypes } from "../types/pokemon";

interface Props {
  bead: Bead & {
    pokemon: Pokemon | null;
    child: Child | null;
  };
}

export const BeadDetails = ({ bead }: Props) => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const router = useRouter();

  const beadBlob = api.example.getBeadBlob.useQuery(bead.id);

  const deleteBead = api.example.deleteBead.useMutation({
    onSuccess: async () => {
      await router.push("/");
    },
  });

  if (deleteBead.isLoading || beadBlob.isLoading) {
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
    <main className="wrapper p-2">
      <div className="rounded-2xl bg-red-800 bg-opacity-20 p-4 drop-shadow-sm">
        <h1 className="mb-4 text-2xl">
          {bead.child?.name} sin perling av {capitalize(bead.pokemon?.name)}
        </h1>
        <div className="relative m-auto w-64">
          <Image
            width={250}
            height={250}
            src={beadBlob.data?.image ?? ""}
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
        <div>Vekt: {(bead.pokemon?.weight ?? 1) / 10} kg</div>
        <div>Høyde: {(bead.pokemon?.height ?? 0) * 10} cm</div>
        <div>
          Typer:
          {(bead.pokemon?.type ?? []).map((el) => {
            return (
              <div className="flex items-center pl-1" key={el}>
                {nameTypeMapper[el as pokemonTypes]}
                <Image
                  className="mr-2"
                  alt={nameTypeMapper[el as pokemonTypes]}
                  src={`/types/${el}.png`}
                  width={24}
                  height={24}
                />
              </div>
            );
          })}
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
      </div>
    </main>
  );
};
