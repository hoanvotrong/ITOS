/* An Ninh — Người & Xe hiện đang trong cảng */

const SecPresenceScreen = () => {
  const [tab, setTab] = React.useState("people");

  return (
    <div className="page" style={{ paddingTop: 28 }}>
      <div className="page-head">
        <div>
          <h1>Người & Xe trong cảng</h1>
          <div className="sub">Hiện diện thời gian thực · cập nhật lúc 09:12</div>
        </div>
        <div className="actions">
          <button className="btn"><Icon name="download" size={14}/> Xuất Excel</button>
        </div>
      </div>

      <div className="card">
        <div className="tabs">
          <div className={`tab ${tab === "people" ? "active" : ""}`} onClick={() => setTab("people")}>
            Người <span className="count">{SEC_PEOPLE_IN.length}</span>
          </div>
          <div className={`tab ${tab === "vehicles" ? "active" : ""}`} onClick={() => setTab("vehicles")}>
            Xe <span className="count">{SEC_VEHICLES_IN.length}</span>
          </div>
        </div>

        {tab === "people" ? (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Họ tên / Nhóm</th>
                  <th style={{ width: 110 }}>Loại</th>
                  <th style={{ width: 180 }}>CCCD/CMND</th>
                  <th style={{ width: 160 }}>Người bảo lãnh</th>
                  <th style={{ width: 100 }}>Cổng vào</th>
                  <th style={{ width: 90 }}>Giờ vào</th>
                </tr>
              </thead>
              <tbody>
                {SEC_PEOPLE_IN.map(p => (
                  <tr key={p.id}>
                    <td style={{ paddingTop: 10, paddingBottom: 10 }}>
                      <div style={{ fontWeight: 500, fontSize: 13.5 }}>{p.name}</div>
                      <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>{p.org}</div>
                    </td>
                    <td><span className="badge neutral">{p.type}</span></td>
                    <td className="mono" style={{ fontSize: 12 }}>{p.idNo}</td>
                    <td style={{ fontSize: 13 }}>{personById(p.host).name}</td>
                    <td style={{ fontSize: 13 }}>{p.gate}</td>
                    <td className="mono" style={{ fontSize: 12 }}>{p.checkIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Biển số</th>
                  <th style={{ width: 130 }}>Loại xe</th>
                  <th>Mục đích</th>
                  <th style={{ width: 160 }}>Tài xế</th>
                  <th style={{ width: 110 }}>Ưu tiên</th>
                  <th style={{ width: 100 }}>Cổng vào</th>
                  <th style={{ width: 90 }}>Giờ vào</th>
                </tr>
              </thead>
              <tbody>
                {SEC_VEHICLES_IN.map(v => (
                  <tr key={v.id}>
                    <td className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{v.plate}
                      <div className="muted" style={{ fontSize: 11, fontFamily: "var(--font-sans)", fontWeight: 400, marginTop: 2 }}>{v.org}</div>
                    </td>
                    <td style={{ fontSize: 13 }}>{v.type}</td>
                    <td style={{ fontSize: 12.5 }}>{v.purpose}</td>
                    <td style={{ fontSize: 13 }}>{v.driver}</td>
                    <td>
                      <span className={`tag ${v.priority === "priority" ? "priority-high" : "priority-normal"}`}>
                        {v.priority === "priority" ? "Ưu tiên" : "Thường"}
                      </span>
                    </td>
                    <td style={{ fontSize: 13 }}>{v.gate}</td>
                    <td className="mono" style={{ fontSize: 12 }}>{v.checkIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--line)", fontSize: 12.5, color: "var(--t-secondary)" }}>
          {tab === "people" ? `${SEC_PEOPLE_IN.length} người` : `${SEC_VEHICLES_IN.length} xe`} đang trong cảng
        </div>
      </div>
    </div>
  );
};

window.SecPresenceScreen = SecPresenceScreen;
