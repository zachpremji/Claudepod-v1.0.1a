import type { ChainNode } from '../types'
import { mcpCategories } from '../data/mcp'
import { platformCategory } from '../data/platforms'

export interface RouteResult {
  connectorName: string
  chain: ChainNode[]
}

export interface RouteRule {
  keywords: string[]
  connectorName: string
  defaultAction: string
}

export const routingTable: RouteRule[] = [
  { keywords: ['interac', 'e-transfer', 'etransfer'], connectorName: 'Interac', defaultAction: 'send_money' },
  { keywords: ['imessage', 'text mom', 'text dad', 'text my'], connectorName: 'iMessage', defaultAction: 'send_message' },
  { keywords: ['instagram', 'dm @'], connectorName: 'Instagram DMs', defaultAction: 'send_dm' },
  { keywords: ['facebook', 'messenger', 'fb '], connectorName: 'Facebook Messenger', defaultAction: 'send_message' },
  { keywords: ['teams', 'channel'], connectorName: 'Microsoft Teams', defaultAction: 'send_message' },
  { keywords: ['slack', '#eng', '#dev', '#general'], connectorName: 'Slack', defaultAction: 'send_message' },
  { keywords: ['gmail', 'email', 'draft'], connectorName: 'Gmail', defaultAction: 'search_messages' },
  { keywords: ['calendar', 'schedule', 'standup', 'meeting', 'book a'], connectorName: 'Google Calendar', defaultAction: 'create_event' },
  { keywords: ['linear', 'issue', 'ticket', 'bug', 'feature request'], connectorName: 'Linear', defaultAction: 'create_issue' },
  { keywords: ['notion', 'page'], connectorName: 'Notion', defaultAction: 'create_pages' },
  { keywords: ['asana', 'task', 'to-do'], connectorName: 'Asana', defaultAction: 'create_task_preview' },
  { keywords: ['figma', 'design', 'wireframe'], connectorName: 'Figma', defaultAction: 'get_design_context' },
  { keywords: ['stripe', 'refund', 'charge'], connectorName: 'Stripe', defaultAction: 'create_refund' },
  { keywords: ['hubspot', 'deal', 'crm', 'contact'], connectorName: 'HubSpot', defaultAction: 'search_crm_objects' },
  { keywords: ['pubmed', 'research', 'study', 'paper'], connectorName: 'PubMed', defaultAction: 'search_articles' },
  { keywords: ['quickbooks', 'p&l', 'invoice', 'accounting'], connectorName: 'QuickBooks', defaultAction: 'profit_loss_generator' },
  { keywords: ['apollo', 'prospect', 'cto', 'vp'], connectorName: 'Apollo.io', defaultAction: 'apollo_search_people' },
  { keywords: ['send $', 'send$'], connectorName: 'Interac', defaultAction: 'send_money' },
]

const allCategories = [...mcpCategories, platformCategory]

function findConnectorChain(connectorName: string, action: string): ChainNode[] {
  for (const cat of allCategories) {
    for (const conn of cat.connectors) {
      if (conn.name === connectorName && conn.chains[action]) {
        return conn.chains[action]
      }
    }
  }
  // fallback generic chain
  return [
    { label: 'User prompt', sub: `"${connectorName}…"`, type: 'user' },
    { label: 'Intent parse', sub: action, type: 'think' },
    { label: 'Extract params', sub: 'parameters', type: 'extract' },
    { label: `${connectorName} API`, sub: `${action}()`, type: 'api' },
    { label: 'Output', sub: 'result', type: 'output' },
  ]
}

const tavilyFallback: RouteResult = {
  connectorName: 'Tavily',
  chain: [
    { label: 'User prompt', sub: '"search query…"', type: 'user' },
    { label: 'Intent parse', sub: 'tavily_search', type: 'think' },
    { label: 'Extract params', sub: 'query, depth', type: 'extract' },
    { label: 'Tavily API', sub: 'tavily_search()', type: 'api' },
    { label: 'Output', sub: 'search results', type: 'output' },
  ],
}

export function routePrompt(text: string): RouteResult {
  const lower = text.toLowerCase().trim()
  if (!lower) return tavilyFallback

  for (const rule of routingTable) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) {
        return {
          connectorName: rule.connectorName,
          chain: findConnectorChain(rule.connectorName, rule.defaultAction),
        }
      }
    }
  }

  return tavilyFallback
}
