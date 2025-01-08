"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function page() {
	const [animals, setAnimals] = useState([]);
	const [select, setSelect] = useState(-1);

	useEffect(loadAnimals, []);

	function loadAnimals() {
		// get animals only from particular user

		fetch("/api/animals")
			.then((res) => res.json())
			.then((json) => setAnimals(json));
		console.log(animals);
	}

	if (!animals) {
		return <div>Loading...</div>;
	}
	return (
		<div className="flex flex-wrap">
			{animals.map((animal: any, i) => (
				<div key={i} className="border w-[320px] h-[480px] p-4 m-4 rounded-md">
					<Image
						src={`/animals/${animal.id}.png`}
						alt=""
						width={512}
						height={512}
						className="rounded-sm"
					/>
					<p className="text-center">{capitalizeFirstLetter(animal.type)}</p>
					<div className="mt-2 flex gap-2 flex-wrap justify-center">
						{genes(animal)}
					</div>
					<div className="flex mt-2 gap-3 justify-center">
						{select === -1 ? (
							<button
								className="bg-blue-600 p-3 rounded-lg m-1"
								onClick={() => {
									setSelect(i);
								}}
							>
								Select
							</button>
						) : select === i ? (
							<button
								className="bg-red-600 p-3 rounded-lg m-1"
								onClick={() => {
									setSelect(-1);
								}}
							>
								Deselect
							</button>
						) : (
							<button
								className="bg-green-600 p-3 rounded-lg m-1"
								onClick={async () => {
									fetch("/api/animals", {
										method: "post",
										headers: {
											Accept: "application/json",
											"Content-Type": "application/json",
										},
										body: JSON.stringify([animals[i], animals[select]]),
									});
									loadAnimals();
								}}
							>
								Crossbreed
							</button>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

function genes(animal: any) {
	return Object.entries(animal.genes).map(([k, v], i) => (
		<div
			key={i}
			style={{
				backgroundColor: `rgba(22, 163, 74, ${v})`,
			}}
			className="px-2 py-0.5 rounded-lg text-nowrap"
		>
			{k}:{round(v as number)}
		</div>
	));
}

function capitalizeFirstLetter(val: string) {
	return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function round(v: number) {
	return Math.round(v * 100) / 100;
}
