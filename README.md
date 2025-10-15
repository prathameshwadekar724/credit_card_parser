Perfect 🔥 — that’s already a strong draft! Below is a **polished, professional `README.md`** version — formatted beautifully for **GitHub**, with markdown styling, emojis, code blocks, and all sections clearly organized.

You can copy this directly into your `README.md` file at the project root.

---

```markdown
# 💳 Credit Card Statement Parser

A **full-stack application** that parses PDF credit card statements and extracts key financial details.  
Built with a **React + Tailwind CSS frontend** and a **Flask + PyMuPDF backend**.

---

## 🚀 Features

- 🗂️ **File Upload:** Simple drag-and-drop or manual file selection.
- 📄 **PDF Parsing:** Automatically extracts structured data from credit card statements.
- 🏦 **Multiple Issuers Supported:**
  - American Express  
  - Chase  
  - Bank of America  
  - Citibank  
  - Discover
- 🔍 **Extracted Data Points:**
  - Card Issuer  
  - Card Variant  
  - Last 4 digits  
  - Billing Cycle  
  - Payment Due Date  
  - Total Balance

---

## 🧰 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, Tailwind CSS |
| **Backend** | Python, Flask, PyMuPDF (`fitz`), pytesseract |
| **CORS** | Flask-CORS |
| **PDF Processing** | PyMuPDF (for text extraction), pdf2image (for scanned pdf) |

---

## 📁 Project Structure

```

CREDIT_CARD_PARSER/
├── backend/
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   └── App.jsx
│   ├── package.json
│   └── ... (other React files)
└── README.md

````

---

## ⚙️ Getting Started

### 🧩 Prerequisites
Make sure you have:
- [Node.js](https://nodejs.org/) & npm  
- [Python 3.x](https://www.python.org/downloads/) & pip  
- A Python virtual environment tool (recommended)

---

### 🐍 Backend Setup (Flask)

1. Navigate to the backend folder:
   ```bash
   cd backend
````

2. Create and activate a virtual environment:

   **Windows:**

   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

   **macOS/Linux:**

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Create a `requirements.txt` file (if not already present):

   ```text
   Flask
   Flask-Cors
   PyMuPDF
   ```

4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Run the Flask backend:

   ```bash
   flask run
   ```

   The backend will start at **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

### ⚛️ Frontend Setup (React)

1. Open a **new terminal** and navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

   The app will open at **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 How to Use

1. Open **[http://localhost:3000](http://localhost:3000)** in your browser.
2. Drag and drop a credit card statement (PDF) or click to upload.
3. Click **“Parse Statement”**.
4. The extracted information will be displayed below the upload section.

---

## 🔗 API Endpoint

### `POST /parse`

Accepts a `multipart/form-data` request with a single field: `file`.

#### ✅ Success Response (200 OK)

```json
{
  "issuer": "Chase",
  "card_variant": "Sapphire",
  "card_last_4": "1234",
  "billing_cycle": "10/15/2023 - 11/14/2023",
  "payment_due_date": "December 10, 2023",
  "total_balance": "1,234.56"
}
```

#### ❌ Error Response (400/500)

```json
{
  "error": "Some error message."
}
```




