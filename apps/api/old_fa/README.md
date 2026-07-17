# Pipeline Studio Backend

The backend engine for the **Pipeline Studio** automation platform. Built with **FastAPI** and **Python 3.11+**, it provides fast, robust graph validation algorithms and workflow topology analysis.

---

## Key Features

- **DAG Validation**: Custom implementation of cycle detection using Kahn's Algorithm / DFS to prevent infinite loops in pipelines.
- **Pipeline Analysis**: Counts and returns metrics for total nodes and edges in the system.
- **REST API**: Clean, high-performance API endpoints documented via OpenAPI/Swagger.
- **Extensible Schema**: Pydantic models for strict client-server data synchronization.

---

## Tech Stack

- **Framework**: FastAPI
- **Data Validation**: Pydantic v2
- **Server**: Uvicorn
- **Language**: Python 3.11+

---

## API Specification

### Parse Pipeline Graph

Validates the layout structure received from the React Flow frontend canvas.

- **Endpoint**: `POST /pipelines/parse`
- **Content-Type**: `application/json`

#### Request Payload Schema

```json
{
  "nodes": [
    {
      "id": "text-1",
      "type": "text",
      "data": {
        "id": "text-1",
        "nodeType": "text",
        "text": "Hello {{name}}"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "input-1",
      "sourceHandle": "input-1-value",
      "target": "text-1",
      "targetHandle": "text-1-var-name"
    }
  ]
}
```

## Infrastructure Endpoints

- Health Check: GET /health (Returns {"status": "ok"} for live state synchronization in the web UI header).

- Root Ping: GET / (Simple gateway sanity test).

## Graph Analysis Architecture

The verification core determines whether the active canvas holds a strict Directed Acyclic Graph (DAG) topology via the isDag routine:

1. Adjacency Translation: Flat edge arrays are instantly mapped to an isolated adjacency dictionary (Dict[str, List[str]]).

2. Three-Color Traversal Stack:

- WHITE (0): Unvisited node.

- GRAY (1): Currently active in the DFS backtracking path. If a neighbor is encountered with this status, a cycle or self-loop is immediately flagged.

- BLACK (2): Fully processed node with all dependencies cleared.

3. Safety Guarantee: By handling traversal state directly over a linear list structure rather than native Python interpreter frames, the system is fundamentally resilient against stack overflows on deeply nested or highly dense pipeline designs.

## Getting Started

Prerequisites

- Python 3.11 or higher

- pip / virtualenv

1. Environment Activation
   Bash

### Setup python environment

python -m venv .venv

### Activate shell (Linux/macOS)

source .venv/bin/activate

#### Activate shell (Windows)

.venv\Scripts\activate

## Dependencies Setup

Create a requirements.txt file in the root backend directory:

```
fastapi>=0.110.0
uvicorn>=0.28.0
pydantic>=2.6.0
```

Then execute:

```
pip install -r requirements.txt
```

## Launch Development Server

Bash

```
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The operational application will bind locally to http://localhost:8000.
