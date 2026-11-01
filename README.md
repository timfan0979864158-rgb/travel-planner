# 慢慢去旅行｜Travel Planner

一個以 React + Vite 製作的自助旅行規劃網站初版。

## 目前功能

- 建立、編輯、刪除旅程
- 設定目的地、日期、旅程備註與預算
- 依天數建立每日行程
- 新增、刪除每日活動，包含時間、地點與備註
- 搜尋旅程、查看即將出發的旅程
- 在同一個瀏覽器中自動保存資料（localStorage）

## 本機啟動

需要先安裝 Node.js。

```bash
npm install
npm run dev
```

開啟終端機顯示的本機網址即可預覽。

## 建置正式版本

```bash
npm run build
npm run preview
```

## 技術

- React
- Vite
- Lucide React icons
- CSS

## 下一階段

1. 串接 Supabase，讓不同裝置能讀取同一份旅程資料。
2. 設計適用於免登入分享的編輯權限與資料庫安全政策。
3. 部署到 Vercel，取得可公開分享的網站網址。

> 注意：目前資料只保存在使用者目前的瀏覽器，不會自動同步給其他人。尚未設定正式資料庫或公開協作權限。
