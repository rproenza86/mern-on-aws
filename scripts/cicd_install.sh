export CI=false

cd backend
npm ci 
cd ..
cd frontend 
npm ci 
cd ..
cd infrastructure 
npm ci 
cd ..

echo "Dependencies installed"