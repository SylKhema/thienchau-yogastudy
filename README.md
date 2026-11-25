# Yoga Study · Nguyễn Thiên Châu

Khóa học Huấn luyện viên Yoga online 200h – Yogadaily. Đã nhập đến Tuần 6: 63 bài/clip, 4 PDF nguồn và 185 trang PDF. Tuần 5 có 11 bài dạng chữ. Tuần 6 có 10 bài dạng chữ, 29 bảng và 60 vị trí minh họa. Nguồn Tuần 6 nằm trong `sources/week-6.md`. Tài liệu được cung cấp chưa có Ngày 11 – Clip 1.

Website: https://sylkhema.github.io/thienchau-yogastudy/

## Xuất bản

GitHub Pages dùng workflow `.github/workflows/pages.yml`. Nguồn chuyển từ website hiện có được lưu trong 13 phần `yoga-archive-*.part`, ghép và kiểm tra SHA-256 trước mỗi lần triển khai.

## Cập nhật các tuần sau

Đặt các file thay đổi trong `updates/` theo đúng đường dẫn của website. Ví dụ `updates/pdf-study/catalog.json` chứa danh mục đầy đủ, giữ nguyên ID của các bài cũ và bổ sung bài mới. Hình mới đặt trong `updates/pdf-study/assets/week6/`. Khi commit vào main, workflow tự phủ các cập nhật lên bản gốc và triển khai. Có thể cập nhật HTML, JS và CSS theo cùng cách. Dữ liệu ghi chú và dấu lưu cá nhân được giữ trong trình duyệt của từng người.

Khi cập nhật danh mục, tăng tham số `v` của reader.js trong hai trang index để trình duyệt tải danh mục mới. Reader chuyển tham số phiên bản này sang yêu cầu catalog.json.
