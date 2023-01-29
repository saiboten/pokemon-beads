import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Text } from "../components/Text";
import { Wrapper } from "../components/Wrapper";
import { api } from "../utils/api";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const beads = api.example.getAllBeads.useQuery();

  const session = useSession();

  if (beads.isLoading || session.status == "loading") {
    return <div>Loading</div>;
  }

  if (session.status === "unauthenticated") {
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white"></p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={() => void signIn()}
      >
        Logg inn
      </button>
    </div>;
  }

  return (
    <>
      <Head>
        <title>Pokemon Bead Overview</title>
        <meta name="description" content="Pokemon Bead Overview" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Wrapper>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {session && (
            <span className="text-white">
              Logget inn som {session.data?.user?.name}
            </span>
          )}
          <h1 className="text-5xl font-extrabold text-white sm:text-[5rem]">
            Pokemon
          </h1>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/create"
          >
            Jeg har laget ny perling!
          </Link>
          {beads.data?.map((el) => {
            return (
              <Link href={`/bead/${el.id}`} key={el.id}>
                <Text>
                  {el.child.name} - {el.pokemon?.name}
                </Text>
              </Link>
            );
          })}
        </div>
      </Wrapper>
    </>
  );
};

export default Home;
