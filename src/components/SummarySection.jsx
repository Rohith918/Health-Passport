import React, { useEffect, useState } from 'react';

const SummarySection = () => {
  const [data, setData] = useState({
    cardio: [],
    glucose: [],
    liver: [],
    prescriptions: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setData({
      cardio: JSON.parse(localStorage.getItem('cardio') || '[]'),
      glucose: JSON.parse(localStorage.getItem('glucose') || '[]'),
      liver: JSON.parse(localStorage.getItem('liver') || '[]'),
      prescriptions: JSON.parse(localStorage.getItem('prescriptions') || '[]')
    });
  };

  const deleteRecord = (key, index) => {
    const updated = [...data[key]];
    updated.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(updated));
    loadData();
  };

  const renderTable = (records, key) => {
    if (!records.length) return null;

    const headers = Object.keys(records[0]);

    return (
      <div key={key}>
        <h2>{key.charAt(0).toUpperCase() + key.slice(1)} Records</h2>
        <table>
          <thead>
            <tr>
              {headers.map((head) => (
                <th key={head}>{head}</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index}>
                {headers.map((field) => {
                  if (field === 'fileData') {
                    const fileName = record.fileName?.toLowerCase() || '';
                    if (fileName.endsWith('.pdf')) {
                      return (
                        <td key={field}>
                          <embed src={record[field]} type="application/pdf" width="100" height="100" />
                        </td>
                      );
                    } else if (fileName.match(/\.(jpg|jpeg|png)$/)) {
                      return (
                        <td key={field}>
                          <img src={record[field]} alt={record.fileName} style={{ width: '100px' }} />
                        </td>
                      );
                    } else {
                      return (
                        <td key={field}>
                          <a href={record[field]} download={record.fileName}>
                            {record.fileName}
                          </a>
                        </td>
                      );
                    }
                  } else {
                    return <td key={field}>{record[field]}</td>;
                  }
                })}
                <td>
                  <button onClick={() => deleteRecord(key, index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="summary">
      {renderTable(data.cardio, 'cardio')}
      {renderTable(data.glucose, 'glucose')}
      {renderTable(data.liver, 'liver')}
      {renderTable(data.prescriptions, 'prescriptions')}
    </div>
  );
};

export default SummarySection;
