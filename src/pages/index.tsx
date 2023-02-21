import { type NextPage } from "next";
import { useQueryState } from "next-usequerystate";
import Head from "next/head";
import Link from "next/link";
import { api } from "../utils/api";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Loading } from "../components/Loading";
import type { pokemonTypes } from "../types/pokemon";
import { nameTypeMapper } from "../utils/nameMapper";

const FilterButton = ({
  typeFilter,
  handleTypeFilter,
  bgColor,
  color,
  type,
}: {
  color?: string;
  bgColor: string;
  type: keyof typeof nameTypeMapper;
  typeFilter?: string | null;
  handleTypeFilter: (type: keyof typeof nameTypeMapper) => void;
}) => {
  return (
    <button
      className={`flex min-w-[3rem] items-center rounded-sm bg-white/10 p-2 ${
        color ?? "text-white"
      } ${bgColor} ${color ?? ""} mr-2 ${
        typeFilter == null || typeFilter?.indexOf(type) === -1
          ? ""
          : "animate-pulse"
      }`}
      onClick={() => handleTypeFilter(type)}
    >
      <Image
        className="mr-2"
        alt={nameTypeMapper[type]}
        src={`/types/${type}.png`}
        width={24}
        height={24}
      />

      {nameTypeMapper[type]}
    </button>
  );
};

const Home: NextPage = () => {
  const beads = api.example.getAllBeads.useQuery();
  const children = api.example.getChildren.useQuery();
  const [searchFilter, setSearchFilter] = useQueryState("name");
  const [childFilter, setChildFilter] = useQueryState("child");
  const [typeFilter, setTypeFilter] = useQueryState("type");

  const { status, data } = useSession();

  async function handleChildFilter(name: string) {
    if (childFilter?.split(",")?.includes(name)) {
      await setChildFilter(childFilter.replace(`${name},`, ""));
    } else {
      await setChildFilter(`${childFilter ?? ""}${name},`);
    }
  }

  async function handleTypeFilter(name: string) {
    if (typeFilter?.split(",")?.includes(name)) {
      await setTypeFilter(typeFilter.replace(`${name},`, ""));
    } else {
      await setTypeFilter(`${typeFilter ?? ""}${name},`);
    }
  }

  if (beads.isLoading || status == "loading" || children.isLoading) {
    return <Loading />;
  }

  let filteredBeads = beads.data?.filter((el) => {
    if (searchFilter === "") {
      return true;
    }

    return (
      el.pokemon?.name
        .toLowerCase()
        .indexOf(searchFilter?.toLowerCase() ?? "") !== -1
    );
  });

  filteredBeads = filteredBeads?.filter((el) => {
    if (typeFilter === null || typeFilter === "") {
      return true;
    }

    let exists = false;

    const filterArray = typeFilter.split(",");
    el.pokemon?.type.forEach((pokemonType) => {
      if (filterArray.includes(pokemonType)) {
        exists = true;
        return true;
      }
    });
    return exists;
  });

  filteredBeads = filteredBeads?.filter((el) => {
    if (childFilter === null || childFilter === "") {
      return true;
    }

    const childFilterArray = childFilter.split(",");
    return childFilterArray.includes(el.child.name);
  });

  const childBeadCount = children.data?.map((child) => {
    const beadCountChild = beads.data
      ?.filter((bead) => bead.child.id === child.id)
      .reduce((sum) => sum + 1, 0);

    return {
      name: child.name,
      count: beadCountChild,
      link: child.id,
    };
  });

  const activeFilterText = typeFilter
    ?.split(",")
    .map((el) => {
      return nameTypeMapper[el.trim() as pokemonTypes];
    })
    .join(", ")
    .slice(0, -2);

  return (
    <>
      <Head>
        <title>Pokemon Bead Overview</title>
        <meta name="description" content="Pokemon Bead Overview" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="wrapper mb-10">
        <>
          {data && (
            <span className="mb-4 text-white">
              Logget inn som {data?.user?.name}
            </span>
          )}
          <h1 className="mb-4 text-3xl font-extrabold text-white">
            Pokemon Perling
          </h1>

          <div className="mb-4 grid grid-cols-2 gap-2">
            {childBeadCount?.map((el) => {
              return (
                <button
                  type="button"
                  onClick={() => handleChildFilter(el.name)}
                  className={`passivelink text-center ${
                    childFilter == null || childFilter?.indexOf(el.name) === -1
                      ? ""
                      : "bg-blue-700"
                  }`}
                  key={el.link}
                >
                  {el.name}: {el.count} perler
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterButton
              typeFilter={typeFilter}
              color="text-black"
              bgColor="bg-gray-200"
              type="ice"
              handleTypeFilter={handleTypeFilter}
            />

            <FilterButton
              typeFilter={typeFilter}
              bgColor="bg-green-800"
              type="grass"
              handleTypeFilter={handleTypeFilter}
            />

            <FilterButton
              typeFilter={typeFilter}
              bgColor="bg-red-700"
              type="fire"
              handleTypeFilter={handleTypeFilter}
            />

            <FilterButton
              typeFilter={typeFilter}
              bgColor="bg-blue-800"
              type="water"
              handleTypeFilter={handleTypeFilter}
            />

            <FilterButton
              typeFilter={typeFilter}
              bgColor="bg-purple-800"
              type="psychic"
              handleTypeFilter={handleTypeFilter}
            />

            <FilterButton
              typeFilter={typeFilter}
              bgColor="bg-gray-800"
              type="rock"
              handleTypeFilter={handleTypeFilter}
            />

            <FilterButton
              typeFilter={typeFilter}
              bgColor="bg-orange-800"
              type="fighting"
              handleTypeFilter={handleTypeFilter}
            />

            <FilterButton
              typeFilter={typeFilter}
              bgColor="bg-black"
              type="flying"
              handleTypeFilter={handleTypeFilter}
            />

            <FilterButton
              typeFilter={typeFilter}
              bgColor="bg-yellow-200"
              type="electric"
              color="text-black"
              handleTypeFilter={handleTypeFilter}
            />

            <FilterButton
              typeFilter={typeFilter}
              bgColor="bg-black"
              type="ghost"
              handleTypeFilter={handleTypeFilter}
            />

            <FilterButton
              typeFilter={typeFilter}
              bgColor="bg-amber-800"
              type="ground"
              handleTypeFilter={handleTypeFilter}
            />
            <FilterButton
              typeFilter={typeFilter}
              bgColor="bg-green-800"
              type="bug"
              handleTypeFilter={handleTypeFilter}
            />

            <FilterButton
              typeFilter={typeFilter}
              bgColor="bg-gray-800"
              type="steel"
              handleTypeFilter={handleTypeFilter}
            />

            <FilterButton
              typeFilter={typeFilter}
              bgColor="bg-red-800"
              type="dragon"
              handleTypeFilter={handleTypeFilter}
            />

            <FilterButton
              typeFilter={typeFilter}
              bgColor="bg-black"
              type="dark"
              handleTypeFilter={handleTypeFilter}
            />

            <FilterButton
              typeFilter={typeFilter}
              bgColor="bg-pink-800"
              type="fairy"
              handleTypeFilter={handleTypeFilter}
            />
          </div>

          <div className="mt-4 mb-4">
            {(typeFilter?.length ?? 0) > 0 ? (
              <div>Aktive typefiltre: {activeFilterText}</div>
            ) : null}
          </div>

          <input
            className="sm:min-w-auto mb-4 min-w-full p-4 text-lg text-black"
            type="text"
            placeholder="Filtrer"
            value={searchFilter ?? ""}
            onChange={(e) => setSearchFilter(e.target.value)}
          ></input>

          <div className="grid-rows-auto mb-4 grid grid-cols-5">
            {filteredBeads?.map((el) => {
              return (
                <Link href={`/bead/${el.id}`} key={el.id} className="">
                  <Image
                    className="inline"
                    width={96}
                    height={96}
                    src={`/images/${el.pokemon?.number ?? 0}.png`}
                    alt="Perling"
                  />
                </Link>
              );
            })}
          </div>
        </>

        <div className="start flex items-center gap-2">
          <Link className="link bg-green-800" href="/create">
            Jeg har laget ny perling!
          </Link>
          <button
            className="link bg-blue-800"
            onClick={data ? () => void signOut() : () => void signIn()}
          >
            {data ? "Logg ut" : "Logg inn"}
          </button>
        </div>
      </main>
    </>
  );
};

export default Home;
