import axios from "axios";
import config from "../config/config";

import { mockedData } from "../constants/mockData";

const translate = async (audioData: Buffer) => {
    console.log("Received audio data for translation");
    console.log(audioData)
    const text = mockedData[Math.floor(Math.random() * mockedData.length)];
    const res = await axios.post(config.ollamaApiUrl + '/api/generate', {
        model: config.ollamaModel,
        prompt: `Translate the following audio to English text: ${text}`,
        stream: false
    });
    console.log("Translation response from API:", res.data.response);
    return res.data.response;
}

export default translate;