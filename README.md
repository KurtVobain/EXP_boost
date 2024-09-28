# EXPboost

Genrate migration:
`yarn typeorm migration:generate -d src/data-source.ts src/migrations/{MigrationName}`

Apply migration:
`yarn typeorm migration:run -d src/data-source.ts`
