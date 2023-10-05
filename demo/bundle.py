import os
import re
import sys

def find_imports(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    # Regex to find imports
    pattern = r"import .* from './(.*)'"
    return re.findall(pattern, content)

def dfs(graph, node, visited, stack):
    visited.add(node)
    for neighbour in graph.get(node, []):
        if neighbour not in visited:
            dfs(graph, neighbour, visited, stack)
    stack.append(node)

def main(entry_file):
    # Dependency graph
    graph = {}
    
    # List all js files in the current directory and library directory
    js_files = [f for f in os.listdir() if f.endswith('.js')] + \
               [os.path.join("library", f) for f in os.listdir("library") if f.endswith('.js')]
    
    # Read each js file to populate the graph
    for js_file in js_files:
        imports = find_imports(js_file)
        graph[js_file] = imports
    
    # DFS to find the order
    visited = set()
    stack = []
    
    dfs(graph, entry_file, visited, stack)
    
    # The correct order is the reverse of the stack
    print("Bundle in the following order:")
    print("\n".join(stack))


if __name__ == "__main__":
	if len(sys.argv) < 2:
		print("Please provide the entry file path as a command-line argument.")
		sys.exit(1)

	entry_file = sys.argv[1]
	main(entry_file)

