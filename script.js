let employees = [];
let logoBase64 = "";

// Logo Upload
document.getElementById("logoInput").addEventListener("change", function(e) {
    const reader = new FileReader();
    reader.onload = function() {
        logoBase64 = reader.result;
        document.getElementById("logoPreview").src = logoBase64;
    };
    reader.readAsDataURL(e.target.files[0]);
});

// Safe calculation
function calc(exp) {
    try {
        return Function('"use strict"; return (' + exp + ')')();
    } catch {
        return 0;
    }
}

// Add Employee
function addEmployee() {
    let name = document.getElementById("name").value;
    let work = document.getElementById("work").value;
    let salaryExp = document.getElementById("salary").value;
    let deductionExp = document.getElementById("deduction").value;

    let salary = calc(salaryExp);
    let deduction = 0;

    if (deductionExp.includes("%")) {
        let percent = parseFloat(deductionExp);
        deduction = salary * percent / 100;
    } else {
        deduction = calc(deductionExp);
    }

    let total = salary - deduction;

    employees.push({ name, work, salary, deduction, total });

    display();
}

// Display
function display() {
    let tbody = document.querySelector("#table tbody");
    tbody.innerHTML = "";

    let grand = 0;

    employees.forEach((e, i) => {
        grand += e.total;

        tbody.innerHTML += `
        <tr>
            <td>${e.name}</td>
            <td>${e.work}</td>
            <td>${e.salary}</td>
            <td>${e.deduction}</td>
            <td>${e.total}</td>
            <td><button onclick="del(${i})">Delete</button></td>
        </tr>`;
    });

    document.getElementById("grandTotal").innerText = grand;
}

// Delete
function del(i) {
    employees.splice(i, 1);
    display();
}

// PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let selectedDate = document.getElementById("date").value;

    // Logo
    if (logoBase64) {
        doc.addImage(logoBase64, "PNG", 10, 5, 30, 30);
    }

    // Date right side
    doc.text("Date: " + selectedDate, 150, 10);

    doc.text("Blacksquad", 14, 40);

    let data = employees.map(e => [
        e.name, e.work, e.salary, e.deduction, e.total
    ]);

    doc.autoTable({
        startY: 50,
        head: [["Name", "Work", "Salary", "Deduction", "Total"]],
        body: data
    });

    doc.text(
        "Total: " + document.getElementById("grandTotal").innerText,
        14,
        doc.lastAutoTable.finalY + 10
    );

    doc.save("Blacksquad.pdf");
}