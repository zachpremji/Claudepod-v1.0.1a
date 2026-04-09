from datetime import datetime, timedelta, timezone
from googleapiclient.discovery import build
from lib.google_auth import get_google_credentials


def _get_service():
    creds = get_google_credentials()
    return build("calendar", "v3", credentials=creds)


async def create_event(input_data: dict) -> str:
    service = _get_service()
    event_body = {
        "summary": input_data["title"],
        "start": {"dateTime": input_data["start_time"]},
        "end": {"dateTime": input_data["end_time"]},
    }
    if "description" in input_data:
        event_body["description"] = input_data["description"]
    if "attendees" in input_data:
        event_body["attendees"] = [
            {"email": email} for email in input_data["attendees"]
        ]

    event = (
        service.events()
        .insert(calendarId="primary", body=event_body)
        .execute()
    )
    return f"Created calendar event \"{input_data['title']}\" on {input_data['start_time']}. Link: {event.get('htmlLink', 'N/A')}"


async def list_events(input_data: dict) -> str:
    service = _get_service()
    now = datetime.now(timezone.utc)
    time_min = input_data.get("time_min", now.isoformat())
    time_max = input_data.get(
        "time_max", (now + timedelta(days=7)).isoformat()
    )
    max_results = input_data.get("max_results", 10)

    events_result = (
        service.events()
        .list(
            calendarId="primary",
            timeMin=time_min,
            timeMax=time_max,
            maxResults=max_results,
            singleEvents=True,
            orderBy="startTime",
        )
        .execute()
    )
    events = events_result.get("items", [])

    if not events:
        return "No upcoming events found."

    lines = []
    for event in events:
        start = event["start"].get("dateTime", event["start"].get("date"))
        summary = event.get("summary", "No title")
        lines.append(f"- {summary} at {start}")
    return "\n".join(lines)
