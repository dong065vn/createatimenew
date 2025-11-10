# 🚀 Hướng dẫn Deploy ShareTime lên Vercel

> **ShareTime** - Ứng dụng tạo lịch từ hình ảnh sử dụng Google Gemini AI

Hướng dẫn này sẽ giúp bạn deploy ứng dụng ShareTime lên Vercel một cách nhanh chóng và dễ dàng.

---

## 📋 Mục lục

- [Yêu cầu](#-yêu-cầu)
- [Chuẩn bị](#-chuẩn-bị)
- [Deploy qua Vercel Dashboard](#-phương-pháp-1-deploy-qua-vercel-dashboard-khuyến-nghị)
- [Deploy qua Vercel CLI](#-phương-pháp-2-deploy-qua-vercel-cli)
- [Cấu hình và Tối ưu](#-cấu-hình-và-tối-ưu)
- [Xử lý lỗi](#-xử-lý-lỗi-thường-gặp)
- [Tips và Best Practices](#-tips--best-practices)

---

## ✅ Yêu cầu

Trước khi bắt đầu, hãy đảm bảo bạn đã có:

- ✅ **Tài khoản GitHub** với repository này
- ✅ **Tài khoản Vercel** (miễn phí) - [Đăng ký tại đây](https://vercel.com)
- ✅ **Google Gemini API Key** - [Lấy API key miễn phí](https://makersuite.google.com/app/apikey)

---

## 🎯 Chuẩn bị

### 1. Lấy Google Gemini API Key

Google Gemini API Key là **BẮT BUỘC** để ứng dụng hoạt động. Đây là dịch vụ AI giúp phân tích hình ảnh và tạo lịch.

**Các bước lấy API Key:**

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Đăng nhập bằng tài khoản Google của bạn
3. Click nút **"Create API Key"** hoặc **"Get API Key"**
4. Chọn project Google Cloud (hoặc tạo mới nếu chưa có)
5. Copy API key (dạng: `AIzaSy...`)
6. **LƯU GIỮ** API key này - bạn sẽ cần nó ở bước sau

### 2. Đảm bảo code đã được push lên GitHub

```bash
# Kiểm tra trạng thái git
git status

# Nếu có thay đổi chưa commit, hãy commit và push
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## 🌟 Phương pháp 1: Deploy qua Vercel Dashboard (Khuyến nghị)

Đây là phương pháp đơn giản nhất, phù hợp cho người mới bắt đầu.

### Bước 1: Đăng nhập Vercel

1. Truy cập **[vercel.com](https://vercel.com)**
2. Click **"Sign Up"** (nếu chưa có tài khoản) hoặc **"Log In"**
3. Chọn **"Continue with GitHub"** để đăng nhập bằng GitHub

   > 💡 Đăng nhập bằng GitHub giúp Vercel tự động kết nối với các repository của bạn

### Bước 2: Import Repository

1. Sau khi đăng nhập, bạn sẽ thấy Dashboard của Vercel
2. Click nút **"Add New..."** (góc trên bên phải)
3. Chọn **"Project"** từ dropdown menu
4. Tìm và chọn repository **"sharetime"** từ danh sách

   **Nếu không thấy repository:**
   - Click **"Adjust GitHub App Permissions"**
   - Cấp quyền cho Vercel truy cập repository của bạn
   - Bạn có thể chọn cấp quyền cho tất cả repositories hoặc chỉ repository cụ thể

### Bước 3: Cấu hình Project Settings

Vercel sẽ **tự động phát hiện** đây là Vite project từ file `vercel.json` và `package.json`.

Kiểm tra các cấu hình sau (thường đã đúng tự động):

| Cấu hình | Giá trị |
|----------|---------|
| **Framework Preset** | Vite |
| **Root Directory** | `./` (mặc định) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node Version** | 18.x (hoặc cao hơn) |

> ✨ Bạn **không cần** thay đổi gì vì project đã được cấu hình sẵn!

### Bước 4: Thêm Environment Variables

**⚠️ QUAN TRỌNG NHẤT** - Ứng dụng sẽ **KHÔNG hoạt động** nếu thiếu bước này!

1. Trong phần **"Environment Variables"** (bên dưới cấu hình build):

   ```
   Name:  VITE_GEMINI_API_KEY
   Value: [Paste API key của bạn ở đây]
   ```

2. Chọn các môi trường áp dụng (chọn tất cả 3):
   - ✅ **Production** (môi trường thực tế)
   - ✅ **Preview** (môi trường preview cho các branch)
   - ✅ **Development** (môi trường development)

3. Click **"Add"** để lưu

**📌 LƯU Ý quan trọng:**
- Tên biến **PHẢI** là `VITE_GEMINI_API_KEY` (chính xác, có prefix `VITE_`)
- Vite yêu cầu tất cả environment variables client-side phải có prefix `VITE_`
- Không thêm dấu ngoặc kép hoặc khoảng trắng thừa
- API key có dạng: `AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Bước 5: Deploy

1. Sau khi cấu hình xong, click nút **"Deploy"**
2. Vercel sẽ bắt đầu quá trình build và deploy:
   - ⏱️ **Install dependencies** (30-60 giây)
   - ⏱️ **Build** (30-60 giây)
   - ⏱️ **Deploy** (10-20 giây)

3. Đợi khoảng **1-2 phút** cho quá trình hoàn tất

4. Khi thấy màn hình **🎉 "Congratulations!"** là đã thành công!

### Bước 6: Truy cập và Kiểm tra

1. Vercel sẽ cung cấp URL deployment:
   ```
   https://sharetime-xxxx.vercel.app
   ```
   hoặc
   ```
   https://sharetime-<your-username>.vercel.app
   ```

2. Click vào URL hoặc nút **"Visit"** để xem ứng dụng

3. **Kiểm tra chức năng:**
   - Trang có load bình thường không?
   - Upload một hình ảnh test
   - Xem ứng dụng có tạo được lịch không?
   - Mở DevTools (F12) → Console để check lỗi

---

## 💻 Phương pháp 2: Deploy qua Vercel CLI

Phương pháp này phù hợp cho developers muốn deploy từ terminal.

### Bước 1: Cài đặt Vercel CLI

```bash
# Cài đặt globally
npm install -g vercel

# Hoặc sử dụng npx (không cần cài)
npx vercel
```

### Bước 2: Đăng nhập

```bash
vercel login
```

Làm theo hướng dẫn để đăng nhập (qua email hoặc GitHub).

### Bước 3: Deploy

```bash
# Navigate đến thư mục project
cd /path/to/sharetime

# Deploy lần đầu (preview environment)
vercel

# Hoặc deploy trực tiếp lên production
vercel --prod
```

**Khi deploy lần đầu, CLI sẽ hỏi:**

```
? Set up and deploy "~/sharetime"? [Y/n] Y
? Which scope do you want to deploy to? [Your account]
? Link to existing project? [y/N] N
? What's your project's name? sharetime
? In which directory is your code located? ./
```

Trả lời các câu hỏi và CLI sẽ tự động deploy.

### Bước 4: Thêm Environment Variable

```bash
# Thêm VITE_GEMINI_API_KEY
vercel env add VITE_GEMINI_API_KEY

# CLI sẽ hỏi:
# 1. Nhập value (API key)
# 2. Chọn environment (Production/Preview/Development)
```

Hoặc thêm qua Dashboard như Phương pháp 1.

### Bước 5: Redeploy với Environment Variable

```bash
# Sau khi thêm env variable, redeploy
vercel --prod
```

---

## 🔄 Auto Deployment

Sau khi setup lần đầu, **mọi thay đổi trên GitHub sẽ tự động deploy!**

### Cách hoạt động:

| Branch | Deploy đến | URL |
|--------|-----------|-----|
| **main** (hoặc master) | Production | `sharetime.vercel.app` |
| **other branches** | Preview | `sharetime-git-branch-name.vercel.app` |
| **Pull Requests** | Preview | Unique URL cho mỗi PR |

### Workflow thông thường:

```bash
# 1. Thực hiện thay đổi code
# 2. Commit
git add .
git commit -m "Add new feature"

# 3. Push lên GitHub
git push origin main

# 4. Vercel tự động deploy (nhận email thông báo)
# 5. Kiểm tra deployment trên Vercel Dashboard
```

---

## ⚙️ Cấu hình và Tối ưu

### File `vercel.json`

Project này đã có cấu hình tối ưu trong file `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Giải thích:**

- **`buildCommand`**: Lệnh build project (Vite build)
- **`outputDirectory`**: Thư mục chứa file build (`dist`)
- **`framework`**: Framework được sử dụng (Vite)
- **`rewrites`**: Rewrite tất cả routes về `index.html` để hỗ trợ client-side routing (SPA)

### Environment Variables

Ứng dụng sử dụng các biến môi trường sau:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | ✅ Yes | Google Gemini API key để phân tích hình ảnh |

**Quản lý env variables:**

- Vào **Project Settings** → **Environment Variables** trên Vercel Dashboard
- Có thể set khác nhau cho Production/Preview/Development
- Update env variable → cần **redeploy** để áp dụng

---

## ⚠️ Xử lý Lỗi Thường gặp

### 1. Lỗi: "API key not found" hoặc "Gemini API Error"

**Nguyên nhân:**
- Chưa thêm `VITE_GEMINI_API_KEY`
- Tên biến sai (không có prefix `VITE_`)
- API key không hợp lệ

**Giải pháp:**
1. Vào **Vercel Dashboard** → Project → **Settings** → **Environment Variables**
2. Kiểm tra có biến `VITE_GEMINI_API_KEY` chưa
3. Verify API key còn hoạt động tại [AI Studio](https://makersuite.google.com/app/apikey)
4. Nếu update env variable → click **"Redeploy"** trên deployment gần nhất

### 2. Lỗi: Build Failed

**Lỗi trong Build Logs:**

```
Error: Cannot find module 'xxx'
```

**Giải pháp:**
```bash
# Đảm bảo tất cả dependencies đã được install đúng
npm install
npm run build

# Nếu build local OK → push lại lên GitHub
git push origin main
```

**Lỗi TypeScript:**

```
Type error: ...
```

**Giải pháp:**
```bash
# Kiểm tra TypeScript errors local
npm run build

# Fix tất cả errors trước khi push
```

### 3. Lỗi: 404 Not Found khi refresh page

**Nguyên nhân:**
- Thiếu cấu hình rewrites cho SPA routing

**Giải pháp:**
- File `vercel.json` đã có rewrites rule → không cần thay đổi
- Nếu vẫn lỗi, verify `vercel.json` có cấu hình `rewrites` như trên

### 4. Lỗi: "This page could not be found" trên Vercel

**Nguyên nhân:**
- Build output directory sai
- Files không được deploy đúng

**Giải pháp:**
1. Check **Build Logs** trên Vercel
2. Verify `outputDirectory` trong `vercel.json` là `dist`
3. Verify `npm run build` local tạo thư mục `dist`

### 5. Lỗi: White Screen hoặc Blank Page

**Giải pháp:**
1. Mở **DevTools** (F12) → **Console** tab
2. Check lỗi JavaScript
3. Thường do:
   - API key không đúng → check env variable
   - CORS issues → Gemini API không có vấn đề này
   - Import paths sai → fix và push lại

### 6. Lỗi: Deployment Timeout

**Nguyên nhân:**
- Build quá lâu (> 45 phút trên Free plan)

**Giải pháp:**
- Project này build rất nhanh (~1-2 phút) → không nên gặp lỗi này
- Nếu gặp → check có dependencies nặng nào được thêm không

---

## 📊 Monitoring và Quản lý

### Vercel Dashboard Features

Trên Vercel Dashboard, bạn có thể:

1. **Deployments Tab:**
   - Xem lịch sử tất cả deployments
   - Status: Building / Ready / Error
   - View logs, source code tại thời điểm deploy
   - Rollback về phiên bản trước nếu cần

2. **Analytics Tab:**
   - Số lượt truy cập (visitors)
   - Page views
   - Top pages
   - Traffic sources

3. **Settings Tab:**
   - Environment Variables
   - Domains (custom domain)
   - Git integration
   - General settings

4. **Logs Tab:**
   - Runtime logs
   - Build logs
   - Debug issues

### Kiểm tra Deployment Status

```bash
# Sử dụng CLI
vercel ls

# Xem logs của deployment gần nhất
vercel logs
```

---

## 🌐 Custom Domain (Tùy chọn)

Nếu bạn có domain riêng (ví dụ: `sharetime.com`):

### Bước 1: Thêm Domain

1. Vào **Project Settings** → **Domains**
2. Click **"Add"**
3. Nhập domain của bạn (ví dụ: `sharetime.com` hoặc `www.sharetime.com`)

### Bước 2: Cấu hình DNS

Vercel sẽ cung cấp DNS records cần thêm:

**Nếu dùng domain gốc (`sharetime.com`):**
```
Type: A
Name: @
Value: 76.76.19.19
```

**Nếu dùng subdomain (`www.sharetime.com`):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Bước 3: Verify và Deploy

- Vercel tự động verify DNS
- Sau khi verify thành công → domain sẽ hoạt động
- SSL certificate tự động được cấp (HTTPS miễn phí)

---

## 💡 Tips & Best Practices

### 1. Preview Deployments

Mỗi branch và Pull Request đều có **Preview URL riêng**:

```bash
# Tạo branch mới để test feature
git checkout -b feature/new-calendar-view

# Commit và push
git add .
git commit -m "Add new calendar view"
git push origin feature/new-calendar-view

# Vercel tự động tạo preview deployment
# URL: https://sharetime-git-feature-new-calendar-view.vercel.app
```

**Lợi ích:**
- Test features trước khi merge vào main
- Share preview link với team/client
- Mỗi PR có preview riêng

### 2. Rollback nhanh

Nếu deployment mới có lỗi:

1. Vào **Deployments** tab
2. Tìm deployment trước đó (status: Ready)
3. Click **"•••"** → **"Promote to Production"**
4. Website ngay lập tức quay về phiên bản cũ

### 3. Environment Variables Best Practices

```bash
# Development (local)
.env.local → Không commit lên Git

# Vercel Environments:
# - Production: Cho main branch
# - Preview: Cho các branch khác và PRs
# - Development: Cho vercel dev (local development với Vercel)
```

**Ví dụ:**
- Production API key: Real Gemini API key
- Preview API key: Có thể dùng cùng hoặc test API key
- Development: Local .env.local

### 4. Performance Optimization

Project này đã được tối ưu:

- ✅ Vite build rất nhanh
- ✅ Code splitting tự động
- ✅ Tree shaking
- ✅ Minification
- ✅ Vercel Edge Network (CDN global)

### 5. Sử dụng Vercel CLI cho Workflow nhanh

```bash
# Install alias (tùy chọn)
alias vc="vercel"

# Deploy nhanh
vc --prod

# Xem logs real-time
vc logs -f

# List deployments
vc ls
```

### 6. Git Workflow khuyến nghị

```bash
# Main branch → Production (stable)
# Dev branch → Preview (development)
# Feature branches → Preview (các tính năng mới)

# Workflow:
1. git checkout -b feature/xyz
2. [Code changes]
3. git commit -m "Add xyz"
4. git push origin feature/xyz
5. [Tạo PR, review trên preview URL]
6. git checkout main && git merge feature/xyz
7. git push origin main → Deploy production
```

---

## 🔐 Bảo mật

### Bảo vệ API Keys

- ✅ **KHÔNG BAO GIỜ** commit API keys vào Git
- ✅ Sử dụng Environment Variables trên Vercel
- ✅ Thêm `.env.local` vào `.gitignore` (đã có sẵn)
- ✅ Rotate API keys định kỳ nếu bị lộ

### API Key Restrictions (Khuyến nghị)

Trên Google Cloud Console, bạn có thể giới hạn API key:

1. Vào [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Chọn API key
3. **Application restrictions** → HTTP referrers
4. Thêm domain Vercel của bạn:
   ```
   https://sharetime-*.vercel.app/*
   https://your-custom-domain.com/*
   ```

---

## 📚 Resources

### Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Google Gemini API Docs](https://ai.google.dev/docs)

### Support

- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Support](https://vercel.com/support)

### Project Repository

- GitHub: [Your Repository URL]
- Issues: [Report bugs and issues]

---

## 🎓 Học thêm

### Vercel Features nâng cao

- **Edge Functions**: Serverless functions chạy ở edge
- **Edge Middleware**: Xử lý requests trước khi đến ứng dụng
- **Image Optimization**: Tối ưu hình ảnh tự động
- **Analytics**: Theo dõi performance và usage

### Tối ưu Vite + React

- Code splitting với React.lazy()
- Optimize bundle size
- Lazy loading components
- PWA với vite-plugin-pwa

---

## ✅ Checklist Deploy

Trước khi deploy, hãy đảm bảo:

- [ ] Code đã được test kỹ ở local
- [ ] Tất cả dependencies đã được thêm vào `package.json`
- [ ] `npm run build` chạy thành công local
- [ ] Đã có Google Gemini API key
- [ ] Code đã được push lên GitHub
- [ ] Đã tạo tài khoản Vercel
- [ ] Đã review lại `.gitignore` (không commit secrets)

Sau khi deploy:

- [ ] Website load được
- [ ] Không có lỗi trong Console (F12)
- [ ] Test upload hình ảnh
- [ ] Test tạo lịch
- [ ] Check responsive (mobile/tablet)
- [ ] Verify environment variables đã set đúng
- [ ] Setup custom domain (nếu có)

---

## 🆘 Cần Hỗ trợ?

Nếu gặp vấn đề:

1. **Check Deployment Logs** trên Vercel Dashboard
2. **Search Vercel Docs** - Hầu hết issues đã có hướng dẫn
3. **GitHub Issues** - Report bugs trong repository
4. **Vercel Support** - Contact qua chat hoặc email

---

**🎉 Chúc bạn deploy thành công!**

Made with ❤️ by ShareTime Team

---

*Última actualización: Tháng 11/2025*
