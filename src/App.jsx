import CandidateForm from './components/CandidateForm';
import JobFetcher from './components/JobFetcher'; 
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Job Application System</h1>
      <div>
        <section className="section">
          <h2 className="section-title">Candidate Form</h2>
          <CandidateForm />
        </section>
        <section className="section">
          <h2 className="section-title">Job Management</h2>
          <JobFetcher/>
        </section>
      </div>
    </div>
  );
}

export default App;