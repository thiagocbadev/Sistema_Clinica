-- Desabilitar RLS na tabela services para permitir operações
ALTER TABLE services DISABLE ROW LEVEL SECURITY;

-- Verificar status
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'services';
