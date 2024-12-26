import { createAnimal, animals, getImage } from "@/lib/animal";
import { auth, signIn } from "@/lib/auth";
import Image from "next/image";

export default async function page() {
	const session = await auth();

	if (!session?.user?.email) {
		await signIn();
		return <div>Please log in.</div>;
	}

	if (!animals) {
		<div>System hasn't finished loading.</div>;
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

	const animalImagesPromises = userAnimals.map((animal) => getImage(animal));
	const animalImages = await Promise.all(animalImagesPromises);

	return (
		<div>
			{userAnimals.map((animal, i) => (
				<div key={i}>
					<Image src={animalImages[i]} alt="" width={512} height={512} />
					{JSON.stringify(animal)}
				</div>
			))}
		</div>
	);
}
