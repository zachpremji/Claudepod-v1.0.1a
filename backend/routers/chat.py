from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from lib.claude import call_claude, execute_tool, TOOLS
from lib.memory import get_history, add_message

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    pending_tool_call: dict | None = None


class ChatResponse(BaseModel):
    reply: str
    tools_used: list[str]
    confirmation_required: dict | None = None


SYSTEM_PROMPT = """You are Claude Pod — a voice assistant powered by Claude, made by Anthropic.

Keep all responses concise and natural for spoken audio: 1–3 sentences maximum unless the user explicitly asks for more detail. Use plain prose only — no markdown, bullet points, headers, or special formatting, since your response will be read aloud.

You remember previous conversations. Use that context naturally without announcing it.

You can take real-world actions using tools. For Interac e-Transfer requests, always return a pending confirmation — never execute directly. For all other tools (Gmail, Calendar, SMS), execute immediately and confirm what you did in your reply.

The current date and time is injected at the start of each user message."""


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        tools_used: list[str] = []

        # If there's a pending tool call (user confirmed Interac)
        if req.pending_tool_call:
            if req.message.lower().strip() in ("yes", "yes, go ahead", "y"):
                tool_name = req.pending_tool_call["name"]
                tool_input = req.pending_tool_call["input"]
                tool_result = await execute_tool(tool_name, tool_input)
                tools_used.append(tool_name)

                # Send tool result to Claude for a natural response
                history = get_history(20)
                messages = history + [
                    {"role": "user", "content": req.message},
                    {
                        "role": "assistant",
                        "content": [
                            {
                                "type": "tool_use",
                                "id": "pending_confirmation",
                                "name": tool_name,
                                "input": tool_input,
                            }
                        ],
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "tool_result",
                                "tool_use_id": "pending_confirmation",
                                "content": tool_result,
                            }
                        ],
                    },
                ]

                response = call_claude(
                    system=SYSTEM_PROMPT, messages=messages, tools=TOOLS
                )
                reply = _extract_text(response)
                add_message("user", req.message)
                add_message("assistant", reply)
                return ChatResponse(
                    reply=reply, tools_used=tools_used, confirmation_required=None
                )
            else:
                # User declined
                add_message("user", req.message)
                reply = "No problem, I've cancelled that transfer."
                add_message("assistant", reply)
                return ChatResponse(
                    reply=reply, tools_used=[], confirmation_required=None
                )

        # Normal flow
        timestamp = datetime.now().strftime("%A %B %d %Y, %I:%M %p")
        user_message = f"[{timestamp}] {req.message}"

        history = get_history(20)
        messages = history + [{"role": "user", "content": user_message}]

        response = call_claude(system=SYSTEM_PROMPT, messages=messages, tools=TOOLS)

        # Process tool use blocks
        while response.stop_reason == "tool_use":
            tool_block = next(
                b for b in response.content if b.type == "tool_use"
            )
            tool_name = tool_block.name
            tool_input = tool_block.input

            # Interac requires confirmation
            if tool_name == "send_interac_transfer":
                amount = tool_input.get("amount", 0)
                recipient = tool_input.get("recipient", "unknown")
                memo = tool_input.get("memo", "")
                action = f"Send ${amount} to {recipient}"
                if memo:
                    action += f' with memo "{memo}"'

                # Don't save to DB yet — waiting for confirmation
                return ChatResponse(
                    reply=action,
                    tools_used=[],
                    confirmation_required={
                        "action": action,
                        "tool_call": {"name": tool_name, "input": tool_input},
                    },
                )

            # Execute the tool
            tool_result = await execute_tool(tool_name, tool_input)
            tools_used.append(tool_name)

            # Send tool result back to Claude
            messages.append({"role": "assistant", "content": response.content})
            messages.append(
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "tool_result",
                            "tool_use_id": tool_block.id,
                            "content": tool_result,
                        }
                    ],
                }
            )
            response = call_claude(
                system=SYSTEM_PROMPT, messages=messages, tools=TOOLS
            )

        reply = _extract_text(response)

        # Save to DB
        add_message("user", req.message)
        add_message("assistant", reply)

        return ChatResponse(
            reply=reply, tools_used=tools_used, confirmation_required=None
        )

    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


def _extract_text(response) -> str:
    """Extract text content from Claude response."""
    for block in response.content:
        if hasattr(block, "text"):
            return block.text
    return ""
