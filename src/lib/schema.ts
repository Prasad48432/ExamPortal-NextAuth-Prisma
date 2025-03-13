import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

type Schema = z.infer<typeof schema>;

export { schema, type Schema };
