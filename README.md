# 🏦 Payment API — Backend NestJS  
_Proyecto Full‑Stack de prueba_

![Nest & PostgreSQL](https://img.shields.io/badge/NestJS-v10-E0234E?logo=nestjs)
![Postgres](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)
![Docker Compose](https://img.shields.io/badge/Docker-Compose-1.29-blue?logo=docker)

---

## Índice
1. [Arquitectura](#arquitectura)  
2. [Estructura de carpetas](#estructura-de-carpetas)  
3. [Requisitos previos](#requisitos-previos)  
4. [Configuración rápida](#configuración-rápida)  
5. [Arranque en Docker](#arranque-en-docker)  
6. [Flujo de pago](#flujo-de-pago)  
7. [Colección cURL / Postman](#colección-curl--postman)  
8. [Tareas npm](#tareas-npm)  
9. [Migraciones y seeds](#migraciones-y-seeds)  
10. [Pruebas y calidad](#pruebas-y-calidad)  
11. [Licencia](#licencia)

---

## Arquitectura

```mermaid
flowchart LR
    subgraph Hexagonal
        A[Controllers] -->|DTO| B(Use Cases)
        B -->|Ports| C{{Repositorios}}
        B -->|Ports| D(W Service)
        C -->|Adapters| E[(PostgreSQL)]
        D -->|HTTP REST| F[W Sandbox]
    end
    classDef box fill:#f6f6f6,stroke:#ccc,stroke-width:1px
    class A,B,C,D,E,F box
```
```mermaid
erDiagram
    product {
        UUID      id PK
        VARCHAR   name
        VARCHAR   description
        NUMERIC   price
        INT       stock
    }

    customer {
        UUID      id PK
        VARCHAR   first_name
        VARCHAR   last_name
        VARCHAR   email
    }

    transaction {
        UUID      id PK
        DECIMAL   amount
        TIMESTAMP date
        VARCHAR   status
        VARCHAR   description
        UUID      customer_id FK
    }

    delivery {
        UUID      id PK
        VARCHAR   address
        VARCHAR   city
        VARCHAR   status
        UUID      transaction_id FK
    }

    %% Relaciones
    customer     ||--o{ transaction : "1 cliente genera N transacciones"
    transaction  ||--|{ delivery    : "1 transacción puede tener varios envíos"
    transaction  }o--o{ product     : "N:M productos‑transacción"
```

**Características principales:**

- **Hexagonal / Ports & Adapters**: cada módulo (product, transaction, etc.) mantiene las carpetas domain, dto, ports y adapters.
- **WModule** encapsula toda la integración externa.
- **PostgreSQL 15** corre en su propio contenedor (db).
- **Docker multi-stage** compila TypeScript y genera una imagen ultraligera.

## Estructura de carpetas

```
src/
 ├─ modules/
 │   ├─ product/
 │   ├─ transaction/
 │   ├─ customer/
 │   ├─ delivery/
 │   └─ w/
 │       ├─ adapters/
 │       ├─ dto/
 │       ├─ ports/
 │       ├─ w.service.ts
 │       └─ w.module.ts
 ├─ app.module.ts
 └─ main.ts
```

## Requisitos previos

| Herramienta | Versión mínima |
|-------------|----------------|
| Docker | 20.10 |
| Docker Compose | 1.29 |
| Node.js (opcional) | 18 LTS |
| Git | 2.30 |

> Si usas Docker para todo, Node y Postgres locales no son necesarios.

## Configuración rápida

```bash
git clone https://github.com/<tu-usuario>/payment-api.git
cd payment-api

# Variables de entorno
cp .env.example .env             # Rellena llaves y credenciales

# Arranque
docker-compose up -d --build
```

Abre `http://localhost:3000/health` y verás:

```json
{"status":"ok"}
```

## Arranque en Docker

```bash
docker-compose up -d --build      # Crea y levanta api_1 + db_1
docker-compose logs -f api        # Sigue logs de Nest
docker-compose exec api npm run migration:run  # Ejecutar migraciones
```

| Servicio | Puerto |
|----------|--------|
| API Nest | 3000 |
| PostgreSQL | 5432 |

## Flujo de pago

```mermaid
sequenceDiagram
  participant Front
  participant API
  participant W
  Front->>API: POST /transactions + datos tarjeta
  API->>W: GET /merchants → acceptance_token
  API->>W: POST /tokens/cards → card_token
  API->>W: POST /transactions (pago)
  W-->>API: status = PENDING
  API-->>Front: respuesta pending
  W-->>API: webhook /webhooks/w (APPROVED)
  API-->>API: actualiza BD → approved
```

## Colección cURL / Postman

```bash
# 1️⃣ Tokenizar tarjeta
curl -X POST "$W_BASE_URL/tokens/cards" \
  -H "Authorization: Bearer $W_PUBLIC_KEY" \
  -H "Content-Type: application/json" \
  -d '{"number":"4242424242424242","cvc":"123","exp_month":"12","exp_year":"25","card_holder":"Test"}'

# 2️⃣ Crear transacción vía backend
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
        "description":"Venta Demo",
        "amount":25000,
        "customerEmail":"test@ejemplo.com",
        "cardToken":"tok_test_ABC123..."
      }'
```

> Importa `docs/postman_collection.json` para probar todos los endpoints en Postman.

## Tareas npm

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Hot-reload con ts-node-dev |
| `npm run build` | Compila TypeScript a dist/ |
| `npm run lint` | ESLint + Prettier |
| `npm run test` | Unit + e2e tests (Jest) |
| `npm run migration:run` | Ejecuta migraciones TypeORM |
| `npm run seed` | Seeds de demostración |

## Migraciones y seeds

```bash
docker-compose exec api npm run migration:generate -- -n init   # Crear migración
docker-compose exec api npm run migration:run                   # Aplicarlas
docker-compose exec api npm run seed                            # Insertar demo
```

## Pruebas y calidad

Nuestro pipeline de calidad incluye:

| Herramienta | Propósito | Comando |
|-------------|-----------|---------|
| **Jest** + **Supertest** | Unitarias y End‑to‑End | `npm run test` |
| **ts‑jest** | Transpilación TypeScript en tests | autom. |
| **eslint** + **prettier** | Estilo y reglas estáticas | `npm run lint` |
| **husky** / **lint‑staged** | Ejecuta `lint` + `test` antes de cada commit | ganchos Git |
| **coverage** | Informe Cobertura → `coverage/lcov-report` | `npm run test:cov` |

> Ejecución típica en CI  
> `npm ci && npm run lint && npm run test -- --runInBand`

### Interpretar resultados

```txt
Test Suites: 2 failed, 27 passed, 29 total
Tests:       3 failed, 157 passed, 160 total

## Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.