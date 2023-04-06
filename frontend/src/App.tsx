import { useState } from "react";
import "./App.css";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {
	getAuth,
	onAuthStateChanged,
	signInWithRedirect,
	createUserWithEmailAndPassword,
	signOut,
	sendEmailVerification,
	signInWithEmailAndPassword,
} from "firebase/auth";

const data = [
	{
		name: "Search Engine",
		url: [
			"https://github.com/INOCcent-afk/webscaper-chrome-extension",
			"https://twitter.com/messages/715768526007611392-1328033777092845570",
			"https://www.redfin.com/",
		],
	},
];

function App() {
	const onLogin = async (e) => {
		e.preventDefault();

		try {
			await signInWithEmailAndPassword(auth, email, password);
		} catch (error) {
			console.log(JSON.stringify(error));
		}
	};

	return (
		<div className="App">
			<button>Sign In</button>
		</div>
	);
}

export default App;
