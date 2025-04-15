export const InventoryView = {
  currentPage: 1,
  rowsPerPage: 6,

  renderUniformBaseCards(uniforms = []) {
    const container = document.getElementById("uniformBaseList");
    if (!container) return;
    container.innerHTML = "";

    if (uniforms.length === 0) {
      container.innerHTML = `<p style="text-align:center;color:#888;">🚫 No uniform data found</p>`;
      return;
    }

    const start = (this.currentPage - 1) * this.rowsPerPage;
    const paginated = uniforms.slice(start, start + this.rowsPerPage);

    paginated.forEach(uniform => {
      const card = document.createElement("div");
      card.className = "inventory-card";

      card.innerHTML = `
        <div class="card-header">
          <strong>${uniform.uniformId}</strong>
        </div>
        <div class="card-body">
          <p><strong>Type:</strong> ${uniform.uniformType}</p>
          <p><strong>Size:</strong> ${uniform.uniformSize}</p>
          <p><strong>Color:</strong> ${uniform.uniformColor}</p>
          <p><strong>Qty:</strong> ${uniform.qty || 0}</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-add-code" data-id="${uniform.uniformId}">➕ Add Code</button>
          <button class="btn btn-secondary btn-detail" data-id="${uniform.uniformId}">📄 Detail</button>
        </div>
      `;
      container.appendChild(card);
    });

    this.renderPagination(uniforms.length);
  },

  renderInventoryCards(inventoryList = []) {
    const container = document.getElementById("inventoryList");
    if (!container) return;
    container.innerHTML = "";

    if (inventoryList.length === 0) {
      container.innerHTML = `<p style="text-align:center;color:#888;">🚫 No inventory data</p>`;
      return;
    }

    inventoryList.forEach(item => {
      const card = document.createElement("div");
      card.className = "inventory-card";
      card.innerHTML = `
        <div class="card-header">
          <strong contenteditable="true" onblur="updateCodeInline(this, '${item.UniformCode}')">${item.UniformCode}</strong>
          <span class="badge ${item.Status}">${item.Status.toUpperCase()}</span>
        </div>
        <div class="card-body">
          <p><strong>Type:</strong> ${item.UniformType}</p>
          <p><strong>Size:</strong> ${item.UniformSize}</p>
          <p><strong>Color:</strong> ${item.UniformColor}</p>
          <p><strong>Employee:</strong> <span contenteditable="true" onblur="updateEmployeeInline(this, '${item.UniformCode}')">${item.EmployeeName || '-'}</span></p>
        </div>
        <div class="card-footer">
          ${item.Status === "available"
            ? `<button class="btn btn-primary" onclick="openAssignFromCode('${item.UniformCode}')">Assign</button>`
            : `<button class="btn btn-secondary" onclick="viewUniformDetail('${item.UniformCode}')">Detail</button>
               <button class="btn btn-warning" onclick="returnUniformByCode('${item.UniformCode}')">Return</button>`
          }
          <button class="btn btn-danger" onclick="confirmDeleteUniform('${item.UniformCode}')">Delete</button>
        </div>
      `;
      container.appendChild(card);
    });
  },

  renderPagination(totalItems) {
    const container = document.getElementById("pagination");
    if (!container) return;

    container.innerHTML = "";
    const totalPages = Math.ceil(totalItems / this.rowsPerPage);
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = "pagination-btn";
      if (i === this.currentPage) btn.classList.add("active");
      btn.addEventListener("click", () => {
        this.currentPage = i;
        window.reloadUniformCards?.();
      });
      container.appendChild(btn);
    }
  },

  updateDashboard({ total, assigned, available }) {
    document.getElementById("totalCount").textContent = total;
    document.getElementById("assignedCount").textContent = assigned;
    document.getElementById("availableCount").textContent = available;
  },

  toggleModal(id, show = true) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.toggle("hidden", !show);
  },

  prepareAssignForm(uniform) {
    document.getElementById("assignEmployeeId").value = "";
    document.getElementById("assignEmployeeName").value = "";
    document.getElementById("assignUniformCode").value = "";
  },

  fillDetailModal(item) {
    const tbody = document.getElementById("codeListBody");
    tbody.innerHTML = "";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.UniformCode}</td>
      <td>${item.EmployeeID}</td>
      <td>${item.EmployeeName}</td>
      <td>${item.EmployeDepartment}</td>
      <td>${item.Status}</td>
      <td>
        ${item.Status === "available"
          ? `<button class="btn btn-primary" onclick="openAssignFromCode('${item.UniformCode}')">Assign</button>`
          : `<button class="btn btn-danger" onclick="returnUniformByCode('${item.UniformCode}')">Return</button>`
        }
        <button class="btn btn-danger" onclick="confirmDeleteUniform('${item.UniformCode}')">Delete</button>
      </td>
    `;
    tbody.appendChild(row);

    document.getElementById("detailUniformId").textContent = item.UniformID;
    document.getElementById("detailUniformType").textContent = item.UniformType;
    document.getElementById("detailUniformSize").textContent = item.UniformSize;
    document.getElementById("detailUniformColor").textContent = item.UniformColor;
  },

  previewImportData(data = [], onConfirm = () => {}) {
    const rows = data.map(d => `
      <tr>
        <td>${d.UniformCode}</td>
        <td>${d.EmployeeID}</td>
        <td>${d.EmployeeName}</td>
        <td>${d.UniformType}</td>
        <td>${d.UniformSize}</td>
        <td>${d.UniformColor}</td>
        <td>${d.Status}</td>
      </tr>`).join("");

    Swal.fire({
      title: "📥 Preview Import",
      html: `
        <div class="preview-scroll">
          <table class="preview-table">
            <thead>
              <tr>
                <th>Code</th><th>ID</th><th>Name</th><th>Type</th><th>Size</th><th>Color</th><th>Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "✅ Import",
      cancelButtonText: "❌ Cancel"
    }).then(result => {
      if (result.isConfirmed) onConfirm();
    });
  }
};

// ✅ External reload trigger
window.reloadUniformCards = async () => {
  const uniforms = await InventoryModel.fetchUniforms();
  InventoryView.renderUniformBaseCards(uniforms);
};
