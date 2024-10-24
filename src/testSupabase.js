// testSupabase.js

// Import the createClient function from the Supabase library
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with your URL and Anon Key
const supabaseUrl = 'https://etraredcmfuxkczkxjqo.supabase.co';  // Your Supabase project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0cmFyZWRjbWZ1eGtjemt4anFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyODcyODgsImV4cCI6MjA0Mzg2MzI4OH0.V5lfxq4z0jgX6ETIx567SzWiSJbXqBNoGlDIf5DYuxg';  // Your Supabase Anon Key

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to fetch candidates from the Supabase database
async function fetchCandidates() {
    try {
        // Query the candidates table
        const { data, error } = await supabase
            .from('candidates')  // Specify the table name
            .select('*');  // Select all columns

        // Check for errors
        if (error) {
            throw error;  // If there's an error, throw it to be caught in the catch block
        }

        // Log the fetched data to the console
        console.log('Data fetched', data);  // Output the data
    } catch (err) {
        // Log any errors that occur during the fetch
        console.error('Error fetching candidates:', err.message);  // Output error message
    }
}

// Call the function to execute the fetch
fetchCandidates();
