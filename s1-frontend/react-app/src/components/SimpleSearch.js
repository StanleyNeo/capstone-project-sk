import React, { useState } from 'react';

function SimpleSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResults(data.results || data.courses || []);
      } else {
        setResults([]);
        setError(data.error || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to connect to server');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4 shadow">
      <div className="card-body">
        <h5 className="card-title mb-3">🔍 Search Courses</h5>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search for courses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <button 
              className="btn btn-primary" 
              type="submit"
              disabled={loading || !query.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Searching...
                </>
              ) : 'Search'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger mb-3">
            <small>{error}</small>
          </div>
        )}

        {/* Quick Search Suggestions */}
        <div className="mb-3">
          <small className="text-muted d-block mb-2">Try searching for:</small>
          <div className="d-flex flex-wrap gap-2">
            {['web', 'python', 'ai', 'data', 'react', 'design'].map((term) => (
              <button
                key={term}
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setQuery(term);
                  setTimeout(() => handleSearch({ preventDefault: () => {} }), 100);
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div>
            <h6 className="mb-2">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </h6>
            <div className="list-group">
              {results.slice(0, 5).map((course, index) => (
                <div key={index} className="list-group-item">
                  <h6 className="mb-1">{course.title || course.name}</h6>
                  <p className="mb-1 small text-muted">
                    {course.description?.substring(0, 80)}...
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="badge bg-primary me-1">{course.level}</span>
                      <span className="badge bg-secondary">{course.category}</span>
                    </div>
                    <div className="text-muted small">
                      ⭐ {course.rating || 'N/A'} | 👥 {course.enrolledStudents || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleSearch;