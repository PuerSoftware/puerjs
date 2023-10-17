import time

start_time = time.time()
with open('/Users/Alexander/dev/puer/core/class.PuerComponentSet.js', 'rb') as f:
    data = f.read()
end_time = time.time()

print(f'Time taken to read file: {end_time - start_time} seconds')
