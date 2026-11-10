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
    program: "Informatika",
    semester: 5,
    courses: ["Pemrograman Web", "Basis Data"],
    advisor: "Andi Budi",
    status: "Aktif",
    tone: "rose",
    IPK: 3.75,
  },
  {
    initials: "RF",
    name: "Rizky Firmansyah",
    email: "rizky.f@email.com",
    date: "09 Nov 2026",
    NIM: "251185024",
    program: "Sistem Informasi",
    semester: 3,
    courses: ["Basis Data"],
    advisor: "Citra Dewi",
    status: "Aktif",
    tone: "blue",
    IPK: 3.45,
  },
  {
    initials: "SP",
    name: "Sarah Putri",
    email: "sarah.putri@email.com",
    date: "08 Nov 2026",
    NIM: "251185025",
    program: "Informatika",
    semester: 5,
    courses: ["Algoritma dan Struktur Data", "Pemrograman Web"],
    advisor: "Andi Budi",
    status: "Menunggu",
    tone: "lilac",
    IPK: 3.6,
  },
  {
    initials: "DA",
    name: "Dimas Ardiansyah",
    email: "dimas.a@email.com",
    date: "07 Nov 2026",
    NIM: "251185026",
    program: "Teknik Informatika",
    semester: 7,
    courses: ["Algoritma dan Struktur Data"],
    advisor: "Citra Dewi",
    status: "Aktif",
    tone: "green",
    IPK: 3.9,
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

const matkul = [
  {
    nama: "Pemrograman Web",
    kode: "PW101",
    dosen: "Andi Budi",
  },
  {
    nama: "Basis Data",
    kode: "BD102",
    dosen: "Citra Dewi",
  },
  {
    nama: "Algoritma dan Struktur Data",
    kode: "ASD103",
    dosen: "Andi Budi",
  },
];

function App() {
  const [activePage, setActivePage] = useState("Data Mahasiswa");
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState(users_mahasiswa);
  const [lecturers] = useState(users_dosen);
  const [courses] = useState(matkul);
  const [addType, setAddType] = useState("");
  const [editingNim, setEditingNim] = useState("");
  const [studentFormError, setStudentFormError] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua status");
  const [programFilter, setProgramFilter] = useState("Semua program studi");
  const [courseFilter, setCourseFilter] = useState("Semua mata kuliah");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const filteredStudents = useMemo(
    () =>
      students.filter((student) => {
        const matchesSearch =
          `${student.name} ${student.email} ${student.NIM} ${student.advisor} ${student.program}`
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesStatus =
          statusFilter === "Semua status" || student.status === statusFilter;
        const matchesProgram =
          programFilter === "Semua program studi" ||
          student.program === programFilter;
        const matchesCourse =
          courseFilter === "Semua mata kuliah" ||
          student.courses.includes(courseFilter);
        return (
          matchesSearch && matchesStatus && matchesProgram && matchesCourse
        );
      }),
    [courseFilter, programFilter, search, statusFilter, students],
  );
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const editingStudent = students.find((student) => student.NIM === editingNim);

  function handleStudentSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const NIM = formData.get("identity").trim();
    if (
      students.some(
        (student) => student.NIM === NIM && student.NIM !== editingNim,
      )
    ) {
      setStudentFormError("NIM tersebut sudah terdaftar.");
      return;
    }
    const initials = name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
    const student = {
      initials,
      name,
      email,
      date: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date()),
      NIM,
      program: formData.get("program"),
      semester: Number(formData.get("semester")),
      courses: formData.getAll("courses"),
      advisor: formData.get("advisor"),
      status: formData.get("status"),
      tone: editingNim
        ? (students.find((item) => item.NIM === editingNim)?.tone ?? "blue")
        : "blue",
    };

    if (editingNim) {
      setStudents((currentStudents) =>
        currentStudents.map((item) =>
          item.NIM === editingNim ? student : item,
        ),
      );
    } else {
      setStudents((currentStudents) => [student, ...currentStudents]);
    }

    form.reset();
    setAddType("");
    setEditingNim("");
    setStudentFormError("");
  }

  function openAddStudent() {
    setEditingNim("");
    setStudentFormError("");
    setAddType("mahasiswa");
  }

  function openEditStudent(student) {
    setEditingNim(student.NIM);
    setStudentFormError("");
    setAddType("mahasiswa");
  }

  function closeStudentModal() {
    setAddType("");
    setEditingNim("");
    setStudentFormError("");
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
              {item.label === "Matkul" && (
                <span className="nav-count">{courses.length}</span>
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
          <section className="welcome-row student-page-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" /> AKADEMIK / MAHASISWA
              </div>
              <h1>Data Mahasiswa</h1>
              <p className="welcome-subtitle">
                Kelola profil, mata kuliah, dosen pembimbing, dan status
                akademik.
              </p>
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
                <span>Total Mahasiswa</span>
                <span className="stat-icon sage">
                  <i className="bi bi-mortarboard" />
                </span>
              </div>
              <strong className="stat-value">{students.length}</strong>
              <div className="people-stat-foot">
                <span>Mahasiswa terdaftar</span>
                <button className="add-person-button" onClick={openAddStudent}>
                  <i className="bi bi-plus-lg" /> Tambah mahasiswa
                </button>
              </div>
            </article>
            <article className="stat-card people-stat-card">
              <div className="stat-heading">
                <span>Dosen Pembimbing</span>
                <span className="stat-icon sand">
                  <i className="bi bi-person-workspace" />
                </span>
              </div>
              <strong className="stat-value">{lecturers.length}</strong>
              <div className="people-stat-foot">
                <span>{courses.length} mata kuliah tersedia</span>
                <span className="stat-support-note">Data akademik</span>
              </div>
            </article>
          </section>

          <section
            className="panel student-table-panel"
            aria-label="Tabel mahasiswa"
          >
            <div className="student-table-heading">
              <div>
                <h2>Daftar mahasiswa</h2>
                <p>Data akademik mahasiswa dan dosen pembimbing.</p>
              </div>
              <button className="primary-action" onClick={openAddStudent}>
                <i className="bi bi-plus-lg" /> Tambah mahasiswa
              </button>
            </div>

            <div className="student-toolbar">
              <label className="student-search">
                <i className="bi bi-search" />
                <input
                  aria-label="Cari mahasiswa"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nama, NIM, program studi..."
                  value={search}
                />
              </label>
              <label className="filter-select">
                <span className="visually-hidden">Filter status</span>
                <select
                  aria-label="Filter status"
                  onChange={(event) => setStatusFilter(event.target.value)}
                  value={statusFilter}
                >
                  <option>Semua status</option>
                  <option>Aktif</option>
                  <option>Menunggu</option>
                  <option>Cuti</option>
                  <option>Lulus</option>
                </select>
                <i className="bi bi-chevron-down" />
              </label>
              <label className="filter-select">
                <span className="visually-hidden">Filter program studi</span>
                <select
                  aria-label="Filter program studi"
                  onChange={(event) => setProgramFilter(event.target.value)}
                  value={programFilter}
                >
                  <option>Semua program studi</option>
                  {[...new Set(students.map((student) => student.program))].map(
                    (program) => (
                      <option key={program}>{program}</option>
                    ),
                  )}
                </select>
                <i className="bi bi-chevron-down" />
              </label>
              <label className="filter-select course-filter">
                <span className="visually-hidden">Filter mata kuliah</span>
                <select
                  aria-label="Filter mata kuliah"
                  onChange={(event) => setCourseFilter(event.target.value)}
                  value={courseFilter}
                >
                  <option>Semua mata kuliah</option>
                  {courses.map((course) => (
                    <option key={course.kode}>{course.nama}</option>
                  ))}
                </select>
                <i className="bi bi-chevron-down" />
              </label>
              <button
                className="reset-filters"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("Semua status");
                  setProgramFilter("Semua program studi");
                  setCourseFilter("Semua mata kuliah");
                }}
              >
                <i className="bi bi-arrow-counterclockwise" /> Reset
              </button>
            </div>

            <div className="student-result-count">
              Menampilkan <strong>{filteredStudents.length}</strong> dari{" "}
              <strong>{students.length}</strong> mahasiswa
            </div>
            <div className="student-table-scroll">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>MAHASISWA</th>
                    <th>PROGRAM / SEMESTER</th>
                    <th>MATA KULIAH DIAMBIL</th>
                    <th>DOSEN PEMBIMBING</th>
                    <th>STATUS</th>
                    <th>IPK</th>
                    <th>
                      <span className="visually-hidden">Aksi</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length ? (
                    filteredStudents.map((student) => (
                      <tr key={student.NIM}>
                        <td>
                          <div className="student-identity">
                            <span className={`user-avatar ${student.tone}`}>
                              {student.initials}
                            </span>
                            <span>
                              <strong>{student.name}</strong>
                              <small>
                                {student.NIM} · {student.email}
                              </small>
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="program-name">
                            {student.program}
                          </span>
                          <small className="semester-label">
                            Semester {student.semester}
                          </small>
                        </td>
                        <td>
                          <div className="course-tags">
                            {student.courses.length ? (
                              student.courses.map((course) => (
                                <span className="course-tag" key={course}>
                                  {course}
                                </span>
                              ))
                            ) : (
                              <span className="table-muted">
                                Belum mengambil
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="advisor-name">
                            <i className="bi bi-person-circle" />
                            {student.advisor}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${student.status === "Aktif" ? "status-active" : student.status === "Menunggu" ? "status-pending" : "status-inactive"}`}
                          >
                            <i />
                            {student.status}
                          </span>
                        </td>
                        <td>
                          {student.IPK ? (
                            <span className="ipk-value">
                              {student.IPK.toFixed(2)}
                            </span>
                          ) : (
                            <span className="table-muted">Belum ada</span>
                          )}
                        </td>
                        <td>
                          <button
                            aria-label={`Edit data ${student.name}`}
                            className="edit-student-button"
                            onClick={() => openEditStudent(student)}
                          >
                            <i className="bi bi-pencil" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="student-empty-state" colSpan="6">
                        <i className="bi bi-search" />
                        <strong>Mahasiswa tidak ditemukan</strong>
                        <span>
                          Ubah kata kunci atau filter untuk melihat data
                          mahasiswa.
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {addType && (
            <div
              className="modal-backdrop"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeStudentModal();
              }}
            >
              <section
                aria-labelledby="add-person-title"
                aria-modal="true"
                className="add-person-modal student-modal"
                role="dialog"
              >
                <div className="modal-heading">
                  <div>
                    <span className="modal-icon">
                      <i className="bi bi-mortarboard" />
                    </span>
                    <h2 id="add-person-title">
                      {editingStudent
                        ? "Edit data mahasiswa"
                        : "Tambah mahasiswa"}
                    </h2>
                    <p>Lengkapi informasi akademik mahasiswa.</p>
                  </div>
                  <button
                    aria-label="Tutup form"
                    className="modal-close"
                    onClick={closeStudentModal}
                  >
                    <i className="bi bi-x-lg" />
                  </button>
                </div>
                <form
                  className="add-person-form"
                  onSubmit={handleStudentSubmit}
                >
                  <div className="student-form-grid">
                    <label className="form-span-two">
                      Nama lengkap
                      <input
                        autoFocus
                        defaultValue={editingStudent?.name ?? ""}
                        name="name"
                        placeholder="Contoh: Budi Santoso"
                        required
                      />
                    </label>
                    <label>
                      NIM
                      <input
                        defaultValue={editingStudent?.NIM ?? ""}
                        name="identity"
                        placeholder="Masukkan NIM"
                        required
                      />
                    </label>
                    <label>
                      Email
                      <input
                        defaultValue={editingStudent?.email ?? ""}
                        name="email"
                        placeholder="nama@email.com"
                        required
                        type="email"
                      />
                    </label>
                    <label>
                      Program studi
                      <input
                        defaultValue={editingStudent?.program ?? ""}
                        list="program-options"
                        name="program"
                        placeholder="Contoh: Informatika"
                        required
                      />
                      <datalist id="program-options">
                        {[
                          ...new Set(
                            students.map((student) => student.program),
                          ),
                        ].map((program) => (
                          <option key={program} value={program} />
                        ))}
                      </datalist>
                    </label>
                    <label>
                      Semester
                      <select
                        defaultValue={editingStudent?.semester ?? "1"}
                        name="semester"
                        required
                      >
                        {Array.from({ length: 14 }, (_, index) => (
                          <option key={index + 1} value={index + 1}>
                            Semester {index + 1}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      IPK
                      <input
                        defaultValue={editingStudent?.IPK ?? ""}
                        name="IPK"
                        placeholder="Contoh: 3.50"
                        required
                        type="number"
                        min="0"
                        max="4"
                        step="0.01"
                      />
                    </label>
                    <label>
                      Dosen pembimbing
                      <select
                        defaultValue={
                          editingStudent?.advisor ?? lecturers[0]?.name ?? ""
                        }
                        name="advisor"
                        required
                      >
                        {lecturers.map((lecturer) => (
                          <option key={lecturer.NIDN} value={lecturer.name}>
                            {lecturer.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Status
                      <select
                        defaultValue={editingStudent?.status ?? "Aktif"}
                        name="status"
                      >
                        <option>Aktif</option>
                        <option>Menunggu</option>
                        <option>Cuti</option>
                        <option>Lulus</option>
                      </select>
                    </label>
                  </div>
                  <fieldset className="course-checkboxes">
                    <legend>Mata kuliah yang diambil</legend>
                    <div className="course-checkbox-grid">
                      {courses.map((course) => (
                        <label className="course-checkbox" key={course.kode}>
                          <input
                            defaultChecked={
                              editingStudent?.courses.includes(course.nama) ??
                              false
                            }
                            name="courses"
                            type="checkbox"
                            value={course.nama}
                          />
                          <span>
                            <strong>{course.nama}</strong>
                            <small>
                              {course.kode} · {course.dosen}
                            </small>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {studentFormError && (
                    <p className="form-error" role="alert">
                      <i className="bi bi-exclamation-circle" />
                      {studentFormError}
                    </p>
                  )}
                  <div className="modal-actions">
                    <button
                      className="modal-cancel"
                      onClick={closeStudentModal}
                      type="button"
                    >
                      Batal
                    </button>
                    <button className="modal-submit" type="submit">
                      <i
                        className={`bi ${editingStudent ? "bi-check2" : "bi-plus-lg"}`}
                      />
                      {editingStudent ? "Simpan perubahan" : "Simpan mahasiswa"}
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
