import React from 'react';

const Header = () => {
  const openDialog = (id) => {
    const dialog = document.getElementById(id);
    if (dialog) dialog.showModal();
  };

  return (
    <div className="top-bar">
      <h1>Health Passport</h1>
      <div className="button-group-inline">
        <button onClick={() => openDialog('aboutModal')}>About</button>
        <button onClick={() => openDialog('cardioDialog')}>Add Cardio Info</button>
        <button onClick={() => openDialog('glucoseDialog')}>Add Glucose Info</button>
        <button onClick={() => openDialog('liverDialog')}>Add Liver Info</button>
        <button onClick={() => openDialog('prescriptionDialog')}>Upload Prescription</button>
      </div>
    </div>
  );
};

export default Header;
