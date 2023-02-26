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
      <div className="rounded-md border-black bg-white p-4 text-black">
        <h1 className="mb-4 text-2xl">
          {bead.child?.name} sin perling av {capitalize(bead.pokemon?.name)}
        </h1>
        <div className="flex justify-between">
          <div className="basis-1/2">
            <h2 className="mb-2 text-xl">Faktaark</h2>
            <Image
              className=""
              width={96}
              height={96}
              src={`/images/${bead.pokemon?.number ?? 0}.png`}
              alt="Perling"
            />
            <div>
              Vekt: <strong>{(bead.pokemon?.weight ?? 1) / 10} kg</strong>
            </div>
            <div>
              Høyde: <strong>{(bead.pokemon?.height ?? 0) * 10} cm</strong>
            </div>
            <div>
              Typer:
              {(bead.pokemon?.type ?? []).map((el) => {
                return (
                  <span className="inline-block translate-y-2 pl-1" key={el}>
                    <Image
                      alt={nameTypeMapper[el as pokemonTypes]}
                      src={`/types/${el}.png`}
                      width={24}
                      height={24}
                    />
                  </span>
                );
              })}
            </div>
          </div>
          <div className="m-auto w-64 basis-1/2">
            <Image
              width={250}
              height={250}
              src={beadBlob.data?.image ?? ""}
              alt="Perling"
            />
          </div>
        </div>

        <div className="mb-4"></div>

        <span className="relative">
          {deleteConfirm ? (
            <p className="mb-4">Sikker på at du vil slette?</p>
          ) : null}
          <button className="" type="button" onClick={handleDelete}>
            Slett
          </button>
        </span>
      </div>
    </main>
  );
};
