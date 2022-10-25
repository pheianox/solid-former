# Solid Former

Form control and validation for [Solid](https://solidjs.com)

## Install

```npm i solid-former```

## Example 

```tsx
import { Show } from 'solid-js';
import { createForm } from 'solid-former';

function App() {
  const form = createForm({
    fields: {
      username: '',
      password: '',
    },
    validators: [
      ({ username }) => username.length > 0 || { username: 'Username is required' },
      ({ password }) => password.length > 8 || { password: 'Password is too short' },
    ],
    onSubmit(fields) {
      alert(JSON.stringify(fields))
    },
  });

  return (
    <div>
        <div>Username</div>
        <input
          type="text"
          value={form.fields().username.value}
          oninput={(e) => form.input('username', e.currentTarget.value)}
        />
        <Show when={form.fields().username.error}>
          <div>error: {form.fields().username.error}</div>
        </Show>
        <br />

        <div>Password</div>
        <input
          type="text"
          value={form.fields().password.value}
          oninput={(e) => form.input('password', e.currentTarget.value)}
        />
        <Show when={form.fields().password.error}>
          <div>error: {form.fields().password.error}</div>
        </Show>
        <br />

      <button onclick={() => form.submit()}>Login</button>
    </div>
  );
}

export default App;
```
## Contributions
Always welcome to people who can improve the codebase/performance or add something useful 
