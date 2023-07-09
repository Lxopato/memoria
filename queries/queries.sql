WITH RECURSIVE eulerian_circuit(input, output, visited_edges) AS (
  SELECT input::varchar, output::varchar, ARRAY[input::varchar] AS visited_edges
  FROM grafo
  WHERE input = '1'
  
  UNION ALL
  
  SELECT e.input, e.output, ec.visited_edges || e.input
  FROM grafo e
  JOIN eulerian_circuit ec ON e.input = ec.output
  WHERE e.input <> ALL(ec.visited_edges)
)
SELECT *
FROM eulerian_circuit
WHERE output = '1'
  AND ARRAY_LENGTH(visited_edges, 1) = (SELECT COUNT(*) FROM grafo)


-- #############################################
WITH RECURSIVE topological_sort(input, output, visited_edges) AS (
  SELECT input, output, 1
  FROM grafo
  WHERE input NOT IN (SELECT output FROM grafo)
  
  UNION ALL
  
  SELECT d.input, d.output, ts.visited_edges + 1
  FROM grafo d
  JOIN topological_sort ts ON d.input = ts.output
)
SELECT input, visited_edges
FROM topological_sort
GROUP BY input, visited_edges
ORDER BY visited_edges;

-- #############################################

WITH RECURSIVE connected_components(input, output, component) AS (
  SELECT input::varchar, output::varchar, ARRAY[input::varchar] AS component
  FROM grafo
  
  UNION ALL
  
  SELECT c.input, e.output, c.component || e.output
  FROM connected_components AS c
  JOIN grafo AS e ON c.output = e.input
  WHERE e.output <> ALL (c.component)
)
SELECT DISTINCT component
FROM connected_components;