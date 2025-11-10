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
 * @param language The target language for the extracted text (currently ignored, defaults to Vietnamese).
 * @returns A promise that resolves with an array of ScheduleEvent objects.
 */
export const processImage = async (file: File, language: 'en' | 'vi'): Promise<ScheduleEvent[]> => {
  // Per user request, the output language is always forced to Vietnamese.
  console.log(`Processing image with Gemini, forcing Vietnamese output for all text fields.`);

  const base64Data = await fileToBase64(file);
  const mimeType = file.type;

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: mimeType,
    },
  };

  const languageInstruction = 'Vietnamese';

  const textPart = {
    text: `Extract all events from this image of a schedule. It is mandatory that all extracted text content (titles, locations, instructor names, notes) MUST be in ${languageInstruction}. For each event, provide a unique ID, the title, start time, end time, location if available, the instructor's name if available, and a brief note if available. Also provide the bounding box for each event, a confidence score for the extraction, and suggest a suitable hex color code based on the event's title. Ensure date and times are fully qualified ISO 8601 strings. If dates are not specified, infer them based on context, assuming the schedule is for the current week starting today. The output must be a JSON array of event objects matching the provided schema.`,
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