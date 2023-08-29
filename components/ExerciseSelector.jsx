import React, { useEffect, useState } from "react";

const ExerciseSelector = ({ exeOptions, change }) => {
  //   useEffect(() => {
  //     console.log(change);
  //   });
  const [value, setValue] = useState("");

  const handleValue = (event) => {
    let value = event.target.value;
    setValue(value);
    change(value);
  };
  return (
    <>
      <div>
        <select value={value} onChange={handleValue}>
          {exeOptions.map((opt) => {
            return <option name={opt.value}>{opt.label}</option>;
          })}
        </select>
      </div>
    </>
  );
};

export default ExerciseSelector;
