const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let count = 0;
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/count', (req, res) => {
    res.json({ count });
    }
);

app.post('/api/increment', (req, res) => {
    amount = req.body.amount || 1;
    if (amount < 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    count += amount;
    res.json({ count });
    }
);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    }
);
