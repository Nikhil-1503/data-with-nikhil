import { Article } from "../articles";

export const pysparkTestingStrategies: Article = {
  id: "pyspark-testing-strategies",
  title: "Testing PySpark Applications: Unit Tests to Integration Tests",
  description: "Comprehensive guide to testing PySpark code with pytest, including DataFrame comparisons, mock data generation, and CI/CD integration.",
  tags: ["PySpark", "Testing", "Python"],
  readingTime: 13,
  date: "2024-08-22",
  difficulty: 'Intermediate',
  author: "Nikhil Shanbhag",
  featured: false,
  content: [
    { type: "heading", level: 2, text: "Why Test Spark Code?" },
    { type: "paragraph", text: "Data pipeline bugs are expensive. A malformed transformation can silently corrupt downstream analytics for days before anyone notices. Automated tests catch these issues before deployment." },
    { type: "callout", calloutType: "takeaway", text: "Test your transformations, not Spark itself. Focus on business logic validation — schema checks, null handling, edge cases in calculations, and data type casting." },
    { type: "heading", level: 2, text: "Setting Up pytest with PySpark" },
    { type: "code", language: "python", text: "import pytest\nfrom pyspark.sql import SparkSession\nfrom pyspark.sql import functions as F\n\n@pytest.fixture(scope='session')\ndef spark():\n    \"\"\"Create a SparkSession for testing.\"\"\"\n    return (\n        SparkSession.builder\n        .master('local[2]')\n        .appName('unit-tests')\n        .config('spark.sql.shuffle.partitions', '2')\n        .getOrCreate()\n    )\n\n@pytest.fixture\ndef sample_orders(spark):\n    \"\"\"Generate sample order data.\"\"\"\n    data = [\n        (1, 'A', 100.0, '2024-01-01'),\n        (2, 'B', 200.0, '2024-01-01'),\n        (3, 'A', 150.0, '2024-01-02'),\n        (4, 'A', None, '2024-01-02'),  # Edge case: null amount\n    ]\n    return spark.createDataFrame(\n        data, ['order_id', 'customer_id', 'amount', 'order_date']\n    )" },
    { type: "heading", level: 2, text: "Testing Transformations" },
    { type: "code", language: "python", text: "def test_daily_revenue_excludes_nulls(spark, sample_orders):\n    \"\"\"Verify null amounts are excluded from revenue.\"\"\"\n    result = calculate_daily_revenue(sample_orders)\n    \n    row = result.filter(F.col('order_date') == '2024-01-02').first()\n    assert row['total_revenue'] == 150.0  # Only non-null amount\n    assert row['order_count'] == 1        # Null orders excluded\n\ndef test_schema_matches_expected(spark, sample_orders):\n    \"\"\"Ensure output schema is correct.\"\"\"\n    result = calculate_daily_revenue(sample_orders)\n    expected_cols = {'order_date', 'total_revenue', 'order_count'}\n    assert set(result.columns) == expected_cols" },
    { type: "callout", calloutType: "interview", text: "Q: How do you ensure data quality in your pipelines?\n\nA: Three layers: (1) Unit tests for transformation logic using pytest + local Spark. (2) Data quality checks at runtime using Great Expectations or custom assertions. (3) Monitoring with row count trends, null rate alerts, and freshness checks on downstream tables." }
  ]
};