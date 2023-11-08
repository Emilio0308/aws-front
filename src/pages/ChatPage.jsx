import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const ChatPage = () => {
  const connectSocketServer = () => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      path: "/my-custom-path/",
    });
    return socket;
  };

  const [socket] = useState(connectSocketServer());
  const [socketId, setSocketId] = useState();
  const [online, setOnline] = useState()
  const [chatId, setChatId] = useState("6541d444288dd1200a058a76");
  const [userId, setUserId] = useState(null);
  const listMessages = useRef(null);

  useEffect(() => {
    setOnline(socket.connected);
  }, [socket]);

  useEffect(() => {
    socket.on("connect", () => {
      setOnline(true);
      setSocketId(socket.id)
    });
  }, [socket]);

  useEffect(() => {
    if (socket.connected == true && chatId) {
      socket.emit("joinRoom", chatId);
    }
  }, [socket.connected, chatId]);

  const sendMensage = (e) => {
    e.preventDefault();
    const msg = e.target.chatBox.value;
    const message = {
      msg,
      userId,
      socketId,
      chatId,
    };
    socket.emit("chat menssage", message);
  };

  useEffect(() => {
    socket.on("chat menssage", (message) => {
      console.log(message);
      //manejo del error
      const item = `<li class="text-red-600">${message.msg}</li>`;
      listMessages.current.innerHTML += item;
    });
  }, [socket]);

  useEffect(() => {
    socket.on("getMessages", (message) => {
      let item = ``;
      message.map((msg) => {
        item += `<li title={${msg.from}} class="text-red-600">${msg.text}</li>`;
      });
      listMessages.current.innerHTML += item;
    });
  }, [socket]);
  return (
    <section className="w-[480px] h-[600px] ml-20 px-3 bg-gray-500 grid grid-rows-[1fr,_auto]">
      <div>
        <ul ref={listMessages}></ul>
      </div>
      <form
        onSubmit={sendMensage}
        className="self-end grid gap-5 grid-cols-2 p-4"
      >
        <input
          className="outline-none px-2"
          id="chatBox"
          type="text"
          placeholder="mensaje"
        />
        <button>enviar</button>
      </form>
    </section>
  );
};
export default ChatPage;
