// Cấu hình kết nối Supabase (Project Settings → API).
// Để trống cả hai giá trị: ứng dụng chạy chế độ lưu riêng trên trình duyệt như trước.
// Khóa "anon / publishable" được phép công khai; quyền truy cập do bảng app_users + RLS quyết định.
// TUYỆT ĐỐI không dán khóa "service_role / secret" vào đây.
window.KHO_CONFIG = {
  supabaseUrl: 'https://wpnuwxjvenbeojepqati.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbnV3eGp2ZW5iZW9qZXBxYXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NDAyNDEsImV4cCI6MjEwODIxNjI0MX0.vYe10FzylX3Mwp3rvnWObZAcHwPWiYTQFLrsPsv4bYY',
};
