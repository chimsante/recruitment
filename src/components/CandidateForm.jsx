import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import styles from './CandidateForm.module.css'; 
import supabase from '../services/supabaseClient';
 

const CandidateForm = () => {
    const [candidate, setCandidate] = useState({
        name: '',
        email: '',
        skills: '',
        preferences: '',
        industry: '',
        cv_file: '',
        location: '',
        job_title: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCandidate({ ...candidate, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const processedSkills = candidate.skills.replace(/\s+/g, ', ');
        const processedPreferences = candidate.preferences.replace(/\s+/g, ', ');
        const processedIndustry = candidate.industry.replace(/\s+/g, ', ');

        // Send the data to Supabase
        const { data, error } = await supabase
            .from('candidates')
            .insert([{
                name: candidate.name,
                email: candidate.email,
                skills: processedSkills,
                preferences: processedPreferences,
                industry: processedIndustry,
                cv_file: candidate.cv_file,
                location: candidate.location,
                job_title: candidate.job_title,
            }]);

        if (error) {
            console.error('Error inserting candidate:', error.message);
        } else {
            console.log('Candidate added:', data);
            // Reset form only on successful submission
            setCandidate({
                name: '',
                email: '',
                skills: '',
                preferences: '',
                industry: '',
                cv_file: '',
                location: '',
                job_title: ''
            });
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Candidate Input Form</h2>
            <div className={styles.formGroup}>
                <label>Name:</label>
                <input type="text" name="name" value={candidate.name} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
                <label>Email:</label>
                <input type="email" name="email" value={candidate.email} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
                <label>Skills (separate with spaces):</label>
                <input type="text" name="skills" value={candidate.skills} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
                <label>Preferences (separate with spaces):</label>
                <input type="text" name="preferences" value={candidate.preferences} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
                <label>Industry (separate with spaces):</label>
                <input type="text" name="industry" value={candidate.industry} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
                <label>CV File:</label>
                <input type="text" name="cv_file" value={candidate.cv_file} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
                <label>Location:</label>
                <input type="text" name="location" value={candidate.location} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
                <label>Job Title:</label>
                <input type="text" name="job_title" value={candidate.job_title} onChange={handleChange} />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default CandidateForm;