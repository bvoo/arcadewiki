import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import type React from "react";
import { useEffect, useState } from "react";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Arcade.Wiki - Arcade Controller Database",
			},
			{
				name: "description",
				content:
					"Comprehensive database of arcade-style controllers. Compare specs, get the full picture, and find the perfect controller.",
			},
			// Open Graph
			{
				property: "og:site_name",
				content: "Arcade.Wiki",
			},
			{
				property: "og:type",
				content: "website",
			},
			// Twitter Card
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				type: "image/x-icon",
				href: "/favicon/favicon.ico",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "96x96",
				href: "/favicon/favicon-96x96.png",
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon/favicon.svg",
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/favicon/apple-touch-icon.png",
			},
			{
				rel: "manifest",
				href: "/manifest.json",
			},
		],
	}),

	notFoundComponent: () => (
		<div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
			<div className="text-center">
				<h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
				<p className="text-gray-400 mb-6">
					The page you are looking for doesn’t exist.
				</p>
				<a className="text-blue-500 hover:underline" href="/">
					Go back home
				</a>
			</div>
		</div>
	),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				{typeof window !== "undefined" && import.meta.env.DEV ? (
					<ClientDevtools />
				) : null}
				<Scripts />
			</body>
		</html>
	);
}

function ClientDevtools() {
	const [node, setNode] = useState<React.ReactNode>(null);
	// Use a dynamic import to avoid bundling devtools into the server build.
	useEffect(() => {
		let mounted = true;
		Promise.all([
			import("@tanstack/react-devtools"),
			import("@tanstack/react-router-devtools"),
		]).then(([devtools, routerDevtools]) => {
			if (!mounted) return;
			const { TanstackDevtools } = devtools as any;
			const { TanStackRouterDevtoolsPanel } = routerDevtools as any;
			setNode(
				<TanstackDevtools
					config={{ position: "bottom-left" }}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>,
			);
		});
		return () => {
			mounted = false;
		};
	}, []);
	return node;
}
