import { animals, Animal, crossbreedAnimals } from "@/lib/animal";

export async function GET() {
	return Response.json(animals);
}

export async function POST(req: Request) {
	const json = await req.json();
	const anims = json as Animal[];

	crossbreedAnimals(anims[0].owner, anims);

	return Response.json([]);
}
