import axios from 'axios';

const API_KEY = 'AIzaSyAVaDVMB7a6Pwt3PW-8qS0kjHMCZ8SGXm4';
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
export const sendToGemini = async userMessage => {
  try {
    const prompt = `You are an AI assistant. Extract the following details from the given text:

- **Title**: The main topic or task described.
- **Due Date**: The date or time when the task/event is due or should occur ( but you have to gave it in date like if today the date is 26 april 2025 when you extract the date you have to gave it in date like 27 april 2025 or if the message has like wednesday then you have to check the date of the nearest wednesday and gave it).
- **Category**: The category or type of the task (e.g., "meeting", "deadline", "event").
- **Priority**: The priority level (e.g., "high", "low" only).

Text: "${userMessage}"

Return the extracted information in the following format:
{
  "title": "<extracted title>",
  "due_date": "<extracted due date>",
  "category": "<extracted category>",
  "priority": "<extracted priority>"
}
`;
    const response = await axios.post(
      `${GEMINI_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [{text: prompt}],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    let reply = response.data.candidates[0]?.content?.parts[0]?.text;
    console.log(reply);
    reply = reply.replace(/```json|```/g, '').trim();

    console.log(reply);
    return reply;
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    return 'Something went wrong. Try again!';
  }
};
