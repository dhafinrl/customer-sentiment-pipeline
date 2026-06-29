CREATE TABLE customer_reviews (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100),
    raw_review TEXT,
    sentiment VARCHAR(10),
    confidence NUMERIC(3,2),
    category VARCHAR(20),
    escalated BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
