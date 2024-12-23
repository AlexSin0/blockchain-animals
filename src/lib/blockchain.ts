import { sha1 } from "object-hash";
import { parse, stringify } from "yaml";
import * as fs from "node:fs/promises";
import { Animal, setAnimals } from "./animal";

export type Block = {
	timestamp: number;
	type: string;
	data: any;
	previousHash: string;
};

function newBlock(type: string, data: any, previousHash = "") {
	return {
		timestamp: Date.now(),
		type: type,
		data: data,
		previousHash: previousHash,
	} as Block;
}

function hash(block: Block) {
	return sha1(block);
}

const bcFile = "blockchain.yaml";
const genBlock = newBlock("system", { info: "Initializing blockchain" });

export const blockchain = await initBlockchain();

async function initBlockchain() {
	try {
		// load from file
		console.log("Loading blockchain...");
		const str = await fs.readFile(bcFile, { encoding: "utf8" });
		const bc = parse(str) as Block[];

		const err = checkBlockchain(bc);
		if (err) {
			throw new Error(`Faulty block at index ${err}`);
		}

		// process blocks
		const loadedAnimals: Animal[] = [];

		bc.forEach((b) => {
			switch (b.type) {
				case "animal": {
					const animal = b.data.animal as Animal;
					loadedAnimals.push(animal);
					break;
				}
			}
		});

		setAnimals(loadedAnimals);

		return bc;
	} catch (error) {
		// create new blockchain
		console.warn(`Blockchain file error. ${error}`);
		console.log("Starting new blockchain...");
		const bc = [genBlock];

		// save to file
		const yaml = stringify(bc);
		await fs.writeFile(bcFile, yaml);

		return bc;
	}
}

export function createBlock(type: string, data: any) {
	const block = newBlock(type, data, hash(blockchain[blockchain.length - 1]));
	blockchain.push(block);

	// save to file
	const yaml = stringify([block]);
	fs.writeFile(bcFile, yaml, { flag: "a+" });
}

export function checkBlockchain(blockchain: Block[]) {
	for (let i = 1; i < blockchain.length; i++) {
		const prevBlock = blockchain[i - 1];
		const block = blockchain[i];

		const prevHash = hash(prevBlock);

		if (prevHash !== block.previousHash) {
			console.log("Comparison failed.", prevBlock, prevHash, block);
			return i;
		}
	}

	return 0;
}
