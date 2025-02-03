import { createHmac } from "crypto";

interface DivisionsDataFromTM {
	divisions: TM_DivisionsData[];
}

interface EventResultsFromTM {
	event: TM_EventData;
}

interface QualiRankingsFromTM {
	rankings: TM_QualiRankingData[];
}

interface SkillsResultsFromTM {
	skillsRankings: TM_SkillsResource[]
}

export class TMAPI {
	public bearerToken: string | null = "";
	public tokenExpiration: number = 0;
	public baseTMURL: string = "";
	public tmAPIKey: string = "";
	public baseAuthURL: string = "";

	public appClientID: string = "";
	public appClientSecret: string = "";

	constructor (baseAuthURL: string, baseTMURL: string, tmAPIKey: string) {
		this.baseAuthURL = baseAuthURL;
		this.baseTMURL = baseTMURL;
		this.tmAPIKey = tmAPIKey;
	}

	GetAuthHeaders(url: URL, method: string = "GET"): Headers {
		//help from https://github.com/brenapp/vex-tm-client
		const tmDate = new Date().toUTCString();
        
        let stringToSign = [
            method,
            url.pathname + url.search,
            `token:${this.bearerToken}`,
            `host:${url.host}`,
            `x-tm-date:${tmDate}`
        ].join("\n");
        stringToSign += "\n";
		console.log(stringToSign);

        const signature = createHmac("sha256", this.tmAPIKey)
            .update(stringToSign)
            .digest("hex");
		
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${this.bearerToken}`)
        headers.append("x-tm-date", tmDate);
        headers.append("x-tm-signature", signature);
        headers.append("Host", url.host);

        return headers;
	}

	async GetBearerToken(): Promise<void> {
		const request = new Request(this.baseAuthURL, {
			method: "POST"
		});

		const response = await fetch(request);
		if (response.ok) {
			const jsonResult = await response.json();
			this.bearerToken = jsonResult.access_token as string;
			let tempExpTime: number = jsonResult.expires_in as number;
			this.tokenExpiration = Date.now() + (tempExpTime * .9) * 1000;
		}
		else {
			console.log("something went wrong, figure it out");
		}
	}

	public async GetDivisionsData(): Promise<TM_DivisionsData[]> {
		console.log("DIVISIONS");
		if (this.tokenExpiration < Date.now()) {
			//need to get a new token
			await this.GetBearerToken();
		}
		if (this.bearerToken === null || this.bearerToken === "") {
			console.log("no token for request, fail this thing");
			return [];
		}
		const url = new URL("/api/divisions", this.baseTMURL);
		const request = new Request(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
            }
        });
		const headers = this.GetAuthHeaders(url, request.method);
		const response = await fetch(request, { headers });
		if (response.status === 200) {
			console.log("hooray it worked");
			const resultJson = await response.json() as DivisionsDataFromTM;
			return resultJson.divisions;
		}
		else {
			console.log("uh oh something went wrong");
			const resultJson = await response.json();
			console.log(resultJson);
			console.log(response.status);
			console.log(response.statusText);
			return [];
		}
	}

	public async GetEventData(): Promise<TM_EventData> {
		console.log("EVENT");
		if (this.tokenExpiration < Date.now()) {
			//need to get a new token
			await this.GetBearerToken();
		}
		if (this.bearerToken === null || this.bearerToken === "") {
			console.log("no token for request, fail this thing");
			return {name: "", code: ""};
		}
		const url = new URL("/api/event", this.baseTMURL);
		const request = new Request(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
            }
        });
		console.log(url);
		const headers = this.GetAuthHeaders(url, request.method);
		const response = await fetch(request, { headers });
		if (response.status === 200) {
			console.log("hooray it worked");
			const resultJson = await response.json() as EventResultsFromTM;
			return resultJson.event;
		}
		else {
			console.log("uh oh something went wrong");
			const resultJson = await response.json();
			console.log(resultJson);
			console.log(response.status);
			console.log(response.statusText);
			return {name: "", code: ""};
		}
	}

	public async GetQualiRankingsData(divisionID: number): Promise<TM_QualiRankingData[]> {
		console.log("QUALI RANKINGS");
		if (this.tokenExpiration < Date.now()) {
			//need to get a new token
			await this.GetBearerToken();
		}
		if (this.bearerToken === null || this.bearerToken === "") {
			console.log("no token for request, fail this thing");
			return [];
		}
		const authURL = new URL(`/api/rankings/${divisionID}/QUAL`, this.baseTMURL);
		const sendURL = new URL("/rankings", this.baseAuthURL);
		const request = new Request(sendURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
				//"Access-Control-Allow-Origin": "*"
				"x-div-id": divisionID.toString()
            }
        });
		console.log(request.headers);
		const headers = this.GetAuthHeaders(authURL, request.method);
		headers.append("x-div-id", divisionID.toString());
		headers.append("x-tm-host", this.baseTMURL);
		const response = await fetch(request, { headers });
		if (response.status === 200) {
			console.log("hooray it worked");
			const resultJson = await response.json() as QualiRankingsFromTM;
			return resultJson.rankings;
		}
		else {
			console.log("uh oh something went wrong");
			const resultJson = await response.json();
			console.log(resultJson);
			console.log(response.status);
			console.log(response.statusText);
			return [];
		}
	}

	public async GetSkillsData(): Promise<TM_SkillsResource[]> {
		if (this.tokenExpiration < Date.now()) {
			//need to get a new token
			await this.GetBearerToken();
		}
		if (this.bearerToken === null || this.bearerToken === "") {
			console.log("no token for request, fail this thing");
			return [];
		}
		const url = new URL("/api/skills", this.baseTMURL);
		const request = new Request(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
            }
        });
		const headers = this.GetAuthHeaders(url, request.method);
		const response = await fetch(request, { headers });
		if (response.status === 200) {
			console.log("hooray it worked");
			const resultJson = await response.json() as SkillsResultsFromTM;
			return resultJson.skillsRankings;
		}
		else {
			console.log("uh oh something went wrong");
			const resultJson = await response.json();
			console.log(resultJson);
			console.log(response.status);
			console.log(response.statusText);
			return [];
		}
	}
}
