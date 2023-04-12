import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getAuth, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import AuthenticatedDashboard from "./components/AuthenticatedDashboard/AuthenticatedDashboard";
import SignInDashboard from "./components/SignInDashboard/SignInDashboard";
import "./App.css";

function App() {
	const auth = getAuth();

	const [stateAuth, setStateAuth] = useState(
		false || window.localStorage.getItem("auth") === "true"
	);
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<String | null>();
	const [scrapeCount, setScrapeCount] = useState(
		Number(window.localStorage.getItem("scrapeCount") || 0)
	);

	const loginWithGoogle = async () => {
		const provider = new firebase.auth.GoogleAuthProvider();

		const result = await signInWithPopup(auth, provider);

		if (result) {
			const tokenId = await result.user.getIdToken();

			setUser({
				displayName: result.user.displayName,
				photoURL: result.user.photoURL,
				uid: result.user.uid,
			});
			setToken(tokenId);

			window.localStorage.setItem("auth", "true");
		}
	};

	useEffect(() => {
		onAuthStateChanged(auth, async (userCredentials) => {
			if (userCredentials) {
				setUser({
					displayName: userCredentials.displayName,
					photoURL: userCredentials.photoURL,
					uid: userCredentials.uid,
				});

				setStateAuth(true);
				window.localStorage.setItem("auth", "true");
				const token = await userCredentials.getIdToken();

				setToken(token);
			}
		});
	}, []);

	const increaseScrapeCount = () => {
		setScrapeCount((prevCount) => prevCount + 1);
		window.localStorage.setItem("scrapeCount", String(scrapeCount + 1));
	};

	return (
		<div className="App">
			{stateAuth ? (
				<AuthenticatedDashboard
					user={user}
					scrapeCount={scrapeCount}
					setScrapeCount={increaseScrapeCount}
				/>
			) : (
				<SignInDashboard loginWithGoogle={loginWithGoogle} />
			)}
		</div>
	);
}

export default App;
