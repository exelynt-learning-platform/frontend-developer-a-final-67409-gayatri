import React from 'react';

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  if (!employees || employees.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>No employee found</div>;
  }

  return (
    <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Mobile</th>
          <th>Country</th>
          <th>State</th>
          <th>District</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp) => (
          <tr key={emp.id}>
            <td>{emp.id}</td>
            <td>{emp.name}</td>
            <td>{emp.email}</td>
            <td>{emp.mobile}</td>
            <td>{emp.country}</td>
            <td>{emp.state}</td>
            <td>{emp.district}</td>
            <td>
              <button onClick={() => onEdit(emp)}>Edit</button>
              <button onClick={() => onDelete(emp.id)} style={{ color: 'red', marginLeft: '5px' }}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeeTable;