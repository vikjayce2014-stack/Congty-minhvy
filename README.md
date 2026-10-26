# Minh Vy - Website xưởng may nón

Website tĩnh, 5 trang x 2 ngôn ngữ (Việt ở `/`, English ở `/en/`), build bằng Node.js, deploy lên Cloudflare.

## Chạy thử trên máy

```bash
npm install
npm run dev      # http://localhost:4173, tự build lại khi sửa src/
```

## Build

```bash
npm run build    # tạo thư mục dist/
```

## Sửa thông tin công ty

Mở `src/content.js`: số điện thoại, Zalo, địa chỉ, email, số năm kinh nghiệm, công suất.

- Khi có **email**: điền vào `email`, website tự hiện ở trang Liên hệ và chân trang.
- Khi có **tên miền**: điền vào `siteUrl` (ví dụ `https://minhvy.vn`), website tự thêm canonical, hreflang và `sitemap.xml`.

## Ảnh và video

Ảnh gốc nằm ở `../hình nón`, video gốc ở `../Video sản phẩm`. Sau khi thêm hoặc đổi file gốc, chạy:

```bash
npm run assets   # nén sang webp và mp4 trong src/static/media
```

Các file đã nén được commit sẵn nên Cloudflare không cần chạy bước này.

## Deploy lên Cloudflare (qua GitHub)

1. Push repo lên GitHub.
2. Cloudflare Dashboard → Workers & Pages → Create → kết nối repo.
3. Build command: `npm run build`. Deploy command: `npx wrangler deploy` (đã cấu hình trong `wrangler.jsonc`, thư mục `dist`).
4. Mỗi lần push lên nhánh `main`, website tự cập nhật.
5. Gắn tên miền ở Settings → Domains & Routes.

Deploy thủ công: `npm run deploy` (cần `npx wrangler login` trước).
