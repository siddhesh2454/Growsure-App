# 🌱 GrowSure – Multilingual Multi-Crop Disease Solution

GrowSure is a cross-platform mobile application designed to assist farmers with **plant disease detection, soil analysis, crop recommendations, and farming guidance**. The app provides intelligent solutions using AI, sensor data, and multilingual support to help farmers make better agricultural decisions.

## 🚀 Features

### 🏠 Home Dashboard

The main screen provides quick access to all major farming tools including weather updates, disease detection, soil analysis, and chatbot support.

### 🌿 Plant Disease Detection

Farmers can upload or capture a leaf image to detect plant diseases. The system identifies the disease and provides recommended treatments and preventive measures.

### 🌍 Multilingual Support

GrowSure supports multiple languages including:

* English
* Hindi
* Marathi

This ensures farmers can easily understand the information in their preferred language.

### 🤖 AI Chatbot Support

The in-app chatbot helps farmers by answering questions related to:

* Crop diseases
* Soil health
* Fertilizers
* Irrigation methods
* Government farming schemes
* Organic farming practices

The chatbot uses **Firebase for common FAQs** and **AI fallback responses** when a matching answer is not found.

### 🌡️ Live Soil Analysis

GrowSure integrates with hardware sensors to analyze soil conditions in real time:

* Soil Temperature
* Soil Moisture
* Soil pH

Based on these readings, the system predicts soil type and recommends the most suitable crops.

### 🌦️ Weather Updates

Farmers can view weather information to plan irrigation, fertilization, and crop protection activities.

## 🧠 Technologies Used

### Frontend

* React Native (Expo)
* TypeScript

### Backend

* FastAPI (Python)
* Node.js

### AI & Machine Learning

* YOLO (You Only Look Once) model using PyTorch for plant disease detection from leaf images.
* ResNet (Residual Neural Network) model using PyTorch for soil type prediction based on sensor data.
* AI-based crop recommendation system based on soil conditions.

### Database & Cloud

* Firebase Firestore
* Firebase Realtime Database

### Hardware Integration

* Soil sensors for temperature, moisture, and pH

## 📱 Application Modules

1. Home Dashboard
2. Disease Detection
3. Soil Analysis
4. Weather Information
5. Chatbot Support
6. Crop Recommendation System

## 🎯 Objective

The main goal of GrowSure is to provide **a complete digital farming assistant** that helps farmers:

* Detect plant diseases early
* Monitor soil health
* Select suitable crops
* Access farming knowledge easily
* Receive support in their local language


## 🔮 Future Improvements

* Satellite-based crop monitoring
* Pest detection using AI
* Voice assistant for farmers
* Market price prediction
* Offline mode support for rural areas

## 📌 Conclusion

GrowSure aims to bridge the gap between **modern technology and agriculture** by providing farmers with smart tools that improve productivity, crop health, and decision making.


