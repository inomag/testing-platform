# UI Builder

A powerful and flexible UI builder tool that enables dynamic UI generation based on configuration.

## Architecture

```
+------------------+--------------------+-------------------+
|   Components     |                   |    Properties     |
|   Library        |     Canvas        |    Panel         |
| +-------------+  |  +-----------+    | +-------------+  |
| |  Atoms      |  |  |           |    | | Component   |  |
| |  o Button   |  |  |           |    | | Properties  |  |
| |  o Input    |->|  |  Drag     |    | |            |  |
| |  o Select   |  |  |  &        |<-->| | o Position  |  |
| +-------------+  |  |  Drop     |    | | o Size      |  |
| |  Blocks     |  |  |  Area     |    | | o Style     |  |
| |  o Card     |  |  |           |    | | o Data      |  |
| |  o Modal    |  |  |           |    | |            |  |
| |  o List     |  |  |           |    | +-------------+  |
| +-------------+  |  |           |    | | Bindings    |  |
| |  Molecules  |  |  |           |    | |            |  |
| |  o Form     |  |  +-----------+    | | o Config   |  |
| |  o Table    |  |  |  Rulers   |    | | o Query    |  |
| +-------------+  |  +-----------+    | +-------------+  |
+------------------+--------------------+-------------------+
                   ^                    ^
                   |                    |
+------------------+--------------------+-------------------+
|                    Header                               |
| +---------+ +----------+ +---------+ +----------------+ |
| |  Save   | | Preview  | | Device  | |  More Actions  | |
| +---------+ +----------+ +---------+ +----------------+ |
+-----------------------------------------------------+
```

## Components

### 1. Header

```
+--------------------------------------------------------+
|  Save | Preview | Desktop | Tablet | Mobile | Settings   |
+--------------------------------------------------------+
```

1. Save functionality for persisting changes
2. Preview mode for testing layouts
3. Device switching between Desktop/Tablet/Mobile
4. Settings and configuration options
5. User profile and preferences

### 2. Component Library (Left Pane)

```
+--------------------+
| Search Components  |
+--------------------+
| ATOMS             |
| ├── Button        |
| ├── Input         |
| └── Select        |
|                   |
| BLOCKS            |
| ├── Card          |
| ├── Modal         |
| └── List          |
|                   |
| MOLECULES         |
| ├── Form          |
| └── Table         |
+--------------------+
```

1. Webpack to compile list of all elements inside src/@vymo/ui
2. Segregation of atoms/blocks/molecules components
3. Search functionality for quick component access
4. Drag and drop support for components to canvas
5. Component preview on hover
6. Component documentation access

### 3. Canvas (Middle Pane)

```
+---------------------------+
|     Ruler                 |
+---------------------------+
|                           |
|   +----------------+      |
|   |  Drag & Drop  |      |
|   |     Area      |      |
|   |               |      |
|   | +---------+   |      |
|   | |Component|   |      |
|   | +---------+   |      |
|   |               |      |
|   +----------------+      |
|                           |
+---------------------------+
```

1. Element resizing functionality
2. Dragging with background overlay visibility
3. Responsive design support (Mobile/Tablet/Desktop)
4. Element deletion capability
5. Zoom controls
6. Multi-select and bulk actions
7. Ruler system for proper alignment (Planned)
8. Auto-snap to vertical/horizontal guides (Planned)

### 4. Properties Panel (Right Pane)

```
+----------------------+
| Selected Component   |
+----------------------+
| Position            |
| ├── X: 100         |
| └── Y: 200         |
|                    |
| Size               |
| ├── Width: 200     |
| └── Height: 100    |
|                    |
| Styling            |
| └── ...            |
|                    |
| Data Binding       |
| ├── Config         |
| └── Query          |
+----------------------+
```

1. Load component metadata for editing
2. Meta props translation to form items
3. Config property binding to UI props
4. UI Query support in JavaScript
5. Save Query functionality
6. Example binding:

```javascript
// Component
<Switch value={true/false}>

// Config
{ enabled: "yes/no" }

// Binding
Bind property: config.enabled
label: {{secondary}}

// UI Query
(data, formData) => data === "yes" ? true : false

// Save Query
(data, formData) => data ? "yes" : "no"
```

### 5. Runner

1. Runtime execution of configured UI
2. Dynamic UI generation from config
3. Real-time preview capabilities
4. Configuration validation
5. Error handling and fallback UI

## Data Context (Future Phase)

```
+------------------+
|   Data Context   |
+------------------+
| Modules          |
| ├── States       |
| ├── Fields       |
| └── Activities   |
|                  |
| User Fields      |
| └── ...          |
|                  |
| Roles            |
| └── ...          |
+------------------+
```

## Best Practices

1. Use the ruler system for precise alignment
2. Test layouts across all device sizes
3. Leverage property binding for dynamic content
4. Organize components logically using the categorization system
5. Use appropriate component types (atoms/blocks/molecules) for different needs
