import type { Category, ChainNode } from '../types'

function pchain(action: string, platform: string, apiCall: string): ChainNode[] {
  return [
    { label: 'User prompt', sub: `"${action}…"`, type: 'user' },
    { label: 'Intent parse', sub: action, type: 'think' },
    { label: 'Extract params', sub: 'parameters', type: 'extract' },
    { label: `${platform} API`, sub: `${apiCall}()`, type: 'api' },
    { label: 'Output', sub: 'confirmed', type: 'output' },
  ]
}

export const platformCategory: Category = {
  name: 'Platform Chains',
  emoji: '◆',
  color: '#7c9dff',
  connectors: [
    {
      name: 'iMessage',
      type: 'platform',
      actions: ['send_message', 'read_messages', 'search_messages', 'send_reaction', 'manage_group'],
      chains: {
        send_message: pchain('Text mom I\'ll be home by 7', 'iMessage', 'send_message'),
        read_messages: pchain('Read my latest messages', 'iMessage', 'read_messages'),
        search_messages: pchain('Search messages from Jake', 'iMessage', 'search_messages'),
        send_reaction: pchain('React to that message', 'iMessage', 'send_reaction'),
        manage_group: pchain('Create a group chat', 'iMessage', 'manage_group'),
      },
    },
    {
      name: 'Interac',
      type: 'platform',
      actions: ['send_money', 'request_money', 'check_transfer_status', 'cancel_transfer', 'autodeposit_settings'],
      chains: {
        send_money: [
          { label: 'User prompt', sub: '"Send $50 to Jake…"', type: 'user' },
          { label: 'Intent parse', sub: 'send_money', type: 'think' },
          { label: 'Extract params', sub: 'recipient=Jake, amount=$50', type: 'extract' },
          { label: 'Interac API', sub: 'send_etransfer()', type: 'api' },
          { label: 'Output', sub: 'transfer initiated', type: 'output' },
        ],
        request_money: pchain('Request $30 from Sarah', 'Interac', 'request_money'),
        check_transfer_status: pchain('Check if my transfer went through', 'Interac', 'check_transfer_status'),
        cancel_transfer: pchain('Cancel my last e-Transfer', 'Interac', 'cancel_transfer'),
        autodeposit_settings: pchain('Set up auto-deposit', 'Interac', 'autodeposit_settings'),
      },
    },
    {
      name: 'Instagram DMs',
      type: 'platform',
      actions: ['send_dm', 'read_dms', 'search_dms', 'manage_requests', 'share_content'],
      chains: {
        send_dm: [
          { label: 'User prompt', sub: '"DM @jake_design…"', type: 'user' },
          { label: 'Intent parse', sub: 'send_dm', type: 'think' },
          { label: 'Extract params', sub: 'recipient, body', type: 'extract' },
          { label: 'Instagram API', sub: 'send_dm()', type: 'api' },
          { label: 'Output', sub: 'DM sent', type: 'output' },
        ],
        read_dms: pchain('Read my Instagram DMs', 'Instagram', 'read_dms'),
        search_dms: pchain('Search DMs for "project"', 'Instagram', 'search_dms'),
        manage_requests: pchain('Accept message request from @user', 'Instagram', 'manage_requests'),
        share_content: pchain('Share this reel with Jake', 'Instagram', 'share_content'),
      },
    },
    {
      name: 'Facebook Messenger',
      type: 'platform',
      actions: ['send_message', 'read_messages', 'search_messages', 'manage_group', 'reactions_and_interactions'],
      chains: {
        send_message: [
          { label: 'User prompt', sub: '"Message Jake on Messenger…"', type: 'user' },
          { label: 'Intent parse', sub: 'send_message', type: 'think' },
          { label: 'Extract params', sub: 'recipient=Jake, body', type: 'extract' },
          { label: 'Messenger API', sub: 'send_message()', type: 'api' },
          { label: 'Output', sub: 'message sent', type: 'output' },
        ],
        read_messages: pchain('Read my Messenger inbox', 'Messenger', 'read_messages'),
        search_messages: pchain('Search messages for "dinner"', 'Messenger', 'search_messages'),
        manage_group: pchain('Create a group chat on Messenger', 'Messenger', 'manage_group'),
        reactions_and_interactions: pchain('React to Jake\'s message', 'Messenger', 'reactions_and_interactions'),
      },
    },
    {
      name: 'Microsoft Teams',
      type: 'platform',
      actions: ['send_message', 'read_messages', 'search_messages', 'manage_channels', 'schedule_meeting'],
      chains: {
        send_message: [
          { label: 'User prompt', sub: '"Post to Engineering channel…"', type: 'user' },
          { label: 'Intent parse', sub: 'send_message', type: 'think' },
          { label: 'Extract params', sub: 'channel, body', type: 'extract' },
          { label: 'Teams API', sub: 'send_channel_message()', type: 'api' },
          { label: 'Output', sub: 'message posted', type: 'output' },
        ],
        read_messages: pchain('Read Teams messages', 'Teams', 'read_messages'),
        search_messages: pchain('Search Teams for "standup"', 'Teams', 'search_messages'),
        manage_channels: pchain('Create a new Teams channel', 'Teams', 'manage_channels'),
        schedule_meeting: pchain('Schedule a Teams meeting', 'Teams', 'schedule_meeting'),
      },
    },
  ],
}
