import type { pokemonTypes } from "../types/pokemon";

export const nameTypeMapper: { [key in pokemonTypes]: string } = {
  ice: "Is",
  poison: "Gift",
  grass: "Gress",
  dark: "Mørk",
  dragon: "Drage",
  fire: "Flamme",
  flying: "Flyging",
  normal: "Normal",
  psychic: "Synsk",
  water: "Vann",
  electric: "Elektrisk",
  fairy: "Fe",
  fighting: "Slåss",
  ghost: "Spøkelse",
  ground: "Jord",
  bug: "Insekt",
  rock: "Stein",
  steel: "Stål",
} as const;
