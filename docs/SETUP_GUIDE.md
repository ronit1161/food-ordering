# Developer Setup & Installation Guide

This guide provides end-to-end instructions for configuring environment variables, setting up third-party cloud services, bootstrapping the admin account, and running the application locally.

---

## 1. System Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: Version `18.17.0` or higher (Node `20.x` or `22.x` recommended).
- **Package Manager**: `npm` (v9+), `yarn`, or `pnpm`.
- **Database**: Active **MongoDB Atlas** account (or local MongoDB daemon).
- **Accounts**:
  - [Google Cloud Console](https://console.cloud.google.com/) (for Google OAuth)
  - [Razorpay Dashboard](https://dashboard.razorpay.com/) (Test Mode)
  - [Cloudinary](https://cloudinary.com/) (Free tier)

---

## 2. Quick Start (Local Setup)

### Step 1: Install Dependencies
Open your terminal in the project root directory:
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy the `.env.example` template into a new `.env` file:
```bash
cp .env.example .env
```

Open `.env` and populate each key following the guides in Section 3 below.

---

## 3. Third-Party Services Configuration

### 3.1. MongoDB Atlas Setup
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Security > Database Access**:
   - Add a new database user (e.g. `food-ordering`) with read/write privileges.
3. Go to **Security > Network Access**:
   - Click **Add IP Address** $\rightarrow$ select **Allow Access from Anywhere (`0.0.0.0/0`)** for local testing.
4. Go to **Deployment > Database**:
   - Click **Connect** $\rightarrow$ **Drivers** (Node.js).
   - Copy the connection string and paste it into `.env`:
     ```env
     NEXT_MONGO_URL=mongodb+srv://<username>:<password>@cluster0.axfin.mongodb.net/food-ordering?retryWrites=true&w=majority
     ```

---

### 3.2. NextAuth Configuration
Generate a secure random string for signing JWT tokens:
```bash
# On Linux / macOS / Git Bash:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```
Add to `.env`:
```env
NEXTAUTH_SECRET=your_generated_random_secret
NEXTAUTH_URL=http://localhost:3000
```

---

### 3.3. Google Cloud OAuth 2.0 Setup
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Configure the **OAuth Consent Screen** (User Type: External) and set basic app details.
4. Navigate to **APIs & Services > Credentials**:
   - Click **Create Credentials** $\rightarrow$ **OAuth client ID**.
   - **Application type**: *Web application*.
   - **Name**: `Food Ordering App`.
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
5. Copy your **Client ID** and **Client Secret** into `.env`:
   ```env
   NEXT_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   NEXT_GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

---

### 3.4. Razorpay Payment Gateway (Test Mode)
1. Sign up or log into [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Toggle the switch at the top to **Test Mode**.
3. Navigate to **Account & Settings > API Keys**:
   - Click **Generate Test Key**.
   - Copy the Key ID and Key Secret.
4. Add to `.env`:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
   NEXT_RAZORPAY_KEY_ID=rzp_test_your_key_id
   NEXT_RAZORPAY_KEY_SECRET=your_razorpay_secret_key
   ```
   > [!TIP]
   > Test card credentials and UPI test handles can be found in the [Razorpay Test Card Documentation](https://razorpay.com/docs/payments/payments/test-card-details/).

---

### 3.5. Cloudinary Image Storage
1. Sign in to your [Cloudinary Dashboard](https://cloudinary.com/console).
2. On the main Dashboard, find **Account Details**:
   - Cloud Name
   - API Key
   - API Secret
3. Add to `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

## 4. Bootstrapping the Admin Account

By default, newly registered accounts have normal `customer` privileges (`admin: false`). To access admin management screens (`/categories`, `/menu-items`, `/users`):

1. Start the app and navigate to `http://localhost:3000/register`.
2. Register an account with your desired admin email (e.g. `admin@example.com`).
3. Connect to your database using **MongoDB Compass** or `mongosh`:
   ```javascript
   use food-ordering;

   // Elevate user role in User collection
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { admin: true } }
   );

   // Elevate user role in UserInfo collection
   db.userinfos.updateOne(
     { email: "admin@example.com" },
     { $set: { admin: true } }
   );
   ```
4. Sign out and log back in. The navigation bar will now display **Categories**, **Menu Items**, and **Users** admin tabs.

---

## 5. Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Verification
To test the production build locally:
```bash
# Compile and package production bundles
npm run build

# Start production server
npm start
```

---

## 6. Troubleshooting Common Issues

| Issue | Cause | Resolution |
| :--- | :--- | :--- |
| `redirect_uri_mismatch` on Google Sign-In | Incorrect redirect URI in Google Cloud Console | Ensure `http://localhost:3000/api/auth/callback/google` is added under **Authorized redirect URIs**. |
| `Invalid signature, verification failed` during checkout | Mismatched Razorpay Secret Key | Verify that `NEXT_RAZORPAY_KEY_SECRET` in `.env` matches the Secret Key generated alongside `NEXT_RAZORPAY_KEY_ID`. |
| `Image upload failed` / 500 error on `/api/upload` | Missing or invalid Cloudinary credentials | Double-check that `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are correctly configured without quotes or whitespace. |
| MongoServerError: `bad auth : authentication failed` | Wrong Atlas username or password | Recheck credentials in `NEXT_MONGO_URL`. Remember to URL-encode passwords containing special characters (`@`, `:`, `/`). |
