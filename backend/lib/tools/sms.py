async def send(input_data: dict) -> str:
    print(f"[SMS STUB] To: {input_data['recipient']} | Body: {input_data['body']}")
    return f"SMS sent to {input_data['recipient']}. (stub — wire Twilio in lib/tools/sms.py to activate)"
