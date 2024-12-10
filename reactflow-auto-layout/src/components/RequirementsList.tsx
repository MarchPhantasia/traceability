import React, { useState } from 'react';

interface Requirement {
  id: string;
  name: string;
  content: string;
}

interface RequirementsListProps {
  requirements: Requirement[];
  setRequirements: React.Dispatch<React.SetStateAction<Requirement[]>>;
  selectedRequirements: Requirement[];
  setSelectedRequirements: React.Dispatch<React.SetStateAction<Requirement[]>>;
}

const RequirementsList: React.FC<RequirementsListProps> = ({
  requirements,
  setRequirements,
  selectedRequirements,
  setSelectedRequirements,
}) => {
  const handleCheckboxChange = (requirement: Requirement) => {
    const isSelected = selectedRequirements.some((req) => req.id === requirement.id);
    if (isSelected) {
      setSelectedRequirements(selectedRequirements.filter((req) => req.id !== requirement.id));
    } else {
      setSelectedRequirements([...selectedRequirements, requirement]);
    }
  };

  const handleNameChange = (id: string, value: string) => {
    setRequirements((prev) =>
      prev.map((req) => (req.id === id ? { ...req, name: value } : req))
    );
  };

  const handleContentChange = (id: string, value: string) => {
    setRequirements((prev) =>
      prev.map((req) => (req.id === id ? { ...req, content: value } : req))
    );
  };

  return (
    <div>
      {requirements.map((req) => {
        const isSelected = selectedRequirements.some((r) => r.id === req.id);
        return (
          <div key={req.id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleCheckboxChange(req)}
            />
            <input
              type="text"
              value={req.name}
              onChange={(e) => handleNameChange(req.id, e.target.value)}
              style={{ marginLeft: '10px', width: '60%' }}
            />
            <div style={{ marginTop: '10px' }}>
              <textarea
                value={req.content}
                onChange={(e) => handleContentChange(req.id, e.target.value)}
                rows={4}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RequirementsList;