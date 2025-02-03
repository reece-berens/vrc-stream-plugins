import type { Metadata } from "next";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const metadata: Metadata = {
	title: "VRC Stream Plugins",
	description: "OBS plugins to help with VEX Robotics Competition tournaments",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body style={{margin: 0}}>{children}</body>
		</html>
	);
}
