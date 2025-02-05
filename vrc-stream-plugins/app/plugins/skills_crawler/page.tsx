"use client";
import { useState }  from "react";

import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function SkillsCrawlerLanding() {
	const [tmURL, _tmURL] = useState<string>("");
	const [tmAPIKey, _tmAPIKey] = useState<string>("");

	const CreateAndCopyURL = () => {
		var url = window.location.href;
		url += "/output?"
		var copyItems = [
			{name: "tmURL", value: encodeURIComponent(tmURL)},
			{name: "tmKey", value: encodeURIComponent(tmAPIKey)},
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
					<Typography variant="h2" style={{fontWeight: "bold"}}>Skills Rankings Crawler Configuration</Typography>
				</Grid>
				<Grid size={12} style={{textAlign: "center"}}>
					<Typography variant="h3">Configure your Skills Crawler plugin here</Typography>
				</Grid>
				<Grid size={3}>
					<TextField label="Tournament Manager URL" variant="outlined" value={tmURL} onChange={e => _tmURL(e.target.value)} fullWidth />
				</Grid>
				<Grid size={3}>
					<TextField label="Tournament Manager API Key" variant="outlined" value={tmAPIKey} onChange={e => _tmAPIKey(e.target.value)} fullWidth />
				</Grid>
				<Grid size={3}>
					<Button variant="contained" onClick={CreateAndCopyURL}>Copy URL for OBS to Clipboard</Button>
				</Grid>
			</Grid>
			
			{/*
			<div style={{height: "10%"}} />
			<MuiColorInput format="rgb" value={backgroundColor} onChange={_backgroundColor} />
			<br />
			
			<Link href="/plugins/live_skills/output?backgroundColor=rgb%281%2C100%2C100%29&fontColor=rgb%28100%2C200%2C200%29&tmURL=https&tmKey=98jsfd98gvh239uhr4&isTest=1&width=800px&height=500px&fontSize=32px">My link is here</Link>
			*/}
		</div>
	);
}
