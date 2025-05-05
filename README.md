# EatyTracker 飲食紀錄與健康管理平台  
#### Video Demo: https://youtu.be/TtC4a11Kqj4  
#### Description:

**EatyTracker** is a web application that helps users record daily meals, set calorie goals, and track health data.  
The project is built with **Nuxt 3 + TypeScript**, and uses **Supabase** for user authentication, data storage, and file uploads.  
The goal was to create a simple, intuitive tool to build healthy eating habits for myself and others.

EatyTracker 是一個幫助使用者紀錄每日飲食、設定熱量目標、追蹤健康數據的網頁應用。這個專案是用 Nuxt 3 + TypeScript 製作，後端使用 Supabase 來存放資料與管理使用者登入。整體設計是希望能做出一個簡單、直覺，又可以實際幫助自己或其他人建立飲食習慣的工具。

---

## Features / 專案功能說明

### **Login 登入**
Users can log in with email/password or one-click Google login. After logging in, they are redirected to the homepage.

進入網站後，使用者可以選擇用帳號密碼登入，也可以用 Google 一鍵登入。登入後會帶到主頁，開始使用所有功能。

---

### **Homepage 主頁**
The homepage shows the user’s daily calorie goal and diet purpose (e.g., lose fat, gain muscle, or maintain weight).  
There is a short quiz to calculate TDEE (Total Daily Energy Expenditure).  
Users can set their avatar, name, and a motivational phrase.  
Future features like "Custom Menus" and "Social Sharing" will be accessible here.

主頁會顯示你的每日熱量目標和飲食目的（像是減脂、增肌或維持體重）。使用者可以透過一個小問卷，計算自己的 TDEE（每日消耗熱量）。可以設置自己的大頭貼、名字和一句鼓勵短語。預計未來會加入「自訂菜單」和「社交區」等快捷入口。

---

### **Meal Log 飲食記錄**
This page lists the meals logged each day. Users can edit or delete any item.  
A chart shows calorie surplus and the macronutrient breakdown (protein, carbs, fat).

這裡會列出你每天吃了什麼，可以點進去修改或刪除某一筆。下方會顯示你當天的熱量盈餘，以及營養素比例（像是蛋白質、碳水、脂肪）圖表，幫助你看看今天吃得是否均衡。

---

### **Add Meal 新增紀錄**
This page lets users input multiple food items, adjust portion size, and upload food photos.  
Calories and nutrients are calculated automatically based on Taiwan’s Food Nutrition Database.  
In the future, I plan to add AI features like Gemini food recognition and custom menu quick add.

這一頁讓你輸入今天吃的東西。你可以：
- 一次輸入多種食物
- 調整每種食物的份量（克數）
- 上傳食物的照片  
系統會自動幫你算熱量和營養素。  
目前食物的營養素數值來源為台灣衛生福利部食品藥物管理署提供的食物營養成分資料庫。  
未來也會想串接 Gemini AI 自動辨識食物，或可以從自己儲存的菜單快速新增。

---

### **Body Stats 身體數值紀錄**
Users can log weight, body fat, and other metrics.  
The system generates trend charts, and each entry is editable or deletable.

這裡可以記錄體重、體脂等等，系統會用圖表幫你畫出變化趨勢。每一筆紀錄也都可以點進去修改或刪除。

---

### **AI Chat (Planned) / AI Chat（規劃中）**
This feature is still under development.  
The goal is to let an AI assistant give meal suggestions based on your intake or analyze food photos to auto-log nutrients.

這一頁目前還沒完成，但我希望未來能讓 AI 提供營養建議。AI 會根據你今天吃的東西，建議下一餐要怎麼吃；或能拍照後自動判讀食物營養並加入紀錄。

---

## Tech Stack / 技術細節與架構

- **Frontend 前端**：Nuxt 3 + TypeScript + Composition API + TailwindCSS  
- **State 管理**：Pinia  
- **Database 資料庫**：Supabase (PostgreSQL)  
- **Authentication 認證**：Supabase Auth  
- **File Storage 檔案儲存**：Supabase Storage  
- **Charts 圖表呈現**：Chart.js  
- **PWA 支援**：可加到主畫面像 App 一樣使用  

---

## Design & Reflection / 設計選擇與心得

Most calorie tracker apps on the market are complex or full of ads.  
I wanted to create something clean and focused on features I personally need.  
I used Supabase because it combines database, auth, and storage in a simple way, and it's based on PostgreSQL so I could practice my SQL skills from the course.  
Using Nuxt 3 with TypeScript was also a challenge — I encountered several type-related bugs,  
but I realized these bugs could go unnoticed in JavaScript, so it was worth learning.

市面上現在常見的飲食控制 app 畫面都過於複雜或是塞滿廣告，因此我希望能做一個符合我自身需求的應用來幫助我飲控。我希望盡可能簡化畫面，但保留好用的功能。  
我選擇使用 Supabase 是因為它整合資料庫、認證、檔案儲存很方便，且它是基於 PostgreSQL 建立的，可以幫助我應用課堂上學到的 SQL 語法。  
而我選擇使用 Nuxt 3 + TypeScript 也是因為在課堂上我對型別有更多的認識，因此想試著使用強型別語法來撰寫程式。途中確實遇到過蠻多次因為型別而產生的報錯，但往好處想，如果這是用 JavaScript 的話，它壞了我可能根本不會發現。

Although I feel the app is still not complete and not yet as smooth as I’d like,  
this project helped me understand data flow, database design, and user experience much better.  
I hope to continue working on this and make it a real tool people can use.

雖然以一個作品來說我覺得它還不夠完整，在紀錄功能上也還不夠方便，但我藉由這個專案學到了很多關於資料流、資料庫設計、使用者體驗的思考方式。希望未來可以把這個專案繼續做下去，實現我理想的功能。
