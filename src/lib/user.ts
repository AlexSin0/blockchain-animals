import { createBlock } from "./blockchain";

class User {
	constructor(public balance = 500) {}
}

const users = new Map<string, User>();

export type GiveMoneyType = {
	user: string;
	amount: number;
	info: string;
};

function userCheck(email: string) {
	if (users.has(email)) return;

	users.set(email, new User());
	console.log("No user balance found. Created new one " + email);
}

export function addMoney(email: string, amount: number, info: string = "") {
	userCheck(email);

	const user = users.get(email)!;
	user.balance += amount;

	createBlock("money", { user: email, amount: amount, info: info });
}

export function addMoneyUnrecorded(email: string, amount: number) {
	userCheck(email);

	const user = users.get(email)!;
	user.balance += amount;
}

export function getMoney(email: string) {
	userCheck(email);

	return users.get(email)!.balance;
}
