import { useMemo, useState } from "react";
import "./App.css";

const navigation = [
  { label: "Dashboard", icon: "bi-grid-1x2-fill" },
  { label: "Data Mahasiswa", icon: "bi-people" },
  { label: "Data Akademik", icon: "bi-book" },
  { label: "Matkul", icon: "bi-journal-text" },
  { label: "Data Nilai", icon: "bi-bar-chart" },
];

const users_mahasiswa = [
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

const users_dosen = [
  {
    initials: "AB",
    name: "Andi Budi",
    email: "andi.budi@email.com",
    date: "05 Nov 2026",
    NIDN: "1234567890",
    status: "Aktif",
    tone: "indigo",
  },
  {
    initials: "CD",
    name: "Citra Dewi",
    email: "citra.d@email.com",
    date: "04 Nov 2026",
    NIDN: "0987654321",
    status: "Aktif",
    tone: "teal",
  },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState(users_mahasiswa);
  const [lecturers, setLecturers] = useState(users_dosen);
  const [addType, setAddType] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const filteredStudents = useMemo(
    () =>
      students.filter((student) =>
        `${student.name} ${student.email} ${student.NIM}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search, students],
  );
  const filteredLecturers = useMemo(
    () =>
      lecturers.filter((lecturer) =>
        `${lecturer.name} ${lecturer.email} ${lecturer.NIDN}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search, lecturers],
  );

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  function handleAddPerson(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const identity = formData.get("identity").trim();
    const initials = name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
    const person = {
      initials,
      name,
      email,
      date: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date()),
      status: "Aktif",
      tone: addType === "mahasiswa" ? "blue" : "teal",
      [addType === "mahasiswa" ? "NIM" : "NIDN"]: identity,
    };

    if (addType === "mahasiswa") {
      setStudents((currentStudents) => [person, ...currentStudents]);
    } else {
      setLecturers((currentLecturers) => [person, ...currentLecturers]);
    }

    setAddType("");
    event.currentTarget.reset();
  }

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
              {item.label === "Data Mahasiswa" && (
                <span className="nav-count">{students.length}</span>
              )}
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

          <section
            className="stats-grid people-stats"
            aria-label="Ringkasan data"
          >
            <article className="stat-card people-stat-card">
              <div className="stat-heading">
                <span>Jumlah Mahasiswa</span>
                <span className="stat-icon sage">
                  <i className="bi bi-mortarboard" />
                </span>
              </div>
              <strong className="stat-value">{students.length}</strong>
              <div className="people-stat-foot">
                <span>Data mahasiswa terdaftar</span>
                <button
                  className="add-person-button"
                  onClick={() => setAddType("mahasiswa")}
                >
                  <i className="bi bi-plus-lg" /> Tambah mahasiswa
                </button>
              </div>
            </article>
            <article className="stat-card people-stat-card">
              <div className="stat-heading">
                <span>Jumlah Dosen</span>
                <span className="stat-icon sand">
                  <i className="bi bi-person-workspace" />
                </span>
              </div>
              <strong className="stat-value">{lecturers.length}</strong>
              <div className="people-stat-foot">
                <span>Data dosen terdaftar</span>
                <button
                  className="add-person-button"
                  onClick={() => setAddType("dosen")}
                >
                  <i className="bi bi-plus-lg" /> Tambah dosen
                </button>
              </div>
            </article>
          </section>

          <section className="people-list-grid" aria-label="Data terbaru">
            <article className="panel people-list-panel">
              <div className="panel-heading people-list-heading">
                <div>
                  <h2>Data mahasiswa</h2>
                  <p>{students.length} mahasiswa terdaftar</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setAddType("mahasiswa")}
                >
                  <i className="bi bi-plus-lg" /> Tambah
                </button>
              </div>
              <div className="people-list">
                {filteredStudents.length ? (
                  filteredStudents.map((student) => (
                    <div className="person-row" key={`student-${student.NIM}`}>
                      <span className={`user-avatar ${student.tone}`}>
                        {student.initials}
                      </span>
                      <span className="person-details">
                        <strong>{student.name}</strong>
                        <small>
                          {student.NIM} · {student.email}
                        </small>
                      </span>
                      <span className="status-badge status-active">
                        <i />
                        {student.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="empty-people">Mahasiswa tidak ditemukan.</p>
                )}
              </div>
            </article>
            <article className="panel people-list-panel">
              <div className="panel-heading people-list-heading">
                <div>
                  <h2>Data dosen</h2>
                  <p>{lecturers.length} dosen terdaftar</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setAddType("dosen")}
                >
                  <i className="bi bi-plus-lg" /> Tambah
                </button>
              </div>
              <div className="people-list">
                {filteredLecturers.length ? (
                  filteredLecturers.map((lecturer) => (
                    <div
                      className="person-row"
                      key={`lecturer-${lecturer.NIDN}`}
                    >
                      <span className={`user-avatar ${lecturer.tone}`}>
                        {lecturer.initials}
                      </span>
                      <span className="person-details">
                        <strong>{lecturer.name}</strong>
                        <small>
                          {lecturer.NIDN} · {lecturer.email}
                        </small>
                      </span>
                      <span className="status-badge status-active">
                        <i />
                        {lecturer.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="empty-people">Dosen tidak ditemukan.</p>
                )}
              </div>
            </article>
          </section>

          {addType && (
            <div
              className="modal-backdrop"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setAddType("");
              }}
            >
              <section
                aria-labelledby="add-person-title"
                aria-modal="true"
                className="add-person-modal"
                role="dialog"
              >
                <div className="modal-heading">
                  <div>
                    <span className="modal-icon">
                      <i
                        className={`bi ${addType === "mahasiswa" ? "bi-mortarboard" : "bi-person-workspace"}`}
                      />
                    </span>
                    <h2 id="add-person-title">Tambah {addType}</h2>
                    <p>Lengkapi informasi {addType} baru.</p>
                  </div>
                  <button
                    aria-label="Tutup form"
                    className="modal-close"
                    onClick={() => setAddType("")}
                  >
                    <i className="bi bi-x-lg" />
                  </button>
                </div>
                <form className="add-person-form" onSubmit={handleAddPerson}>
                  <label>
                    Nama lengkap
                    <input
                      autoFocus
                      name="name"
                      placeholder="Contoh: Budi Santoso"
                      required
                    />
                  </label>
                  <label>
                    Email
                    <input
                      name="email"
                      placeholder="nama@email.com"
                      required
                      type="email"
                    />
                  </label>
                  <label>
                    {addType === "mahasiswa" ? "NIM" : "NIDN"}
                    <input
                      name="identity"
                      placeholder={
                        addType === "mahasiswa"
                          ? "Masukkan NIM"
                          : "Masukkan NIDN"
                      }
                      required
                    />
                  </label>
                  <div className="modal-actions">
                    <button
                      className="modal-cancel"
                      onClick={() => setAddType("")}
                      type="button"
                    >
                      Batal
                    </button>
                    <button className="modal-submit" type="submit">
                      <i className="bi bi-plus-lg" /> Simpan {addType}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}

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
