
import { v4 as randomUUID } from 'uuid'
import van from './lib/van'
import 'todomvc-app-css/index.css'
import { TodoItem } from './components/TodoItem'


export interface Todo {
  id: string
  label: string
  done: boolean
  is_delete: boolean
}

const { a, button, footer, h1, header, input, label, li, section, span, ul } = van.tags


const App = () => {
  const todos = van.state<Todo[]>([
    { label: "Todo 1", id: "321123", is_delete: false, done: false },
    { label: "Todo 2", id: "123321", is_delete: false, done: true }
  ])

  const inputTodo = van.state('')

  const filter = van.state<'all' | 'completed' | 'active'>('all')

  const onToggleAll = (e: InputEvent) => {
    todos.val = todos.val.map(i => ({ ...i, done: (e.target as HTMLInputElement).checked }))
  }

  const onClearCompleted = () => {
    todos.val = todos.val.map(i => (i.done && !i.is_delete ? { ...i, is_delete: true } : i))
  }

  return section({ class: "todoapp" },
    header({ class: "header" },
      h1("todos"),
      input({
        value: inputTodo,
        class: "new-todo",
        placeholder: "What needs to be done?",
        autofocus: "",
        oninput: (e: InputEvent) => {
          inputTodo.val = (e.target as HTMLInputElement).value
        },
        onkeypress: (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            if (inputTodo.val) {
              const id = randomUUID()
              // assgin directly rather than `Array.prototype.push`
              todos.val = [...todos.val, { label: inputTodo.val, id, done: false, is_delete: false }]
              inputTodo.val = ''
            }
          }
        }
      }),
    ),

    section({ class: "main" },
      van.bind(todos, (todos) => input({
        id: "toggle-all",
        class: "toggle-all",
        type: "checkbox",
        onchange: onToggleAll,
        checked: todos.filter(i => !i.done).length === 0
      })),
      label({ for: "toggle-all" }, "Mark all as complete"),
      van.bind(todos, filter, (todosState, filterState) => {
        return ul(
          { class: "todo-list" },
          todosState
            .filter(i => (filterState === 'active' && !i.done) ||
              (filterState === 'completed' && i.done) ||
              filterState === 'all')
            .map(todo => TodoItem({
              todo, onChange: (todo) =>
                todos.val = todos.val.map(i => (i.id === todo.id ? todo : i))
            }))
        )
      }),
      footer({ class: "footer" },
        span({ class: "todo-count" }),
        van.bind(filter, (filterState) => {
          return ul({ class: "filters" },
            li(
              a(
                {
                  href: "#/",
                  class: filterState === 'all' ? "selected" : "",
                  onclick: () => filter.val = 'all'
                },
                "All",
              )
            ),
            li(
              a(
                {
                  href: "#/active",
                  class: filterState === 'active' ? "selected" : "",
                  onclick: () => filter.val = 'active'
                },
                "Active",
              )
            ),
            li(
              a(
                {
                  href: "#/completed",
                  class: filterState === 'completed' ? "selected" : "",
                  onclick: () => filter.val = 'completed'
                },
                "Completed",
              )
            ),
          )
        }),
        button({ class: "clear-completed", onclick: onClearCompleted },
          "Clear completed",
        ),
      ),
    ),
  )
}

van.add(document.body, App())
