import * as fs from "node:fs/promises";
import { parse, stringify } from "yaml";

export const fileExists = (path: string) =>
	fs.stat(path).then(
		() => true,
		() => false
	);

export function saveImageB64(path: string, image: string) {
	return fs.writeFile(path, image, { encoding: "base64" });
}

// blockchain
const bcFile = "blockchain.yaml";

export function appendToBcFile(block: any) {
	const yaml = stringify([block]);
	return fs.writeFile(bcFile, yaml, { flag: "a+" });
}

export function newBcFile(bc: any) {
	const yaml = stringify(bc);
	return fs.writeFile(bcFile, yaml);
}

export async function loadBcFromFile() {
	const str = await fs.readFile(bcFile, { encoding: "utf8" });
	return parse(str);
}
