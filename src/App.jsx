import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEmployees,
  fetchCountries,
  addEmployeeAsync,
  updateEmployeeAsync,
  deleteEmployeeAsync,
} from './features/employeeSlice';
import EmployeeTable from './components/EmployeeTable';

const App = () => {
  const dispatch = useDispatch();
  const { list: employees, countries, loading, error } = useSelector((state) => state.employee);

  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', country: 'India', state: '', district: '',
  });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchCountries());
  }, [dispatch]);

  const validate = () => {
    let errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Invalid email format';
    }
    if (!formData.mobile.trim()) {
      errs.mobile = 'Mobile is required';
    } else if (formData.mobile.length < 10) {
      errs.mobile = 'Mobile must be at least 10 digits';
    }
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.district.trim()) errs.district = 'District is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editId) {
      dispatch(updateEmployeeAsync({ id: editId, ...formData }));
      setEditId(null);
    } else {
      dispatch(addEmployeeAsync(formData));
    }
    setFormData({ name: '', email: '', mobile: '', country: 'India', state: '', district: '' });
    setErrors({});
  };

  const handleEdit = (emp) => {
    setEditId(emp.id);
    setFormData({
      name: emp.name || '',
      email: emp.email || '',
      mobile: emp.mobile || '',
      country: emp.country || 'India',
      state: emp.state || '',
      district: emp.district || '',
    });
  };

  const confirmDelete = () => {
    if (deleteId) {
      dispatch(deleteEmployeeAsync(deleteId));
      setDeleteId(null);
    }
  };

  const filteredEmployees = (employees || []).filter((emp) => {
    if (!searchTerm) return true;
    return String(emp.id) === searchTerm.trim() || emp.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Employee Management Application</h2>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div>
          <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          {errors.name && <p style={{ color: 'red', margin: 0, fontSize: '12px' }}>{errors.name}</p>}
        </div>
        <div>
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          {errors.email && <p style={{ color: 'red', margin: 0, fontSize: '12px' }}>{errors.email}</p>}
        </div>
        <div>
          <input type="text" placeholder="Mobile" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
          {errors.mobile && <p style={{ color: 'red', margin: 0, fontSize: '12px' }}>{errors.mobile}</p>}
        </div>
        <div>
          <select value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })}>
            {countries && countries.length > 0 ? (
              countries.map((c, i) => <option key={i} value={c.name || c}>{c.name}</option>)
            ) : (
              <option value="India">India</option>
            )}
          </select>
        </div>
        <div>
          <input type="text" placeholder="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
          {errors.state && <p style={{ color: 'red', margin: 0, fontSize: '12px' }}>{errors.state}</p>}
        </div>
        <div>
          <input type="text" placeholder="District" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} />
          {errors.district && <p style={{ color: 'red', margin: 0, fontSize: '12px' }}>{errors.district}</p>}
        </div>
        <button type="submit">{editId ? 'Update Employee' : 'Add Employee'}</button>
      </form>

      {/* Search */}
      <input
        type="text"
        placeholder="Search employee by ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '8px', width: '250px' }}
      />

      {/* Table / Loading / Empty State */}
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <EmployeeTable employees={filteredEmployees} onEdit={handleEdit} onDelete={(id) => setDeleteId(id)} />
      )}

      {/* Confirmation Modal */}
      {deleteId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '5px' }}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this employee?</p>
            <button onClick={confirmDelete} style={{ background: 'red', color: '#fff', padding: '8px 15px', marginRight: '10px' }}>Yes, Delete</button>
            <button onClick={() => setDeleteId(null)} style={{ padding: '8px 15px' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App; 