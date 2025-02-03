import { useEffect, useState } from "react";
import { TMAPI } from "./tmAPI";

const useTMAPI = (baseAuthURL: string, baseTMURL: string, tmAPIKey: string): TMAPI => {
	const [tmAPI, _tmAPI] = useState(new TMAPI(baseAuthURL, baseTMURL, tmAPIKey));

	useEffect(() => {
		_tmAPI(new TMAPI(baseAuthURL, baseTMURL, tmAPIKey));
	}, [baseAuthURL, baseTMURL, tmAPIKey]);

	return tmAPI;
}

export default useTMAPI;
