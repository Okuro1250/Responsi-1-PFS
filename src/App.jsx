import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const navigation = [
  { label: "Dashboard", icon: "bi-grid-1x2-fill" },
  { label: "Data Mahasiswa", icon: "bi-people" },
  { label: "Data Dosen", icon: "bi-people" },
  { label: "Matkul", icon: "bi-journal-text" },
];

const preferenceNavigation = [
  { label: "Pengaturan", icon: "bi-gear" },
  { label: "Pusat Bantuan", icon: "bi-question-circle" },
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
  { nama: "Pemrograman Web", kode: "PW101", dosen: "Andi Budi" },
  { nama: "Basis Data", kode: "BD102", dosen: "Citra Dewi" },
  {
    nama: "Algoritma dan Struktur Data",
    kode: "ASD103",
    dosen: "Andi Budi",
  },
];

const pageDescriptions = {
  "Data Dosen": "Area pengelolaan informasi dosen universitas.",
  Matkul: "Area pengelolaan mata kuliah dan dosen pengampu.",
  Pengaturan: "Pengaturan akun dan preferensi sistem administrator.",
  "Pusat Bantuan": "Informasi bantuan untuk penggunaan sistem akademik.",
};

function getFormattedDate() {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function StatCard({ label, value, detail, icon, tone = "sage" }) {
  return (
    <article className="stat-card">
      <div className="stat-heading">
        <span>{label}</span>
        <span className={`stat-icon ${tone}`} aria-hidden="true">
          <i className={`bi ${icon}`} />
        </span>
      </div>
      <strong className="stat-value">{value}</strong>
      <p className="stat-detail">{detail}</p>
    </article>
  );
}

function PlaceholderPage({ title, description }) {
  return (
    <section className="placeholder-panel" aria-labelledby="placeholder-title">
      <span className="placeholder-icon" aria-hidden="true">
        <i className="bi bi-layout-text-window-reverse" />
      </span>
      <h2 id="placeholder-title">{title}</h2>
      <p>{description}</p>
      <span className="placeholder-status">Konten belum tersedia</span>
    </section>
  );
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState(users_mahasiswa);

  const [recordModalType, setRecordModalType] = useState("");
  const [editingRecordId, setEditingRecordId] = useState("");
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [recordFormError, setRecordFormError] = useState("");
  const [recordNotice, setRecordNotice] = useState("");
  const [addType, setAddType] = useState("");
  const [editingNim, setEditingNim] = useState("");
  const [deletingNim, setDeletingNim] = useState("");
  const [studentFormError, setStudentFormError] = useState("");
  const [pageError, setPageError] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua status");
  const [programFilter, setProgramFilter] = useState("Semua program studi");
  const [courseFilter, setCourseFilter] = useState("Semua mata kuliah");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const profileMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);

  const lecturers = users_dosen;
  const courses = matkul;
  const editingStudent = students.find((student) => student.NIM === editingNim);
  const deletingStudent = students.find(
    (student) => student.NIM === deletingNim,
  );
  const editingRecord =
    recordModalType === "dosen"
      ? lecturers.find((lecturer) => lecturer.NIDN === editingRecordId)
      : courses.find((course) => course.kode === editingRecordId);
  const formattedDate = getFormattedDate();

  const filteredStudents = useMemo(
    () =>
      students.filter((student) => {
        const searchText = `${student.name} ${student.email} ${student.NIM} ${student.advisor || "Belum ditentukan"} ${student.program}`;
        const matchesSearch = searchText
          .toLowerCase()
          .includes(search.toLowerCase().trim());
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

  const modalOpen = Boolean(
    addType || deletingNim || recordModalType || deletingRecord,
  );
  useEffect(() => {
    if (!modalOpen) return undefined;

    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      const firstField = modalRef.current?.querySelector(
        "input:not([type='checkbox']), select, button",
      );
      firstField?.focus();
    });

    function handleModalKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setAddType("");
        setEditingNim("");
        setDeletingNim("");
        setStudentFormError("");
        setRecordModalType("");
        setEditingRecordId("");
        setDeletingRecord(null);
        setRecordFormError("");
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll(
        "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleModalKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleModalKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!showProfile && !showNotifications) return undefined;

    function handleOutsideClick(event) {
      if (
        showProfile &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
      if (
        showNotifications &&
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [showNotifications, showProfile]);

  function navigateTo(page) {
    setActivePage(page);
    setMobileNavOpen(false);
    setShowProfile(false);
    setShowNotifications(false);
    setPageError("");
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("Semua status");
    setProgramFilter("Semua program studi");
    setCourseFilter("Semua mata kuliah");
  }

  function handleStudentSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    try {
      const formData = new FormData(form);
      const name = String(formData.get("name") ?? "").trim();
      const email = String(formData.get("email") ?? "").trim();
      const NIM = String(formData.get("identity") ?? "").trim();
      const duplicateNim = students.some(
        (student) => student.NIM === NIM && student.NIM !== editingNim,
      );

      if (duplicateNim) {
        setStudentFormError("NIM tersebut sudah terdaftar.");
        return;
      }

      const currentStudent = students.find(
        (student) => student.NIM === editingNim,
      );
      const student = {
        initials: getInitials(name),
        name,
        email,
        date: new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date()),
        NIM,
        program: String(formData.get("program") ?? "").trim(),
        semester: Number(formData.get("semester")),
        courses: formData.getAll("courses").map(String),
        IPK: Number(formData.get("IPK")),
        advisor: String(formData.get("advisor") ?? ""),
        status: String(formData.get("status") ?? "Aktif"),
        tone: currentStudent?.tone ?? "blue",
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

      setPageError("");
      setAddType("");
      setEditingNim("");
      setStudentFormError("");
    } catch (error) {
      console.error("Gagal menyimpan data mahasiswa:", error);
      setStudentFormError(
        "Data mahasiswa belum berhasil disimpan. Periksa kembali isianmu.",
      );
    }
  }

  function openAddStudent() {
    previousFocusRef.current = document.activeElement;
    setEditingNim("");
    setStudentFormError("");
    setAddType("mahasiswa");
  }

  function openEditStudent(student) {
    previousFocusRef.current = document.activeElement;
    setEditingNim(student.NIM);
    setStudentFormError("");
    setAddType("mahasiswa");
  }

  function closeStudentModal() {
    setAddType("");
    setEditingNim("");
    setStudentFormError("");
  }

  function openDeleteStudent(student) {
    previousFocusRef.current = document.activeElement;
    setDeletingNim(student.NIM);
  }

  function confirmDeleteStudent() {
    if (!deletingNim) return;

    try {
      setStudents((currentStudents) =>
        currentStudents.filter((student) => student.NIM !== deletingNim),
      );
      setDeletingNim("");
      setPageError("");
    } catch (error) {
      console.error("Gagal menghapus data mahasiswa:", error);
      setPageError("Data mahasiswa gagal dihapus. Silakan coba kembali.");
      setDeletingNim("");
    }
  }

  function openAddRecord(type) {
    previousFocusRef.current = document.activeElement;
    setRecordModalType(type);
    setEditingRecordId("");
    setRecordFormError("");
    setRecordNotice("");
  }

  function openEditRecord(type, record) {
    previousFocusRef.current = document.activeElement;
    setRecordModalType(type);
    setEditingRecordId(type === "dosen" ? record.NIDN : record.kode);
    setRecordFormError("");
    setRecordNotice("");
  }

  function closeRecordModal() {
    setRecordModalType("");
    setEditingRecordId("");
    setRecordFormError("");
  }

  function openDeleteRecord(type, record) {
    previousFocusRef.current = document.activeElement;
    setDeletingRecord({ type, record });
    setRecordNotice("");
  }

  function handleRecordSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (recordModalType === "dosen") {
      const name = String(formData.get("name") ?? "").trim();
      const email = String(formData.get("email") ?? "").trim();
      const NIDN = String(formData.get("NIDN") ?? "").trim();
      const status = String(formData.get("status") ?? "Aktif");
      const currentRecord = lecturers.find(
        (lecturer) => lecturer.NIDN === editingRecordId,
      );

      const duplicateNidn = lecturers.some(
        (lecturer) =>
          lecturer.NIDN === NIDN && lecturer.NIDN !== editingRecordId,
      );
      const duplicateName = lecturers.some(
        (lecturer) =>
          lecturer.name.toLowerCase() === name.toLowerCase() &&
          lecturer.NIDN !== editingRecordId,
      );

      if (duplicateNidn) {
        setRecordFormError("NIDN tersebut sudah terdaftar.");
        return;
      }

      if (duplicateName) {
        setRecordFormError("Nama dosen tersebut sudah terdaftar.");
        return;
      }

      const lecturer = {
        initials: getInitials(name),
        name,
        email,
        date:
          currentRecord?.date ??
          new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date()),
        NIDN,
        status,
        tone:
          currentRecord?.tone ??
          (lecturers.length % 2 === 0 ? "indigo" : "teal"),
      };

      if (currentRecord) {
        setLecturers((current) =>
          current.map((item) =>
            item.NIDN === editingRecordId ? lecturer : item,
          ),
        );

        if (currentRecord.name !== name) {
          setStudents((current) =>
            current.map((student) =>
              student.advisor === currentRecord.name
                ? { ...student, advisor: name }
                : student,
            ),
          );
          setCourses((current) =>
            current.map((course) =>
              course.dosen === currentRecord.name
                ? { ...course, dosen: name }
                : course,
            ),
          );
        }

        setRecordNotice("Data dosen berhasil diperbarui.");
      } else {
        setLecturers((current) => [lecturer, ...current]);
        setRecordNotice("Dosen berhasil ditambahkan.");
      }
    }

    if (recordModalType === "matkul") {
      const kode = String(formData.get("kode") ?? "")
        .trim()
        .toUpperCase();
      const nama = String(formData.get("nama") ?? "").trim();
      const dosen = String(formData.get("dosen") ?? "").trim();
      const currentRecord = courses.find(
        (course) => course.kode === editingRecordId,
      );

      const duplicateCode = courses.some(
        (course) =>
          course.kode.toUpperCase() === kode && course.kode !== editingRecordId,
      );
      const duplicateName = courses.some(
        (course) =>
          course.nama.toLowerCase() === nama.toLowerCase() &&
          course.kode !== editingRecordId,
      );

      if (duplicateCode) {
        setRecordFormError("Kode mata kuliah tersebut sudah digunakan.");
        return;
      }

      if (duplicateName) {
        setRecordFormError("Nama mata kuliah tersebut sudah terdaftar.");
        return;
      }

      const course = { kode, nama, dosen };

      if (currentRecord) {
        setCourses((current) =>
          current.map((item) =>
            item.kode === editingRecordId ? course : item,
          ),
        );

        if (currentRecord.nama !== nama) {
          setCourseFilter("Semua mata kuliah");
          setStudents((current) =>
            current.map((student) => ({
              ...student,
              courses: student.courses.map((courseName) =>
                courseName === currentRecord.nama ? nama : courseName,
              ),
            })),
          );
        }

        setRecordNotice("Data mata kuliah berhasil diperbarui.");
      } else {
        setCourses((current) => [course, ...current]);
        setRecordNotice("Mata kuliah berhasil ditambahkan.");
      }
    }

    closeRecordModal();
  }

  function confirmDeleteRecord() {
    if (!deletingRecord) return;

    const { type, record } = deletingRecord;

    if (type === "dosen") {
      setLecturers((current) =>
        current.filter((lecturer) => lecturer.NIDN !== record.NIDN),
      );

      // Jaga relasi agar tidak menyisakan nama dosen yang sudah dihapus.
      setStudents((current) =>
        current.map((student) =>
          student.advisor === record.name
            ? { ...student, advisor: "" }
            : student,
        ),
      );

      setCourses((current) =>
        current.map((course) =>
          course.dosen === record.name ? { ...course, dosen: "" } : course,
        ),
      );

      setRecordNotice(
        "Dosen berhasil dihapus. Relasi pembimbing dan pengampu yang terkait dikosongkan.",
      );
    } else {
      setCourses((current) =>
        current.filter((course) => course.kode !== record.kode),
      );
      setCourseFilter("Semua mata kuliah");

      // Hapus mata kuliah ini juga dari daftar yang diambil mahasiswa.
      setStudents((current) =>
        current.map((student) => ({
          ...student,
          courses: student.courses.filter((name) => name !== record.nama),
        })),
      );

      setRecordNotice(
        "Mata kuliah berhasil dihapus dan dikeluarkan dari daftar pengambilan mahasiswa.",
      );
    }

    setDeletingRecord(null);
  }

  const pageTitle = activePage;
  const pageDescription = pageDescriptions[activePage];

  return (
    <div className="dashboard-shell">
      {mobileNavOpen && (
        <button
          aria-label="Tutup menu navigasi"
          className="sidebar-backdrop"
          onClick={() => setMobileNavOpen(false)}
          type="button"
        />
      )}

      <aside
        aria-label="Sidebar navigasi"
        className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}
      >
        <a
          className="brand"
          href="#dashboard"
          onClick={(event) => {
            event.preventDefault();
            navigateTo("Dashboard");
          }}
        >
          <span className="brand-mark" aria-hidden="true">
            <i className="bi bi-flower1" />
          </span>
          <span>
            UN<span className="brand-light">KIR</span>
          </span>
        </a>

        <div className="workspace-switcher">
          <span className="workspace-avatar" aria-hidden="true">
            <i className="bi bi-buildings" />
          </span>
          <span className="workspace-copy">
            <strong>Universitas Kikir</strong>
            <small>Workspace</small>
          </span>
          <i
            className="bi bi-chevron-expand workspace-chevron"
            aria-hidden="true"
          />
        </div>

        <p className="nav-caption">MENU UTAMA</p>
        <nav className="side-nav" aria-label="Navigasi utama">
          {navigation.map((item) => (
            <button
              aria-current={activePage === item.label ? "page" : undefined}
              className={`nav-item ${activePage === item.label ? "active" : ""}`}
              key={item.label}
              onClick={() => navigateTo(item.label)}
              type="button"
            >
              <i className={`bi ${item.icon}`} aria-hidden="true" />
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
          {preferenceNavigation.map((item) => (
            <button
              aria-current={activePage === item.label ? "page" : undefined}
              className={`nav-item ${activePage === item.label ? "active" : ""}`}
              key={item.label}
              onClick={() => navigateTo(item.label)}
              type="button"
            >
              <i className={`bi ${item.icon}`} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />
        <div className="sidebar-profile" aria-label="Akun administrator">
          <span className="profile-avatar">AD</span>
          <span className="profile-copy">
            <strong>Admin Dinda</strong>
            <small>Administrator</small>
          </span>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <button
            aria-label="Buka menu navigasi"
            aria-expanded={mobileNavOpen}
            className="mobile-menu-button"
            onClick={() => setMobileNavOpen(true)}
            type="button"
          >
            <i className="bi bi-list" aria-hidden="true" />
          </button>

          <div className="breadcrumb" aria-label="Lokasi halaman">
            <span>Workspace</span>
            <i className="bi bi-chevron-right" aria-hidden="true" />
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
            <div className="popover-wrap" ref={notificationMenuRef}>
              <button
                aria-label="Notifikasi"
                aria-expanded={showNotifications}
                aria-controls="notification-popover"
                className="icon-button notification-button"
                onClick={() => {
                  setShowNotifications((value) => !value);
                  setShowProfile(false);
                }}
                type="button"
              >
                <i className="bi bi-bell" aria-hidden="true" />
                <span className="notification-dot" aria-hidden="true" />
              </button>
              {showNotifications && (
                <div
                  className="top-popover notification-popover"
                  id="notification-popover"
                  role="region"
                  aria-label="Daftar notifikasi"
                >
                  <strong>Notifikasi</strong>
                  <p>
                    <span className="notice-dot" aria-hidden="true" />
                    Ada 4 pesanan baru yang perlu ditinjau.
                  </p>
                  <p>
                    <span
                      className="notice-dot notice-dot-soft"
                      aria-hidden="true"
                    />
                    Sarah Putri baru bergabung.
                  </p>
                </div>
              )}
            </div>

            <span className="topbar-divider" aria-hidden="true" />

            <div className="popover-wrap" ref={profileMenuRef}>
              <button
                aria-expanded={showProfile}
                aria-controls="profile-popover"
                className="top-profile"
                onClick={() => {
                  setShowProfile((value) => !value);
                  setShowNotifications(false);
                }}
                type="button"
              >
                <span className="profile-avatar">AD</span>
                <span className="top-profile-copy">
                  <strong>Admin Dinda</strong>
                  <small>Administrator</small>
                </span>
                <i className="bi bi-chevron-down" aria-hidden="true" />
              </button>
              {showProfile && (
                <div
                  className="top-popover profile-popover"
                  id="profile-popover"
                  role="menu"
                  aria-label="Menu akun administrator"
                >
                  <strong>Admin Dinda</strong>
                  <button
                    onClick={() => navigateTo("Pengaturan")}
                    role="menuitem"
                    type="button"
                  >
                    Pengaturan akun
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="page-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" aria-hidden="true" />
                SISTEM INFORMASI AKADEMIK
              </div>
              <h1>{pageTitle}</h1>
              <p className="welcome-subtitle">
                {activePage === "Dashboard"
                  ? "Ringkasan data akademik universitas."
                  : activePage === "Data Mahasiswa"
                    ? "Kelola profil, mata kuliah, dosen pembimbing, dan status akademik."
                    : pageDescription}
              </p>
            </div>
          </section>

          {activePage === "Dashboard" && (
            <>
              <section
                className="stats-grid overview-stats"
                aria-label="Ringkasan data"
              >
                <StatCard
                  label="Total Mahasiswa"
                  value={students.length}
                  detail="Mahasiswa terdaftar"
                  icon="bi-mortarboard"
                  tone="sage"
                />
                <StatCard
                  label="Total Dosen"
                  value={lecturers.length}
                  detail="Dosen terdaftar"
                  icon="bi-person-workspace"
                  tone="sand"
                />
                <StatCard
                  label="Total Mata Kuliah"
                  value={courses.length}
                  detail="Mata kuliah tersedia"
                  icon="bi-journal-bookmark"
                  tone="clay"
                />
              </section>
              <section className="dashboard-summary panel">
                <div>
                  <h2>Ringkasan sistem</h2>
                  <p>
                    Gunakan menu di sebelah kiri untuk mengelola data mahasiswa
                    dan membuka bagian akademik lainnya.
                  </p>
                </div>
                <button
                  className="secondary-action"
                  onClick={() => navigateTo("Data Mahasiswa")}
                  type="button"
                >
                  Buka data mahasiswa
                  <i className="bi bi-arrow-right" aria-hidden="true" />
                </button>
              </section>
            </>
          )}

          {activePage === "Data Mahasiswa" && (
            <>
              <section
                className="stats-grid people-stats"
                aria-label="Ringkasan data mahasiswa"
              >
                <StatCard
                  label="Total Mahasiswa"
                  value={students.length}
                  detail="Mahasiswa terdaftar"
                  icon="bi-mortarboard"
                  tone="sage"
                />
              </section>

              <section
                className="panel student-table-panel"
                aria-labelledby="student-table-title"
              >
                <div className="student-table-heading">
                  <div>
                    <h2 id="student-table-title">Daftar mahasiswa</h2>
                    <p>Data akademik mahasiswa dan dosen pembimbing.</p>
                  </div>
                  <button
                    className="primary-action"
                    onClick={openAddStudent}
                    type="button"
                  >
                    <i className="bi bi-plus-lg" aria-hidden="true" />
                    Tambah mahasiswa
                  </button>
                </div>

                <div className="student-toolbar">
                  <label className="student-search">
                    <i className="bi bi-search" aria-hidden="true" />
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
                    <i className="bi bi-chevron-down" aria-hidden="true" />
                  </label>

                  <label className="filter-select">
                    <span className="visually-hidden">
                      Filter program studi
                    </span>
                    <select
                      aria-label="Filter program studi"
                      onChange={(event) => setProgramFilter(event.target.value)}
                      value={programFilter}
                    >
                      <option>Semua program studi</option>
                      {[
                        ...new Set(students.map((student) => student.program)),
                      ].map((program) => (
                        <option key={program} value={program}>
                          {program}
                        </option>
                      ))}
                    </select>
                    <i className="bi bi-chevron-down" aria-hidden="true" />
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
                        <option key={course.kode} value={course.nama}>
                          {course.nama}
                        </option>
                      ))}
                    </select>
                    <i className="bi bi-chevron-down" aria-hidden="true" />
                  </label>

                  <button
                    className="reset-filters"
                    onClick={resetFilters}
                    type="button"
                  >
                    <i
                      className="bi bi-arrow-counterclockwise"
                      aria-hidden="true"
                    />
                    Reset
                  </button>
                </div>

                {pageError && (
                  <div className="page-error" role="alert">
                    <i
                      className="bi bi-exclamation-circle"
                      aria-hidden="true"
                    />
                    {pageError}
                    <button
                      aria-label="Tutup pesan error"
                      onClick={() => setPageError("")}
                      type="button"
                    >
                      <i className="bi bi-x-lg" aria-hidden="true" />
                    </button>
                  </div>
                )}

                <div className="student-result-count" aria-live="polite">
                  Menampilkan <strong>{filteredStudents.length}</strong> dari{" "}
                  <strong>{students.length}</strong> mahasiswa
                </div>

                <div
                  className="student-table-scroll"
                  tabIndex="0"
                  aria-label="Tabel mahasiswa, geser horizontal untuk melihat seluruh kolom"
                >
                  <table className="student-table">
                    <thead>
                      <tr>
                        <th scope="col">MAHASISWA</th>
                        <th scope="col">PROGRAM / SEMESTER</th>
                        <th scope="col">MATA KULIAH DIAMBIL</th>
                        <th scope="col">STATUS</th>
                        <th scope="col">DOSEN PEMBIMBING</th>
                        <th scope="col">IPK</th>
                        <th scope="col">
                          <span className="visually-hidden">Aksi</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <tr key={student.NIM}>
                            <td>
                              <div className="student-identity">
                                <span
                                  className={`user-avatar ${student.tone}`}
                                  aria-hidden="true"
                                >
                                  {student.initials}
                                </span>
                                <span className="student-identity-copy">
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
                                {student.courses.length > 0 ? (
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
                              <span
                                className={`status-badge ${student.status === "Aktif" ? "status-active" : student.status === "Menunggu" ? "status-pending" : "status-inactive"}`}
                              >
                                <i aria-hidden="true" />
                                {student.status}
                              </span>
                            </td>
                            <td>
                              <span className="advisor-name">
                                <i
                                  className="bi bi-person-circle"
                                  aria-hidden="true"
                                />
                                {student.advisor}
                              </span>
                            </td>
                            <td>
                              {Number.isFinite(student.IPK) ? (
                                <span className="ipk-value">
                                  {student.IPK.toFixed(2)}
                                </span>
                              ) : (
                                <span className="table-muted">Belum ada</span>
                              )}
                            </td>
                            <td>
                              <div className="row-actions">
                                <button
                                  aria-label={`Edit data ${student.name}`}
                                  className="edit-student-button"
                                  onClick={() => openEditStudent(student)}
                                  type="button"
                                >
                                  <i
                                    className="bi bi-pencil"
                                    aria-hidden="true"
                                  />
                                  <span>Edit</span>
                                </button>
                                <button
                                  aria-label={`Hapus data ${student.name}`}
                                  className="delete-student-button"
                                  onClick={() => openDeleteStudent(student)}
                                  type="button"
                                >
                                  <i
                                    className="bi bi-trash3"
                                    aria-hidden="true"
                                  />
                                  <span>Hapus</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <tbody>
                            {lecturers.length > 0 ? (
                              lecturers.map((lecturer) => (
                                <tr key={lecturer.NIDN}>
                                  <td>
                                    <div className="student-identity">
                                      <span
                                        className={`user-avatar ${lecturer.tone}`}
                                        aria-hidden="true"
                                      >
                                        {lecturer.initials}
                                      </span>
                                      <span className="student-identity-copy">
                                        <strong>{lecturer.name}</strong>
                                        <small>Terdaftar {lecturer.date}</small>
                                      </span>
                                    </div>
                                  </td>
                                  <td>{lecturer.NIDN}</td>
                                  <td>{lecturer.email}</td>
                                  <td>
                                    <span
                                      className={`status-badge ${
                                        lecturer.status === "Aktif"
                                          ? "status-active"
                                          : "status-inactive"
                                      }`}
                                    >
                                      <i aria-hidden="true" />
                                      {lecturer.status}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="row-actions">
                                      <button
                                        aria-label={`Edit data ${lecturer.name}`}
                                        className="edit-student-button"
                                        onClick={() =>
                                          openEditRecord("dosen", lecturer)
                                        }
                                        type="button"
                                      >
                                        <i
                                          className="bi bi-pencil"
                                          aria-hidden="true"
                                        />
                                        <span>Edit</span>
                                      </button>
                                      <button
                                        aria-label={`Hapus data ${lecturer.name}`}
                                        className="delete-student-button"
                                        onClick={() =>
                                          openDeleteRecord("dosen", lecturer)
                                        }
                                        type="button"
                                      >
                                        <i
                                          className="bi bi-trash3"
                                          aria-hidden="true"
                                        />
                                        <span>Hapus</span>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td className="student-empty-state" colSpan="5">
                                  <i
                                    className="bi bi-people"
                                    aria-hidden="true"
                                  />
                                  <strong>Belum ada data dosen</strong>
                                  <span>
                                    Tambahkan dosen untuk mulai mengisi data
                                    akademik.
                                  </span>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {activePage === "Data Dosen" && (
            <>
              <section
                className="stats-grid people-stats"
                aria-label="Ringkasan data dosen"
              >
                <StatCard
                  label="Total Dosen"
                  value={lecturers.length}
                  detail="Dosen terdaftar"
                  icon="bi-people"
                  tone="sage"
                />
              </section>

              <section
                className="panel student-table-panel"
                aria-labelledby="lecturer-table-title"
              >
                <div className="student-table-heading">
                  <div>
                    <h2 id="lecturer-table-title">Daftar dosen</h2>
                    <p>Informasi dosen yang terdaftar di universitas.</p>
                  </div>
                  <button
                    className="primary-action"
                    onClick={() => openAddRecord("dosen")}
                    type="button"
                  >
                    <i className="bi bi-plus-lg" aria-hidden="true" />
                    Tambah dosen
                  </button>
                </div>

                {recordNotice && (
                  <div className="page-success" role="status">
                    <i className="bi bi-check-circle" aria-hidden="true" />
                    {recordNotice}
                  </div>
                )}

                <div
                  className="student-table-scroll"
                  tabIndex="0"
                  aria-label="Tabel dosen, geser horizontal untuk melihat seluruh kolom"
                >
                  <table className="student-table record-table">
                    <thead>
                      <tr>
                        <th scope="col">DOSEN</th>
                        <th scope="col">NIDN</th>
                        <th scope="col">EMAIL</th>
                        <th scope="col">STATUS</th>
                        <th scope="col">AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lecturers.map((lecturer) => (
                        <tr key={lecturer.NIDN}>
                          <td>
                            <div className="student-identity">
                              <span
                                className={`user-avatar ${lecturer.tone}`}
                                aria-hidden="true"
                              >
                                {lecturer.initials}
                              </span>
                              <span className="student-identity-copy">
                                <strong>{lecturer.name}</strong>
                                <small>Terdaftar {lecturer.date}</small>
                              </span>
                            </div>
                          </td>
                          <td>{lecturer.NIDN}</td>
                          <td>{lecturer.email}</td>
                          <td>
                            <span
                              className={`status-badge ${
                                lecturer.status === "Aktif"
                                  ? "status-active"
                                  : "status-inactive"
                              }`}
                            >
                              <i aria-hidden="true" />
                              {lecturer.status}
                            </span>
                          </td>
                          <td>
                            <div className="row-actions">
                              <button
                                aria-label={`Edit data ${lecturer.name}`}
                                className="edit-student-button"
                                onClick={() =>
                                  openEditRecord("dosen", lecturer)
                                }
                                type="button"
                              >
                                <i
                                  className="bi bi-pencil"
                                  aria-hidden="true"
                                />
                                <span>Edit</span>
                              </button>
                              <button
                                aria-label={`Hapus data ${lecturer.name}`}
                                className="delete-student-button"
                                onClick={() =>
                                  openDeleteRecord("dosen", lecturer)
                                }
                                type="button"
                              >
                                <i
                                  className="bi bi-trash3"
                                  aria-hidden="true"
                                />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {activePage === "Matkul" && (
            <>
              <section
                className="stats-grid people-stats"
                aria-label="Ringkasan mata kuliah"
              >
                <StatCard
                  label="Total Mata Kuliah"
                  value={courses.length}
                  detail="Mata kuliah tersedia"
                  icon="bi-journal-bookmark"
                  tone="clay"
                />
              </section>

              <section
                className="panel student-table-panel"
                aria-labelledby="course-table-title"
              >
                <div className="student-table-heading">
                  <div>
                    <h2 id="course-table-title">Daftar mata kuliah</h2>
                    <p>Mata kuliah beserta dosen pengampu.</p>
                  </div>
                  <button
                    className="primary-action"
                    onClick={() => openAddRecord("matkul")}
                    type="button"
                  >
                    <i className="bi bi-plus-lg" aria-hidden="true" />
                    Tambah mata kuliah
                  </button>
                </div>

                {recordNotice && (
                  <div className="page-success" role="status">
                    <i className="bi bi-check-circle" aria-hidden="true" />
                    {recordNotice}
                  </div>
                )}

                <div
                  className="student-table-scroll"
                  tabIndex="0"
                  aria-label="Tabel mata kuliah, geser horizontal untuk melihat seluruh kolom"
                >
                  <table className="student-table record-table">
                    <thead>
                      <tr>
                        <th scope="col">KODE MATA KULIAH</th>
                        <th scope="col">NAMA MATA KULIAH</th>
                        <th scope="col">DOSEN PENGAMPU</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.length > 0 ? (
                        courses.map((course) => (
                          <tr key={course.kode}>
                            <td>{course.kode}</td>
                            <td>
                              <strong className="record-primary">
                                {course.nama}
                              </strong>
                            </td>
                            <td>
                              <span className="advisor-name">
                                <i
                                  className="bi bi-person-workspace"
                                  aria-hidden="true"
                                />
                                {course.dosen || "Belum ditentukan"}
                              </span>
                            </td>
                            <td>
                              <div className="row-actions">
                                <button
                                  aria-label={`Edit mata kuliah ${course.nama}`}
                                  className="edit-student-button"
                                  onClick={() =>
                                    openEditRecord("matkul", course)
                                  }
                                  type="button"
                                >
                                  <i
                                    className="bi bi-pencil"
                                    aria-hidden="true"
                                  />
                                  <span>Edit</span>
                                </button>
                                <button
                                  aria-label={`Hapus mata kuliah ${course.nama}`}
                                  className="delete-student-button"
                                  onClick={() =>
                                    openDeleteRecord("matkul", course)
                                  }
                                  type="button"
                                >
                                  <i
                                    className="bi bi-trash3"
                                    aria-hidden="true"
                                  />
                                  <span>Hapus</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="student-empty-state" colSpan="4">
                            <i className="bi bi-journal-x" aria-hidden="true" />
                            <strong>Belum ada mata kuliah</strong>
                            <span>
                              Tambahkan mata kuliah untuk mengisi daftar
                              akademik.
                            </span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {activePage !== "Dashboard" &&
            activePage !== "Data Mahasiswa" &&
            activePage !== "Data Dosen" &&
            activePage !== "Matkul" && (
              <PlaceholderPage
                title={activePage}
                description={pageDescription || "Bagian ini belum disiapkan."}
              />
            )}

          <footer className="dashboard-footer">
            <span>© Universitas Kikir</span>
            <span>Sistem Informasi Akademik</span>
          </footer>
        </div>
      </main>

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
            ref={modalRef}
            role="dialog"
          >
            <div className="modal-heading">
              <div>
                <span className="modal-icon" aria-hidden="true">
                  <i className="bi bi-mortarboard" />
                </span>
                <h2 id="add-person-title">
                  {editingStudent ? "Edit data mahasiswa" : "Tambah mahasiswa"}
                </h2>
                <p>Lengkapi informasi akademik mahasiswa.</p>
              </div>
              <button
                aria-label="Tutup form"
                className="modal-close"
                onClick={closeStudentModal}
                type="button"
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>

            <form className="add-person-form" onSubmit={handleStudentSubmit}>
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
                      ...new Set(students.map((student) => student.program)),
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
                    defaultValue={editingStudent?.advisor ?? ""}
                    name="advisor"
                    required
                  >
                    <option value="">Pilih dosen pembimbing</option>
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
                          editingStudent?.courses.includes(course.nama) ?? false
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
                  <i className="bi bi-exclamation-circle" aria-hidden="true" />
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
                    aria-hidden="true"
                  />
                  {editingStudent ? "Simpan perubahan" : "Simpan mahasiswa"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {recordModalType && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeRecordModal();
          }}
        >
          <section
            aria-labelledby="record-modal-title"
            aria-modal="true"
            className="add-person-modal student-modal"
            ref={modalRef}
            role="dialog"
          >
            <div className="modal-heading">
              <div>
                <span className="modal-icon" aria-hidden="true">
                  <i
                    className={`bi ${recordModalType === "dosen" ? "bi-person-workspace" : "bi-journal-text"}`}
                  />
                </span>
                <h2 id="record-modal-title">
                  {recordModalType === "dosen"
                    ? editingRecord
                      ? "Edit data dosen"
                      : "Tambah dosen"
                    : editingRecord
                      ? "Edit mata kuliah"
                      : "Tambah mata kuliah"}
                </h2>
                <p>
                  {recordModalType === "dosen"
                    ? "Lengkapi informasi dosen yang akan didaftarkan."
                    : "Lengkapi kode, nama, dan dosen pengampu mata kuliah."}
                </p>
              </div>
              <button
                aria-label="Tutup form"
                className="modal-close"
                onClick={closeRecordModal}
                type="button"
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>

            <form className="add-person-form" onSubmit={handleRecordSubmit}>
              {recordModalType === "dosen" ? (
                <div className="student-form-grid">
                  <label className="form-span-two">
                    Nama lengkap
                    <input
                      autoFocus
                      defaultValue={editingRecord?.name ?? ""}
                      name="name"
                      placeholder="Contoh: Budi Santoso"
                      required
                    />
                  </label>
                  <label>
                    NIDN
                    <input
                      defaultValue={editingRecord?.NIDN ?? ""}
                      name="NIDN"
                      placeholder="Masukkan NIDN"
                      required
                    />
                  </label>
                  <label>
                    Email
                    <input
                      defaultValue={editingRecord?.email ?? ""}
                      name="email"
                      placeholder="nama@email.com"
                      required
                      type="email"
                    />
                  </label>
                  <label>
                    Status
                    <select
                      defaultValue={editingRecord?.status ?? "Aktif"}
                      name="status"
                    >
                      <option>Aktif</option>
                      <option>Cuti</option>
                      <option>Tidak Aktif</option>
                    </select>
                  </label>
                </div>
              ) : (
                <div className="student-form-grid">
                  <label>
                    Kode mata kuliah
                    <input
                      autoFocus
                      defaultValue={editingRecord?.kode ?? ""}
                      name="kode"
                      placeholder="Contoh: PW101"
                      required
                    />
                  </label>
                  <label>
                    Nama mata kuliah
                    <input
                      defaultValue={editingRecord?.nama ?? ""}
                      name="nama"
                      placeholder="Contoh: Pemrograman Web"
                      required
                    />
                  </label>
                  <label className="form-span-two">
                    Dosen pengampu
                    <select
                      defaultValue={editingRecord?.dosen ?? ""}
                      name="dosen"
                      required
                      disabled={lecturers.length === 0}
                    >
                      <option value="">Pilih dosen pengampu</option>
                      {lecturers.map((lecturer) => (
                        <option key={lecturer.NIDN} value={lecturer.name}>
                          {lecturer.name}
                        </option>
                      ))}
                    </select>
                    {lecturers.length === 0 && (
                      <small>Tambahkan data dosen terlebih dahulu.</small>
                    )}
                  </label>
                </div>
              )}

              {recordFormError && (
                <p className="form-error" role="alert">
                  <i className="bi bi-exclamation-circle" aria-hidden="true" />
                  {recordFormError}
                </p>
              )}

              <div className="modal-actions">
                <button
                  className="modal-cancel"
                  onClick={closeRecordModal}
                  type="button"
                >
                  Batal
                </button>
                <button
                  className="modal-submit"
                  type="submit"
                  disabled={
                    recordModalType === "matkul" && lecturers.length === 0
                  }
                >
                  <i
                    className={`bi ${editingRecord ? "bi-check2" : "bi-plus-lg"}`}
                    aria-hidden="true"
                  />
                  {editingRecord ? "Simpan perubahan" : "Simpan data"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deletingStudent && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDeletingNim("");
          }}
        >
          <section
            aria-labelledby="delete-student-title"
            aria-describedby="delete-student-description"
            aria-modal="true"
            className="confirm-modal"
            ref={modalRef}
            role="alertdialog"
          >
            <span className="confirm-icon" aria-hidden="true">
              <i className="bi bi-trash3" />
            </span>
            <h2 id="delete-student-title">Hapus data mahasiswa?</h2>
            <p id="delete-student-description">
              Data <strong>{deletingStudent.name}</strong> dengan NIM{" "}
              <strong>{deletingStudent.NIM}</strong> akan dihapus dari daftar.
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setDeletingNim("")}
                type="button"
              >
                Batal
              </button>
              <button
                className="delete-confirm-button"
                onClick={confirmDeleteStudent}
                type="button"
              >
                Hapus data
              </button>
            </div>
          </section>
        </div>
      )}
      {deletingRecord && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDeletingRecord(null);
          }}
        >
          <section
            aria-labelledby="delete-record-title"
            aria-describedby="delete-record-description"
            aria-modal="true"
            className="confirm-modal"
            ref={modalRef}
            role="alertdialog"
          >
            <span className="confirm-icon" aria-hidden="true">
              <i className="bi bi-trash3" />
            </span>
            <h2 id="delete-record-title">
              Hapus{" "}
              {deletingRecord.type === "dosen" ? "data dosen" : "mata kuliah"}?
            </h2>
            <p id="delete-record-description">
              Data{" "}
              <strong>
                {deletingRecord.type === "dosen"
                  ? deletingRecord.record.name
                  : deletingRecord.record.nama}
              </strong>{" "}
              akan dihapus. Relasi data mahasiswa atau mata kuliah yang terkait
              juga akan diperbarui. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setDeletingRecord(null)}
                type="button"
              >
                Batal
              </button>
              <button
                className="delete-confirm-button"
                onClick={confirmDeleteRecord}
                type="button"
              >
                Hapus data
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
