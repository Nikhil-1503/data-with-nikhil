import { Article } from "../articles";

export const sparkShuffleOptimization: Article = {
  id: "spark-shuffle-optimization",
  title: "Reducing Spark Shuffle Write by 42% with Custom Partitioning",
  description: "Deep dive into PySpark partitioning strategies that dramatically reduce shuffle overhead in large-scale ETL pipelines.",
  tags: ["PySpark", "Performance", "ETL"],
  readingTime: 12,
  difficulty: 'Beginner',
  date: "2024-11-15",
  author: "Nikhil Shanbhag",
  featured: true,
  content: [
    { type: "heading", level: 2, text: "The Shuffle Problem" },
    { type: "paragraph", text: "In distributed computing, shuffle operations are the most expensive part of any Spark job. When data needs to be redistributed across partitions — for joins, aggregations, or sorts — Spark must serialize, transfer, and deserialize massive amounts of data across the network." },
    { type: "paragraph", text: "In our production pipeline processing 2TB daily, shuffle write was consuming 68% of total job time. By implementing custom partitioning, we reduced this to 26%." },
    { type: "callout", calloutType: "takeaway", text: "Shuffle operations account for up to 70% of Spark job execution time. Custom partitioning can reduce this dramatically by co-locating related data." },
    { type: "heading", level: 2, text: "Understanding Partition Skew" },
    { type: "paragraph", text: "Before optimizing, we need to diagnose. Partition skew occurs when data is unevenly distributed across partitions, causing some tasks to process significantly more data than others." },
    { type: "code", language: "python", text: "from pyspark.sql import functions as F\n\n# Diagnose partition skew\ndef analyze_skew(df, partition_col):\n    return (\n        df.groupBy(partition_col)\n        .agg(\n            F.count('*').alias('row_count'),\n            F.sum(F.length(F.col('payload'))).alias('data_size')\n        )\n        .select(\n            F.min('row_count').alias('min_rows'),\n            F.max('row_count').alias('max_rows'),\n            F.avg('row_count').alias('avg_rows'),\n            F.stddev('row_count').alias('stddev_rows')\n        )\n    )\n\nskew_stats = analyze_skew(raw_df, 'customer_id')\nskew_stats.show()" },
    { type: "heading", level: 2, text: "Custom Partitioner Implementation" },
    { type: "paragraph", text: "The default HashPartitioner often creates imbalanced partitions when key distributions are skewed. We implemented a custom range-based partitioner that accounts for data density." },
    { type: "code", language: "python", text: "from pyspark.sql import Window\n\ndef balanced_repartition(df, num_partitions, key_col):\n    \"\"\"Repartition with balanced data distribution.\"\"\"\n    # Calculate quantile boundaries\n    w = Window.orderBy(key_col)\n    df_ranked = df.withColumn(\n        'partition_id',\n        F.ntile(num_partitions).over(w)\n    )\n    \n    return df_ranked.repartition(\n        num_partitions, \n        'partition_id'\n    ).drop('partition_id')\n\n# Apply balanced repartitioning\noptimized_df = balanced_repartition(\n    raw_df, \n    num_partitions=200, \n    key_col='customer_id'\n)" },
    { type: "callout", calloutType: "usecase", text: "At a fintech company processing 50M transactions daily, this approach reduced the nightly batch job from 4.2 hours to 2.4 hours, saving $1,200/month in cluster costs." },
    { type: "heading", level: 2, text: "Measuring Results" },
    { type: "paragraph", text: "After implementing custom partitioning across our three main ETL pipelines:" },
    { type: "list", items: [
      "Shuffle write reduced from 1.8TB to 1.04TB (42% reduction)",
      "Job completion time decreased from 3.1 hours to 1.9 hours",
      "Executor memory pressure dropped by 35%",
      "Spill-to-disk events eliminated entirely"
    ]},
    { type: "callout", calloutType: "interview", text: "Q: How would you optimize a Spark job that's spending most of its time on shuffle operations?\n\nA: First, diagnose with the Spark UI — check shuffle read/write metrics and partition sizes. Then consider: (1) pre-partitioning data by join keys, (2) broadcast joins for small tables, (3) salting skewed keys, (4) custom partitioners for known distributions." },
    { type: "heading", level: 2, text: "Key Optimization Checklist" },
    { type: "list", items: [
      "Profile your shuffle metrics before optimizing",
      "Check for partition skew using stddev analysis",
      "Consider broadcast joins for tables < 10MB",
      "Use salting for heavily skewed keys",
      "Set spark.sql.shuffle.partitions based on data volume",
      "Monitor with Spark UI after changes"
    ]}
  ]
};