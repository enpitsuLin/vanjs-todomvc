import { atom } from 'jotai/vanilla'
import 'todomvc-app-css/index.css'
import { v4 as randomUUID } from 'uuid'
import van from 'vanjs-core'
import { TodoItem } from './components/TodoItem'
import { useAtom } from './lib/jotai'


export interface Todo {
  id: string
  label: string
  done: boolean
  is_delete: boolean
}

const { a, button, footer, h1, header, input, label, li, section, span, ul } = van.tags

const todosAtom = atom<Todo[]>([
  { label: "Todo 1", id: "321123", is_delete: false, done: false },
  { label: "Todo 2", id: "123321", is_delete: false, done: true }
])

const App = () => { 
  const todos = useAtom(todosAtom)
  // const todos = van.state<Todo[]>([
  //   { label: "Todo 1", id: "321123", is_delete: false, done: false },
  //   { label: "Todo 2", id: "123321", is_delete: false, done: true }
  // ])

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
      () => input({
        id: "toggle-all",
        class: "toggle-all",
        type: "checkbox",
        onchange: onToggleAll,
        checked: todos.val.filter(i => !i.done).length === 0
      }),
      label({ for: "toggle-all" }, "Mark all as complete"),
      () => ul(
        { class: "todo-list" },
        todos.val
          .filter(i => (filter.val === 'active' && !i.done) ||
            (filter.val === 'completed' && i.done) ||
            filter.val === 'all')
          .map(todo => TodoItem({
            todo, onChange: (todo) =>
              todos.val = todos.val.map(i => (i.id === todo.id ? todo : i))
          }))
      ),
      footer({ class: "footer" },
        span({ class: "todo-count" }),
        () => ul({ class: "filters" },
          li(
            a(
              {
                href: "#/",
                class: filter.val === 'all' ? "selected" : "",
                onclick: () => filter.val = 'all'
              },
              "All",
            )
          ),
          li(
            a(
              {
                href: "#/active",
                class: filter.val === 'active' ? "selected" : "",
                onclick: () => filter.val = 'active'
              },
              "Active",
            )
          ),
          li(
            a(
              {
                href: "#/completed",
                class: filter.val === 'completed' ? "selected" : "",
                onclick: () => filter.val = 'completed'
              },
              "Completed",
            )
          ),
        ),
        button({ class: "clear-completed", onclick: onClearCompleted },
          "Clear completed",
        ),
      ),
    ),
  )
}

van.add(document.body, App())
