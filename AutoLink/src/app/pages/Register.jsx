import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';

import { auth, db } from '../../firebase/firebase';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { formatPhoneByThreeDigits } from '../utils/phone';
import './Register.css';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '', 
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    userType: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (form.password !== form.confirmPassword) {
      setError('As passwords têm que ser iguais');
      return;
    }
    
    try {
      await register(
        form.name,
        form.email,
        form.password,
        form.phoneNumber,
        form.userType
      );
    } catch (err) {
      setError(err.code);
    }
  };

  async function register(name, email, password, phoneNumber, userType) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      email,
      name,
      phoneNumber: formatPhoneByThreeDigits(phoneNumber),
      userType
    });
    return cred;
  }

  return (
    <div className="register-page-container">
      <div className="register-form-card">
        <h2>Criar Conta</h2>
        
        <Box 
          component="form" 
          onSubmit={onSubmit} 
          className="register-form-layout"
        >
          {error && (
            <Alert severity="error" className="register-alert">
              {error}
            </Alert>
          )}
          
          <TextField 
            label="Full name" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            required 
            fullWidth
          />
          
          <TextField 
            label="Email" 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            required 
            fullWidth
          />
          
          <TextField 
            label="Password" 
            name="password" 
            type="password" 
            value={form.password} 
            onChange={handleChange}
            required 
            fullWidth
          />
          
          <TextField 
            label="Confirm password" 
            name="confirmPassword" 
            type="password" 
            value={form.confirmPassword} 
            onChange={handleChange}
            required 
            fullWidth
          />
          
          <TextField 
            label="Phone number" 
            name="phoneNumber" 
            value={form.phoneNumber} 
            onChange={handleChange}
            required 
            fullWidth
          />
          
          <Select 
            name="userType" 
            value={form.userType} 
            onChange={handleChange}
            required
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>Select User Type</MenuItem>
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            className="btn-register-submit"
            fullWidth
          >
            Register
          </Button>
        </Box>
      </div>
    </div>
  );
}