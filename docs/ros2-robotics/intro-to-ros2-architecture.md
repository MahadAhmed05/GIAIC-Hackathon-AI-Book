# Introduction to ROS 2 Architecture

## Learning Objectives

After completing this chapter, you should be able to:
- Explain the four primary communication patterns in ROS 2 (nodes, topics, services, actions)
- Identify when to use each communication pattern in a humanoid robotics context
- Describe how the ROS 2 communication model enables coordination between sensors, AI decision-making, and robot control
- Understand the key advantages of ROS 2 for humanoid robotics applications

## Overview

ROS 2 (Robot Operating System 2) serves as the "nervous system" for humanoid robots, providing a communication framework that connects AI decision-making processes with physical robot control. This chapter introduces the fundamental concepts that make ROS 2 an essential middleware for robotics applications.

## Core Communication Patterns

ROS 2 implements four primary communication patterns that enable different types of interactions between robot components:

### Nodes
Nodes are the fundamental building blocks of a ROS 2 system. Each node represents a process that performs computation. In humanoid robotics, nodes might represent:
- Sensor processing units (camera, LIDAR, IMU)
- Control systems (arm controllers, leg controllers)
- AI decision-making modules
- Communication interfaces

### Topics
Topics enable asynchronous, many-to-many communication through a publish-subscribe model. This pattern is ideal for:
- Sensor data distribution (multiple nodes can subscribe to camera feeds)
- Status updates (robot pose, battery levels)
- Continuous data streams (joint positions, sensor readings)

### Services
Services provide synchronous, request-response communication for:
- Action completion requests (move arm to position X)
- Configuration changes
- One-time queries (current robot status)

### Actions
Actions offer asynchronous request-response communication with feedback and goal management, perfect for:
- Complex robot movements that take time
- Tasks that provide ongoing feedback during execution
- Operations that can be preempted or canceled

## ROS 2 Communication Model for Humanoid Robots

In humanoid robotics, the ROS 2 communication model enables the coordination of numerous sensors and actuators:

1. **Sensing Layer**: Multiple sensor nodes publish data to topics
2. **Perception Layer**: Processing nodes subscribe to sensor data and publish processed information
3. **Planning Layer**: AI decision-making nodes receive processed information and plan actions
4. **Execution Layer**: Control nodes receive commands and execute them on the physical robot
5. **Feedback Loop**: Sensor nodes continuously provide feedback to verify action completion

## Key Advantages for Humanoid Robotics

- **Modularity**: Components can be developed and tested independently
- **Scalability**: New sensors or capabilities can be added without system redesign
- **Real-time Performance**: Optimized for low-latency communication critical for robot control
- **Distributed Computing**: Nodes can run on different hardware components within the robot
- **Language Agnostic**: Components can be written in different programming languages

## Summary

Understanding ROS 2's communication patterns is essential for developing effective humanoid robotics applications. The combination of nodes, topics, services, and actions provides a flexible and robust framework for connecting AI logic with physical robot control.