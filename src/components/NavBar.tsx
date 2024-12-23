import Link from "next/link";
import { auth } from "@/lib/auth";
import SignIn from "@/components/SignIn";
import SignOut from "@/components/SignOut";

export default async function NavBar() {
	const session = await auth();

	return (
		<nav className="bg-neutral-700 p-3 flex">
			<NavButton>
				<Link href="/">Main</Link>
			</NavButton>
			<NavButton>{session?.user?.email ? <SignOut /> : <SignIn />}</NavButton>
		</nav>
	);
}

function NavButton(props: { children: React.ReactNode }) {
	return <div className="hover:underline">{props.children}</div>;
}
