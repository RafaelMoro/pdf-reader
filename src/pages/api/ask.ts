import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }: { request: Request }) => {
  return new Response("Hello from the API!");
}