import { createBlock } from "./blockchain";

// I had to hoist it, or else
// ReferenceError: Cannot access 'animalsArr' before initialization
export var animals: Animal[];

export function setAnimals(newAnimals: Animal[]) {
	animals = newAnimals;
}

export class Animal {
	public quality = 1;

	constructor(
		public owner: string,
		public type: string,
		public genes: Gene[]
	) {}
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
			weight: Math.round((Math.random() / 3) * 100) / 100,
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
