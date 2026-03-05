-- Secure Document Vault: Create lease_documents table
-- Run this SQL in your Supabase SQL Editor to enable the document vault feature

-- Create the lease_documents table for storing multiple documents per lease
CREATE TABLE IF NOT EXISTS lease_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE lease_documents ENABLE ROW LEVEL SECURITY;

-- Create policy for users to access only their own documents
CREATE POLICY "Users can manage their own vault documents"
ON lease_documents
FOR ALL
USING (auth.uid()::text = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_lease_documents_lease_id ON lease_documents(lease_id);
CREATE INDEX IF NOT EXISTS idx_lease_documents_user_id ON lease_documents(user_id);
