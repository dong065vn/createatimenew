const en = {
  "header": {
    "title": "ScheduleFromImage",
    "newUpload": "New Upload"
  },
  "home": {
    "analyzing": "Analyzing your schedule...",
    "analyzing_subtext": "This might take a moment. The AI is working its magic!",
    "upload_title": "Upload Your Schedule",
    "upload_prompt": "Drag & drop an image file (PNG, JPG) here, or click a button to select one.",
    "upload_prompt_active": "Drop the image here!",
    "select_image": "Select Image",
    "try_demo": "Try a Demo",
    "processing_failed": "Processing Failed",
    "try_again": "Try Again"
  },
  "footer": {
    "powered_by": "Powered by Gemini AI.",
    "need_help": "Need help?",
    "click_here": "Click here."
  },
  "eventList": {
    "title": "Event List",
    "search_placeholder": "Search events...",
    "conflicts_detected": "{{count}} conflicting events detected.",
    "no_events_found": "No events found.",
    "no_events_match": "No events match your search.",
    "import": "Import",
    "import_success": "Successfully imported {{count}} events.",
    "import_error": "Import failed. Please check the file format.",
    "import_error_format": "Unsupported file format. Please use JSON or ICS files.",
    "export_ics": "Export ICS",
    "export_json": "Export JSON",
    "export_txt": "Export TXT",
    "new": "New",
    "minutes_short": "min"
  },
  "editModal": {
    "title": "Edit Event",
    "field_title": "Title",
    "field_color": "Color",
    "field_start": "Start",
    "field_end": "End",
    "field_location": "Location",
    "field_instructor": "Instructor",
    "field_note": "Note",
    "cancel": "Cancel",
    "save": "Save Changes",
    "error_title_required": "Title is required.",
    "error_time_invalid": "Start time must be before end time."
  },
  "calendarHeader": {
    "today": "today",
    "month": "month",
    "week": "week",
    "day": "day",
    "download_image_label": "Download calendar as image",
    "download_error": "Failed to capture calendar. Please try again."
  },
  "imageView": {
    "title": "Original Image"
  },
  "helpModal": {
    "title": "How It Works",
    "intro": "Welcome to <strong>ScheduleFromImage</strong>! This tool uses AI to automatically extract events from an image of a schedule and turn them into a digital calendar.",
    "step1_title": "1. Upload Your Schedule",
    "step1_desc": "Click 'Select Image' to upload a PNG or JPG file of your schedule, or simply drag and drop it onto the main area. Don't have one handy? Click 'Try a Demo' to see how it works with a sample image.",
    "step2_title": "2. View & Interact",
    "step2_desc": "Once the AI processes your image, you'll see the original image with event bounding boxes, a list of extracted events, and a full calendar view. Hover over an event in the list to highlight it on the image.",
    "step3_title": "3. Edit & Export",
    "step3_desc": "Click an event in the list or calendar to edit its details. You can also drag and drop events in the calendar to reschedule them. When you're done, export your schedule to an ICS (for calendar apps), JSON, or TXT file.",
    "close_button": "Got it!"
  }
};

export default en;