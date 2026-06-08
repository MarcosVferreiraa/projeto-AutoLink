

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';

import { auth,db } from '../firebase/firebase';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';


export default function Register() {

   const [form,setForm]= useState(
    {
       name:'',
       email:'', 
       password:'',
       confirmPassword:'',
       phoneNumber:'',
       userType:''
    }
   );
   const [error,setError]= useState('');

   const handleChange= (e) => setForm (f => ({...f, [e.target.name]: e.target.value}))

   const onSubmit = async (e)=>{
   e.preventDefault();
   setError('')
   if (form.password !== form.confirmPassword){
    setError('As password têm que ser iguais')
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
    } catch(err){
        setError(err.code);
    }
    
   }

   async function register(name, email, password, phoneNumber, userType) {
    const cred = await createUserWithEmailAndPassword( auth,email,password);
    await setDoc(doc(db, 'users', cred.user.uid), {
    uid: cred.user.uid,
    email,
    name,
    phoneNumber,
    userType
});
    return cred;
   }

    return (
        <Box component="form"onSubmit={onSubmit}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Full name" name="name" value={form.name} onChange={handleChange} required/>
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} required />
            <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange}required />
            <TextField label="Confirm password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange}required />
            <TextField label="Phone number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange}required />
            <Select name="userType" value={form.userType} onChange={handleChange}required>
                <MenuItem value="customer">customer</MenuItem>
                <MenuItem value="admin">admin</MenuItem>
            </Select>
            <Button type="submit">Register</Button>

        </Box>
    )
}