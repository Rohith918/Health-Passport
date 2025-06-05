import React from 'react';

const HealthForm = ({ id, title, fields, storageKey, isFileUpload }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {};

    for (const field of fields) {
      const element = document.getElementById(field.id);
      if (!element) continue;

      if (field.type === 'file') {
        const file = element.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
          const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
          stored.push({
            Date: document.getElementById('prescriptionDate').value,
            fileName: file.name,
            fileData: e.target.result
          });
          localStorage.setItem(storageKey, JSON.stringify(stored));
          document.getElementById(id).close();
        };
        reader.readAsDataURL(file);
        return;
      } else {
        formData[field.label || field.id] = element.value;
      }
    }

    // Only store if not file upload
    if (!isFileUpload) {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      stored.push(formData);
      localStorage.setItem(storageKey, JSON.stringify(stored));
      document.getElementById(id).close();
    }
  };

  return (
    <dialog id={id}>
      <form onSubmit={handleSubmit}>
        <h3>{title}</h3>
        {fields.map((field) => (
          <div key={field.id}>
            <input
              id={field.id}
              type={field.type}
              placeholder={field.label}
              accept={field.accept}
              min={field.min}
              max={field.max}
              required
            />
          </div>
        ))}
        <button type="submit">Save</button>
        <button type="button" onClick={() => document.getElementById(id).close()}>
          Cancel
        </button>
      </form>
    </dialog>
  );
};

export default HealthForm;
