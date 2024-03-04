--########
-- f(T, T_i, T_o, ALL, A_0, A_r, A_{Agg})
-- #############################################
-- Topological Sort
WITH RECURSIVE TopologicalOrder(vertex, depth) AS (
        SELECT edges.source_vertex, 0 FROM edges
         WHERE source_vertex NOT IN (SELECT target_vertex FROM edges)
    UNION ALL
        SELECT edges.target_vertex AS id, TopologicalOrder.depth + 1 FROM edges
        JOIN TopologicalOrder
        ON edges.source_vertex = TopologicalOrder.vertex
)
SELECT vertex, depth FROM TopologicalOrder
GROUP BY vertex, depth
ORDER BY MAX(depth);


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
-- Minimum Spanning Tree
WITH RECURSIVE MST AS (
    SELECT 
        e.source_vertex AS source_vertex,
        e.target_vertex AS target_vertex,
        e.weight,
        1 AS level,
        ARRAY[e.source_vertex, e.target_vertex] AS connected_vertices
    FROM 
        edges e
    WHERE 
        e.source_vertex = (SELECT MIN(source_vertex) FROM edges)

    UNION

    SELECT 
        e.source_vertex AS source_vertex,
        e.target_vertex AS target_vertex,
        e.weight,
        MST.level + 1,
        MST.connected_vertices || e.target_vertex
    FROM 
        edges e
    JOIN 
        MST ON (e.source_vertex = MST.target_vertex OR e.target_vertex = MST.target_vertex)
    WHERE 
        MST.level < (SELECT COUNT(DISTINCT source_vertex) FROM edges) - 1
        AND NOT (e.source_vertex = MST.source_vertex AND e.target_vertex = MST.target_vertex)
        AND NOT (e.target_vertex = ANY(MST.connected_vertices))
        AND e.weight = (
                SELECT MIN(weight) 
                FROM edges 
                WHERE (source_vertex = e.source_vertex AND target_vertex = e.target_vertex) 
                OR (source_vertex = e.target_vertex AND target_vertex = e.source_vertex)
            )
        
SELECT  
    source_vertex,
    target_vertex,
    MIN(level) as level,
    MIN(weight) as weight
FROM 
    MST
WHERE
    NOT EXISTS (
        SELECT 
            (SELECT MIN(source_vertex) FROM edges)
        FROM 
            MST AS M
        WHERE 
            MST.source_vertex = M.target_vertex 
            AND MST.target_vertex = M.source_vertex
    )
GROUP BY
  source_vertex, target_vertex
ORDER BY 
    source_vertex, target_vertex;


-- #############################################
-- Eulerian Circuit
WITH RECURSIVE EulerianCircuit(start_vertex, current_vertex, visited_vertices, depth) AS (
  SELECT
    start_vertex,
    start_vertex AS current_vertex,
    ARRAY[start_vertex] AS visited_vertices,
    1 AS depth
  FROM
   (SELECT MIN(source_vertex) as start_vertex FROM edges) AS initial

  UNION

  SELECT
    ec.start_vertex,
    edges.target_vertex AS current_vertex,
    ec.visited_vertices || edges.target_vertex,
    ec.depth + 1
  FROM
    EulerianCircuit ec
    JOIN edges ON ec.current_vertex = edges.source_vertex
  WHERE
    ec.depth < (SELECT COUNT(*) from edges)
    AND edges.target_vertex <> ALL(ec.visited_vertices)
)
SELECT
  *
FROM
  EulerianCircuit
WHERE depth < (SELECT COUNT(*) from edges)
AND current_vertex = start_vertex;


-- #############################################
-- Maximum Matching
WITH RECURSIVE matching AS (
  -- Base case: Start with unmatched nodes having no outgoing edges
  SELECT e.target_vertex AS node, e.source_vertex AS matched
  FROM edges e
  WHERE NOT EXISTS (
    SELECT 1
    FROM edges e2
    WHERE e.target_vertex = e2.source_vertex
  )
  UNION ALL
  -- Recursive case: Try to find a match for the "matched" node
  SELECT m.node, e.source_vertex AS matched
  FROM matching m
  JOIN edges e ON m.matched = e.target_vertex
  WHERE NOT EXISTS (
    SELECT 1
    FROM edges e2
    WHERE e.source_vertex = e2.source_vertex
    AND e.source_vertex <> e2.target_vertex -- Exclude self-loops
  )
)
SELECT node, matched
FROM matching
WHERE matched IS NOT NULL;


-- #############################################
-- Planarity Testing
WITH RECURSIVE k5_check AS (
    -- Anchor member
    SELECT e1.target_vertex AS node1, e2.target_vertex AS node2, e3.target_vertex AS node3,
            e4.target_vertex AS node4, e5.target_vertex AS node5
    FROM edges e1
    JOIN edges e2 ON e1.source_vertex = e2.source_vertex AND e1.target_vertex < e2.target_vertex
    JOIN edges e3 ON e2.source_vertex = e3.source_vertex AND e2.target_vertex < e3.target_vertex
    JOIN edges e4 ON e3.source_vertex = e4.source_vertex AND e3.target_vertex < e4.target_vertex
    JOIN edges e5 ON e4.source_vertex = e5.source_vertex AND e4.target_vertex < e5.target_vertex
    WHERE NOT (e1.target_vertex = e2.target_vertex OR e1.target_vertex = e3.target_vertex OR e1.target_vertex = e4.target_vertex OR e1.target_vertex = e5.target_vertex
                OR e2.target_vertex = e3.target_vertex OR e2.target_vertex = e4.target_vertex OR e2.target_vertex = e5.target_vertex
                OR e3.target_vertex = e4.target_vertex OR e3.target_vertex = e5.target_vertex
                OR e4.target_vertex = e5.target_vertex)
                
    UNION ALL
    
    -- Recursive member
    SELECT e.target_vertex AS node1, k.node2 AS node2, k.node3 AS node3, k.node4 AS node4, k.node5 AS node5
    FROM k5_check k
    JOIN edges e ON (e.source_vertex = k.node1 AND e.target_vertex > k.node5)
    WHERE NOT (e.target_vertex = k.node2 OR e.target_vertex = k.node3 OR e.target_vertex = k.node4 OR e.target_vertex = k.node5)
  )
-- Final Select
SELECT DISTINCT node1, node2, node3, node4, node5
FROM k5_check;
