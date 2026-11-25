# Yoga Study · Nguyễn Thiên Châu

Khóa học Huấn luyện viên Yoga online 200h – Yogadaily. Đã nhập đầy đủ Tuần 1–5: 53 bài/clip, 4 PDF nguồn, 185 trang PDF và 11 bài dạng chữ Tuần 5.

Website: https://sylkhema.github.io/thienchau-yogastudy/

## Xuất bản

GitHub Pages dùng workflow `.github/workflows/pages.yml`. Nguồn chuyển từ website hiện có được lưu trong 13 phần `yoga-archive-*.part`, ghép và kiểm tra SHA-256 trước mỗi lần triển khai.

## Cập nhật Tuần 6 và các tuần sau

Đặt các file thay đổi trong `updates/` theo đúng đường dẫn của website. Ví dụ `updates/pdf-study/catalog.json` chứa danh mục đầy đủ, giữ nguyên ID của các bài cũ và bổ sung bài mới. Hình mới đặt trong `updates/pdf-study/assets/week6/`. Khi commit vào main, workflow tự phủ các cập nhật lên bản gốc và triển khai. Có thể cập nhật HTML, JS và CSS theo cùng cách. Dữ liệu ghi chú và dấu lưu cá nhân được giữ trong trình duyệt của từng người.
