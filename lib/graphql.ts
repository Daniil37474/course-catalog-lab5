import { API_URL } from "@/lib/api";

export type GraphQLError = { message: string; path?: (string | number)[] };

export class GraphQLRequestError extends Error {
  constructor(public errors: GraphQLError[]) {
    super(errors.map((error) => error.message).join("; "));
    this.name = "GraphQLRequestError";
  }
}

export async function gql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_URL}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const body = await res.json() as { data: T | null; errors?: GraphQLError[] };
  if (body.errors?.length) throw new GraphQLRequestError(body.errors);
  if (body.data == null) throw new Error("GraphQL response has no data");
  return body.data;
}
