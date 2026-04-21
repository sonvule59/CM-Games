import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    // Top-level hub
    index("./Componets/homeOfHomePages.tsx"),
    route("/leisure", "./Componets/leisureHome.tsx"),
    route("/office", "./Componets/OfficeGameStart.tsx"),
    route("/mindfulness-home", "./Componets/mindfulnessHome.tsx"),
    route("/mindfulness", "./Componets/mindfulnessGame.tsx"),
    route("/transport-home", "./Componets/TransportGameStart.tsx"),

    // Individual routes for each mini-game
    route("/outdoors", "./Componets/outdoorsActivities.tsx"),
    route("/rock", "./Componets/rockClimbing.tsx"),
    route("/walk", "./Componets/WalkingActivity.tsx"),
    route("/office/test", "./Componets/OfficeGame.tsx"),
    route("/swim", "./Componets/SwimmingActivity.tsx"),
    route("/indoor-domestic", "./Componets/IndoorDomesticActivity.tsx"),
    route("/domestic-home", "./Componets/domesticHome.tsx"),
    route("/outside-domestic", "./Componets/outsideDomestic.tsx"),
    route("/transport", "./Componets/TransportGame.tsx"),
    route("/parking", "./Componets/ParkingLot.tsx"),
    route("/transport2", "./Componets/TransportGame2.tsx"),
] satisfies RouteConfig;
