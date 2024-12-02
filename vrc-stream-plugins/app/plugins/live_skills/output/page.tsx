"use client";
import { useSearchParams } from "next/navigation";
import {useEffect, useState} from "react";

import { Collapse } from "@mui/material";

import { CallTheAPI } from "./testAPI";

const defaultSkillsResource: TM_SkillsResource = {
	DriverAttempts: 2,
	DriverHighScore: 30,
	Number: "00000A",
	ProgAttempts: 1,
	ProgHighScore: 15,
	Rank: 1,
	Tie: true,
	TotalScore: 45,
};

export default function LiveSkillsOutput() {
	const searchParams = useSearchParams();
	
	const backgroundColorParam = searchParams.get("backgroundColor") ?? "";
	const fontColorParam = searchParams.get("fontColor") ?? "";
	const tmURLParam = searchParams.get("tmURL") ?? "";
	const tmKeyParam = searchParams.get("tmKey") ?? "";
	const isTestParam = searchParams.get("isTest") ?? "0";
	const widthParam = searchParams.get("width") ?? "800px";
	const heightParam = searchParams.get("height") ?? "500px";
	const fontSizeParam = searchParams.get("fontSize") ?? "24px";
	const boxDurationParam = searchParams.get("boxDuration") ?? "8";
	const boxDowntimeParam = searchParams.get("boxDowntime") ?? "5";

	let thisBackgroundColor = decodeURIComponent(backgroundColorParam);
	let thisFontColor = decodeURIComponent(fontColorParam);
	let thisTmURL = decodeURIComponent(tmURLParam);
	let thisTmKey = decodeURIComponent(tmKeyParam);
	let thisWidth = widthParam;
	let thisHeight = heightParam;
	let thisFontSize = fontSizeParam;
	let timeToShowBox = parseInt(boxDurationParam);
	if (isNaN(timeToShowBox)) {
		timeToShowBox = 8;
	}
	let boxDowntime = parseInt(boxDowntimeParam);
	if (isNaN(boxDowntime)) {
		boxDowntime = 5;
	}

	const [showBox, _showBox] = useState(false);
	const [initialListLoaded, _initialListLoaded] = useState(false);
	const [localSkillsList, _localSkillsList] = useState<TM_SkillsResource[]>([]);
	const [displayQueue, _displayQueue] = useState<TM_SkillsResource[]>([]);
	const [curDisplay, _curDisplay] = useState<TM_SkillsResource>(defaultSkillsResource);
	const [test_tourneyCode, _test_tourneyCode] = useState<string>("");
	const [test_error, _test_error] = useState<string>("");

	useEffect(() => {
		if (isTestParam === "1") {
			//just get the tournament code from the TM API, this will show that the connection can be made and the test param can be removed and everything "should" work fine
			//if there's an error doing so, update the test_error state value so the user knows what's up
			//		maybe put some message in the console that they can look at more info for (also to help me know what's up)
		}
		else {
			//do an initial load of data from the server, but don't do anything with the initial list
			//this will make sure we don't show a bunch of things if the webpage is loaded in the middle of a tournament
			const listFromAPI: TM_SkillsResource[] = CallTheAPI();
			_localSkillsList(listFromAPI);
			_initialListLoaded(true);
		}
		
	}, []);

	useEffect(() => {
		const displayInterval = setInterval(() => {
			if (displayQueue.length > 0 && !showBox && isTestParam === "0") {
				_curDisplay({...displayQueue[0]});
				_displayQueue(oldQueue => oldQueue.length === 1 ? [] : oldQueue.slice(1));
				_showBox(true);
				setTimeout(() => {
					_showBox(false);
				}, timeToShowBox * 1000);
			}
		}, boxDowntime * 1000);

		return () => {
			clearInterval(displayInterval);
		}
	}, [displayQueue, showBox]);

	useEffect(() => {
		if (initialListLoaded && isTestParam === "0") {
			const skillsListInterval = setInterval(() => {
				//at this point, we should call the TM API to get the skills list
				const listFromAPI: TM_SkillsResource[] = CallTheAPI();
	
				//go through each item and see what differences there are
				//new team or increase in driver or programming attempts for existing team
				const newDisplayQueue = [...displayQueue];
				listFromAPI.forEach(apiItem => {
					let localItem = localSkillsList.find(x => x.Number === apiItem.Number);
					if (localItem) {
						if (localItem.DriverAttempts !== apiItem.DriverAttempts || localItem.ProgAttempts !== apiItem.ProgAttempts) {
							//this is an existing item with an updated attempt number, add to display queue
							let dqItem = newDisplayQueue.find(x => x.Number === apiItem.Number);
							if (dqItem) {
								newDisplayQueue.splice(newDisplayQueue.indexOf(dqItem), 1, {...apiItem});
							}
							else {
								newDisplayQueue.push({...apiItem});
							}
						}
					}
					else {
						//this is a new team doing skills, add them to the list
						newDisplayQueue.push({...apiItem});
					}
				});
				_displayQueue(newDisplayQueue);
				const newLocalSkills: TM_SkillsResource[] = [];
				listFromAPI.forEach(x => newLocalSkills.push({...x}));
				_localSkillsList(newLocalSkills);
			}, 10000);
	
			return () => {
				clearInterval(skillsListInterval);
			}
		}
	}, [localSkillsList, displayQueue]);

	const BuildRankString = (rank: number) => {
		let lastDigit = rank % 10;
		if (lastDigit === 1 && rank !== 11) {
			return `${rank}st`;
		}
		else if (lastDigit === 2 && rank !== 12) {
			return `${rank}nd`;
		}
		else if (lastDigit === 3 && rank !== 13) {
			return `${rank}rd`;
		}
		else {
			return `${rank}th`;
		}
	}

	//http://localhost:3000/plugins/live_skills/output?backgroundColor=rgb%281%2C100%2C100%29&fontColor=rgb%28100%2C200%2C200%29&tmURL=https&tmKey=98jsfd98gvh239uhr4&isTest=1&width=800px&height=500px&fontSize=32px&boxDuration=10

	const colorRegEx = new RegExp("^rgb\\((([0-1]?[0-9]?[0-9]?|2[0-4][0-9]|25[0-5])),(([0-1]?[0-9]?[0-9]?|2[0-4][0-9]|25[0-5])),(([0-1]?[0-9]?[0-9]?|2[0-4][0-9]|25[0-5]))\\)$");
	const pixelRegEx = new RegExp("^\\d{2,3}px$");

	if (!colorRegEx.test(thisBackgroundColor)) {
		console.log("invalid background color value, changing to default");
		thisBackgroundColor = "rgb(255,255,255)";
	}
	if (!colorRegEx.test(thisFontColor)) {
		console.log("invalid font color, changing to default");
		thisFontColor = "rgb(0,0,0)";
	}
	if (!pixelRegEx.test(thisWidth)) {
		console.log("invalid width param, changing to default");
		thisWidth = "800px";
	}
	if (!pixelRegEx.test(thisHeight)) {
		console.log("invalid height param, changing to default");
		thisHeight = "600px";
	}
	if (!pixelRegEx.test(thisFontSize)) {
		console.log("invalid font size param, changing to default");
		thisFontSize = "24px";
	}

	return (
		<div>
			<Collapse in={showBox || isTestParam === "1"}>
				<div style={{backgroundColor: thisBackgroundColor, margin: "auto", width: thisWidth, height: thisHeight, overflow: "auto"}}>
					<p style={{paddingLeft: "10px", color: thisFontColor, fontSize: thisFontSize, fontWeight: "bold"}}>Team Number: {curDisplay.Number}</p>
					<p style={{paddingLeft: "10px", color: thisFontColor, fontSize: thisFontSize, fontWeight: "bold"}}>Current Rank: {BuildRankString(curDisplay.Rank)} {curDisplay.Tie ? " (tied with another team)": ""}</p>
					<p style={{paddingLeft: "10px", color: thisFontColor, fontSize: thisFontSize, fontWeight: "bold"}}>Programming High Score: {curDisplay.ProgHighScore} {`(${curDisplay.ProgAttempts} attempt${curDisplay.ProgAttempts === 1 ? "" : "s"})`}</p>
					<p style={{paddingLeft: "10px", color: thisFontColor, fontSize: thisFontSize, fontWeight: "bold"}}>Driver's High Score: {curDisplay.DriverHighScore} {`(${curDisplay.DriverAttempts} attempt${curDisplay.DriverAttempts === 1 ? "" : "s"})`}</p>
					<p style={{paddingLeft: "10px", color: thisFontColor, fontSize: thisFontSize, fontWeight: "bold"}}>Skills Score: {curDisplay.TotalScore}</p>
					{isTestParam && (
						<>
							<p style={{paddingLeft: "10px", color: thisFontColor, fontSize: thisFontSize, fontWeight: "bold"}}>TM Tournament Code: {test_tourneyCode}</p>
						</>
					)}
				</div>
			</Collapse>
		</div>
	)
}
