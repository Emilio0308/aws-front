import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  changeCurrentChat,
  changeRoomMeet,
  changeContacts,
} from "../redux/slices/user.slice";
import ChatBox from "./ChatBox";
import { backendconfig } from "../utils/backend";
import { BsCameraVideoFill } from "react-icons/bs";

const connectSocketServer = () => {
  const socket = io("https://api-gateway-g8ad.onrender.com", {
    transports: ["websocket"],
    path: "/chatService/",
  });
  return socket;
};

const ChatsPages = () => {
  const { id, name, currentChat } = useSelector((store) => store.user);

  const [socket] = useState(connectSocketServer());
  const [contacts, setContacts] = useState([]);
  const [online, setOnline] = useState();
  const [socketId, setSocketId] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    setOnline(socket.connected);
  }, [socket]);

  useEffect(() => {
    socket.on("connect", () => {
      setOnline(true);
      setSocketId(socket.id);
    });
  }, [socket]);

  // useEffect(() => {
  //   if (socket.connected == true && id) {
  //     socket.emit("get-all-contacts", id);
  //   }
  // }, [socket.connected, id]);

  // useEffect(() => {
  //   socket.on("get-all-contacts", (allContacts) => {
  //     // console.log(allContacts)
  //     setContacts(allContacts);
  //     dispatch(changeContacts(JSON.stringify(allContacts)))
  //   });
  // }, [socket]);

  useEffect(() => {
    backendconfig
      .get("getContacts")
      .then((res) => {
        const contactsLis = res.data.users.filter(user => user.id != id)
        setContacts(contactsLis);
        dispatch(changeContacts(JSON.stringify(res.data.users)));
      })
      .catch((err) => console.log(err));
  }, []);

  const createOrGetAChat = (contact) => {
    const { id: contactId, name: contactName } = contact;
    socket.emit("create-chat", { id, name, contactId, contactName });
  };

  useEffect(() => {
    socket.on("create-chat", (chat) => {
      dispatch(changeCurrentChat(chat));
      socket.emit("joinRoom", chat._id);
    });
  }, [socket]);

  const sendMensage = ({ msg, userId, contactId, chatId }) => {
    const message = { msg, userId, contactId, chatId };
    socket.emit("chat menssage", message);
  };

  useEffect(() => {
    socket.on("chat menssage", (message) => {
      dispatch(changeCurrentChat(message.currentChat));
    });
  }, [socket]);

  const selecRoomIdMeet = (contactId) => {
    dispatch(changeRoomMeet({ userId: id, contactId }));
  };

  return (
    <section className="max-w-[1200px] mx-auto w-full">
      <div>{online ? "usuario conectado" : "no conectado"}</div>
      <h3 className="text-xl font-medium my-10">Bienvenid@ {name}</h3>
      <section className="grid grid-cols-[1fr,_auto]">
        <aside className="w-full p-3">
          {currentChat ? (
            <ChatBox userName={name} sendMensage={sendMensage} />
          ) : (
            <div className="max-w-xl mx-auto h-full bg-[url('/fondoChat.jpg')] rounded-md bg-cover"></div>
          )}
          {/* <ChatBox userName={name} sendMensage={sendMensage} /> */}
        </aside>
        <aside className="w-48 bg-gray-700 rounded-lg shadow-lg shadow-black min-h-[450px] max-h-[500px] overflow-y-auto grid gap-3 content-start py-4">
          {contacts.map((contact) => (
            <div
              className="grid grid-cols-[1fr,_45px] gap-2 px-1"
              key={contact.id}
            >
              <span
                className="p-2 cursor-pointer capitalize hover:bg-gray-600 w-full text-center text-gray-200"
                onClick={() => createOrGetAChat(contact)}
              >
                {contact.name}
              </span>
              <button
                className="hover:bg-gray-600 text-3xl flex justify-center items-center"
                onClick={() => selecRoomIdMeet(contact.id)}
              >
                <BsCameraVideoFill />
              </button>
            </div>
          ))}
        </aside>
      </section>
    </section>
  );
};
export default ChatsPages;
