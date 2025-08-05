import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext'; // 1. Import the useAuth hook

// MUI Imports
import { Button, TextField, Container, Typography, Box, Paper } from '@mui/material';

function AdminLoginPage() {
    const navigate = useNavigate();
    const { loginAdmin } = useAuth(); // 2. Get the loginAdmin function from the context
    const [formData, setFormData] = useState({ email: '', password: '' });

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            // 3. Use the context function to handle the login
            await loginAdmin(formData);
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Admin Login
                </Typography>
                <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formData.email}
                        onChange={onChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={onChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default AdminLoginPage;