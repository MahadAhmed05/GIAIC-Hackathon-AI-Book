# Humanoid Structure with URDF

## Learning Objectives

After completing this chapter, you should be able to:
- Explain the purpose of URDF in humanoid robotics
- Identify and describe the components of a URDF file (links, joints, sensors, coordinate frames)
- Create basic URDF files for simple humanoid robot structures
- Understand how URDF enables both simulation and real-world deployment
- Apply best practices for structuring URDF files for humanoid robots
- Use URDF validation tools to debug robot models

## Overview

URDF (Unified Robot Description Format) is the standard XML format for describing robot structures in ROS. For humanoid robots, URDF provides a comprehensive representation of the robot's physical structure, including links, joints, sensors, and coordinate frames. This chapter explains how URDF enables both simulation and real-world deployment of humanoid robots.

## Purpose of URDF in Humanoid Robotics

URDF serves several critical functions in humanoid robotics:

- **Physical Representation**: Defines the robot's physical structure, including dimensions and masses
- **Kinematic Model**: Establishes the mathematical relationships between robot joints
- **Visual Representation**: Provides visual models for simulation and visualization
- **Collision Models**: Defines collision boundaries for simulation and safety
- **Sensor Integration**: Specifies where sensors are mounted on the robot
- **Inertial Properties**: Contains mass, center of mass, and inertia tensor data

## Links, Joints, Sensors, and Coordinate Frames

### Links
Links represent the rigid bodies of the robot. In a humanoid robot, links might include:
- Torso
- Head
- Upper arms and lower arms
- Hands
- Upper legs and lower legs
- Feet

Each link has properties such as:
- Mass and inertia
- Visual geometry (for display)
- Collision geometry (for physics simulation)

### Joints
Joints define the connections between links and specify how they can move relative to each other:

- **Revolute**: Rotational joints with limited range (like human elbows)
- **Continuous**: Rotational joints with unlimited range
- **Prismatic**: Linear sliding joints
- **Fixed**: No movement (for permanently attached components)
- **Floating**: 6 degrees of freedom
- **Planar**: Movement in a plane

### Sensors
URDF can specify where sensors are mounted on the robot:
- Cameras
- IMUs (Inertial Measurement Units)
- Force/torque sensors
- Range finders
- Touch sensors

### Coordinate Frames
URDF establishes a tree of coordinate frames that define spatial relationships:
- Each link has its own coordinate frame
- Joint transforms define relationships between frames
- Enables spatial reasoning and transformations

## URDF Structure Example for Humanoid Robot

```xml
<?xml version="1.0"?>
<robot name="humanoid_robot">
  <!-- Base link -->
  <link name="base_link">
    <inertial>
      <mass value="10.0"/>
      <origin xyz="0 0 0"/>
      <inertia ixx="1.0" ixy="0.0" ixz="0.0" iyy="1.0" iyz="0.0" izz="1.0"/>
    </inertial>
    <visual>
      <origin xyz="0 0 0"/>
      <geometry>
        <box size="0.5 0.5 0.5"/>
      </geometry>
    </visual>
    <collision>
      <origin xyz="0 0 0"/>
      <geometry>
        <box size="0.5 0.5 0.5"/>
      </geometry>
    </collision>
  </link>

  <!-- Torso link -->
  <link name="torso">
    <inertial>
      <mass value="5.0"/>
      <origin xyz="0 0 0.5"/>
      <inertia ixx="0.5" ixy="0.0" ixz="0.0" iyy="0.5" iyz="0.0" izz="0.2"/>
    </inertial>
    <visual>
      <origin xyz="0 0 0.5"/>
      <geometry>
        <cylinder radius="0.2" length="1.0"/>
      </geometry>
    </visual>
    <collision>
      <origin xyz="0 0 0.5"/>
      <geometry>
        <cylinder radius="0.2" length="1.0"/>
      </geometry>
    </collision>
  </link>

  <!-- Joint connecting base to torso -->
  <joint name="base_to_torso" type="fixed">
    <parent link="base_link"/>
    <child link="torso"/>
    <origin xyz="0 0 0.25" rpy="0 0 0"/>
  </joint>

  <!-- Head link -->
  <link name="head">
    <inertial>
      <mass value="2.0"/>
      <origin xyz="0 0 0"/>
      <inertia ixx="0.1" ixy="0.0" ixz="0.0" iyy="0.1" iyz="0.0" izz="0.1"/>
    </inertial>
    <visual>
      <origin xyz="0 0 0"/>
      <geometry>
        <sphere radius="0.15"/>
      </geometry>
    </visual>
    <collision>
      <origin xyz="0 0 0"/>
      <geometry>
        <sphere radius="0.15"/>
      </geometry>
    </collision>
  </link>

  <!-- Joint connecting torso to head -->
  <joint name="torso_to_head" type="revolute">
    <parent link="torso"/>
    <child link="head"/>
    <origin xyz="0 0 1.0" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-0.5" upper="0.5" effort="10.0" velocity="1.0"/>
  </joint>
</robot>
```

## How URDF Enables Simulation and Real-World Deployment

### Simulation Benefits
- **Gazebo Integration**: URDF files can be directly loaded into Gazebo physics simulator
- **Collision Detection**: Physics engines use collision models to simulate realistic interactions
- **Forward and Inverse Kinematics**: URDF provides the kinematic structure for motion planning
- **Sensor Simulation**: Simulated sensors can be placed according to URDF specifications
- **Visualization**: RViz and other tools can visualize the robot structure in 3D

### Real-World Deployment
- **Kinematic Solvers**: URDF provides the structure needed for kinematic calculations
- **Robot Calibration**: Defines expected physical relationships between components
- **Motion Planning**: Planning algorithms use URDF for collision checking and path planning
- **Hardware Abstraction**: Provides a consistent interface regardless of specific hardware
- **ROS Integration**: Many ROS tools expect URDF for robot interaction

## URDF Best Practices for Humanoid Robots

### Structural Organization
- Create a logical hierarchy that reflects the robot's physical structure
- Use meaningful names for links and joints
- Establish a clear base link as the root of the kinematic tree

### Kinematic Considerations
- Ensure joint limits reflect physical constraints
- Include appropriate safety margins in joint limits
- Consider the impact of joint types on motion planning capabilities

### Mass and Inertia Properties
- Accurately represent mass distribution for physics simulation
- Use experimental data when possible to refine inertial properties
- Consider the impact of payloads on overall robot properties

### Visualization and Collision Models
- Use simple geometric shapes for collision models to improve performance
- Use detailed meshes for visual models to improve appearance
- Ensure collision models are conservative to prevent false negatives

## Advanced URDF Concepts

### Transmission Elements
URDF can specify how actuators connect to joints:
```xml
<transmission name="torso_to_head_trans">
  <type>transmission_interface/SimpleTransmission</type>
  <joint name="torso_to_head">
    <hardwareInterface>PositionJointInterface</hardwareInterface>
  </joint>
  <actuator name="head_motor">
    <hardwareInterface>PositionJointInterface</hardwareInterface>
    <mechanicalReduction>1</mechanicalReduction>
  </actuator>
</transmission>
```

### Gazebo-Specific Extensions
URDF can include Gazebo-specific elements for simulation:
```xml
<gazebo reference="head">
  <material>Gazebo/Blue</material>
  <mu1>0.2</mu1>
  <mu2>0.2</mu2>
</gazebo>
```

## Validation and Debugging

### URDF Validation Tools
- `check_urdf` command-line tool to verify URDF structure
- `urdf_to_graphiz` to visualize the kinematic tree
- Simulation testing to validate kinematic behavior

### Common Issues
- Kinematic loops (avoid these in URDF)
- Incorrect coordinate frame relationships
- Missing or invalid inertial properties
- Inconsistent joint limits

## Summary

URDF provides the essential physical description that enables both simulation and real-world deployment of humanoid robots. By properly defining links, joints, sensors, and coordinate frames, URDF creates a bridge between abstract robot control algorithms and the physical reality of the robot's structure. Understanding URDF is crucial for developing effective humanoid robotics applications.