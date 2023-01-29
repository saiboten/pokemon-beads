import { type NextPage } from "next";
import { api } from "../utils/api";

const InsertPokemon: NextPage = () => {
  const mutate = api.example.insertPokemen.useMutation();

  function handle() {
    mutate.mutate();
  }

  return (
    <div>
      <button onClick={handle}>Legg til</button>
    </div>
  );
};
export default InsertPokemon;
