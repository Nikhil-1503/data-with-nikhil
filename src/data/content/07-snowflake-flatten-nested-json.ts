import { Article } from "../articles";

export const snowflakeFlattenNestedJson: Article = {
  id: "snowflake-flatten-nested-json",
  title: "Mastering Snowflake FLATTEN for Nested JSON (With Twitter Example)",
  description: "Learn how to use LATERAL FLATTEN in Snowflake to process nested JSON, avoid data explosion, and build real-world data pipelines.",
  tags: ["Snowflake", "SQL", "Data Engineering"],
  readingTime: 12,
  date: "2026-03-29",
  difficulty: "Intermediate",
  author: "Nikhil Shanbhag",
  featured: true,

  content: [
    {
      type: "heading",
      level: 2,
      text: "Introduction"
    },
    {
      type: "paragraph",
      text: "Modern data pipelines ingest deeply nested JSON from APIs like Twitter, logs, and event streams. Snowflake’s FLATTEN function allows you to transform this semi-structured data into structured, queryable tables."
    },

    {
      type: "heading",
      level: 2,
      text: "JSON to Table Transformation"
    },
    {
      type: "image",
      src: "/images/flatten/json-to-table.png",
      caption: "Transforming nested JSON into structured rows using LATERAL FLATTEN"
    },

    {
      type: "heading",
      level: 2,
      text: "Sample Twitter JSON"
    },
    {
      type: "code",
      language: "json",
      text: `{
  "id": 123,
  "text": "Learning Snowflake!",
  "entities": {
    "hashtags": [
      { "text": "Snowflake" },
      { "text": "DataEngineering" }
    ],
    "urls": [
      { "url": "https://example.com" }
    ]
  }
}`
    },

    {
      type: "heading",
      level: 2,
      text: "Basic Flatten Example"
    },
    {
      type: "code",
      language: "sql",
      text: `SELECT 
  f.value:url::STRING AS url
FROM tweet_ingest,
LATERAL FLATTEN(input => raw_status:entities:urls) f;`
    },

    {
      type: "heading",
      level: 2,
      text: "Flattening Multiple Arrays"
    },
    {
      type: "code",
      language: "sql",
      text: `SELECT 
  h.value:text::STRING AS hashtag,
  u.value:url::STRING AS url
FROM tweet_ingest,
LATERAL FLATTEN(input => raw_status:entities:hashtags) h,
LATERAL FLATTEN(input => raw_status:entities:urls) u;`
    },

    {
      type: "heading",
      level: 2,
      text: "Data Explosion Problem"
    },
    {
      type: "image",
      src: "/images/flatten/data-explosion.png",
      caption: "Flattening multiple arrays can lead to Cartesian explosion (hashtags × URLs)"
    },
    {
      type: "callout",
      calloutType: "takeaway",
      text: "Flattening multiple independent arrays without hierarchy can lead to massive data duplication due to Cartesian joins."
    },

    {
      type: "heading",
      level: 2,
      text: "Solution: Flatten Separately"
    },
    {
      type: "code",
      language: "sql",
      text: `-- Extract hashtags
SELECT 
  raw_status:id::NUMBER AS tweet_id,
  h.value:text::STRING AS hashtag
FROM tweet_ingest,
LATERAL FLATTEN(input => raw_status:entities:hashtags) h;

-- Extract URLs
SELECT 
  raw_status:id::NUMBER AS tweet_id,
  u.value:url::STRING AS url
FROM tweet_ingest,
LATERAL FLATTEN(input => raw_status:entities:urls) u;`
    },

    {
      type: "heading",
      level: 2,
      text: "Filter Before Flatten (Performance Optimization)"
    },
    {
      type: "image",
      src: "/images/flatten/filter-before-flatten.png",
      caption: "Filtering data before flattening significantly improves performance"
    },
    {
      type: "code",
      language: "sql",
      text: `SELECT *
FROM tweet_ingest
WHERE raw_status:user:name = 'Nikhil',
LATERAL FLATTEN(input => raw_status:entities:hashtags);`
    },
    {
      type: "callout",
      calloutType: "takeaway",
      text: "Always filter before flattening to reduce data volume and improve query performance."
    },

    {
      type: "heading",
      level: 2,
      text: "Handling NULL Arrays"
    },
    {
      type: "code",
      language: "sql",
      text: `SELECT 
  raw_status:id,
  f.value
FROM tweet_ingest,
LATERAL FLATTEN(
  input => raw_status:entities:urls,
  OUTER => TRUE
) f;`
    },

    {
      type: "heading",
      level: 2,
      text: "Rebuilding JSON After Flatten"
    },
    {
      type: "image",
      src: "/images/flatten/rebuild-json.png",
      caption: "Using ARRAY_AGG to reconstruct JSON arrays after flattening"
    },
    {
      type: "code",
      language: "sql",
      text: `SELECT 
  raw_status:id,
  ARRAY_AGG(h.value:text::STRING) AS hashtags
FROM tweet_ingest,
LATERAL FLATTEN(input => raw_status:entities:hashtags) h
GROUP BY raw_status:id;`
    },

    {
      type: "heading",
      level: 2,
      text: "Real-World Pipeline"
    },
    {
      type: "image",
      src: "/images/flatten/pipeline.png",
      caption: "ADF / Kafka → Snowflake → FLATTEN → Analytics"
    },
    {
      type: "paragraph",
      text: "In production pipelines, JSON data is ingested via streaming or batch tools, stored in Snowflake as VARIANT, and then flattened into structured tables for downstream analytics."
    },

    {
      type: "heading",
      level: 2,
      text: "Interview Insight"
    },
    {
      type: "callout",
      calloutType: "interview",
      text: "Q: How do you handle nested JSON in Snowflake?\n\nA: I use LATERAL FLATTEN to normalize arrays, chain multiple flatten operations for multi-level JSON, apply filters before flattening for performance, and handle nulls using OUTER => TRUE."
    },

    {
      type: "heading",
      level: 2,
      text: "Conclusion"
    },
    {
      type: "paragraph",
      text: "Mastering FLATTEN in Snowflake enables you to efficiently process nested JSON, avoid data explosion, and design scalable data pipelines."
    }
  ]
};