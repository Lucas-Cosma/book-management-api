# Book Management API

A RESTful Book Management API developed as an individual university assignment using Node.js, Express and SQLite.

The API allows users to manage a personal book collection, track reading progress and filter books by reading status.

## Features

- Retrieve all books.
- Retrieve an individual book by ID.
- Add new books.
- Update existing books.
- Delete books.
- Filter books by reading status.
- Validate book information and reading statuses.
- Store book records using SQLite.
- Automatically create the database table if it does not exist.

## Technologies Used

- Node.js
- Express.js
- SQLite
- JavaScript

## Reading Statuses

Each book can have one of three statuses:

- `to-read`
- `reading`
- `completed`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books` | Retrieve all books |
| GET | `/books/:id` | Retrieve a book by ID |
| GET | `/books?status=reading` | Filter books by status |
| POST | `/books` | Add a new book |
| PUT | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |

## Example Book Object

```json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "year": 2018,
  "status": "completed"
}
```

## Running the Project

### 1. Clone the repository

```bash
git clone https://github.com/Lucas-Cosma/book-management-api.git
cd book-management-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
npm start
```

The API will run at:

`http://localhost:3000`

### 4. Test the API

Visit:

`http://localhost:3000/books`

You can also use Postman or another API client to test the GET, POST, PUT and DELETE endpoints.

## Database

The project uses SQLite to store book records.

The database file is named `database.db`. If it does not exist, the application creates it automatically and creates the `books` table.

Each book contains:
- ID
- Title
- Author
- Publication year
- Reading status

## Author

**Lucas Cosma**

- GitHub: [Lucas-Cosma](https://github.com/Lucas-Cosma)
- LinkedIn: [Lucas Cosma](https://www.linkedin.com/in/lucas-cosma-828867448/)