import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));

app.use(cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174'
    ],
    credentials: true
  })
);

app.use(express.json());

interface Node {
  id: string;
}

interface Edge {
  id?: string;
  source: string;
  target: string;
}

interface Pipeline {
  nodes: Node[];
  edges: Edge[];
}

function isDag(nodeIds: Set<string>, edges: Edge[]): boolean {
  const adjacency = new Map<string, string[]>();

  nodeIds.forEach((id) => adjacency.set(id, []));

  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
  }

  enum Color {
    White,
    Gray,
    Black,
  }

  const color = new Map<string, Color>();

  nodeIds.forEach((id) => color.set(id, Color.White));

  function hasCycle(start: string): boolean {
    const stack: Array<{
      node: string;
      iterator: Iterator<string>;
    }> = [
      {
        node: start,
        iterator: adjacency.get(start)!.values()
      }
    ];

    color.set(start, Color.Gray);

    while (stack.length) {
      const current = stack[stack.length - 1];
      const next = current.iterator.next();

      if (!next.done) {
        const neighbor = next.value;

        if (!color.has(neighbor)) {
          continue;
        }

        if (color.get(neighbor) === Color.Gray) {
          return true;
        }

        if (color.get(neighbor) === Color.White) {
          color.set(neighbor, Color.Gray);

          stack.push({
            node: neighbor,
            iterator: adjacency.get(neighbor)!.values()
          });
        }
      } else {
        color.set(current.node, Color.Black);
        stack.pop();
      }
    }

    return false;
  }

  for (const nodeId of nodeIds) {
    if (
      color.get(nodeId) === Color.White &&
      hasCycle(nodeId)
    ) {
      return false;
    }
  }

  return true;
}

app.get('/', (_, res) => {
  res.json({});
});

app.get('/health', (_, res) => {
  res.json({
    status: 'ok'
  });
});

app.post('/pipelines/parse', (
    req: express.Request<{}, {}, Pipeline>,
    res
  ) => {
    const { nodes = [], edges = [] } = req.body;

    console.log(`\n📥 [POST] /pipelines/parse`);
    console.log(`📦 Received nodes count: ${nodes?.length || 0}`);
    console.log(`📦 Received edges count: ${edges?.length || 0}`);

    const nodeIds = new Set(nodes.map((node) => node.id));
    const isGraphDag = isDag(nodeIds, edges);

    console.log(`📊 Analysis Result -> is_dag: ${isGraphDag}\n`);

    res.json({
      num_nodes: nodes.length,
      num_edges: edges.length,
      is_dag: isGraphDag
    });
  }
);

app.listen(8000, () => {
  console.log('🚀 Server running on port 8000');
});