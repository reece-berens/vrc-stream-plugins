"use client";
import { useSearchParams } from "next/navigation";
import {CSSProperties, useEffect, useRef, useState} from "react";

import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";

//import { CallTheAPI } from "./testAPI";
//import { ActualAPI } from "./actualAPI";
import useTMAPI from "@/app/helpers/useTMAPI_Hook";

const apiPingRate = 60000;

const defaultSkillsResource: TM_SkillsResource = {
	driverAttempts: 2,
	driverHighScore: 30,
	number: "00000A",
	progAttempts: 1,
	progHighScore: 15,
	rank: 1,
	tie: true,
	totalScore: 45,
};

export default function LiveSkillsOutput() {
	const searchParams = useSearchParams();
	const dataRef = useRef<HTMLDivElement>(null);

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

	console.log(process.env.NEXT_PUBLIC_BASE_AUTH_URL);
	let tmAPI = useTMAPI(process.env.NEXT_PUBLIC_BASE_AUTH_URL || "", thisTmURL, thisTmKey);

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
	//const [localSkillsList, _localSkillsList] = useState<TM_SkillsResource[]>([]);
	//const [displayQueue, _displayQueue] = useState<TM_SkillsResource[]>([]);
	const [curDisplay, _curDisplay] = useState<TM_SkillsResource>(defaultSkillsResource);
	const [test_tourneyCode, _test_tourneyCode] = useState<string>("");
	//const [test_error, _test_error] = useState<string>("");

	const textProps: CSSProperties = {
		paddingLeft: "10px", 
		color: thisFontColor, 
		fontSize: thisFontSize, 
		fontWeight: "bold",
		marginBottom: "15px"
	};

	useEffect(() => {
		if (isTestParam === "1") {
			//just get the tournament code from the TM API, this will show that the connection can be made and the test param can be removed and everything "should" work fine
			//if there's an error doing so, update the test_error state value so the user knows what's up
			//		maybe put some message in the console that they can look at more info for (also to help me know what's up)
			tmAPI.GetEventData().then((eventData) => {
				_test_tourneyCode(`${eventData.name} ~ ${eventData.code}`);
			});
			/*
			//Use this later, just a test for now
			tmAPI.GetDivisionsData().then(divData => {
				console.log(divData);
				tmAPI.GetQualiRankingsData(1).then(qualiData => {
					console.log("quali");
					console.log(qualiData);
				})
			});
			*/
		}
		else {
			//do an initial load of data from the server, but don't do anything with the initial list
			//this will make sure we don't show a bunch of things if the webpage is loaded in the middle of a tournament
			//const listFromAPI: TM_SkillsResource[] = [];
			tmAPI.GetSkillsData().then((listOfStuff) => {
				dataRef.current?.setAttribute("fullSkillsList", JSON.stringify(listOfStuff));
				dataRef.current?.setAttribute("displayQueue", JSON.stringify([]));
				//_localSkillsList(listOfStuff);
				_initialListLoaded(true);
			});
		}
	}, []);

	useEffect(() => {
		const displayInterval = setInterval(() => {
			var displayQueue: TM_SkillsResource[] = [];
			const displayQueueString = dataRef.current?.getAttribute("displayQueue");
			if (typeof displayQueueString === "string") {
				displayQueue = JSON.parse(displayQueueString);
			}
			if (displayQueue.length > 0 && !showBox && isTestParam === "0") {
				_curDisplay({...displayQueue[0]});
				//console.log("should clear out the display queue now...");
				//_displayQueue(oldQueue => oldQueue.length === 1 ? [] : oldQueue.slice(1));
				dataRef.current?.setAttribute("displayQueue", JSON.stringify(displayQueue.length === 1 ? [] : displayQueue.slice(1)));
				_showBox(true);
				setTimeout(() => {
					_showBox(false);
				}, timeToShowBox * 1000);
			}
		}, boxDowntime * 1000);

		return () => {
			clearInterval(displayInterval);
		}
	}, []);

	/*
	useEffect(() => {
		console.log("displayQueue effect");
		console.log(displayQueue);
		const displayInterval = setInterval(() => {
			if (displayQueue.length > 0 && !showBox && isTestParam === "0") {
				_curDisplay({...displayQueue[0]});
				console.log("should clear out the display queue now...");
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
	*/

	useEffect(() => {
		if (initialListLoaded && isTestParam === "0") {
			const skillsListInterval = setInterval(() => {
				//at this point, we should call the TM API to get the skills list
				//console.log("im getting skills data now inside useEffect interval thing");
				tmAPI?.GetSkillsData().then(listFromAPI => {
					//const listFromAPI: TM_SkillsResource[] = CallTheAPI();
		
					//go through each item and see what differences there are
					//new team or increase in driver or programming attempts for existing team
					var newDisplayQueue: TM_SkillsResource[] = [];
					var localSkillsList: TM_SkillsResource[] = [];
					const newDisplayString = dataRef.current?.getAttribute("displayQueue");
					if (typeof newDisplayString === "string" && newDisplayString !== "") {
						newDisplayQueue = JSON.parse(newDisplayString);
					}
					const localSkillsString = dataRef.current?.getAttribute("fullSkillsList");
					if (typeof localSkillsString === "string" && localSkillsString !== "") {
						localSkillsList = JSON.parse(localSkillsString);
					}
					//const newDisplayQueue = [...displayQueue];
					listFromAPI.forEach(apiItem => {
						let localItem = localSkillsList.find(x => x.number === apiItem.number);
						if (localItem) {
							if (localItem.driverAttempts !== apiItem.driverAttempts || localItem.progAttempts !== apiItem.progAttempts) {
								//this is an existing item with an updated attempt number, add to display queue
								let dqItem = newDisplayQueue.find(x => x.number === apiItem.number);
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
					//console.log("before setting display queue again");
					//console.log(newDisplayQueue);
					dataRef.current?.setAttribute("displayQueue", JSON.stringify(newDisplayQueue));
					dataRef.current?.setAttribute("fullSkillsList", JSON.stringify(listFromAPI));
					/*_displayQueue(newDisplayQueue);
					const newLocalSkills: TM_SkillsResource[] = [];
					listFromAPI.forEach(x => newLocalSkills.push({...x}));
					_localSkillsList(newLocalSkills);*/
				})
			}, apiPingRate);
			
			return () => {
				clearInterval(skillsListInterval);
			}
		}
	}, [initialListLoaded]);

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

	const colorRegEx = new RegExp("^rgb\\((([0-1]?[0-9]?[0-9]?|2[0-4][0-9]|25[0-5])),\\s?(([0-1]?[0-9]?[0-9]?|2[0-4][0-9]|25[0-5])),\\s?(([0-1]?[0-9]?[0-9]?|2[0-4][0-9]|25[0-5]))\\)$");
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
				<div style={{backgroundColor: thisBackgroundColor, margin: "auto", width: thisWidth, height: thisHeight, overflowY: "hidden", overflowX: "auto"}}>
					<Typography style={textProps}>Team Number: {curDisplay.number}</Typography>
					<Typography style={textProps}>Current Rank: {BuildRankString(curDisplay.rank)} {curDisplay.tie ? " (tied with another team)": ""}</Typography>
					<Typography style={textProps}>Programming High Score: {curDisplay.progHighScore} {`(${curDisplay.progAttempts} attempt${curDisplay.progAttempts === 1 ? "" : "s"})`}</Typography>
					<Typography style={textProps}>Driver's High Score: {curDisplay.driverHighScore} {`(${curDisplay.driverAttempts} attempt${curDisplay.driverAttempts === 1 ? "" : "s"})`}</Typography>
					<Typography style={textProps}>Skills Score: {curDisplay.totalScore}</Typography>
					{isTestParam === "1" && (
						<>
							<Typography style={textProps}>TM Tournament Name/Code: {test_tourneyCode}</Typography>
						</>
					)}
				</div>
			</Collapse>
			<div ref={dataRef} />
		</div>
	)
}
