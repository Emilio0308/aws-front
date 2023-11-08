import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ChatBox = ({ userName, sendMensage }) => {
  const { currentChat, id: userId } = useSelector((store) => store.user);
  const [chatName, setChatName] = useState();

  useEffect(() => {
    if (currentChat) {
      const nameOfChat = currentChat.chatName.filter(
        (name) => name != userName
      );
      setChatName(nameOfChat);
    }
  }, [currentChat]);

  const hanldeSubmit = (e) => {
    e.preventDefault();
    const msg = e.target.message.value;
    const contactId = currentChat.participants.find((id) => id != userId);
    const chatId = currentChat._id;
    sendMensage({ msg, userId, contactId, chatId });
    e.target.message.value = ''
  };

  return (
    <article className="bg-gray-700 p-2 rounded-md shadow-lg shadow-black grid max-w-xl mx-auto">
      <h4 className="text-white p-3 capitalize">{chatName}</h4>
      <div className="bg-gray-400 w-full">
        <ul className="grid p-3 gap-3 h-[320px] overflow-y-auto">
          {currentChat?.messages.map((msg) => (
            <li
              className={`${
                msg.from == userId
                  ? "bg-green-600 place-self-start"
                  : "bg-blue-600 place-self-end"
              } p-2 rounded-md`}
              key={msg._id}
            >
              {msg.text}
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={hanldeSubmit} className="grid grid-cols-[1fr,_auto] my-4">
        <input className="rounded-md pl-3 outline-none" type="text" id="message" placeholder="mensaje" />
        <button className="p-2 w-[120px]">enviar</button>
      </form>
    </article>
  );
};
export default ChatBox;
