import { Article } from "../articles";

export const sqlWindowFunctionsMastery: Article = {
  id: "sql-window-functions-mastery",
  title: "SQL Window Functions: From Basics to Advanced Analytics",
  description: "Master SQL window functions with practical examples — running totals, ranking, lead/lag analysis, and session detection.",
  tags: ["SQL", "Analytics"],
  readingTime: 15,
  difficulty: 'Beginner',
  date: "2024-10-10",
  author: "Nikhil Shanbhag",
  featured: true,
  content: [
    { type: "heading", level: 2, text: "Why Window Functions?" },
    { type: "paragraph", text: "Window functions perform calculations across a set of rows related to the current row, without collapsing the result set like GROUP BY. They're essential for analytics, ranking, and time-series analysis." },
    { type: "callout", calloutType: "takeaway", text: "Window functions let you compute aggregates while keeping individual row detail — something GROUP BY cannot do. This makes them indispensable for analytics engineering." },
    { type: "heading", level: 2, text: "Running Totals and Moving Averages" },
    { type: "code", language: "sql", text: "-- Running total of daily revenue\nSELECT \n    order_date,\n    daily_revenue,\n    SUM(daily_revenue) OVER (\n        ORDER BY order_date\n        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS running_total,\n    AVG(daily_revenue) OVER (\n        ORDER BY order_date\n        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\n    ) AS moving_avg_7d\nFROM daily_sales\nORDER BY order_date;" },
    { type: "heading", level: 2, text: "Session Detection with Lead/Lag" },
    { type: "paragraph", text: "One powerful application is detecting user sessions from event streams. A new session starts when the gap between events exceeds a threshold." },
    { type: "code", language: "sql", text: "-- Detect sessions with 30-minute inactivity threshold\nWITH event_gaps AS (\n    SELECT\n        user_id,\n        event_timestamp,\n        LAG(event_timestamp) OVER (\n            PARTITION BY user_id\n            ORDER BY event_timestamp\n        ) AS prev_event,\n        DATEDIFF(\n            MINUTE,\n            LAG(event_timestamp) OVER (\n                PARTITION BY user_id\n                ORDER BY event_timestamp\n            ),\n            event_timestamp\n        ) AS gap_minutes\n    FROM user_events\n)\nSELECT\n    user_id,\n    event_timestamp,\n    SUM(CASE WHEN gap_minutes > 30 OR gap_minutes IS NULL THEN 1 ELSE 0 END)\n        OVER (PARTITION BY user_id ORDER BY event_timestamp) AS session_id\nFROM event_gaps;" },
    { type: "callout", calloutType: "interview", text: "Q: What's the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?\n\nA: ROW_NUMBER() assigns unique sequential numbers. RANK() assigns the same rank to ties but skips numbers (1,2,2,4). DENSE_RANK() assigns the same rank to ties without gaps (1,2,2,3). Use ROW_NUMBER for deduplication, RANK/DENSE_RANK for leaderboards." }
  ]
};