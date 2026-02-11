# 🔐 Identificação de Tipo de Usuário

## Como Funciona

O sistema identifica o tipo de usuário (admin, profissional ou paciente) através de uma busca sequencial no banco de dados:

1. **Login** → Supabase autentica via email/senha
2. **loadCurrentUser()** → Busca o perfil na seguinte ordem:
   - Procura em `admins` → se encontrar, `role = 'admin'`
   - Procura em `professionals` → se encontrar, `role = 'professional'`
   - Procura em `patients` → se encontrar, `role = 'patient'`

3. **Redirecionamento automático**:
   - Admin → `/dashboard`
   - Paciente → `/portal/dashboard`
   - Profissional → `/dashboard` (pode ter interface diferente se configurado)

---

## 📋 Estrutura no Supabase

Cada tabela tem uma coluna `role` que identifica o tipo de usuário:

### Tabela `admins`

```
id (uuid)
name (text)
email (text) - única
password (text, opcional)
role (text) = 'admin'
avatar (text, opcional)
specialty (text, opcional)
created_at (timestamp)
```

### Tabela `professionals`

```
id (uuid)
name (text)
email (text) - única
phone (text)
specialty (text)
registration_number (text) - CRM/CRO
color (text) - para exibição no calendário
avatar (text, opcional)
role (text) = 'professional'
working_hours (jsonb) - array de horários
created_at (timestamp)
```

### Tabela `patients`

```
id (uuid)
name (text)
email (text) - única
phone (text)
birth_date (date)
cpf (text, opcional)
address (text, opcional)
notes (text, opcional)
role (text) = 'patient'
created_at (timestamp)
```

---

## 🔧 Passo a Passo: Criar o Admin Manualmente

### 1. Criar usuário no Authentication (Supabase)

1. Vá para **Authentication → Users**
2. Clique em **"Add user"**
3. Preencha:
   - **Email**: `admin` (ou email desejado)
   - **Password**: Sua senha forte
   - **Auto send invitation**: desmarcar
4. Clique **"Create user"**
5. **Copie o UUID do usuário criado**

### 2. Inserir perfil na tabela `admins`

1. Vá para **SQL Editor** no Supabase
2. Execute:

```sql
INSERT INTO admins (id, name, email, role, created_at)
VALUES (
  'UUID_COPIADO_ACIMA',
  'Administrador',
  'admin',
  'admin',
  NOW()
);
```

### 3. Pronto!

Agora pode fazer login com:

- **Email**: `admin`
- **Senha**: A que você criou
- **Redirecionamento**: Automaticamente para `/dashboard`

---

## 🚀 Criação de Usuários Automática

Quando um **paciente se registra** via `/cadastro/paciente`:

1. Sistema cria Auth user no Supabase
2. Sistema insere na tabela `patients` com `role = 'patient'`
3. Ao fazer login, `loadCurrentUser()` encontra em `patients`

Quando um **profissional é criado pelo ADM** via `/usuarios`:

1. ADM preenche: nome, email, senha, especialidade
2. Sistema cria Auth user no Supabase
3. Sistema insere na tabela `professionals` com `role = 'professional'`
4. Profissional faz login e é redirecionado para `/dashboard`

---

## 🔍 Verificar Role Atual

No aplicativo, pode-se verificar a role assim:

```tsx
import { useClinic } from "@/contexts/ClinicContext";

export default function MyComponent() {
  const { currentUser } = useClinic();

  if (!currentUser) return <div>Carregando...</div>;

  return (
    <div>
      {currentUser.role === "admin" && <p>Você é ADM</p>}
      {currentUser.role === "patient" && <p>Você é paciente</p>}
      {currentUser.role === "professional" && <p>Você é profissional</p>}
    </div>
  );
}
```

---

## ⚠️ O que fazer agora?

1. **No Supabase**, adicione a coluna `role` em cada tabela:

   ```sql
   ALTER TABLE admins ADD COLUMN role TEXT DEFAULT 'admin';
   ALTER TABLE professionals ADD COLUMN role TEXT DEFAULT 'professional';
   ALTER TABLE patients ADD COLUMN role TEXT DEFAULT 'patient';
   ```

2. **Crie o admin** seguindo "Passo a Passo" acima

3. **Teste o fluxo**:
   - Login como `admin` → deve ir para `/dashboard`
   - Cadastre um paciente → login automático → deve ir para `/portal/dashboard`
   - ADM cria profissional em `/usuarios` → profissional faz login → deve ir para `/dashboard`
