import React, { useState } from 'react';


import axios from 'axios';
 
// Initialize Supabase with your URL and Anon Key

// const supabaseUrl = 'https://etraredcmfuxkczkxjqo.supabase.co';

// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0cmFyZWRjbWZ1eGtjemt4anFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyODcyODgsImV4cCI6MjA0Mzg2MzI4OH0.V5lfxq4z0jgX6ETIx567SzWiSJbXqBNoGlDIf5DYuxg';
 
// // Create a Supabase client

// const supabase = createClient(supabaseUrl, supabaseAnonKey);
 
const JobFetcher = () => {

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState('');
 
    // Debug: Log environment variables on component mount

    React.useEffect(() => {

        console.log('Environment Variables:', {

            ADZUNA_APP_ID: import.meta.env.VITE_ADZUNA_APP_ID,

            ADZUNA_APP_KEY: import.meta.env.VITE_ADZUNA_APP_KEY,

        });

    }, []);
 
    const fetchJobs = async (categoryLabel, experienceLevel, totalJobsToFetch) => {


        let allJobs = [];

        const resultsPerPage = 50;

        const pagesToFetch = Math.ceil(totalJobsToFetch / resultsPerPage);

        console.log('Will fetch pages:', pagesToFetch);
 
        for (let page = 1; page <= pagesToFetch; page++) {

            console.log(`Fetching page ${page} of ${pagesToFetch}`);

            // Construct the base URL properly

            const baseUrl = 'https://api.adzuna.com/v1/api/jobs/gb/search';

            try {

                const response = await axios.get(baseUrl, {

                    params: {

                        app_id: import.meta.env.VITE_ADZUNA_APP_ID,

                        app_key: import.meta.env.VITE_ADZUNA_APP_KEY,



                        what: categoryLabel,

                        // Convert experience level to Adzuna's format if needed

                

                    },

                    headers: {

                        'Content-Type': 'application/json'

                    }

                });
 
                console.log('API Response:', response.data);
 
                if (!response.data || !response.data.results) {

                    console.error('Invalid API response structure:', response.data);

                    throw new Error('Invalid API response structure');

                }
 
                const jobs = response.data.results;

                console.log(`Received ${jobs.length} jobs from API`);
 
                const formattedJobs = jobs.map(job => ({

                    api_source: 'adzuna',

                    external_job_id: job.id,

                    title: job.title,

                    company: job.company?.display_name || 'Unknown Company',

                    location: job.location?.display_name || 'Unknown Location',

                    employment_type: job.contract_time || 'Unknown',

                    required_skills: job.category?.label || '',

                    bonus_skills: null,

                    industry: job.category?.label || '',

                    salary: job.salary_min && job.salary_max ? `${job.salary_min}-${job.salary_max}` : 'Not Specified',

                    description: job.description || '',

                    job_url: job.redirect_url || '',

                    created_at: new Date().toISOString(),

                    external_posted_date: job.created || new Date().toISOString()

                }));
 
                console.log('Formatted jobs:', formattedJobs);

                allJobs = [...allJobs, ...formattedJobs];
 
                if (allJobs.length >= 100) {

                    console.log('Batch of 100 jobs reached, inserting into Supabase');

                    await console.log('alljob' +allJobs);

                    allJobs = [];

                }

            } catch (error) {

                console.error('Error details:', {

                    message: error.message,

                    response: error.response?.data,

                    status: error.response?.status,

                    config: error.config

                });

                throw error;

            }

        }
 
        if (allJobs.length > 0) {

            console.log(`Inserting remaining ${allJobs.length} jobs into Supabase`);

            await console.log('alljob' +allJobs);

        }

    };
 
    // const insertJobsIntoSupabase = async (jobs) => {

    //     console.log('Attempting to insert jobs into Supabase:', jobs.length);

    //     const { data, error } = await supabase.from('jobs').upsert(jobs, {

    //         onConflict: 'external_job_id',

    //         ignoreDuplicates: true

    //     });

    //     if (error) {

    //         console.error('Supabase insertion error:', error);

    //         throw error;

    //     }

    //     console.log('Successfully inserted jobs into Supabase', data);

    // };
 
    const handleFetchJobs = async () => {

        console.log('Starting job fetch process');

        setLoading(true);

        setMessage('Fetching jobs...');
 
        try {

            console.log('Fetching javascript jobs');

            await fetchJobs('javascript', '', 20);

            console.log('Fetching developer jobs');

            await fetchJobs('developer', 'mid_level', 20);

            setMessage('Successfully fetched and stored jobs!');

        } catch (error) {

            console.error('Error in handleFetchJobs:', error);

            setMessage('Error fetching jobs: ' + error.message);

        } finally {

            setLoading(false);

        }

    };
 
    return (

        <div style={{ padding: '20px' }}>

            <button

                onClick={handleFetchJobs}

                disabled={loading}

                style={{

                    padding: '10px 20px',

                    fontSize: '16px',

                    cursor: loading ? 'not-allowed' : 'pointer',

                    backgroundColor: loading ? '#cccccc' : '#007bff',

                    color: 'white',

                    border: 'none',

                    borderRadius: '4px'

                }}

            >

                {loading ? 'Fetching Jobs...' : 'Fetch Jobs'}

            </button>

            {message && (

                <p style={{ marginTop: '10px' }}>{message}</p>

            )}

        </div>

    );

};
 
export default JobFetcher;
 