## I. Network Programming Basics

### 1. What Is Network Programming?

Network programming enables **programs on different computers** to exchange data over a network.

    ┌─────────────┐                          ┌─────────────┐
    │  Computer A │  ←──── Network ────→     │  Computer B │
    │   (client)  │       Data transfer      │   (server)  │
    └─────────────┘                          └─────────────┘

### 2. Software Architectures

| Architecture | Description | Advantages | Disadvantages | Examples |
| ------- | ----------------------- | -------- | ------- | -------- |
| **C/S** | Client/Server | Good experience, security | Client installation required | QQ, WeChat, games |
| **B/S** | Browser/Server | No installation, cross-platform | Relatively poorer experience | Web applications |

### 3. Network Models

#### OSI Seven-Layer vs TCP/IP Four-Layer Model

    OSI seven-layer model     TCP/IP four-layer model   Protocols
    ┌─────────────┐          ┌─────────────┐
    │ Application │          │             │
    ├─────────────┤          │ Application │         HTTP, FTP, DNS, SMTP
    │Presentation │          │             │
    ├─────────────┤          └─────────────┘
    │   Session   │
    ├─────────────┤          ┌─────────────┐
    │  Transport  │          │  Transport  │         TCP, UDP
    ├─────────────┤          └─────────────┘
    │   Network   │          ┌─────────────┐
    ├─────────────┤          │   Network   │         IP, ICMP
    │  Data link  │          └─────────────┘
    ├─────────────┤          ┌─────────────┐
    │  Physical   │          │Network access│        Ethernet, Wi-Fi
    └─────────────┘          └─────────────┘

***

## II. Three Essentials of Network Programming

### 1. IP Address

**Purpose**: identifies a device (computer) on a network.

| Type | Description | Example |
| -------- | ------------------- | -------------------------------- |
| **IPv4** | 4 bytes, 32 bits, dotted decimal | `192.168.1.100` |
| **IPv6** | 16 bytes, 128 bits, colon-separated hexadecimal | `2001:0db8:85a3::8a2e:0370:7334` |

#### Special IP Addresses

| IP address | Description |
| ------------------------- | ----------------- |
| `127.0.0.1` | Local loopback address (localhost) |
| `192.168.x.x` | LAN address (Class C private range) |
| `10.x.x.x` | LAN address (Class A private range) |
| `172.16.x.x ~ 172.31.x.x` | LAN address (Class B private range) |
| `255.255.255.255` | Broadcast address |
| `0.0.0.0` | Any local address (used for server binding) |

#### Java's InetAddress Class

```java
import java.net.InetAddress;

public class Demo {
    public static void main(String[] args) throws Exception {
        // Get the local IP
        InetAddress localHost = InetAddress.getLocalHost();
        System.out.println("Hostname: " + localHost.getHostName());
        System.out.println("IP address: " + localHost.getHostAddress());

        // Get the loopback address (127.0.0.1)
        InetAddress loopback = InetAddress.getLoopbackAddress();
        System.out.println("Loopback address: " + loopback.getHostAddress());

        // Resolve a domain name (returns the first IP)
        InetAddress baidu = InetAddress.getByName("www.baidu.com");
        System.out.println("Baidu IP: " + baidu.getHostAddress());

        // Get all IPs for a domain (load-balancing scenarios)
        InetAddress[] allIPs = InetAddress.getAllByName("www.baidu.com");
        for (InetAddress ip : allIPs) {
            System.out.println("IP：" + ip.getHostAddress());
        }

        // Test reachability (ping), with a 3000 ms timeout
        System.out.println("Reachable: " + baidu.isReachable(3000));
    }
}
```

#### Common InetAddress Methods

| Method | Description |
| --------------------------- | ---------------------- |
| `getLocalHost()` | Gets the local IP address |
| `getLoopbackAddress()` | Gets the loopback address (127.0.0.1) |
| `getByName(String host)` | Gets an InetAddress from a hostname/IP |
| `getAllByName(String host)` | Gets all IPs for a domain (for load balancing) |
| `getHostName()` | Gets the hostname |
| `getHostAddress()` | Gets the IP address string |
| `isReachable(int timeout)` | Tests reachability |

***

### 2. Port Number

**Purpose**: identifies an application on a device.

| Description | Range |
| ---------- | -------------- |
| Port numbers are integers | 0 \~ 65535 |
| System (well-known) ports | 0 \~ 1023 |
| Registered ports | 1024 \~ 49151 |
| Dynamic/private ports | 49152 \~ 65535 |

#### Common Ports

| Port | Application |
| ---- | ---------- |
| 21   | FTP        |
| 22   | SSH        |
| 23   | Telnet     |
| 25 | SMTP (sending email) |
| 80   | HTTP       |
| 443  | HTTPS      |
| 3306 | MySQL      |
| 6379 | Redis      |
| 8080 | Tomcat     |

**Note**: Port conflicts depend on the transport protocol, bound IP address and socket-reuse rules, not just the port number. One device can use TCP 8080 and UDP 8080 simultaneously. The same protocol can also bind the same port on different specific local IP addresses (wildcard bindings require separate consideration).

***

### 3. Protocol

**Purpose**: defines data-transmission rules.

| Protocol | Characteristics | Analogy |
| ------- | ------------- | ------------- |
| **UDP** | Connectionless, unreliable, fast | Sending a text message without confirming receipt |
| **TCP** | Connection-oriented, reliable, relatively slower | A phone call: establish a connection first |

***

### Summary of the Three Essentials

    Network communication = IP address (which computer) + port (which program) + protocol (how data is sent)

    Analogy:
    - IP address = residential complex address
    - Port number = apartment number
    - Protocol = courier service (express/standard delivery)

***

## III. Network-Related CMD Commands

### 1. Common Network Commands

| Command | Purpose | Example |
| --------------- | ------------ | ------------------------ |
| `ipconfig` | Displays local IP configuration | `ipconfig` |
| `ipconfig /all` | Displays detailed IP configuration | `ipconfig /all` |
| `ping` | Tests network connectivity | `ping www.baidu.com` |
| `netstat` | Displays network connection status | `netstat -an` |
| `tracert` | Traces packet routes | `tracert www.baidu.com` |
| `nslookup` | Resolves a domain to IP addresses | `nslookup www.baidu.com` |
| `arp` | Displays/manages the ARP cache | `arp -a` |
| `telnet` | Tests whether a port is open | `telnet 127.0.0.1 8080` |

***

### 2. Commands in Detail

#### ipconfig: Display IP Configuration

```bash
# Display brief IP configuration
ipconfig

# Display detailed IP configuration (including MAC address, DNS, etc.)
ipconfig /all

# Release the IP address (DHCP)
ipconfig /release

# Renew the IP address (DHCP)
ipconfig /renew

# Flush the DNS cache
ipconfig /flushdns
```

**Sample Output**:

    Ethernet adapter Local Area Connection:
       IPv4 Address. . . . . . . . . : 192.168.1.100
       Subnet Mask . . . . . . . . . : 255.255.255.0
       Default Gateway . . . . . . . : 192.168.1.1

***

#### ping: Test Network Connectivity

```bash
# Test connectivity to Baidu
ping www.baidu.com

# Specify the ping count (4)
ping -n 4 www.baidu.com

# Ping continuously (Ctrl+C to stop)
ping -t www.baidu.com

# Specify packet size in bytes
ping -l 1000 www.baidu.com

# Ping the local machine (test the network interface)
ping 127.0.0.1
```

**Sample Output**:

    Pinging www.baidu.com [110.242.68.66] with 32 bytes of data:
    Reply from 110.242.68.66: bytes=32 time=15ms TTL=52
    Reply from 110.242.68.66: bytes=32 time=14ms TTL=52

**Common Diagnostics**:

| Symptom | Possible cause |
| ------- | ------------- |
| Request timed out | Destination unreachable or blocked by a firewall |
| TTL expired | Too many routing hops |
| Destination host unreachable | Routing problem or nonexistent destination |

***

#### netstat: Display Network Connection Status

```bash
# Display all connections and listening ports
netstat -an

# Display all connections and associated processes
netstat -ano

# Check use of a specific port
netstat -ano | findstr "8080"

# Display network connections for a specific process
netstat -ano | findstr "<PID>"

# Display only TCP connections
netstat -an -p tcp

# Display only UDP connections
netstat -an -p udp
```

**Sample Output**:

    Proto   Local Address     Foreign Address         State          PID
    TCP    0.0.0.0:80         0.0.0.0:0            LISTENING      4
    TCP    127.0.0.1:8080     127.0.0.1:52341      ESTABLISHED    12345
    TCP    192.168.1.100:443  110.242.68.66:443    ESTABLISHED    5678

**Connection States**:

| State | Description |
| ----------- | -------- |
| LISTENING | Listening for connections |
| ESTABLISHED | Connection established |
| TIME\_WAIT | Waiting for closure |
| CLOSE\_WAIT | Waiting for closure |
| SYN\_SENT | Connection request sent |

***

#### tracert: Trace a Route

```bash
# Trace the route to Baidu
tracert www.baidu.com

# Skip hostname resolution (faster)
tracert -d www.baidu.com

# Specify the maximum number of hops
tracert -h 20 www.baidu.com
```

**Sample Output**:

    Tracing route to www.baidu.com [110.242.68.66] over a maximum of 30 hops

      1    <1 ms    <1 ms    <1 ms  192.168.1.1
      2     5 ms     4 ms     5 ms  10.0.0.1
      3    10 ms    10 ms    10 ms  202.97.12.1
      ...
     10    15 ms    14 ms    15 ms  110.242.68.66

***

#### nslookup: Resolve Domain IP Addresses

```bash
# Resolve a domain's IP address
nslookup www.baidu.com

# Query a specified DNS server
nslookup www.baidu.com 8.8.8.8

# Enter interactive mode
nslookup
> www.baidu.com
> exit
```

**Sample Output**:

    Server:  dns.google
    Address:  8.8.8.8

    Non-authoritative answer:
    Name:    www.baidu.com
    Address:  110.242.68.66

***

#### telnet: Test a Port

```bash
# Test whether a port is open
telnet 127.0.0.1 8080

# Test a remote server's port
telnet www.baidu.com 80
```

**Note**: Telnet is disabled by default in Windows 10; enable it manually:

    Control Panel → Programs → Turn Windows features on or off → select Telnet Client

***

### 3. Useful Command Combinations

```bash
# Identify the process using port 8080
netstat -ano | findstr "8080"
# Look up the process by PID
tasklist | findstr "<PID>"

# Kill the process using the port
taskkill /PID <PID> /F

# Display all open local ports
netstat -an | findstr "LISTENING"

# Test DNS resolution
nslookup www.baidu.com

# Clear the DNS cache, then resolve again
ipconfig /flushdns
nslookup www.baidu.com
```

***

### 4. Mac/Linux Equivalents

| Function | Windows | Mac/Linux |
| ----- | -------------- | ------------------------- |
| Display IP | `ipconfig` | `ifconfig` or `ip addr` |
| Test connectivity | `ping` | `ping` |
| Display ports | `netstat -ano` | `netstat -an` or `lsof -i` |
| Trace route | `tracert` | `traceroute` |
| Resolve domain | `nslookup` | `nslookup` or `dig` |

***

## IV. Sending and Receiving Data with UDP

### 1. UDP Characteristics

| Characteristic | Description |
| -------- | ------------ |
| **Connectionless** | No connection setup before sending |
| **Unreliable** | Delivery is not guaranteed |
| **Fast** | No connection-establishment overhead |
| **Size limit** | Maximum 64 KB per datagram |

**Use Cases**: video calls, live streaming, games (packet loss tolerated).

***

### 2. UDP Classes

| Class | Description |
| ---------------- | ---------------- |
| `DatagramSocket` | Datagram socket for sending and receiving data |
| `DatagramPacket` | Encapsulates data to send/receive |

***

### 3. Sending UDP Data

```java
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class UDPSender {
    public static void main(String[] args) {
        // Use try-with-resources to close resources automatically
        try (DatagramSocket socket = new DatagramSocket()) {
            // 1. Prepare data
            String message = "Hello, UDP!";
            byte[] data = message.getBytes();

            // 2. Create a DatagramPacket
            //    Arguments: data, length, destination IP, destination port
            DatagramPacket packet = new DatagramPacket(
                data,
                data.length,
                InetAddress.getByName("127.0.0.1"),
                10086
            );

            // 3. Send data
            socket.send(packet);
            System.out.println("Data sent");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

***

### 4. Receiving UDP Data

```java
import java.net.DatagramPacket;
import java.net.DatagramSocket;

public class UDPReceiver {
    public static void main(String[] args) {
        // Use try-with-resources to close resources automatically
        try (DatagramSocket socket = new DatagramSocket(10086)) {
            System.out.println("Receiver started; waiting for data...");

            // 1. Create a packet to receive data
            byte[] buffer = new byte[1024];
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length);

            // 2. Receive data (blocks until data arrives)
            socket.receive(packet);

            // 3. Parse data
            String message = new String(
                packet.getData(),      // Data
                0,                     // Start offset
                packet.getLength()     // Actual length
            );
            String senderIP = packet.getAddress().getHostAddress();
            int senderPort = packet.getPort();

            System.out.println("Received from " + senderIP + ":" + senderPort + ": " + message);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

***

### 5. UDP Communication Flow

    Sender                                     Receiver
    ┌─────────────────┐                      ┌─────────────────┐
    │ DatagramSocket  │                      │ DatagramSocket  │
    │ (any port)     │                      │  (bound port)    │
    └────────┬────────┘                      └────────┬────────┘
             │                                        │
             │  1. Create packet                     │  1. Create empty packet
             ↓                                        ↓
    ┌─────────────────┐                      ┌─────────────────┐
    │ DatagramPacket  │                      │ DatagramPacket  │
    │ (data + destination) │── UDP transfer ───────→│ (received data) │
    └─────────────────┘                      └─────────────────┘
             │                                        │
             │  2. send(packet)                       │  2. receive(packet)
             ↓                                        ↓
          Sending complete                         Parse data

***

### 6. UDP Broadcast and Multicast

#### Broadcast

Send data to all devices on the same network segment.

```java
// Send a broadcast
try (DatagramSocket socket = new DatagramSocket()) {
    socket.setBroadcast(true);  // Enable broadcasting

    String message = "This is a broadcast message";
    byte[] data = message.getBytes();

    // Broadcast address: 255.255.255.255 or a subnet broadcast address such as 192.168.1.255
    DatagramPacket packet = new DatagramPacket(
        data, data.length,
        InetAddress.getByName("255.255.255.255"),
        10086
    );

    socket.send(packet);
}
```

#### Multicast

Send data to devices in a specific group (multicast range: 224.0.0.0 \~ 239.255.255.255).

```java
import java.net.InetAddress;
import java.net.MulticastSocket;

// Multicast sending
try (MulticastSocket socket = new MulticastSocket()) {
    String message = "This is a multicast message";
    byte[] data = message.getBytes();

    DatagramPacket packet = new DatagramPacket(
        data, data.length,
        InetAddress.getByName("224.0.0.1"),  // Multicast address
        10086
    );

    socket.send(packet);
}

// Multicast receiving
try (MulticastSocket socket = new MulticastSocket(10086)) {
    // Join the multicast group
    InetAddress group = InetAddress.getByName("224.0.0.1");
    socket.joinGroup(group);

    byte[] buffer = new byte[1024];
    DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
    socket.receive(packet);

    // Leave the multicast group
    socket.leaveGroup(group);
}
```

| Type | Description | Address range |
| -- | ------- | ---------------------------- |
| Unicast | One-to-one communication | Ordinary IP address |
| Broadcast | One-to-all | 255.255.255.255 |
| Multicast | One-to-many within a group | 224.0.0.0 \~ 239.255.255.255 |

***

## V. Sending and Receiving Data with TCP

### 1. TCP Characteristics

| Characteristic | Description |
| -------- | ---------------- |
| **Connection-oriented** | Establish a connection before transferring data |
| **Reliable delivery** | Ensures data is not lost or duplicated and arrives in order |
| **Three-way handshake** | Three exchanges establish a connection |
| **Four-way termination** | Four exchanges close a connection |

**Use Cases**: file transfers, web browsing, email (packet loss not tolerated).

***

### 2. Three-Way Handshake

    Client                                    Server
       │                                        │
       │ ─────── 1. SYN (request connection) ───→ │
       │                                        │
       │ ←────── 2. SYN+ACK (accept connection) ─ │
       │                                        │
       │ ─────── 3. ACK (acknowledge) ─────────→ │
       │                                        │
       │           Connection established         │

**Memory Aid**:

1.  Client: I want to connect (SYN).
2.  Server: Okay, I agree (SYN+ACK).
3.  Client: Then let's begin (ACK).

***

### 3. Four-Way Termination

    Client                                    Server
       │                                        │
       │ ─────── 1. FIN (I want to close) ─────→ │
       │                                        │
       │ ←────── 2. ACK (received) ───────────── │
       │                                        │
       │ ←────── 3. FIN (I want to close too) ── │
       │                                        │
       │ ─────── 4. ACK (received) ────────────→ │
       │                                        │
       │           Connection closed              │

**Memory Aid**:

1.  Client: I am closing.
2.  Server: Okay, received.
3.  Server: I am ready to close too.
4.  Client: Okay, goodbye.

> 💡 **Why Four Exchanges Instead of Three?**
> TCP is full-duplex: both endpoints can send data. When the client says it has finished sending, the server may still have data to send, so the two directions are closed separately.

***

### 4. TCP Classes

| Class | Description |
| -------------- | --------------------- |
| `Socket` | Client socket for connecting to a server and exchanging data |
| `ServerSocket` | Server socket for listening on a port and accepting client connections |

***

### 5. TCP Client

```java
import java.io.*;
import java.net.Socket;

public class TCPClient {
    public static void main(String[] args) {
        // Use try-with-resources to close resources automatically
        try (Socket socket = new Socket("127.0.0.1", 10086)) {
            System.out.println("Connected to server!");

            // Get the output stream and send data
            OutputStream os = socket.getOutputStream();
            os.write("Hello, server!".getBytes());

            // Get the input stream and receive the server response
            InputStream is = socket.getInputStream();
            byte[] buffer = new byte[1024];
            int len = is.read(buffer);
            String response = new String(buffer, 0, len);
            System.out.println("Server response received: " + response);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 6. TCP Server

```java
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

public class TCPServer {
    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(10086)) {
            System.out.println("Server started; waiting for connections...");

            // Wait for a client connection (blocking)
            try (Socket socket = serverSocket.accept()) {
                String clientIP = socket.getInetAddress().getHostAddress();
                System.out.println("Client " + clientIP + " connected");

                // Get the input stream and receive client data
                InputStream is = socket.getInputStream();
                byte[] buffer = new byte[1024];
                int len = is.read(buffer);
                String message = new String(buffer, 0, len);
                System.out.println("Client message received: " + message);

                // Get the output stream and respond to the client
                OutputStream os = socket.getOutputStream();
                os.write("Message received!".getBytes());
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 7. Text Communication with Character Streams (Recommended)

`BufferedReader` and `PrintWriter` make text communication more convenient.

#### Client

```java
import java.io.*;
import java.net.Socket;

public class TCPClientText {
    public static void main(String[] args) {
        try (Socket socket = new Socket("127.0.0.1", 10086);
             BufferedReader reader = new BufferedReader(
                 new InputStreamReader(socket.getInputStream()));
             PrintWriter writer = new PrintWriter(
                 socket.getOutputStream(), true)) {  // true enables automatic flushing

            // Send a message
            writer.println("Hello, server!");

            // Receive a response
            String response = reader.readLine();
            System.out.println("Server response: " + response);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### Server

```java
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

public class TCPServerText {
    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(10086)) {
            System.out.println("Server started...");

            try (Socket socket = serverSocket.accept();
                 BufferedReader reader = new BufferedReader(
                     new InputStreamReader(socket.getInputStream()));
                 PrintWriter writer = new PrintWriter(
                     socket.getOutputStream(), true)) {

                // Receive a message
                String message = reader.readLine();
                System.out.println("Received: " + message);

                // Send a response
                writer.println("Message received!");
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 8. TCP Communication Flow

    Client (Socket)                           Server (ServerSocket)
          │                                         │
          │                                         │ 1. Create ServerSocket
          │                                         │    Bind port
          │                                         ↓
          │                                   ┌───────────┐
          │                                   │  accept() │ Wait for connection
          │                                   └─────┬─────┘
          │                                         │
          │ 2. Create Socket                         │
          │    Specify server IP and port            │
          ↓                                         │
    ┌───────────┐                                   │
    │ Connection request │ ── three-way handshake ─→ │
    └───────────┘                                   ↓
          │                                   ┌───────────┐
          │                                   │ Return Socket │
          │                                   └─────┬─────┘
          │                                         │
          │ ←──────── Connection established ───────→ │
          │                                         │
          │ 3. Get output stream                     │ 3. Get input stream
          │    Send data                             │    Receive data
          ↓                                         ↓
       os.write() ─────── Data transfer ─────────→ is.read()
          │                                         │
          │ 4. Get input stream                      │ 4. Get output stream
          │    Receive response                      │    Send response
          ↓                                         ↓
       is.read() ←─────── Data transfer ────────── os.write()
          │                                         │
          │ 5. Close connection                      │ 5. Close connection
          ↓                                         ↓
       socket.close()                          socket.close()

***

### 9. Common Socket Settings

| Method | Description |
| --------------------------- | ---------------------------------------- |
| `setSoTimeout(int ms)` | Sets read timeout in milliseconds; timeout throws SocketTimeoutException |
| `setKeepAlive(boolean)` | Enables keepalive probes to check idle connections |
| `setTcpNoDelay(boolean)` | Disables Nagle's algorithm to reduce latency (small real-time messages) |
| `setSendBufferSize(int)` | Sets send buffer size |
| `setReceiveBufferSize(int)` | Sets receive buffer size |
| `shutdownOutput()` | Half-closes output; receiving remains possible |
| `shutdownInput()` | Half-closes input; sending remains possible |

```java
Socket socket = new Socket("127.0.0.1", 10086);

// Set read timeout (5 seconds without data)
socket.setSoTimeout(5000);

// Enable keepalive
socket.setKeepAlive(true);

// Disable Nagle's algorithm (for real-time communication)
socket.setTcpNoDelay(true);
```

***

### 10. Half-Close

After sending all data, a client needs to tell the server it has finished while still being able to receive the response.

```java
// Client
try (Socket socket = new Socket("127.0.0.1", 10086)) {
    OutputStream os = socket.getOutputStream();
    InputStream is = socket.getInputStream();

    // Send data
    os.write("Large amount of data...".getBytes());

    // Half-close: tell the server sending is complete
    socket.shutdownOutput();

    // Can still receive the server response
    byte[] buffer = new byte[1024];
    int len = is.read(buffer);
    System.out.println("Response: " + new String(buffer, 0, len));
}
```

```java
// Server
try (Socket socket = serverSocket.accept()) {
    InputStream is = socket.getInputStream();
    OutputStream os = socket.getOutputStream();

    // Read until the client closes its output
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    byte[] buffer = new byte[1024];
    int len;
    while ((len = is.read(buffer)) != -1) {
        baos.write(buffer, 0, len);
    }
    System.out.println("Received: " + baos.toString());

    // Send response
    os.write("Processing complete!".getBytes());
}
```

***

### 11. Handling Multiple TCP Clients

```java
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class TCPServerMulti {
    public static void main(String[] args) {
        // Use a thread pool to handle client connections
        ExecutorService threadPool = Executors.newFixedThreadPool(10);

        try (ServerSocket serverSocket = new ServerSocket(10086)) {
            System.out.println("Server started; waiting for connections...");

            // Accept multiple clients in a loop
            while (true) {
                Socket socket = serverSocket.accept();
                System.out.println("Client " + socket.getInetAddress().getHostAddress() + " connected");

                // Submit handling to the pool
                threadPool.submit(() -> handleClient(socket));
            }

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            threadPool.shutdown();
        }
    }

    private static void handleClient(Socket socket) {
        try (socket;
             BufferedReader reader = new BufferedReader(
                 new InputStreamReader(socket.getInputStream()));
             PrintWriter writer = new PrintWriter(
                 socket.getOutputStream(), true)) {

            String message;
            while ((message = reader.readLine()) != null) {
                System.out.println("Message received: " + message);
                writer.println("Server received: " + message);
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

## VI. UDP vs TCP

| Comparison | UDP | TCP |
| ---------- | -------------- | ------------------- |
| **Connection** | Connectionless | Connection-oriented (three-way handshake) |
| **Reliability** | Unreliable | Reliable |
| **Speed** | Fast | Relatively slower |
| **Data size** | Limited (64 KB) | Unlimited |
| **Transfer model** | Datagrams | Byte stream |
| **Resource consumption** | Lower | Higher |
| **Use cases** | Live streaming, video, games | File transfers, web, email |
| **Java classes** | DatagramSocket | Socket, ServerSocket |

***

## VII. Summary Mind Map

    Network programming
        │
        ├── Basic concepts
        │     ├── C/S architecture (client/server)
        │     ├── B/S architecture (browser/server)
        │     └── Network models (OSI seven layers, TCP/IP four layers)
        │
        ├── Three essentials
        │     ├── IP address: identifies a device (InetAddress)
        │     │     └── getLocalHost()、getByName()、getAllByName()
        │     ├── Port: identifies a program (0–65535)
        │     └── Protocol: transmission rules (UDP/TCP)
        │
        ├── CMD commands
        │     ├── ipconfig: display IP configuration
        │     ├── ping: test connectivity
        │     ├── netstat -ano: inspect port usage
        │     ├── tracert: trace routes
        │     └── nslookup: resolve domain IP addresses
        │
        ├── UDP communication
        │     ├── Characteristics: connectionless, unreliable, fast
        │     ├── Classes: DatagramSocket, DatagramPacket
        │     ├── Send: create Socket → create Packet → send()
        │     ├── Receive: create Socket(port) → create Packet → receive()
        │     └── Extensions: broadcast (255.255.255.255), multicast (224.x.x.x)
        │
        └── TCP communication
              ├── Characteristics: connection-oriented, reliable, three-way handshake, four-way termination
              ├── Classes: Socket (client), ServerSocket (server)
              ├── Client: create Socket → getOutputStream → getInputStream
              ├── Server: create ServerSocket → accept() → obtain streams → process
              ├── Character streams: BufferedReader + PrintWriter (recommended)
              ├── Half-close: shutdownOutput() (signals sending is complete)
              └── Settings: setSoTimeout(), setKeepAlive(), setTcpNoDelay()
