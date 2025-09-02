// convex/users.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create user if not exists, else return existing
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first(); // use .first() instead of collect for one record

    if (existing) {
      return existing;
    }

    const newId = await ctx.db.insert("UserTable", {
      name: args.name,
      email: args.email,
      imageUrl: args.imageUrl,
    });

    return await ctx.db.get(newId); // return full user object
  },
});
