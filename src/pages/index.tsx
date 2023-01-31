import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "../utils/api";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { capitalize } from "../utils/capitalize";
import { Loading } from "../components/Loading";

const Home: NextPage = () => {
  const beads = api.example.getAllBeads.useQuery();
  const children = api.example.getChildren.useQuery();
  const [searchFilter, setSearchFilter] = useState("");

  const { status, data } = useSession();

  if (beads.isLoading || status == "loading" || children.isLoading || true) {
    return <Loading />;
  }

  const filteredBeads = beads.data?.filter((el) => {
    if (searchFilter === "") {
      return true;
    }

    return el.pokemon?.name.indexOf(searchFilter) !== -1;
  });

  return (
    <>
      <Head>
        <title>Pokemon Bead Overview</title>
        <meta name="description" content="Pokemon Bead Overview" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="wrapper">
        <>
          {data && (
            <span className="mb-4 text-white">
              Logget inn som {data?.user?.name}
            </span>
          )}
          <h1 className="mb-4 text-5xl font-extrabold text-white sm:text-[5rem]">
            Pokemon
          </h1>
          <Link
            className="mb-4 inline-block gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/create"
          >
            Jeg har laget ny perling!
          </Link>
          <div className="mb-4">
            {children.data?.map((el) => {
              return (
                <Link
                  className="link mr-2"
                  href={`/child/${el.id}`}
                  key={el.id}
                >
                  <div>{el.name}</div>
                </Link>
              );
            })}
          </div>

          <input
            className="mb-8 p-4 text-lg text-black"
            type="text"
            placeholder="Filtrer"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          ></input>
          <h1 className="mb-4 text-center text-4xl">Perler</h1>
          {filteredBeads?.map((el) => {
            return (
              <Link
                href={`/bead/${el.id}`}
                key={el.id}
                className="m-auto mb-4 block max-w-lg rounded-lg border border-solid border-white p-4 text-center text-white"
              >
                {el.child.name} #{el.pokemon?.number} -{" "}
                {capitalize(el.pokemon?.name)}
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
        </>
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={data ? () => void signOut() : () => void signIn()}
          >
            {data ? "Sign out" : "Sign in"}
          </button>
        </div>
      </main>
    </>
  );
};

export default Home;
