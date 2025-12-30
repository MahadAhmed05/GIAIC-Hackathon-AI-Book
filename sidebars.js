// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'ROS 2 Robotics',
      items: [
        {
          type: 'category',
          label: 'Module 1: The Robotic Nervous System',
          items: [
            'ros2-robotics/intro-to-ros2-architecture',
            'ros2-robotics/bridging-ai-agents-rclpy',
            'ros2-robotics/humanoid-structure-urdf'
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Digital Twin Simulation',
      items: [
        {
          type: 'category',
          label: 'Module 2: The Digital Twin (Gazebo & Unity)',
          items: [
            'digital-twin-sim/physics-simulation-gazebo',
            'digital-twin-sim/high-fidelity-unity',
            'digital-twin-sim/sensor-simulation'
          ],
        },
      ],
    },
    // Add other modules here as they are created
  ],
};

module.exports = sidebars;