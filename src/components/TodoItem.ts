

import van from '../lib/van'
import { Todo } from '../main'
const { div, button, input, label, li } = van.tags


export const TodoItem = (props: {
  todo: Todo,
  onChange: (todo: Todo) => void
}) => {
  const { todo } = props
  const editing = van.state(false)

  const onClick = () => {
    editing.val = true
  }
  const onDone = () => {
    props.onChange({ ...todo, done: !todo.done })
  }
  const onDelete = () => {
    props.onChange({ ...todo, is_delete: true })
  }

  const onEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      editing.val = false
    }
  }
  const editingDom = input({
    type: "text",
    autoFocus: true,
    value: todo.label,
    class: "edit",
    onchange: (e: InputEvent) => {
      props.onChange({ ...todo, label: (e.target as HTMLInputElement).value })
    },
    onkeypress: onEnter,
    onblur: () => editing.val = false
  })
  return van.bind(editing, (editingState) => li(
    {
      class: [editingState && 'editing', todo.done && 'completed'].filter(Boolean).join(' '),
      onclick: onClick
    },
    div({ class: "view", style: todo.is_delete ? "display:none" : "" },
      input({ type: "checkbox", class: "toggle", checked: todo.done, onchange: onDone, autoFocus: true }),
      label(todo.label),
      button({ class: "destroy", onclick: onDelete })
    ),
    editingState ? editingDom : ''
  ))
}
