import os
import pandas as pd
import psycopg2

# Load first 10 rows from Excel
df = pd.read_excel(r'C:\Users\alexi\Downloads\IT_TroubleTickets.xlsx', nrows=10)

# Connect to Neon Postgres using env variable
conn = psycopg2.connect(os.getenv('DATABASE_URL'))
cursor = conn.cursor()

# Insert each row
for _, row in df.iterrows():
    cursor.execute(
        """
        INSERT INTO tickets (
            ticket_no, period, ticket_type, date_created, date_closed,
            status, ext_support, problem_id, requestor, severity,
            shop, floor, area_corner, problem_type, hardware,
            hardware_vendor, software, resolver, description
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            row['ticket_no'], row['period'], row['ticket_type'], row['date_created'], row['date_closed'],
            row['status'], row['ext_support'], row['problem_id'], row['requestor'], row['severity'],
            row['shop'], row['floor'], row['area_corner'], row['problem_type'], row['hardware'],
            row['hardware_vendor'], row['software'], row['resolver'], row['description']
        )
    )

conn.commit()
cursor.close()
conn.close()

print("✅ Inserted 10 rows into tickets table!")
