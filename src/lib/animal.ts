import { randomUUID } from "node:crypto";
import { createBlock } from "./blockchain";
import { fileExists, saveImageB64 } from "./fs";
import { addMoneyUnrecorded } from "./user";

// I had to hoist it, or else
// ReferenceError: Cannot access 'animalsArr' before initialization
export var animals: Animal[];

export function setAnimals(newAnimals: Animal[]) {
	animals = newAnimals;
}

export class Animal {
	public quality = 1;
	public id: string;

	constructor(public owner: string, public type: string, public genes: Genes) {
		this.id = randomUUID();
	}
}

type Genes = Record<string, number>;

export async function getImage(animal: Animal) {
	const image = `/animals/${animal.id}.png`;
	if (await fileExists("public" + image)) return image;

	sendImageGenRequest(animal);
	return "/animals/placeholder.png";
}

const animalTypes = ["cat", "dog", "rabbit", "bird"];
const animalGenes = [
	"blue fur",
	"long tail",
	"big ears",
	"red eyes",
	"green",
	"white legs",
];

function registerAnimal(animal: Animal) {
	animals.push(animal);
	createBlock("animal", animal);
	console.log("Registered new animal. Owner " + animal.owner);
}

export function createAnimal(owner: string, quality = 1) {
	const animalType = randElement(animalTypes);

	const genes: Genes = {};
	for (let i = 0; i < 3; i++) {
		const gene = randElement(animalGenes);
		const weight = round(Math.random() / 3 + 0.1);
		genes[gene] = weight;
	}

	const animal = new Animal(owner, animalType, genes);
	registerAnimal(animal);

	return animal;
}

export function sellAnimal(animalId: string) {
	// remove animal
	const index = animals.findIndex((v) => v.id === animalId);
	const animal = animals.splice(index, 1)[0];

	// add money
	const price = evaluate(animal);
	addMoneyUnrecorded(animal.owner, price);

	createBlock("sell", { animal: animal, price: price });
}

export function breedGenes([...animals]: Animal[]) {
	const genes: Genes = {};
	for (const animal of animals) {
		for (const [k, v] of Object.entries(animal.genes)) {
			if (genes[k]) {
				genes[k] += v;
			} else {
				genes[k] = v;
			}
		}
	}

	for (const [k, v] of Object.entries(genes)) {
		genes[k] = (Math.random() / 2 + 0.5) * v;
	}

	return genes;
}

export function crossbreedAnimals(owner: string, [...animals]: Animal[]) {
	const genes = breedGenes(animals);
	const animal = new Animal(owner, randElement(animals).type, genes);
	registerAnimal(animal);
	return animal;
}

export function evaluate(animal: Animal) {
	return round(
		Object.entries(animal.genes).reduce((a, [k, v]) => a + v ** 4 * 1000, 10)
	);
}

function randElement<T>(arr: T[]) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function round(v: number) {
	return Math.round(v * 100) / 100;
}

function sendImageGenRequest(animal: Animal) {
	let prompt = `${animal.type}, ${Object.entries(animal.genes).reduce(
		(acc, [k, v]) => {
			return acc + `(${k}:${v}), `;
		},
		""
	)}`;

	console.log("Generating image " + prompt);

	fetch(`${process.env.SD_URL}sdapi/v1/txt2img`, {
		method: "POST",
		body: JSON.stringify({
			prompt: prompt,
			negative_prompt: "",
			seed: -1,
			steps: 20,
			cfg_scale: 7,
			width: 512,
			height: 512,
			sampler_index: "Euler a",
			send_images: true,
			save_images: false,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((res) => res.json())
		.then((json) => {
			const image = json.images[0];
			console.log("Finished generating image.");
			if (image) saveImageB64(`public/animals/${animal.id}.png`, image);
		})
		.catch((err) => console.error("Image gen error. ", err));
}
