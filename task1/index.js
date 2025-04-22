
import axios from 'axios';
import readline from 'readline';

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const cache = {}; // Cache to store API Requests and Responses
const cacheHours = 24; // Cache duration in hours
const CACHE_DURATION_MS = cacheHours*60*60*1000; // 24 hours in milliseconds

function getFromCache(key) {
    const entry = cache[key];
    if (!entry) return null;
    if (Date.now() > entry.expires) {
        delete cache[key]; // Remove expired entry
        return null;
    }
    return entry.data;
}

function saveToCache(key, data, duration = CACHE_DURATION_MS) {
    cache[key] = {
        data: data,
        expires: Date.now() + duration,
    };
}

// Model for Book
class Book {
    constructor(id, title, authors = [], description) {
        this.id = id;
        this.title = title;
        this.authors = authors;
        this.description = description;
    }


    // Method to get the book title
    getTitle() {
        return this.title;
    }

    // Method to get the book description
    getDescription() {
        return this.description;
    }


    

}


const BaseURL = "https://ejditq67mwuzeuwrlp5fs3egwu0yhkjz.lambda-url.us-east-2.on.aws/api";



// Function to search for a book by title
const SearchBook = async (title) => {
    try {
        // Check if the book is already in the cache
        const cachedBook = getFromCache(title);
        if (cachedBook) {
            console.log('Book found in cache!');
            return cachedBook;
        }
        // Make a POST  request to the /book/search endpoint
        const response = await axios.post(
            `${BaseURL}/books/search`,
            { title: title },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        // Check if the response is successful
        if (response.status === 200) {
            // Create a new Book object with the response data
            const bookData = response.data;
            const book = new Book(
                bookData.id,
                bookData.title,
                bookData.authors,
                bookData.description
            );
            saveToCache(title, book);
            return book;

        } else {
            throw new Error('Book not found');
        }
    }
    catch (error) {
        // Handle errors
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Error response:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
        }
        throw error; // Rethrow the error for further handling
    }
};

// Function to search for an author by ID
const searchAuthor = async (authorId) => {
    try {
        // Check if the author is already in the cache
        const cachedAuthor = getFromCache(authorId);
        if (cachedAuthor) {
            console.log('Author found in cache!');
            return cachedAuthor;
        }

        // Make a get  request to the authors endpoint
        const response = await axios.get(
            `${BaseURL}/authors/${authorId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // Check if the response is successful
        if (response.status === 200) {
            // Return the Author data
            let AuthorID = response.data.id;
            let AuthorFirstName = response.data.firstName;
            let AuthorMiddleI = response.data.middleInitial || ''; // Handle middle initial if present
            let AuthorLastName = response.data.lastName;
            saveToCache(AuthorID, {
                id: AuthorID,
                first_name: AuthorFirstName,
                middle_i: AuthorMiddleI,
                last_name: AuthorLastName,
            });
            // Return the Author data
            return {
                id: AuthorID,
                first_name: AuthorFirstName,
                middle_i: AuthorMiddleI,
                last_name: AuthorLastName,
            };
        } else {
            throw new Error('Book not found');
        }
    }
    catch (error) {
        // Handle errors
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Error response:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
        }
        throw error; // Rethrow the error for further handling
    }
}


async function main() {
    const askForBook = () => {
        r1.question('Enter the book title (or type "exit" to quit): ', async (title) => {
            if (title.toLowerCase() === 'exit') {
                r1.close();
                return;
            }

            try {
                const data = await SearchBook(title);
                console.log('Book found!');
                console.log('Title:', data.getTitle());
                console.log('Description:', data.getDescription());
                
                // Check if authors are present
                if (!data.authors || data.authors.length === 0) {
                    askForBook();
                    return;
                }
                // Fetch details for each author ID
                const authorPromises = data.authors.map(authorId => searchAuthor(authorId));
                const authorDetails = await Promise.all(authorPromises);
                
                // Format author names using the details
                const authorNames = authorDetails.map(author => 
                    `${author.first_name} ${author.middle_i || ''} ${author.last_name}`.trim()
                );
                
                console.log('Authors:', authorNames.join(', '));
            } catch (error) {
                console.error('Error:', error.message);
            }

            // Ask for another book
            askForBook();
        });
    };

    // Start the first prompt
    askForBook();
}

main().catch(err => console.error('Application error:', err));

