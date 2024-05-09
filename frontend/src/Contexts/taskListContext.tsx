import React, {useState, createContext, useEffect} from "react";
import { TaskProps, TaskListType } from "./taskType";

interface ChildrenProps {
    children: React.ReactNode;
  }

export const TaskListContext = createContext<TaskListType|null>(null);

const API_URL = "https://16i6n18c41.execute-api.us-east-1.amazonaws.com/prod/todo";

export const TaskListContextProvider: React.FC<ChildrenProps> = ({children}) =>{
    const [taskList, setTaskList] = useState<TaskProps[]>([
        {
            id:1,
            title: "Example task",
            done: false,
            categorie: "Home",
            color: "#FF9C9C",
        },
        {
            id:2,
            title: "Example task 2",
            done: false,
            categorie: "Home",
            color: "#FF9C9C",
        },
        {
            id:3,
            title: "Example task 3",
            done: true,
            categorie: "Home",
            color: "#FF9C9C",
        },

    ]);
    const [doneTasks, setDoneTasks]=  useState<TaskProps[]>(taskList.filter((task:TaskProps) => task.done === true));
    const [notDoneTasks, setNotDoneTasks] = useState<TaskProps[]>(taskList.filter((task:TaskProps) => task.done === false));

    useEffect(() => {
        fetch(API_URL)
          .then((response) => response.json())
          .then((data) => {
            setTaskList(data.map((task:any) => {
                return {
                    id: task.TodoID,
                    title: task.Title,
                    done: task.Status === "done",
                    categorie: task.categorie ?? "Home",
                    color: task.color ?? "#FF9C9C",
                }
            }));
            setDoneTasks(data.filter((task:TaskProps) => task.done === true));
            setNotDoneTasks(data.filter((task:TaskProps) => task.done === false));
          });
    }, []);

    const addTask = (task: TaskProps)=>{
    
        taskList.push(task)
        setTaskList([...taskList]);
        console.log(taskList)
        setNotDoneTasks([...notDoneTasks, task]);

        
    };

    const checkTask = (id:number)=>{
        taskList.filter((task: TaskProps) => {
            if (task.id === id) {
              task.done = !task.done
              setTaskList([...taskList]);
              setDoneTasks(taskList.filter((task:TaskProps) => task.done==true));
              setNotDoneTasks(taskList.filter((task:TaskProps) => task.done!=true));
            }
        });
    };

    const deleteTask = (id:number)=>{
        const index = taskList.findIndex((task:TaskProps)=>task.id == id);
        taskList.splice(index,1);
        setTaskList([...taskList]);
        console.log(taskList);
        setDoneTasks(taskList.filter((task:TaskProps) => task.done==true));
        setNotDoneTasks(taskList.filter((task:TaskProps) => task.done!=true));
    };

    return(
        <TaskListContext.Provider value={{taskList, doneTasks,notDoneTasks, addTask, checkTask, deleteTask}}>
            {children}
        </TaskListContext.Provider>
    )
}

