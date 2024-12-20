import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { SignIn } from "@/components/SignIn";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en ">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-[100vh]`}
			>
				<nav className="bg-neutral-700 p-3 flex">
					<NavButton href="/" text="Main" />
					<SignIn />
				</nav>
				<div className="flex-grow">{children}</div>
			</body>
		</html>
	);
}

function NavButton(props: { href: string; text: string }) {
	return (
		<Link className="hover:underline" href={props.href}>
			{props.text}
		</Link>
	);
}
