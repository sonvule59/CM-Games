import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import "./index.css";
import { HydratedRouter } from "react-router-dom";

hydrateRoot(
    document,
    <StrictMode>
        <HydratedRouter />
    </StrictMode>,
);
