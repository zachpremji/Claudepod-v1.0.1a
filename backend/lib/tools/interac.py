import json
import uuid
from pathlib import Path
from datetime import datetime

LEDGER = Path(__file__).parent.parent.parent / "data" / "interac_ledger.json"


async def send(input_data: dict) -> str:
    LEDGER.parent.mkdir(exist_ok=True)
    ledger = json.loads(LEDGER.read_text()) if LEDGER.exists() else []
    entry = {
        "id": str(uuid.uuid4()),
        "recipient": input_data["recipient"],
        "amount": input_data["amount"],
        "memo": input_data.get("memo", ""),
        "timestamp": datetime.now().isoformat(),
        "status": "sent (stub)",
    }
    ledger.append(entry)
    LEDGER.write_text(json.dumps(ledger, indent=2))
    return f"Sent ${input_data['amount']} to {input_data['recipient']}. (stub — wire real bank API in lib/tools/interac.py to activate)"
