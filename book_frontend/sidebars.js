// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
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
          label: 'Module 2: Physics Simulation & High-Fidelity Interaction',
          items: [
            'digital-twin-sim/physics-simulation-gazebo',
            'digital-twin-sim/high-fidelity-unity',
            'digital-twin-sim/sensor-simulation'
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Tutorial',
      items: [
        'tutorial-basics/create-a-document',
        'tutorial-basics/create-a-page',
        'tutorial-basics/deploy-your-site',
      ],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
