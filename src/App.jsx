import { useMemo, useState } from "react";
import "./App.css";

const navigation = [
  { label: "Dashboard", icon: "bi-grid-1x2-fill" },
  { label: "Pengguna", icon: "bi-people" },
  { label: "Produk", icon: "bi-box-seam" },
  { label: "Pesanan", icon: "bi-bag" },
  { label: "Laporan", icon: "bi-bar-chart" },
];

const users = [
  { initials: "NA", name: "Nadia Aulia", email: "nadia.aulia@email.com", date: "10 Nov 2026", plan: "Premium", status: "Aktif", tone: "rose" },
  { initials: "RF", name: "Rizky Firmansyah", email: "rizky.f@email.com", date: "09 Nov 2026", plan: "Basic", status: "Aktif", tone: "blue" },
  { initials: "SP", name: "Sarah Putri", email: "sarah.putri@email.com", date: "08 Nov 2026", plan: "Premium", status: "Menunggu", tone: "lilac" },
  { initials: "DA", name: "Dimas Ardiansyah", email: "dimas.a@email.com", date: "07 Nov 2026", plan: "Basic", status: "Aktif", tone: "green" },
];

const chartBars = [
  { month: "Mei", value: 42, previous: 30 },
  { month: "Jun", value: 58, previous: 43 },
  { month: "Jul", value: 48, previous: 35 },
  { month: "Agu", value: 72, previous: 53 },
  { month: "Sep", value: 63, previous: 42 },
  { month: "Okt", value: 86, previous: 60 },
  { month: "Nov", value: 70, previous: 50 },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("7 bulan terakhir");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="dashboard-shell">
      {mobileNavOpen && (
        <button
          aria-label="Tutup menu"
          className="sidebar-backdrop"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <a className="brand" href="#dashboard" onClick={() => setActivePage("Dashboard")}>
          <span className="brand-mark"><i className="bi bi-flower1" /></span>
          <span>ruang<span className="brand-light">tumbuh</span></span>
        </a>

        <div className="workspace-switcher">
          <span className="workspace-avatar"><i className="bi bi-buildings" /></span>
          <span className="workspace-copy"><strong>Ruang Tumbuh</strong><small>Workspace</small></span>
          <i className="bi bi-chevron-expand workspace-chevron" />
        </div>

        <p className="nav-caption">MENU UTAMA</p>
        <nav className="side-nav" aria-label="Navigasi utama">
          {navigation.map((item) => (
            <button
              className={`nav-item ${activePage === item.label ? "active" : ""}`}
              key={item.label}
              onClick={() => {
                setActivePage(item.label);
                setMobileNavOpen(false);
              }}
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
              {item.label === "Pesanan" && <span className="nav-count">4</span>}
            </button>
          ))}
        </nav>

        <p className="nav-caption nav-caption-tools">PREFERENSI</p>
        <nav className="side-nav" aria-label="Preferensi">
          <button className="nav-item" onClick={() => setActivePage("Pengaturan")}>
            <i className="bi bi-gear" /><span>Pengaturan</span>
          </button>
          <button className="nav-item" onClick={() => setActivePage("Bantuan")}>
            <i className="bi bi-question-circle" /><span>Pusat bantuan</span>
          </button>
        </nav>

        <div className="sidebar-spacer" />
        <div className="upgrade-card">
          <span className="upgrade-icon"><i className="bi bi-stars" /></span>
          <strong>Ingin lebih banyak?</strong>
          <p>Upgrade ke paket Pro dan kembangkan bisnismu.</p>
          <button onClick={() => setActivePage("Paket Pro")}>Lihat paket <i className="bi bi-arrow-up-right" /></button>
          <span className="upgrade-decoration decoration-one" />
          <span className="upgrade-decoration decoration-two" />
        </div>
        <button className="sidebar-profile" onClick={() => setShowProfile(!showProfile)}>
          <span className="profile-avatar">AD</span>
          <span className="profile-copy"><strong>Admin Dinda</strong><small>Administrator</small></span>
          <i className="bi bi-three-dots" />
        </button>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <button
            aria-label="Buka menu"
            className="mobile-menu-button"
            onClick={() => setMobileNavOpen(true)}
          >
            <i className="bi bi-list" />
          </button>
          <div className="breadcrumb"><span>Workspace</span><i className="bi bi-chevron-right" /><strong>{activePage}</strong></div>
          <div className="topbar-actions">
            <label className="search-box">
              <i className="bi bi-search" />
              <input
                aria-label="Cari pengguna"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari sesuatu..."
                value={search}
              />
              <kbd>⌘ K</kbd>
            </label>
            <div className="popover-wrap">
              <button
                aria-label="Notifikasi"
                aria-expanded={showNotifications}
                className="icon-button notification-button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfile(false);
                }}
              >
                <i className="bi bi-bell" /><span className="notification-dot" />
              </button>
              {showNotifications && (
                <div className="top-popover notification-popover">
                  <strong>Notifikasi</strong>
                  <p><span className="notice-dot" />Ada 4 pesanan baru yang perlu ditinjau.</p>
                  <p><span className="notice-dot notice-dot-soft" />Sarah Putri baru bergabung.</p>
                </div>
              )}
            </div>
            <div className="topbar-divider" />
            <div className="popover-wrap">
              <button
                aria-expanded={showProfile}
                className="top-profile"
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowNotifications(false);
                }}
              >
                <span className="profile-avatar">AD</span>
                <span className="top-profile-copy"><strong>Admin Dinda</strong><small>Admin</small></span>
                <i className="bi bi-chevron-down" />
              </button>
              {showProfile && (
                <div className="top-popover profile-popover">
                  <strong>Admin Dinda</strong>
                  <button onClick={() => setActivePage("Pengaturan")}>Pengaturan akun</button>
                  <button onClick={() => setActivePage("Keluar")}>Keluar</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-dot" /> DASHBOARD OVERVIEW</div>
              <h1>Selamat pagi, Dinda <span className="wave">✦</span></h1>
              <p className="welcome-subtitle">Berikut yang sedang terjadi di tokomu hari ini.</p>
            </div>
            <div className="welcome-date"><i className="bi bi-calendar3" />{formattedDate}</div>
          </section>

          <section className="stats-grid" aria-label="Ringkasan statistik">
            <article className="stat-card">
              <div className="stat-heading"><span>Total Pendapatan</span><span className="stat-icon sage"><i className="bi bi-wallet2" /></span></div>
              <strong className="stat-value">Rp 24.580.000</strong>
              <div className="stat-foot"><span className="trend positive"><i className="bi bi-arrow-up-right" /> 12,8%</span><span>dari bulan lalu</span><span className="stat-spark spark-one" /></div>
            </article>
            <article className="stat-card">
              <div className="stat-heading"><span>Total Pengguna</span><span className="stat-icon sand"><i className="bi bi-people" /></span></div>
              <strong className="stat-value">1.284</strong>
              <div className="stat-foot"><span className="trend positive"><i className="bi bi-arrow-up-right" /> 8,2%</span><span>dari bulan lalu</span><span className="stat-spark spark-two" /></div>
            </article>
            <article className="stat-card">
              <div className="stat-heading"><span>Total Pesanan</span><span className="stat-icon blush"><i className="bi bi-bag-check" /></span></div>
              <strong className="stat-value">856</strong>
              <div className="stat-foot"><span className="trend positive"><i className="bi bi-arrow-up-right" /> 4,6%</span><span>dari bulan lalu</span><span className="stat-spark spark-three" /></div>
            </article>
            <article className="stat-card">
              <div className="stat-heading"><span>Produk Terjual</span><span className="stat-icon lilac"><i className="bi bi-box-seam" /></span></div>
              <strong className="stat-value">2.456</strong>
              <div className="stat-foot"><span className="trend negative"><i className="bi bi-arrow-down-right" /> 2,1%</span><span>dari bulan lalu</span><span className="stat-spark spark-four" /></div>
            </article>
          </section>

          <section className="analytics-grid">
            <article className="panel revenue-panel">
              <div className="panel-heading">
                <div><h2>Ringkasan pendapatan</h2><p>Pantau performa penjualan tokomu.</p></div>
                <label className="select-wrap">
                  <select aria-label="Periode grafik" onChange={(event) => setPeriod(event.target.value)} value={period}>
                    <option>7 bulan terakhir</option><option>30 hari terakhir</option><option>Tahun ini</option>
                  </select><i className="bi bi-chevron-down" />
                </label>
              </div>
              <div className="revenue-total"><strong>Rp 24.580.000</strong><span className="trend positive"><i className="bi bi-arrow-up-right" /> 12,8%</span></div>
              <p className="chart-caption">Total pendapatan <span>·</span> {period}</p>
              <div className="chart-legend"><span><i className="legend-dot current" /> Tahun ini</span><span><i className="legend-dot previous" /> Tahun lalu</span></div>
              <div className="bar-chart" role="img" aria-label="Grafik pendapatan Mei sampai November">
                <div className="chart-y-labels"><span>Rp 30 jt</span><span>Rp 20 jt</span><span>Rp 10 jt</span><span>Rp 0</span></div>
                <div className="chart-plot">
                  <div className="chart-grid-lines"><span /><span /><span /><span /></div>
                  <div className="bar-groups">
                    {chartBars.map((bar) => (
                      <div className="bar-group" key={bar.month}>
                        <div className="bar-pair">
                          <span className="bar previous-bar" style={{ height: `${bar.previous}%` }} />
                          <span className="bar current-bar" style={{ height: `${bar.value}%` }} />
                        </div>
                        <span className="bar-label">{bar.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article className="panel source-panel">
              <div className="panel-heading"><div><h2>Sumber pengunjung</h2><p>Asal pengunjung tokomu</p></div><button aria-label="Pilihan sumber pengunjung" className="subtle-icon"><i className="bi bi-three-dots" /></button></div>
              <div className="donut-wrap">
                <div className="donut-chart"><div className="donut-center"><strong>8.549</strong><span>Total pengunjung</span></div></div>
              </div>
              <div className="source-list">
                <div><span className="source-name"><i className="source-marker marker-sage" />Instagram</span><strong>42% <small>3.590</small></strong></div>
                <div><span className="source-name"><i className="source-marker marker-sand" />Pencarian</span><strong>28% <small>2.394</small></strong></div>
                <div><span className="source-name"><i className="source-marker marker-cream" />TikTok</span><strong>18% <small>1.539</small></strong></div>
                <div><span className="source-name"><i className="source-marker marker-muted" />Lainnya</span><strong>12% <small>1.026</small></strong></div>
              </div>
            </article>
          </section>

          <section className="panel users-panel">
            <div className="panel-heading users-heading">
              <div><h2>Pengguna terbaru</h2><p>Lihat aktivitas pengguna yang baru bergabung.</p></div>
              <button className="text-button" onClick={() => setActivePage("Pengguna")}>Lihat semua <i className="bi bi-arrow-right" /></button>
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr><th>PENGGUNA</th><th>TANGGAL BERGABUNG</th><th>PAKET</th><th>STATUS</th><th /></tr></thead>
                <tbody>
                  {filteredUsers.length ? filteredUsers.map((user) => (
                    <tr key={user.email}>
                      <td><div className="user-cell"><span className={`user-avatar ${user.tone}`}>{user.initials}</span><span><strong>{user.name}</strong><small>{user.email}</small></span></div></td>
                      <td>{user.date}</td>
                      <td><span className={`plan-badge ${user.plan === "Premium" ? "premium" : ""}`}>{user.plan}</span></td>
                      <td><span className={`status-badge ${user.status === "Aktif" ? "status-active" : "status-pending"}`}><i />{user.status}</span></td>
                      <td><button aria-label={`Pilihan untuk ${user.name}`} className="row-menu"><i className="bi bi-three-dots" /></button></td>
                    </tr>
                  )) : <tr><td className="empty-state" colSpan="5">Tidak ada pengguna yang cocok dengan “{search}”.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
          <footer className="dashboard-footer"><span>© 2024 Ruang Tumbuh</span><span>Dibuat dengan <i className="bi bi-heart-fill" /> untuk bisnismu</span></footer>
        </div>
      </main>
    </div>
  );
}

export default App;
