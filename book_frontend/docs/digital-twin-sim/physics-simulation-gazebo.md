---
title: Physics Simulation with Gazebo
sidebar_label: Physics Simulation with Gazebo
---

# Physics Simulation with Gazebo

## Learning Objectives

By the end of this chapter, you will be able to:
- Understand the fundamentals of physics-based simulation for humanoid robots
- Configure Gazebo simulation environments with realistic parameters
- Set up gravity, collisions, and rigid-body dynamics
- Simulate realistic humanoid movement and environmental interactions
- Validate simulation accuracy against physical laws

## Introduction to Gazebo for Physics Simulation

Gazebo is a powerful open-source physics simulator that provides realistic simulation environments for robotics applications. It is particularly well-suited for humanoid robot development due to its sophisticated physics engine, collision detection capabilities, and realistic environmental modeling.

In this chapter, we'll explore how to create physics-based simulation environments that accurately represent the real world, enabling you to test and validate humanoid robot behaviors before deployment.

## Gazebo Environment Setup

### Installing Gazebo

Before starting with physics simulation, ensure you have Gazebo installed. For this course, we recommend Gazebo Harmonic or later versions:

```bash
# Ubuntu installation
sudo apt-get update
sudo apt-get install gazebo libgazebo-dev
```

### Basic Environment Configuration

Creating a basic Gazebo environment involves setting up world files that define the physical space, lighting, and initial conditions:

```xml
<?xml version="1.0" ?>
<sdf version="1.7">
  <world name="humanoid_simulation">
    <!-- Include a basic environment -->
    <include>
      <uri>model://ground_plane</uri>
    </include>
    <include>
      <uri>model://sun</uri>
    </include>

    <!-- Define physics engine -->
    <physics name="1ms" type="ode">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1.0</real_time_factor>
      <real_time_update_rate>1000.0</real_time_update_rate>
    </physics>
  </world>
</sdf>
```

## Physics Engine Configuration

### Understanding the Physics Engine

Gazebo uses ODE (Open Dynamics Engine) by default, but also supports Bullet and DART physics engines. Each engine has different characteristics:

- **ODE**: Fast and stable for most applications
- **Bullet**: Better for complex collision detection
- **DART**: More accurate for articulated bodies

### Configuring Physics Parameters

The physics engine configuration is crucial for realistic simulation:

```xml
<physics name="humanoid_physics" type="ode">
  <!-- Time step configuration -->
  <max_step_size>0.001</max_step_size>
  <real_time_factor>1.0</real_time_factor>
  <real_time_update_rate>1000.0</real_time_update_rate>

  <!-- Solver configuration -->
  <ode>
    <solver>
      <type>quick</type>
      <iters>10</iters>
      <sor>1.3</sor>
    </solver>
    <constraints>
      <cfm>0.0</cfm>
      <erp>0.2</erp>
      <contact_max_correcting_vel>100.0</contact_max_correcting_vel>
      <contact_surface_layer>0.001</contact_surface_layer>
    </constraints>
  </ode>
</physics>
```

## Gravity and Environmental Parameters

### Configuring Gravity

Gravity is a fundamental force in physics simulation. For humanoid robots, you typically want Earth-like gravity:

```xml
<gravity>0 0 -9.8</gravity>
```

However, you might want to experiment with different gravity values for specific scenarios:

```xml
<!-- Moon gravity -->
<gravity>0 0 -1.62</gravity>

<!-- Zero gravity environment -->
<gravity>0 0 0</gravity>
```

### Environmental Parameters

Environmental parameters affect how objects interact with their surroundings:

```xml
<world name="humanoid_env">
  <!-- Wind effects -->
  <wind>
    <linear_velocity>0.5 0 0</linear_velocity>
  </wind>

  <!-- Atmosphere -->
  <atmosphere type="adiabatic">
    <temperature>288.15</temperature>
    <pressure>101325</pressure>
  </atmosphere>
</world>
```

## Collision Detection

### Understanding Collision Models

Collision detection is critical for realistic physics simulation. In Gazebo, each model has both visual and collision elements:

```xml
<model name="humanoid_link">
  <link name="torso">
    <!-- Visual representation -->
    <visual name="visual">
      <geometry>
        <box>
          <size>0.3 0.2 0.5</size>
        </box>
      </geometry>
    </visual>

    <!-- Collision model -->
    <collision name="collision">
      <geometry>
        <box>
          <size>0.3 0.2 0.5</size>
        </box>
      </geometry>
    </collision>
  </link>
</model>
```

### Collision Properties

Fine-tuning collision properties can significantly impact simulation realism:

```xml
<collision name="collision">
  <geometry>
    <box>
      <size>0.3 0.2 0.5</size>
    </box>
  </geometry>

  <!-- Surface properties -->
  <surface>
    <friction>
      <ode>
        <mu>1.0</mu>
        <mu2>1.0</mu2>
      </ode>
    </friction>
    <bounce>
      <restitution_coefficient>0.1</restitution_coefficient>
      <threshold>100000.0</threshold>
    </bounce>
    <contact>
      <ode>
        <soft_cfm>0.0</soft_cfm>
        <soft_erp>0.2</soft_erp>
        <kp>1e+13</kp>
        <kd>1.0</kd>
      </ode>
    </contact>
  </surface>
</collision>
```

## Rigid-Body Dynamics for Humanoid Robots

### Understanding Rigid-Body Physics

Rigid-body dynamics is fundamental to humanoid robot simulation. Each body part (link) in the robot has mass, inertia, and responds to forces according to Newton's laws:

```xml
<link name="upper_arm">
  <inertial>
    <mass>2.0</mass>
    <inertia>
      <ixx>0.01</ixx>
      <ixy>0.0</ixy>
      <ixz>0.0</ixz>
      <iyy>0.01</iyy>
      <iyz>0.0</iyz>
      <izz>0.005</izz>
    </inertia>
  </inertial>

  <!-- Collision and visual properties -->
  <collision name="collision">
    <geometry>
      <cylinder>
        <length>0.3</length>
        <radius>0.05</radius>
      </cylinder>
    </geometry>
  </collision>
</link>
```

### Joint Configuration for Humanoid Movement

Humanoid robots require carefully configured joints to simulate realistic movement:

```xml
<joint name="shoulder_pitch" type="revolute">
  <parent>torso</parent>
  <child>upper_arm</child>
  <axis>
    <xyz>0 1 0</xyz>
    <limit>
      <lower>-1.57</lower>
      <upper>1.57</upper>
      <effort>100.0</effort>
      <velocity>3.0</velocity>
    </limit>
    <dynamics>
      <damping>0.1</damping>
      <friction>0.0</friction>
    </dynamics>
  </axis>
</joint>
```

## Practical Examples and Diagrams

### Simple Humanoid Model

Let's create a simple humanoid model with basic physics properties:

```xml
<?xml version="1.0" ?>
<robot name="simple_humanoid">
  <!-- Torso -->
  <link name="torso">
    <inertial>
      <mass value="10.0"/>
      <origin xyz="0 0 0.25"/>
      <inertia ixx="0.5" ixy="0.0" ixz="0.0" iyy="0.5" iyz="0.0" izz="0.2"/>
    </inertial>

    <visual>
      <geometry>
        <box size="0.3 0.2 0.5"/>
      </geometry>
    </visual>

    <collision>
      <geometry>
        <box size="0.3 0.2 0.5"/>
      </geometry>
    </collision>
  </link>

  <!-- Head -->
  <link name="head">
    <inertial>
      <mass value="2.0"/>
      <origin xyz="0 0 0"/>
      <inertia ixx="0.02" ixy="0.0" ixz="0.0" iyy="0.02" iyz="0.0" izz="0.02"/>
    </inertial>

    <visual>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
    </visual>

    <collision>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
    </collision>
  </link>

  <!-- Joint connecting torso to head -->
  <joint name="neck_joint" type="revolute">
    <parent link="torso"/>
    <child link="head"/>
    <origin xyz="0 0 0.4"/>
    <axis xyz="0 1 0"/>
    <limit lower="-0.5" upper="0.5" effort="10.0" velocity="1.0"/>
  </joint>
</robot>
```

### Physics Validation

To validate that your physics simulation is accurate, consider these checks:

1. **Energy Conservation**: In a closed system without damping, total energy should remain constant
2. **Collision Response**: Objects should bounce realistically based on their materials
3. **Gravity Effects**: Objects should fall at the expected rate (9.8 m/s² for Earth gravity)
4. **Stability**: Static objects should remain stable without oscillation

## Summary

Physics simulation with Gazebo provides a powerful foundation for developing and testing humanoid robots. By carefully configuring gravity, collision detection, and rigid-body dynamics, you can create realistic simulation environments that accurately represent real-world physics.

Key takeaways from this chapter:
- Physics engine configuration significantly impacts simulation realism
- Collision models must be carefully designed for each robot link
- Environmental parameters like gravity affect all simulation behavior
- Proper validation ensures simulation accuracy

## Review Questions

1. What are the main differences between ODE, Bullet, and DART physics engines in Gazebo?
2. Why is it important to separate visual and collision models in robot simulation?
3. How do you configure gravity for different planetary environments in Gazebo?
4. What are the key parameters that affect collision detection accuracy?
5. How can you validate that your physics simulation accurately represents real-world physics?