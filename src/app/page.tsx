import {
	createAnimal,
	animals,
	getImage,
	Animal,
	evaluate,
	sellAnimal,
} from "@/lib/animal";
import { auth, signIn } from "@/lib/auth";
import { addMoneyUnrecorded } from "@/lib/user";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";

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

	return (
		<div className="flex flex-wrap">
			{userAnimals.map((animal, i) => (
				<AnimalCard animal={animal} key={i} />
			))}
			<form
				action={async () => {
					"use server";
					createAnimal(email);

					// TODO: fix, buying animal should be recorded
					addMoneyUnrecorded(email, -100);
					revalidatePath("/");
				}}
			>
				<button className="w-[300px] h-[520px] p-4 m-4 rounded-md">
					<Image
						src="/plus.png"
						alt=""
						width={512}
						height={512}
						className="rounded-sm"
					/>
					<p className="text-center m-3">Buy for 100🪙</p>
				</button>
			</form>
		</div>
	);
}

async function AnimalCard({ animal }: { animal: Animal }) {
	const animalImage = await getImage(animal);

	return (
		<div className="border w-[320px] h-[500px] p-4 m-4 rounded-md">
			<Image
				src={animalImage}
				alt=""
				width={512}
				height={512}
				className="rounded-sm"
			/>
			<p className="text-center">{capitalizeFirstLetter(animal.type)}</p>
			<div className="mt-2 flex gap-2 flex-wrap justify-center">
				{genes(animal)}
			</div>
			<form className="flex mt-2 gap-3 justify-center">
				<input
					type="submit"
					formAction={async () => {
						"use server";
						sellAnimal(animal.id);
						revalidatePath("/");
					}}
					className="bg-red-700 p-3 rounded-lg m-1"
					value={`Sell ${evaluate(animal)}🪙`}
				/>
				<Link href="/crossbreeding" className="bg-green-600 p-3 rounded-lg m-1">
					Crossbreed
				</Link>
			</form>
		</div>
	);
}

function genes(animal: Animal) {
	return Object.entries(animal.genes).map(([k, v], i) => (
		<div
			key={i}
			style={{
				backgroundColor: `rgba(22, 163, 74, ${v})`,
			}}
			className="px-2 py-0.5 rounded-lg text-nowrap"
		>
			{k}:{round(v)}
		</div>
	));
}

function capitalizeFirstLetter(val: string) {
	return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function round(v: number) {
	return Math.round(v * 100) / 100;
}
