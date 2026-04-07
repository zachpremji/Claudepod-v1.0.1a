import type { Category } from '../types'

function chain(action: string, connectorLabel: string, apiName: string) {
  return [
    { label: 'User prompt', sub: `"${action}…"`, type: 'user' as const },
    { label: 'Intent parse', sub: action, type: 'think' as const },
    { label: 'Extract params', sub: 'parameters', type: 'extract' as const },
    { label: `${connectorLabel} API`, sub: `${apiName}()`, type: 'api' as const },
    { label: 'Output', sub: 'formatted result', type: 'output' as const },
  ]
}

export const mcpCategories: Category[] = [
  // ── Code ──
  {
    name: 'Code',
    emoji: '■',
    color: '#4f6ef7',
    connectors: [
      {
        name: 'Cloudflare Developer Platform',
        type: 'mcp',
        actions: ['accounts_list', 'kv_namespace_create', 'kv_namespaces_list', 'workers_list', 'set_active_account'],
        chains: {
          kv_namespace_create: chain('Create a KV namespace', 'Cloudflare', 'kv_namespace_create'),
          accounts_list: chain('List Cloudflare accounts', 'Cloudflare', 'accounts_list'),
        },
      },
      {
        name: 'Context7',
        type: 'mcp',
        actions: ['query_docs', 'resolve_library_id'],
        chains: {
          query_docs: chain('Query library docs', 'Context7', 'query_docs'),
        },
      },
      {
        name: 'Google BigQuery',
        type: 'mcp',
        actions: ['execute_sql', 'get_dataset_info', 'get_table_info', 'list_dataset_ids', 'list_table_ids'],
        chains: {
          execute_sql: chain('Run a BigQuery SQL query', 'BigQuery', 'execute_sql'),
        },
      },
      {
        name: 'Google Compute Engine',
        type: 'mcp',
        actions: ['create_instance', 'delete_instance', 'start_instance', 'stop_instance', 'reset_instance'],
        chains: {
          create_instance: chain('Create a VM instance', 'GCE', 'create_instance'),
        },
      },
      {
        name: 'Vercel',
        type: 'mcp',
        actions: ['get_deployment', 'list_deployments', 'list_projects', 'list_teams', 'search_docs'],
        chains: {
          list_deployments: chain('List Vercel deployments', 'Vercel', 'list_deployments'),
        },
      },
      {
        name: 'Supabase',
        type: 'mcp',
        actions: ['create_project', 'get_project', 'list_projects', 'pause_project', 'get_cost', 'confirm_cost'],
        chains: {
          create_project: chain('Create a Supabase project', 'Supabase', 'create_project'),
        },
      },
      {
        name: 'Microsoft Learn',
        type: 'mcp',
        actions: ['microsoft_docs_search', 'microsoft_docs_fetch', 'microsoft_code_sample_search'],
        chains: {
          microsoft_docs_search: chain('Search Microsoft docs', 'Microsoft Learn', 'microsoft_docs_search'),
        },
      },
      {
        name: 'GraphOS MCP Tools',
        type: 'mcp',
        actions: ['ApolloConnectorsSpec', 'ApolloDocsRead', 'ApolloDocsSearch'],
        chains: {
          ApolloDocsSearch: chain('Search Apollo docs', 'GraphOS', 'ApolloDocsSearch'),
        },
      },
    ],
  },

  // ── Communication ──
  {
    name: 'Communication',
    emoji: '■',
    color: '#2dd4a0',
    connectors: [
      {
        name: 'Gmail',
        type: 'mcp',
        actions: ['create_draft', 'get_profile', 'list_drafts', 'read_message', 'read_thread', 'search_messages'],
        chains: {
          search_messages: chain('Search emails', 'Gmail', 'search_messages'),
          create_draft: chain('Draft an email', 'Gmail', 'create_draft'),
        },
      },
      {
        name: 'Slack',
        type: 'mcp',
        actions: ['send_message', 'read_channel', 'read_thread', 'search_channels', 'search_users', 'create_canvas'],
        chains: {
          send_message: [
            { label: 'User prompt', sub: '"Message #eng…"', type: 'user' },
            { label: 'Intent parse', sub: 'send_message', type: 'think' },
            { label: 'Extract params', sub: 'channel, content', type: 'extract' },
            { label: 'search_channel', sub: 'resolve channel', type: 'api' },
            { label: 'Slack API', sub: 'send_message()', type: 'api' },
            { label: 'Output', sub: 'message sent', type: 'output' },
          ],
        },
      },
      {
        name: 'Google Calendar',
        type: 'mcp',
        actions: ['create_event', 'delete_event', 'find_meeting_times', 'find_my_free_time', 'list_events', 'update_event'],
        chains: {
          create_event: chain('Schedule a meeting', 'Calendar', 'create_event'),
          list_events: chain('List calendar events', 'Calendar', 'list_events'),
        },
      },
      {
        name: 'Fellow.ai',
        type: 'mcp',
        actions: ['get_meeting_summary', 'get_action_items', 'get_meeting_transcript', 'search_meetings'],
        chains: {
          get_meeting_summary: chain('Get meeting summary', 'Fellow', 'get_meeting_summary'),
        },
      },
      {
        name: 'Circleback',
        type: 'mcp',
        actions: ['SearchMeetings', 'ReadMeetings', 'GetTranscriptsForMeetings', 'SearchEmails', 'SearchCalendarEvents'],
        chains: {
          SearchMeetings: chain('Search meetings', 'Circleback', 'SearchMeetings'),
        },
      },
      {
        name: 'Krisp',
        type: 'mcp',
        actions: ['list_action_items', 'list_activities', 'list_upcoming_meetings', 'search_meetings'],
        chains: {
          search_meetings: chain('Search Krisp meetings', 'Krisp', 'search_meetings'),
        },
      },
      {
        name: 'Glean',
        type: 'mcp',
        actions: ['search', 'chat', 'code_search', 'employee_search', 'read_document'],
        chains: {
          search: chain('Search with Glean', 'Glean', 'search'),
        },
      },
    ],
  },

  // ── Data ──
  {
    name: 'Data',
    emoji: '■',
    color: '#f0a84c',
    connectors: [
      {
        name: 'Tavily',
        type: 'mcp',
        actions: ['tavily_search', 'tavily_research', 'tavily_extract', 'tavily_crawl', 'tavily_map'],
        chains: {
          tavily_search: chain('Search the web', 'Tavily', 'tavily_search'),
          tavily_research: chain('Research a topic', 'Tavily', 'tavily_research'),
        },
      },
      {
        name: 'MotherDuck',
        type: 'mcp',
        actions: ['query', 'query_rw', 'list_databases', 'list_tables', 'search_catalog', 'ask_docs_question'],
        chains: {
          query: chain('Query MotherDuck', 'MotherDuck', 'query'),
        },
      },
      {
        name: 'Similarweb',
        type: 'mcp',
        actions: ['get_websites_traffic_and_engagement', 'get_websites_traffic_sources', 'get_websites_website_rank'],
        chains: {
          get_websites_traffic_and_engagement: chain('Get website traffic', 'Similarweb', 'get_websites_traffic_and_engagement'),
        },
      },
      {
        name: 'Supermetrics',
        type: 'mcp',
        actions: ['data_query', 'accounts_discovery', 'field_discovery', 'data_source_discovery'],
        chains: {
          data_query: chain('Query marketing data', 'Supermetrics', 'data_query'),
        },
      },
      {
        name: 'PlanetScale',
        type: 'mcp',
        actions: ['execute_read_query', 'get_database', 'list_databases', 'list_branches', 'get_branch_schema'],
        chains: {
          execute_read_query: chain('Run a PlanetScale query', 'PlanetScale', 'execute_read_query'),
        },
      },
      {
        name: 'Ahrefs',
        type: 'mcp',
        actions: ['batch_analysis', 'brand_radar_ai_responses', 'brand_radar_impressions_overview'],
        chains: {
          batch_analysis: chain('Run Ahrefs analysis', 'Ahrefs', 'batch_analysis'),
        },
      },
      {
        name: 'Hex',
        type: 'mcp',
        actions: ['search_projects', 'create_thread', 'get_thread', 'continue_thread'],
        chains: {
          search_projects: chain('Search Hex projects', 'Hex', 'search_projects'),
        },
      },
      {
        name: 'Windsor.ai',
        type: 'mcp',
        actions: ['get_data', 'get_accounts', 'get_connectors', 'get_fields'],
        chains: {
          get_data: chain('Get Windsor data', 'Windsor.ai', 'get_data'),
        },
      },
      {
        name: 'Coupler.io',
        type: 'mcp',
        actions: ['get_data', 'get_dataflow', 'get_schema', 'list_dataflows'],
        chains: {
          get_data: chain('Get Coupler data', 'Coupler.io', 'get_data'),
        },
      },
      {
        name: 'Omni Analytics',
        type: 'mcp',
        actions: ['getData', 'pickModel', 'pickTopic'],
        chains: {
          getData: chain('Get analytics data', 'Omni', 'getData'),
        },
      },
      {
        name: 'Dremio Cloud',
        type: 'mcp',
        actions: ['RunSqlQuery', 'BuildUsageReport', 'GetFailedJobDetails', 'SemanticSearch'],
        chains: {
          RunSqlQuery: chain('Run Dremio SQL', 'Dremio', 'RunSqlQuery'),
        },
      },
      {
        name: 'CData Connect AI',
        type: 'mcp',
        actions: ['getTables', 'getSchemas', 'getPrimaryKeys', 'getIndexes'],
        chains: {
          getTables: chain('List CData tables', 'CData', 'getTables'),
        },
      },
    ],
  },

  // ── Design ──
  {
    name: 'Design',
    emoji: '■',
    color: '#e879f9',
    connectors: [
      {
        name: 'Figma',
        type: 'mcp',
        actions: ['get_design_context', 'get_screenshot', 'get_metadata', 'get_variable_defs', 'generate_diagram', 'create_design_system_rules'],
        chains: {
          get_design_context: chain('Show design context', 'Figma', 'get_design_context'),
        },
      },
      {
        name: 'Canva',
        type: 'mcp',
        actions: ['export_design', 'search_designs', 'get_design', 'get_design_pages', 'import_design_from_url'],
        chains: {
          search_designs: chain('Search Canva designs', 'Canva', 'search_designs'),
        },
      },
      {
        name: 'Cloudinary',
        type: 'mcp',
        actions: ['upload_asset', 'list_images', 'list_videos', 'delete_asset', 'download_asset'],
        chains: {
          upload_asset: chain('Upload asset', 'Cloudinary', 'upload_asset'),
        },
      },
    ],
  },

  // ── Development ──
  {
    name: 'Development',
    emoji: '■',
    color: '#38bdf8',
    connectors: [
      {
        name: 'Linear',
        type: 'mcp',
        actions: ['create_issue', 'get_issue', 'list_issues', 'create_comment', 'list_cycles', 'get_document'],
        chains: {
          create_issue: chain('Create a Linear issue', 'Linear', 'create_issue'),
        },
      },
      {
        name: 'Atlassian Rovo',
        type: 'mcp',
        actions: ['get_jira_issue', 'get_confluence_page', 'get_confluence_spaces', 'get_accessible_atlassian_resources'],
        chains: {
          get_jira_issue: chain('Get Jira issue', 'Atlassian', 'get_jira_issue'),
        },
      },
      {
        name: 'Webflow',
        type: 'mcp',
        actions: ['data_pages_tool', 'data_cms_tool', 'data_sites_tool', 'data_components_tool', 'webflow_guide_tool'],
        chains: {
          data_pages_tool: chain('Get Webflow pages', 'Webflow', 'data_pages_tool'),
        },
      },
      {
        name: 'Sanity',
        type: 'mcp',
        actions: ['create_project', 'create_dataset', 'create_documents_from_json', 'deploy_schema', 'get_entity'],
        chains: {
          create_project: chain('Create Sanity project', 'Sanity', 'create_project'),
        },
      },
      {
        name: 'Port IO',
        type: 'mcp',
        actions: ['list_actions', 'list_blueprints', 'list_entities', 'run_action', 'list_scorecards'],
        chains: {
          list_actions: chain('List Port actions', 'Port IO', 'list_actions'),
        },
      },
      {
        name: 'WordPress.com',
        type: 'mcp',
        actions: ['user_sites', 'user_domains', 'user_notifications', 'user_profile', 'user_security'],
        chains: {
          user_sites: chain('List WordPress sites', 'WordPress', 'user_sites'),
        },
      },
      {
        name: 'pg-aiguide',
        type: 'mcp',
        actions: ['search_docs', 'view_skill'],
        chains: {
          search_docs: chain('Search pg-aiguide docs', 'pg-aiguide', 'search_docs'),
        },
      },
    ],
  },

  // ── Financial ──
  {
    name: 'Financial',
    emoji: '■',
    color: '#34d399',
    connectors: [
      {
        name: 'Stripe',
        type: 'mcp',
        actions: ['create_customer', 'create_refund', 'list_customers', 'list_products', 'create_price', 'search_documentation'],
        chains: {
          create_refund: chain('Refund a payment', 'Stripe', 'create_refund'),
          create_customer: chain('Create Stripe customer', 'Stripe', 'create_customer'),
        },
      },
      {
        name: 'PayPal',
        type: 'mcp',
        actions: ['create_order', 'create_refund', 'list_disputes', 'list_invoices', 'send_invoice', 'create_subscription'],
        chains: {
          create_order: chain('Create PayPal order', 'PayPal', 'create_order'),
        },
      },
      {
        name: 'QuickBooks',
        type: 'mcp',
        actions: ['profit_loss_generator', 'cash_flow_generator', 'company_info', 'benchmarking_against_industry'],
        chains: {
          profit_loss_generator: chain('Generate P&L report', 'QuickBooks', 'profit_loss_generator'),
        },
      },
      {
        name: 'Morningstar',
        type: 'mcp',
        actions: ['morningstar_screener_tool', 'morningstar_data_tool', 'morningstar_analyst_research_tool'],
        chains: {
          morningstar_screener_tool: chain('Screen investments', 'Morningstar', 'morningstar_screener_tool'),
        },
      },
      {
        name: 'Razorpay',
        type: 'mcp',
        actions: ['fetch_all_payments', 'fetch_order', 'fetch_payment', 'fetch_all_orders', 'fetch_payment_link'],
        chains: {
          fetch_all_payments: chain('List Razorpay payments', 'Razorpay', 'fetch_all_payments'),
        },
      },
      {
        name: 'Zoho Books',
        type: 'mcp',
        actions: ['get_invoice', 'list_contacts', 'get_expense', 'create_item', 'list_taxes'],
        chains: {
          get_invoice: chain('Get Zoho invoice', 'Zoho Books', 'get_invoice'),
        },
      },
    ],
  },

  // ── Health ──
  {
    name: 'Health',
    emoji: '■',
    color: '#f87171',
    connectors: [
      {
        name: 'CMS Coverage',
        type: 'mcp',
        actions: ['search_ncds', 'search_lcds', 'get_ncd', 'search_articles', 'get_contractors'],
        chains: {
          search_ncds: chain('Search NCDs', 'CMS', 'search_ncds'),
        },
      },
      {
        name: 'ICD-10 Codes',
        type: 'mcp',
        actions: ['search_diagnosis_by_description', 'search_diagnosis_by_code', 'lookup_code', 'get_hierarchy'],
        chains: {
          search_diagnosis_by_description: chain('Search ICD-10 codes', 'ICD-10', 'search_diagnosis_by_description'),
        },
      },
      {
        name: 'Medidata',
        type: 'mcp',
        actions: ['get_ranked_sites', 'get_supported_disease_areas', 'search_support_documentation'],
        chains: {
          get_ranked_sites: chain('Get ranked trial sites', 'Medidata', 'get_ranked_sites'),
        },
      },
      {
        name: 'NPI Registry',
        type: 'mcp',
        actions: ['npi_search', 'npi_lookup', 'npi_validate'],
        chains: {
          npi_search: chain('Search NPI registry', 'NPI', 'npi_search'),
        },
      },
    ],
  },

  // ── Life Sciences ──
  {
    name: 'Life Sciences',
    emoji: '■',
    color: '#a78bfa',
    connectors: [
      {
        name: 'PubMed',
        type: 'mcp',
        actions: ['search_articles', 'get_article_metadata', 'get_full_text_article', 'find_related_articles'],
        chains: {
          search_articles: chain('Search PubMed articles', 'PubMed', 'search_articles'),
        },
      },
      {
        name: 'bioRxiv',
        type: 'mcp',
        actions: ['search_preprints', 'search_published_articles', 'get_preprint', 'get_categories'],
        chains: {
          search_preprints: chain('Search bioRxiv preprints', 'bioRxiv', 'search_preprints'),
        },
      },
      {
        name: 'Clinical Trials',
        type: 'mcp',
        actions: ['search_trials', 'get_trial_details', 'search_by_eligibility', 'analyze_endpoints'],
        chains: {
          search_trials: chain('Search clinical trials', 'ClinicalTrials', 'search_trials'),
        },
      },
      {
        name: 'Owkin',
        type: 'mcp',
        actions: ['survival_analysis', 'filter_slides', 'list_cohorts', 'list_cell_types'],
        chains: {
          survival_analysis: chain('Run survival analysis', 'Owkin', 'survival_analysis'),
        },
      },
      {
        name: 'Consensus',
        type: 'mcp',
        actions: ['search'],
        chains: {
          search: chain('Search Consensus', 'Consensus', 'search'),
        },
      },
      {
        name: 'Synapse.org',
        type: 'mcp',
        actions: ['search_synapse', 'get_entity', 'get_entity_children', 'get_entity_annotations'],
        chains: {
          search_synapse: chain('Search Synapse', 'Synapse', 'search_synapse'),
        },
      },
    ],
  },

  // ── Productivity ──
  {
    name: 'Productivity',
    emoji: '■',
    color: '#fbbf24',
    connectors: [
      {
        name: 'Notion',
        type: 'mcp',
        actions: ['create_pages', 'search', 'update_page', 'create_database', 'duplicate_page', 'move_pages'],
        chains: {
          create_pages: chain('Create Notion page', 'Notion', 'create_pages'),
        },
      },
      {
        name: 'Asana',
        type: 'mcp',
        actions: ['create_task_preview', 'get_project', 'search_tasks_preview', 'get_portfolio', 'get_status_overview'],
        chains: {
          create_task_preview: chain('Create Asana task', 'Asana', 'create_task_preview'),
        },
      },
      {
        name: 'Google Drive',
        type: 'mcp',
        actions: ['find_and_analyze_files'],
        chains: {
          find_and_analyze_files: chain('Find Drive files', 'Google Drive', 'find_and_analyze_files'),
        },
      },
      {
        name: 'ClickUp',
        type: 'mcp',
        actions: ['clickup_create_task', 'clickup_get_task', 'clickup_update_task', 'clickup_search'],
        chains: {
          clickup_create_task: chain('Create ClickUp task', 'ClickUp', 'clickup_create_task'),
        },
      },
      {
        name: 'Box',
        type: 'mcp',
        actions: ['search_files_keyword', 'search_files_metadata', 'list_folder_content_by_folder_id', 'ai_qa_single_file'],
        chains: {
          search_files_keyword: chain('Search Box files', 'Box', 'search_files_keyword'),
        },
      },
      {
        name: 'Mem',
        type: 'mcp',
        actions: ['create_note', 'search_notes', 'update_note', 'list_notes', 'delete_note'],
        chains: {
          create_note: chain('Create Mem note', 'Mem', 'create_note'),
        },
      },
    ],
  },

  // ── Sales & Marketing ──
  {
    name: 'Sales & Marketing',
    emoji: '■',
    color: '#fb923c',
    connectors: [
      {
        name: 'HubSpot',
        type: 'mcp',
        actions: ['search_crm_objects', 'get_crm_objects', 'get_properties', 'get_user_details'],
        chains: {
          search_crm_objects: chain('Search HubSpot CRM', 'HubSpot', 'search_crm_objects'),
        },
      },
      {
        name: 'Apollo.io',
        type: 'mcp',
        actions: ['apollo_search_people', 'apollo_search_contacts', 'apollo_enrich_person', 'apollo_search_organizations'],
        chains: {
          apollo_search_people: chain('Search Apollo people', 'Apollo', 'apollo_search_people'),
        },
      },
      {
        name: 'Klaviyo',
        type: 'mcp',
        actions: ['create_campaign', 'get_campaigns', 'get_metrics', 'get_events'],
        chains: {
          create_campaign: chain('Create Klaviyo campaign', 'Klaviyo', 'create_campaign'),
        },
      },
      {
        name: 'ZoomInfo',
        type: 'mcp',
        actions: ['search_companies', 'search_contacts', 'enrich_company', 'enrich_contact'],
        chains: {
          search_companies: chain('Search ZoomInfo', 'ZoomInfo', 'search_companies'),
        },
      },
      {
        name: 'Mailchimp',
        type: 'mcp',
        actions: ['campaign_planner', 'create_campaign', 'edit_campaign', 'get_email_themes'],
        chains: {
          create_campaign: chain('Create Mailchimp campaign', 'Mailchimp', 'create_campaign'),
        },
      },
      {
        name: 'Bitly',
        type: 'mcp',
        actions: ['create_short_link', 'expand', 'link_clicks_summary', 'link_metrics', 'update_short_link'],
        chains: {
          create_short_link: chain('Shorten a link', 'Bitly', 'create_short_link'),
        },
      },
    ],
  },

  // ── AI & ML ──
  {
    name: 'AI & ML',
    emoji: '■',
    color: '#8b8d98',
    connectors: [
      {
        name: 'Anthropic Claude',
        type: 'mcp',
        actions: ['create_message', 'count_tokens', 'list_models', 'retrieve_message_batch', 'create_message_batch'],
        chains: {
          create_message: chain('Send a message to Claude', 'Claude', 'create_message'),
          count_tokens: chain('Count tokens', 'Claude', 'count_tokens'),
        },
      },
      {
        name: 'Hugging Face',
        type: 'mcp',
        actions: ['search_models', 'get_model_info', 'run_inference', 'list_datasets', 'search_spaces'],
        chains: {
          search_models: chain('Search HF models', 'Hugging Face', 'search_models'),
          run_inference: chain('Run model inference', 'Hugging Face', 'run_inference'),
        },
      },
      {
        name: 'Weights & Biases',
        type: 'mcp',
        actions: ['log_run', 'get_run', 'list_runs', 'create_sweep', 'get_artifact'],
        chains: {
          list_runs: chain('List W&B runs', 'W&B', 'list_runs'),
        },
      },
      {
        name: 'Replicate',
        type: 'mcp',
        actions: ['create_prediction', 'get_prediction', 'list_models', 'search_models', 'get_model'],
        chains: {
          create_prediction: chain('Run a Replicate prediction', 'Replicate', 'create_prediction'),
        },
      },
      {
        name: 'LangSmith',
        type: 'mcp',
        actions: ['list_runs', 'get_run', 'list_datasets', 'create_dataset', 'get_feedback'],
        chains: {
          list_runs: chain('List LangSmith runs', 'LangSmith', 'list_runs'),
        },
      },
      {
        name: 'Cohere',
        type: 'mcp',
        actions: ['chat', 'embed', 'rerank', 'classify', 'summarize'],
        chains: {
          chat: chain('Chat with Cohere', 'Cohere', 'chat'),
        },
      },
    ],
  },

  // ── Claude Tools ──
  {
    name: 'Claude Tools',
    emoji: '■',
    color: '#da7756',
    connectors: [
      {
        name: 'Claude Code',
        type: 'mcp',
        actions: ['run_command', 'edit_file', 'read_file', 'search_codebase', 'create_commit'],
        chains: {
          run_command: chain('Run a CLI command', 'Claude Code', 'run_command'),
          edit_file: chain('Edit a file', 'Claude Code', 'edit_file'),
        },
      },
      {
        name: 'Claude Desktop',
        type: 'mcp',
        actions: ['create_project', 'list_conversations', 'search_conversations', 'get_artifacts', 'export_artifact'],
        chains: {
          create_project: chain('Create a Claude project', 'Claude Desktop', 'create_project'),
        },
      },
      {
        name: 'Anthropic Console',
        type: 'mcp',
        actions: ['list_api_keys', 'get_usage', 'get_rate_limits', 'list_workspaces', 'get_billing'],
        chains: {
          get_usage: chain('Get API usage', 'Console', 'get_usage'),
          get_rate_limits: chain('Check rate limits', 'Console', 'get_rate_limits'),
        },
      },
      {
        name: 'Claude MCP Registry',
        type: 'mcp',
        actions: ['search_servers', 'get_server_info', 'list_categories', 'get_install_config', 'verify_server'],
        chains: {
          search_servers: chain('Search MCP servers', 'MCP Registry', 'search_servers'),
        },
      },
      {
        name: 'Claude Prompt Cache',
        type: 'mcp',
        actions: ['create_cached_prompt', 'list_cached_prompts', 'get_cache_stats', 'invalidate_cache'],
        chains: {
          create_cached_prompt: chain('Cache a prompt', 'Prompt Cache', 'create_cached_prompt'),
        },
      },
    ],
  },
]
