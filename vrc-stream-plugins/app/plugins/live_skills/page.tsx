"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import Grid from "@mui/material/Grid2"
import Typography from "@mui/material/Typography";

import {MuiColorInput} from "mui-color-input";

export default function LiveSkillsLanding() {
	const [backgroundColor, _backgroundColor] = useState<string>("rgb(12, 15, 100)");

	return (
		<div style={{margin: "auto", width: "95vw", height: "95vh"}}>
			<Grid container spacing={2}>
				<Grid size={12} style={{textAlign: "center"}}>
					<Typography variant="h2" style={{fontWeight: "bold"}}>Live Skills Results Configuration</Typography>
				</Grid>
				<Grid size={12} style={{textAlign: "center"}}>
					<Typography variant="h3">Configure your Live Skills plugin here</Typography>
				</Grid>
				<Grid size={3}>
					<Typography>TM URL</Typography>
				</Grid>
				<Grid size={3}>
					<Typography>TM API Key</Typography>
				</Grid>
				<Grid size={3}>
					<Typography>Width</Typography>
				</Grid>
				<Grid size={3}>
					<Typography>Height</Typography>
				</Grid>
				<Grid size={3}>
					<Typography>Font Size</Typography>
				</Grid>
				<Grid size={3}>
					<Typography>Background Color</Typography>
				</Grid>
				<Grid size={3}>
					<Typography>Text Color</Typography>
				</Grid>
				<Grid size={4}>
					<Typography>Seconds Box Shown Per Score</Typography>
				</Grid>
				<Grid size={4}>
					<Typography>Seconds Between Scores</Typography>
				</Grid>
				<Grid size={4}>
					<Typography>Show Sample Text Box</Typography>
				</Grid>
			</Grid>
			
			
			<div style={{height: "10%"}} />
			<MuiColorInput format="rgb" value={backgroundColor} onChange={_backgroundColor} />
			<br />

			<Link href="/plugins/live_skills/output?backgroundColor=rgb%281%2C100%2C100%29&fontColor=rgb%28100%2C200%2C200%29&tmURL=https&tmKey=98jsfd98gvh239uhr4&isTest=1&width=800px&height=500px&fontSize=32px">My link is here</Link>
		</div>
	)
}
