class GhostSocket {
  constructor() {
    this.socket = null;
    this.callbacks = [];
    this.reconnectTimer = null;
    this.isConnecting = false;
    this.manualDisconnect = false;

    const apiUrl = (
      import.meta.env.VITE_API_URL ||
      "http://192.168.68.106:8000"
    ).replace(/\/$/, "");

    this.apiUrl = apiUrl;

    this.wsUrl = apiUrl
      .replace(/^https:\/\//i, "wss://")
      .replace(/^http:\/\//i, "ws://") + "/ws";
  }

  connect() {
    if (this.manualDisconnect) {
      return;
    }

    if (
      this.socket &&
      (
        this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING
      )
    ) {
      return;
    }

    if (this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    console.log(
      "Connecting to Ghost Nexus WebSocket:",
      this.wsUrl
    );

    try {
      this.socket = new WebSocket(
        this.wsUrl
      );

      this.socket.onopen = () => {
        this.isConnecting = false;

        console.log(
          "Ghost Nexus WebSocket Connected"
        );

        this.emit({
          type: "connection",
          connected: true,
        });

        this.send({
          type: "status",
        });
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(
            event.data
          );

          console.log(
            "Ghost Nexus WS:",
            data
          );

          this.callbacks.forEach(
            (callback) => {
              try {
                callback(data);
              } catch (error) {
                console.error(
                  "WebSocket callback error:",
                  error
                );
              }
            }
          );
        } catch (error) {
          console.error(
            "Invalid WebSocket message:",
            error
          );
        }
      };

      this.socket.onerror = (error) => {
        console.error(
          "Ghost Nexus WebSocket error:",
          error
        );

        this.isConnecting = false;

        this.emit({
          type: "connection",
          connected: false,
        });
      };

      this.socket.onclose = () => {
        this.isConnecting = false;

        console.log(
          "Ghost Nexus WebSocket disconnected"
        );

        this.socket = null;

        this.emit({
          type: "connection",
          connected: false,
        });

        if (!this.manualDisconnect) {
          this.scheduleReconnect();
        }
      };
    } catch (error) {
      this.isConnecting = false;

      console.error(
        "WebSocket connection failed:",
        error
      );

      this.socket = null;

      this.emit({
        type: "connection",
        connected: false,
      });

      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (
      this.manualDisconnect ||
      this.reconnectTimer
    ) {
      return;
    }

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;

      this.connect();
    }, 3000);
  }

  send(data) {
    if (
      this.socket &&
      this.socket.readyState ===
        WebSocket.OPEN
    ) {
      this.socket.send(
        JSON.stringify(data)
      );

      return true;
    }

    console.warn(
      "Ghost Nexus WebSocket is not connected"
    );

    return false;
  }

  subscribe(callback) {
    if (
      typeof callback !== "function"
    ) {
      return () => {};
    }

    this.callbacks.push(callback);

    return () => {
      this.callbacks =
        this.callbacks.filter(
          (cb) => cb !== callback
        );
    };
  }

  emit(data) {
    this.callbacks.forEach(
      (callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(
            "Ghost Nexus socket callback error:",
            error
          );
        }
      }
    );
  }

  disconnect() {
    this.manualDisconnect = true;

    if (this.reconnectTimer) {
      clearTimeout(
        this.reconnectTimer
      );

      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.isConnecting = false;
  }

  reconnect() {
    this.manualDisconnect = false;
    this.disconnect();
    this.manualDisconnect = false;
    this.connect();
  }
}

const socket = new GhostSocket();

socket.connect();

export default socket;