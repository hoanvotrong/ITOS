/* An Ninh — placeholder cho các màn hình P1/P2 chưa triển khai */

const SecComingSoon = ({ title, note }) => (
  <div className="page">
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        <div className="sub">Màn hình đang được thiết kế trong đợt tiếp theo</div>
      </div>
    </div>
    <div className="card" style={{ padding: "56px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🚧</div>
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{title} sẽ sớm ra mắt</div>
      <div className="muted" style={{ fontSize: 13, maxWidth: 420, margin: "0 auto" }}>{note}</div>
    </div>
  </div>
);

window.SecComingSoon = SecComingSoon;
