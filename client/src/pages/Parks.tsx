import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { QUERY_PARKS_BY_STATE } from '../utils/queries';

const STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' }
];

const Parks = () => {
  const [stateCode, setStateCode] = useState('');
  const [getParks, { loading, data, error }] = useLazyQuery(QUERY_PARKS_BY_STATE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stateCode) getParks({ variables: { stateCode } });
  };

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-lg-10">
        <div className="card">
          <h4 className="card-header bg-dark text-light p-2">Find Parks by State</h4>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <select
                className="form-input"
                value={stateCode}
                onChange={e => setStateCode(e.target.value)}
                required
              >
                <option value="">Select a state</option>
                {STATES.map(s => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
              <button className="btn btn-primary mt-2" type="submit">Search</button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error.message}</p>}
            {data?.parksByState?.length > 0 && (
              <div className="mt-3">
                {data.parksByState.map((park: any) => (
                  <div key={park.id} className="card mb-3">
                    <div className="card-body">
                      <h5>{park.fullName}</h5>
                      <p>{park.description}</p>
                      {park.images?.[0]?.url && (
                        <img src={park.images[0].url} alt={park.images[0].altText} style={{maxWidth: '300px'}} />
                      )}
                      <p>
                        <a href={park.url} target="_blank" rel="noopener noreferrer">More Info</a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {data && data.parksByState?.length === 0 && <p>No parks found for this state.</p>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Parks;
