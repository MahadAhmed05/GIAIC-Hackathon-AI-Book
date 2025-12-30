# Quickstart: ROS 2 Robotics Book Module 1

## Getting Started

This quickstart guide will help you set up and run the ROS 2 Robotics Book Module 1 documentation site locally.

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Git for version control

### Installation Steps

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Navigate to your project directory**:
   ```bash
   cd <project-directory>
   ```

3. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Start the development server**:
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser** to `http://localhost:3000` to view the documentation site.

### Adding the ROS 2 Module Content

The ROS 2 Robotics module content is organized in the `docs/ros2-robotics/` directory with the following structure:

- `intro-to-ros2-architecture.md` - Introduction to ROS 2 Architecture
- `bridging-ai-agents-rclpy.md` - Bridging AI Agents to Robots with rclpy
- `humanoid-structure-urdf.md` - Humanoid Structure with URDF

### Building for Production

To build the static site for deployment:

```bash
npm run build
# or
yarn build
```

The built site will be available in the `build/` directory and can be deployed to GitHub Pages or any static hosting service.

### Local Development Tips

- Edit markdown files in the `docs/` directory to update content
- The development server will automatically reload when you make changes
- Use the Docusaurus documentation for advanced configuration options
- Check the sidebar configuration in `sidebars.js` to manage navigation