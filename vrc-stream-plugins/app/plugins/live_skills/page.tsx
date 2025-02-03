"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import {MuiColorInput} from "mui-color-input";

export default function LiveSkillsLanding() {
	const [tmURL, _tmURL] = useState<string>("");
	const [tmAPIKey, _tmAPIKey] = useState<string>("");
	const [width, _width] = useState<string>("800");
	const [height, _height] = useState<string>("500");
	const [fontSize, _fontSize] = useState<string>("32");
	const [backgroundColor, _backgroundColor] = useState<string>("rgb(0, 0, 0)");
	const [textColor, _textColor] = useState<string>("rgb(255, 255, 255)");
	const [boxTimePerScore, _boxTimePerScore] = useState<string>("8");
	const [timeBetweenScores, _timeBetweenScores] = useState<string>("10");
	const [testForSample, _testForSample] = useState<boolean>(false);

	const CreateAndCopyURL = () => {
		var url = window.location.href;
		url += "/output?"
		var copyItems = [
			{name: "tmURL", value: encodeURIComponent(tmURL)},
			{name: "tmKey", value: encodeURIComponent(tmAPIKey)},
			{name: "width", value: `${width}px`},
			{name: "height", value: `${height}px`},
			{name: "fontSize", value: `${fontSize}px`},
			{name: "backgroundColor", value: encodeURIComponent(backgroundColor)},
			{name: "fontColor", value: encodeURIComponent(textColor)},
			{name: "boxDuration", value: boxTimePerScore},
			{name: "boxDowntime", value: timeBetweenScores},
			{name: "isTest", value: testForSample ? "1" : "0"},
		];
		
		for (let thing of copyItems) {
			url += `${thing.name}=${thing.value}&`
		}
		url = url.substring(0, url.length - 1);
		
		console.log(url);
		navigator.clipboard.writeText(url);
	}

	return (
		<div style={{margin: "auto", width: "95vw", height: "95vh"}}>
			<Grid container spacing={3}>
				<Grid size={12} style={{textAlign: "center"}}>
					<Typography variant="h2" style={{fontWeight: "bold"}}>Live Skills Results Configuration</Typography>
				</Grid>
				<Grid size={12} style={{textAlign: "center"}}>
					<Typography variant="h3">Configure your Live Skills plugin here</Typography>
				</Grid>
				<Grid size={3}>
					<TextField label="Tournament Manager URL" variant="outlined" value={tmURL} onChange={e => _tmURL(e.target.value)} fullWidth />
				</Grid>
				<Grid size={3}>
					<TextField label="Tournament Manager API Key" variant="outlined" value={tmAPIKey} onChange={e => _tmAPIKey(e.target.value)} fullWidth />
				</Grid>
				<Grid size={3}>
					<TextField label="Width of Display Box (px)" variant="outlined" value={width} onChange={e => _width(e.target.value)} type="number" />
				</Grid>
				<Grid size={3}>
					<TextField label="Height of Display Box (px)" variant="outlined" value={height} onChange={e => _height(e.target.value)} type="number" />
				</Grid>
				<Grid size={3}>
					<TextField label="Text Font Size (px)" variant="outlined" value={fontSize} onChange={e => _fontSize(e.target.value)} type="number" />
				</Grid>
				<Grid size={3}>
					<MuiColorInput format="rgb" value={backgroundColor} onChange={_backgroundColor} label="Background Color" />
				</Grid>
				<Grid size={3}>
					<MuiColorInput format="rgb" value={textColor} onChange={_textColor} label="Text Color" />
				</Grid>
				<Grid size={4}>
					<TextField label="Seconds Box Shown Per Score" variant="outlined" value={boxTimePerScore} onChange={e => _boxTimePerScore(e.target.value)} type="number" />
				</Grid>
				<Grid size={4}>
					<TextField label="Seconds Between Scores" variant="outlined" value={timeBetweenScores} onChange={e => _timeBetweenScores(e.target.value)} type="number" />
				</Grid>
				<Grid size={4}>
					<FormControlLabel control={<Checkbox value={testForSample} onChange={e => _testForSample(e.target.checked)} />} label="Show Box as Test" />
				</Grid>
				<Grid size={4} />
				<Grid size={4}>
					<Button variant="contained" onClick={CreateAndCopyURL}>Copy URL for OBS to Clipboard</Button>
				</Grid>
				<Grid size={4} />
			</Grid>
			
			{/*
			<div style={{height: "10%"}} />
			<MuiColorInput format="rgb" value={backgroundColor} onChange={_backgroundColor} />
			<br />
			
			<Link href="/plugins/live_skills/output?backgroundColor=rgb%281%2C100%2C100%29&fontColor=rgb%28100%2C200%2C200%29&tmURL=https&tmKey=98jsfd98gvh239uhr4&isTest=1&width=800px&height=500px&fontSize=32px">My link is here</Link>
			*/}
		</div>
	)
}
