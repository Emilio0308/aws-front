import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { BsCameraVideoFill, BsFillTelephoneXFill } from "react-icons/bs";
import { backendconfig } from "../utils/backend";

const VideoCall = () => {
  const { currentRoomMeet, id, contacts, email, name } = useSelector(
    (store) => store.user
  );

  const connectSocketServer = () => {
    const socket = io.connect("https://call-service-uxn7.onrender.com", {
      transports: ["websocket"],
      query: { userId: id },
    });
    return socket;
  };

  const iceServers = {
    iceServer: {
      urls: "stun:stun.l.google.com:19302",
    },
  };

  const [pc, setPc] = useState(new RTCPeerConnection(iceServers));
  const [streamOn, setStreamO] = useState(false);
  const [socket] = useState(connectSocketServer());
  const [online, setOnline] = useState();
  const [localeStream, setlocaleStream] = useState();
  const [roomMeetData, setRoomMeetData] = useState({});
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setOnline(true);
    });
  }, [socket]);

  const hangUp = () => {
    socket.emit("leave-room", roomMeetData);
    location.reload();
  };

  const updateCurrentRooMeet = (response) => {
    const newRoomMeet = {
      roomId: response.id,
      userId: id,
      contactId: currentRoomMeet.contactId,
    };
    const contactCalling = contacts.find(
      (x) => x.id == currentRoomMeet.contactId
    );
    setRoomMeetData(newRoomMeet);

    backendconfig
      .post("sendMessage/", {
        email: contactCalling.email,
        message: `${name} te esta invitando a un video llamada`,
        subject: "unete a esta video llamada",
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  const connectToRoom = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(async (stream) => {
        client.srcObject = stream;
        await client.play();
        setlocaleStream(stream);
        socket.emit(
          "join",
          { ...currentRoomMeet, userId: id },
          updateCurrentRooMeet
        );
      });
    setStreamO(!streamOn);
  };

  useEffect(() => {
    if (currentRoomMeet) {
      connectToRoom();
    }
  }, [currentRoomMeet]);

  function addRemoteMediaStream(event) {
    if (event.streams && event.streams[0]) {
      console.log(event.streams[0]);
      guest.srcObject = event.streams[0];
      setIsCalling(true);
    } else {
      if (!inboundStream) {
        inboundStream = new MediaStream();
        guest.srcObject = inboundStream;
      }
      inboundStream.addTrack(event.track);
    }
    setStreamO(!streamOn);
  }

  function generateIceCandidate(event) {
    if (event.candidate) {
      var candidate = {
        type: "candidate",
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
      };
      console.log("emitiendo candidate: ", candidate);
      socket.emit("candidate", candidate);
    }
    setStreamO(!streamOn);
  }

  useEffect(() => {
    socket.on("active-room", (room) => {
      console.log(room);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("join", (room) => {
      if (localeStream) {
        pc.ontrack = addRemoteMediaStream;
        pc.onicecandidate = generateIceCandidate;
        pc.addTrack(localeStream.getTracks()[0], localeStream);
        // pc.addTrack(localeStream.getTracks()[1], localeStream);
        pc.createOffer().then((description) => {
          pc.setLocalDescription(description);
          console.log("creando offer y descripcion local:", description);
          socket.emit("offer", description);
          setStreamO(!streamOn);
        });
      }
    });

    socket.on("offer", (offer) => {
      if (localeStream) {
        pc.ontrack = addRemoteMediaStream;
        pc.onicecandidate = generateIceCandidate;
        pc.setRemoteDescription(new RTCSessionDescription(offer));
        pc.addTrack(localeStream.getTracks()[0], localeStream);
        // pc.addTrack(localeStream.getTracks()[1], localeStream);
        pc.createAnswer().then((description) => {
          pc.setLocalDescription(description);
          console.log(
            "creando answer y descripcion remota y local",
            description,
            pc.remoteDescription
          );
          socket.emit("answer", description);
          setStreamO(!streamOn);
        });
      }
    });
  }, [socket, localeStream, pc]);

  useEffect(() => {
    socket.on("answer", (answer) => {
      pc.setRemoteDescription(new RTCSessionDescription(answer));
      console.log("escuchando answer y creando descripcion remota");
      setStreamO(!streamOn);
    });
  }, [socket, pc]);

  useEffect(() => {
    socket.on("candidate", (event) => {
      var iceCandidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate,
      });
      pc.addIceCandidate(iceCandidate);
      setStreamO(!streamOn);
    });
  }, [socket]);

  return (
    <section className="mb-20 w-full max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl tracking-[4px] font-semibold py-3 text-cyan-800">
          WELCOME TO TRACK-MEDIA
        </h2>
        <div className="">
          <img className="h-[90px]" src="/logo2.png" alt="Track-Media-Logo" />
        </div>
      </div>
      <hr className="h-[3px] bg-gray-700 mb-5" />
      <div id="dashboard">
        <div className="capitalize text-xl font-medium flex items-center gap-3 text-gray-700">
          {online ? "conectado" : "desconectado"}
          <div
            className={`w-[20px] h-[20px] rounded-full ${
              online ? "bg-green-500" : "bg-red-600"
            }`}
          ></div>
        </div>
      </div>
      <div
        id="stream"
        className="relative h-[520px] bg-gray-700 my-5 flex justify-center items-center rounded-2xl shadow-lg shadow-black"
      >
        <video
          style={{ width: 640, height: 480 }}
          className="rounded-lg bg-black"
          id="guest"
          autoPlay
        ></video>
        <div
          className={`text-[150px] text-white absolute top-[50%] translate-y-[-50%] ${
            isCalling ? "invisible" : "visible"
          }`}
        >
          <BsCameraVideoFill />
        </div>
        <div className="bg-black absolute right-0 bottom-0 translate-y-[50%] rounded-lg flex justify-center items-center">
          <video
            className=""
            id="client"
            style={{ width: 320, height: 240 }}
            autoPlay
          ></video>
          <div
            className={`text-[60px] text-white absolute z-50 ${
              localeStream ? "invisible" : "visible"
            }`}
          >
            <BsCameraVideoFill />
          </div>
        </div>
        <button
          onClick={hangUp}
          className="text-2xl bg-red-600 p-5 rounded-full absolute left-2 bottom-2"
          id="hang-up"
        >
          <BsFillTelephoneXFill />
        </button>
      </div>
    </section>
  );
};
export default VideoCall;
