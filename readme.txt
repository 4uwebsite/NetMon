Project Codename: NetMon
Current Version: 1.202404231853
Description: Monitor the internet connectivity while logging it.

Features:
- Internet connected/disconnected status.
- Connection Type.
- Session duration.
- Time elapsed since last connected/disconnected.
- Data logging:
    - Data Structure:
        event = {
            id: "timestamp",
            sessionid: "SIDtimestamp",
            conStat: "con/dis",
            connData: "4G/10mbps/100ms"
        }
- Log Export.
- Notifications.