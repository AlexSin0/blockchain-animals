import { sha1 } from "object-hash";
import { parse, stringify } from "yaml";
import * as fs from "node:fs/promises";

export class Block {
	public timestamp: number;

	constructor(
		public type: string,
		public data: any,
		public previousHash: string = ""
	) {
		this.timestamp = Date.now();
	}

	public hash() {
		return sha1(this);
	}
}

const bcFile = "blockchain.yaml";
const genBlock = new Block("system", { info: "Initializing blockchain" });

export const blockchain = await initBlockchain();
console.log(blockchain);

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

export function createBlock(data: any) {
	const block = new Block(data, blockchain[blockchain.length - 1].hash());
	blockchain.push(block);

	// save to file
	const yaml = stringify([block]);
	fs.writeFile(bcFile, yaml, { flag: "a+" });
}

export function checkBlockchain(blockchain: Block[]) {
	for (let i = 1; i < blockchain.length; i++) {
		const prevBlock = blockchain[i - 1];
		const block = blockchain[i];

		if (prevBlock.hash() !== block.previousHash) {
			return i;
		}
	}

	return 0;
}
