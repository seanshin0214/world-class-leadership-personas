# Robotics Systems & Design 2025

**Updated**: 2025-11-24 | **Focus**: Kinematics, Control Systems, ROS, Sensors, Motion Planning

---

## Robot Kinematics

```python
# FORWARD KINEMATICS (Given joint angles, find end-effector position)

import numpy as np

# 2-DOF planar robot arm (two revolute joints)
def forward_kinematics_2dof(theta1, theta2, L1, L2):
    """
    theta1: First joint angle (radians)
    theta2: Second joint angle (radians)
    L1: First link length
    L2: Second link length
    
    Returns: (x, y) end-effector position
    """
    x = L1 * np.cos(theta1) + L2 * np.cos(theta1 + theta2)
    y = L1 * np.sin(theta1) + L2 * np.sin(theta1 + theta2)
    
    return x, y

# Example:
L1, L2 = 1.0, 0.8  # Link lengths (meters)
theta1, theta2 = np.deg2rad(30), np.deg2rad(45)  # Joint angles

x, y = forward_kinematics_2dof(theta1, theta2, L1, L2)
print(f"End-effector position: ({x:.3f}, {y:.3f})")  # (1.431, 1.207)

---

# INVERSE KINEMATICS (Given desired position, find joint angles)

def inverse_kinematics_2dof(x, y, L1, L2):
    """
    Analytical solution for 2-DOF planar arm (elbow-up configuration)
    Multiple solutions possible (elbow-up, elbow-down)
    """
    # Distance from origin to target
    D = np.sqrt(x**2 + y**2)
    
    # Check reachability
    if D > (L1 + L2) or D < abs(L1 - L2):
        raise ValueError("Target out of reach")
    
    # Law of cosines for theta2
    cos_theta2 = (D**2 - L1**2 - L2**2) / (2 * L1 * L2)
    theta2 = np.arccos(cos_theta2)  # Elbow-up solution
    
    # Theta1
    alpha = np.arctan2(y, x)
    beta = np.arctan2(L2 * np.sin(theta2), L1 + L2 * np.cos(theta2))
    theta1 = alpha - beta
    
    return theta1, theta2

# Example:
x_target, y_target = 1.5, 1.0
theta1, theta2 = inverse_kinematics_2dof(x_target, y_target, L1, L2)
print(f"Joint angles: θ1={np.rad2deg(theta1):.1f}°, θ2={np.rad2deg(theta2):.1f}°")

---

# JACOBIAN (Velocity relationship: end-effector velocity = J * joint velocity)

def jacobian_2dof(theta1, theta2, L1, L2):
    """
    J = [[∂x/∂θ1, ∂x/∂θ2],
         [∂y/∂θ1, ∂y/∂θ2]]
    """
    s1, c1 = np.sin(theta1), np.cos(theta1)
    s12, c12 = np.sin(theta1 + theta2), np.cos(theta1 + theta2)
    
    J = np.array([
        [-L1 * s1 - L2 * s12, -L2 * s12],
        [ L1 * c1 + L2 * c12,  L2 * c12]
    ])
    
    return J

# Application: Resolved-rate control (move end-effector at desired velocity)
theta1, theta2 = np.deg2rad(30), np.deg2rad(45)
J = jacobian_2dof(theta1, theta2, L1, L2)

v_desired = np.array([0.1, 0.05])  # Desired end-effector velocity (m/s)
theta_dot = np.linalg.pinv(J) @ v_desired  # Joint velocities (rad/s)

print(f"Joint velocities: {np.rad2deg(theta_dot)}")  # (deg/s)
```

---

## Control Systems

```python
# PID CONTROLLER (Position control for DC motor, joint, etc.)

class PIDController:
    def __init__(self, Kp, Ki, Kd, dt):
        """
        Kp: Proportional gain
        Ki: Integral gain
        Kd: Derivative gain
        dt: Time step
        """
        self.Kp = Kp
        self.Ki = Ki
        self.Kd = Kd
        self.dt = dt
        
        self.prev_error = 0
        self.integral = 0
    
    def update(self, setpoint, measured):
        """
        Compute control output
        """
        error = setpoint - measured
        
        # Proportional term
        P = self.Kp * error
        
        # Integral term (accumulated error)
        self.integral += error * self.dt
        I = self.Ki * self.integral
        
        # Derivative term (rate of change of error)
        derivative = (error - self.prev_error) / self.dt
        D = self.Kd * derivative
        
        # Total output
        output = P + I + D
        
        self.prev_error = error
        
        return output

# Example: Motor position control
pid = PIDController(Kp=5.0, Ki=0.5, Kd=0.1, dt=0.01)

setpoint = 90  # Desired position (degrees)
position = 0   # Current position
velocity = 0

for t in np.arange(0, 5, 0.01):
    # PID control
    control_signal = pid.update(setpoint, position)
    
    # Simple motor dynamics (integrator)
    velocity += control_signal * 0.01
    position += velocity * 0.01
    
    if t % 0.5 < 0.01:
        print(f"t={t:.2f}s, pos={position:.2f}°, error={setpoint-position:.2f}°")

---

# TUNING PID (Ziegler-Nichols method):

# 1. Set Ki=0, Kd=0, increase Kp until system oscillates (critical gain Ku)
# 2. Measure oscillation period Pu
# 3. Use formulas:
#    - Kp = 0.6 * Ku
#    - Ki = 2 * Kp / Pu
#    - Kd = Kp * Pu / 8

# Manual tuning:
# - Kp too high: Overshoot, oscillation
# - Kp too low: Slow response, steady-state error
# - Ki: Eliminate steady-state error (but can cause overshoot, instability)
# - Kd: Dampen oscillations, improve stability (but sensitive to noise)

# PRACTICAL TIPS:
# - Start with Kp only, tune until fast response with acceptable overshoot
# - Add Ki to eliminate steady-state error (small value, ~Kp/10)
# - Add Kd to reduce overshoot (small value, ~Kp/10)
# - Anti-windup: Clamp integral term (prevent runaway if error persists)
```

---

## ROS (Robot Operating System)

```bash
# ROS 2 (Recommended for new projects, better than ROS 1)

# Install ROS 2 Humble (Ubuntu 22.04)
sudo apt update && sudo apt install ros-humble-desktop

# Source ROS
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
source ~/.bashrc

# Create workspace
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws
colcon build

# Source workspace
echo "source ~/ros2_ws/install/setup.bash" >> ~/.bashrc
```

```python
# ROS 2 PUBLISHER (Velocity command to robot)

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist

class VelocityPublisher(Node):
    def __init__(self):
        super().__init__('velocity_publisher')
        self.publisher = self.create_publisher(Twist, '/cmd_vel', 10)
        self.timer = self.create_timer(0.1, self.publish_velocity)  # 10 Hz
        
    def publish_velocity(self):
        msg = Twist()
        msg.linear.x = 0.5  # Forward velocity (m/s)
        msg.angular.z = 0.2  # Rotational velocity (rad/s)
        
        self.publisher.publish(msg)
        self.get_logger().info(f'Publishing: linear={msg.linear.x}, angular={msg.angular.z}')

def main(args=None):
    rclpy.init(args=args)
    node = VelocityPublisher()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()

# Run: python3 velocity_publisher.py
```

```python
# ROS 2 SUBSCRIBER (Laser scan data)

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan
import numpy as np

class LaserSubscriber(Node):
    def __init__(self):
        super().__init__('laser_subscriber')
        self.subscription = self.create_subscription(
            LaserScan,
            '/scan',
            self.scan_callback,
            10
        )
        
    def scan_callback(self, msg):
        # msg.ranges: list of distances (meters), one per angle
        ranges = np.array(msg.ranges)
        
        # Filter out invalid readings (inf, nan)
        valid_ranges = ranges[(ranges > msg.range_min) & (ranges < msg.range_max)]
        
        if len(valid_ranges) > 0:
            min_distance = np.min(valid_ranges)
            self.get_logger().info(f'Minimum obstacle distance: {min_distance:.2f}m')
        
def main(args=None):
    rclpy.init(args=args)
    node = LaserSubscriber()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

```bash
# ROS 2 CLI COMMANDS

# List nodes
ros2 node list

# List topics
ros2 topic list

# Echo topic (see messages)
ros2 topic echo /scan

# Publish to topic (manual)
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.5}, angular: {z: 0.0}}"

# Inspect topic (type, publishers, subscribers)
ros2 topic info /scan

# Record data (rosbag)
ros2 bag record /scan /odom

# Play back data
ros2 bag play rosbag2_2025_01_01-12_00_00
```

---

## Sensors

```markdown
LIDAR (Light Detection and Ranging):

TYPES:
- 2D LIDAR: Single plane scan (Hokuyo, SICK, RPLIDAR)
  * Range: 0.1-30m (typical)
  * Angular resolution: 0.25-1° (360°)
  * Use: Indoor navigation, obstacle avoidance
  
- 3D LIDAR: Multi-layer (Velodyne, Ouster, Livox)
  * Range: 1-200m
  * Vertical FOV: 16-128 layers
  * Use: Autonomous vehicles, outdoor mapping

ADVANTAGES:
- Accurate distance measurement (mm-cm precision)
- Long range
- Works in low light

DISADVANTAGES:
- Expensive ($100-$75,000)
- Heavy, power-hungry (3D LIDAR)
- Struggles with transparent/reflective surfaces (glass, mirrors)

---

CAMERA (RGB, Monocular):

TYPES:
- USB Camera (Logitech C920, cheap, ~$50)
- Industrial Camera (FLIR, Basler, global shutter, no motion blur)

USE CASES:
- Object detection (YOLO, Faster R-CNN)
- Lane detection (autonomous vehicles)
- Visual servoing (align with target)

ADVANTAGES:
- Cheap
- Rich information (color, texture)

DISADVANTAGES:
- No depth (monocular, need stereo or depth camera for 3D)
- Sensitive to lighting (need good illumination)
- Computationally expensive (image processing)

---

DEPTH CAMERA (RGB-D):

TYPES:
- Intel RealSense (D435, $200-$400)
  * Stereo depth (two cameras, triangulation)
  * Range: 0.3-10m
  
- Kinect (discontinued, but still used)
  * Structured light (project pattern, measure distortion)
  * Range: 0.8-4m

USE CASES:
- Indoor navigation (avoid obstacles, map 3D)
- Grasping (detect object pose, depth)

ADVANTAGES:
- Cheap depth (compared to LIDAR)
- Compact

DISADVANTAGES:
- Limited range (~10m max)
- Struggles outdoors (sunlight interferes with IR)

---

IMU (Inertial Measurement Unit):

SENSORS:
- Accelerometer: Measure linear acceleration (m/s², 3-axis)
- Gyroscope: Measure angular velocity (rad/s, 3-axis)
- Magnetometer: Measure magnetic field (compass, 3-axis)

USE CASES:
- Orientation estimation (roll, pitch, yaw)
- Stabilization (drones, quadcopters)
- Dead reckoning (integrate velocity, estimate position)

ADVANTAGES:
- High frequency (100-1000 Hz, fast)
- Self-contained (no external reference)

DISADVANTAGES:
- Drift (integration error accumulates over time)
- Sensitive to vibration, magnetic interference

SENSOR FUSION:
- Combine IMU + GPS + odometry (Kalman filter, Extended Kalman Filter)
- IMU corrects GPS drift (high frequency), GPS corrects IMU drift (absolute position)

---

ENCODERS (Measure wheel rotation):

TYPES:
- Incremental: Count pulses (relative position, cheap)
- Absolute: Unique position code (know position on power-up, expensive)

USE CASES:
- Odometry (estimate robot position from wheel rotation)
- Motor control (measure speed, position)

RESOLUTION:
- Pulses per revolution (PPR): 100-10,000+ (higher = more precise)

ODOMETRY ERRORS:
- Wheel slip (on smooth surfaces, acceleration)
- Uneven wheel diameter (wear, inflation)
- Cumulative drift (integrate over time, errors accumulate)

MITIGATION:
- Sensor fusion (combine with IMU, LIDAR, visual odometry)
```

---

## Motion Planning

```python
# A* PATHFINDING (Grid-based, optimal, commonly used)

import heapq
import numpy as np

def astar(grid, start, goal):
    """
    A* pathfinding on 2D occupancy grid
    
    grid: 2D numpy array (0=free, 1=obstacle)
    start: (row, col) tuple
    goal: (row, col) tuple
    
    Returns: List of (row, col) tuples (path from start to goal)
    """
    rows, cols = grid.shape
    
    # Neighbors (4-connected: up, down, left, right)
    neighbors = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    # Heuristic (Manhattan distance)
    def heuristic(node):
        return abs(node[0] - goal[0]) + abs(node[1] - goal[1])
    
    # Priority queue: (f_score, node)
    open_set = [(heuristic(start), start)]
    came_from = {}
    g_score = {start: 0}
    f_score = {start: heuristic(start)}
    
    while open_set:
        _, current = heapq.heappop(open_set)
        
        if current == goal:
            # Reconstruct path
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            return path[::-1]
        
        for dr, dc in neighbors:
            neighbor = (current[0] + dr, current[1] + dc)
            
            # Check bounds and obstacles
            if 0 <= neighbor[0] < rows and 0 <= neighbor[1] < cols and grid[neighbor] == 0:
                tentative_g_score = g_score[current] + 1
                
                if neighbor not in g_score or tentative_g_score < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g_score
                    f_score[neighbor] = tentative_g_score + heuristic(neighbor)
                    heapq.heappush(open_set, (f_score[neighbor], neighbor))
    
    return None  # No path found

# Example:
grid = np.array([
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0]
])

start = (0, 0)
goal = (4, 4)

path = astar(grid, start, goal)
print("Path:", path)  # [(0, 0), (1, 0), (2, 0), (2, 1), (2, 2), ...]

---

# RRT (Rapidly-exploring Random Tree, for high-DOF, continuous spaces)

# Pseudocode:
# 1. Start with tree containing start node
# 2. Repeat:
#    a. Sample random configuration
#    b. Find nearest node in tree
#    c. Extend toward sample (small step)
#    d. If collision-free, add to tree
# 3. Stop when goal reached (or max iterations)

# USE CASES:
# - Manipulator motion planning (6+ DOF)
# - Non-holonomic constraints (car-like robot, can't move sideways)
# - Complex obstacle environments

# ADVANTAGES:
# - Probabilistically complete (will find path if one exists, given enough time)
# - Handles high-dimensional spaces

# DISADVANTAGES:
# - Not optimal (path may be long, jerky)
# - Slow for simple problems (A* faster for grid-based)

# VARIANTS:
# - RRT*: Optimal version (rewire tree, shorter path)
# - Informed RRT*: Use heuristic (faster convergence)
```

---

## Key Takeaways

1. **Kinematics first** - Understand forward/inverse kinematics (foundation for motion control)
2. **PID is everywhere** - Simple, effective (motor control, joint control, even drone altitude)
3. **ROS for integration** - Standard middleware (sensor data, control, simulation, visualization)
4. **Sensor fusion** - No single sensor is perfect (combine LIDAR, camera, IMU, odometry)
5. **Motion planning scales** - Grid-based (A*) for simple, sampling-based (RRT) for complex

---

## References

- "Modern Robotics" - Kevin Lynch & Frank Park
- "Probabilistic Robotics" - Sebastian Thrun
- ROS 2 Documentation: https://docs.ros.org

**Related**: `ros2-navigation-stack.md`, `slam-algorithms.md`, `manipulator-motion-planning.md`
