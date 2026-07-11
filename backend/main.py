from typing import Dict, List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Node(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: str


class Edge(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: Optional[str] = None
    source: str
    target: str


class Pipeline(BaseModel):
    nodes: List[Node] = []
    edges: List[Edge] = []


def isDag(nodeIds: set, edges: List[Edge]) -> bool:
    """DFS with three-color marking: white/gray/black. A cycle is found the
    moment we reach a node that's already gray (i.e. an ancestor on the
    current path). Self-loops are caught by the same rule."""

    adjacency: Dict[str, List[str]] = {nodeId: [] for nodeId in nodeIds}
    for edge in edges:
        if edge.source in adjacency:
            adjacency[edge.source].append(edge.target)

    WHITE, GRAY, BLACK = 0, 1, 2
    color = {nodeId: WHITE for nodeId in nodeIds}

    def hasCycle(startNodeId: str) -> bool:
        stack = [(startNodeId, iter(adjacency[startNodeId]))]
        color[startNodeId] = GRAY

        while stack:
            currentNodeId, neighbors = stack[-1]
            movedToNextNode = False

            for neighborId in neighbors:
                if neighborId not in color:
                    continue
                if color[neighborId] == GRAY:
                    return True
                if color[neighborId] == WHITE:
                    color[neighborId] = GRAY
                    stack.append((neighborId, iter(adjacency[neighborId])))
                    movedToNextNode = True
                    break

            if not movedToNextNode:
                color[currentNodeId] = BLACK
                stack.pop()

        return False

    for nodeId in nodeIds:
        if color[nodeId] == WHITE and hasCycle(nodeId):
            return False

    return True


@app.get('/')
def readRoot():
    return {'Ping': 'Pong'}


@app.get('/health')
def healthCheck():
    """Used by the frontend to show a connected/disconnected indicator."""
    return {'status': 'ok'}


@app.post('/pipelines/parse')
def parsePipeline(pipeline: Pipeline):
    nodeIds = {node.id for node in pipeline.nodes}
    return {
        'num_nodes': len(pipeline.nodes),
        'num_edges': len(pipeline.edges),
        'is_dag': isDag(nodeIds, pipeline.edges),
    }
