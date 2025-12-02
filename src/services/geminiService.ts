// FIX: Replaced mock function with a real implementation using the Gemini API.
import { GoogleGenAI, Type } from '@google/genai';
import type { ScheduleEvent } from '../types';

// NOTE: This assumes the API key is available in the environment variables.
// Vite uses import.meta.env for environment variables
// On Vercel, set VITE_GEMINI_API_KEY in the dashboard
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

/**
 * Converts a File object to a base64 encoded string.
 * @param file The file to convert.
 * @returns A promise that resolves with the base64 string.
 */
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // The result includes a prefix like "data:image/png;base64,", we remove it.
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to read file as a data URL.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });

/**
 * Processes an image file using the Gemini API to extract schedule events.
 * @param file The image file containing the schedule.
 * @param language The target language for the extracted text ('en' for English, 'vi' for Vietnamese).
 * @returns A promise that resolves with an array of ScheduleEvent objects.
 */
export const processImage = async (file: File, language: 'en' | 'vi'): Promise<ScheduleEvent[]> => {
  console.log(`Processing image with Gemini, language: ${language}`);

  const base64Data = await fileToBase64(file);
  const mimeType = file.type;

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: mimeType,
    },
  };

  const languageInstruction = language === 'vi' ? 'Vietnamese' : 'English';

  const textPart = {
    text: `You are an expert OCR system specialized in reading schedules and timetables from images.

CRITICAL INSTRUCTIONS:
1. READ TEXT EXACTLY AS IT APPEARS - Do NOT guess, infer, or modify any text. Copy character by character.
2. If text is unclear or partially visible, set a lower ocrConfidence score (0.3-0.6) but still attempt to read it.
3. Do NOT translate or change the original text - keep it exactly as shown in the image.
4. Pay special attention to:
   - Vietnamese diacritics (ă, â, đ, ê, ô, ơ, ư, à, á, ả, ã, ạ, etc.)
   - Numbers and times (distinguish 0/O, 1/l/I, 5/S, 8/B)
   - Special characters and punctuation

EXTRACTION TASK:
Extract ALL events/items from this schedule image. For each event provide:
- id: A unique identifier (use format "event_1", "event_2", etc.)
- title: The exact title/name as shown (DO NOT modify or translate)
- start: Start date and time in ISO 8601 format
- end: End date and time in ISO 8601 format  
- location: The location if shown (exact text)
- instructor: The instructor/teacher name if shown (exact text)
- note: Any additional notes or descriptions (exact text)
- ocrConfidence: Your confidence in the text extraction (0.0 to 1.0)
- boundingBox: Approximate position {x, y, width, height} as percentages (0-100)
- color: A suitable hex color code based on the event type/category

DATE/TIME RULES:
- If only time is shown without date, assume the schedule starts from today (${new Date().toISOString().split('T')[0]})
- If day names are shown (Monday, Tuesday, etc. or Thứ 2, Thứ 3, etc.), calculate the actual date based on current week
- Times should be in 24-hour format in the ISO string

Output language for any generated text (not extracted): ${languageInstruction}
Return a JSON array of event objects.`,
  };

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING, description: 'A unique identifier for the event.' },
        title: { type: Type.STRING, description: `The title of the event, in ${languageInstruction}.` },
        start: { type: Type.STRING, description: 'The start date and time in ISO 8601 format.' },
        end: { type: Type.STRING, description: 'The end date and time in ISO 8601 format.' },
        location: { type: Type.STRING, description: 'The location of the event, if any.' },
        instructor: { type: Type.STRING, description: `The name of the instructor, if any, in ${languageInstruction}.` },
        note: { type: Type.STRING, description: `A note or description for the event, if any, in ${languageInstruction}.` },
        ocrConfidence: { type: Type.NUMBER, description: 'A confidence score for the text extraction, between 0 and 1.' },
        boundingBox: {
          type: Type.OBJECT,
          properties: {
            x: { type: Type.NUMBER },
            y: { type: Type.NUMBER },
            width: { type: Type.NUMBER },
            height: { type: Type.NUMBER },
          },
          required: ['x', 'y', 'width', 'height'],
        },
        color: { type: Type.STRING, description: 'A hex color code (e.g., #3b82f6) suggested for the event. Optional.' },
      },
      required: ['id', 'title', 'start', 'end', 'ocrConfidence', 'boundingBox'],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonStr = response.text.trim();
    if (!jsonStr) {
      console.warn('Gemini returned an empty response.');
      return [];
    }
    
    const rawEvents = JSON.parse(jsonStr) as Array<Omit<ScheduleEvent, 'start' | 'end'> & { start: string; end: string; }>;

    const processedEvents: ScheduleEvent[] = rawEvents.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));
    
    console.log('Successfully extracted events:', processedEvents);
    return processedEvents;
  } catch (error) {
    console.error("Error processing image with Gemini:", error);
    // Re-throw the error so it can be caught by the calling component.
    throw new Error('Failed to process image with Gemini AI.');
  }
};