import { GoogleGenerativeAI } from '@google/generative-ai';
const configuration = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const modelId = "gemini-pro";
const model = configuration.getGenerativeModel({ model: modelId });


export const generateResponse = async (prompt:any,currentMessages:any) => {
  try {
    const chat = model.startChat({
      history: currentMessages,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    const responseText = response.text();
    return responseText
  } catch (err) {
    console.error(err);
    return false;
  }
};