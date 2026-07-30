import { createTheme } from "@mui/material/styles";

// Shared typography settings
const typography = {
  fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 800 },
  h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
  h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
  h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
  h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
  h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
  subtitle1: { fontWeight: 500 },
  subtitle2: { fontWeight: 500 },
  button: {
    fontFamily: '"Outfit", sans-serif',
    fontWeight: 600,
    textTransform: "none",
  },
};

// Component overrides for a premium feel
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: "12px",
        padding: "8px 20px",
        boxShadow: "none",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0px 4px 12px rgba(99, 102, 241, 0.15)",
          transform: "translateY(-1px)",
        },
        "&:active": {
          transform: "translateY(0)",
        },
      },
      containedPrimary: {
        background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
        color: "#ffffff",
        "&:hover": {
          background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
        },
      },
      outlinedPrimary: {
        borderColor: "#6366f1",
        "&:hover": {
          backgroundColor: "rgba(99, 102, 241, 0.04)",
          borderColor: "#4f46e5",
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: "16px",
        backgroundImage: "none",
        boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.03)",
        border: "1px solid rgba(229, 231, 235, 0.5)",
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: "16px",
        backgroundImage: "none",
        boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.03)",
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          transition: "all 0.2s ease-in-out",
          "& fieldset": {
            borderColor: "rgba(148, 163, 184, 0.3)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(99, 102, 241, 0.5)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#6366f1",
            borderWidth: "2px",
          },
        },
      },
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: {
        borderRadius: "16px",
        boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.03)",
        border: "1px solid rgba(229, 231, 235, 0.5)",
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        backgroundColor: "#f8fafc",
        "& .MuiTableCell-root": {
          color: "#475569",
          fontWeight: 700,
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: "16px",
        borderBottom: "1px solid rgba(229, 231, 235, 0.5)",
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: "20px",
        padding: "8px",
      },
    },
  },
};

// Light theme definition
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366f1", // Indigo
      light: "#818cf8",
      dark: "#4f46e5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#d946ef", // Fuchsia
      light: "#f472b6",
      dark: "#c084fc",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc", // Slate 50
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a", // Slate 900
      secondary: "#64748b", // Slate 500
    },
    divider: "rgba(226, 232, 240, 0.8)",
  },
  typography,
  components,
});

// Dark theme definition
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#818cf8",
      light: "#a5b4fc",
      dark: "#4f46e5",
      contrastText: "#0f172a",
    },
    secondary: {
      main: "#c084fc",
      light: "#d8b4fe",
      dark: "#a855f7",
      contrastText: "#0f172a",
    },
    background: {
      default: "#0b0f19",
      paper: "#111827",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
    },
    divider: "rgba(51, 65, 85, 0.5)",
  },
  typography,
  components: {
    ...components,
    MuiButton: {
      ...components.MuiButton,
      styleOverrides: {
        ...components.MuiButton.styleOverrides,
        containedPrimary: {
          background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
          color: "#0b0f19",
          "&:hover": {
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
          },
        },
        outlinedPrimary: {
          borderColor: "#818cf8",
          "&:hover": {
            backgroundColor: "rgba(129, 140, 248, 0.08)",
            borderColor: "#a5b4fc",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          backgroundImage: "none",
          boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(51, 65, 85, 0.3)",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(51, 65, 85, 0.3)",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#1f2937",
          "& .MuiTableCell-root": {
            color: "#94a3b8",
            fontWeight: 700,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "16px",
          borderBottom: "1px solid rgba(51, 65, 85, 0.3)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            transition: "all 0.2s ease-in-out",
            "& fieldset": {
              borderColor: "rgba(71, 85, 105, 0.5)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(129, 140, 248, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#818cf8",
              borderWidth: "2px",
            },
          },
        },
      },
    },
  },
});
