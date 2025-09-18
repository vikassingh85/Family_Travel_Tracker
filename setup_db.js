import pg from "pg";
import fs from "fs";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "postgres", // Connect to default database first
    password: "20592059",
    port: 5432,
});

async function setupDatabase() {
    try {
        console.log("Connecting to PostgreSQL...");
        await db.connect();

        // Create the world database
        console.log("Creating 'world' database...");
        try {
            await db.query("CREATE DATABASE world;");
            console.log("✅ Database 'world' created successfully!");
        } catch (err) {
            if (err.code === '42P04') {
                console.log("✅ Database 'world' already exists!");
            } else {
                throw err;
            }
        }

        // Close connection to postgres database
        await db.end();

        // Connect to the world database
        const worldDb = new pg.Client({
            user: "postgres",
            host: "localhost",
            database: "world",
            password: "20592059",
            port: 5432,
        });

        await worldDb.connect();
        console.log("Connected to 'world' database...");

        // Read and execute the setup SQL
        const setupSQL = fs.readFileSync('setup_database.sql', 'utf8');
        console.log("Setting up tables and data...");
        await worldDb.query(setupSQL);

        console.log("✅ Database setup completed successfully!");
        console.log("🎉 You can now run your Family Travel Tracker application!");

        await worldDb.end();

    } catch (err) {
        console.error("❌ Error setting up database:", err.message);
        process.exit(1);
    }
}

setupDatabase(); 