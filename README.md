# 💳 TomFi — Modern Banking Project

Welcome to **TomFi**, a full-stack banking system designed and built as a personal learning project.  
Built using modern technologies like **SvelteKit**, **TypeScript**, **MariaDB**, and more.

---

![Screenshot from 2025-06-03 17-17-39](https://github.com/user-attachments/assets/170f06c6-dc45-41bc-afaa-b8ad82137f66)

## 🚀 About the Project

TomFi is a demo banking web application that opened doors to new opportunities and played a key role in my personal growth as a developer.
Throughout this project, I've explored:

- 🔁 **SvelteKit** for reactive, frontend development
- 🧠 **TypeScript** for static type safety
- 🛢️ **MariaDB** for reliable SQL storage
- 🔒 **Symmetric & Asymmetric hashing** for data protection
- 🔄 **Database transactions** to ensure consistency
- 🧩 **Custom middlewares** for request processing
- 🔒 **Backend Validation** for Maximum Security

---

## ✨ Features

| Feature                      | Description                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| 💳 **Create Credit Cards**    | Users can generate and manage virtual credit cards                         |
| 🔐 **PIN Check**              | Secure PIN validation for card operations                                  |
| 📷 **Custom Profile Picture** | Upload your own avatar for personalization                                 |
| 📱 **QR Code Payments**       | Instantly generate QR codes for seamless card-based payments               |
| 🛡 **2FA**                    | Two-Factor Authentication for enhanced security                            |
| 💸 **Transaction System**     | Send and receive money through account-to-account transfers                |
| 📊 **Charts & Analytics**     | Visualize financial behavior with interactive charts and graphs            |
| 🖥 **Desktop App**            | A dedicated Electron desktop version for native experience and performance |


---

![Screenshot from 2025-06-11 14-38-22](https://github.com/user-attachments/assets/54a85630-b179-4e78-84c0-a83aada9f95e)


## 🧪 Tech Stack

- **Frontend**: SvelteKit + TailwindCSS
- **Backend**: SvelteKit Endpoints + Typescript
- **Database**: MariaDB with transaction support
- **Security**:
  - AES (symmetric encryption)
  - RSA (asymmetric encryption)
  - Password & PIN hashing
- **Other Concepts**:
  - Middleware for route guards
  - File handling for user avatars
  - QR code generation
  - Planned: 2FA & persistent login tokens

---

![Screenshot from 2025-06-12 14-40-58](https://github.com/user-attachments/assets/317025ea-7a6e-4002-87e7-4bc424f17a2a)

## 📚 What I Learned


This project taught me a lot about:

- Handling secure data properly with encryption & hashing
- Working with raw SQL queries and transactions
- Managing form data, file uploads, and image processing
- Designing a secure and responsive user interface
- Structuring large apps with clean architecture

---

## 📈 Roadmap

- [x] Create and manage cards
- [x] Custom avatars
- [x] QR code support
- [x] 2FA Authentication
- [x] Transaction history
- [X] Desktop App (C++)
- [x] Charts

---

## 📁 Directory Structure

```
TomFi-Web/
├── src/
│   ├── app.css
│   ├── app.d.ts
│   ├── app.html
│   ├── lib/
│   │   ├── alerts.ts
│   │   ├── index.ts
│   │   ├── zodtypes.ts
│   │   └── components/
│   │       ├── App.svelte
│   │       ├── Benefits.svelte
│   │       ├── Dashboard.svelte
│   │       ├── Footer.svelte
│   │       ├── Hero.svelte
│   │       ├── Login.svelte
│   │       ├── Mail.svelte
│   │       ├── Navbar.svelte
│   │       ├── Profile.svelte
│   │       ├── Register.svelte
│   │       ├── Testimony.svelte
│   │       ├── Transactions.svelte
│   │       └── Wallet.svelte
│   ├── routes/
│   │   ├── +error.svelte
│   │   ├── +layout.svelte
│   │   ├── +page.server.ts
│   │   ├── +page.svelte
│   │   ├── 2fa/
│   │   │   └── +page.svelte
│   │   ├── admin/
│   │   │   ├── +page.server.ts
│   │   │   └── +page.svelte
│   │   ├── login/
│   │   │   └── +page.svelte
│   │   ├── register/
│   │   │   └── +page.svelte
│   │   ├── tst/
│   │   │   └── +page.svelte
│   │   ├── dashboard/
│   │   │   ├── +page.server.ts
│   │   │   ├── +page.svelte
│   │   │   ├── mail/
│   │   │   │   ├── +page.server.ts
│   │   │   │   └── +page.svelte
│   │   │   ├── profile/
│   │   │   │   ├── +page.server.ts
│   │   │   │   └── +page.svelte
│   │   │   ├── transactions/
│   │   │   │   ├── +page.server.ts
│   │   │   │   └── +page.svelte
│   │   │   └── Wallet/
│   │   │       ├── +page.server.ts
│   │   │       └── +page.svelte
│   │   └── api/
│   │       ├── 2fa/
│   │       │   └── +server.ts
│   │       ├── Deposit/
│   │       │   └── +server.ts
│   │       ├── login/
│   │       │   └── +server.ts
│   │       ├── login-2fa-verify/
│   │       │   └── +server.ts
│   │       ├── logout/
│   │       │   └── +server.ts
│   │       ├── qrcode/
│   │       │   └── +server.ts
│   │       ├── register/
│   │       │   └── +server.ts
│   │       ├── SeePin/
│   │       │   └── +server.ts
│   │       ├── SendData/
│   │       │   └── +server.ts
│   │       ├── setCardStatus/
│   │       │   └── +server.ts
│   │       ├── Transactions/
│   │       │   └── +server.ts
│   │       └── verify_2fa/
│   │           └── +server.ts
│   ├── server/
│   │   ├── auth.ts
│   │   ├── middleware_admin.ts
│   │   └── middleware_user.ts
│   └── types/
│       ├── database.ts
│       └── db.ts
├── .svelte-kit/
├── keys/
│   ├── private.pem
│   └── public.pem
├── licence.md
├── package.json
├── package-lock.json
├── static/
│   ├── card.png
│   ├── favicon.png
│   ├── pfp/
│   │   └── PokeSearch1-2025-06-08_10-04.png
│   └── qrcode.png
```


---
## 🛠️ Running Locally

```bash
git clone https://github.com/your-username/tomfi.git
cd tomfi
npm install
npm run dev
```


![clideo_editor_f04e3bf4fe1345e1993ac7d0b6ad5d82](https://github.com/user-attachments/assets/9fd70a02-ac98-4061-b5ac-483c3df92730)
![2025-06-18_04-59-55 (1)](https://github.com/user-attachments/assets/4dbb6a24-94da-4347-b97a-9f48bc458fdb)


