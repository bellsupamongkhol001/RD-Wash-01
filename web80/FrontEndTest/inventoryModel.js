// 📦 Firebase Firestore
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const db = getFirestore();

// ==============================
// 🔗 Firestore Collections
// ==============================
const UniformDB = collection(db, "UniformDB");
const InventoryDB = collection(db, "InventoryDB");
const EmployeeDB = collection(db, "EmployeesDB");

// ==============================
// 📥 UniformDB
// ==============================
export async function fetchUniforms() {
  const snapshot = await getDocs(collection(db, "UniformDB"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchUniformById(uniformId) {
  if (!uniformId) return null;
  const snap = await getDoc(doc(UniformDB, uniformId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ==============================
// 👤 EmployeeDB
// ==============================
export async function fetchEmployeeById(empId) {
  if (!empId) return null;
  const snap = await getDoc(doc(EmployeeDB, empId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ==============================
// 📦 InventoryDB (CRUD)
// ==============================
export async function fetchInventoryItems() {
  const snapshot = await getDocs(query(InventoryDB, orderBy("UniformType")));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function assignUniformToEmployee(data) {
  const id = `${data.UniformCode}-${data.EmployeeID}`;
  await setDoc(doc(InventoryDB, id), {
    UniformID: data.UniformID,
    UniformCode: data.UniformCode,
    UniformType: data.UniformType,
    UniformSize: data.UniformSize,
    UniformColor: data.UniformColor,
    UniformQty: data.UniformQty || 1,
    EmployeeID: data.EmployeeID,
    EmployeeName: data.EmployeeName,
    EmployeDepartment: data.EmployeDepartment,
    Status: "assigned",
    RewashCount: data.RewashCount || 0,
  });
}

export async function assignFromAvailableCode(code, employeeData) {
  const ref = doc(InventoryDB, code);
  await updateDoc(ref, {
    Status: "assigned",
    EmployeeID: employeeData.employeeId,
    EmployeeName: employeeData.employeeName,
    EmployeDepartment: employeeData.employeeDept,
    RewashCount: await countRewashByUniformCode(code),
  });
}

export async function returnUniform(code) {
  const docRef = doc(InventoryDB, code);
  await updateDoc(docRef, {
    Status: "available",
    EmployeeID: "",
    EmployeeName: "",
    EmployeDepartment: "",
  });
}

export async function deleteUniformEntry(code) {
  await deleteDoc(doc(InventoryDB, code));
}

export async function updateUniformCode(code, payload) {
  const ref = doc(InventoryDB, code);
  await updateDoc(ref, payload);
}

export async function getAllCodesByUniformID(uniformId) {
  const q = query(InventoryDB, where("UniformID", "==", uniformId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function countRewashByUniformCode(code) {
  const q = query(InventoryDB, where("UniformCode", "==", code));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

// ==============================
// 📊 Dashboard Summary
// ==============================
export async function getInventorySummary() {
  const snapshot = await getDocs(InventoryDB);
  const items = snapshot.docs.map(doc => doc.data());

  return {
    total: items.length,
    assigned: items.filter(i => i.Status === "assigned").length,
    available: items.filter(i => i.Status === "available").length,
  };
}

// ==============================
// 📤 CSV Export
// ==============================
export async function fetchAllForExport() {
  const snapshot = await getDocs(InventoryDB);
  return snapshot.docs.map(doc => doc.data());
}

export function exportCSV(dataArray, headers) {
  const csv = [
    headers.join(","),
    ...dataArray.map(row => headers.map(h => `"${row[h] || ""}"`).join(","))
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  return URL.createObjectURL(blob);
}

// ==============================
// ✅ Export Module (SRP Ready)
// ==============================
export const InventoryModel = {
  fetchUniforms,
  fetchUniformById,
  fetchEmployeeById,
  fetchInventoryItems,
  assignUniformToEmployee,
  assignFromAvailableCode,
  returnUniform,
  deleteUniformEntry,
  updateUniformCode,
  getAllCodesByUniformID,
  countRewashByUniformCode,
  getInventorySummary,
  fetchAllForExport,
  exportCSV,
};
