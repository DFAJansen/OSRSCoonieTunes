# OSRS CoonieTunes

Een Next.js + TypeScript MVP om vier vaste OSRS-spelers met elkaar te vergelijken via publieke TempleOSRS endpoints.

## Starten

```bash
npm install
npm run dev
```

Open daarna `http://localhost:3000`.

## Spelers aanpassen

De vaste vriendengroep staat in:

`src/lib/players.ts`

Pas daar de `PLAYERS` array aan om later extra vrienden toe te voegen.

## Pagina's

- `/` dashboard met player cards, awards en roast
- `/skills` skillvergelijking
- `/bosses` boss killcounts
- `/gains` gains per periode
- `/collection-log` collection log samenvatting en itemzoeker
- `/loot-feed` gecombineerde recente drops
- `/pets` petvergelijking

## Proxy endpoints

Alle TempleOSRS requests lopen via eigen Next.js routes:

- `/api/osrs/player-info?player=`
- `/api/osrs/player-stats?player=`
- `/api/osrs/player-gains?player=&period=`
- `/api/osrs/player-datapoints?player=&time=`
- `/api/osrs/collection-log?player=`
- `/api/osrs/recent-items?player=`
- `/api/osrs/pets?player=`
- `/api/osrs/items`
- `/api/osrs/categories`
- `/api/osrs/category-parameters`

TempleOSRS gebruikt geen API key. Usernames worden met `encodeURIComponent` doorgestuurd, dus `RNG Goblin` werkt met spatie.
