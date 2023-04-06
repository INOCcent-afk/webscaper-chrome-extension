import React, { FC } from "react";

interface Props {
	loginWithGoogle: () => void;
}

const SignInDashboard: FC<Props> = ({ loginWithGoogle }) => {
	return (
		<div className="signin-wrapper">
			<button className="button-blue" onClick={loginWithGoogle}>
				SIGN IN
			</button>
		</div>
	);
};

export default SignInDashboard;
