const fs = require('fs/promises')


async function getbooks(filePath) {
    try {
        const file = (await fs.readFile(filePath= 'books.json', 'utf8')).trim();
        if (!file) {
            throw new Error('File is empty');
        }
        let books=JSON.parse(file)
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
        const book = books.filter(book => book.id === requestedId);
        if (!book) {
            throw new Error('Book with the requested ID not found');
        }
        return book;
    } catch (error) {
        throw new Error(`Error in getBookById: ${error.message}`);
    }
}



async function addBookToLibrary(name) {
    try {
        let books
        try {
                books =JSON.parse(await fs.readFile('books.json', 'utf8'));
        } catch (readError) {
            if (readError.code === 'ENOENT') {
                books = [];
            } else {
                throw new Error(`Error reading or parsing books.json: ${readError.message}`);
            }
        }
        const bookSelected = books.filter(book => book.name === name);
        if (bookSelected.length > 0) {
            throw new Error('Book already exists in the library');
        }
        const newBook = { id: books.length + 1, name: name };
        books.push(newBook);
        await fs.writeFile('books.json', JSON.stringify(books), 'utf8');
        return newBook;
    } catch (error) {
        throw new Error(`Error in addBookToLibrary: ${error.message}`);
    }
}

module.exports = {
    getbooks,
    getBookById,
    addBookToLibrary
};