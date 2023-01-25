import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getPokemons: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.pokemon.findMany();
  }),

  getAllBeads: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.bead.findMany({
      include: {
        child: true,
        pokemon: true,
      },
    });
  }),

  getBeadDetails: publicProcedure
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

      return bead;
    }),

  deleteBead: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.bead.delete({
        where: {
          id: input,
        },
      });
    }),

  storeBead: publicProcedure
    .input(
      z.object({ child: z.number(), image: z.string(), pokemon: z.string() })
    )
    .mutation(async ({ ctx, input: { child, pokemon, image } }) => {
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
          image,
          beadId: beadResponse.id,
        },
      });

      return res.id;
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});