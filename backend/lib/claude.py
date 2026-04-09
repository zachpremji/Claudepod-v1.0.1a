import anthropic
from config import settings
from lib.tools import gmail, calendar, sms, interac

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

TOOLS = [
    {
        "name": "send_sms",
        "description": "Send an SMS text message to a phone number or contact name.",
        "input_schema": {
            "type": "object",
            "properties": {
                "recipient": {"type": "string"},
                "body": {"type": "string"},
            },
            "required": ["recipient", "body"],
        },
    },
    {
        "name": "send_gmail",
        "description": "Send an email via the user's Gmail account.",
        "input_schema": {
            "type": "object",
            "properties": {
                "to": {"type": "string"},
                "subject": {"type": "string"},
                "body": {"type": "string"},
            },
            "required": ["to", "subject", "body"],
        },
    },
    {
        "name": "search_gmail",
        "description": "Search the user's Gmail inbox. Returns matching emails.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Gmail search string e.g. 'from:jake subject:invoice'",
                },
                "max_results": {"type": "integer", "default": 5},
            },
            "required": ["query"],
        },
    },
    {
        "name": "create_calendar_event",
        "description": "Create a new event on the user's Google Calendar.",
        "input_schema": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "start_time": {
                    "type": "string",
                    "description": "ISO 8601 datetime",
                },
                "end_time": {
                    "type": "string",
                    "description": "ISO 8601 datetime",
                },
                "description": {"type": "string"},
                "attendees": {
                    "type": "array",
                    "items": {"type": "string"},
                },
            },
            "required": ["title", "start_time", "end_time"],
        },
    },
    {
        "name": "list_calendar_events",
        "description": "List upcoming events from the user's Google Calendar.",
        "input_schema": {
            "type": "object",
            "properties": {
                "time_min": {
                    "type": "string",
                    "description": "ISO 8601 start of range (default: now)",
                },
                "time_max": {
                    "type": "string",
                    "description": "ISO 8601 end of range (default: 7 days from now)",
                },
                "max_results": {"type": "integer", "default": 10},
            },
        },
    },
    {
        "name": "send_interac_transfer",
        "description": "Send an Interac e-Transfer. IMPORTANT: Always requires explicit user confirmation before executing — never run directly.",
        "input_schema": {
            "type": "object",
            "properties": {
                "recipient": {"type": "string"},
                "amount": {
                    "type": "number",
                    "description": "Amount in CAD",
                },
                "memo": {"type": "string"},
            },
            "required": ["recipient", "amount"],
        },
    },
]

TOOL_EXECUTORS = {
    "send_sms": sms.send,
    "send_gmail": gmail.send,
    "search_gmail": gmail.search,
    "create_calendar_event": calendar.create_event,
    "list_calendar_events": calendar.list_events,
    "send_interac_transfer": interac.send,
}


def call_claude(system: str, messages: list, tools: list):
    return client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=system,
        messages=messages,
        tools=tools,
    )


async def execute_tool(name: str, input_data: dict) -> str:
    executor = TOOL_EXECUTORS.get(name)
    if not executor:
        return f"Tool '{name}' not found."
    try:
        return await executor(input_data)
    except Exception as e:
        return f"Tool failed: {str(e)}"
