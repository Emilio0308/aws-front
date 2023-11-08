import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { BsFillTelephoneXFill } from "react-icons/bs";
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
      <div id="dashboard">
        <div className="capitalize text-2xl font-medium flex items-center gap-3">
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
        className="relative  h-[520px] p-3 bg-black my-5 flex justify-center rounded-md shadow-lg shadow-black"
      >
        <video
          style={{ width: 640, height: 480 }}
          className="rounded-lg"
          id="guest"
          autoPlay
        ></video>
        <video
          className="bg-gray-600 absolute right-0 bottom-0 translate-y-[50%] rounded-lg"
          id="client"
          style={{ width: 320, height: 240 }}
          autoPlay
        ></video>
        <button
          onClick={hangUp}
          className="text-3xl bg-red-600 p-5 rounded-full absolute left-2 bottom-2"
          id="hang-up"
        >
          <BsFillTelephoneXFill />
        </button>
      </div>
    </section>
  );
};
export default VideoCall;
