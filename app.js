// School Management System - Simple SPA

// Sample data (can be replaced with localStorage for persistence)
let students = [
    { name: "Alice Johnson", class: "5A", math: 88, science: 92, english: 85, attendance: 96 },
    { name: "Bob Smith", class: "5B", math: 75, science: 80, english: 78, attendance: 90 },
    { name: "Charlie Lee", class: "5A", math: 95, science: 89, english: 93, attendance: 98 },
];

// Try to load from localStorage
if (localStorage.getItem('students')) {
    students = JSON.parse(localStorage.getItem('students'));
}

function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

function renderHome() {
    document.getElementById('main-content').innerHTML = `
        <h1>Welcome to the School Management System</h1>
        <p>Monitor student performance, grades, and attendance easily.</p>
        <img src="https://img.icons8.com/ios-filled/100/2d3e50/school-building.png" alt="School" style="margin-top:2rem;">
    `;
}

function renderPerformance() {
    let filterName = '';
    let filterClass = '';
    const content = document.createElement('div');
    content.innerHTML = `
        <h2>Student Performance</h2>
        <div style="margin-bottom:1rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
            <input type="text" id="search-name" placeholder="Search by name">
            <input type="text" id="search-class" placeholder="Search by class">
            <button id="filter-btn">Filter</button>
            <button id="reset-btn">Reset</button>
        </div>
        <div class="table-responsive">
            <table id="students-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Class</th>
                        <th>Math</th>
                        <th>Science</th>
                        <th>English</th>
                        <th>Attendance (%)</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    `;
    document.getElementById('main-content').innerHTML = '';
    document.getElementById('main-content').appendChild(content);
    
    function updateTable() {
        const tbody = document.querySelector('#students-table tbody');
        tbody.innerHTML = '';
        let filtered = students.filter(s =>
            (!filterName || s.name.toLowerCase().includes(filterName)) &&
            (!filterClass || s.class.toLowerCase().includes(filterClass))
        );
        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No students found.</td></tr>';
        } else {
            filtered.forEach(s => {
                tbody.innerHTML += `<tr>
                    <td>${s.name}</td>
                    <td>${s.class}</td>
                    <td>${s.math}</td>
                    <td>${s.science}</td>
                    <td>${s.english}</td>
                    <td>${s.attendance}</td>
                </tr>`;
            });
        }
    }
    updateTable();
    document.getElementById('filter-btn').onclick = function() {
        filterName = document.getElementById('search-name').value.trim().toLowerCase();
        filterClass = document.getElementById('search-class').value.trim().toLowerCase();
        updateTable();
    };
    document.getElementById('reset-btn').onclick = function() {
        filterName = '';
        filterClass = '';
        document.getElementById('search-name').value = '';
        document.getElementById('search-class').value = '';
        updateTable();
    };
}

function renderAddStudent() {
    document.getElementById('main-content').innerHTML = `
        <h2>Add / Update Student Performance</h2>
        <form id="student-form">
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" required>
            </div>
            <div class="form-group">
                <label for="class">Class</label>
                <input type="text" id="class" required>
            </div>
            <div class="form-group">
                <label for="math">Math</label>
                <input type="number" id="math" min="0" max="100" required>
            </div>
            <div class="form-group">
                <label for="science">Science</label>
                <input type="number" id="science" min="0" max="100" required>
            </div>
            <div class="form-group">
                <label for="english">English</label>
                <input type="number" id="english" min="0" max="100" required>
            </div>
            <div class="form-group">
                <label for="attendance">Attendance (%)</label>
                <input type="number" id="attendance" min="0" max="100" required>
            </div>
            <button type="submit">Save</button>
        </form>
        <div id="form-message" style="margin-top:1rem;"></div>
    `;
    document.getElementById('student-form').onsubmit = function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const className = document.getElementById('class').value.trim();
        const math = parseInt(document.getElementById('math').value);
        const science = parseInt(document.getElementById('science').value);
        const english = parseInt(document.getElementById('english').value);
        const attendance = parseInt(document.getElementById('attendance').value);
        if (!name || !className) {
            document.getElementById('form-message').textContent = 'Name and Class are required.';
            return;
        }
        // Check if student exists (by name & class)
        const idx = students.findIndex(s => s.name.toLowerCase() === name.toLowerCase() && s.class.toLowerCase() === className.toLowerCase());
        if (idx >= 0) {
            students[idx] = { name, class: className, math, science, english, attendance };
            document.getElementById('form-message').textContent = 'Student performance updated!';
        } else {
            students.push({ name, class: className, math, science, english, attendance });
            document.getElementById('form-message').textContent = 'Student added!';
        }
        saveStudents();
        document.getElementById('student-form').reset();
    };
}

// Navigation
function setActiveLink(id) {
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    if (id) document.getElementById(id).classList.add('active');
}

function handleHashChange() {
    const hash = window.location.hash || '#home';
    if (hash === '#home') {
        renderHome();
        setActiveLink('home-link');
    } else if (hash === '#performance') {
        renderPerformance();
        setActiveLink('performance-link');
    } else if (hash === '#add') {
        renderAddStudent();
        setActiveLink('add-link');
    } else {
        renderHome();
        setActiveLink('home-link');
    }
}

window.addEventListener('hashchange', handleHashChange);
document.addEventListener('DOMContentLoaded', handleHashChange);
