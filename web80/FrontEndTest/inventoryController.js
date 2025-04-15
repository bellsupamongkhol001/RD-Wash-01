// ==================== Firebase ====================
import { InventoryModel } from "./inventoryModel.js";
import { InventoryView } from "./inventoryView.js";

let allInventory = [];
let allUniforms = [];
let selectedUniform = null;

// ==================== Initial Load ====================
window.addEventListener("DOMContentLoaded", async () => {
  await loadDashboard();
  await loadInventory();
  await loadUniforms();
  InventoryView.renderInventoryCards(allInventory);
  InventoryView.renderUniformBaseCards(allUniforms);
  setupEvents();
});

// ==================== Loaders ====================
async function loadDashboard() {
  const stats = await InventoryModel.getInventorySummary();
  InventoryView.updateDashboard(stats);
}

async function loadInventory() {
  allInventory = await InventoryModel.fetchInventoryItems();
}

async function loadUniforms() {
  allUniforms = await InventoryModel.fetchUniforms();
}

// ==================== Events ====================
function setupEvents() {
  bindSearchEvent();
  bindExportEvent();
  bindImportEvent();
  bindCardActions();
  bindAssignSubmit();
  bindAutoFillEmployee();
  bindInlineUpdateCode();
  bindAssignFromAvailableCode();
}

function bindSearchEvent() {
  document.getElementById("searchByUniformAndEmployee")?.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = allInventory.filter(item =>
      item.UniformID.toLowerCase().includes(keyword) ||
      item.UniformCode.toLowerCase().includes(keyword) ||
      item.EmployeeName?.toLowerCase().includes(keyword)
    );
    InventoryView.renderInventoryCards(filtered);
  });
}

function bindExportEvent() {
  document.getElementById("btnExportReport")?.addEventListener("click", async () => {
    const data = await InventoryModel.fetchAllForExport();
    const url = InventoryModel.exportCSV(data, [
      "UniformID", "UniformCode", "UniformType", "UniformSize", "UniformColor",
      "UniformQty", "EmployeeID", "EmployeeName", "EmployeDepartment", "Status", "RewashCount"
    ]);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  });
}

function bindImportEvent() {
  document.getElementById("btnImportReport")?.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const text = await file.text();
      const rows = text.trim().split("\n");
      const headers = rows[0].split(",").map(h => h.trim());

      const records = rows.slice(1).map(row => {
        const values = row.split(",");
        const obj = {};
        headers.forEach((h, i) => obj[h] = values[i]?.trim());
        return obj;
      });

      const valid = [];
      for (const r of records) {
        const emp = await InventoryModel.fetchEmployeeById(r.EmployeeID);
        const uniform = await InventoryModel.fetchUniformById(r.UniformID);
        if (emp && uniform) {
          valid.push({
            ...uniform,
            UniformID: r.UniformID,
            UniformCode: r.UniformCode,
            EmployeeID: emp.employeeId,
            EmployeeName: emp.employeeName,
            EmployeDepartment: emp.employeeDept,
            UniformQty: 1,
            Status: "assigned",
            RewashCount: 0
          });
        }
      }

      InventoryView.previewImportData(valid, async () => {
        for (const v of valid) {
          await InventoryModel.assignUniformToEmployee(v);
        }
        Swal.fire({ icon: "success", title: "Import สำเร็จ", timer: 1500, showConfirmButton: false });
        await loadDashboard();
        await loadInventory();
        InventoryView.renderInventoryCards(allInventory);
      });
    });
    input.click();
  });
}

function bindCardActions() {
  document.getElementById("inventoryList")?.addEventListener("click", async (e) => {
    const detailBtn = e.target.closest(".btn-detail");
    const deleteBtn = e.target.closest(".btn-delete");
    if (detailBtn) {
      const code = detailBtn.dataset.code;
      const item = allInventory.find(i => i.UniformCode === code);
      if (item) {
        InventoryView.fillDetailModal(item);
        InventoryView.toggleModal("codeListModal", true);
      }
    } else if (deleteBtn) {
      const code = deleteBtn.dataset.code;
      const confirm = await Swal.fire({
        title: "ลบรายการนี้?",
        text: `คุณแน่ใจหรือไม่ที่จะลบ Uniform Code: ${code}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
      });
      if (!confirm.isConfirmed) return;
      await InventoryModel.deleteUniformEntry(code);
      await loadInventory();
      InventoryView.renderInventoryCards(allInventory);
    }
  });

  document.getElementById("uniformBaseList")?.addEventListener("click", async (e) => {
    const assignBtn = e.target.closest(".btn-assign");
    if (assignBtn) {
      const uniformId = assignBtn.dataset.uniformid;
      const base = await InventoryModel.fetchUniformById(uniformId);
      if (base) {
        selectedUniform = base;
        InventoryView.prepareAssignForm(base);
        InventoryView.toggleModal("assignModal", true);
      }
    }
  });
}

function bindAssignSubmit() {
  document.getElementById("assignForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const empId = document.getElementById("assignEmployeeId")?.value.trim();
    const code = document.getElementById("assignUniformCode")?.value.trim();
    if (!empId || !code || !selectedUniform) return;

    const empData = await InventoryModel.fetchEmployeeById(empId);
    if (!empData) {
      return Swal.fire({ icon: "error", title: "ไม่พบพนักงาน", text: "กรุณาตรวจสอบ Employee ID ให้ถูกต้อง" });
    }

    const exists = allInventory.find(i => i.UniformCode === code);
    if (exists) {
      return Swal.fire({ icon: "warning", title: "Code ซ้ำ", text: "Uniform Code นี้มีในระบบแล้ว" });
    }

    const confirm = await Swal.fire({
      title: "ยืนยันการ Assign?",
      text: `Assign ชุด ${selectedUniform.uniformType} ให้กับ ${empData.employeeName}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก"
    });
    if (!confirm.isConfirmed) return;

    await InventoryModel.assignUniformToEmployee({
      UniformID: selectedUniform.uniformId,
      UniformCode: code,
      UniformType: selectedUniform.uniformType,
      UniformSize: selectedUniform.uniformSize,
      UniformColor: selectedUniform.uniformColor,
      UniformQty: 1,
      EmployeeID: empId,
      EmployeeName: empData.employeeName,
      EmployeDepartment: empData.employeeDept,
      Status: "assigned",
      RewashCount: 0,
    });

    Swal.fire({ icon: "success", title: "Assign สำเร็จ!", timer: 1500, showConfirmButton: false });
    InventoryView.toggleModal("assignModal", false);
    await loadDashboard();
    await loadInventory();
    InventoryView.renderInventoryCards(allInventory);
  });
}

function bindAutoFillEmployee() {
  const input = document.getElementById("assignEmployeeId");
  if (!input) return;

  input.addEventListener("blur", async () => {
    const empId = input.value.trim();
    if (!empId) return;
    const emp = await InventoryModel.fetchEmployeeById(empId);
    if (emp) {
      document.getElementById("assignEmployeeName").value = emp.employeeName || "";
    }
  });
}

function bindInlineUpdateCode() {
  window.updateCodeInline = async (el, oldCode) => {
    const newCode = el.textContent.trim();
    if (!newCode || newCode === oldCode) return;

    const confirm = await Swal.fire({
      title: "แก้ไขรหัสชุด?",
      text: `คุณแน่ใจหรือไม่ว่าต้องการเปลี่ยน ${oldCode} → ${newCode}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก"
    });

    if (!confirm.isConfirmed) {
      el.textContent = oldCode;
      return;
    }

    try {
      await InventoryModel.updateUniformCode(oldCode, { UniformCode: newCode });
      Swal.fire({ icon: "success", title: "อัปเดตรหัสชุดสำเร็จ", timer: 1200, showConfirmButton: false });
      el.textContent = newCode;
      await loadInventory();
      InventoryView.renderInventoryCards(allInventory);
    } catch (err) {
      Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: err.message || "ไม่สามารถอัปเดตรหัสได้" });
      el.textContent = oldCode;
    }
  };
}

function bindAssignFromAvailableCode() {
  window.openAssignFromCode = async (code) => {
    const item = allInventory.find(i => i.UniformCode === code && i.Status === "available");
    if (!item) return;
    selectedUniform = item;
    InventoryView.prepareAssignForm(item);
    document.getElementById("assignUniformCode").value = item.UniformCode;
    InventoryView.toggleModal("assignModal", true);
  };
}

// ==================== Global Window Events ====================
window.returnUniformByCode = async (code) => {
  const confirm = await Swal.fire({
    title: "คืนชุด?",
    text: "ต้องการคืนชุดนี้เข้าสู่ระบบ?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก"
  });
  if (!confirm.isConfirmed) return;
  await InventoryModel.returnUniform(code);
  await loadDashboard();
  await loadInventory();
  InventoryView.renderInventoryCards(allInventory);
};

window.closeAssignModal = () => InventoryView.toggleModal("assignModal", false);
window.closeCodeListModal = () => InventoryView.toggleModal("codeListModal", false);
window.closeAddCodeModal = () => InventoryView.toggleModal("codeModal", false);
