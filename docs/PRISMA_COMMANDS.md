# Prisma Database Commands

## Rigenerare il Prisma Client

Dopo aver modificato lo schema Prisma (`src/main/database/prisma/schema.prisma`), è necessario rigenerare il client Prisma.

### Comando per rigenerare il client:

```bash
npx prisma generate --schema=src/main/database/prisma/schema.prisma
```

### Spiegazione:

- `npx prisma generate`: Comando per rigenerare il client Prisma
- `--schema=src/main/database/prisma/schema.prisma`: Specifica il percorso del file schema.prisma

### Quando rigenerare:

- ✅ Dopo aver modificato il modello del database nello schema.prisma
- ✅ Dopo aver aggiunto/rimosso campi da un modello
- ✅ Dopo aver cambiato tipi di dati
- ✅ Dopo aver modificato relazioni tra modelli
- ✅ Dopo aver aggiunto/rimosso indici

### Altri comandi utili:

```bash
# Visualizzare il database in Prisma Studio
npx prisma studio --schema=src/main/database/prisma/schema.prisma

# Creare e applicare una migrazione
npx prisma migrate dev --schema=src/main/database/prisma/schema.prisma

# Reset del database (ATTENZIONE: cancella tutti i dati)
npx prisma migrate reset --schema=src/main/database/prisma/schema.prisma

# Verificare lo stato delle migrazioni
npx prisma migrate status --schema=src/main/database/prisma/schema.prisma
```

### Note:

- I file generati vengono salvati in `src/main/database/generated/prisma/`
- Questa directory è inclusa nel `.gitignore` e non deve essere committata
- Il client deve essere rigenerato ogni volta che si modifica lo schema