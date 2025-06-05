import React from 'react';
import './App.css';
import Header from './components/Header';
import DescriptionBox from './components/DescriptionBox';
import HealthForm from './components/HealthForm';
import SummarySection from './components/SummarySection';

function App() {
  return (
    <div>
      <Header />
      <DescriptionBox />

      <HealthForm
        id="cardioDialog"
        title="Cardio Info"
        storageKey="cardio"
        fields={[
          { id: 'cardioDate', type: 'date', label: 'Date' },
          { id: 'bp', type: 'text', label: 'Blood Pressure' },
          { id: 'hr', type: 'number', label: 'Heart Rate', min: 1, max: 120 },
          { id: 'tchol', type: 'number', label: 'Total Cholesterol', min: 1, max: 500 },
          { id: 'trg', type: 'number', label: 'Triglycerides', min: 1, max: 500 },
          { id: 'hchol', type: 'number', label: 'HDL Cholesterol', min: 1, max: 300 },
          { id: 'lchol', type: 'number', label: 'LDL Cholesterol', min: 1, max: 300 },
          { id: 'vchol', type: 'number', label: 'VLDL Cholesterol', min: 1, max: 500 },
        ]}
      />

      <HealthForm
        id="glucoseDialog"
        title="Glucose Info"
        storageKey="glucose"
        fields={[
          { id: 'glucoseDate', type: 'date', label: 'Date' },
          { id: 'fasting', type: 'number', label: 'Fasting Glucose' },
          { id: 'post', type: 'number', label: 'Postprandial Glucose' },
          { id: 'hba1c', type: 'number', label: 'HbA1c' },
        ]}
      />

      <HealthForm
        id="liverDialog"
        title="Liver Info"
        storageKey="liver"
        fields={[
          { id: 'liverDate', type: 'date', label: 'Date' },
          { id: 'alt', type: 'number', label: 'ALT' },
          { id: 'ast', type: 'number', label: 'AST' },
          { id: 'bilirubin', type: 'number', label: 'Bilirubin' },
        ]}
      />

      <HealthForm
        id="prescriptionDialog"
        title="Prescription Info"
        storageKey="prescriptions"
        isFileUpload={true}
        fields={[
          { id: 'prescriptionDate', type: 'date', label: 'Date' },
          { id: 'prescriptionFile', type: 'file', label: 'Upload File', accept: '.pdf,.jpg,.jpeg,.png' },
        ]}
      />

      <SummarySection />
    </div>
  );
}

export default App;
