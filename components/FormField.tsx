import React from 'react';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, value, onChange, error, type = 'text', placeholder }) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ display: 'block', marginBottom: 6, color: 'var(--muted)', fontWeight: 500, fontSize: 14 }}>{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: 6,
        border: error ? '1.5px solid #E57373' : '1.5px solid #33344A',
        background: 'var(--primary-bg)',
        color: 'var(--text)',
        fontSize: 15,
        outline: 'none',
        marginBottom: 2,
      }}
    />
    {error && <span style={{ color: '#E57373', fontSize: 13 }}>{error}</span>}
  </div>
);

export default FormField;
