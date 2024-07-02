    echo "Checking directories start"
    pwd
    ls
    echo "Checking directories end"
cd backend
    echo "Checking backend installed dependencies"
    pwd
    ls
npm run build 
cd .. 

cd frontend 
    echo "Checking frontend installed dependencies"
    ls ./node_modules/react-scripts
npm run build 
cd .. 

cd infrastructure 
npm run deploy