import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Text } from "../components/Text";
import { Wrapper } from "../components/Wrapper";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const beads = api.example.getAllBeads.useQuery();

  if (beads.isLoading) {
    return <div>Loading</div>;
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
