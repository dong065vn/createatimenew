# Hướng dẫn Deploy lên Vercel

## 📋 Yêu cầu

- Tài khoản GitHub (đã có repository này)
- Tài khoản Vercel (miễn phí) tại [vercel.com](https://vercel.com)
- GEMINI_API_KEY (để sử dụng Google Gemini AI)

## 🚀 Cách 1: Deploy qua Vercel Dashboard (Khuyến nghị)

### Bước 1: Đăng nhập Vercel

1. Truy cập [vercel.com](https://vercel.com)
2. Click **"Sign Up"** hoặc **"Log In"**
3. Chọn **"Continue with GitHub"** để đăng nhập bằng tài khoản GitHub

### Bước 2: Import Project

1. Sau khi đăng nhập, click **"Add New..."** → **"Project"**
2. Chọn repository **"sharetime"** từ danh sách
3. Nếu không thấy repository:
   - Click **"Adjust GitHub App Permissions"**
   - Cấp quyền cho Vercel truy cập repository

### Bước 3: Cấu hình Project

Vercel sẽ tự động phát hiện cấu hình từ file `vercel.json`. Kiểm tra:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Bước 4: Thêm Environment Variables

**QUAN TRỌNG**: Thêm biến môi trường trước khi deploy

1. Trong phần **"Environment Variables"**, thêm:
   ```
   Name: GEMINI_API_KEY
   Value: [API key của bạn]
   ```
2. Chọn môi trường: **Production**, **Preview**, và **Development**

### Bước 5: Deploy

1. Click **"Deploy"**
2. Đợi quá trình build (khoảng 1-2 phút)
3. Khi thấy 🎉 **"Congratulations!"** là đã thành công!

### Bước 6: Truy cập Website

Vercel sẽ cung cấp URL dạng: `https://sharetime-xxxx.vercel.app`

## 🖥️ Cách 2: Deploy qua Vercel CLI

### Cài đặt Vercel CLI

```bash
npm install -g vercel
```

### Đăng nhập

```bash
vercel login
```

### Deploy

```bash
# Deploy lần đầu
vercel

# Hoặc deploy trực tiếp lên production
vercel --prod
```

### Thêm Environment Variable qua CLI

```bash
vercel env add GEMINI_API_KEY
```

## 🔄 Auto Deploy

Sau khi setup lần đầu, mọi commit push lên GitHub sẽ tự động trigger deploy:

- Push lên **main branch** → Deploy lên **Production**
- Push lên **các branch khác** → Deploy lên **Preview** (để test)

## 🔧 Cấu hình hiện tại

File `vercel.json` đã được cấu hình:

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

Cấu hình này:
- ✅ Sử dụng Vite framework
- ✅ Build với lệnh `npm run build`
- ✅ Output vào thư mục `dist`
- ✅ Hỗ trợ client-side routing (SPA)

## 🔑 Lấy GEMINI_API_KEY

Nếu chưa có API key:

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy API key
4. Thêm vào Vercel Environment Variables

## 📱 Kiểm tra Deploy

Sau khi deploy thành công:

1. Truy cập URL được cung cấp
2. Kiểm tra console (F12) xem có lỗi không
3. Test upload ảnh và tạo lịch

## ⚠️ Xử lý lỗi thường gặp

### Lỗi: "API key not found"

- Kiểm tra đã thêm `GEMINI_API_KEY` vào Environment Variables chưa
- Redeploy lại project sau khi thêm biến môi trường

### Lỗi: "Build failed"

- Kiểm tra log để xem lỗi cụ thể
- Thường do thiếu dependencies hoặc syntax error

### Lỗi 404 khi refresh page

- File `vercel.json` đã có rewrites rule để xử lý
- Nếu vẫn lỗi, kiểm tra lại cấu hình

## 🔄 Update và Redeploy

Để cập nhật website:

```bash
# 1. Commit changes
git add .
git commit -m "Your update message"

# 2. Push to GitHub
git push origin main

# 3. Vercel sẽ tự động deploy
```

Hoặc deploy thủ công:

```bash
vercel --prod
```

## 📊 Monitoring

Trên Vercel Dashboard, bạn có thể:

- Xem deployment history
- Kiểm tra logs
- Xem analytics (lượt truy cập)
- Cấu hình custom domain
- Xem build time và performance

## 🌐 Custom Domain (Tùy chọn)

1. Vào project trên Vercel Dashboard
2. Click tab **"Settings"** → **"Domains"**
3. Thêm domain của bạn
4. Cấu hình DNS theo hướng dẫn

## 💡 Tips

- **Preview Deployments**: Mỗi PR sẽ có preview URL riêng để test
- **Rollback**: Có thể rollback về phiên bản trước nếu có lỗi
- **Environment Variables**: Có thể khác nhau cho Production/Preview/Development
- **Build Logs**: Luôn kiểm tra logs nếu build fail

## 🆘 Hỗ trợ

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

**Chúc bạn deploy thành công! 🎉**
