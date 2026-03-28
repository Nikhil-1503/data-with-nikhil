import { Article } from "../articles";

export const medallionArchitectureGuide: Article = {
  id: "medallion-architecture-guide",
  title: "Building a Medallion Architecture with Azure Data Factory and Delta Lake",
  description: "A practical guide to implementing Bronze, Silver, and Gold layers using ADF pipelines and Delta Lake on Azure Databricks.",
  tags: ["Azure Data Factory", "Delta Lake", "Architecture"],
  readingTime: 18,
  difficulty: 'Beginner',
  date: "2024-10-28",
  author: "Nikhil Shanbhag",
  featured: true,
  content: [
    { type: "heading", level: 2, text: "What is Medallion Architecture?" },
    { type: "paragraph", text: "The Medallion Architecture is a data design pattern used to logically organize data in a lakehouse. It progressively improves data quality as it flows through three distinct layers: Bronze (raw), Silver (cleaned), and Gold (business-ready)." },
    { type: "callout", calloutType: "takeaway", text: "The Medallion Architecture ensures data quality improves progressively through each layer, making debugging easier and enabling reprocessing from any point." },
    { type: "heading", level: 2, text: "Bronze Layer: Raw Ingestion" },
    { type: "paragraph", text: "The Bronze layer is the landing zone for all raw data. We preserve the original data exactly as received, adding only metadata columns for lineage tracking." },
    { type: "code", language: "python", text: "# Bronze layer ingestion with Delta Lake\nfrom delta.tables import DeltaTable\nfrom pyspark.sql import functions as F\n\ndef ingest_to_bronze(source_path, bronze_path, source_name):\n    raw_df = (\n        spark.read\n        .format('parquet')\n        .load(source_path)\n        .withColumn('_ingested_at', F.current_timestamp())\n        .withColumn('_source_file', F.input_file_name())\n        .withColumn('_source_system', F.lit(source_name))\n    )\n    \n    raw_df.write \\\n        .format('delta') \\\n        .mode('append') \\\n        .partitionBy('_ingested_date') \\\n        .save(bronze_path)" },
    { type: "heading", level: 2, text: "Silver Layer: Cleansed & Conformed" },
    { type: "paragraph", text: "The Silver layer applies schema enforcement, data type casting, deduplication, and basic business rules. This is where most data quality issues are caught and handled." },
    { type: "code", language: "sql", text: "-- Silver layer: Deduplicate and apply quality rules\nMERGE INTO silver.customers AS target\nUSING (\n    SELECT *, \n        ROW_NUMBER() OVER (\n            PARTITION BY customer_id \n            ORDER BY _ingested_at DESC\n        ) AS rn\n    FROM bronze.customers\n    WHERE _ingested_at > '{last_processed}'\n) AS source\nON target.customer_id = source.customer_id\n    AND source.rn = 1\nWHEN MATCHED THEN UPDATE SET *\nWHEN NOT MATCHED AND source.rn = 1 THEN INSERT *" },
    { type: "heading", level: 2, text: "Gold Layer: Business Aggregates" },
    { type: "paragraph", text: "The Gold layer contains business-ready aggregations and metrics. These tables are optimized for specific use cases: dashboards, ML features, or API serving." },
    { type: "callout", calloutType: "usecase", text: "A retail analytics team used this architecture to reduce their report generation time from 45 minutes to 3 minutes by pre-computing Gold-layer aggregates during off-peak hours." },
    { type: "callout", calloutType: "interview", text: "Q: Explain the difference between Bronze, Silver, and Gold layers.\n\nA: Bronze stores raw, unprocessed data exactly as ingested. Silver applies cleaning, deduplication, and schema enforcement. Gold contains business-level aggregations optimized for consumption. Each layer serves as a checkpoint for data quality and enables reprocessing." }
  ]
};