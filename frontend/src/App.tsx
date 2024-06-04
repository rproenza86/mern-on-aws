import React, { useState } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import './App.css';

import AddTodo from './components/AddTodo/AddTodo';
import TodoList from './components/TodoList/TodoList';

const App: React.FC = () => {
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const openAddTodoModal = () => setIsAddTodoOpen(true);
  const closeAddTodoModal = () => setIsAddTodoOpen(false);

  const { SignUp, SignIn } = Authenticator;

  return (
    <Authenticator>

      {!user && <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <SignUp />
        <SignIn />
      </div>}

      <div className="App">
        <header className="header flex justify-center items-center space-y-4 shadow-lg shadow-blue-200/50">
          <span className="material-symbols-outlined rounded-full p-2 bg-blue-600 text-white shadow-lg shadow-blue-600/50 w-24 h-24 rounded-full content-center text-6xl absolute left-6">
            checklist_rtl
          </span>
          <h1 className='raleway-todo'>TODO WeXApp</h1>
          {user && (
            <button
              onClick={signOut}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline absolute right-6 text-sm"
            >
              Logout
            </button>
          )}
        </header>
        <div className="container">
          <button
            onClick={openAddTodoModal}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4"
          >
            Add TODO
          </button>
          <AddTodo isOpen={isAddTodoOpen} closeModal={closeAddTodoModal} />
          <TodoList />
        </div>
      </div>


    </Authenticator>
  );
}

export default App;
