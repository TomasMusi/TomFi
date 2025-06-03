# 💳 TomFi — Modern Banking Project

Welcome to **TomFi**, a full-stack banking system designed and built as a personal learning project.  
Built using modern technologies like **SvelteKit**, **TypeScript**, **MariaDB**, and more.

---

(![Screenshot from 2025-06-03 17-17-39](https://github.com/user-attachments/assets/170f06c6-dc45-41bc-afaa-b8ad82137f66))

## 🚀 About the Project

TomFi is not just a banking demo — it's a reflection of my personal growth as a developer.  
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

| Feature | Description |
|--------|-------------|
| 💳 **Create Credit Cards** | Users can generate and manage virtual credit cards |
| 🔐 **PIN Check** | Secure PIN validation for card operations |
| 📷 **Custom Profile Picture** | Upload your own avatar |
| 📱 **QR Code Payments** | Instantly generate a QR code for card-based payments |
| 🛡 **In Progress**: 2FA | Coming soon: Two-Factor Authentication |
| 💸 **In Progress**: Send Money | Support for account-to-account transfers |
| 📊 **In Progress**: Charts & Analytics | Visualize your financial behavior |
| 🖥 **In Progress**: Desktop App | A dedicated Electron desktop version |

---

![TomFi Features](![Screenshot from 2025-06-03 17-16-58](https://github.com/user-attachments/assets/f02b7a88-80ef-4153-92d3-156806c3e5a0))

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

![TomFi Dashboard](![Screenshot from 2025-06-03 17-16-21](https://github.com/user-attachments/assets/bbef87e0-4f0f-4a33-8c47-212b1ed2908c))

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
- [ ] 2FA Authentication
- [ ] Transaction history & charts
- [ ] Desktop App (Electron)
- [ ] Internationalization (i18n)

---

## 🛠️ Running Locally

```bash
git clone https://github.com/your-username/tomfi.git
cd tomfi
npm install
npm run dev
