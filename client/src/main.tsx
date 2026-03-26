import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import App from "./App";
import "./index.css";

posthog.init("phc_C8ElVVGd9S91JoYZUezxdggS3xzEV8a2Dl5GMCC8qrh", {
  api_host: "https://us.i.posthog.com",
  person_profiles: "identified_only",
  capture_pageview: true,
  capture_pageleave: true,
});

createRoot(document.getElementById("root")!).render(<App />);
