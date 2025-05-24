import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import WeatherWidget from "./WeatherWidget";
import "./Dashboard.css";

const Dashboard = ({ user }) => {
  const [patients, setPatients] = useState([]);
  const [showData, setShowData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/patients')
      .then(response => {
        setPatients(response.data);
        console.log(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleBedClick = async (id) => {
    await axios.get(`http://localhost:5000/api/patients/${id}`)
      .then(response => {
        setShowData(response.data);
        console.log(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  return (
    <div className="container">
      <h1>Welcome, {user?.username}!</h1>

      <div className="weather-section">
        <WeatherWidget />
      </div>

      {user?.role === "admin" && (
        <div>
          <h3>Admin Dashboard - Bed Status</h3>
          <div className="grid-container">
            {patients.map((patient, i) => {
              const statusClass =
                patient.status === "dry" ? "green" :
                patient.status === "moderate" ? "yellow" : "red";

              return (
                <div
                  key={patient._id}
                  className={`bed ${statusClass}`}
                  onClick={() => handleBedClick(patient._id)}
                >
                  Bed {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showData && (
        <div className="patient-details">
          <h2>Patient Details</h2>
          <p><strong>Name:</strong> {showData.name}</p>
          <p><strong>Age:</strong> {showData.age}</p>
          <p><strong>Admit Date:</strong> {showData.admitDate}</p>
          <p><strong>Diaper Changes:</strong> {showData.diaperChanges}</p>
          <p><strong>Next Change:</strong> {showData.nextChange}</p>
          <p><strong>Nurse:</strong> {showData.nurse}</p>
          <p><strong>Contact:</strong> {showData.contact}</p>
          <p><strong>Status:</strong> {showData.statusText}</p>
        </div>
      )}

      {user?.role === "doctor" && <p>Doctor's Panel: View and manage reports.</p>}
      {user?.role === "nurse" && <p>Nurse's Section: Update diaper status.</p>}

      <button
        className="logout-button"
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/");
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
