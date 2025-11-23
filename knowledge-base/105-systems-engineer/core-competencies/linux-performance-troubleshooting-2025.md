# Linux Performance & Troubleshooting 2025

**Updated**: 2025-11-23 | **Stack**: Linux 6.x, eBPF, Prometheus

---

## The Linux Performance Toolbox

```
CPU → top, htop, mpstat, perf
Memory → free, vmstat, slabtop
Disk I/O → iostat, iotop, fio
Network → iftop, nethogs, ss, tcpdump
System → dmesg, journalctl, strace
Modern → eBPF (bpftrace, bcc tools)
```

---

## CPU Troubleshooting

### Finding CPU Hogs

```bash
# Top 10 CPU consumers
ps aux --sort=-%cpu | head -10

# Real-time monitoring
top -o %CPU

# Per-core utilization
mpstat -P ALL 1

# Output:
# CPU    %usr   %sys  %iowait   %idle
# 0      45.2   12.1    2.3     40.4
# 1      89.5    5.2    0.1      5.2  ← Bottleneck!
# 2      23.4    3.1    1.2     72.3

# Identify specific process
pidstat -u 1

# CPU affinity (pin process to specific cores)
taskset -cp 0,1 12345  # Pin PID 12345 to cores 0-1
```

### CPU Profiling with perf

```bash
# Record CPU profile (30 seconds)
perf record -a -g sleep 30

# Analyze results
perf report

# Flamegraph (visualize call stacks)
perf script | ./FlameGraph/stackcollapse-perf.pl | ./FlameGraph/flamegraph.pl > cpu-flame.svg

# Find hottest functions
perf top

# Trace specific events
perf stat -e cycles,instructions,cache-misses ./my-program
```

---

## Memory Analysis

### Memory Leak Detection

```bash
# Memory usage overview
free -h
#               total        used        free      shared  buff/cache   available
# Mem:           15Gi       8.2Gi       1.1Gi       324Mi       6.2Gi       6.5Gi
# Swap:         8.0Gi       2.1Gi       5.9Gi

# Swap usage is concerning! ↑

# Process memory usage
ps aux --sort=-%mem | head -10

# Detailed memory map of process
pmap -x <PID>

# Track memory over time
while true; do
  ps -p <PID> -o %mem,rss,vsz --no-headers >> mem_track.log
  sleep 5
done

# Analyze with gnuplot
gnuplot -e "set terminal png; set output 'memory.png'; plot 'mem_track.log' using 2 with lines title 'RSS'"

# Check for OOM (Out of Memory) killer events
dmesg | grep -i 'killed process'
journalctl -k | grep -i 'oom'

# Analyze memory pressure
cat /proc/pressure/memory
# some avg10=0.00 avg60=0.00 avg300=0.00 total=0
# full avg10=0.00 avg60=0.00 avg300=0.00 total=0
```

### Using valgrind for Memory Leaks

```bash
# Detect memory leaks
valgrind --leak-check=full \
         --show-leak-kinds=all \
         --track-origins=yes \
         --log-file=valgrind.log \
         ./my-program

# Output analysis:
# LEAK SUMMARY:
#    definitely lost: 4,096 bytes in 1 blocks
#    indirectly lost: 0 bytes in 0 blocks
#      possibly lost: 8,192 bytes in 2 blocks
#    still reachable: 1,024 bytes in 1 blocks

# Heap profiling
valgrind --tool=massif ./my-program
ms_print massif.out.12345
```

---

## Disk I/O Performance

### Finding I/O Bottlenecks

```bash
# I/O statistics
iostat -x 1
# Device   r/s   w/s  rkB/s  wkB/s  await  %util
# sda     45.2  123.1  1820   4924   12.3   85.2  ← High utilization!

# Which processes are causing I/O?
iotop -o  # Only show active I/O

# Disk latency
ioping /dev/sda
# 4 KiB from /dev/sda: request=1 time=2.1 ms  ← Good (<10ms)
# 4 KiB from /dev/sda: request=2 time=45.3 ms ← Bad! (>40ms)

# Check for disk errors
smartctl -a /dev/sda

# File system usage
df -h
du -sh /* | sort -rh | head -10

# Find large files
find / -type f -size +1G -exec ls -lh {} \; 2>/dev/null

# Analyze disk usage by directory
ncdu /
```

### Disk Benchmark

```bash
# Sequential read/write (fio)
fio --name=seqread --rw=read --bs=1M --size=1G --numjobs=1

# Random read/write (IOPS test)
fio --name=randread --rw=randread --bs=4k --size=1G --numjobs=4 --runtime=60

# Output:
# read: IOPS=15.2k, BW=59.4MiB/s
# This is SSD or NVMe? Check specs.
```

---

## Network Troubleshooting

### Connection Issues

```bash
# Show all connections
ss -tunap
# Netid  State   Recv-Q  Send-Q  Local Address:Port   Peer Address:Port
# tcp    ESTAB   0       0       10.0.1.5:443        203.0.113.1:54321

# Large Recv-Q/Send-Q indicates backlog!

# Network interface statistics
ip -s link

# Packet drops
ethtool -S eth0 | grep -i drop
# rx_dropped: 12345  ← Packets dropped!

# DNS resolution issues
dig google.com
nslookup google.com

# Trace route to destination
traceroute 8.8.8.8
mtr 8.8.8.8  # Continuous traceroute

# TCP connection states
netstat -ant | awk '{print $6}' | sort | uniq -c | sort -rn
#     150 ESTABLISHED
#      45 TIME_WAIT
#       8 SYN_SENT  ← Connection issues?
```

### Bandwidth Monitoring

```bash
# Real-time bandwidth by interface
iftop -i eth0

# Bandwidth by process
nethogs eth0

# Total bandwidth usage
vnstat -i eth0

# Network throughput test (iperf3)
# Server side:
iperf3 -s

# Client side:
iperf3 -c server-ip -t 30
# [  5]   0.00-30.00  sec  3.28 GBytes   940 Mbits/sec  sender

# Packet capture
tcpdump -i eth0 -w capture.pcap 'port 80'
wireshark capture.pcap  # Analyze with GUI
```

---

## eBPF Tools (Modern Observability)

### System-wide Profiling

```bash
# Install bcc-tools
apt install bpfcc-tools  # Ubuntu/Debian
yum install bcc-tools    # RHEL/CentOS

# CPU profiling (60 seconds)
/usr/share/bcc/tools/profile -F 99 30 > profile.txt

# Which files are being opened?
/usr/share/bcc/tools/opensnoop

# Track slow filesystem operations (>10ms)
/usr/share/bcc/tools/ext4slower 10

# TCP connection latency
/usr/share/bcc/tools/tcpconnlat

# Disk I/O latency distribution
/usr/share/bcc/tools/biolatency -D

# Memory page faults
/usr/share/bcc/tools/vmscan

# One-liner with bpftrace
bpftrace -e 'tracepoint:syscalls:sys_enter_open { @[comm] = count(); }'
```

---

## Log Analysis

### journalctl Mastery

```bash
# Recent errors
journalctl -p err -b

# Specific service
journalctl -u nginx.service --since "1 hour ago"

# Follow logs (like tail -f)
journalctl -f

# Boot logs
journalctl --list-boots
journalctl -b -1  # Previous boot

# Kernel messages
journalctl -k

# Filter by time range
journalctl --since "2025-01-15 10:00:00" --until "2025-01-15 11:00:00"

# JSON output (for parsing)
journalctl -o json | jq '.MESSAGE'

# Disk usage by logs
journalctl --disk-usage
# Archived and active journals take up 2.5G in the file system.

# Clean old logs
journalctl --vacuum-time=7d  # Keep last 7 days
journalctl --vacuum-size=1G  # Keep max 1GB
```

### Application Log Analysis

```bash
# Find errors in log file
grep -i error /var/log/app.log

# Count error types
grep -i error /var/log/app.log | sort | uniq -c | sort -rn

# Extract timestamps and count
awk '{print $1, $2}' /var/log/app.log | uniq -c | tail -20

# Monitor log in real-time with filtering
tail -f /var/log/app.log | grep --line-buffered "ERROR\|FATAL"

# Log aggregation with lnav
lnav /var/log/app*.log
```

---

## Process Management

### Debugging Hung Processes

```bash
# Check process state
ps aux | grep <process-name>
# USER  PID  %CPU %MEM    VSZ   RSS TTY STAT START TIME COMMAND
# root  1234  0.0  0.5  12345  6789 ?   D    10:00 0:00 app
#                                      ↑
#                                      D = Uninterruptible sleep (I/O wait)

# System call trace (what is it waiting for?)
strace -p <PID>

# Library calls
ltrace -p <PID>

# Get process stack trace
pstack <PID>

# Generate core dump for analysis
gcore <PID>
gdb /path/to/binary core.<PID>
```

### Resource Limits

```bash
# Check current limits
ulimit -a

# Increase file descriptor limit (temporary)
ulimit -n 65535

# Permanent limit (edit /etc/security/limits.conf)
* soft nofile 65535
* hard nofile 65535

# Check process-specific limits
cat /proc/<PID>/limits

# Set nice value (priority)
nice -n 10 ./my-program  # Lower priority
renice -n -5 -p <PID>    # Higher priority (requires root)
```

---

## System Tuning

### sysctl Parameters

```bash
# View all kernel parameters
sysctl -a

# Network performance tuning
sysctl -w net.core.rmem_max=134217728  # 128MB receive buffer
sysctl -w net.core.wmem_max=134217728  # 128MB send buffer
sysctl -w net.ipv4.tcp_rmem="4096 87380 134217728"
sysctl -w net.ipv4.tcp_wmem="4096 65536 134217728"

# Make permanent (/etc/sysctl.conf)
echo "net.core.rmem_max=134217728" >> /etc/sysctl.conf
sysctl -p  # Reload

# File system tuning
sysctl -w vm.swappiness=10  # Reduce swap usage (default: 60)
sysctl -w vm.vfs_cache_pressure=50  # Keep directory/inode cache

# Connection tracking
sysctl -w net.netfilter.nf_conntrack_max=1048576
```

---

## Monitoring Stack

### Prometheus + Node Exporter

```yaml
# docker-compose.yml
version: '3'
services:
  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana

volumes:
  prometheus-data:
  grafana-data:
```

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']
```

---

## Emergency Procedures

### Server Under Attack

```bash
# 1. Check active connections
ss -tunap | wc -l
# 50,000 connections! DDoS?

# 2. Top connection sources
netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -10

# 3. Block malicious IPs
iptables -A INPUT -s 203.0.113.42 -j DROP

# 4. Limit connection rate (iptables)
iptables -A INPUT -p tcp --dport 80 -m state --state NEW -m recent --set
iptables -A INPUT -p tcp --dport 80 -m state --state NEW -m recent --update --seconds 60 --hitcount 20 -j DROP

# 5. Enable SYN cookies (DDoS protection)
sysctl -w net.ipv4.tcp_syncookies=1

# 6. Check for rootkits
rkhunter --check
chkrootkit
```

### Out of Disk Space

```bash
# 1. Find what's eating space
du -sh /* | sort -rh | head -10

# 2. Find and delete large log files
find /var/log -type f -size +100M -exec ls -lh {} \;

# 3. Clean package cache
apt clean  # Debian/Ubuntu
yum clean all  # RHEL/CentOS

# 4. Remove old kernels
dpkg -l | grep linux-image
apt remove linux-image-5.4.0-old

# 5. Clear journal logs
journalctl --vacuum-size=100M

# 6. Find and remove unused Docker images
docker system prune -a --volumes
```

---

## Key Takeaways

1. **Start with system-wide metrics** - CPU, memory, disk, network
2. **Use eBPF for deep insights** - Modern, safe kernel tracing
3. **logs are your friend** - journalctl, grep, awk
4. **Baseline normal behavior** - Know what "good" looks like
5. **Document everything** - Runbooks for common issues

---

## References

- "Linux Performance Tools" - Brendan Gregg
- "BPF Performance Tools" - Brendan Gregg
- man pages (man perf, man iostat, etc.)
- Brendan Gregg's Blog

**Related**: `kubernetes-troubleshooting.md`, `nginx-performance.md`, `security-hardening.md`
