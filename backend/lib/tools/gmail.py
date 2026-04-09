import base64
from email.mime.text import MIMEText
from googleapiclient.discovery import build
from lib.google_auth import get_google_credentials


def _get_service():
    creds = get_google_credentials()
    return build("gmail", "v1", credentials=creds)


async def send(input_data: dict) -> str:
    service = _get_service()
    message = MIMEText(input_data["body"])
    message["to"] = input_data["to"]
    message["subject"] = input_data["subject"]
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    service.users().messages().send(
        userId="me", body={"raw": raw}
    ).execute()
    return f"Email sent to {input_data['to']} with subject \"{input_data['subject']}\"."


async def search(input_data: dict) -> str:
    service = _get_service()
    query = input_data["query"]
    max_results = input_data.get("max_results", 5)

    results = (
        service.users()
        .messages()
        .list(userId="me", q=query, maxResults=max_results)
        .execute()
    )
    messages = results.get("messages", [])

    if not messages:
        return "No emails found matching that search."

    emails = []
    for msg_ref in messages:
        msg = (
            service.users()
            .messages()
            .get(userId="me", id=msg_ref["id"], format="metadata")
            .execute()
        )
        headers = {h["name"]: h["value"] for h in msg["payload"]["headers"]}
        emails.append(
            {
                "from": headers.get("From", "Unknown"),
                "subject": headers.get("Subject", "No subject"),
                "date": headers.get("Date", "Unknown date"),
                "snippet": msg.get("snippet", ""),
            }
        )

    lines = []
    for e in emails:
        lines.append(
            f"From: {e['from']}\nSubject: {e['subject']}\nDate: {e['date']}\nSnippet: {e['snippet']}"
        )
    return "\n---\n".join(lines)
