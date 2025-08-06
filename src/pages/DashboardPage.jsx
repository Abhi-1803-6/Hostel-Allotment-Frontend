import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';
import { toast } from 'react-toastify';
//import io from 'socket.io-client';
import socket from '../socket';
import CountdownTimer from '../components/CountdownTimer';
import { Container, Paper, Typography, Box, Button, CircularProgress, List, ListItem, ListItemText, Divider, TextField, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

//const socket = io('http://localhost:5000');

// The RoomSelection component remains unchanged
function RoomSelection({ group, userInfo, onSelectionSuccess, deadline }) {
    const [availableRooms, setAvailableRooms] = useState([]);

    useEffect(() => {
        const fetchAvailableRooms = async () => {
            const { data } = await api.get('/api/rooms');
            setAvailableRooms(data.filter(room => room.isAvailable && room.capacity === group.size));
        };
        fetchAvailableRooms();
    }, [group.size]);

   const handleSelectRoom = async (roomId) => {
        if (!window.confirm('Are you sure you want to select this room?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await api.post('/api/allotment/select-room', { roomId }, config);
            toast.success('Room selected successfully!');
            onSelectionSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error selecting room.');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, border: '2px solid green' }}>
            <Typography variant="h5" color="green" gutterBottom>It's Your Turn! Select a Room</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h6">Time Remaining:</Typography>
                <CountdownTimer deadline={deadline} />
            </Box>
            <Grid container spacing={2}>
                {availableRooms.length > 0 ? availableRooms.map(room => (
                    <Grid item xs={12} sm={6} md={4} key={room._id}>
                        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">{room.roomNumber}</Typography>
                            <Typography variant="body2">Capacity: {room.capacity}</Typography>
                            <Button variant="contained" sx={{ mt: 1 }} onClick={() => handleSelectRoom(room._id)}>Select</Button>
                        </Paper>
                    </Grid>
                )) : <Typography sx={{p: 2}}>No available rooms match your group size.</Typography>}
            </Grid>
        </Paper>
    );
}

function DashboardPage() {
    const { logoutUser } = useAuth();

    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [group, setGroup] = useState(null);
    const [invitations, setInvitations] = useState([]);
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [groupSize, setGroupSize] = useState(3);
    const [rollNumberToInvite, setRollNumberToInvite] = useState('');
    const [deadline, setDeadline] = useState(null);

    const fetchData = async (token) => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data: groupData } = await api.get('/api/groups/my-group', config);
            setGroup(groupData);
            setInvitations([]);
        } catch (error) {
            setGroup(null);
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data: invitationData } = await api.get('/api/invitations', config);
                setInvitations(invitationData);
            } catch (invitationError) {
                console.error("Could not fetch invitations");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!storedUserInfo) {
            navigate('/login');
            return;
        }
        socket.connect(); // Manually connect the socket when the component mounts
        setUserInfo(storedUserInfo);

        const checkTurnStatus = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${storedUserInfo.token}` } };
                const { data } = await api.get('/api/allotment/status', config);
                if (data.isMyTurn) {
                    setIsMyTurn(true);
                    setDeadline(data.deadline);
                }
            } catch (error) {
                console.error("Could not fetch turn status.");
            }
        };

        // --- All functions are now fully defined inside useEffect ---
        function onConnect() {
            console.log('Connected to socket server!');
            socket.emit('join_notification_room', storedUserInfo.rollNumber);
        }
        function onYourTurn(data) {
            console.log('It is my turn!', data);
            toast.message('It is your turn to select a room!');
            setGroup(data.group);
            setDeadline(data.deadline);
            setIsMyTurn(true);
        }
        function onTurnEnded() {
            alert("Time's up! Your turn has ended.");
            setIsMyTurn(false);
        }
        function onSelectionSuccessful() {
            setIsMyTurn(false);
            fetchData(storedUserInfo.token);
        }

        socket.on('connect', onConnect);
        socket.on('your_turn', onYourTurn);
        socket.on('turn_ended', onTurnEnded);
        socket.on('selection_successful', onSelectionSuccessful);

        fetchData(storedUserInfo.token);
        checkTurnStatus();

        return () => {
            socket.disconnect(); // Clean up the socket connection on unmount
            socket.off('connect', onConnect);
            socket.off('your_turn', onYourTurn);
            socket.off('turn_ended', onTurnEnded);
            socket.off('selection_successful', onSelectionSuccessful);
        };
    }, [navigate]);

    const handleLogout = () => {  
        logoutUser();
        navigate('/login');
     };
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await api.post('/api/groups/create', { size: groupSize }, config);
            toast.success('Group created successfully!');
            fetchData(userInfo.token);
        } catch (error) { toast.error(`Error creating group: ${error.response.data.message}`); }
    };
    const handleInviteMember = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await api.post(`/api/groups/${group._id}/invite`, { rollNumberToInvite }, config);
            toast.success(data.message);
            setRollNumberToInvite('');
        } catch (error) { toast.error(`Error inviting member: ${error.response.data.message}`); }
    };
    const handleLeaveGroup = async () => {
        if (!window.confirm('Are you sure you want to leave/dissolve this group?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await api.post('/api/groups/leave', {}, config);
            toast.success(data.message);
            fetchData(userInfo.token);
        } catch (error) { toast.error(`Error leaving group: ${error.response.data.message}`); }
    };
    const handleRemoveMember = async (memberId) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await api.delete(`/api/groups/remove/${memberId}`, config);
            toast.success(data.message);
            fetchData(userInfo.token);
        } catch (error) { toast.error(`Error removing member: ${error.response.data.message}`); }
    };
    const handleInvitationResponse = async (invitationId, action) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}`}};
            const { data } = await api.post(`/api/invitations/${invitationId}/respond`, { action }, config);
            toast.success(data.message);
            fetchData(userInfo.token);
        } catch (error) { toast.error(`Error: ${error.response.data.message}`); }
      };

     const renderContent = () => {
        if (isMyTurn && group && userInfo?._id === group.leader._id) {
            return <RoomSelection group={group} userInfo={userInfo} deadline={deadline} onSelectionSuccess={() => { setIsMyTurn(false); fetchData(userInfo.token); }} />;
        }
        if (group) {
            if (group.allottedRoom) {
                return <Typography variant="h5" color="success.main">Congratulations! Your group has been allotted Room: {group.allottedRoom.roomNumber}</Typography>;
            }
            return (
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom>Your Group Details {group.isFinalized && "(Locked)"}</Typography>
                    <List>
                        {group.members.map((member) => (
                            <ListItem key={member._id} secondaryAction={!group.isFinalized && userInfo?._id === group.leader._id && userInfo?._id !== member._id ? <Button size="small" color="error" onClick={() => handleRemoveMember(member._id)}>Remove</Button> : null}>
                                <ListItemText primary={member.name} secondary={`Roll: ${member.rollNumber} - Rank: ${member.rank}`} />
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        {!group.isFinalized && userInfo?._id === group.leader._id && <Button variant="contained" color="error" onClick={handleLeaveGroup}>Leave & Dissolve Group</Button>}
                        {!group.isFinalized && userInfo?._id !== group.leader._id && <Button variant="outlined" color="error" onClick={handleLeaveGroup}>Leave Group</Button>}
                    </Box>
                    {!group.isFinalized && userInfo?._id === group.leader._id && group.members.length < group.size && (
                        <Box component="form" onSubmit={handleInviteMember} sx={{ mt: 3, borderTop: '1px solid #eee', pt: 2 }}>
                            <Typography variant="h6">Invite New Member</Typography>
                            <TextField label="Enter Roll Number" size="small" value={rollNumberToInvite} onChange={(e) => setRollNumberToInvite(e.target.value)} required />
                            <Button type="submit" variant="contained" sx={{ ml: 1 }}>Invite</Button>
                        </Box>
                    )}
                </Paper>
            );
        } else {
            return (
                <Paper elevation={2} sx={{ p: 2 }}>
                    {invitations.length > 0 && (
                        <Box mb={3}>
                            <Typography variant="h6">Pending Invitations</Typography>
                            {invitations.map(inv => (
                                <Paper key={inv._id} variant="outlined" sx={{ p: 2, mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography>From: {inv.groupId.leader.name}</Typography>
                                    <Box>
                                        <Button variant="contained" size="small" color="success" onClick={() => handleInvitationResponse(inv._id, 'accept')}>Accept</Button>
                                        <Button variant="outlined" size="small" color="error" sx={{ ml: 1 }} onClick={() => handleInvitationResponse(inv._id, 'reject')}>Reject</Button>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    )}
                    <Typography variant="h6">Create a Group</Typography>
                    <Box component="form" onSubmit={handleCreateGroup} sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                        <FormControl size="small">
                            <InputLabel>Group Size</InputLabel>
                            <Select value={groupSize} label="Group Size" onChange={(e) => setGroupSize(Number(e.target.value))}>
                                <MenuItem value={3}>Triplet (3)</MenuItem>
                                <MenuItem value={4}>Fourlet (4)</MenuItem>
                            </Select>
                        </FormControl>
                        <Button type="submit" variant="contained">Create Group</Button>
                    </Box>
                </Paper>
            );
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography component="h1" variant="h5">Welcome, {userInfo?.name}!</Typography>
                    <Button variant="outlined" onClick={handleLogout}>Logout</Button>
                </Box>
                <Divider />
                <Box sx={{ mt: 3 }}>
                    {loading ? <CircularProgress /> : renderContent()}
                </Box>
            </Paper>
        </Container>
    );
}

export default DashboardPage;