interface User {
	displayName: string | null;
	photoURL: string | null;
	uid: string;
}

interface Home {
	price?: string;
	stats?: string[];
	address?: string;
}

interface HomeData {
	pageTitle: string;
	homes: Home[];
}
