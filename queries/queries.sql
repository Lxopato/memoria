--########
-- f(T, T_i, T_o, ALL, A_0, A_r, A_{Agg})
-- ######################


-- Eulerian Circuit
WITH RECURSIVE EulerianCircuit(start_vertex, current_vertex, visited_vertices, depth) AS (
  SELECT
    start_vertex,
    start_vertex AS current_vertex,
    ARRAY[start_vertex] AS visited_vertices,
    1 AS depth
  FROM
    (SELECT MIN(source_vertex) AS start_vertex FROM edges) AS initial

  UNION ALL

  SELECT
    ec.start_vertex,
    edges.target_vertex AS current_vertex,
    ec.visited_vertices || edges.target_vertex,
    ec.depth + 1
  FROM
    EulerianCircuit ec
    JOIN edges ON ec.current_vertex = edges.source_vertex
  WHERE
    ec.depth < (SELECT COUNT(DISTINCT target_vertex) FROM edges)
)
SELECT
  *
FROM
  EulerianCircuit
WHERE
  start_vertex = current_vertex
ORDER BY
  depth;

-- #############################################
-- Topological Sort
WITH RECURSIVE TopologicalOrder AS (
  SELECT
    source,
    target,
    1 AS level
  FROM
    edges
  WHERE
    source NOT IN (SELECT target FROM edges)
  UNION ALL
  SELECT
    e.source,
    e.target,
    t.level + 1
  FROM
    edges e
  JOIN
    TopologicalOrder t ON e.source = t.target
)
SELECT
  source,
  MAX(level) AS topological_order
FROM
  TopologicalOrder
GROUP BY
  source
ORDER BY
  topological_order DESC;

-- #############################################
-- ConectedComponents
WITH RECURSIVE ConnectedComponents(source_vertex, target_vertex, component) AS (
  SELECT source_vertex, target_vertex, source_vertex AS component
  FROM edges

  UNION

  SELECT e.source_vertex, e.target_vertex, cc.component
  FROM edges e
  JOIN ConnectedComponents cc ON e.source_vertex = cc.target_vertex OR e.target_vertex = cc.source_vertex
)
SELECT DISTINCT component, array_agg(DISTINCT source_vertex) AS nodes
FROM ConnectedComponents
GROUP BY component
ORDER BY component;

-- #############################################
-- Maximum Matching

WITH RECURSIVE MaxMatchingCTE AS (
  -- Anchor member
  SELECT
    source_vertex,
    target_vertex,
    1 AS level
  FROM
    edges
  WHERE
    source_vertex = 1

  UNION

  -- Recursive member
  SELECT
    e.source_vertex,
    e.target_vertex,
    p.level + 1
  FROM
    edges e
    JOIN MaxMatchingCTE p ON e.source_vertex = p.target_vertex
  WHERE
    p.level % 2 = 1 -- Select only unmatched vertices
)
-- Select the maximum matching
SELECT
  source_vertex,
  target_vertex
FROM
  MaxMatchingCTE
WHERE
  level % 2 = 0; -- Select only the matched edges


-- #############################################
-- Minimum Spanning Tree
WITH RECURSIVE MST(node1, node2, weight, level) AS (
  -- Anchor member
  SELECT
    e.source_vertex AS node1,
    e.target_vertex AS node2,
    e.weight,
    1 AS level
  FROM
    edges e
  WHERE
    e.source_vertex = 1 -- Choose any starting node

  UNION

  -- Recursive member
  SELECT
    e.source_vertex AS node1,
    e.target_vertex AS node2,
    e.weight,
    MST.level + 1
  FROM
    edges e
  JOIN
    MST ON e.source_vertex = MST.node2
  WHERE
    MST.level < 19 -- Number of vertices - 1
)
SELECT
  node1 AS source_vertex,
  node2 AS target_vertex,
  weight,
  level
FROM
  MST
ORDER BY
  node1, node2;

-- #############################################
-- Planarity Testing


WITH RECURSIVE GraphTraversal AS (
    -- Anchor member
    SELECT source_vertex, target_vertex
    FROM edges
    WHERE source_vertex = 1  -- Starting node, change it based on your requirement

    UNION

    -- Recursive member
    SELECT e.source_vertex, e.target_vertex
    FROM edges e
    JOIN GraphTraversal g ON e.source_vertex = g.target_vertex
)

SELECT * FROM GraphTraversal;