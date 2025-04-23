Your Task
Create a web server and website with some basic functionality.
This task should take under an hour to complete.
Requirements

1. The website should have one website page on the root “/” endpoint
a. This page should display a number count.
b. The count should start at 0 and persist its value across page reloads.
c. The page should have a button labeled “Increment”
i. The button should increment the count by one.
d. The page should have a text field labeled “Multiplier”
e. The page should have a button labeled “Multiply”
i. The button should increment the count so that it is the result of the multiplier
multiplied by the current count.
ii. Eg count is 4 and multiplier is 7
1. The multiply button should make the count 28
2. The website should have a post route on the “/increment” endpoint
a. This route should increment the count by a value that is passed to the endpoint in the
body of the request
b. It should then return what the new count is
c. This route should be what the button uses to increment the count
d. This route should validate the body and return an error when the body is invalid
3. The website should have a get route on the “/count” endpoint
a. This route should return the current count
-------------------
4. There should not be a “/multiply” endpoint, the above two endpoints are enough to create the
functionality for the multiply button
5. DO NOT use any UI framework like react or vue, use only vanilla javascript(or typescript), html,
and css.
6. The only required set up to start the server should be “npm install” and “npm start”