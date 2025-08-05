import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

// MUI Imports
import { Button, TextField, Container, Typography, Box, Paper, Link } from '@mui/material';


function LoginPage() {
    const { loginUser } = useAuth(); 
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ rollNumber: '', password: '' });
    const { rollNumber, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await loginUser(formData);
            navigate('/dashboard');
            
        } catch (err) {
            toast.error(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Student Login
                </Typography>
                <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="rollNumber"
                        label="Roll Number"
                        name="rollNumber"
                        autoFocus
                        value={rollNumber}
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
                        value={password}
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
                    <Link component={RouterLink} to="/register" variant="body2">
                        {"Don't have an account? Register"}
                    </Link>
                </Box>
            </Paper>
        </Container>
    );
}

export default LoginPage;