import { randomUUID } from "node:crypto";
import { createBlock } from "./blockchain";
import { fileExists, saveImageB64 } from "./fs";

// I had to hoist it, or else
// ReferenceError: Cannot access 'animalsArr' before initialization
export var animals: Animal[];

export function setAnimals(newAnimals: Animal[]) {
	animals = newAnimals;
}

export class Animal {
	public quality = 1;
	public id: string;

	constructor(public owner: string, public type: string, public genes: Gene[]) {
		this.id = randomUUID();
	}
}

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

type Gene = {
	name: string;
	weight: number;
};

export function createAnimal(owner: string, quality = 1) {
	const animalType = randElement(animalTypes);

	const genes: Gene[] = [];
	for (let i = 0; i < 3; i++) {
		const gene = randElement(animalGenes);
		genes.push({
			name: gene,
			weight: Math.round((Math.random() / 3) * 100) / 100 + 0.1,
		});
	}

	const animal = new Animal(owner, animalType, genes);
	animals.push(animal);
	createBlock("animal", { animal: animal });
	console.log("Created new animal. Owner " + owner);
}

function randElement(arr: any[]) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function sendImageGenRequest(animal: Animal) {
	let prompt = `${animal.type}, ${animal.genes.reduce((acc, gene) => {
		return acc + `(${gene.name}:${gene.weight}), `;
	}, "")}`;

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
