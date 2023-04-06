import React, { FC, FormEvent, useState } from "react";
import Loader from "../Loader/Loader";
import axios from "axios";
import "./AuthenticatedDashboard.css";
import { CSVLink } from "react-csv";

interface Props {
	user: User | null;
	scrapeCount: number;
	setScrapeCount: () => void;
}

const AuthenticatedDashboard: FC<Props> = ({
	user,
	scrapeCount,
	setScrapeCount,
}) => {
	const [homes, setHomes] = useState<Home[] | null>(null);
	const [pageTitle, setPageTitle] = useState("");
	const [input, setInput] = useState("");
	const [isScraping, setIsScraping] = useState(false);
	const [error, setError] = useState(false);

	const scrapeRedfinData = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setScrapeCount();
		setHomes(null);
		setIsScraping(true);

		try {
			const result = await axios.post(
				"http://localhost:8080/scrape-redfin",
				{
					place: input,
				}
			);

			if (result) {
				setPageTitle(result.data.pageTitle);
				setHomes(result.data.homes);
				setInput("");
				setIsScraping(false);
			}
		} catch (error) {
			setError(true);
			setIsScraping(false);
		}
	};

	const tryAgain = () => {
		setError(false);
		setHomes(null);
		setInput("");
	};

	return (
		<>
			{user ? (
				<>
					<div className="user-container">
						<div className="user-wrapper">
							{user?.photoURL && (
								<img src={user?.photoURL} alt="" />
							)}
							{user.displayName && <h1>{user.displayName}</h1>}
						</div>

						<p className="user-scrape-count">
							scrape count: {scrapeCount}
						</p>
					</div>

					<div className="dashboard">
						{error && (
							<div className="dashboard-error">
								<p>
									Something went wrong.{" "}
									<button onClick={tryAgain}>
										try again?
									</button>
								</p>
							</div>
						)}
						{!error && (
							<form
								onSubmit={scrapeRedfinData}
								className="dashboard-input"
							>
								<input
									type="text"
									value={input}
									onChange={(e) =>
										setInput(e.currentTarget.value)
									}
									required
									placeholder="City, Address, School, Agent, ZIP"
								/>
								<button
									className="button-blue"
									disabled={isScraping}
									type="submit"
								>
									{isScraping
										? "Loading..."
										: "Scrape Redfin Data"}
								</button>
							</form>
						)}

						{homes && homes.length ? (
							<>
								<CSVLink
									data={homes}
									className="button-blue export-csv "
								>
									Export CSV
								</CSVLink>

								{pageTitle && <h1>{pageTitle}</h1>}

								<table className="">
									<thead>
										<tr>
											<th>Address</th>
											<th>Stats</th>
											<th>Price</th>
										</tr>
									</thead>
									<tbody>
										{homes.map((home, index) => (
											<tr key={index}>
												<td>{home.address}</td>
												<td>{home.stats}</td>
												<td>{home.price}</td>
											</tr>
										))}
									</tbody>
								</table>
							</>
						) : null}
					</div>
				</>
			) : (
				<div className="user-container">
					<Loader />
				</div>
			)}
		</>
	);
};

export default AuthenticatedDashboard;
