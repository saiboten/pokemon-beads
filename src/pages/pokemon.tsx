import { type NextPage } from "next";
import { api } from "../utils/api";

const Pokemon: NextPage = () => {
  const pokemon = api.example.getPokemons.useQuery();
  const deleteMutation = api.example.deletePokemon.useMutation();

  if (pokemon.isLoading) {
    return <div>Loading</div>;
  }

  function handleDelete(id: string) {
    deleteMutation.mutate(id);
  }

  return (
    <main className="wrapper">
      <ul className="text-white">
        {pokemon.data?.map((el) => (
          <li key={el.id}>
            {el.name} <button onClick={() => handleDelete(el.id)}>Slett</button>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Pokemon;
