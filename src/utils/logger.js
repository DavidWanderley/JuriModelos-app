// Sistema de logs para o frontend

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

const LOG_COLORS = {
  ERROR: '#ef4444',
  WARN: '#f59e0b',
  INFO: '#3b82f6',
  DEBUG: '#8b5cf6',
};

class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.MODE === 'development';
    this.logs = [];
    this.maxLogs = 100; 
  }

  _formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      message,
      data,
      userAgent: navigator.userAgent,
    };
  }

  _saveLog(logEntry) {
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); 
    }
  }

  _consoleLog(level, message, data) {
    if (!this.isDevelopment) return;

    const color = LOG_COLORS[level];
    const emoji = {
      ERROR: '🔴',
      WARN: '🟡',
      INFO: '🔵',
      DEBUG: '🟣',
    }[level];

    console.log(
      `%c${emoji} [${level}] ${message}`,
      `color: ${color}; font-weight: bold;`,
      data || ''
    );
  }

  error(message, data = null) {
    const logEntry = this._formatMessage(LOG_LEVELS.ERROR, message, data);
    this._saveLog(logEntry);
    this._consoleLog(LOG_LEVELS.ERROR, message, data);
    
    if (!this.isDevelopment) {
      this._sendToMonitoring(logEntry);
    }
  }

  warn(message, data = null) {
    const logEntry = this._formatMessage(LOG_LEVELS.WARN, message, data);
    this._saveLog(logEntry);
    this._consoleLog(LOG_LEVELS.WARN, message, data);
  }

  info(message, data = null) {
    const logEntry = this._formatMessage(LOG_LEVELS.INFO, message, data);
    this._saveLog(logEntry);
    this._consoleLog(LOG_LEVELS.INFO, message, data);
  }

  debug(message, data = null) {
    if (!this.isDevelopment) return; 
    
    const logEntry = this._formatMessage(LOG_LEVELS.DEBUG, message, data);
    this._saveLog(logEntry);
    this._consoleLog(LOG_LEVELS.DEBUG, message, data);
  }

  // Logs específicos para ações do usuário
  userAction(action, details = null) {
    this.info(`Ação do usuário: ${action}`, details);
  }

  // Logs específicos para API
  apiRequest(method, url, data = null) {
    this.debug(`API Request: ${method} ${url}`, data);
  }

  apiResponse(method, url, status, data = null) {
    const level = status >= 400 ? LOG_LEVELS.ERROR : LOG_LEVELS.DEBUG;
    const message = `API Response: ${method} ${url} - Status: ${status}`;
    
    const safeData = this.isDevelopment ? data : null;
    
    if (level === LOG_LEVELS.ERROR) {
      this.error(message, safeData);
    } else {
      this.debug(message, safeData);
    }
  }

  // Obter todos os logs
  getLogs() {
    return this.logs;
  }

  // Limpar logs
  clearLogs() {
    this.logs = [];
  }

  // Exportar logs (útil para debug)
  exportLogs() {
    const logsJson = JSON.stringify(this.logs, null, 2);
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Enviar para serviço de monitoramento (placeholder)
  _sendToMonitoring(logEntry) {
    
  }
}

// Instância única (singleton)
const logger = new Logger();

export default logger;
