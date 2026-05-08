import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  error?: Error;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Keep this as a console log so developers can still inspect details.
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            padding: 24,
            fontFamily: "system-ui, sans-serif",
            background: "#030014",
            color: "#e2e8f0",
          }}
        >
          <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: "#fff" }}>
            App crashed while rendering
          </h1>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "rgba(255,255,255,0.08)",
              padding: 12,
              borderRadius: 8,
              overflow: "auto",
              color: "#e2e8f0",
            }}
          >
            {String(this.state.error.stack || this.state.error.message)}
          </pre>
          <p style={{ marginTop: 12, opacity: 0.8 }}>
            Fix the error above and refresh.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

