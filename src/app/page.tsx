import { auth } from "@/lib/auth";

export default async function Home() {
	const session = await auth();

	return (
		<main className="">
			Hello world<p>{JSON.stringify(session)}</p>
		</main>
	);
}
