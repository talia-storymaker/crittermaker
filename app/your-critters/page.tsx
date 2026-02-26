import { Metadata } from "next";
import CritterGrid from "./CritterGrid";

export const metadata: Metadata = {
  title: "Your Critters - 3D CritterMaker",
  description: "View critters you've created using this character creator inspired by Animal Crossing.",
};

export default function Home() {
  return (
    <div className="page">
      <main className="main">
        <div className="header">
          <h1 className="title">Your Critters</h1>
        </div>
        <CritterGrid />
      </main>
    </div>
  );
}
