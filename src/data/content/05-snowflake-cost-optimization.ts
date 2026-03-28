import { Article } from "../articles";

export const snowflakeCostOptimization: Article = {
  id: "snowflake-cost-optimization",
  title: "Snowflake Cost Optimization: Warehouse Sizing and Query Tuning",
  description: "Practical strategies to reduce Snowflake costs by 40% through warehouse right-sizing, clustering keys, and query optimization.",
  tags: ["Snowflake", "SQL", "Performance"],
  readingTime: 11,
  difficulty: 'Intermediate',
  date: "2024-09-05",
  author: 'Nikhil Shanbhag',
  featured: false,
  content: [
    { type: "heading", level: 2, text: "Understanding Snowflake Credits" },
    { type: "paragraph", text: "Snowflake pricing is based on compute credits and storage. The biggest cost driver is virtual warehouse usage — and most teams drastically over-provision their warehouses." },
    { type: "callout", calloutType: "takeaway", text: "70% of Snowflake cost optimization comes from right-sizing warehouses and implementing auto-suspend. Start with X-Small and scale up only when query performance requires it." },
    { type: "heading", level: 2, text: "Warehouse Right-Sizing" },
    { type: "code", language: "sql", text: "-- Analyze warehouse utilization\nSELECT\n    warehouse_name,\n    AVG(avg_running) AS avg_queries_running,\n    AVG(avg_queued_load) AS avg_queued,\n    SUM(credits_used) AS total_credits,\n    COUNT(DISTINCT DATE_TRUNC('day', start_time)) AS active_days,\n    SUM(credits_used) / COUNT(DISTINCT DATE_TRUNC('day', start_time)) \n        AS credits_per_day\nFROM snowflake.account_usage.warehouse_metering_history\nWHERE start_time > DATEADD('day', -30, CURRENT_TIMESTAMP())\nGROUP BY warehouse_name\nORDER BY total_credits DESC;" },
    { type: "heading", level: 2, text: "Clustering Keys for Large Tables" },
    { type: "paragraph", text: "For tables exceeding 1TB, clustering keys can dramatically improve query performance by reducing micro-partition scanning." },
    { type: "code", language: "sql", text: "-- Add clustering key on frequently filtered columns\nALTER TABLE analytics.fact_events\n    CLUSTER BY (event_date, event_type);\n\n-- Monitor clustering quality\nSELECT SYSTEM$CLUSTERING_INFORMATION(\n    'analytics.fact_events', \n    '(event_date, event_type)'\n);" },
    { type: "callout", calloutType: "usecase", text: "A SaaS company reduced their monthly Snowflake bill from $12,000 to $7,200 by implementing auto-suspend (60s), right-sizing warehouses, and adding clustering keys to their three largest fact tables." }
  ]
};