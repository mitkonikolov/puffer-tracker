# **Puffer Tracker**

Puffer Tracker is a project that tracks the conversion rate of `pufETH` over time and provides a frontend for visualizing both real-time and historical data.

## **Project Structure**

- **puffer-tracker-backend**: A Flask-based microservice that handles data retrieval, storage, and API endpoints.
- **puffer-tracker-frontend**: A Next.js/React frontend for visualizing the conversion rate data over time.

## **Getting Started**

### **Prerequisites**

- **Python 3.12+**: Backend requires Python 3.12 or higher. [Download Python](https://www.python.org/downloads/)
- **Node.js & npm**: Frontend requires Node.js and npm. [Download Node.js](https://nodejs.org/en/)
- **MongoDB**: A running instance of MongoDB to store historical data. [Download MongoDB](https://www.mongodb.com/try/download/community)

---

## **Backend Setup (Flask Microservice)**

**Note:** When you initially set up the project, there will not be any historical rates available in your local MongoDB. The backend (with the scheduler) will need to run for some time to gather and store data locally.

### **1. Navigate to the Backend Directory**

```bash
cd puffer-tracker-backend
```

### **2. Create and Activate a Virtual Environment**

**On Windows**:
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS & Linux**:
```bash
python3 -m venv venv
source venv/bin/activate
```

### **3. Install Required Packages**

Install all the required dependencies from `requirements.txt`:

```bash
pip install -r requirements.txt
```

### **4. Set Environment Variables with a `.env` File**

Create a `.env` file in the `puffer-tracker-backend` directory. Add the necessary environment variables:

```env
WEB3_PROVIDER_URI=<YOUR_WEB3_PROVIDER_URI>
PUFFERVAULT_ADDRESS=<YOUR_PUFFERVAULT_CONTRACT_ADDRESS>
MONGODB_URI=<YOUR_MONGODB_URI>
SECRET_KEY=<YOUR_SECRET_KEY>
```

Replace the placeholder values with your actual data. These variables will be imported by the `config.py` file and used within the Flask application.

### **5. Run the Flask Application**

```bash
python app.py
```

The backend will run on `http://127.0.0.1:5000` by default.

### **6. Scheduler and API Endpoints**

The backend has a scheduler that periodically retrieves the conversion rate and stores it in MongoDB. The available API endpoints are:
- **GET `/conversion-rate`**: Fetches the latest conversion rate.
- **GET `/historical-rates`**: Fetches all stored conversion rates.

**Note:** When you initially set up the project, there will not be any historical rates available in your local MongoDB. The backend (with the scheduler) will need to run for some time to gather and store data locally.

---

## **Frontend Setup (Next.js Application)**

### **1. Navigate to the Frontend Directory**

```bash
cd puffer-tracker-frontend
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Start the Development Server**

```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`.

---

## **Built With**

- **Backend**: Python, Flask, Web3.py, MongoDB
- **Frontend**: TypeScript, Next.js, React, Material-UI, Chart.js
- **Scheduling**: APScheduler for periodic data fetching

## **Future Improvements**

- **Adding authentication and access control**
- **Supporting pufETH/USD (historical) conversion rate**
- **Supporting pufETH/BTC current conversion rate**
- **Enhancing the frontend** to include:
  - **Custom Time Ranges**: Enable filtering by date range.
  - **Real-Time Data Updates**: Use WebSocket for live rate updates and optimize chart rendering.
  - **Responsive Design**
  - **Data Export**: Allow exporting historical data in CSV, JSON, etc.
- **Enhancing the backend** to include:
  - **Customizable Data Intervals**: Support aggregation of data over minute, hour, or day intervals.
  - **Caching for Performance**: Implement Redis for frequent requests.
  - **Monitoring & Alerts**: Integrate error tracking and performance monitoring tools.
  - **Secret Management**: Use a secure secret manager for sensitive data post-deployment.
  - **Code Quality & Deployment**: Add testing, linting, containerization, and CI/CD pipelines.

