/* An Ninh — Báo cáo */

const SecReportsScreen = () => {
  const weeklyRows = [
    { label: "Tuần 27 (29/06 – 05/07)", people: 2180, vehicles: 512, incidents: 9 },
    { label: "Tuần 26 (22/06 – 28/06)", people: 2094, vehicles: 498, incidents: 6 },
    { label: "Tuần 25 (15/06 – 21/06)", people: 2240, vehicles: 540, incidents: 11 },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Báo cáo</h1>
          <div className="sub">Tổng hợp lưu lượng ra/vào & sự cố theo tuần</div>
        </div>
        <div className="actions">
          <button className="btn accent"><Icon name="download" size={14}/> Xuất báo cáo tuần này</button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "#1E5FB7" }}></span>Người ra/vào tuần này</div>
          <div className="val">{SEC_STATS.today.value * 6} <small>lượt</small></div>
          <div className="delta up"><Icon name="arrowUp" size={12}/> 4,1% so tuần trước</div>
        </div>
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "#16A34A" }}></span>Xe ra/vào tuần này</div>
          <div className="val">512 <small>lượt</small></div>
          <div className="delta up"><Icon name="arrowUp" size={12}/> 2,8% so tuần trước</div>
        </div>
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "#B45309" }}></span>Sự cố tuần này</div>
          <div className="val">{SEC_INCIDENTS.length} <small>vụ</small></div>
          <div className="delta">{SEC_INCIDENTS.filter(i => i.status !== "resolved").length} chưa đóng</div>
        </div>
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "#7C5BE0" }}></span>LPR accuracy TB</div>
          <div className="val">{SEC_STATS.lpr.value} <small>%</small></div>
          <div className="delta up"><Icon name="arrowUp" size={12}/> {SEC_STATS.lpr.delta}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Báo cáo tuần gần đây</h3>
          <div className="sub">Bấm để xuất Excel/PDF cho tuần cụ thể</div>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Kỳ báo cáo</th>
                <th style={{ width: 140, textAlign: "right" }}>Lượt người</th>
                <th style={{ width: 120, textAlign: "right" }}>Lượt xe</th>
                <th style={{ width: 100, textAlign: "right" }}>Sự cố</th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {weeklyRows.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{r.label}</td>
                  <td className="mono" style={{ textAlign: "right" }}>{r.people.toLocaleString("vi-VN")}</td>
                  <td className="mono" style={{ textAlign: "right" }}>{r.vehicles.toLocaleString("vi-VN")}</td>
                  <td className="mono" style={{ textAlign: "right" }}>{r.incidents}</td>
                  <td><button className="icon-btn"><Icon name="download" size={14}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

window.SecReportsScreen = SecReportsScreen;
