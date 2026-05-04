# NTest1

## 📌 Szakdolgozat leírás

Ez a projekt egy Next.js + TypeScript alapú esemény- és csoportkezelő alkalmazás, amely Supabase backenddel működik.  
A rendszer lehetővé teszi a felhasználók számára a regisztrációt, bejelentkezést, események kezelését, valamint csoportok létrehozását és kezelését.

---

## 🌐 Live URL

https://bright-stroopwafel-3cd327.netlify.app

---

## 🔖 Verzió

- Branch: `main`
- Commit: _053e974d033e618c3ac23b4f908a55f5e6ea35bb_

---

## ⚙️ Telepítés

```bash
git clone https://github.com/Requono/ntest1.git
cd ntest1
npm ci
```

## 🚀 Build

```
npm run build
```

## 💻 Lokális futtatás

```
npm run dev
```

A fejlesztői szerver elérhető: http://localhost:3000

## 🗄️ Prisma (ORM)

Migrációk futtatása:

```
npx prisma migrate dev
```

## ☁️ Supabase

A projekt Supabase-t használ adatbázisként.

Fő beállítások:

- Email/jelszó alapú hitelesítés
- Adatbázis Prisma migrációkkal kezelve

⚠️ Ismert korlátok

- Nincs teljes körű jogosultságkezelés
- Nincs automatikus email értesítés
- Egyes hibakezelések nem minden esetben teljesek

## 🧪 Tesztelés

A rendszer funkcionális és biztonsági tesztekkel lett validálva:

- regisztráció / login
- eseménykezelés
- csoportfunkciók
- profil módosítás

Részletes tesztek a szakdolgozat dokumentációjában találhatók.
