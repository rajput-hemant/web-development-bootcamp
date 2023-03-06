import React, { useRef } from "react"

import "./newtodo.css"

interface NewTodoProps {
  onAddTodo: (todo: string) => void
}

const NewTodo = ({ onAddTodo }: NewTodoProps) => {
  const textInputRef = useRef<HTMLInputElement>(null)

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault()

    const enteredText = textInputRef.current!.value
    onAddTodo(enteredText)
    textInputRef.current!.value = ""
  }

  return (
    <form onSubmit={submitHandler}>
      <div className="form-control">
        <label htmlFor="todo-text">Todo Text</label>
        <input ref={textInputRef} type="text" id="todo-text" />
      </div>
      <button type="submit">Add Todo</button>
    </form>
  )
}

export default NewTodo
