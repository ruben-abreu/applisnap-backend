# Project Management Server

## Routes

### Board Routes

| Method | Route                | Description              |
| ------ | -------------------- | ------------------------ |
| GET    | /api/boards          | Returns all boards       |
| GET    | /api/boards/:boardId | Returns a specific board |
| POST   | /api/boards          | Adds a new board         |
| PUT    | /api/boards/:boardId | Edits a board            |
| DELETE | /api/boards/:boardId | Deletes a board          |

### List Routes

| Method | Route              | Description             |
| ------ | ------------------ | ----------------------- |
| GET    | /api/lists         | Returns all lists       |
| GET    | /api/lists/:listId | Returns a specific list |
| POST   | /api/lists         | Adds a new list         |

### Job Routes

| Method | Route            | Description                 |
| ------ | ---------------- | --------------------------- |
| GET    | /api/jobs        | Returns all jobs            |
| GET    | /api/jobs/:jobId | Returns a specific job      |
| POST   | /api/jobs        | Adds a new job              |
| PUT    | /api/jobs/:jobId | Edits the specified project |
| DELETE | /api/jobs/:jobId | Deletes a job               |

### Role Routes

| Method | Route              | Description             |
| ------ | ------------------ | ----------------------- |
| GET    | /api/roles         | Returns all roles       |
| GET    | /api/roles/:roleId | Returns a specific role |
| POST   | /api/roles         | Adds a new role         |
| DELETE | /api/roles/:roleId | Deletes a role          |

### Auth Routes

| Method | Route                           | Description         |
| ------ | ------------------------------- | ------------------- |
| POST   | /auth/signup                    | Creates a new user  |
| POST   | /auth/login                     | Logs the user       |
| POST   | /auth/upload                    | Upload user photo   |
| GET    | /auth/verify                    | Verifies the JWT    |
| GET    | /auth/users/:userId             | Get user details    |
| PUT    | /auth/users/:userId             | Change user details |
| DELETE | /auth/users/:userId             | Delete user account |
| DELETE | /auth//deleteImage/:imgPublicId | Delete image        |

## Models

### Boards Model

```js
{
  boardName: String,
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  lists: [{type: Schema.Types.ObjectId, ref: 'List'}],
  roles: [{ type: Schema.Types.ObjectId, ref: 'Roles' }],
}
```

### Lists Model

```js
{
  listName: ['Wishlist', 'Applied', 'Interviews', 'Offers', 'Rejected'],
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  boardId: {type: Schema.Types.ObjectId, ref: 'Board'},
  jobs: [{type: Schema.Types.ObjectId, ref: 'Job'}],
}
```

### Jobs Model

```js
{
  companyName: String,
  roleName: String,
  logoURL: String,
  jobURL: String,
  jobDescription: String,
  workModel: ['Remote', 'Hybrid', 'On-site'],
  workLocation: String,
  notes: String,
  customLabel: String,
  date: {
    created: Date,
    applied: Date,
    interviews: [Date],
    offer: Date,
    rejected: Date,
  },
  starred: Boolean,
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  boardId: {type: Schema.Types.ObjectId, ref: 'Board'},
  listId: {type: Schema.Types.ObjectId, ref: 'List'},
  roleId: {type: Schema.Types.ObjectId, ref: 'Role'},
}
```

### Roles Model

```js
{
  roleName: String,
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  boardId: {type: Schema.Types.ObjectId, ref: 'Board'},
  listId: {type: Schema.Types.ObjectId, ref: 'List'},
  jobs: [{type: Schema.Types.ObjectId, ref: 'Job'}],
}
```

### User Model

```js
{
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  imgURL: String,
  boards: [{ type: Schema.Types.ObjectId, ref: 'Boards' }],
  lists: [{ type: Schema.Types.ObjectId, ref: 'Lists' }],
  jobs: [{ type: Schema.Types.ObjectId, ref: 'Jobs' }],
  roles: [{ type: Schema.Types.ObjectId, ref: 'Roles' }],
}
```
