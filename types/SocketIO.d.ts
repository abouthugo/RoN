interface ServerToClientEvents {
  updateMessage: (msg: string) => void;
}

interface ClientToServerEvents {
  message: (msg: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  message: string;
}
