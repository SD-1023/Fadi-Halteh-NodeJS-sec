const fs = require('fs/promises')



async function getbooks(filePath) {
    try {
        const fileContent = await fs.readFile(filePath= 'books.json', 'utf8');
        const trimmedContent = fileContent.trim();

        if (!trimmedContent) {
            throw new Error('File is empty');
        }
        let books=JSON.parse(trimmedContent)
        if (!books || books.length === 0) {
            throw new Error('File does not contain any books');
        }
        return books;
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error('File does not exist');
        }
        throw new Error(`Error reading or parsing the file: ${error.message}`);
    }
}

async function getBookById(requestedId) {
    try {
        const books = await getbooks('books.json');

        const book = books.find(book => book.id === requestedId);

        if (!book) {
            throw new Error('Book with the requested ID not found');
        }

        return [book];
    } catch (error) {
        throw new Error(`Error in getBookById: ${error.message}`);
    }
}



async function addBookToLibrary(name) {
    try {
        // Read the existing books from 'books.json' or create an empty array
        let books;
        try {
            const fileContent = await fs.readFile('books.json', 'utf8');
            books = JSON.parse(fileContent);
        } catch (readError) {
            if (readError.code === 'ENOENT') {
                // 'books.json' doesn't exist, create an empty array
                books = [];
            } else {
                // Handle other read errors
                throw new Error(`Error reading or parsing books.json: ${readError.message}`);
            }
        }

        // Check if a book with the same name already exists
        const bookSelected = books.filter(book => book.name === name);
        if (bookSelected.length > 0) {
            throw new Error('Book already exists in the library');
        }

        // Add the new book to the library
        const newBook = { id: books.length + 1, name: name };
        books.push(newBook);

        // Write the updated books array back to 'books.json'
        await fs.writeFile('books.json', JSON.stringify(books), 'utf8');

        return newBook;
    } catch (error) {
        // Handle any other errors
        throw new Error(`Error in addBookToLibrary: ${error.message}`);
    }
}

module.exports = {
    getbooks,
    getBookById,
    addBookToLibrary
};