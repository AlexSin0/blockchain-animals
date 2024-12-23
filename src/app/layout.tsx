import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

import NavBar from "@/components/NavBar";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en ">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-[100vh]`}
			>
				<NavBar />
				<div className="flex-grow">{children}</div>
			</body>
		</html>
	);
}
