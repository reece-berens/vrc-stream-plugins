"use client";
import {useSearchParams} from "next/navigation";
import {forwardRef, useEffect, useRef, useState} from "react";

import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import Typography from "@mui/material/Typography";

import useTMAPI from "@/app/helpers/useTMAPI_Hook";

export default function QualiCrawlerOutput() {
	const searchParams = useSearchParams();
	const crawlerRef = useRef<HTMLDivElement>(null);
	const crawlerDivRef = useRef<HTMLDivElement>(null);

	const tmURLParam = searchParams.get("tmURL") ?? "";
	const tmKeyParam = searchParams.get("tmKey") ?? "";
	const showPoints = searchParams.get("showPoints") ?? "0";
	const divisionID = searchParams.get("divisionID") ?? "0";

	let thisTmURL = decodeURIComponent(tmURLParam);
	let thisTmKey = decodeURIComponent(tmKeyParam);

	const tmAPI = useTMAPI(process.env.NEXT_PUBLIC_BASE_AUTH_URL || "", thisTmURL, thisTmKey);

	const [rankingString, _rankingString] = useState<string>("");
	const [rankTest, _rankTest] = useState<boolean>(true);
	const [rankTime, _rankTime] = useState<string>("0");
	const [rankWidth, _rankWidth] = useState<number>(0);

	useEffect(() => {
		console.log("useEffect with empty array - start the process");
		ReloadRankings();
		/*
		const divParsed = Number.parseInt(divisionID);
		tmAPI.GetMatchesData(divParsed).then(theseMatches => {
			console.log("these matches are below");
			console.log(theseMatches);
		});
		*/
	}, []);

	useEffect(() => {
		if (rankingString !== "") {
			/*
			math time

			speed of the crawler = total pixels of the text / seconds the animation should last
			...
			total pixels / speed = seconds
			*/

			const pixels = crawlerRef.current?.scrollWidth ?? 0;
			const speed = 80;
			const time = pixels / speed;
			console.log(`time for animation is ${time.toPrecision(2)}`);
			
			_rankTime(time.toPrecision(2));
			_rankTest(false);
			_rankWidth(pixels);
			setTimeout(() => {
				ReloadRankings();
			}, time * 1000);
		}
	}, [rankingString]);

	const BuildRankString = (theseRankings: TM_QualiRankingData[]): string => {
		var rankString = "";
		theseRankings.forEach(ranking => {
			if (ranking.alliance.teams.length > 0) {
				rankString += `${ranking.rank}. ${ranking.alliance.teams[0].number} -  ${ranking.wins}-${ranking.losses}-${ranking.ties}`;
				if (showPoints === "1") {
					//calculate WP, AP, and SP in that order, then show
					const wpavg = ranking.wp / ranking.numMatches;
					const apavg = ranking.ap / ranking.numMatches;
					const spavg = ranking.sp / ranking.numMatches;
					rankString += ` (${wpavg.toPrecision(2)} WP/Match, ${apavg.toPrecision(2)} AP/Match, ${spavg.toPrecision(2)} SP/Match)`;
				}
				rankString += "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0";
			}
		});
		return rankString;
	}

	const ReloadRankings = () => {
		_rankingString("");
		const divParsed = Number.parseInt(divisionID);
		if (isNaN(divParsed) || divParsed === 0) {
			//do something to indicate we won't go further because division isn't a valid number
			_rankingString("Division ID in URL parameters is not valid");
		}
		else {
			tmAPI.GetQualiRankingsData(divParsed).then(theseRankings => {
				theseRankings.sort((a, b) => a.rank < b.rank ? -1 : 1);
				console.log(theseRankings);
				const newRankString = BuildRankString(theseRankings);
				setTimeout(() => {
					_rankingString(newRankString);
					_rankTest(true);
				}, 1000);
			});
			/*
			const rankingsTest: TM_QualiRankingData[] = [
				{
					rank: 1,
					tied: false,
					alliance: {
						teams: [{number: "1234A"}],
						name: ""
					},
					wins: 3,
					losses: 0,
					ties: 0,
					wp: 13,
					ap: 12,
					sp: 45,
					avgPoints: 45,
					totalPoints: 2345,
					highScore: 32,
					numMatches: 3,
					minNumMatches: 7
				},
				{
					rank: 2,
					tied: false,
					alliance: {
						teams: [{number: "4567B"}],
						name: ""
					},
					wins: 2,
					losses: 0,
					ties: 1,
					wp: 14,
					ap: 18,
					sp: 34,
					avgPoints: 45,
					totalPoints: 2345,
					highScore: 32,
					numMatches: 3,
					minNumMatches: 7
				},
				{
					rank: 3,
					tied: false,
					alliance: {
						teams: [{number: "987C"}],
						name: ""
					},
					wins: 3,
					losses: 0,
					ties: 0,
					wp: 13,
					ap: 12,
					sp: 45,
					avgPoints: 45,
					totalPoints: 2345,
					highScore: 32,
					numMatches: 3,
					minNumMatches: 7
				},
				{
					rank: 4,
					tied: false,
					alliance: {
						teams: [{number: "98765X"}],
						name: ""
					},
					wins: 3,
					losses: 0,
					ties: 0,
					wp: 13,
					ap: 12,
					sp: 45,
					avgPoints: 45,
					totalPoints: 2345,
					highScore: 32,
					numMatches: 3,
					minNumMatches: 7
				},
				{
					rank: 5,
					tied: false,
					alliance: {
						teams: [{number: "6547J"}],
						name: ""
					},
					wins: 3,
					losses: 0,
					ties: 0,
					wp: 13,
					ap: 12,
					sp: 45,
					avgPoints: 45,
					totalPoints: 2345,
					highScore: 32,
					numMatches: 3,
					minNumMatches: 7
				},
			];
			*/
			
		}
	}

	return (
		<div style={{display: "flex"}}>
			<Typography style={{display: "inline-block", width: "10%", backgroundColor: "black", color: "white"}}>Qualification Rankings</Typography>
			<div ref={crawlerDivRef} style={{display: "inline-block", backgroundColor: "black", width: "90%", whiteSpace: "nowrap", overflowX: "hidden"}}>
				<QualiCrawlerText ref={crawlerRef} text={rankingString} time={rankTime} isTest={rankTest} textWidth={rankWidth} divWidth={crawlerDivRef.current?.clientWidth || 0} />
			</div>
		</div>
	)
}
//http://localhost:3000/plugins/quali_crawler/output?tmURL=http%3A%2F%2F192.168.0.196&tmKey=123456789asdf&showPoints=0&divisionID=1

interface QualiCrawlerText_Props {
	text: string;
	time: string;
	isTest: boolean;
	textWidth: number;
	divWidth: number;
}

//https://stackoverflow.com/a/69629316
const useAnimationStyles = ({divWidth, textWidth, time, isTest}: QualiCrawlerText_Props) => {
	const classes = makeStyles({
		"@keyframes crawler": {
			"from": {
				transform: `translate(${divWidth}px, 0%)`
			},
			"to": {
				transform: `translate(-${textWidth}px, 0)`
			}
		},
		styleAnimation: {
			animationName: "$crawler",
			animationDuration: `${time}s`,
			animationTimingFunction: "linear",
			display: isTest ? "none" : "block"
		},
		showTest: {
			color: "black"
		},
		hideTest: {
			color: "white"
		},
		base: {
			marginLeft: `${divWidth}px`
		}
	});
	return classes();
}

const QualiCrawlerText = forwardRef<HTMLDivElement, QualiCrawlerText_Props>((props, ref) => {
	const styles = useAnimationStyles(props);

	return (
		<Typography ref={ref}
			className={clsx({
				[styles.styleAnimation]: !props.isTest,
				[styles.showTest]: props.isTest,
				[styles.hideTest]: !props.isTest,
			})}
			style={{overflowX: "visible"}}
		>
			{props.text}
		</Typography>
	)
});
