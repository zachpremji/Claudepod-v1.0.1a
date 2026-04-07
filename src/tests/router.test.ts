import { describe, it, expect } from 'vitest'
import { routePrompt, routingTable } from '../lib/router'

describe('routePrompt', () => {
  it('routes Interac keywords', () => {
    expect(routePrompt('Send an interac transfer').connectorName).toBe('Interac')
    expect(routePrompt('e-transfer $50').connectorName).toBe('Interac')
    expect(routePrompt('etransfer to Jake').connectorName).toBe('Interac')
  })

  it('routes iMessage keywords', () => {
    expect(routePrompt('text mom I am on my way').connectorName).toBe('iMessage')
    expect(routePrompt('text dad goodnight').connectorName).toBe('iMessage')
    expect(routePrompt('Send an imessage to Sarah').connectorName).toBe('iMessage')
  })

  it('routes Instagram DM keywords', () => {
    expect(routePrompt('DM @jake on instagram').connectorName).toBe('Instagram DMs')
    expect(routePrompt('dm @ someone').connectorName).toBe('Instagram DMs')
  })

  it('routes Facebook Messenger keywords', () => {
    expect(routePrompt('Message Jake on messenger').connectorName).toBe('Facebook Messenger')
    expect(routePrompt('Send a facebook message').connectorName).toBe('Facebook Messenger')
  })

  it('routes Microsoft Teams keywords', () => {
    expect(routePrompt('Post to the teams channel').connectorName).toBe('Microsoft Teams')
  })

  it('routes Slack keywords', () => {
    expect(routePrompt('Message #eng about deploy').connectorName).toBe('Slack')
    expect(routePrompt('Post in slack').connectorName).toBe('Slack')
    expect(routePrompt('Send to #general').connectorName).toBe('Slack')
  })

  it('routes Gmail keywords', () => {
    expect(routePrompt('Send an email to Jake').connectorName).toBe('Gmail')
    expect(routePrompt('Check my gmail').connectorName).toBe('Gmail')
    expect(routePrompt('Draft a response').connectorName).toBe('Gmail')
  })

  it('routes Calendar keywords', () => {
    expect(routePrompt('Schedule a meeting at 2pm').connectorName).toBe('Google Calendar')
    expect(routePrompt('Book a room for standup').connectorName).toBe('Google Calendar')
    expect(routePrompt('Add a calendar event').connectorName).toBe('Google Calendar')
  })

  it('routes Linear keywords', () => {
    expect(routePrompt('Create a bug ticket').connectorName).toBe('Linear')
    expect(routePrompt('File a feature request').connectorName).toBe('Linear')
    expect(routePrompt('Open a new issue').connectorName).toBe('Linear')
  })

  it('routes Notion keywords', () => {
    expect(routePrompt('Add a page to Notion').connectorName).toBe('Notion')
  })

  it('routes Asana keywords', () => {
    expect(routePrompt('Create an asana task').connectorName).toBe('Asana')
    expect(routePrompt('Add a to-do item').connectorName).toBe('Asana')
  })

  it('routes Figma keywords', () => {
    expect(routePrompt('Show the figma design').connectorName).toBe('Figma')
    expect(routePrompt('Get the wireframe').connectorName).toBe('Figma')
  })

  it('routes Stripe keywords', () => {
    expect(routePrompt('Refund payment pi_123').connectorName).toBe('Stripe')
    expect(routePrompt('Process a stripe charge').connectorName).toBe('Stripe')
  })

  it('routes HubSpot keywords', () => {
    expect(routePrompt('Find open deals in hubspot').connectorName).toBe('HubSpot')
    expect(routePrompt('Look up a CRM contact').connectorName).toBe('HubSpot')
  })

  it('routes PubMed keywords', () => {
    expect(routePrompt('Search pubmed for CRISPR').connectorName).toBe('PubMed')
    expect(routePrompt('Find a research paper').connectorName).toBe('PubMed')
  })

  it('routes QuickBooks keywords', () => {
    expect(routePrompt('Generate quickbooks P&L').connectorName).toBe('QuickBooks')
    expect(routePrompt('Show the invoice').connectorName).toBe('QuickBooks')
  })

  it('routes Apollo.io keywords', () => {
    expect(routePrompt('Find a prospect on apollo').connectorName).toBe('Apollo.io')
    expect(routePrompt('Search for CTOs').connectorName).toBe('Apollo.io')
  })

  it('routes send $ to Interac', () => {
    expect(routePrompt('send $50 to Jake').connectorName).toBe('Interac')
  })

  it('defaults to Tavily for unknown prompts', () => {
    expect(routePrompt('What is the weather today').connectorName).toBe('Tavily')
    expect(routePrompt('random stuff here').connectorName).toBe('Tavily')
  })

  it('handles mixed case input', () => {
    expect(routePrompt('MESSAGE #ENG about deploy').connectorName).toBe('Slack')
    expect(routePrompt('INTERAC transfer').connectorName).toBe('Interac')
    expect(routePrompt('Text Mom goodnight').connectorName).toBe('iMessage')
  })

  it('handles empty string', () => {
    expect(routePrompt('').connectorName).toBe('Tavily')
  })

  it('returns a chain with at least one node for every route', () => {
    const result = routePrompt('slack message')
    expect(result.chain.length).toBeGreaterThan(0)
    expect(result.chain[0].type).toBe('user')
  })

  it('routing table covers expected connectors', () => {
    const connectorNames = [...new Set(routingTable.map((r) => r.connectorName))]
    expect(connectorNames).toContain('Interac')
    expect(connectorNames).toContain('iMessage')
    expect(connectorNames).toContain('Slack')
    expect(connectorNames).toContain('Gmail')
    expect(connectorNames).toContain('Linear')
    expect(connectorNames).toContain('Stripe')
    expect(connectorNames).toContain('HubSpot')
    expect(connectorNames).toContain('Apollo.io')
  })
})
