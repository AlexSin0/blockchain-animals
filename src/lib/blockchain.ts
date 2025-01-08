import { sha1 } from "object-hash";
import { Animal, setAnimals } from "./animal";
import * as FS from "./fs";
import { addMoneyUnrecorded, GiveMoneyType } from "./user";

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
	return sha1(FS.sanitize(block));
}

const genBlock = newBlock("system", { info: "Initializing blockchain" });

export const blockchain = await initBlockchain();

async function initBlockchain() {
	try {
		// load from file
		console.log("Loading blockchain...");
		const bc = (await FS.loadBcFromFile()) as Block[];

		const err = checkBlockchain(bc);
		if (err) {
			throw new Error(`Faulty block at index ${err}`);
		}

		// process blocks
		const loadedAnimals: Animal[] = [];

		bc.forEach((b) => {
			switch (b.type) {
				case "animal": {
					const animal = b.data as Animal;
					loadedAnimals.push(animal);
					break;
				}
				case "money": {
					const { user, amount, info }: GiveMoneyType = b.data;
					addMoneyUnrecorded(user, amount);
					break;
				}
				case "sell": {
					const { price, animal }: { price: number; animal: Animal } = b.data;
					const index = loadedAnimals.findIndex((v) => v.id === animal.id);
					loadedAnimals.splice(index, 1);
					addMoneyUnrecorded(animal.owner, price);
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
		FS.newBcFile(bc);

		return bc;
	}
}

export function createBlock(type: string, data: any) {
	const block = newBlock(type, data, hash(blockchain[blockchain.length - 1]));

	blockchain.push(block);
	FS.appendToBcFile(block);
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
