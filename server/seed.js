const { db, initDb } = require('./src/config/db');
const bcrypt = require('bcrypt');

initDb();

const email = 'admin@cyberguard.local';
const password = 'admin'; // Simple for demo

setTimeout(() => { // Wait for DB init
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        db.run(`INSERT OR IGNORE INTO users (email, password_hash) VALUES (?, ?)`, [email, hash], function(err) {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`User ${email} created with password '${password}'`);
            }
            // Close db connection? Keep it open process will exit.
        });
    });
}, 1000);
