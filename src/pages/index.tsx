import { type NextPage } from "next";
import { useQueryState } from "next-usequerystate";
import Head from "next/head";
import Link from "next/link";
import { api } from "../utils/api";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Loading } from "../components/Loading";

const nameTypeMapper = {
  ice: "Is",
} as const;

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
                    childFilter?.indexOf(el.name) !== -1 ? "bg-blue-700" : ""
                  }`}
                  key={el.link}
                >
                  {el.name}: {el.count} perler
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={`passivelink mr-2 bg-gray-200 text-black ${
                typeFilter?.indexOf("ice") !== -1 ? "bg-black text-white" : ""
              }`}
              onClick={() => handleTypeFilter("ice")}
            >
              Is
            </button>

            <button
              className="passivelink mr-2 bg-green-800"
              onClick={() => handleTypeFilter("grass")}
            >
              Gress
            </button>

            <button
              className="passivelink mr-2 bg-red-800"
              onClick={() => handleTypeFilter("fire")}
            >
              Flamme
            </button>

            <button
              className="passivelink mr-2 bg-blue-800"
              onClick={() => handleTypeFilter("water")}
            >
              Vann
            </button>

            <button
              className="passivelink mr-2 bg-purple-800"
              onClick={() => handleTypeFilter("psychic")}
            >
              Synsk
            </button>

            <button
              className="passivelink mr-2 bg-gray-800"
              onClick={() => handleTypeFilter("rock")}
            >
              Stein
            </button>

            <button
              className="passivelink mr-2 bg-orange-800"
              onClick={() => handleTypeFilter("fighting")}
            >
              Slåss
            </button>

            <button
              className="passivelink mr-2 bg-black"
              onClick={() => handleTypeFilter("flying")}
            >
              Flyging
            </button>
            <button
              className="passivelink mr-2 bg-yellow-400 text-black"
              onClick={() => handleTypeFilter("electric")}
            >
              Elektrisk
            </button>
            <button
              className="passivelink mr-2 bg-black"
              onClick={() => handleTypeFilter("ghost")}
            >
              Spøkelse
            </button>
            <button
              className="passivelink mr-2 bg-amber-800"
              onClick={() => handleTypeFilter("ground")}
            >
              Jord
            </button>
            <button
              className="passivelink mr-2 bg-green-800"
              onClick={() => handleTypeFilter("insect")}
            >
              Insekt
            </button>
            <button
              className="passivelink mr-2 bg-gray-800"
              onClick={() => handleTypeFilter("steel")}
            >
              Stål
            </button>
            <button
              className="passivelink mr-2 bg-red-800"
              onClick={() => handleTypeFilter("drage")}
            >
              Dragon
            </button>
            <button
              className="passivelink mr-2 bg-black"
              onClick={() => handleTypeFilter("dark")}
            >
              Mørk
            </button>
            <button
              className="passivelink bg-pink-800"
              onClick={() => handleTypeFilter("fairly")}
            >
              Fe
            </button>
          </div>

          <div>Aktive typefiltre: {typeFilter?.split(",").join(" ")}</div>

          <input
            className="sm:min-w-auto mt-8 mb-2 min-w-full p-4 text-lg text-black"
            type="text"
            placeholder="Filtrer"
            value={searchFilter ?? ""}
            onChange={(e) => setSearchFilter(e.target.value)}
          ></input>

          <div className="grid-rows-auto grid grid-cols-5">
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
