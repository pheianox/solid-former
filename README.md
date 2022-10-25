# Solid Former

Form validation for [Solid](https://solidjs.com)

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
      ({ username }) => username.length >= 1 || { username: 'Username is required' },
      ({ password }) => password.length >= 8 || { password: 'Password is too short' },
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
## Install

```bash
npm i solid-former
```

## Api

```
const formInstance = createForm(formOptions)
```

### Form options
|option|description|required|
|-|-|-|
|`fields`|Fields of form|yes|
|`validators`|List of validators. One field can also have multiple validators|yes|
|`validateOnInput`|If true it validates on everytime when any of the fields changes. Otherwise it will validate only when submit method is called. Disabled by default |no|
|`stopAtFirstError`|If true it stops at first error. Otherwise it provides all errors. Enabled by default|no|
|`onSubmit()`|Triggered when form.submit() called and validated without errors|no|
|`onChange()`|Triggered when any of the fields change|no|


### Form instance
|property/method|description|
|-|-|
|`fields`| Represents all fields | 
|`isValid`| Tells whether form is valid or not |
|`isTouched`| Tells if at least one of fields has been changed|
|`input()`| Updates one field |
|`reset()`| Resets all values to defaults  |
|`submit()`| Submits form |

## Contributions
Always welcome to people who can improve or add something useful
