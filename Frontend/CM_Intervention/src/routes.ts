import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    // Top-level hub
    index("./Componets/homeOfHomePages.jsx"),
    route("/leisure", "./Componets/leisureHome.jsx"),
    route("/office", "./Componets/OfficeGameStart.jsx"),
    route("/mindfulness-home", "./Componets/mindfulnessHome.jsx"),
    route("/mindfulness", "./Componets/mindfulnessGame.tsx"),
    route("/transport-home", "./Componets/TransportGameStart.jsx"),

    // Individual routes for each mini-game
    route("/outdoors", "./Componets/outdoorsActivities.jsx"),
    route("/rock", "./Componets/rockClimbing.jsx"),
    route("/walk", "./Componets/WalkingActivity.tsx"),
    route("/office/test", "./Componets/OfficeGame.jsx"),
    route("/swim", "./Componets/SwimmingActivity.tsx"),
    route("/indoor-domestic", "./Componets/IndoorDomesticActivity.tsx"),
    route("/domestic-home", "./Componets/domesticHome.jsx"),
    route("/outside-domestic", "./Componets/outsideDomestic.jsx"),
    route("/transport", "./Componets/TransportGame.jsx"),
    route("/parking", "./Componets/ParkingLot.jsx"),
    route("/transport2", "./Componets/TransportGame2.jsx"),
] satisfies RouteConfig;
