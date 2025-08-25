import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';
import { toast } from 'react-toastify';
//import io from 'socket.io-client';
import socket from '../socket';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

// MUI Imports
import { Button, Container, Typography, Box, Paper, TextField, List, ListItem, ListItemText, CircularProgress, Divider, Switch, FormControlLabel } from '@mui/material';

//const socket = io('http://localhost:5000');

function AdminDashboardPage() {
   const { adminInfo, logoutAdmin } = useAuth();
    const navigate = useNavigate();
    const [ranksJson, setRanksJson] = useState('');
    const [rooms, setRooms] = useState([]);
    const [roomsJson, setRoomsJson] = useState('');
    const [allGroups, setAllGroups] = useState([]);
    const [showGroups, setShowGroups] = useState(false);
    const [isAllotmentRunning, setIsAllotmentRunning] = useState(false);
    const [groupsLoading, setGroupsLoading] = useState(false);
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);

    const config = {
        headers: {
            Authorization: `Bearer ${adminInfo?.token}`,
        },
    };
    // This function is defined before being used in useEffect
    const fetchRooms = async () => {
        try {
            const { data } = await api.get('/api/rooms');
            setRooms(data);
        } catch (error) {
            console.error('Could not fetch rooms', error);
        }
    };
    
    // This function is defined before being used in useEffect
    const checkStatus = async () => {
        try {
            const { data } = await api.get('/api/allotment/admin-status');
            setIsAllotmentRunning(data.allotmentInProgress);
        } catch(error) {
            console.error('Could not fetch allotment status', error);
        }
    };

    useEffect(() => {
        socket.connect(); // Manually connect the socket when the component mounts
        fetchRooms();
        checkStatus();

        socket.on('allotment_finished', (data) => {
            toast.success(data.message || 'The allotment process has concluded.');
            setIsAllotmentRunning(false);
        });
        socket.on('allotment_cancelled', (data) => {
            toast.warning(data.message);
            setIsAllotmentRunning(false);
        });

        return () => {
            socket.disconnect(); // Clean up the socket connection on unmount
            socket.off('allotment_finished');
            socket.off('allotment_cancelled');
        };
    }, []);

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin-login'); 
    };

     const handleApiCall = async (apiCall, successMessage) => {
        try {
            if (!adminInfo?.token) {
                throw new Error("Authentication error. Please log in again.");
            }
            const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
            const { data } = await apiCall(config);
            if(successMessage) toast.success(successMessage);
            return data;
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || 'An error occurred on the server.');
            } else {
                toast.error(error.message || 'An unexpected error occurred.');
            }
        }
    };

    const handleUploadRanks = async (e) => {
        e.preventDefault();
        if (!window.confirm('WARNING: This will delete ALL existing students, groups, and invitations and start a fresh session. Are you sure?')) return;
       const ranks = JSON.parse(ranksJson);
        handleApiCall(
            (config) => api.post('/api/admin/upload-ranks', ranks, config),
            'Rank list uploaded successfully!'
        ).then(() => setRanksJson(''));
    };
    
    const handleUploadRooms = async (e) => {
        e.preventDefault();
        if (!window.confirm('This will delete the old room list and upload a new one. Are you sure?')) return;
        const roomData = JSON.parse(roomsJson);
        handleApiCall(
            (config) => api.post('/api/admin/upload-rooms', roomData, config),
            'Room list uploaded successfully!'
        ).then(() => { setRoomsJson(''); fetchRooms(); });
    };

    const handleLockGroups = async () => {
        if (!window.confirm('Are you sure? This will lock all groups.')) return;
         handleApiCall(
            (config) => api.post('/api/admin/lock-groups', {}, config),
            'Groups locked successfully!'
        );
    };

    const handleUnlockGroups = async () => {
        if (!window.confirm('Are you sure you want to unlock all groups?')) return;
         handleApiCall(
            (config) => api.post('/api/admin/unlock-groups', {}, config),
            'Groups unlocked successfully!'
        );
    };

    const handleStartAllotment = async () => {
        if (!window.confirm('START ALLOTMENT? This action cannot be undone.')) return;
       handleApiCall(
            (config) => api.post('/api/allotment/start', {}, config),
            'Allotment process started!'
        ).then(() => setIsAllotmentRunning(true));
    };

     const handleCancelAllotment = async () => {
        if (!window.confirm('Are you sure you want to cancel the running allotment? This will reset any rooms allotted so far.')) return;
        handleApiCall(
            (config) => api.post('/api/allotment/cancel', {}, config),
            'Allotment cancelled successfully.'
        ).then(() => setIsAllotmentRunning(false));
    };
    
    const handleResetAllotment = async () => {
        if (!window.confirm('Are you sure you want to reset the entire allotment state? All allotted rooms will be cleared and groups will be unlocked.')) return;
        handleApiCall(
            (config) => api.post('/api/admin/reset-allotment', {}, config),
            'Demo state has been reset!'
        ).then(() => { checkStatus(); setShowGroups(false); });
    };


    const handleViewGroups = async () => {
        if (showGroups) {
            setShowGroups(false);
            return;
        }
        setGroupsLoading(true);
        const data = await handleApiCall((config) => api.get('/api/admin/groups', config));
        if (data) {
            setAllGroups(data);
            setShowGroups(true);
        }
        setGroupsLoading(false);
    };
     const roomsToDisplay = showOnlyAvailable ? rooms.filter(room => room.isAvailable) : rooms;

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography component="h1" variant="h4">Admin Dashboard</Typography>
                    <Button variant="outlined" onClick={handleLogout}>Logout</Button>
                </Box>
                 <Paper elevation={2} sx={{ p: 2, my: 3, border: '1px solid #1976d2' }}>
                    <Typography variant="h6" gutterBottom>🔄 Demo Control</Typography>
                    <Button variant="contained" color="info" onClick={handleResetAllotment}>
                        Reset Demo State
                    </Button>
                </Paper>

                <Paper elevation={2} sx={{ p: 2, border: '1px solid #d32f2f' }}>
                    <Typography variant="h6" gutterBottom>🔒 Allotment Control</Typography>
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Button variant="contained" color="warning" onClick={handleLockGroups} disabled={isAllotmentRunning}> Lock All Groups</Button>
                        <Button variant="contained" color="secondary" onClick={handleUnlockGroups} disabled={isAllotmentRunning}>Unlock Groups</Button>
                        {isAllotmentRunning ? (
                             <Button variant="contained" color="error" onClick={handleCancelAllotment}>Cancel Allotment</Button>
                        ) : (
                             <Button variant="contained" color="success" onClick={handleStartAllotment}> Start Allotment</Button>
                        )}
                    </Box>
                </Paper>

                <Paper elevation={2} sx={{ my: 3, p: 2 }}>
                    <Typography variant="h6" gutterBottom>👥 View All Groups</Typography>
                    <Button onClick={handleViewGroups} sx={{ mb: 1 }} disabled={isAllotmentRunning}>{showGroups ? 'Hide Groups' : 'Show All Groups'}</Button>
                    {groupsLoading ? <CircularProgress /> : showGroups && (
                        <List>
                            {allGroups.map((group, index) => (
                                <React.Fragment key={group._id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={`Group Leader: ${group.leader.name} (${group.leader.rollNumber})`}
                                            secondary={
                                                <>
                                                    Members: {group.members.map(m => m.name).join(', ')}
                                                    <br />
                                                    Status: {group.isFinalized ? 'Locked' : 'Unlocked'}
                                                    {group.allottedRoom && <Typography component="span" sx={{ color: 'green' }}> - Allotted: {group.allottedRoom.roomNumber}</Typography>}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < allGroups.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Paper>

                <Paper elevation={2} sx={{ my: 3, p: 2 }}>
                    <Typography variant="h6" gutterBottom>🚪 Manage Rooms</Typography>
                     <Box component="form" onSubmit={handleUploadRooms} sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>{'Paste an array of room objects. Format: `[{"roomNumber": "A-101", "capacity": 3}]`'}</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            value={roomsJson}
                            onChange={(e) => setRoomsJson(e.target.value)}
                            disabled={isAllotmentRunning}
                            placeholder='[{"roomNumber": "A-101", "capacity": 3}]'
                            required
                        />
                        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={isAllotmentRunning}>Upload Room List</Button>
                    </Box>
                    <Divider sx={{ my: 2 }} />

                      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>
                            {showOnlyAvailable ? `Available Rooms (${roomsToDisplay.length})` : `All Rooms (${roomsToDisplay.length})`}
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={showOnlyAvailable}
                                    onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                                    name="showOnlyAvailable"
                                    color="primary"
                                />
                            }
                            label="Show Only Available"
                        />
                    </Box>
                    <List dense>
                        {roomsToDisplay.length > 0 ? roomsToDisplay.map(room => (
                            <ListItem key={room._id}>
                                <ListItemText 
                                    primary={`${room.roomNumber} (Capacity: ${room.capacity})`} 
                                    secondary={room.isAvailable ? <Typography component="span" color="green">Available</Typography> : <Typography component="span" color="red">Allotted</Typography>}
                                />
                            </ListItem>
                        )) : <ListItem><ListItemText primary="No rooms to display." /></ListItem>}
                    </List>
                </Paper>

                <Paper elevation={2} sx={{ my: 3, p: 2 }}>
                    <Typography variant="h6" gutterBottom>📊 Upload Rank List</Typography>
                     <Box component="form" onSubmit={handleUploadRanks} sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>{'Paste an array of JSON objects. Format: `[{"rollNumber": "22BCS001", "rank": 1}]`'}</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            value={ranksJson}
                            onChange={(e) => setRanksJson(e.target.value)}
                            disabled={isAllotmentRunning}
                            placeholder='[{"rollNumber": "22BCS001", "rank": 1}]'
                            required
                        />
                        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={isAllotmentRunning}>Upload Ranks</Button>
                    </Box>
                </Paper>
            </Paper>
        </Container>
    );
}

export default AdminDashboardPage;