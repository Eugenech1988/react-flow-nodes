# Pipeline Studio

**Pipeline Studio** is a powerful visual workflow automation platform built on **React Flow**. It allows users to design, connect, and execute complex pipelines using an intuitive drag-and-drop interface.

---

## Key Features

* **Drag-and-Drop Canvas**: Easily place and arrange nodes on the workspace.
* **Dynamic Node Configuration**: Every node exposes configurable fields (Input, Textarea, Select) based on its functionality.* **Variable Extraction**: Automatically detects `{{variables}}` inside text fields and exposes them as dynamic input handles, making data flow connections intuitive.* **Categorized Workflow Nodes**:
    * **I/O**: Input and Output nodes.
    * **Content**: Text processing and Image manipulation.
    * **Logic**: LLM integrations, Math operations, and Conditional branching.
    * **Integrations**: API calls and Database queries.
* * **Undo / Redo History**: Built-in command history allows reverting and reapplying node, edge, and configuration changes.
* **Theming**: Full support for Light and Dark modes.

---

## Tech Stack

* **Frontend**: React 19, React Flow (XYFlow), Tailwind CSS 4.
* **State Management**: Zustand.
* **UI Components**: Built with `shadcn` principles.
* **Build Tool**: Vite.
* **Testing**: Vitest + React Testing Library.

---

##  Architecture (FSD)

The project follows the **Feature-Sliced Design (FSD)** methodology to ensure modularity and scalability:

```text
src/
├── app/            # Global application initialization
├── entities/       # Domain entities (Pipeline, Node model)
├── features/       # Functional business logic (Node management, Parsing)
├── shared/         # Reusable UI components and utilities
└── widgets/        # Composite blocks (Canvas, Toolbar, Header)

```

---

## Technical Highlights & Architecture Solutions

### 1. Abstract & Declarative Node Construction (`BaseNode`)
Instead of duplicating boilerplate code for each React Flow node type, the project introduces a highly reusable `BaseNode` component and a declarative `createNode` factory.
* Custom nodes (`LLMNode`, `MathNode`, `APINode`, etc.) only specify their metadata, field inputs, and default connections as a simple configuration object.
* `BaseNode` manages local form state, synchronizes updates with the global Zustand store, renders configurable fields, and handles React Flow events.
### 2. Smart Node Handles Positioning (`withAutoPositions`)
To prevent dynamic and static node handles from overlapping on the node edge, an automated spacing algorithm is implemented. It separates target and source handles, calculating equal percentage heights (`top: ...%`) relative to the total number of connections on each side.

### 3. Reactive Variable Parsing & Dynamic Inputs
Handles are automatically grouped by side (target/source) and evenly distributed along the node edge to avoid overlap without requiring manual positioning.
1. A regex-based parser (`extractVariables`) scans the content and removes duplicates.
2. The node recalculates its dynamic handles based on the detected variables.
3. React Flow spawns a new **Target Handle** labeled with that variable name on the fly, making it instantly linkable.
4. **React Flow Handle ID Isolation:** To prevent routing bugs in React Flow, handle IDs are globally scoped by combining the node ID and port ID (`${nodeId}-${handleId}`).

---

## Backend Integration

The **Submit** workflow interacts with a backend server (e.g., FastAPI) to parse the created graph:

* **Endpoint**: `POST http://localhost:8000/pipelines/parse`
* **Payload**:
  ```json
  {
    "nodes": [...],
    "edges": [...]
  }
  
---
# Getting Started

## Install dependencies:
**npm install**
## Run development server:
**npm run dev**
## Run unit tests
**npm test**
# Run tests with UI
**npm run test:ui**

# Roadmap & Future Improvements
- [ ] Add support for custom Edge styling and Edge deletion hotkeys.
- [x] Undo / Redo history support.
- [ ] Introduce Node Grouping (Sub-graphs) for organizing complex automation workflows.
- [ ] Implement Copy/Paste shortcuts (`Ctrl+C` / `Ctrl+V`) for canvas elements.
- [ ] Implement backend execution engine log streams directly into the Node UI.