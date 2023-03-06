import "./todolist.css"

interface TodoListProps {
  items: { id: string, text: string }[]
  onDeleteTodo: (id: string) => void
}

const TodoList = ({ items, onDeleteTodo }: TodoListProps) => {

  return (
    <ul>
      {items.map(todo => (
        <li key={todo.id}>
          <span>{todo.text}
          </span>
          <button onClick={() => onDeleteTodo(todo.id)}> DELETE </button>
        </li>
      ))}
    </ul>
  )
}

export default TodoList;
