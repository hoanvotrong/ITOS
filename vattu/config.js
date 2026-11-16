/* Cấu hình app kiểm kê vật tư.
   Lấy SUPABASE_URL và SUPABASE_ANON_KEY giống /warehouse (cùng project).
   Để trống cả hai → chế độ CHẠY THỬ: dữ liệu lưu trên máy, không cần đăng nhập. */
window.VT_CONFIG = {
  SUPABASE_URL: "https://wpnuwxjvenbeojepqati.supabase.co",
  // Khoá anon / publishable (được phép công khai). TUYỆT ĐỐI không dán khoá service_role.
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbnV3eGp2ZW5iZW9qZXBxYXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NDAyNDEsImV4cCI6MjEwODIxNjI0MX0.vYe10FzylX3Mwp3rvnWObZAcHwPWiYTQFLrsPsv4bYY",
};
