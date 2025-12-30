---
title: Sensor Simulation for Perception Pipelines
sidebar_label: Sensor Simulation for Perception Pipelines
---

# Sensor Simulation for Perception Pipelines

## Learning Objectives

By the end of this chapter, you will be able to:
- Understand the importance of sensor simulation in digital twins
- Implement simulated LiDAR sensors for 3D mapping and navigation
- Create depth camera simulations for computer vision tasks
- Configure IMU (Inertial Measurement Unit) simulations for pose estimation
- Develop perception pipelines using simulated sensor data
- Evaluate simulation-to-reality transfer for robotic applications

## Introduction to Sensor Simulation

Sensor simulation is a critical component of digital twin development for robotics. Realistic sensor simulation enables the development and testing of perception algorithms without requiring physical hardware, reducing development time and costs while increasing safety during algorithm development.

In this chapter, we'll explore how to simulate various sensors commonly used in humanoid robotics, focusing on creating realistic sensor data that closely matches real-world sensor outputs.

## Purpose of Sensor Simulation in Digital Twins

### Development Benefits

Sensor simulation offers several advantages for digital twin development:

1. **Algorithm Development**: Test perception algorithms without physical hardware
2. **Safety**: Experiment with dangerous scenarios in a safe environment
3. **Cost Reduction**: Eliminate hardware wear and tear during testing
4. **Repeatability**: Create identical scenarios for consistent testing
5. **Edge Case Testing**: Simulate rare or dangerous situations safely

### Types of Sensors in Humanoid Robotics

Humanoid robots typically use multiple sensor types:

- **LiDAR**: 3D mapping, navigation, obstacle detection
- **Depth Cameras**: Object recognition, manipulation, SLAM
- **IMU**: Orientation, acceleration, motion detection
- **Cameras**: Visual recognition, navigation, human interaction
- **Force/Torque Sensors**: Manipulation, balance control
- **GPS**: Outdoor navigation, localization

## LiDAR Simulation with Examples

### Understanding LiDAR Simulation

LiDAR (Light Detection and Ranging) sensors emit laser pulses and measure the time it takes for reflections to return. In simulation, we model this process by casting rays from the sensor origin and detecting intersections with objects in the environment.

### Gazebo LiDAR Simulation

Gazebo provides built-in support for LiDAR simulation through the `ray` sensor plugin:

```xml
<sensor name="lidar_sensor" type="ray">
  <pose>0 0 0.3 0 0 0</pose>
  <ray>
    <scan>
      <horizontal>
        <samples>720</samples>
        <resolution>1</resolution>
        <min_angle>-3.14159</min_angle>
        <max_angle>3.14159</max_angle>
      </horizontal>
    </scan>
    <range>
      <min>0.1</min>
      <max>30.0</max>
      <resolution>0.01</resolution>
    </range>
  </ray>
  <plugin name="lidar_controller" filename="libgazebo_ros_ray_sensor.so">
    <ros>
      <namespace>/lidar</namespace>
      <remapping>~/out:=scan</remapping>
    </ros>
    <output_type>sensor_msgs/LaserScan</output_type>
    <frame_name>lidar_frame</frame_name>
  </plugin>
</sensor>
```

### Unity LiDAR Simulation

In Unity, we can simulate LiDAR by implementing raycasting in multiple directions:

```csharp
using UnityEngine;
using System.Collections.Generic;

public class LidarSimulator : MonoBehaviour
{
    [Header("Lidar Configuration")]
    public int horizontalSamples = 720;
    public int verticalSamples = 1;
    public float minAngle = -Mathf.PI;
    public float maxAngle = Mathf.PI;
    public float rangeMin = 0.1f;
    public float rangeMax = 30.0f;
    public LayerMask detectionLayers = -1;

    [Header("Visualization")]
    public bool visualizeRays = false;
    public float rayVisualizationDuration = 0.01f;

    private List<float> ranges;
    private float angleIncrement;
    private float verticalAngleIncrement;

    void Start()
    {
        ranges = new List<float>();
        angleIncrement = (maxAngle - minAngle) / horizontalSamples;
        verticalAngleIncrement = (verticalSamples > 1) ?
            (2 * Mathf.PI) / verticalSamples : 0;

        InitializeRanges();
    }

    void Update()
    {
        SimulateLidar();
    }

    void InitializeRanges()
    {
        int totalSamples = horizontalSamples * verticalSamples;
        ranges.Clear();

        for (int i = 0; i < totalSamples; i++)
        {
            ranges.Add(rangeMax);
        }
    }

    void SimulateLidar()
    {
        int index = 0;

        for (int v = 0; v < verticalSamples; v++)
        {
            float vAngle = (verticalSamples > 1) ?
                v * verticalAngleIncrement - Mathf.PI : 0;

            for (int h = 0; h < horizontalSamples; h++)
            {
                float hAngle = minAngle + h * angleIncrement;

                Vector3 direction = CalculateRayDirection(hAngle, vAngle);
                float range = PerformRaycast(direction);

                if (index < ranges.Count)
                {
                    ranges[index] = range;
                }

                if (visualizeRays)
                {
                    VisualizeRay(transform.position, direction, range);
                }

                index++;
            }
        }
    }

    Vector3 CalculateRayDirection(float hAngle, float vAngle)
    {
        // Convert spherical coordinates to Cartesian
        float x = Mathf.Cos(vAngle) * Mathf.Sin(hAngle);
        float y = Mathf.Sin(vAngle);
        float z = Mathf.Cos(vAngle) * Mathf.Cos(hAngle);

        return new Vector3(x, z, y);
    }

    float PerformRaycast(Vector3 direction)
    {
        RaycastHit hit;
        Vector3 origin = transform.position;
        Vector3 end = origin + direction * rangeMax;

        if (Physics.Raycast(origin, direction, out hit, rangeMax, detectionLayers))
        {
            return hit.distance;
        }

        return rangeMax;
    }

    void VisualizeRay(Vector3 origin, Vector3 direction, float distance)
    {
        Vector3 end = origin + direction * distance;
        Color color = distance < rangeMax ? Color.red : Color.green;

        Debug.DrawRay(origin, direction * distance, color, rayVisualizationDuration);
    }

    // Method to get simulated scan data
    public List<float> GetScanData()
    {
        return new List<float>(ranges);
    }
}
```

### Processing LiDAR Data

Once we have simulated LiDAR data, we can process it for various applications:

```csharp
using UnityEngine;
using System.Collections.Generic;
using System.Linq;

public class LidarProcessor : MonoBehaviour
{
    public LidarSimulator lidarSimulator;

    [Header("Processing Parameters")]
    public float minObstacleDistance = 0.5f;
    public float obstacleThreshold = 0.8f; // 80% of max range

    void Update()
    {
        ProcessLidarData();
    }

    void ProcessLidarData()
    {
        List<float> scanData = lidarSimulator.GetScanData();

        // Detect obstacles
        var obstacles = DetectObstacles(scanData);

        // Generate occupancy grid
        var occupancyGrid = GenerateOccupancyGrid(scanData);

        // Perform clustering for object detection
        var clusters = ClusterObstacles(scanData);
    }

    List<int> DetectObstacles(List<float> scanData)
    {
        List<int> obstacleIndices = new List<int>();

        for (int i = 0; i < scanData.Count; i++)
        {
            if (scanData[i] < minObstacleDistance ||
                scanData[i] < lidarSimulator.rangeMax * obstacleThreshold)
            {
                obstacleIndices.Add(i);
            }
        }

        return obstacleIndices;
    }

    float[,] GenerateOccupancyGrid(List<float> scanData)
    {
        // Simplified 2D occupancy grid generation
        int gridSize = 100; // 100x100 grid
        float[,] grid = new float[gridSize, gridSize];

        // Convert polar coordinates to grid coordinates
        float cellSize = lidarSimulator.rangeMax / (gridSize / 2);

        for (int i = 0; i < scanData.Count; i++)
        {
            float angle = lidarSimulator.minAngle +
                         i * (lidarSimulator.maxAngle - lidarSimulator.minAngle) / scanData.Count;
            float range = scanData[i];

            if (range < lidarSimulator.rangeMax * 0.95f)
            {
                // Calculate grid position
                int x = Mathf.RoundToInt(range * Mathf.Cos(angle) / cellSize) + gridSize / 2;
                int y = Mathf.RoundToInt(range * Mathf.Sin(angle) / cellSize) + gridSize / 2;

                if (x >= 0 && x < gridSize && y >= 0 && y < gridSize)
                {
                    grid[x, y] = 1.0f; // Occupied
                }
            }
        }

        return grid;
    }

    List<List<int>> ClusterObstacles(List<float> scanData)
    {
        List<List<int>> clusters = new List<List<int>>();
        List<bool> processed = new List<bool>(new bool[scanData.Count]);

        for (int i = 0; i < scanData.Count; i++)
        {
            if (!processed[i] && scanData[i] < lidarSimulator.rangeMax * obstacleThreshold)
            {
                List<int> cluster = new List<int>();
                Queue<int> queue = new Queue<int>();
                queue.Enqueue(i);

                while (queue.Count > 0)
                {
                    int currentIndex = queue.Dequeue();

                    if (processed[currentIndex]) continue;
                    processed[currentIndex] = true;
                    cluster.Add(currentIndex);

                    // Check adjacent points
                    for (int j = -1; j <= 1; j++)
                    {
                        int neighborIndex = (currentIndex + j + scanData.Count) % scanData.Count;

                        if (!processed[neighborIndex] &&
                            scanData[neighborIndex] < lidarSimulator.rangeMax * obstacleThreshold)
                        {
                            queue.Enqueue(neighborIndex);
                        }
                    }
                }

                if (cluster.Count > 2) // Minimum cluster size
                {
                    clusters.Add(cluster);
                }
            }
        }

        return clusters;
    }
}
```

## Depth Camera Simulation with Examples

### Understanding Depth Camera Simulation

Depth cameras provide 3D information about the environment, essential for tasks like object recognition, manipulation, and SLAM. In simulation, we generate depth maps by calculating distances from the camera to surfaces in the scene.

### Gazebo Depth Camera Simulation

Gazebo provides depth camera simulation through the `depth_camera` sensor:

```xml
<sensor name="depth_camera" type="depth">
  <camera>
    <horizontal_fov>1.047</horizontal_fov>
    <image>
      <width>640</width>
      <height>480</height>
      <format>R8G8B8</format>
    </image>
    <clip>
      <near>0.1</near>
      <far>10.0</far>
    </clip>
  </camera>
  <plugin name="camera_controller" filename="libgazebo_ros_openni_kinect.so">
    <alwaysOn>true</alwaysOn>
    <updateRate>30.0</updateRate>
    <cameraName>kinect2</cameraName>
    <imageTopicName>/rgb/image_raw</imageTopicName>
    <depthImageTopicName>/depth/image_raw</depthImageTopicName>
    <pointCloudTopicName>/depth/points</pointCloudTopicName>
    <cameraInfoTopicName>/rgb/camera_info</cameraInfoTopicName>
    <depthImageCameraInfoTopicName>/depth/camera_info</depthImageCameraInfoTopicName>
    <frameName>kinect2_depth_optical_frame</frameName>
    <baseline>0.1</baseline>
    <distortion_k1>0.0</distortion_k1>
    <distortion_k2>0.0</distortion_k2>
    <distortion_k3>0.0</distortion_k3>
    <distortion_t1>0.0</distortion_t1>
    <distortion_t2>0.0</distortion_t2>
    <pointCloudCutoff>0.3</pointCloudCutoff>
    <pointCloudCutoffMax>8.0</pointCloudCutoffMax>
    <CxPrime>0.0</CxPrime>
    <Cx>320.0</Cx>
    <Cy>240.0</Cy>
    <focalLength>525.0</focalLength>
    <hackBaseline>0.0</hackBaseline>
  </plugin>
</sensor>
```

### Unity Depth Camera Simulation

In Unity, we can simulate depth cameras using custom shaders and render textures:

```csharp
using UnityEngine;
using System.Collections;

public class DepthCameraSimulator : MonoBehaviour
{
    [Header("Camera Configuration")]
    public Camera depthCamera;
    public RenderTexture depthTexture;

    [Header("Depth Parameters")]
    public float nearClip = 0.1f;
    public float farClip = 10.0f;
    public int width = 640;
    public int height = 480;

    [Header("Processing")]
    public bool generatePointCloud = true;
    public float pointCloudResolution = 0.05f;

    private Material depthMaterial;
    private ComputeBuffer pointCloudBuffer;

    void Start()
    {
        SetupDepthCamera();
        CreateDepthMaterial();
    }

    void SetupDepthCamera()
    {
        if (depthCamera == null)
        {
            depthCamera = GetComponent<Camera>();
        }

        // Create render texture for depth data
        depthTexture = new RenderTexture(width, height, 24, RenderTextureFormat.Depth);
        depthTexture.Create();

        depthCamera.targetTexture = depthTexture;
        depthCamera.nearClipPlane = nearClip;
        depthCamera.farClipPlane = farClip;
    }

    void CreateDepthMaterial()
    {
        // Create a material that can extract depth information
        Shader depthShader = Shader.Find("Hidden/DepthExtraction");
        if (depthShader != null)
        {
            depthMaterial = new Material(depthShader);
        }
    }

    void Update()
    {
        if (generatePointCloud)
        {
            GeneratePointCloud();
        }
    }

    void GeneratePointCloud()
    {
        // Extract depth information and convert to point cloud
        // This is a simplified approach - in practice, you'd use compute shaders
        // for more efficient processing

        RenderTexture currentRT = RenderTexture.active;
        RenderTexture.active = depthTexture;

        Texture2D depthTex = new Texture2D(width, height, TextureFormat.RGB24, false);
        depthTex.ReadPixels(new Rect(0, 0, width, height), 0, 0);
        depthTex.Apply();

        RenderTexture.active = currentRT;

        // Process depth texture to generate point cloud
        ProcessDepthTexture(depthTex);

        DestroyImmediate(depthTex);
    }

    void ProcessDepthTexture(Texture2D depthTexture)
    {
        // Convert depth texture to 3D points
        for (int y = 0; y < height; y += (int)(1.0f / pointCloudResolution))
        {
            for (int x = 0; x < width; x += (int)(1.0f / pointCloudResolution))
            {
                Color depthPixel = depthTexture.GetPixel(x, y);

                // Convert pixel value to depth (this is a simplified conversion)
                float depthValue = depthPixel.r; // In a real implementation, this would be more complex

                // Convert screen coordinates to world coordinates
                Vector3 screenPoint = new Vector3(x, y, depthValue);
                Vector3 worldPoint = depthCamera.ScreenToWorldPoint(screenPoint);

                // Process the 3D point as needed
                ProcessPoint(worldPoint);
            }
        }
    }

    void ProcessPoint(Vector3 point)
    {
        // Handle individual point processing
        // This could involve storing in a buffer, sending to ROS, etc.
    }

    void OnDestroy()
    {
        if (depthTexture != null)
        {
            depthTexture.Release();
        }

        if (depthMaterial != null)
        {
            DestroyImmediate(depthMaterial);
        }

        if (pointCloudBuffer != null)
        {
            pointCloudBuffer.Release();
        }
    }
}
```

### Computer Vision Pipeline with Depth Data

Using depth camera data, we can build computer vision pipelines:

```csharp
using UnityEngine;
using System.Collections.Generic;

public class DepthVisionPipeline : MonoBehaviour
{
    public DepthCameraSimulator depthCamera;

    [Header("Vision Parameters")]
    public float objectDetectionThreshold = 0.1f;
    public float planeDetectionThreshold = 0.01f;
    public int minClusterSize = 10;

    private List<Vector3> pointCloud;
    private List<GameObject> detectedObjects;

    void Start()
    {
        pointCloud = new List<Vector3>();
        detectedObjects = new List<GameObject>();
    }

    void Update()
    {
        ProcessVisionPipeline();
    }

    void ProcessVisionPipeline()
    {
        // Get depth data
        pointCloud = GetPointCloudFromDepth();

        // Detect planes (floors, walls, tables)
        var planes = DetectPlanes(pointCloud);

        // Detect objects
        var objects = DetectObjects(pointCloud, planes);

        // Track objects
        TrackObjects(objects);
    }

    List<Vector3> GetPointCloudFromDepth()
    {
        // This would normally come from the depth camera simulation
        // For this example, we'll return an empty list
        return new List<Vector3>();
    }

    List<Plane> DetectPlanes(List<Vector3> points)
    {
        List<Plane> detectedPlanes = new List<Plane>();

        // Use RANSAC algorithm to detect planes
        for (int i = 0; i < 10; i++) // Multiple iterations for robust detection
        {
            Plane bestPlane = FindBestPlane(points);
            if (bestPlane.normal.magnitude > 0.1f) // Valid plane found
            {
                detectedPlanes.Add(bestPlane);

                // Remove inlier points to find next plane
                points.RemoveAll(p => Mathf.Abs(bestPlane.GetDistanceToPoint(p)) < planeDetectionThreshold);
            }
        }

        return detectedPlanes;
    }

    List<List<Vector3>> DetectObjects(List<Vector3> points, List<Plane> planes)
    {
        // Remove plane points from consideration for object detection
        List<Vector3> nonPlanePoints = new List<Vector3>(points);

        foreach (Plane plane in planes)
        {
            nonPlanePoints.RemoveAll(p => Mathf.Abs(plane.GetDistanceToPoint(p)) < planeDetectionThreshold);
        }

        // Cluster remaining points to find objects
        return ClusterPoints(nonPlanePoints);
    }

    Plane FindBestPlane(List<Vector3> points)
    {
        if (points.Count < 3) return new Plane();

        // Simple plane fitting using random sampling
        // In practice, use RANSAC for robust estimation
        Vector3 p1 = points[Random.Range(0, points.Count)];
        Vector3 p2 = points[Random.Range(0, points.Count)];
        Vector3 p3 = points[Random.Range(0, points.Count)];

        Vector3 normal = Vector3.Cross(p2 - p1, p3 - p1).normalized;
        return new Plane(normal, p1);
    }

    List<List<Vector3>> ClusterPoints(List<Vector3> points)
    {
        List<List<Vector3>> clusters = new List<List<Vector3>>();
        List<bool> assigned = new List<bool>(new bool[points.Count]);

        for (int i = 0; i < points.Count; i++)
        {
            if (!assigned[i])
            {
                List<Vector3> cluster = new List<Vector3>();
                Queue<int> queue = new Queue<int>();
                queue.Enqueue(i);

                while (queue.Count > 0)
                {
                    int currentIndex = queue.Dequeue();

                    if (assigned[currentIndex]) continue;
                    assigned[currentIndex] = true;
                    cluster.Add(points[currentIndex]);

                    // Find nearby points
                    for (int j = 0; j < points.Count; j++)
                    {
                        if (!assigned[j] && Vector3.Distance(points[currentIndex], points[j]) < objectDetectionThreshold)
                        {
                            queue.Enqueue(j);
                        }
                    }
                }

                if (cluster.Count >= minClusterSize)
                {
                    clusters.Add(cluster);
                }
            }
        }

        return clusters;
    }

    void TrackObjects(List<List<Vector3>> objects)
    {
        // Implement object tracking logic
        // This could involve associating detections with existing tracked objects
    }
}
```

## IMU Simulation with Examples

### Understanding IMU Simulation

IMU (Inertial Measurement Unit) sensors measure orientation, angular velocity, and linear acceleration. In simulation, we model these measurements by tracking the robot's motion and adding realistic noise models.

### Gazebo IMU Simulation

Gazebo provides IMU simulation through the `imu` sensor plugin:

```xml
<sensor name="imu_sensor" type="imu">
  <always_on>true</always_on>
  <update_rate>100</update_rate>
  <imu>
    <angular_velocity>
      <x>
        <noise type="gaussian">
          <mean>0.0</mean>
          <stddev>2e-4</stddev>
          <bias_mean>0.1</bias_mean>
          <bias_stddev>0.0003</bias_stddev>
        </noise>
      </x>
      <y>
        <noise type="gaussian">
          <mean>0.0</mean>
          <stddev>2e-4</stddev>
          <bias_mean>0.1</bias_mean>
          <bias_stddev>0.0003</bias_stddev>
        </noise>
      </y>
      <z>
        <noise type="gaussian">
          <mean>0.0</mean>
          <stddev>2e-4</stddev>
          <bias_mean>0.1</bias_mean>
          <bias_stddev>0.0003</bias_stddev>
        </noise>
      </z>
    </angular_velocity>
    <linear_acceleration>
      <x>
        <noise type="gaussian">
          <mean>0.0</mean>
          <stddev>1.7e-2</stddev>
          <bias_mean>0.1</bias_mean>
          <bias_stddev>0.001</bias_stddev>
        </noise>
      </x>
      <y>
        <noise type="gaussian">
          <mean>0.0</mean>
          <stddev>1.7e-2</stddev>
          <bias_mean>0.1</bias_mean>
          <bias_stddev>0.001</bias_stddev>
        </noise>
      </y>
      <z>
        <noise type="gaussian">
          <mean>0.0</mean>
          <stddev>1.7e-2</stddev>
          <bias_mean>0.1</bias_mean>
          <bias_stddev>0.001</bias_stddev>
        </noise>
      </z>
    </linear_acceleration>
  </imu>
  <plugin name="imu_plugin" filename="libgazebo_ros_imu.so">
    <ros>
      <namespace>/imu</namespace>
      <remapping>~/out:=data</remapping>
    </ros>
    <frame_name>imu_frame</frame_name>
    <body_name>base_link</body_name>
    <update_rate>100</update_rate>
  </plugin>
</sensor>
```

### Unity IMU Simulation

In Unity, we can simulate IMU data using the physics engine:

```csharp
using UnityEngine;
using System.Collections;

public class ImuSimulator : MonoBehaviour
{
    [Header("IMU Configuration")]
    public float updateRate = 100.0f; // Hz
    public float noiseLevel = 0.001f;

    [Header("Noise Parameters")]
    public float gyroNoiseStdDev = 0.001f;
    public float accelNoiseStdDev = 0.01f;
    public float gyroBias = 0.0001f;
    public float accelBias = 0.001f;

    [Header("Output")]
    public bool publishImuData = true;

    private Rigidbody rb;
    private float updateInterval;
    private float lastUpdateTime;

    // IMU readings
    private Vector3 angularVelocity;
    private Vector3 linearAcceleration;
    private Quaternion orientation;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
        if (rb == null)
        {
            rb = gameObject.AddComponent<Rigidbody>();
            rb.useGravity = false;
            rb.isKinematic = true; // We'll control motion externally
        }

        updateInterval = 1.0f / updateRate;
        lastUpdateTime = Time.time;

        // Initialize IMU readings
        angularVelocity = Vector3.zero;
        linearAcceleration = Vector3.zero;
        orientation = transform.rotation;
    }

    void FixedUpdate()
    {
        UpdateImuReadings();

        if (publishImuData)
        {
            PublishImuData();
        }
    }

    void UpdateImuReadings()
    {
        float deltaTime = Time.fixedDeltaTime;

        // Calculate angular velocity (rad/s)
        Quaternion deltaRotation = transform.rotation * Quaternion.Inverse(orientation);
        Vector3 deltaAngle = new Vector3(
            Mathf.Atan2(2 * (deltaRotation.x * deltaRotation.w - deltaRotation.y * deltaRotation.z),
                       1 - 2 * (deltaRotation.x * deltaRotation.x + deltaRotation.z * deltaRotation.z)),
            Mathf.Atan2(2 * (deltaRotation.y * deltaRotation.w + deltaRotation.x * deltaRotation.z),
                       1 - 2 * (deltaRotation.y * deltaRotation.y + deltaRotation.z * deltaRotation.z)),
            Mathf.Atan2(2 * (deltaRotation.z * deltaRotation.w - deltaRotation.x * deltaRotation.y),
                       1 - 2 * (deltaRotation.x * deltaRotation.x + deltaRotation.y * deltaRotation.y))
        );

        angularVelocity = deltaAngle / deltaTime;

        // Calculate linear acceleration (m/s^2)
        Vector3 currentVelocity = rb.velocity;
        Vector3 previousVelocity = rb.velocity; // This would be stored from previous frame

        // For this example, we'll approximate acceleration
        Vector3 gravity = Physics.gravity;
        Vector3 netAcceleration = (currentVelocity - previousVelocity) / deltaTime + gravity;

        // Apply noise and bias to simulate real IMU
        angularVelocity = ApplyGyroNoise(angularVelocity);
        linearAcceleration = ApplyAccelNoise(netAcceleration);

        // Update orientation
        orientation = transform.rotation;
    }

    Vector3 ApplyGyroNoise(Vector3 rawAngularVelocity)
    {
        Vector3 noise = new Vector3(
            RandomGaussian() * gyroNoiseStdDev,
            RandomGaussian() * gyroNoiseStdDev,
            RandomGaussian() * gyroNoiseStdDev
        );

        Vector3 bias = new Vector3(
            Random.Range(-gyroBias, gyroBias),
            Random.Range(-gyroBias, gyroBias),
            Random.Range(-gyroBias, gyroBias)
        );

        return rawAngularVelocity + noise + bias;
    }

    Vector3 ApplyAccelNoise(Vector3 rawAcceleration)
    {
        Vector3 noise = new Vector3(
            RandomGaussian() * accelNoiseStdDev,
            RandomGaussian() * accelNoiseStdDev,
            RandomGaussian() * accelNoiseStdDev
        );

        Vector3 bias = new Vector3(
            Random.Range(-accelBias, accelBias),
            Random.Range(-accelBias, accelBias),
            Random.Range(-accelBias, accelBias)
        );

        return rawAcceleration + noise + bias;
    }

    float RandomGaussian()
    {
        // Box-Muller transform for Gaussian random numbers
        float u1 = Random.value;
        float u2 = Random.value;

        if (u1 < 1e-6f) u1 = 1e-6f; // Avoid log(0)

        return Mathf.Sqrt(-2.0f * Mathf.Log(u1)) * Mathf.Cos(2.0f * Mathf.PI * u2);
    }

    void PublishImuData()
    {
        // In a real implementation, this would publish to ROS or another system
        Debug.Log($"IMU Data - Angular Vel: {angularVelocity}, Accel: {linearAcceleration}, Orient: {orientation}");
    }

    // Accessor methods for other components
    public Vector3 GetAngularVelocity()
    {
        return angularVelocity;
    }

    public Vector3 GetLinearAcceleration()
    {
        return linearAcceleration;
    }

    public Quaternion GetOrientation()
    {
        return orientation;
    }

    public Vector3 GetRawAngularVelocity()
    {
        return angularVelocity - GetGyroBias();
    }

    public Vector3 GetRawLinearAcceleration()
    {
        return linearAcceleration - GetAccelBias();
    }

    Vector3 GetGyroBias()
    {
        return new Vector3(
            Random.Range(-gyroBias, gyroBias),
            Random.Range(-gyroBias, gyroBias),
            Random.Range(-gyroBias, gyroBias)
        );
    }

    Vector3 GetAccelBias()
    {
        return new Vector3(
            Random.Range(-accelBias, accelBias),
            Random.Range(-accelBias, accelBias),
            Random.Range(-accelBias, accelBias)
        );
    }
}
```

### IMU-Based Pose Estimation

Using IMU data for pose estimation in humanoid robots:

```csharp
using UnityEngine;
using System.Collections.Generic;

public class ImuPoseEstimator : MonoBehaviour
{
    public ImuSimulator imuSimulator;

    [Header("Pose Estimation")]
    public float integrationDt = 0.01f; // Integration timestep

    [Header("Kalman Filter Parameters")]
    public float processNoise = 0.1f;
    public float measurementNoise = 0.01f;

    private Vector3 estimatedPosition;
    private Vector3 estimatedVelocity;
    private Quaternion estimatedOrientation;
    private Vector3 estimatedAngularVelocity;

    // For Kalman filter
    private Matrix4x4 stateCovariance;
    private Matrix4x4 processCovariance;
    private Matrix4x4 measurementCovariance;

    void Start()
    {
        InitializeEstimator();
    }

    void Update()
    {
        EstimatePose();
    }

    void InitializeEstimator()
    {
        estimatedPosition = transform.position;
        estimatedVelocity = Vector3.zero;
        estimatedOrientation = transform.rotation;
        estimatedAngularVelocity = Vector3.zero;

        // Initialize covariance matrices (simplified)
        stateCovariance = Matrix4x4.identity * 0.1f;
        processCovariance = Matrix4x4.identity * processNoise;
        measurementCovariance = Matrix4x4.identity * measurementNoise;
    }

    void EstimatePose()
    {
        // Get IMU measurements
        Vector3 measuredAccel = imuSimulator.GetLinearAcceleration();
        Vector3 measuredAngVel = imuSimulator.GetAngularVelocity();

        // Integrate angular velocity to get orientation
        Vector3 integratedOmega = measuredAngVel * integrationDt;
        Quaternion deltaRotation = new Quaternion(integratedOmega.x, integratedOmega.y, integratedOmega.z, 0);
        deltaRotation *= 0.5f; // For quaternion integration

        Quaternion newOrientation = estimatedOrientation;
        newOrientation.x += deltaRotation.x;
        newOrientation.y += deltaRotation.y;
        newOrientation.z += deltaRotation.z;
        newOrientation.w += deltaRotation.w;
        newOrientation.Normalize();

        // Transform acceleration to global frame
        Vector3 globalAccel = newOrientation * measuredAccel;

        // Integrate acceleration to get velocity and position
        estimatedVelocity += globalAccel * integrationDt;
        estimatedPosition += estimatedVelocity * integrationDt;

        // Update orientation estimate
        estimatedOrientation = newOrientation;

        // Apply Kalman filter correction (simplified)
        CorrectEstimate(measuredAccel, measuredAngVel);
    }

    void CorrectEstimate(Vector3 measuredAccel, Vector3 measuredAngVel)
    {
        // In a real implementation, this would perform full Kalman filter steps
        // For this example, we'll apply simple corrections

        // Use measured angular velocity to correct orientation estimate
        estimatedAngularVelocity = measuredAngVel;

        // Apply gravity compensation to acceleration
        Vector3 gravityVector = estimatedOrientation * new Vector3(0, -9.81f, 0);
        Vector3 correctedAccel = measuredAccel - gravityVector;

        // Update position and velocity with corrected acceleration
        estimatedVelocity += correctedAccel * integrationDt;
        estimatedPosition += estimatedVelocity * integrationDt;
    }

    // Accessor methods
    public Vector3 GetEstimatedPosition()
    {
        return estimatedPosition;
    }

    public Vector3 GetEstimatedVelocity()
    {
        return estimatedVelocity;
    }

    public Quaternion GetEstimatedOrientation()
    {
        return estimatedOrientation;
    }

    public Vector3 GetEstimatedAngularVelocity()
    {
        return estimatedAngularVelocity;
    }

    void OnDrawGizmos()
    {
        // Visualize estimated pose
        Gizmos.color = Color.blue;
        Gizmos.DrawWireCube(estimatedPosition, Vector3.one * 0.2f);

        // Draw orientation axes
        Vector3 forward = estimatedOrientation * Vector3.forward;
        Vector3 right = estimatedOrientation * Vector3.right;
        Vector3 up = estimatedOrientation * Vector3.up;

        Gizmos.color = Color.green;
        Gizmos.DrawLine(estimatedPosition, estimatedPosition + forward * 0.5f);
        Gizmos.color = Color.red;
        Gizmos.DrawLine(estimatedPosition, estimatedPosition + right * 0.5f);
        Gizmos.color = Color.blue;
        Gizmos.DrawLine(estimatedPosition, estimatedPosition + up * 0.5f);
    }
}
```

## Perception Pipeline Development

### Building End-to-End Perception Systems

Creating a complete perception pipeline that integrates multiple sensor modalities:

```csharp
using UnityEngine;
using System.Collections.Generic;

public class PerceptionPipeline : MonoBehaviour
{
    [Header("Sensor Components")]
    public LidarSimulator lidar;
    public DepthCameraSimulator depthCamera;
    public ImuSimulator imu;

    [Header("Pipeline Configuration")]
    public float pipelineUpdateRate = 30.0f;
    public bool enableObjectDetection = true;
    public bool enableLocalization = true;
    public bool enableMapping = true;

    private float updateInterval;
    private float lastUpdate;

    // Internal components
    private LidarProcessor lidarProcessor;
    private DepthVisionPipeline visionPipeline;
    private ImuPoseEstimator poseEstimator;

    void Start()
    {
        InitializePipeline();
    }

    void Update()
    {
        if (Time.time - lastUpdate >= updateInterval)
        {
            ProcessPerceptionPipeline();
            lastUpdate = Time.time;
        }
    }

    void InitializePipeline()
    {
        updateInterval = 1.0f / pipelineUpdateRate;

        // Initialize processing components
        lidarProcessor = GetComponent<LidarProcessor>() ?? gameObject.AddComponent<LidarProcessor>();
        lidarProcessor.lidarSimulator = lidar;

        visionPipeline = GetComponent<DepthVisionPipeline>() ?? gameObject.AddComponent<DepthVisionPipeline>();
        visionPipeline.depthCamera = depthCamera;

        poseEstimator = GetComponent<ImuPoseEstimator>() ?? gameObject.AddComponent<ImuPoseEstimator>();
        poseEstimator.imuSimulator = imu;

        lastUpdate = Time.time;
    }

    void ProcessPerceptionPipeline()
    {
        // Step 1: Acquire sensor data
        AcquireSensorData();

        // Step 2: Preprocess data
        PreprocessSensorData();

        // Step 3: Run perception algorithms
        RunPerceptionAlgorithms();

        // Step 4: Fuse sensor data
        FuseSensorData();

        // Step 5: Update world model
        UpdateWorldModel();

        // Step 6: Publish results
        PublishResults();
    }

    void AcquireSensorData()
    {
        // Data acquisition happens automatically through sensor simulators
        // Just ensure they're properly configured
    }

    void PreprocessSensorData()
    {
        // Apply calibration, noise reduction, etc.
        // This would typically involve:
        // - Sensor calibration corrections
        // - Noise filtering
        // - Data synchronization
    }

    void RunPerceptionAlgorithms()
    {
        if (enableObjectDetection)
        {
            // Run object detection using lidar and vision data
            var lidarObjects = lidarProcessor.DetectObstacles(lidar.GetScanData());
            var visionObjects = visionPipeline.ProcessVisionPipeline();

            // Fuse object detections
            var fusedObjects = FuseObjectDetections(lidarObjects, visionObjects);
        }

        if (enableLocalization)
        {
            // Update pose estimate using IMU and sensor data
            poseEstimator.EstimatePose();
        }

        if (enableMapping)
        {
            // Update map using sensor data
            UpdateMap();
        }
    }

    List<object> FuseObjectDetections(List<int> lidarObjects, List<List<Vector3>> visionObjects)
    {
        // Implement sensor fusion for object detection
        // This is a placeholder - actual implementation would be complex
        return new List<object>();
    }

    void UpdateMap()
    {
        // Update occupancy grid or other map representation
        var occupancyGrid = lidarProcessor.GenerateOccupancyGrid(lidar.GetScanData());
    }

    void FuseSensorData()
    {
        // Implement sensor fusion between different modalities
        // This could use Kalman filters, particle filters, or other techniques
    }

    void UpdateWorldModel()
    {
        // Update internal representation of the world
        // This could be a scene graph, octree, or other spatial data structure
    }

    void PublishResults()
    {
        // Publish perception results to other systems
        // In a real system, this might be ROS topics, shared memory, etc.
    }
}
```

## Simulation-to-Reality Transfer

### Bridging the Reality Gap

Simulation-to-reality transfer (sim-to-real) is crucial for deploying perception systems developed in simulation to real robots. The reality gap refers to the differences between simulated and real sensor data that can cause algorithms trained in simulation to fail when deployed on real robots.

### Domain Randomization

Domain randomization involves varying simulation parameters to make algorithms more robust:

```csharp
using UnityEngine;
using System.Collections.Generic;

public class DomainRandomizer : MonoBehaviour
{
    [Header("Randomization Parameters")]
    public bool enableRandomization = true;
    public float randomizationFrequency = 0.1f; // Percents of runs with randomization

    [Header("LiDAR Randomization")]
    public float rangeNoise = 0.05f;
    public float resolutionVariation = 0.1f;
    public float fovVariation = 0.05f;

    [Header("Camera Randomization")]
    public float exposureVariation = 0.2f;
    public float colorTemperatureVariation = 1000f;
    public float lensDistortionRange = 0.1f;

    [Header("Environment Randomization")]
    public List<Material> surfaceMaterials;
    public List<Color> lightingColors;
    public List<float> lightingIntensities;

    private float lastRandomizationTime;
    private bool isRandomized = false;

    void Start()
    {
        lastRandomizationTime = Time.time;
    }

    void Update()
    {
        if (enableRandomization &&
            Time.time - lastRandomizationTime > 1.0f / randomizationFrequency)
        {
            ApplyRandomization();
            lastRandomizationTime = Time.time;
        }
    }

    void ApplyRandomization()
    {
        if (Random.value < randomizationFrequency)
        {
            RandomizeEnvironment();
            RandomizeSensors();
            isRandomized = true;
        }
        else
        {
            ResetToNominal();
            isRandomized = false;
        }
    }

    void RandomizeEnvironment()
    {
        // Randomize lighting conditions
        if (lightingColors.Count > 0)
        {
            RenderSettings.ambientLight = lightingColors[Random.Range(0, lightingColors.Count)];
        }

        if (lightingIntensities.Count > 0)
        {
            float intensity = lightingIntensities[Random.Range(0, lightingIntensities.Count)];
            Light[] lights = FindObjectsOfType<Light>();
            foreach (Light light in lights)
            {
                light.intensity = intensity;
            }
        }

        // Randomize surface materials
        Renderer[] renderers = FindObjectsOfType<Renderer>();
        foreach (Renderer renderer in renderers)
        {
            if (surfaceMaterials.Count > 0)
            {
                Material randomMaterial = surfaceMaterials[Random.Range(0, surfaceMaterials.Count)];
                renderer.material = randomMaterial;
            }
        }
    }

    void RandomizeSensors()
    {
        // Apply randomization to sensors
        LidarSimulator lidar = FindObjectOfType<LidarSimulator>();
        if (lidar != null)
        {
            // Randomize LiDAR parameters
            lidar.rangeMax *= (1.0f + Random.Range(-rangeNoise, rangeNoise));
            lidar.horizontalSamples = Mathf.RoundToInt(
                lidar.horizontalSamples * (1.0f + Random.Range(-resolutionVariation, resolutionVariation)));
        }

        DepthCameraSimulator depthCam = FindObjectOfType<DepthCameraSimulator>();
        if (depthCam != null)
        {
            // Randomize camera parameters
            depthCam.nearClip *= (1.0f + Random.Range(-exposureVariation, exposureVariation));
            depthCam.farClip *= (1.0f + Random.Range(-exposureVariation, exposureVariation));
        }
    }

    void ResetToNominal()
    {
        // Reset environment to nominal conditions
        RenderSettings.ambientLight = Color.gray;

        Light[] lights = FindObjectsOfType<Light>();
        foreach (Light light in lights)
        {
            light.intensity = 1.0f;
        }

        // Reset materials to default
        Renderer[] renderers = FindObjectsOfType<Renderer>();
        foreach (Renderer renderer in renderers)
        {
            renderer.material = Resources.Load<Material>("DefaultMaterial");
        }
    }

    public bool IsCurrentlyRandomized()
    {
        return isRandomized;
    }
}
```

### Adversarial Training Techniques

Implementing adversarial techniques to improve sim-to-real transfer:

```csharp
using UnityEngine;
using System.Collections.Generic;

public class AdversarialTrainingHelper : MonoBehaviour
{
    [Header("Adversarial Training")]
    public bool enableAdversarialTraining = true;
    public float adversarialUpdateRate = 10.0f;
    public float perturbationMagnitude = 0.01f;

    [Header("Perturbation Types")]
    public bool perturbLidar = true;
    public bool perturbCamera = true;
    public bool perturbImu = true;

    private float lastAdversarialUpdate;
    private System.Random randomGenerator;

    void Start()
    {
        randomGenerator = new System.Random();
        lastAdversarialUpdate = Time.time;
    }

    void Update()
    {
        if (enableAdversarialTraining &&
            Time.time - lastAdversarialUpdate > 1.0f / adversarialUpdateRate)
        {
            ApplyAdversarialPerturbations();
            lastAdversarialUpdate = Time.time;
        }
    }

    void ApplyAdversarialPerturbations()
    {
        if (perturbLidar)
        {
            PerturbLidarData();
        }

        if (perturbCamera)
        {
            PerturbCameraData();
        }

        if (perturbImu)
        {
            PerturbImuData();
        }
    }

    void PerturbLidarData()
    {
        LidarSimulator lidar = FindObjectOfType<LidarSimulator>();
        if (lidar != null)
        {
            List<float> scanData = lidar.GetScanData();

            for (int i = 0; i < scanData.Count; i++)
            {
                // Add small perturbations to make algorithm more robust
                float perturbation = Random.Range(-perturbationMagnitude, perturbationMagnitude);
                scanData[i] += perturbation;

                // Ensure values stay within valid range
                scanData[i] = Mathf.Clamp(scanData[i], lidar.rangeMin, lidar.rangeMax);
            }
        }
    }

    void PerturbCameraData()
    {
        DepthCameraSimulator depthCam = FindObjectOfType<DepthCameraSimulator>();
        if (depthCam != null)
        {
            // Add noise to depth data
            // This would typically involve modifying the depth texture or render buffer
            // For this example, we'll just log that perturbation would occur
            Debug.Log("Applying camera data perturbations");
        }
    }

    void PerturbImuData()
    {
        ImuSimulator imu = FindObjectOfType<ImuSimulator>();
        if (imu != null)
        {
            // Add adversarial noise to IMU readings
            // This makes the pose estimation algorithm more robust to sensor variations
            Debug.Log("Applying IMU data perturbations");
        }
    }

    // Methods for curriculum learning
    public void IncreaseDifficulty()
    {
        perturbationMagnitude *= 1.1f;
        adversarialUpdateRate *= 1.05f;
    }

    public void DecreaseDifficulty()
    {
        perturbationMagnitude *= 0.9f;
        adversarialUpdateRate *= 0.95f;
    }
}
```

## Complete Sensor Simulation Examples for Robotics

Here's a complete example showing how to integrate all sensor simulations:

```csharp
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class CompleteSensorSimulation : MonoBehaviour
{
    [Header("Sensor Simulation")]
    public LidarSimulator lidarSim;
    public DepthCameraSimulator depthCamSim;
    public ImuSimulator imuSim;

    [Header("Robot Configuration")]
    public Transform robotRoot;
    public List<Transform> jointTransforms;
    public List<string> jointNames;

    [Header("Simulation Control")]
    public bool enablePhysicsSimulation = true;
    public float simulationSpeed = 1.0f;
    public bool recordData = false;

    private List<SensorDataSnapshot> recordedData;
    private bool isRecording = false;

    [System.Serializable]
    public class SensorDataSnapshot
    {
        public float timestamp;
        public List<float> lidarData;
        public Vector3 imuAngularVelocity;
        public Vector3 imuLinearAcceleration;
        public Quaternion imuOrientation;
        public List<Vector3> jointPositions;
        public List<Vector3> jointVelocities;
    }

    void Start()
    {
        InitializeSensors();
        recordedData = new List<SensorDataSnapshot>();
    }

    void Update()
    {
        if (recordData && !isRecording)
        {
            StartRecording();
        }

        if (isRecording)
        {
            RecordDataSnapshot();
        }
    }

    void InitializeSensors()
    {
        // Initialize all sensor simulators
        if (lidarSim == null)
        {
            lidarSim = FindObjectOfType<LidarSimulator>();
        }

        if (depthCamSim == null)
        {
            depthCamSim = FindObjectOfType<DepthCameraSimulator>();
        }

        if (imuSim == null)
        {
            imuSim = FindObjectOfType<ImuSimulator>();
        }
    }

    public void StartRecording()
    {
        isRecording = true;
        recordedData.Clear();
        Debug.Log("Started sensor data recording");
    }

    public void StopRecording()
    {
        isRecording = false;
        Debug.Log($"Stopped recording. Collected {recordedData.Count} snapshots");
    }

    void RecordDataSnapshot()
    {
        SensorDataSnapshot snapshot = new SensorDataSnapshot();
        snapshot.timestamp = Time.time;

        // Record LiDAR data
        if (lidarSim != null)
        {
            snapshot.lidarData = new List<float>(lidarSim.GetScanData());
        }

        // Record IMU data
        if (imuSim != null)
        {
            snapshot.imuAngularVelocity = imuSim.GetAngularVelocity();
            snapshot.imuLinearAcceleration = imuSim.GetLinearAcceleration();
            snapshot.imuOrientation = imuSim.GetOrientation();
        }

        // Record joint positions
        snapshot.jointPositions = new List<Vector3>();
        snapshot.jointVelocities = new List<Vector3>();

        foreach (Transform joint in jointTransforms)
        {
            snapshot.jointPositions.Add(joint.localPosition);
            // Velocity would require tracking previous positions
            snapshot.jointVelocities.Add(Vector3.zero);
        }

        recordedData.Add(snapshot);
    }

    public void ReplayRecordedData()
    {
        StartCoroutine(ReplayDataRoutine());
    }

    IEnumerator ReplayDataRoutine()
    {
        if (recordedData.Count == 0)
        {
            Debug.LogWarning("No recorded data to replay");
            yield break;
        }

        float startTime = Time.time;

        for (int i = 0; i < recordedData.Count; i++)
        {
            SensorDataSnapshot snapshot = recordedData[i];

            // Apply sensor data to simulation
            ApplyLidarData(snapshot.lidarData);
            ApplyImuData(snapshot.imuAngularVelocity,
                        snapshot.imuLinearAcceleration,
                        snapshot.imuOrientation);
            ApplyJointData(snapshot.jointPositions);

            // Wait for next snapshot timing
            float elapsed = Time.time - startTime;
            float targetTime = snapshot.timestamp - recordedData[0].timestamp;

            if (elapsed < targetTime)
            {
                yield return new WaitForSeconds(targetTime - elapsed);
            }
        }

        Debug.Log("Finished replaying recorded data");
    }

    void ApplyLidarData(List<float> lidarData)
    {
        // In a real implementation, this would update the LiDAR simulation
        // with pre-recorded data
    }

    void ApplyImuData(Vector3 angVel, Vector3 linAccel, Quaternion orientation)
    {
        // Apply IMU data to simulation
        // This could drive robot motion or update state estimates
    }

    void ApplyJointData(List<Vector3> jointPositions)
    {
        // Apply joint positions to robot model
        for (int i = 0; i < jointTransforms.Count && i < jointPositions.Count; i++)
        {
            jointTransforms[i].localPosition = jointPositions[i];
        }
    }

    // Utility methods for data analysis
    public float CalculateLidarEntropy(List<float> lidarData)
    {
        // Calculate entropy of LiDAR data as a measure of environment complexity
        Dictionary<float, int> valueCounts = new Dictionary<float, int>();

        foreach (float value in lidarData)
        {
            float roundedValue = Mathf.Round(value * 100.0f) / 100.0f; // Round to 2 decimal places
            if (valueCounts.ContainsKey(roundedValue))
            {
                valueCounts[roundedValue]++;
            }
            else
            {
                valueCounts[roundedValue] = 1;
            }
        }

        float entropy = 0.0f;
        int totalPoints = lidarData.Count;

        foreach (int count in valueCounts.Values)
        {
            float probability = (float)count / totalPoints;
            entropy -= probability * Mathf.Log(probability);
        }

        return entropy;
    }

    public void ExportRecordedData(string filename)
    {
        // Export recorded sensor data to file
        // This would typically be in a format compatible with ROS bags or other robotics frameworks
        Debug.Log($"Exporting recorded data to {filename}");
    }
}
```

## Summary

Sensor simulation is a critical component of digital twin development for robotics applications. By accurately simulating various sensor types—LiDAR, depth cameras, and IMUs—you can develop and test perception pipelines without requiring physical hardware.

Key takeaways from this chapter:
- Sensor simulation enables safe, cost-effective algorithm development
- Realistic noise models are essential for effective sim-to-real transfer
- Multi-modal sensor fusion improves perception robustness
- Domain randomization and adversarial techniques enhance algorithm robustness
- Proper validation ensures simulation accuracy

## Review Questions

1. What are the main benefits of sensor simulation in digital twin development?
2. How do you implement realistic noise models for different sensor types?
3. What is the "reality gap" and how can it be addressed?
4. Explain the role of sensor fusion in perception pipelines.
5. How does domain randomization improve sim-to-real transfer?