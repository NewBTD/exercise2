import { useEffect, useState, useRef } from "react";
import { getMobileOperatingSystem } from "../utils/getMobileOperatingSystem";
import ExerciseSelector from "../components/ExerciseSelector";
import "./App.css";

function normalize(x, y, z) {
  const len = Math.hypot(x, y, z);
  return [x / len, y / len, z / len];
}

function App() {
  const [motion1, setMotion1] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const motion2 = useRef({
    x: 0,
    y: 0,
    z: 0,
  });

  const [count, setCount] = useState(0);

  const exeProps = [
    { value: "sitUp", label: "ซิทอัพ" },
    { value: "pushUp", label: "วิดพื้น" },
    { value: "jogging", label: "วิ่งจ็อกกิ้ง" },
  ];

  let shaking = {
    x: 0,
    y: 0,
    z: 0,
  };

  useEffect(() => {
    const hypot = Math.hypot(motion1.x, motion1.y, motion1.z);

    if (hypot > 30) {
      if (shaking) {
        const [a, b, c] = normalize(motion1.x, motion1.y, motion1.z);
        console.log("motionx " + motion1.x);
        console.log("motiony " + motion1.y);
        console.log("motionz " + motion1.z);
        const [d, e, f] = normalize(shaking.x, shaking.y, shaking.z);
        // check if [a,b,c] and [d,e,f] are pointing to the same direction by using dot product
        if (Math.abs(a * d + b * e + c * f) < 0.3) {
          shaking = undefined;
        }
      }
      if (!shaking) {
        shaking = {
          x: motion1.x,
          y: motion1.y,
          z: motion1.z,
        };
        console.log("Shaking " + shaking);
        setCount(count + 1);
      }
    } else if (hypot < 20) {
      shaking = undefined;
    }
    // Update new position
    motion2.current = {
      x: motion1.x,
      y: motion1.y,
      z: motion1.z,
    };
  }, [motion1, motion2.current]);

  const [exerciseType, setExerciseType] = useState(exeProps[0].label);

  const handleSetExercise = (e) => {
    setExerciseType(e);
    console.log(e);
  };
  const handleRequestMotion = async () => {
    // window.navigator.vibrate(200);
    const mobile = getMobileOperatingSystem();
    if (mobile === "iOS") {
      if (typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission()
          .then((permissionState) => {
            if (permissionState === "granted") {
              window.addEventListener("devicemotion", (e) => {
                setMotion1({
                  x: e.accelerationIncludingGravity.x,
                  y: e.accelerationIncludingGravity.y,
                  z: e.accelerationIncludingGravity.z,
                });
              });
            }
          })
          .catch(console.error);
      } else {
        // handle regular non iOS 13+ devices
        console.log("Not Supported");
      }
    } else {
      window.addEventListener("devicemotion", (e) => {
        setMotion1({
          x: e.accelerationIncludingGravity.x,
          y: e.accelerationIncludingGravity.y,
          z: e.accelerationIncludingGravity.z,
        });
      });
    }
  };
  return (
    <>
      <ExerciseSelector change={handleSetExercise} exeOptions={exeProps} />
      <button onClick={handleRequestMotion}>Enable motion</button>
      {exerciseType}
      <div>{count}</div>
      {/* <h1>{motion1.x}</h1>
      <h1>{motion1.y}</h1>
      <h1>{motion1.z}</h1> */}
    </>
  );
}

export default App;
