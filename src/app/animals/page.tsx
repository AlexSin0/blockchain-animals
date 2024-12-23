import { createAnimal, animals } from "@/lib/animal";
import { auth, signIn } from "@/lib/auth";

export default async function page() {
	const session = await auth();

	if (!session?.user?.email) {
		await signIn();
		return <div>Please log in.</div>;
	}

	const email = session.user?.email;
	const userAnimals = animals.filter((v) => v.owner === email);

	if (userAnimals.length === 0) {
		return (
			<form
				action={async () => {
					"use server";
					createAnimal(email);
				}}
			>
				<button type="submit">Create your first animal!</button>
			</form>
		);
	}

	return (
		<div>
			{userAnimals.map((animal, i) => (
				<div key={i}>{JSON.stringify(animal)}</div>
			))}
		</div>
	);
}
