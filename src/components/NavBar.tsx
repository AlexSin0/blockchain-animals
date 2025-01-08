import Link from "next/link";
import { auth } from "@/lib/auth";
import SignIn from "@/components/SignIn";
import SignOut from "@/components/SignOut";
import { getMoney } from "@/lib/user";

export default async function NavBar() {
	const session = await auth();
	const email = session?.user?.email;

	return (
		<nav className="bg-neutral-700 p-3 flex justify-around">
			<NavButton>
				<Link href="/">Main</Link>
			</NavButton>
			{email ? (
				<>
					<NavButton>
						<SignOut />
					</NavButton>
					<NavButton>{round(getMoney(email))} 🪙</NavButton>
				</>
			) : (
				<SignIn />
			)}
		</nav>
	);
}

function NavButton(props: { children: React.ReactNode }) {
	return <div className="hover:underline">{props.children}</div>;
}

function round(v: number) {
	return Math.round(v * 100) / 100;
}
