-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    username VARCHAR(64) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    timezone VARCHAR(32) DEFAULT 'Asia/Shanghai',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 事件主表（按 start_time 范围分区）
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY,
    type VARCHAR(16) NOT NULL,
    title VARCHAR(128) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    all_day BOOLEAN DEFAULT false,
    color VARCHAR(16),
    created_by UUID REFERENCES users(id),
    calendar_id UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    participants UUID[],
    location VARCHAR(128),
    completed BOOLEAN,
    due TIMESTAMPTZ,
    streak INT,
    route TEXT,
    transport VARCHAR(16),
    fields JSONB,
    master_event_id UUID,
    repeat_rule JSONB
) PARTITION BY RANGE (start_time);

-- 示例分区
CREATE TABLE IF NOT EXISTS events_2024 PARTITION OF events
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- OAuth 客户端
CREATE TABLE IF NOT EXISTS oauth_clients (
    id UUID PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    secret TEXT NOT NULL,
    redirect_uri TEXT NOT NULL,
    scopes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- OAuth Token
CREATE TABLE IF NOT EXISTS oauth_tokens (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    client_id UUID REFERENCES oauth_clients(id),
    scope TEXT,
    token TEXT NOT NULL,
    expires_at TIMESTAMPTZ,
    revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events (start_time);
CREATE INDEX IF NOT EXISTS idx_events_type ON events (type);
CREATE INDEX IF NOT EXISTS idx_events_calendar_id ON events (calendar_id);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events (created_by);
CREATE INDEX IF NOT EXISTS idx_events_repeat_rule ON events USING GIN (repeat_rule);
CREATE INDEX IF NOT EXISTS idx_events_fields ON events USING GIN (fields); 