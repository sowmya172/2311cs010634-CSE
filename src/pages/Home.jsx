import { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    Chip,
    Box,
    CardActionArea,
    Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getNotifications } from "../services/notificationService";
import { Log } from "../utils/logger";
import { useViewedNotifications } from "../hooks/useViewedNotifications";

function Home() {
    const [notifications, setNotifications] = useState([]);
    const [type, setType] = useState("");
    const [error, setError] = useState(null);
    const { viewedIds, markAsViewed } = useViewedNotifications();

    useEffect(() => {
        let intervalId;

        const fetchData = async () => {
            try {
                const params = {};

                if (type !== "") {
                    params.notification_type = type;
                }

                const data = await getNotifications(params);
                setNotifications(data || []);
                setError(null);

                await Log(
                    "frontend",
                    "info",
                    "Home",
                    "Notifications fetched successfully"
                );
            } catch (err) {
                console.error("Fetch error details:", err);
                setError(err.message || "Failed to fetch notifications");
                await Log(
                    "frontend",
                    "error",
                    "Home",
                    "Failed to fetch notifications: " + (err.message || err.toString())
                );
            }
        };

        fetchData();
        intervalId = setInterval(fetchData, 10000); // Polling every 10s

        return () => clearInterval(intervalId);
    }, [type]);

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Notification Service
                    </Typography>

                    <Button color="inherit" component={Link} to="/">
                        Home
                    </Button>

                    <Button color="inherit" component={Link} to="/priority">
                        Priority Inbox
                    </Button>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    All Notifications
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mb: 3 }}>
                    <Button
                        variant={type === "" ? "contained" : "outlined"}
                        onClick={() => setType("")}
                        sx={{ mr: 2 }}
                    >
                        ALL
                    </Button>

                    <Button
                        variant={type === "Event" ? "contained" : "outlined"}
                        onClick={() => setType("Event")} sx={{ mr: 2 }}
                    >
                        EVENT
                    </Button>

                    <Button
                        variant={type === "Placement" ? "contained" : "outlined"}
                        onClick={() => setType("Placement")} sx={{ mr: 2 }}
                    >
                        PLACEMENT
                    </Button>

                    <Button
                        variant={type === "Result" ? "contained" : "outlined"}
                        onClick={() => setType("Result")}
                    >
                        RESULT
                    </Button>
                </Box>
                <Grid container spacing={3}>
                    {notifications.map((notification) => {
                        const isRead = viewedIds.has(notification.ID);
                        return (
                        <Grid item xs={12} md={6} key={notification.ID}>
                            <Card 
                                elevation={isRead ? 1 : 5} 
                                sx={{ 
                                    opacity: isRead ? 0.6 : 1,
                                    borderLeft: isRead ? "6px solid grey" : "6px solid #1976d2"
                                }}
                            >
                                <CardActionArea onClick={() => markAsViewed(notification.ID)}>
                                    <CardContent>
                                        <Typography variant="h6" color={isRead ? "text.secondary" : "primary"}>
                                            {notification.Type}
                                        </Typography>

                                        <Typography sx={{ mt: 1, fontWeight: isRead ? 400 : 500 }}>
                                            {notification.Message}
                                        </Typography>

                                        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {notification.Timestamp}
                                            </Typography>

                                            <Chip
                                                label={isRead ? "Read" : "Unread"}
                                                color={isRead ? "default" : "error"}
                                                size="small"
                                            />
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </>
    );
}

export default Home;