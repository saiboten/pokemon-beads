/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type NextPage } from "next";
import { Controller, useForm } from "react-hook-form";
import Head from "next/head";
import Image from "next/image";
import Select from "react-select";
import convert from "image-file-resize";
import { api } from "../utils/api";
import { useMemo } from "react";
import Link from "next/link";
import { Loading } from "../components/Loading";
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
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<FormData>();
  const store = api.example.storeBead.useMutation({
    onSuccess: async (data) => {
      await router.push(`/bead/${data}`);
    },
  });

  const onSubmit = handleSubmit(({ child, image, pokemon }) => {
    if (image[0]) {
      convert({
        file: image[0],
        height: 640,
        width: 480,
        type: "jpeg",
      }).then((resp: File) => {
        const reader = getBase64(resp);
        reader.onload = () => {
          store.mutate({
            child: parseInt(child),
            image: reader.result as string,
            pokemon: pokemon.value,
          });
        };
      });
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
    return <Loading />;
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
      <main className="flex flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 p-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">
            Lagre ny perling
          </h1>
          <div className="w-60">
            <form onSubmit={onSubmit}>
              <Controller
                name="pokemon"
                control={control}
                render={({ field }) => (
                  <Select
                    className="mb-4 w-full text-black"
                    {...field}
                    required
                    options={options}
                  />
                )}
              />
              {watch("pokemon") ? (
                <Image
                  width={96}
                  height={96}
                  src={`/images/${watch("pokemon").value ?? 0}.png`}
                  alt="Perling"
                />
              ) : null}

              <div className="mb-4 flex items-center">
                <input
                  {...register("child")}
                  required
                  id="default-radio-1"
                  type="radio"
                  value="1"
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="default-radio-1"
                  className="ml-2 text-sm font-medium"
                >
                  Sverre
                </label>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  {...register("child")}
                  required
                  id="default-radio-2"
                  type="radio"
                  value="2"
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="default-radio-2"
                  className="ml-2 text-sm font-medium"
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
                className="btn-primary mr-4"
                type="submit"
                value="Lagre"
                disabled={store.isLoading || !isValid}
              />

              <Link className="link inline-block" href={"/"}>
                Tilbake
              </Link>
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
      sizeLimit: "20mb", // Set desired value here
    },
  },
};

export default Create;
