import type { QuickPrompt } from '../types'

export const quickPrompts: QuickPrompt[] = [
  {
    tag: 'Slack',
    text: 'Message #engineering: deploy is live',
    chain: [
      { label: 'User prompt', sub: '"Message #engineering…"', type: 'user' },
      { label: 'Intent parse', sub: 'send_message', type: 'think' },
      { label: 'Extract params', sub: 'channel, content', type: 'extract' },
      { label: 'search_channel', sub: 'resolve #engineering', type: 'api' },
      { label: 'Slack API', sub: 'send_message()', type: 'api' },
      { label: 'Output', sub: 'message sent', type: 'output' },
    ],
  },
  {
    tag: 'Interac',
    text: 'Send $75 to Sarah for dinner',
    chain: [
      { label: 'User prompt', sub: '"Send $75 to Sarah…"', type: 'user' },
      { label: 'Intent parse', sub: 'send_money', type: 'think' },
      { label: 'Extract params', sub: 'recipient=Sarah, amount=$75', type: 'extract' },
      { label: 'Interac API', sub: 'send_etransfer()', type: 'api' },
      { label: 'Output', sub: 'transfer initiated', type: 'output' },
    ],
  },
  {
    tag: 'Linear',
    text: 'Create a bug ticket for the login crash',
    chain: [
      { label: 'User prompt', sub: '"Create a bug ticket…"', type: 'user' },
      { label: 'Intent parse', sub: 'create_issue', type: 'think' },
      { label: 'Extract params', sub: 'title, team, priority', type: 'extract' },
      { label: 'Linear API', sub: 'create_issue()', type: 'api' },
      { label: 'Output', sub: 'issue created', type: 'output' },
    ],
  },
  {
    tag: 'Google Calendar',
    text: 'Schedule standup Monday 9am with the team',
    chain: [
      { label: 'User prompt', sub: '"Schedule standup…"', type: 'user' },
      { label: 'Intent parse', sub: 'create_event', type: 'think' },
      { label: 'Extract params', sub: 'title, time, attendees', type: 'extract' },
      { label: 'Calendar API', sub: 'create_event()', type: 'api' },
      { label: 'Output', sub: 'event created', type: 'output' },
    ],
  },
  {
    tag: 'HubSpot',
    text: 'Find all open deals over $50k',
    chain: [
      { label: 'User prompt', sub: '"Find deals over $50k…"', type: 'user' },
      { label: 'Intent parse', sub: 'search_crm_objects', type: 'think' },
      { label: 'Extract params', sub: 'object=deals, filters', type: 'extract' },
      { label: 'HubSpot API', sub: 'search_crm_objects()', type: 'api' },
      { label: 'Output', sub: 'deals returned', type: 'output' },
    ],
  },
  {
    tag: 'iMessage',
    text: "Text mom I'll be home by 7",
    chain: [
      { label: 'User prompt', sub: '"Text mom I\'ll be home…"', type: 'user' },
      { label: 'Intent parse', sub: 'send_message', type: 'think' },
      { label: 'Extract params', sub: 'recipient=Mom, body', type: 'extract' },
      { label: 'iMessage API', sub: 'send_message()', type: 'api' },
      { label: 'Output', sub: 'message sent', type: 'output' },
    ],
  },
]
