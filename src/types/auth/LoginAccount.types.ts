import {z} from 'zod'

export const LoginAccountZod = z.object({
    username: z.string(),
    password: z.string()
})

export type LoginAccountDto = z.infer<typeof LoginAccountZod>;

