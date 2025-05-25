import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./PatientDetail.css";

const PatientDetail = () => {
  const [humidity, setHumidity] = useState(null); //Temporary variable for humidity
  const [place, setPlace] = useState(null); //Temporary variable for place
  const [patients, setPatients] = useState([]);
  const [patientIndex, setPatientIndex] = useState(null);
  const [patient, setPatient] = useState(null);
  const { id } = useParams(); // MongoDB ID
  const navigate = useNavigate();

   useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/sensor");
        setHumidity(res.data.humidity);
        setPlace(res.data.place);
      } catch (err) {
        console.error("Error fetching sensor data", err);
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);



  useEffect(() => {
    axios.get('http://localhost:5000/api/patients')
      .then((response) => {
        const data = response.data;
        setPatients(data);

        // Find index of patient with the given MongoDB id
        const index = data.findIndex((p) => p._id === id);
        if (index !== -1) {
          setPatientIndex(index + 1); // human-readable bed number (1-based)
          setPatient(data[index]);
        } else {
          setPatient(null);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [id]);

  if (!patient) return <p style={{ textAlign: "center" }}>Patient not found!</p>;

  return (
    <div className="patient-container">
      <h2>Diaper Status Report - Bed {patientIndex}</h2>
      <p><strong>Patient Name:</strong> {patient.name}</p>
      <p><strong>Age:</strong> {patient.age}</p>
      <p><strong>Date of Admit:</strong> {patient.admitDate}</p>
      <p><strong>Number of Diaper Changes:</strong> {patient.diaperChanges}</p>
      <p><strong>Time Until Next Diaper Change:</strong> {patient.nextChange}</p>
      <p><strong>Nurse Name:</strong> {patient.nurse}</p>
      <p><strong>Contact Number:</strong> {patient.contact}</p>
      <p className={`status ${patient.status}`}>{patient.statusText}</p>
      <p>🌫️ Humidity: {humidity !== null ? `${humidity}%` : "Loading..."}</p>
      <p>
        🌍 Place:{" "}
        {place ? `${place.city}, ${place.district}` : "Loading..."}
      </p>

      <br />
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default PatientDetail;
