import { Article } from "../articles";

export const airflowBestPractices: Article = {
  id: "airflow-best-practices",
  title: "Apache Airflow: DAG Design Patterns for Production Pipelines",
  description: "Battle-tested patterns for building reliable, maintainable Airflow DAGs including error handling, idempotency, and dynamic task generation.",
  tags: ["Airflow", "Orchestration", "Python"],
  readingTime: 14,
  difficulty: 'Intermediate',
  date: "2024-09-20",
  author: "Nikhil Shanbhag",
  featured: false,
  content: [
    { type: "heading", level: 2, text: "Idempotent DAG Design" },
    { type: "paragraph", text: "Every production DAG must be idempotent — running it multiple times with the same inputs should produce the same output. This is crucial for retry logic and backfill operations." },
    { type: "code", language: "python", text: "from airflow.decorators import dag, task\nfrom datetime import datetime\n\n@dag(\n    schedule='@daily',\n    start_date=datetime(2024, 1, 1),\n    catchup=False,\n    tags=['production', 'etl'],\n    default_args={\n        'retries': 3,\n        'retry_delay': timedelta(minutes=5),\n    }\n)\ndef daily_pipeline():\n    \n    @task\n    def extract(execution_date=None):\n        \"\"\"Idempotent extract: always reads the same date partition.\"\"\"\n        date_str = execution_date.strftime('%Y-%m-%d')\n        return read_partition(f's3://raw/{date_str}/')\n    \n    @task\n    def transform(data):\n        \"\"\"Pure function: same input always produces same output.\"\"\"\n        return apply_business_rules(data)\n    \n    @task\n    def load(data, execution_date=None):\n        \"\"\"Idempotent load: overwrites the target partition.\"\"\"\n        date_str = execution_date.strftime('%Y-%m-%d')\n        write_partition(data, f's3://processed/{date_str}/', mode='overwrite')\n\n    raw = extract()\n    cleaned = transform(raw)\n    load(cleaned)" },
    { type: "callout", calloutType: "takeaway", text: "The three pillars of production Airflow: Idempotency (safe retries), Atomicity (all-or-nothing tasks), and Observability (comprehensive logging and alerting)." },
    { type: "heading", level: 2, text: "Dynamic Task Generation" },
    { type: "paragraph", text: "When you need to process multiple tables or sources with the same logic, dynamic task generation keeps your DAGs DRY." },
    { type: "code", language: "python", text: "TABLES = ['users', 'orders', 'products', 'inventory']\n\nfor table in TABLES:\n    extract = PythonOperator(\n        task_id=f'extract_{table}',\n        python_callable=extract_table,\n        op_kwargs={'table_name': table},\n    )\n    \n    load = PythonOperator(\n        task_id=f'load_{table}',\n        python_callable=load_table,\n        op_kwargs={'table_name': table},\n    )\n    \n    extract >> load" },
    { type: "callout", calloutType: "interview", text: "Q: How do you handle failures in Airflow DAGs?\n\nA: Use retries with exponential backoff for transient errors. Implement on_failure_callback for alerting. Design tasks to be idempotent so retries are safe. Use task-level SLAs to detect slow runs. For critical pipelines, add sensor tasks that verify upstream data availability before processing." }
  ]
};