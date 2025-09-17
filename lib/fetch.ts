import axios from "axios";
import { toast } from "sonner";

export const fetchAI = async (
    list: any,
    format?: any,
    send?: any

): Promise<string> => {
    try {
        const res = await axios.post("https://llama-3-worker.vivaancut.workers.dev/", {
            messages: list,
            response_format: format ?? undefined
        });
        const aiResponse = res?.data?.response?.response;
        if (aiResponse) {
            return aiResponse;
        } else {
            toast.error("Your request failed, try again later.");
            console.error("No response from AI");
            return "no";
        }
    } catch (err) {
        toast.error("Your request failed, try again later.");
        console.error("The AI was unable to fetch", err);
        return "no";
    }
};

export const fetchAIFull = async (
    list: any,
    format?: any,
    send?: any

) => {
    console.log("HEI", format)
    try {
        const res = await axios.post("https://llama-3-worker.vivaancut.workers.dev/", {
            messages: list,
            response_format: {
                title: "JSON Mode",
                type: "object",
                properties: {
                    type: {
                        type: "string",
                        enum: ["json_object", "json_schema"],
                    },
                    json_schema: {},
                }
            }
        });
        const aiResponse = res?.data?.response?.response;
        if (aiResponse) {
            return res?.data;
        } else {
            toast.error("Your request failed, try again later.");
            console.error("No response from AI");
            return "no";
        }
    } catch (err) {
        toast.error("Your request failed, try again later.");
        console.error("The AI was unable to fetch", err);
        return "no";
    }
};

export const fetchAIImage = async (
    list: any
): Promise<string> => {
    try {
        const res = await axios.post("https://white-bird-06f8.vivaancut.workers.dev/", {
            messages: list,
        });
        const aiResponse = res?.data?.response?.response;
        if (aiResponse) {
            return aiResponse;
        } else {
            toast.error("Your request failed, try again later.");
            console.error("No response from AI");
            return "no";
        }
    } catch (err) {
        toast.error("Your request failed, try again later.");
        console.error("The AI was unable to fetch", err);
        return "no";
    }
};
