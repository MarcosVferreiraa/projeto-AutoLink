import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase/firebase";
import Alert from "@mui/material/Alert";

export default function Login() {

    const [form, setform] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(form.email, form.password);
        } catch (err) {
            setError(err.code);
        }
    }
    async function login(email, password) {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        return cred;

    }

    return (
        <Box component="form" onSubmit={onSubmit}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Email" name="email" value={form.email} onChange={handleChenge} required />
            <TextField label="Password" type="password" name="password" value={form.password} onChange={handleChenge} required />
            <Button type="submit">Login</Button>

        </Box>
    )
}