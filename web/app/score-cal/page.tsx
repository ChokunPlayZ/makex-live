"use client";
import { useState } from "react";

export default function Home() {
  const [redTeam, setRedTeam] = useState({
    remainingPincount: 0,
    recycledPincount: 0,
    cubeInDSCCount: 0,
    cubeInDCCCount: 0,
    inSideCount: 0,
    alphabetCombo: false,
    flagCount: 0,
    penaltyCount: 0,
  });

  const [blueTeam, setBlueTeam] = useState({
    remainingPincount: 0,
    recycledPincount: 0,
    cubeInDSCCount: 0,
    cubeInDCCCount: 0,
    inSideCount: 0,
    alphabetCombo: false,
    flagCount: 0,
    penaltyCount: 0,
  });

  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);

  const calculateScore = () => {
    // Calculation logic (same as before)
  };

  return (
    <main id="main">
      <section className="breadcrumbs">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h2>MakeX Challenge 2023 Score Calculator</h2>
          </div>
        </div>
      </section>

      <section className="inner-page">
        <div className="container mx-auto p-8">
          <h3>Red Team</h3>
          {/* Red Team input fields */}
          {/* Example input field */}
          <div className="mb-4">
            <label>Pins Remaining</label>
            <input
              type="number"
              value={redTeam.remainingPincount}
              onChange={(e) =>
                setRedTeam({ ...redTeam, remainingPincount: parseInt(e.target.value) })
              }
              className="form-control"
            />
          </div>
          {/* Add similar input fields for other Red Team properties */}

          <h3>Blue Team</h3>
          {/* Blue Team input fields */}
          {/* Example input field */}
          <div className="mb-4">
            <label>Pins Remaining</label>
            <input
              type="number"
              value={blueTeam.remainingPincount}
              onChange={(e) =>
                setBlueTeam({ ...blueTeam, remainingPincount: parseInt(e.target.value) })
              }
              className="form-control"
            />
          </div>
          {/* Add similar input fields for other Blue Team properties */}

          <button className="btn btn-primary" onClick={calculateScore}>
            Calculate Score
          </button>

          {showResult && (
            <div className="mt-8">
              <h2>{result}</h2>
              {/* Display individual team scores and other information */}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
