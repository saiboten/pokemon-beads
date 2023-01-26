import { type NextPage } from "next";
import { Controller, useForm } from "react-hook-form";
import Head from "next/head";
import Image from "next/image";
import Select from "react-select";

import { api } from "../utils/api";
import { useMemo } from "react";
import { useRouter } from "next/router";

type FormData = {
  child: string;
  pokemon: { value: string; label: string };
  image: FileList;
};

function getBase64(file: File) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return reader;
}

const Create: NextPage = () => {
  const router = useRouter();
  const pokemons = api.example.getPokemons.useQuery();
  const store = api.example.storeBead.useMutation({
    onSuccess: async (data) => {
      await router.push(`/bead/${data}`);
    },
  });

  const { control, register, handleSubmit, watch } = useForm<FormData>();

  const onSubmit = handleSubmit(({ child, image, pokemon }) => {
    if (image[0]) {
      const reader = getBase64(image[0]);

      reader.onload = () => {
        store.mutate({
          child: parseInt(child),
          image: reader.result as string,
          pokemon: pokemon.value,
        });
      };
    }
  });

  const options = useMemo(
    () =>
      pokemons?.data?.map((el) => ({
        value: `${el.number}`,
        label: `${el.name} - ${el.number}`,
      })),
    [pokemons]
  );

  if (pokemons.isLoading) {
    return <div>Loading</div>;
  }

  if (!pokemons.data) {
    throw new Error("No data");
  }

  const image = watch("image") !== undefined ? watch("image")[0] : undefined;

  return (
    <>
      <Head>
        <title>Pokemon Bead Overview</title>
        <meta name="description" content="Pokemon Bead Overview" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">
            Lagre ny perling
          </h1>
          <div className="w-96">
            <form onSubmit={onSubmit}>
              <Controller
                name="pokemon"
                control={control}
                render={({ field }) => (
                  <Select
                    className="mb-4 w-full"
                    {...field}
                    options={options}
                  />
                )}
              />
              <div className="mb-4 flex items-center">
                <input
                  {...register("child")}
                  id="default-radio-1"
                  type="radio"
                  value="1"
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="default-radio-1"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Sverre
                </label>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  {...register("child")}
                  id="default-radio-2"
                  type="radio"
                  value="2"
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="default-radio-2"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Brage
                </label>
              </div>

              <div>
                {image === undefined ? null : (
                  <Image
                    className="mb-4"
                    width={250}
                    height={250}
                    src={URL.createObjectURL(image)}
                    alt="ok"
                  />
                )}
              </div>

              <input
                className="mb-4 block"
                type="file"
                required
                {...register("image")}
              />

              <input
                className="border-2 border-solid bg-sky-500 p-2 text-white hover:bg-sky-700"
                type="submit"
                value="Lagre"
              />
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Set desired value here
    },
  },
};

export default Create;
