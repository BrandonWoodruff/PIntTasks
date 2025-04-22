Create a command line application that interfaces with an existing API.
This task should take under an hour to complete.
Requirements

1. Prompt the user for a string input
2. Ping the /books/search endpoint with the string as the title value
3. If the book is found
a. Pings the /authors/:authorId endpoint for each author id of the book
b. Retrieves the names of each author
4. Then displays the book title, description, and the full name and middle initial of the authors.
a. OR if the book could not be found indicate that the book could not be found
5. Ask the user for input again and repeat indefinitely
-------------------
6. Additionally pretend we are being charged for this API per request
a. Cache all API requests and responses in server
b. A request and response should be invalidated from the cache after a set amount of time
c. The default time should be 24 hours, but let it be easily adjustable
7. The only required set up to start the program should be “npm install” and “npm start”

Documentation
https://documenter.getpostman.com/view/15757300/UzXNVJCg
Make sure to look at all the examples:

Click at red underline on documentation page to view all example across both endpoints

Notes

● All example requests in the documentation are fully functional and will work as described if
passed the same data.
● All other requests will return gibberish, but still be fully valid according to the schema.
● /books/search Has a 50% of returning a book, and a 50% chance of failing
○ This is completely random meaning for the string “lkajs” you could get book not found,
then do it again and find a book.

● /authors/:authorId will return a random author name for any authorId