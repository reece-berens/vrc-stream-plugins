const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const port = 7263;

var cachedResult = null;

app.get("/", (request, response) => {
	response.send("<!DOCTYPE html><html><body><h1>hello from express</h1></body></html>");
});

app.post("/", async (request, response) => {
	const clientID = process.env.CLIENT_ID;
	const clientSecret = process.env.CLIENT_SECRET;
	console.log(clientID);
	if (typeof clientID === "undefined" || typeof clientSecret === "undefined") {
		response.statusCode = 500;
		response.statusMessage = "No client info in server";
		response.send();
	}
	else {
		if (cachedResult !== null && new Date() < cachedResult.nextToTry) {
			console.log("have a cached result, don't bother trying again");
			response.send({
				access_token: cachedResult.access_token,
				token_type: cachedResult.token_type,
				expires_in: cachedResult.expires_in
			});
		}
		else {
			const myRequest = new Request("https://auth.vextm.dwabtech.com/oauth2/token", {
				method: "POST",
				body: new URLSearchParams({
					client_id: clientID,
					client_secret: clientSecret,
					grant_type: "client_credentials",
				})
			});
			
			const fetchResponse = await fetch(myRequest);
			console.log("got a response from the fetch");
			console.log(fetchResponse);
			if (fetchResponse.ok) {
				const json = await fetchResponse.json();
				cachedResult = {
					...json,
					nextToTry: new Date().setSeconds(new Date().getSeconds() + (json.expires_in * .9))
				}
				response.send(json);
			}
		}
	}
});

app.get("/rankings", async(request, response) => {
	const tmHost = request.header("x-tm-host");
	const tmAuth = request.header("Authorization");
	const tmSignature = request.header("x-tm-signature");
	const tmTime = request.header("x-tm-date");
	const divID = request.header("x-div-id");
	console.log(tmHost);
	console.log(tmAuth);
	const url = new URL(`/api/rankings/${divID}/QUAL`, tmHost);
	console.log(url);
	const tmReq = new Request(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": tmAuth,
			"x-tm-signature": tmSignature,
			"x-tm-date": tmTime,
			"Host": url.host
		}
	});
	const tmResp = await fetch(tmReq);
	if (tmResp.ok) {
		const respJson = await tmResp.json();
		response.send(respJson);
	}
	else {
		response.statusCode = 500;
		response.statusMessage = "Bad TM Request";
	}
});

app.listen(port, () => {
	console.log("listening on port 7263 right now");
});
