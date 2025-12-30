# Quickstart: Digital Twin Simulation with Gazebo & Unity

## Getting Started

This quickstart guide will help you set up and run the Digital Twin Simulation with Gazebo & Unity documentation module locally.

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

### Adding the Digital Twin Simulation Content

The Digital Twin Simulation module content is organized in the `docs/digital-twin-sim/` directory with the following structure:

- `physics-simulation-gazebo.md` - Physics Simulation with Gazebo
- `high-fidelity-unity.md` - High-Fidelity Interaction with Unity
- `sensor-simulation.md` - Sensor Simulation for perception pipelines

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