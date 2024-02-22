# Project Management Server

## Routes

### Board Routes

| Method | Route                | Description              |
| ------ | -------------------- | ------------------------ |
| GET    | /api/boards          | Returns all boards       |
| GET    | /api/boards/:boardId | Returns a specific board |
| POST   | /api/boards          | Adds a new board         |
| DELETE | /api/boards/:boardId | Deletes a board          |

### List Routes

| Method | Route              | Description             |
| ------ | ------------------ | ----------------------- |
| GET    | /api/lists         | Returns all lists       |
| GET    | /api/lists/:listId | Returns a specific list |
| POST   | /api/lists         | Adds a new list         |
| DELETE | /api/lists/:listId | Deletes a list          |

### Job Routes

| Method | Route            | Description            |
| ------ | ---------------- | ---------------------- |
| GET    | /api/jobs        | Returns all jobs       |
| GET    | /api/jobs/:jobId | Returns a specific job |
| POST   | /api/jobs        | Adds a new job         |
| DELETE | /api/jobs/:jobId | Deletes a job          |

### Role Routes

| Method | Route              | Description             |
| ------ | ------------------ | ----------------------- |
| GET    | /api/roles         | Returns all roles       |
| GET    | /api/roles/:roleId | Returns a specific role |
| POST   | /api/roles         | Adds a new role         |
| DELETE | /api/roles/:roleId | Deletes a role          |

### Auth Routes

| Method | Route               | Description          |
| ------ | ------------------- | -------------------- |
| POST   | /auth/signup        | Creates a new user   |
| POST   | /auth/login         | Logs the user        |
| GET    | /auth/verify        | Verifies the JWT     |
| GET    | /auth/users/:userId | Get user details     |
| PUT    | /auth/users/:userId | Change user password |
| DELETE | /auth/users/:userId | Delete user account  |

## Models

### Board Model

```js
{
  boardName: String,
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  listId: [{type: Schema.Types.ObjectId, ref: 'List'}],
}
```

### List Model

```js
{
  listName: String,
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  boardId: {type: Schema.Types.ObjectId, ref: 'Board'},
  jobId: [{type: Schema.Types.ObjectId, ref: 'Job'}],
}
```

### Job Model

```js
{
  companyName: String,
  logoURL: String,
  jobURL: String,
  jobDescription: String,
  workModel: ['Remote', 'Hybrid', 'On-site'],
  workLocation: String,
  notes: String,
  customLabel: String,
  date: Object,
  starred: Boolean,
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  boardId: {type: Schema.Types.ObjectId, ref: 'Board'},
  listId: {type: Schema.Types.ObjectId, ref: 'List'},
  roleId: {type: Schema.Types.ObjectId, ref: 'Role'},
}
```

### Role Model

```js
{
  roleName: String,
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  boardId: {type: Schema.Types.ObjectId, ref: 'Board'},
  listId: {type: Schema.Types.ObjectId, ref: 'List'},
  jobId: [{type: Schema.Types.ObjectId, ref: 'Job'}],
}
```

### User Model

```js
{
  name: String,
  email: String,
  password: String,
  boardId: [{type: Schema.Types.ObjectId, ref: 'Board'}],
}
```
