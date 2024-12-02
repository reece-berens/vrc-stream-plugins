const teamList = [
	"4101K",
	"4101A",
	"67101C",
	"7862V"
];

//I'll put some initial data in here for now...
const scoresList: TM_SkillsResource[] = [
	{
		DriverAttempts: 1,
		DriverHighScore: 5,
		Number: "4101K",
		ProgAttempts: 1,
		ProgHighScore: 10,
		Rank: 1,
		Tie: false,
		TotalScore: 15
	},
	{
		DriverAttempts: 0,
		DriverHighScore: 0,
		Number: "4101A",
		ProgAttempts: 1,
		ProgHighScore: 0,
		Rank: 2,
		Tie: false,
		TotalScore: 0
	},
];

const RandomInt = (max: number): number => {
	return Math.floor(Math.random() * max);
}

var curInterval = 0;
var intervalNum = 0;

export const CallTheAPI = (): TM_SkillsResource[] => {
	if (intervalNum === 0) {
		//first time the method is called - we return the default list now
		intervalNum = RandomInt(10) + 1;
	}
	else {
		if (curInterval === intervalNum) {
			//add something to the list, also reset the intervals
			//for (let teamToUpdate of teamList) {
				intervalNum = RandomInt(10) + 1;
				curInterval = 0;
				let teamToUpdate = teamList[RandomInt(teamList.length)];
				let curItem: TM_SkillsResource | undefined = scoresList.find(x => x.Number === teamToUpdate);
				let newScore = RandomInt(50);
				let dpChoice = RandomInt(2);
				if (typeof curItem === "undefined") {
					curItem = {
						DriverAttempts: dpChoice === 1 ? 1 : 0,
						DriverHighScore: dpChoice === 1 ? newScore : 0,
						Number: teamToUpdate,
						ProgAttempts: dpChoice === 0 ? 1 : 0,
						ProgHighScore: dpChoice === 0 ? newScore : 0,
						Rank: 4,
						Tie: false,
						TotalScore: newScore
					};
					scoresList.push(curItem);
				}
				else {
					curItem.DriverAttempts = dpChoice === 1 ? curItem.DriverAttempts + 1 : curItem.DriverAttempts;
					curItem.DriverHighScore = dpChoice === 1 ? (curItem.DriverHighScore < newScore ? newScore : curItem.DriverHighScore) : curItem.DriverHighScore;
					curItem.ProgAttempts = dpChoice === 0 ? curItem.ProgAttempts + 1 : curItem.ProgAttempts;
					curItem.ProgHighScore = dpChoice === 0 ? (curItem.ProgHighScore < newScore ? newScore : curItem.ProgHighScore) : curItem.ProgHighScore;
					curItem.TotalScore = curItem.DriverHighScore + curItem.ProgHighScore;
				}
			//}
		}
		else {
			//interval numbers don't match, just update current interval
			curInterval++;
		}
	}
	return scoresList;
}
