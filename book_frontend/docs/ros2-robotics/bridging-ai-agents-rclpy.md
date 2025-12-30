# Bridging AI Agents to Robots with rclpy

## Learning Objectives

After completing this chapter, you should be able to:
- Explain the role of rclpy in bridging AI agents with ROS 2 robot systems
- Implement publishers to send commands from AI agents to robots
- Implement subscribers to receive sensor data from robots in AI agents
- Make service calls from AI agents to request specific robot actions
- Understand the complete flow from AI decision to robot actuation
- Apply best practices for safe and effective AI-robot integration

## Overview

The bridge between AI decision-making systems and physical robot control is critical for creating intelligent humanoid robots. This chapter focuses on rclpy, the Python client library for ROS 2, which enables AI agents written in Python to communicate with and control robot systems.

## Understanding rclpy

rclpy is the Python implementation of ROS 2 client libraries that provides a Pythonic interface to ROS 2 functionality. It's particularly valuable for AI applications because:

- Most AI frameworks (TensorFlow, PyTorch, scikit-learn) have strong Python support
- Python is the dominant language in AI and machine learning
- Rapid prototyping is facilitated by Python's expressiveness

## Publishing Messages with rclpy

Publishing allows AI agents to send commands and data to the robot system:

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class AIAgentPublisher(Node):
    def __init__(self):
        super().__init__('ai_agent_publisher')
        self.publisher = self.create_publisher(String, 'ai_commands', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)

    def timer_callback(self):
        msg = String()
        msg.data = 'AI command: Move to target location'
        self.publisher.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
```

## Subscribing to Robot Data

Subscribing allows AI agents to receive sensor data and robot status information:

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState

class AIAgentSubscriber(Node):
    def __init__(self):
        super().__init__('ai_agent_subscriber')
        self.subscription = self.create_subscription(
            JointState,
            'joint_states',
            self.listener_callback,
            10)
        self.subscription  # prevent unused variable warning

    def listener_callback(self, msg):
        # Process joint state information for AI decision making
        self.get_logger().info(f'Received joint positions: {msg.position}')
        # AI logic would process this data to make decisions
```

## Service Calls with rclpy

Service calls enable AI agents to request specific actions from the robot system:

```python
import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient
from example_interfaces.srv import SetBool

class AIAgentServiceClient(Node):
    def __init__(self):
        super().__init__('ai_agent_service_client')
        self.cli = self.create_client(SetBool, 'emergency_stop')

    def send_emergency_stop(self, activate):
        while not self.cli.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Service not available, waiting again...')

        request = SetBool.Request()
        request.data = activate
        self.future = self.cli.call_async(request)
        rclpy.spin_until_future_complete(self, self.future)
        return self.future.result()
```

## Conceptual Flow: From AI Decision to Robot Actuation

The complete flow from AI decision to physical robot action involves several steps:

1. **AI Decision Making**: The AI agent processes sensor data and makes a decision
2. **Message Construction**: The AI agent constructs appropriate ROS 2 messages using rclpy
3. **Message Publishing**: The AI agent publishes commands to appropriate topics
4. **Message Processing**: Robot control nodes receive and process the commands
5. **Actuator Control**: Robot control systems execute the commands on physical hardware
6. **Feedback Collection**: Sensors provide feedback about the action results
7. **AI Adaptation**: The AI agent receives feedback and adjusts future decisions

## Practical Example: AI-Controlled Arm Movement

Here's a complete example of an AI agent controlling a robot arm:

```python
import rclpy
from rclpy.node import Node
from trajectory_msgs.msg import JointTrajectory, JointTrajectoryPoint
from builtin_interfaces.msg import Duration

class AIArmController(Node):
    def __init__(self):
        super().__init__('ai_arm_controller')
        self.publisher = self.create_publisher(
            JointTrajectory,
            '/arm_controller/joint_trajectory',
            10
        )

    def move_arm_to_position(self, joint_positions):
        """AI agent requests arm movement to specific positions"""
        msg = JointTrajectory()
        msg.joint_names = ['joint1', 'joint2', 'joint3', 'joint4']

        point = JointTrajectoryPoint()
        point.positions = joint_positions
        point.time_from_start = Duration(sec=2)  # 2 seconds to reach position

        msg.points = [point]
        self.publisher.publish(msg)

        self.get_logger().info(f'Moving arm to positions: {joint_positions}')

def main(args=None):
    rclpy.init(args=args)
    ai_controller = AIArmController()

    # Example: AI decision to move arm to pick up an object
    target_position = [0.5, 1.0, -0.5, 0.0]  # AI-determined joint angles
    ai_controller.move_arm_to_position(target_position)

    rclpy.spin_once(ai_controller, timeout_sec=1)
    ai_controller.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Best Practices for AI-Robot Integration

- **Error Handling**: Implement robust error handling for communication failures
- **Safety Checks**: Validate commands before sending to prevent dangerous robot movements
- **State Awareness**: Maintain awareness of robot state to make informed decisions
- **Asynchronous Processing**: Use callbacks and async patterns to maintain AI agent responsiveness
- **Performance Optimization**: Minimize communication overhead in time-critical applications

## Summary

rclpy provides the essential bridge between Python-based AI agents and ROS 2 robot systems. Understanding publishing, subscribing, and service calls enables the creation of intelligent robotic systems where AI logic drives physical robot behavior effectively.