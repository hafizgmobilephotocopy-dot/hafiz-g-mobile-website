import React, { useState } from 'react';
import { Search, Package, Clock, CheckCircle, AlertCircle, MapPin, User, Hash } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './TrackStatus.css';

const PHASES = [
  'Inspection Service',
  'Payment Phase',
  'Verification Phase (Buyer/Seller Bio)',
  'Transferred to Excise',
  'Done'
];

const TrackStatus = () => {
  const [chassisNumber, setChassisNumber] = useState('');
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!chassisNumber.trim()) return;

    setLoading(true);
    setError(null);
    setApplication(null);

    const { data, error } = await supabase
      .from('vehicle_transfers')
      .select('*')
      .eq('chassis_number', chassisNumber.trim())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        setError('No application found with this Chassis Number.');
      } else {
        setError('An error occurred while fetching the status.');
      }
    } else {
      setApplication(data);
    }
    setLoading(false);
  };

  const currentPhaseIndex = application ? PHASES.indexOf(application.status) : -1;

  return (
    <div className="track-page container">
      <div className="track-header text-center">
        <h1 className="text-gradient">Track Your Vehicle Transfer</h1>
        <p>Enter your vehicle's Chassis Number to check real-time status</p>
      </div>

      <div className="track-container glass">
        <form onSubmit={handleTrack} className="track-form">
          <div className="track-input-wrapper">
            <Hash className="input-icon" size={24} />
            <input 
              type="text" 
              placeholder="Enter Chassis Number (e.g. 123456...)" 
              value={chassisNumber}
              onChange={(e) => setChassisNumber(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Track Status'}
          </button>
        </form>

        {error && (
          <div className="track-error flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {application && (
          <div className="track-result animate-fade-in">
            <div className="track-result-header">
              <div className="customer-info">
                <div className="info-item">
                  <User size={16} />
                  <span>{application.customer_name}</span>
                </div>
                <div className="info-item">
                  <Package size={16} />
                  <span>Vehicle Transfer Service</span>
                </div>
              </div>
              <div className="status-badge-large">
                {application.status}
              </div>
            </div>

            <div className="progress-tracker">
              {PHASES.map((phase, index) => {
                const isCompleted = index < currentPhaseIndex;
                const isCurrent = index === currentPhaseIndex;
                
                return (
                  <div key={phase} className={`progress-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                    <div className="step-marker">
                      {isCompleted ? <CheckCircle size={20} /> : index + 1}
                    </div>
                    <div className="step-content">
                      <p className="step-title">{phase}</p>
                      {isCurrent && <p className="step-status">In Progress</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {application.status === 'Done' && application.registration_number && (
              <div className="done-card glass">
                <CheckCircle size={40} className="text-green" />
                <div>
                  <h3>Transfer Complete!</h3>
                  <p>Your new registration number is: <strong>{application.registration_number}</strong></p>
                </div>
              </div>
            )}

            <div className="track-footer">
              <div className="update-time">
                <Clock size={14} />
                <span>Last updated: {new Date(application.updated_at).toLocaleString()}</span>
              </div>
              <div className="location-info">
                <MapPin size={14} />
                <span>Shadman, Lahore Office</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackStatus;
