import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error capturado pelo ErrorBoundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-200 text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-3xl font-black text-[#0e1e3f] mb-4">
              Algo deu errado
            </h1>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Ocorreu um erro inesperado. Por favor, tente recarregar a página
              ou voltar para a página inicial.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 rounded-xl text-left">
                <p className="text-xs font-bold text-red-600 mb-2">
                  Detalhes do erro (apenas em desenvolvimento):
                </p>
                <pre className="text-xs text-red-700 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-[#0e1e3f] text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all"
              >
                Recarregar Página
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all"
              >
                Ir para Início
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
