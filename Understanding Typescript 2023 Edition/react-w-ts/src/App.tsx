import { useState } from "react"

import { Todo } from "./@types/todo"
import NewTodo from "./components/newtodo"
import TodoList from "./components/todolist"

const App = () => {

  const [todos, setTodos] = useState<Todo[]>([])
  const addTodoHandler = (text: string) => {
    setTodos(prevTodos => [
      ...prevTodos,
      { id: Math.random().toString(), text }
    ])
  }

  const removeTodoHandler = (todoId: string) => {
    setTodos(prevTodos => {
      return prevTodos.filter(todo => todo.id !== todoId)
    })
  }

  return (
    <>
      <NewTodo onAddTodo={addTodoHandler} />
      <TodoList items={todos} onDeleteTodo={removeTodoHandler} />
    </>
  )
}

export default App 
