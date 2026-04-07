import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

const anthropic = new Anthropic()

const SYSTEM_PROMPT = `You are ClaudePod, an AI-powered smart home assistant built into a speaker device. You are warm, helpful, and conversational — like a knowledgeable friend who lives in the user's home.

You have conversational memory within each session. Remember what the user has told you and reference it naturally.

## Your capabilities

You can take real actions on behalf of the user through connected services (MCP tools). When the user asks you to do something actionable, use the appropriate tool. When they just want to chat, respond conversationally.

## Your personality

- Concise but warm. Don't over-explain.
- Proactive: if you notice something relevant from earlier in the conversation, bring it up.
- When executing an action, briefly confirm what you're about to do, then do it.
- If you're unsure about parameters (e.g., which email address, which Slack channel), ask before acting.
- Use natural language, not technical jargon. You're a home assistant, not a terminal.

## Available tools

You have access to various connected services. Use them when the user's request matches. If no tool fits, just respond conversationally.

Important: When you use a tool, explain what you did in plain language after getting the result.`

// Build tool definitions from the MCP connector data.
// These are simplified tool schemas — in production, each would call a real MCP server.
const tools: Anthropic.Tool[] = [
  {
    name: 'send_slack_message',
    description: 'Send a message to a Slack channel or user',
    input_schema: {
      type: 'object' as const,
      properties: {
        channel: { type: 'string', description: 'Channel name (e.g. #engineering) or user name' },
        message: { type: 'string', description: 'The message to send' },
      },
      required: ['channel', 'message'],
    },
  },
  {
    name: 'send_email',
    description: 'Send or draft an email via Gmail',
    input_schema: {
      type: 'object' as const,
      properties: {
        to: { type: 'string', description: 'Recipient email address' },
        subject: { type: 'string', description: 'Email subject line' },
        body: { type: 'string', description: 'Email body text' },
        draft: { type: 'boolean', description: 'If true, save as draft instead of sending' },
      },
      required: ['to', 'subject', 'body'],
    },
  },
  {
    name: 'search_email',
    description: 'Search Gmail for emails matching a query',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Search query (e.g. "from:boss subject:report")' },
      },
      required: ['query'],
    },
  },
  {
    name: 'create_calendar_event',
    description: 'Create a Google Calendar event',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string', description: 'Event title' },
        date: { type: 'string', description: 'Date (e.g. "Monday", "2025-01-15")' },
        time: { type: 'string', description: 'Start time (e.g. "9am", "14:00")' },
        duration_minutes: { type: 'number', description: 'Duration in minutes (default 60)' },
        attendees: { type: 'string', description: 'Comma-separated attendee names or emails' },
      },
      required: ['title', 'date', 'time'],
    },
  },
  {
    name: 'list_calendar_events',
    description: 'List upcoming calendar events',
    input_schema: {
      type: 'object' as const,
      properties: {
        date: { type: 'string', description: 'Date to check (e.g. "today", "tomorrow", "Monday")' },
      },
      required: ['date'],
    },
  },
  {
    name: 'send_imessage',
    description: 'Send an iMessage to a contact',
    input_schema: {
      type: 'object' as const,
      properties: {
        to: { type: 'string', description: 'Contact name or phone number' },
        message: { type: 'string', description: 'Message text' },
      },
      required: ['to', 'message'],
    },
  },
  {
    name: 'send_etransfer',
    description: 'Send an Interac e-Transfer to someone',
    input_schema: {
      type: 'object' as const,
      properties: {
        to: { type: 'string', description: 'Recipient name or email' },
        amount: { type: 'number', description: 'Amount in dollars' },
        note: { type: 'string', description: 'Optional note for the transfer' },
      },
      required: ['to', 'amount'],
    },
  },
  {
    name: 'create_linear_issue',
    description: 'Create a Linear issue/ticket',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string', description: 'Issue title' },
        description: { type: 'string', description: 'Issue description' },
        priority: { type: 'string', description: 'Priority: urgent, high, medium, low' },
        team: { type: 'string', description: 'Team name' },
      },
      required: ['title'],
    },
  },
  {
    name: 'create_notion_page',
    description: 'Create a page in Notion',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string', description: 'Page title' },
        content: { type: 'string', description: 'Page content in markdown' },
        parent: { type: 'string', description: 'Parent page or database name' },
      },
      required: ['title', 'content'],
    },
  },
  {
    name: 'web_search',
    description: 'Search the web for information',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Search query' },
      },
      required: ['query'],
    },
  },
  {
    name: 'control_lights',
    description: 'Control smart home lights',
    input_schema: {
      type: 'object' as const,
      properties: {
        room: { type: 'string', description: 'Room name (e.g. "living room", "bedroom", "all")' },
        action: { type: 'string', description: 'Action: on, off, dim, brighten' },
        brightness: { type: 'number', description: 'Brightness percentage (0-100)' },
      },
      required: ['room', 'action'],
    },
  },
  {
    name: 'set_thermostat',
    description: 'Set the home thermostat temperature',
    input_schema: {
      type: 'object' as const,
      properties: {
        temperature: { type: 'number', description: 'Target temperature in degrees' },
        unit: { type: 'string', description: 'Temperature unit: celsius or fahrenheit' },
        mode: { type: 'string', description: 'Mode: heat, cool, auto' },
      },
      required: ['temperature'],
    },
  },
  {
    name: 'play_music',
    description: 'Play music on the smart speaker',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Song, artist, playlist, or genre to play' },
        source: { type: 'string', description: 'Music source: spotify, apple_music, youtube_music' },
      },
      required: ['query'],
    },
  },
  {
    name: 'set_timer',
    description: 'Set a timer or alarm',
    input_schema: {
      type: 'object' as const,
      properties: {
        duration: { type: 'string', description: 'Duration (e.g. "5 minutes", "1 hour")' },
        label: { type: 'string', description: 'Optional label for the timer' },
      },
      required: ['duration'],
    },
  },
  {
    name: 'get_weather',
    description: 'Get the current weather or forecast',
    input_schema: {
      type: 'object' as const,
      properties: {
        location: { type: 'string', description: 'City or location (defaults to home)' },
      },
      required: [],
    },
  },
  {
    name: 'search_hubspot',
    description: 'Search HubSpot CRM for contacts, deals, or companies',
    input_schema: {
      type: 'object' as const,
      properties: {
        object_type: { type: 'string', description: 'Type: contacts, deals, companies' },
        query: { type: 'string', description: 'Search query or filters' },
      },
      required: ['object_type', 'query'],
    },
  },
  {
    name: 'create_stripe_refund',
    description: 'Create a refund via Stripe',
    input_schema: {
      type: 'object' as const,
      properties: {
        payment_id: { type: 'string', description: 'Payment or charge ID' },
        amount: { type: 'number', description: 'Refund amount (leave empty for full refund)' },
        reason: { type: 'string', description: 'Reason for refund' },
      },
      required: ['payment_id'],
    },
  },
]

// Simulate tool execution. In production, each tool call would go to a real MCP server.
function simulateToolExecution(name: string, input: Record<string, unknown>): string {
  switch (name) {
    case 'send_slack_message':
      return JSON.stringify({ ok: true, channel: input.channel, ts: Date.now().toString() })
    case 'send_email':
      return JSON.stringify({ ok: true, message_id: `msg_${Date.now()}`, status: input.draft ? 'drafted' : 'sent' })
    case 'search_email':
      return JSON.stringify({ results: [{ from: 'team@company.com', subject: 'Weekly update', snippet: 'Here are the highlights...' }], total: 1 })
    case 'create_calendar_event':
      return JSON.stringify({ ok: true, event_id: `evt_${Date.now()}`, link: 'https://calendar.google.com/event/...' })
    case 'list_calendar_events':
      return JSON.stringify({ events: [{ title: 'Team standup', time: '9:00 AM' }, { title: 'Lunch with Sarah', time: '12:30 PM' }] })
    case 'send_imessage':
      return JSON.stringify({ ok: true, delivered: true })
    case 'send_etransfer':
      return JSON.stringify({ ok: true, reference: `ET${Date.now()}`, status: 'pending' })
    case 'create_linear_issue':
      return JSON.stringify({ ok: true, issue_id: `ENG-${Math.floor(Math.random() * 900) + 100}`, url: 'https://linear.app/...' })
    case 'create_notion_page':
      return JSON.stringify({ ok: true, page_id: `page_${Date.now()}`, url: 'https://notion.so/...' })
    case 'web_search':
      return JSON.stringify({ results: [{ title: 'Top result', url: 'https://example.com', snippet: 'Relevant information about your query.' }] })
    case 'control_lights':
      return JSON.stringify({ ok: true, room: input.room, state: input.action })
    case 'set_thermostat':
      return JSON.stringify({ ok: true, temperature: input.temperature, mode: input.mode || 'auto' })
    case 'play_music':
      return JSON.stringify({ ok: true, now_playing: input.query, source: input.source || 'spotify' })
    case 'set_timer':
      return JSON.stringify({ ok: true, duration: input.duration, label: input.label || 'Timer' })
    case 'get_weather':
      return JSON.stringify({ location: input.location || 'Home', temperature: '72°F', condition: 'Partly cloudy', high: '78°F', low: '65°F' })
    case 'search_hubspot':
      return JSON.stringify({ results: [{ name: 'Acme Corp', deal_amount: '$52,000', stage: 'Negotiation' }], total: 1 })
    case 'create_stripe_refund':
      return JSON.stringify({ ok: true, refund_id: `re_${Date.now()}`, status: 'succeeded' })
    default:
      return JSON.stringify({ ok: true })
  }
}

// SSE streaming chat endpoint
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body as {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  }

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'messages array is required' })
    return
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
  }

  try {
    // Convert frontend messages to Anthropic format
    const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    let continueLoop = true
    while (continueLoop) {
      continueLoop = false

      const stream = anthropic.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools,
        messages: anthropicMessages,
      })

      // Collect the full response for potential tool use continuation
      let currentText = ''
      const toolUseBlocks: Array<{ id: string; name: string; input: Record<string, unknown> }> = []

      stream.on('text', (text) => {
        currentText += text
        send('text', { text })
      })

      stream.on('contentBlock', (block) => {
        if (block.type === 'tool_use') {
          toolUseBlocks.push({
            id: block.id,
            name: block.name,
            input: block.input as Record<string, unknown>,
          })
          send('tool_use', { id: block.id, name: block.name, input: block.input })
        }
      })

      const finalMessage = await stream.finalMessage()

      // If the model wants to use tools, execute them and continue
      if (finalMessage.stop_reason === 'tool_use' && toolUseBlocks.length > 0) {
        // Add assistant response to conversation
        anthropicMessages.push({ role: 'assistant', content: finalMessage.content })

        // Execute tools and add results
        const toolResults: Anthropic.ToolResultBlockParam[] = toolUseBlocks.map((tool) => {
          const result = simulateToolExecution(tool.name, tool.input)
          send('tool_result', { tool_use_id: tool.id, name: tool.name, result })
          return {
            type: 'tool_result' as const,
            tool_use_id: tool.id,
            content: result,
          }
        })

        anthropicMessages.push({ role: 'user', content: toolResults })
        continueLoop = true
      }
    }

    send('done', {})
    res.end()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    send('error', { message })
    res.end()
  }
})

const PORT = parseInt(process.env.PORT || '3001')
app.listen(PORT, () => {
  console.log(`ClaudePod server running on http://localhost:${PORT}`)
})
