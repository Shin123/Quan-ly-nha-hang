import { z } from 'zod'

const configSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PUBLIC_URL: z.string(),
})

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
})

if (!configProject.success) {
  console.error('Invalid environment variables:', configProject.error.errors)
  throw new Error('Invalid environment variables')
}

const envConfig = configProject.data

export default envConfig
