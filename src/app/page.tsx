import { auth } from "@/lib/auth";
import { blockchain } from "@/lib/blockchain";

export default async function Home() {
	const session = await auth();

	return (
		<main className="">
			Hello world<p>{JSON.stringify(session)}</p>
			Blockchain<p>{JSON.stringify(blockchain)}</p>
		</main>
	);
}
