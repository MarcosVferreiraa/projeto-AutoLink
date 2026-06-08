import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState("");

    const { login } = useAuth();

    const handleChange = (e) =>
        setForm(f => ({
            ...f,
            [e.target.name]: e.target.value
        }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(form.email, form.password);
        } catch (err) {
            setError(err.code);
        }
    };

    return (
        <Box component="form" onSubmit={onSubmit}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
            />

            <TextField
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
            />

            <Button type="submit">Login</Button>
        </Box>
    );
}