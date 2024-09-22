const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Sample user data
const user = {
    email: "john@xyz.com",
    roll_number: "ABCD123",
    user_id: "john_doe_17091999"
};

// Helper function to check if a base64 file is valid
const isValidBase64 = (str) => {
    return str && typeof str === 'string' && str.startsWith('data:');
};

// POST method for /bfhl
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    // Initialize response data
    let response = {
        is_success: false,
        user_id: user.user_id,
        email: user.email,
        roll_number: user.roll_number,
        numbers: [],
        alphabets: [],
        highest_lowercase_alphabet: [],
        file_valid: false,
        file_mime_type: '',
        file_size_kb: 0
    };

    if (Array.isArray(data)) {
        response.is_success = true;

        // Process data to separate numbers and alphabets
        data.forEach(item => {
            if (!isNaN(item)) {
                response.numbers.push(item);
            } else if (/^[a-zA-Z]$/.test(item)) {
                response.alphabets.push(item);
            }
        });

        // Find the highest lowercase alphabet
        const lowercaseAlphabets = response.alphabets.filter(char => char === char.toLowerCase());
        if (lowercaseAlphabets.length > 0) {
            response.highest_lowercase_alphabet = [lowercaseAlphabets.sort().pop()];
        }

        // File handling
        if (file_b64 && isValidBase64(file_b64)) {
            response.file_valid = true;
            const mimeType = file_b64.split(';')[0].split(':')[1];
            response.file_mime_type = mimeType;

            // For demonstration, let's assume a fixed file size in KB
            response.file_size_kb = 400; // You may calculate this based on the actual file data
        }
    }

    res.json(response);
});

// GET method for /bfhl
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
