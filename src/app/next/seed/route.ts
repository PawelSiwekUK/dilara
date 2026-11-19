export async function POST(): Promise<Response> {
  return Response.json({ error: 'Database seeding is not connected.' }, { status: 503 })
}
