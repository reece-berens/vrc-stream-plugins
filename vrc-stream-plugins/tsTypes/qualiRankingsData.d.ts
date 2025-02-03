interface TM_QualiRankingData {
	rank: number;
	tied: boolean;
	alliance: {
		name: string;
		teams: TM_QualiRankingData_Alliance_Team[];
	}
	wins: number;
	losses: number;
	ties: number;
	wp: number;
	ap: number;
	sp: number;
	avgPoints: number;
	totalPoints: number;
	highScore: number;
	numMatches: number;
	minNumMatches: number;
}

interface TM_QualiRankingData_Alliance_Team {
	number: string;
}
