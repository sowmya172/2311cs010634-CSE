import { useEffect, useState, useRef } from "react";
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
  TextField,
  CardActionArea,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getNotifications } from "../services/notificationService";
import { NotificationPriorityQueue } from "../utils/PriorityQueue";
import { useViewedNotifications } from "../hooks/useViewedNotifications";
import { Log } from "../utils/logger";

function PriorityInbox() {
  const [priorityNotifications, setPriorityNotifications] = useState([]);
  const [n, setN] = useState(10);
  const [type, setType] = useState("");
  const { viewedIds, markAsViewed } = useViewedNotifications();
  const nInputRef = useRef(n);

  useEffect(() => {
    let intervalId;

    const pollData = async () => {
      try {
        const params = {};
        if (type !== "") {
          params.notification_type = type;
        }
        const data = await getNotifications(params);
        
        const queue = new NotificationPriorityQueue(n);
        
        data.forEach((notification) => {
          if (!viewedIds.has(notification.ID)) {
            queue.add(notification);
          }
        });

        setPriorityNotifications(queue.getTopN());
        
        await Log(
            "frontend",
            "info",
            "PriorityInbox",
            "Priority notifications fetched successfully"
        );
      } catch (err) {
        console.error(err);
        await Log(
            "frontend",
            "error",
            "PriorityInbox",
            "Failed to fetch priority notifications"
        );
      }
    };

    pollData();
    intervalId = setInterval(pollData, 10000); // Poll every 10s for new notifications

    return () => clearInterval(intervalId);
  }, [type, n, viewedIds]); // Re-run when type, n, or viewedIds changes

  const handleNChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) {
      setN(val);
      nInputRef.current = val;
    }
  };

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
          Priority Inbox
        </Typography>

        <Box sx={{ mb: 3, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <TextField
            label="Top 'N' Notifications"
            type="number"
            defaultValue={nInputRef.current}
            onBlur={handleNChange}
            onKeyDown={(e) => {
                if (e.key === 'Enter') handleNChange(e);
            }}
            size="small"
            sx={{ width: 180 }}
          />
          <Box>
            <Button
              variant={type === "" ? "contained" : "outlined"}
              onClick={() => setType("")}
              sx={{ mr: 1 }}
            >
              ALL
            </Button>
            <Button
              variant={type === "Event" ? "contained" : "outlined"}
              onClick={() => setType("Event")}
              sx={{ mr: 1 }}
            >
              EVENT
            </Button>
            <Button
              variant={type === "Placement" ? "contained" : "outlined"}
              onClick={() => setType("Placement")}
              sx={{ mr: 1 }}
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
        </Box>

        <Grid container spacing={3}>
          {priorityNotifications.length === 0 && (
              <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary">
                      No unread priority notifications found.
                  </Typography>
              </Grid>
          )}
          {priorityNotifications.map((notification, index) => (
            <Grid item xs={12} md={6} key={notification.ID}>
              <Card elevation={5} sx={{ borderLeft: "6px solid", borderColor: "primary.main" }}>
                <CardActionArea onClick={() => markAsViewed(notification.ID)}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      #{index + 1} - {notification.Type}
                    </Typography>
                    <Typography sx={{ mt: 1, mb: 2, fontWeight: 500 }}>
                      {notification.Message}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        {notification.Timestamp}
                      </Typography>
                      <Chip label="Unread" color="error" size="small" />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default PriorityInbox;