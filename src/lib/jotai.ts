import { Atom, WritableAtom, createStore } from 'jotai/vanilla'
import van, { State } from 'vanjs-core'

export type UseAtom = {
  <Value, Args extends unknown[], Result>(atom: WritableAtom<Value, Args, Result>): State<Value>
  <Value>(atom: Atom<Value>): State<Value>
}


export function vanjsJotaiFactory(): UseAtom {
  const store = createStore()
  return <Value, Args extends unknown[], Result>(atom: WritableAtom<Value, Args, Result> | Atom<Value>) => {
    const atomState = van.state(store.get(atom))
    return new Proxy(atomState, {
      set(state, prop, newValue: Value) {
        const ret = Reflect.set(state, prop, newValue)
        if (prop === 'val' && 'write' in atom && newValue !== store.get(atom)) {
          //@ts-expect-error
          store.set(atom, newValue)
        }
        return ret
      }
    })
  }
}

export const useAtom = vanjsJotaiFactory()
