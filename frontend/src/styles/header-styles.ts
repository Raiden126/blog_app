import { Styles } from "./homepage-styles";

export const headerStyles: Styles = {
    appBar: {
        position: "sticky",
        bgcolor: "#404040"
    },
    tabContainer: {
        width: "100%",
        margin: "auto",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    authButton: {
        ml: 2,
        bgcolor: "#d27e20",
        color: "white",
        borderRadius: 20,
        width: 80,
        ":hover": {
            bgcolor: "#ff9f00"
        }
    },
    addLink: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        position: "absolute",
        right: "40%",
        width: "300px",
        padding: "5px",
        ":hover": {
            bgcolor: "rgba(0,0,0,0.5)",
            borderRadius: 10,
            cursor: "pointer"
        }
    }
}