# Criar usuários da imobiliária pelo terminal

URL do backend: `https://efdivpfbjplbvgjmlgnf.supabase.co`
Chave pública (pode ficar no terminal/código): `sb_publishable_w8GLiOt1yz02ATsQcz9DJw_acglvQ_P`

> A chave de serviço (service role) não é acessível no Lovable Cloud, então a criação
> é feita em 2 passos: (1) cria a conta pelo endpoint público de signup, (2) concede
> o papel `admin` via SQL.

## 1) Criar a conta (terminal)

```bash
export SB_URL="https://efdivpfbjplbvgjmlgnf.supabase.co"
export SB_KEY="sb_publishable_w8GLiOt1yz02ATsQcz9DJw_acglvQ_P"

EMAIL="corretor@imobiliaria.com"
SENHA="SenhaForte123!"

curl -s -X POST "$SB_URL/auth/v1/signup" \
  -H "apikey: $SB_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$SENHA\"}"
```

Se a confirmação de e-mail estiver ativa, a pessoa precisa confirmar pelo link
recebido antes de conseguir entrar.

## 2) Conceder o papel de admin (SQL)

Rode no SQL do backend (ou peça para mim rodar):

```sql
insert into public.user_roles (user_id, role)
select id, 'admin'::app_role
from auth.users
where email = 'corretor@imobiliaria.com'
on conflict (user_id, role) do nothing;
```

## Conferir quem é admin

```sql
select u.email, r.role, u.email_confirmed_at
from auth.users u
join public.user_roles r on r.user_id = u.id
order by u.created_at;
```

## Remover o acesso de alguém

```sql
delete from public.user_roles
where user_id = (select id from auth.users where email = 'corretor@imobiliaria.com');
```

## Redefinir senha por e-mail

```bash
curl -s -X POST "$SB_URL/auth/v1/recover" \
  -H "apikey: $SB_KEY" -H "Content-Type: application/json" \
  -d '{"email":"corretor@imobiliaria.com"}'
```
