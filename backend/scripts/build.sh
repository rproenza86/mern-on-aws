# copy nodes_modules to the backend dist folder on each lambda directory
cp -r ./node_modules ./dist/lambdas/todos
cp -r ./node_modules ./dist/lambdas/s3