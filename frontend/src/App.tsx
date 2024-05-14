import React, { useState } from 'react';
import './App.css';
import TodoList from './components/TodoList/TodoList';
import AddTodo from './components/AddTodo/AddTodo';

const App: React.FC = () => {
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [todo, setTodo] = useState(true);

  const openAddTodoModal = () => setIsAddTodoOpen(true);
  const closeAddTodoModal = () => setIsAddTodoOpen(false);

  const refreshTodos = async () => {
    try {
      setTodo(false);

      setTimeout(() => {
        setTodo(true);
      }, 10);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="header flex justify-center items-center space-y-4 shadow-lg shadow-blue-200/50">
        <span className="material-symbols-outlined rounded-full p-2 bg-blue-600 text-white shadow-lg shadow-blue-600/50 w-24 h-24 rounded-full content-center text-6xl absolute left-6">
          checklist_rtl
        </span>
        {/* <img src="https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="WeX Logo" className="rounded-full p-2 bg-sky-600 text-white shadow-lg shadow-blue-600/50 w-24 h-24 rounded-full content-center text-6xl absolute left-6" /> */}
        <h1 className='raleway-todo'>TODO WeXApp</h1>
      </header>
      <div className="container">
        <button
          onClick={openAddTodoModal}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4"
        >
          Add TODO
        </button>
        <AddTodo isOpen={isAddTodoOpen} closeModal={closeAddTodoModal} refreshTodos={refreshTodos}/>
        {todo && <TodoList />}
      </div>
    </div>
  );
}

export default App;
