import { useMemo, useState } from "react";
import "./App.css";

const navigation = [
  { label: "Dashboard", icon: "bi-grid-1x2-fill" },
  { label: "Data Mahasiswa", icon: "bi-people" },
  { label: "Data Akademik", icon: "bi-book" },
  { label: "Matkul", icon: "bi-journal-text" },
  { label: "Data Nilai", icon: "bi-bar-chart" },
];

const users = [
  {
    initials: "NA",
    name: "Nadia Aulia",
    email: "nadia.aulia@email.com",
    date: "10 Nov 2026",
    NIM: "251185023",
    status: "Aktif",
    tone: "rose",
  },
  {
    initials: "RF",
    name: "Rizky Firmansyah",
    email: "rizky.f@email.com",
    date: "09 Nov 2026",
    NIM: "251185024",
    status: "Aktif",
    tone: "blue",
  },
  {
    initials: "SP",
    name: "Sarah Putri",
    email: "sarah.putri@email.com",
    date: "08 Nov 2026",
    NIM: "251185025",
    status: "Menunggu",
    tone: "lilac",
  },
  {
    initials: "DA",
    name: "Dimas Ardiansyah",
    email: "dimas.a@email.com",
    date: "07 Nov 2026",
    NIM: "251185026",
    status: "Aktif",
    tone: "green",
  },
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
        `${user.name} ${user.email}`
          .toLowerCase()
          .includes(search.toLowerCase()),
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
        <a
          className="brand"
          href="#dashboard"
          onClick={() => setActivePage("Dashboard")}
        >
          <span className="brand-mark">
            <i className="bi bi-flower1" />
          </span>
          <span>
            UN<span className="brand-light">KIR</span>
          </span>
        </a>

        <div className="workspace-switcher">
          <span className="workspace-avatar">
            <i className="bi bi-buildings" />
          </span>
          <span className="workspace-copy">
            <strong>Universitas Kikir</strong>
            <small>Workspace</small>
          </span>
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
          <button
            className="nav-item"
            onClick={() => setActivePage("Pengaturan")}
          >
            <i className="bi bi-gear" />
            <span>Pengaturan</span>
          </button>
          <button className="nav-item" onClick={() => setActivePage("Bantuan")}>
            <i className="bi bi-question-circle" />
            <span>Pusat bantuan</span>
          </button>
        </nav>

        <div className="sidebar-spacer" />
        <div className="upgrade-card">
          <span className="upgrade-icon">
            <i className="bi bi-stars" />
          </span>
          <strong>Ingin lebih banyak?</strong>
          <p>Upgrade ke paket Pro dan kembangkan bisnismu.</p>
          <button onClick={() => setActivePage("Paket Pro")}>
            Lihat paket <i className="bi bi-arrow-up-right" />
          </button>
          <span className="upgrade-decoration decoration-one" />
          <span className="upgrade-decoration decoration-two" />
        </div>
        <button
          className="sidebar-profile"
          onClick={() => setShowProfile(!showProfile)}
        >
          <span className="profile-avatar">AD</span>
          <span className="profile-copy">
            <strong>Admin Dinda</strong>
            <small>Administrator</small>
          </span>
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
          <div className="breadcrumb">
            <span>Workspace</span>
            <i className="bi bi-chevron-right" />
            <strong>{activePage}</strong>
          </div>
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
                <i className="bi bi-bell" />
                <span className="notification-dot" />
              </button>
              {showNotifications && (
                <div className="top-popover notification-popover">
                  <strong>Notifikasi</strong>
                  <p>
                    <span className="notice-dot" />
                    Ada 4 pesanan baru yang perlu ditinjau.
                  </p>
                  <p>
                    <span className="notice-dot notice-dot-soft" />
                    Sarah Putri baru bergabung.
                  </p>
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
                <span className="top-profile-copy">
                  <strong>Admin Dinda</strong>
                  <small>Admin</small>
                </span>
                <i className="bi bi-chevron-down" />
              </button>
              {showProfile && (
                <div className="top-popover profile-popover">
                  <strong>Admin Dinda</strong>
                  <button onClick={() => setActivePage("Pengaturan")}>
                    Pengaturan akun
                  </button>
                  <button onClick={() => setActivePage("Keluar")}>
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" /> DASHBOARD
              </div>
              <h1>
                Selamat Datang, Admin Dinda <span className="wave">✦</span>
              </h1>
            </div>
            <div className="welcome-date">
              <i className="bi bi-calendar3" />
              {formattedDate}
            </div>
          </section>

          <section className="stats-grid" aria-label="Ringkasan statistik">
            <article className="stat-card">
              <div className="stat-heading">
                <span>Jumlah Mahasiswa</span>
                <span className="stat-icon sage">
                  <i className="bi bi-wallet2" />
                </span>
              </div>
              <strong className="stat-value">Rp 24.580.000</strong>
              <div className="stat-foot">
                <span className="trend positive">
                  <i className="bi bi-arrow-up-right" /> 12,8%
                </span>
                <span>dari bulan lalu</span>
                <span className="stat-spark spark-one" />
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-heading">
                <span>Total Pengguna</span>
                <span className="stat-icon sand">
                  <i className="bi bi-people" />
                </span>
              </div>
              <strong className="stat-value">1.284</strong>
              <div className="stat-foot">
                <span className="trend positive">
                  <i className="bi bi-arrow-up-right" /> 8,2%
                </span>
                <span>dari bulan lalu</span>
                <span className="stat-spark spark-two" />
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-heading">
                <span>Total Pesanan</span>
                <span className="stat-icon blush">
                  <i className="bi bi-bag-check" />
                </span>
              </div>
              <strong className="stat-value">856</strong>
              <div className="stat-foot">
                <span className="trend positive">
                  <i className="bi bi-arrow-up-right" /> 4,6%
                </span>
                <span>dari bulan lalu</span>
                <span className="stat-spark spark-three" />
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-heading">
                <span>Produk Terjual</span>
                <span className="stat-icon lilac">
                  <i className="bi bi-box-seam" />
                </span>
              </div>
              <strong className="stat-value">2.456</strong>
              <div className="stat-foot">
                <span className="trend negative">
                  <i className="bi bi-arrow-down-right" /> 2,1%
                </span>
                <span>dari bulan lalu</span>
                <span className="stat-spark spark-four" />
              </div>
            </article>
          </section>

          <footer className="dashboard-footer">
            <span>© Universitas Kikir</span>
            <span>
              Dibuat dengan <i className="bi bi-heart-fill" /> untuk bisnismu
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
