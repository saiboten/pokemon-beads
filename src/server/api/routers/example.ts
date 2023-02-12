import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import sharp from "sharp";
import pokemon from "./pokemon.json";

interface PokemonResponse {
  types: {
    type: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
}

export const exampleRouter = createTRPCRouter({
  getPokemons: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.pokemon.findMany();
  }),

  getAllBeads: protectedProcedure.query(async ({ ctx }) => {
    const beads = await ctx.prisma.bead.findMany({
      include: {
        child: true,
        pokemon: true,
      },
    });

    return beads.sort((el1, el2) =>
      (el1.pokemon?.number ?? 0) < (el2.pokemon?.number ?? 0) ? -1 : 1
    );
  }),

  getBeadBlob: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const beadImage = await ctx.prisma.beadImage.findFirstOrThrow({
        where: {
          beadId: input,
        },
      });
      return beadImage;
    }),

  getBeadDetails: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const bead = await ctx.prisma.bead.findFirst({
        where: {
          id: input,
        },
        include: {
          beadBlob: true,
          child: true,
          pokemon: true,
        },
      });

      if (!bead) {
        throw new Error("Could not find bead");
      }

      if (bead.pokemonId == null) {
        throw new Error("No pokemon attached?!");
      }

      if (!bead.pokemon?.height) {
        const bla = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${bead?.pokemon?.number ?? "-1"}/`
        );
        const data = (await bla.json()) as PokemonResponse;
        const types = data.types.map((el) => el.type.name);

        const updatedPokemon = await ctx.prisma.pokemon.update({
          where: {
            id: bead.pokemonId,
          },
          data: {
            type: types,
            height: data.height,
            weight: data.weight,
          },
        });
        bead.pokemon = updatedPokemon;
      }

      return bead;
    }),

  getChildren: protectedProcedure.query(async ({ ctx }) => {
    const children = await ctx.prisma.child.findMany({
      where: {
        parentId: ctx.session.user.id ?? "-",
      },
    });

    return children;
  }),

  getChildDetails: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const children = await ctx.prisma.child.findFirst({
        where: {
          id: input,
        },
        include: {
          Beads: {
            include: {
              pokemon: true,
              child: true,
            },
          },
        },
      });

      return children;
    }),

  deleteBead: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.bead.delete({
        where: {
          id: input,
        },
      });
    }),

  deletePokemon: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.pokemon.delete({
        where: {
          id: input,
        },
      });
    }),

  storeBead: protectedProcedure
    .input(
      z.object({ child: z.number(), image: z.string(), pokemon: z.string() })
    )
    .mutation(async ({ ctx, input: { child, pokemon, image } }) => {
      const bufferImage = Buffer.from(
        image.substring(image.indexOf(",") + 1),
        "base64"
      );
      const resized = await sharp(bufferImage)
        .resize({
          fit: "cover",
          width: 480,
          height: 640,
        })
        .toBuffer();

      const resizedImage = `data:image/png;base64,${resized.toString(
        "base64"
      )}`;

      const childDb = await ctx.prisma.child.findFirstOrThrow({
        where: {
          id: child,
        },
      });

      const pokemonDb = await ctx.prisma.pokemon.findFirstOrThrow({
        where: {
          number: parseInt(pokemon),
        },
      });

      const beadResponse = await ctx.prisma.bead.create({
        data: {
          childId: childDb.id,
          pokemonId: pokemonDb.id,
        },
      });

      const res = await ctx.prisma.beadImage.create({
        data: {
          image: resizedImage,
          beadId: beadResponse.id,
        },
      });

      return res.id;
    }),

  insertPokemen: protectedProcedure.mutation(async ({ ctx }) => {
    const pok = pokemon.results as unknown as { name: string }[];

    const pokemen = pok.map(({ name }: { name: string }, index) => ({
      name,
      number: index + 1,
    }));

    await ctx.prisma.pokemon.createMany({
      data: pokemen,
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
