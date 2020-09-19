# To-Do List API Documentation
Make to-do lists and store information about them

## Get list of to-do list file names
**Request Format:** /lists

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Gets list of to-do list names in array format

**Example Request:** http://localhost:8000/lists

**Example Response:**
*Fill in example response in the ticks*

```
{
  filename: [
    "Sample"
  ]
}

```

**Error Handling:**
N/A

## Gets specific list name and items
**Request Format:** /lists/:name

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Gets specified list name and the items associated with the list

**Example Request:** http://localhost:8000/lists/Sample

**Example Response:**

```json
{
  name: "Sample",
  items: [
    "CSE 154 CP4",
    "CSE 154 Study for Text",
    "CSE 154 Definitely Study"
  ]
}
```

**Error Handling:**
N/A
