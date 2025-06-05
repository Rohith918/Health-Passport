function toggleAbout() {
  const modal = document.getElementById('aboutModal');
  modal.classList.toggle('hidden');
}
  

function openDialog(id) {
      const dialog = document.getElementById(id);
      if (dialog) dialog.showModal();
    }

    function closeDialog(id) {
      const dialog = document.getElementById(id);
      if (dialog) dialog.close();
    }

    function saveCardio() {
      const data = JSON.parse(localStorage.getItem('cardio') || '[]');
      data.push({
        Date: document.getElementById('cardioDate').value,
        "Blood Pressure": document.getElementById('bp').value,
        "Heart Rate": document.getElementById('hr').value,
        "Total Cholesterol": document.getElementById('tchol').value,
        Triglycerides: document.getElementById('trg').value,
        "HDL Cholesterol": document.getElementById('hchol').value,
        "LDL Cholesterol": document.getElementById('lchol').value,
        "VLDL Cholesterol": document.getElementById('vchol').value
      });
      localStorage.setItem('cardio', JSON.stringify(data));
      closeDialog('cardioDialog');
      renderSummary();
      return false;
    }

    function saveGlucose() {
      const data = JSON.parse(localStorage.getItem('glucose') || '[]');
      data.push({
        Date: document.getElementById('glucoseDate').value,
        Fasting: document.getElementById('fasting').value,
        Postprandial: document.getElementById('post').value,
        HbA1c: document.getElementById('hba1c').value
      });
      localStorage.setItem('glucose', JSON.stringify(data));
      closeDialog('glucoseDialog');
      renderSummary();
      return false;
    }

    function saveLiver() {
      const data = JSON.parse(localStorage.getItem('liver') || '[]');
      data.push({
        Date: document.getElementById('liverDate').value,
        ALT: document.getElementById('alt').value,
        AST: document.getElementById('ast').value,
        Bilirubin: document.getElementById('bilirubin').value
      });
      localStorage.setItem('liver', JSON.stringify(data));
      closeDialog('liverDialog');
      renderSummary();
      return false;
    }

    function savePrescription() {
      const fileInput = document.getElementById('prescriptionFile');
      const file = fileInput.files[0];
      if (!file) return false;

      const reader = new FileReader();
      reader.onload = function(e) {
        const data = JSON.parse(localStorage.getItem('prescriptions') || '[]');
        data.push({
          Date: document.getElementById('prescriptionDate').value,
          fileName: file.name,
          fileData: e.target.result
        });
        localStorage.setItem('prescriptions', JSON.stringify(data));
        closeDialog('prescriptionDialog');
        renderSummary();
      };
      reader.readAsDataURL(file);
      return false;
    }

    function deleteRecord(key, index) {
      let records = JSON.parse(localStorage.getItem(key) || '[]');
      records.splice(index, 1);
      localStorage.setItem(key, JSON.stringify(records));
      renderSummary();
    }

    function renderSummary() {
      const summary = document.getElementById('summary');
      summary.innerHTML = '';

      const sections = [
        { key: 'cardio', title: 'Cardio Records' },
        { key: 'glucose', title: 'Glucose Records' },
        { key: 'liver', title: 'Liver Records' },
        { key: 'prescriptions', title: 'Prescriptions' }
      ];

      sections.forEach(section => {
        const data = JSON.parse(localStorage.getItem(section.key) || '[]');
        if (data.length) {
          let html = `<h2>${section.title}</h2><table><thead><tr>`;
          const keys = Object.keys(data[0]);
          keys.forEach(k => html += `<th>${k}</th>`);
          html += `<th>Action</th></tr></thead><tbody>`;

          data.forEach((record, index) => {
            html += `<tr>`;
            keys.forEach(k => {
              if (k === 'fileData') {
                const fileName = record.fileName.toLowerCase();
                if (fileName.endsWith('.pdf')) {
                  html += `<td><embed src="${record[k]}" type="application/pdf"></td>`;
                } else if (fileName.match(/\.(jpg|jpeg|png)$/)) {
                  html += `<td><img src="${record[k]}" alt="${record.fileName}"></td>`;
                } else {
                  html += `<td><a href="${record[k]}" download="${record.fileName}">${record.fileName}</a></td>`;
                }
              } else {
                html += `<td>${record[k]}</td>`;
              }
            });
            html += `<td><button onclick="deleteRecord('${section.key}', ${index})">Delete</button></td></tr>`;
          });

          html += `</tbody></table>`;
          summary.innerHTML += html;
        }
      });
    }

    window.onload = renderSummary;