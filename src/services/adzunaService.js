import axios from 'axios';
import { supabase } from './supabaseClient';

// Adzuna API Configuration
const adzunaAppId = import.meta.env.VITE_ADZUNA_APP_ID;
const adzunaAppKey = import.meta.env.VITE_ADZUNA_APP_KEY;
const resultsPerPage = 50;

async function fetchJobs(categoryLabel, experienceLevel, totalJobsToFetch) {
    let allJobs = [];
    const pagesToFetch = Math.ceil(totalJobsToFetch / resultsPerPage);
    let totalFetchedJobs = 0;

    for (let page = 1; page <= pagesToFetch; page++) {
        if (totalFetchedJobs >= totalJobsToFetch) break;

        const url = `http://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=1ff37397&app_key=6a67846a29d77c178adc4f37649fc892&results_per_page=20&what=javascript%20developer&content-type=application/json;`

        try {
            const response = await axios.get(url);
            if (!response.data || !response.data.results) {
                console.error('Invalid API response structure:', response);
                continue;
            }

            const jobs = response.data.results;
            totalFetchedJobs += jobs.length;

            allJobs = allJobs.concat(jobs.map(job => ({
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
            })));

            // Insert jobs into Supabase in batches
            if (allJobs.length >= 100) {
                await insertJobsIntoSupabase(allJobs);
                allJobs = [];
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error; // Propagate the error
        }
    }

    // Insert any remaining jobs
    if (allJobs.length > 0) {
        await insertJobsIntoSupabase(allJobs);
    }
}

async function insertJobsIntoSupabase(jobs) {
    const { error } = await supabase.from('jobs').insert(jobs);
    if (error) {
        console.error('Error inserting jobs:', error);
        throw error;
    }
    console.log(`Successfully inserted ${jobs.length} jobs into the database.`);
}

export async function fetchAndInsertMarketingAndDeveloperJobs() {
    if (!adzunaAppId || !adzunaAppKey) {
        throw new Error('Adzuna API credentials are not configured');
    }

    try {
        // Fetch 100 mid-senior marketing jobs
        await fetchJobs('marketing', 'mid-senior', 100);

        // Fetch 100 mid-senior developer jobs
        await fetchJobs('developer', 'mid-senior', 100);
    } catch (error) {
        console.error('Error in fetchAndInsertMarketingAndDeveloperJobs:', error);
        throw error; // Propagate the error to the component
    }
}