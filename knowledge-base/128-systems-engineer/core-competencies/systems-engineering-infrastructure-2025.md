# Systems Engineering & Infrastructure 2025

**Updated**: 2025-11-23 | **Focus**: Linux Administration, Networking, Automation

---

## Linux System Administration

```bash
# USER MANAGEMENT

# Add user
sudo useradd -m -s /bin/bash john
# -m: Create home directory
# -s: Set shell

# Set password
sudo passwd john

# Add to sudo group
sudo usermod -aG sudo john
# -a: Append
# -G: Group

# List users
cat /etc/passwd | grep john

# Delete user
sudo userdel -r john
# -r: Remove home directory

---

# FILE PERMISSIONS

# View permissions
ls -l
# Output: -rw-r--r-- 1 user group 1234 Nov 23 10:00 file.txt
# - = file, d = directory, l = symlink
# rw- = owner (read, write)
# r-- = group (read)
# r-- = others (read)

# Change permissions (symbolic)
chmod u+x file.sh  # Add execute for owner
chmod g-w file.txt # Remove write for group
chmod o+r file.txt # Add read for others

# Change permissions (numeric)
chmod 755 script.sh
# 7 (rwx) = owner
# 5 (r-x) = group
# 5 (r-x) = others

# Change ownership
sudo chown user:group file.txt

---

# PROCESS MANAGEMENT

# List processes
ps aux | grep nginx

# Top (interactive)
top
htop  # Better UI

# Kill process
kill PID
kill -9 PID  # Force kill (SIGKILL)

# Background job
command &

# List jobs
jobs

# Bring to foreground
fg %1

# Service management (systemd)
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl status nginx
sudo systemctl enable nginx  # Start on boot

---

# DISK MANAGEMENT

# Disk usage
df -h
# -h: Human-readable (GB, not bytes)

# Directory size
du -sh /var/log
# -s: Summary (total)
# -h: Human-readable

# Find large files
find / -type f -size +1G 2>/dev/null

# Mount drive
sudo mount /dev/sdb1 /mnt/data

# Unmount
sudo umount /mnt/data

# Permanent mount (/etc/fstab)
/dev/sdb1 /mnt/data ext4 defaults 0 2

---

# PACKAGE MANAGEMENT

# Debian/Ubuntu (apt)
sudo apt update
sudo apt upgrade
sudo apt install nginx
sudo apt remove nginx
sudo apt autoremove  # Remove unused dependencies

# Red Hat/CentOS (yum/dnf)
sudo yum update
sudo yum install httpd
sudo dnf install nginx  # Newer systems

# List installed packages
dpkg -l | grep nginx

---

# LOGS

# View logs
tail -f /var/log/syslog  # Follow (real-time)
tail -n 100 /var/log/auth.log  # Last 100 lines

# Journal (systemd)
journalctl -u nginx  # Service logs
journalctl -f  # Follow
journalctl --since "1 hour ago"
journalctl -p err  # Priority: errors only

# Search logs
grep "error" /var/log/nginx/error.log
grep -r "failed login" /var/log/
```

---

## Networking

```bash
# NETWORK INTERFACES

# List interfaces
ip addr show
ip a  # Short

# Assign IP (temporary)
sudo ip addr add 192.168.1.100/24 dev eth0

# Bring interface up/down
sudo ip link set eth0 up
sudo ip link set eth0 down

# Permanent config (Netplan - Ubuntu)
# /etc/netplan/01-netcfg.yaml
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]

sudo netplan apply

---

# CONNECTIVITY

# Ping
ping -c 4 google.com
# -c: Count (4 packets)

# Traceroute
traceroute google.com

# DNS lookup
nslookup google.com
dig google.com

# Test port
telnet 192.168.1.1 80
nc -zv 192.168.1.1 80  # Netcat
# -z: Zero I/O (just test)
# -v: Verbose

---

# FIREWALL (iptables)

# List rules
sudo iptables -L -n -v
# -L: List
# -n: Numeric (don't resolve hostnames)
# -v: Verbose

# Allow port
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
# -A: Append
# -p: Protocol
# --dport: Destination port
# -j: Jump (action)

# Block IP
sudo iptables -A INPUT -s 192.168.1.50 -j DROP

# Save rules
sudo iptables-save > /etc/iptables/rules.v4

# UFW (Uncomplicated Firewall - easier)
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny from 192.168.1.50
sudo ufw status

---

# SSH

# Connect
ssh user@server.com
ssh -i ~/.ssh/id_rsa user@server.com  # Private key
ssh -p 2222 user@server.com  # Custom port

# Copy file (SCP)
scp file.txt user@server:/home/user/
scp -r directory/ user@server:/home/user/  # Recursive

# Generate SSH key
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Copy public key to server
ssh-copy-id user@server.com

# SSH config (~/.ssh/config)
Host myserver
    HostName 192.168.1.100
    User admin
    Port 22
    IdentityFile ~/.ssh/id_rsa

# Connect: ssh myserver

---

# NETWORK MONITORING

# Active connections
netstat -tuln
# -t: TCP
# -u: UDP
# -l: Listening
# -n: Numeric

ss -tuln  # Newer, faster

# Bandwidth usage
iftop
nethogs  # Per-process

# Packet capture
sudo tcpdump -i eth0 port 80
sudo tcpdump -i eth0 -w capture.pcap  # Save to file

# Analyze with Wireshark (GUI)
wireshark capture.pcap
```

---

## Automation & Scripting

```bash
# BASH SCRIPTING

#!/bin/bash
# backup.sh - Automated backup script

# Variables
BACKUP_DIR="/backup"
SOURCE_DIR="/var/www"
DATE=$(date +%Y%m%d)
FILENAME="backup_$DATE.tar.gz"

# Create backup
echo "Starting backup..."
tar -czf "$BACKUP_DIR/$FILENAME" "$SOURCE_DIR"

# Check if successful
if [ $? -eq 0 ]; then
    echo "Backup successful: $FILENAME"
else
    echo "Backup failed!"
    exit 1
fi

# Delete old backups (older than 7 days)
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +7 -delete

echo "Backup complete!"

---

# CRON (Scheduled tasks)

# Edit crontab
crontab -e

# Syntax: minute hour day month weekday command
# * * * * * command

# Examples:
# Daily at 2 AM
0 2 * * * /home/user/backup.sh

# Every 15 minutes
*/15 * * * * /home/user/check_server.sh

# Every Monday at 3 AM
0 3 * * 1 /home/user/weekly_cleanup.sh

# Every day at midnight
@daily /home/user/daily_task.sh

# List cron jobs
crontab -l

---

# ANSIBLE (Configuration management)

# Install
sudo apt install ansible

# Inventory file (hosts)
[webservers]
web1.example.com
web2.example.com

[databases]
db1.example.com

# Playbook (playbook.yml)
---
- name: Configure web servers
  hosts: webservers
  become: yes
  
  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present
        update_cache: yes
    
    - name: Start Nginx
      service:
        name: nginx
        state: started
        enabled: yes
    
    - name: Copy config
      copy:
        src: nginx.conf
        dest: /etc/nginx/nginx.conf
      notify: Restart Nginx
  
  handlers:
    - name: Restart Nginx
      service:
        name: nginx
        state: restarted

# Run playbook
ansible-playbook -i hosts playbook.yml

# Ad-hoc command
ansible webservers -m ping
ansible webservers -a "uptime"
ansible webservers -m apt -a "name=htop state=present" --become
```

---

## Monitoring & Performance

```bash
# SYSTEM RESOURCES

# CPU usage
top
mpstat  # Multi-processor stats

# Memory usage
free -h
# -h: Human-readable

# Disk I/O
iostat
iotop  # Per-process

# Uptime & load average
uptime
# Output: 10:30:00 up 10 days, 2:15, 3 users, load average: 0.50, 0.75, 1.00
# Load average: 1 min, 5 min, 15 min
# Rule of thumb: <1 per CPU core = good

---

# PROMETHEUS (Metrics)

# Install Node Exporter (export system metrics)
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
tar xvfz node_exporter-*.tar.gz
cd node_exporter-*
./node_exporter &

# Prometheus config (prometheus.yml)
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']

# Run Prometheus
./prometheus --config.file=prometheus.yml

# Access: http://localhost:9090

---

# GRAFANA (Visualization)

# Install
sudo apt install -y grafana

# Start
sudo systemctl start grafana-server
sudo systemctl enable grafana-server

# Access: http://localhost:3000
# Default: admin/admin

# Add Prometheus data source
# Create dashboard (import: Node Exporter Full, ID 1860)

---

# ALERTING

# Prometheus Alertmanager
# alertmanager.yml
route:
  receiver: 'email'

receivers:
  - name: 'email'
    email_configs:
      - to: 'admin@example.com'
        from: 'alertmanager@example.com'
        smarthost: 'smtp.gmail.com:587'
        auth_username: 'alertmanager@example.com'
        auth_password: 'password'

# Alert rules (alert.rules)
groups:
  - name: example
    rules:
      - alert: HighCPU
        expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"
```

---

## High Availability & Load Balancing

```bash
# NGINX LOAD BALANCER

# /etc/nginx/nginx.conf
http {
    upstream backend {
        server 192.168.1.10:80;
        server 192.168.1.11:80;
        server 192.168.1.12:80;
    }
    
    server {
        listen 80;
        
        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}

# Health checks (NGINX Plus, or use third-party)
# Free alternative: HAProxy

---

# HAPROXY (Load balancer)

# /etc/haproxy/haproxy.cfg
frontend http_front
    bind *:80
    default_backend http_back

backend http_back
    balance roundrobin
    option httpchk GET /health
    server web1 192.168.1.10:80 check
    server web2 192.168.1.11:80 check
    server web3 192.168.1.12:80 check

# Restart
sudo systemctl restart haproxy

---

# KEEPALIVED (Virtual IP failover)

# /etc/keepalived/keepalived.conf
vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 101  # Higher = master
    
    virtual_ipaddress {
        192.168.1.100/24
    }
}

# On backup server: priority 100 (lower)
# If master fails, backup takes over VIP
```

---

## Security Hardening

```markdown
BEST PRACTICES:

1. UPDATE REGULARLY:
   - sudo apt update && sudo apt upgrade
   - Enable unattended-upgrades (security patches)

2. MINIMAL SERVICES:
   - Only run what's needed
   - sudo systemctl disable unused_service

3. SSH HARDENING:
   - Disable root login (PermitRootLogin no)
   - Use SSH keys (PasswordAuthentication no)
   - Change default port (Port 2222)
   - Fail2ban (block brute-force attacks)

4. FIREWALL:
   - Enable (ufw, iptables)
   - Default deny, explicit allow
   - Close unused ports

5. MONITORING:
   - Logs (centralized: ELK, Splunk)
   - Intrusion detection (OSSEC, Snort)
   - File integrity (AIDE, Tripwire)

6. BACKUPS:
   - Automate (cron)
   - Offsite (S3, rsync to remote)
   - Test restores!

7. PRINCIPLE OF LEAST PRIVILEGE:
   - Don't use root (sudo only when needed)
   - Limit user permissions
   - Service accounts (no login shell)
```

---

## Key Takeaways

1. **Automation** - Script repetitive tasks (Bash, Ansible, cron)
2. **Monitoring** - Can't fix what you don't measure (Prometheus, Grafana)
3. **Documentation** - Document systems, procedures (for yourself & team)
4. **Backups** - 3-2-1 rule (3 copies, 2 media types, 1 offsite)
5. **Security** - Defense in depth (firewall, updates, monitoring, backups)

---

## References

- "The Linux Command Line" - William Shotts
- "UNIX and Linux System Administration Handbook" - Evi Nemeth
- DigitalOcean Tutorials

**Related**: `linux-performance-tuning.md`, `docker-containers.md`, `ansible-playbooks.md`
